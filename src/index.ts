import { getLatestSuccessfulRelease } from './main'
import { setOutput, info } from '@actions/core'

getLatestSuccessfulRelease()
  .then(latestSuccessfulRelease => {
    info('SUCCESS: Output to the actions build log')
    const output = setOutput(
      'latest-successful-release',
      JSON.stringify(latestSuccessfulRelease)
    )
    console.log(output)
  })
  .catch(error => {
    console.warn(`Unable to get latest successful release: ${error.message}`)
    setOutput(
      'Unable to get latest successful release',
      JSON.stringify(error.message)
    )
  })
