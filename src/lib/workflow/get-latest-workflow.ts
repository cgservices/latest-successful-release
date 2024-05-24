import { type Octokit } from '@octokit/rest'

export const releaseWorkflowPath = '.github/workflows/ci.yml'

const headers = { 'X-GitHub-Api-Version': '2022-11-28' }

export const getLatestWorkflow = async (
  octokit: Octokit,
  options: { sha?: string } = {},
  owner: string,
  repo: string,
  workflowPath: string = releaseWorkflowPath
) => {
  const workflowRuns = await octokit.rest.actions.listWorkflowRunsForRepo({
    owner,
    repo,
    branch: 'main',
    status: 'completed',
    ...(options.sha ? { head_sha: options.sha } : undefined),
    per_page: 100,
    headers
  })

  const releaseWorkflows = workflowRuns.data.workflow_runs
    .filter(workflow => {
      return workflow.path === workflowPath
    })
    .map(workflowRun => ({
      runNumber: workflowRun.run_number,
      startedAt: workflowRun.run_started_at,
      completedAt: workflowRun.updated_at,
      path: workflowRun.path,
      runAttempt: workflowRun.run_attempt,
      status: workflowRun.status,
      conclusion: workflowRun.conclusion
    }))

  if (!releaseWorkflows.length) {
    return null
  }

  const sortedWorkflowRuns = [...releaseWorkflows].sort((a, b) =>
    a.runNumber < b.runNumber ? 1 : -1
  )

  return sortedWorkflowRuns[0]
}
