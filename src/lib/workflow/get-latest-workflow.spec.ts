import { Octokit } from '@octokit/rest'

import { getLatestWorkflow, releaseWorkflowPath } from './get-latest-workflow'
import { workflowRunFactory } from '../../test-factory/workflow-run-factory'

const mockGetWorkflowRuns = jest.fn()

jest.mock('@octokit/rest', () => ({
  Octokit: class {
    rest = {
      actions: { listWorkflowRunsForRepo: mockGetWorkflowRuns }
    }
  }
}))

const client = new Octokit({ auth: 'token' })

describe('get latest workflow', () => {
  beforeEach(jest.clearAllMocks)

  it('should return failures', async () => {
    mockGetWorkflowRuns.mockResolvedValue({
      data: {
        workflow_runs: [
          workflowRunFactory.build({
            run_number: 1,
            path: releaseWorkflowPath,
            conclusion: 'failure'
          })
        ]
      }
    })

    const latestRelease = await getLatestWorkflow(
      client,
      { sha: 'sha' },
      'owner',
      'repo',
      releaseWorkflowPath
    )

    expect(latestRelease).toMatchObject({ conclusion: 'failure' })
  })

  it('should sort workflow runs by run number', async () => {
    mockGetWorkflowRuns.mockResolvedValue({
      data: {
        workflow_runs: [
          workflowRunFactory.build({
            run_number: 1,
            path: releaseWorkflowPath,
            conclusion: 'failure'
          }),
          workflowRunFactory.build({
            run_number: 2,
            path: releaseWorkflowPath,
            conclusion: 'success'
          })
        ]
      }
    })

    const latestRelease = await getLatestWorkflow(
      client,
      { sha: 'sha' },
      'owner',
      'repo',
      releaseWorkflowPath
    )
    expect(mockGetWorkflowRuns).toHaveBeenCalledWith({
      branch: 'main',
      head_sha: 'sha',
      headers: { 'X-GitHub-Api-Version': '2022-11-28' },
      owner: 'owner',
      per_page: 100,
      repo: 'repo',
      status: 'completed'
    })
    expect(latestRelease).toMatchObject({ runNumber: 2 })
  })

  it('should run when sha missing', async () => {
    mockGetWorkflowRuns.mockResolvedValue({
      data: {
        workflow_runs: [
          workflowRunFactory.build({
            run_number: 1,
            path: releaseWorkflowPath,
            conclusion: 'failure'
          }),
          workflowRunFactory.build({
            run_number: 2,
            path: releaseWorkflowPath,
            conclusion: 'success'
          })
        ]
      }
    })

    await getLatestWorkflow(client, {}, 'owner', 'repo', releaseWorkflowPath)
    expect(mockGetWorkflowRuns).toHaveBeenCalledWith({
      branch: 'main',
      undefined,
      headers: { 'X-GitHub-Api-Version': '2022-11-28' },
      owner: 'owner',
      per_page: 100,
      repo: 'repo',
      status: 'completed'
    })
  })

  it('should return null when workflow is not found', async () => {
    mockGetWorkflowRuns.mockResolvedValue({
      data: {
        workflow_runs: []
      }
    })

    const latestRelease = await getLatestWorkflow(client, {}, 'owner', 'repo')
    expect(latestRelease).toBeNull()
  })
})
