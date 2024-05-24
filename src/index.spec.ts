const mockGetLatestSuccessfulRelease = jest.fn()
const mockSetOutput = jest.fn()
const mockInfo = jest.fn()

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

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    await require('../src/index')

    expect(mockGetLatestSuccessfulRelease).toHaveBeenCalled()
    expect(mockInfo).toHaveBeenCalledWith('Found latest successful release')
    expect(mockSetOutput).toHaveBeenCalledWith(
      'commit-sha',
      JSON.stringify(mockLatestSuccessfulRelease.sha)
    )
  })
})
