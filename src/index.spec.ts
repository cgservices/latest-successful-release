import * as main from './main'

// const runMock = jest.spyOn(main, 'getLatestSuccessfulRelease').mockResolvedValue({ runNumber: 1 })

// describe('index', () => {
//   it('calls run when imported', async () => {
//     // eslint-disable-next-line @typescript-eslint/no-require-imports
//     require('../src/index')

//     expect(runMock).toHaveBeenCalled()
//   })
// })
describe.skip('index', () => {
  it('should set default jsonOutputFilename', () => {
    const options: { jsonOutputFilename?: string } = {}
    require('../src/index')
    expect(options.jsonOutputFilename).toBe(
      '/tmp/latest-successful-release.txt'
    )
  })

  it('should override jsonOutputFilename', () => {
    const options: { jsonOutputFilename?: string } = {
      jsonOutputFilename: '/path/to/output.txt'
    }
    require('../src/index')
    expect(options.jsonOutputFilename).toBe('/path/to/output.txt')
  })
})
