import { getLatestSuccessfulRelease } from './main'
import { setOutput } from '@actions/core'

getLatestSuccessfulRelease()
  .then(latestSuccessfulRelease => {
    console.log(
      `Latest successful release: ${JSON.stringify(latestSuccessfulRelease)}`
    )
    setOutput(
      'latestSuccessfulRelease',
      JSON.stringify(latestSuccessfulRelease)
    )
  })
  .catch(error => {
    console.warn(`Unable to get latest successful release: ${error.message}`)
    setOutput(
      'Unable to get latest successful release',
      JSON.stringify(error.message)
    )
  })
