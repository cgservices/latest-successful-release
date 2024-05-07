import { getLatestSuccessfulRelease } from './main'

import { releaseWorkflowPath } from './lib/workflow/get-latest-workflow'
import { commitFactory } from './test-factory/commit-factory'
import { workflowRunFactory } from './test-factory/workflow-run-factory'

const mockGetCommits = jest.fn()
const mockGetWorkflowRuns = jest.fn()

jest.mock('@octokit/rest', () => ({
  Octokit: class {
    rest = {
      repos: {
        listCommits: mockGetCommits
      },
      actions: { listWorkflowRunsForRepo: mockGetWorkflowRuns }
    }
  }
}))

jest.mock('@actions/core', () => ({
  getInput: jest.fn((name: string) => {
    if (name === 'github-token') return 'token'
    if (name === 'github-repo') return 'repo'
    if (name === 'github-repo-owner') return 'owner'
    if (name === 'release-workflow-path') return '.github/workflows/ci.yml'
  })
}))

describe.skip('get latest successful release', () => {
  beforeEach(jest.clearAllMocks)

  it('should get the latest release', async () => {
    mockGetCommits.mockResolvedValue({
      data: [
        commitFactory.build({
          sha: 'sha-1',
          commit: { author: { date: new Date('01-02-2024') } }
        }),
        commitFactory.build({
          sha: 'sha-2',
          commit: { author: { date: new Date('01-01-2024') } }
        }),
        commitFactory.build({ sha: 'sha-3', commit: { author: undefined } })
      ]
    })
    mockGetWorkflowRuns.mockResolvedValue({
      data: {
        workflow_runs: [workflowRunFactory.build({ path: releaseWorkflowPath })]
      }
    })

    const latestRelease = await getLatestSuccessfulRelease()

    expect(latestRelease).toMatchObject({ sha: 'sha-1' })
  })

  it('should sort workflows by run number', async () => {
    mockGetCommits.mockResolvedValue({
      data: [
        commitFactory.build({ sha: 'sha-1', commit: { author: undefined } })
      ]
    })
    mockGetWorkflowRuns.mockResolvedValue({
      data: {
        workflow_runs: [
          workflowRunFactory.build({
            path: releaseWorkflowPath,
            run_number: 1,
            conclusion: 'failure'
          }),
          workflowRunFactory.build({
            path: releaseWorkflowPath,
            run_number: 2,
            conclusion: 'success'
          })
        ]
      }
    })

    const latestRelease = await getLatestSuccessfulRelease()

    expect(latestRelease).toMatchObject({ sha: 'sha-1' })
  })

  it('should sort commits', async () => {
    mockGetCommits.mockResolvedValue({
      data: [
        commitFactory.build({
          sha: 'sha-1',
          commit: { author: { date: new Date('01-01-2024') } }
        }),
        commitFactory.build({
          sha: 'sha-2',
          commit: { author: { date: new Date('01-02-2024') } }
        })
      ]
    })
    mockGetWorkflowRuns.mockResolvedValue({
      data: {
        workflow_runs: [
          workflowRunFactory.build({
            path: releaseWorkflowPath,
            run_number: 2
          }),
          workflowRunFactory.build({
            path: releaseWorkflowPath,
            run_number: 1
          })
        ]
      }
    })

    const latestRelease = await getLatestSuccessfulRelease()

    expect(latestRelease).toMatchObject({ sha: 'sha-2' })
  })

  it('should throw an error when no successful workflow is found', async () => {
    mockGetCommits.mockResolvedValue({
      data: [commitFactory.build({ sha: 'sha-1' })]
    })
    mockGetWorkflowRuns.mockResolvedValue({
      data: {
        workflow_runs: [
          workflowRunFactory.build({
            conclusion: 'skipped',
            path: releaseWorkflowPath
          })
        ]
      }
    })

    const result = getLatestSuccessfulRelease()

    await expect(result).rejects.toEqual(
      new Error('Unable to find latest successful release')
    )
  })

  it('should return undefined when no workflows are found', async () => {
    mockGetCommits.mockResolvedValue({
      data: [commitFactory.build({ sha: 'sha-1' })]
    })
    mockGetWorkflowRuns.mockResolvedValue({
      data: {
        workflow_runs: []
      }
    })

    const result = getLatestSuccessfulRelease()

    await expect(result).rejects.toEqual(
      new Error('Unable to find latest successful release')
    )
  })
})
