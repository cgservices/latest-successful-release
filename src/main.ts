import * as core from '@actions/core'
import { isBefore } from 'date-fns'
import { truthy } from './lib/utils/truthy'
import { getLatestWorkflow } from './lib/workflow/get-latest-workflow'
import { Octokit } from '@octokit/rest'

const headers = { 'X-GitHub-Api-Version': '2022-11-28' }
const GITHUB_TOKEN = core.getInput('github-token')
const REPO = core.getInput('github-repo')
const REPO_OWNER = core.getInput('github-repo-owner')
const RELEASE_WORKFLOW_PATH = core.getInput('release-workflow-path')

const getCommits = async (octokit: Octokit) => {
  const { data } = await octokit.rest.repos.listCommits({
    owner: REPO_OWNER,
    repo: REPO,
    per_page: 20,
    headers
  })
  return data.map(commit => ({
    message: commit.commit.message.substring(0, 50),
    htmlUrl: commit.html_url,
    sha: commit.sha,
    commitDate: commit.commit.author?.date || new Date(0)
  }))
}

export const run = async () => {
  const octokit = new Octokit({
    auth: GITHUB_TOKEN
  })

  const commits = await getCommits(octokit)

  const commitStatus = await Promise.all(
    commits.map(async commit => {
      
      const workflowRun = await getLatestWorkflow(
        octokit,
        { sha: commit.sha },
        REPO_OWNER,
        REPO,
        RELEASE_WORKFLOW_PATH
      )
      return { ...commit, ...workflowRun }
    })
  )

  const sortedReleases = [...commitStatus.filter(truthy)].sort((a, b) =>
    isBefore(new Date(a.commitDate), new Date(b.commitDate)) ? 1 : -1
  )
  const latestSuccessRelease = sortedReleases.find(
    ({ status, conclusion }) =>
      status === 'completed' && conclusion === 'success'
  )

  if (!latestSuccessRelease) {
    throw new Error(`Unable to find latest successful release`)
  }

  return latestSuccessRelease
}
