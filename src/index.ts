import { getLatestSuccessfulRelease } from './main'
import { setOutput, info } from '@actions/core'

getLatestSuccessfulRelease()
  .then(latestSuccessfulRelease => {
    info('Found latest successful release')
    setOutput('commit-sha', JSON.stringify(latestSuccessfulRelease.sha))
  })
  .catch(error => {
    info(error)
    setOutput('error', JSON.stringify(error.message))
  })
