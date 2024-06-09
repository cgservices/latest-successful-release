const mockGetLatestSuccessfulRelease = jest.fn()
const mockSetOutput = jest.fn()
const mockInfo = jest.fn()

import { run } from './index'

jest.mock('./main', () => ({
  getLatestSuccessfulRelease: mockGetLatestSuccessfulRelease
}))
jest.mock('@actions/core', () => ({
  setOutput: mockSetOutput,
  info: mockInfo
}))

describe('index', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockGetLatestSuccessfulRelease.mockClear()
  })

  it('should set the commit-sha output when getLatestSuccessfulRelease resolves', async () => {
    const mockLatestSuccessfulRelease = { sha: 'abc123' }

    mockGetLatestSuccessfulRelease.mockResolvedValue(
      mockLatestSuccessfulRelease
    )

    await run()

    expect(mockGetLatestSuccessfulRelease).toHaveBeenCalled()
    expect(mockInfo).toHaveBeenCalledWith('Found latest successful release')
    expect(mockSetOutput).toHaveBeenCalledWith(
      'commit-sha',
      JSON.stringify(mockLatestSuccessfulRelease.sha)
    )
  })

  it('should handle errors', async () => {
    const error = new Error("Couldn't find latest successful release")
    mockGetLatestSuccessfulRelease.mockRejectedValue(error)

    await run()

    expect(mockInfo).toHaveBeenCalledWith(
      "Couldn't find latest successful release"
    )
    expect(mockSetOutput).toHaveBeenCalledWith(
      'error',
      JSON.stringify("Couldn't find latest successful release")
    )
  })
})
