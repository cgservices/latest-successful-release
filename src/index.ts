import { getLatestSuccessfulRelease } from './main'
import { setOutput, info, warning } from '@actions/core'

getLatestSuccessfulRelease()
  .then(latestSuccessfulRelease => {
    info('Found latest successful release')
    setOutput('commit-sha', JSON.stringify(latestSuccessfulRelease.sha))
  })
  .catch(error => {
    warning('Unable to get latest successful release')
    setOutput('error', JSON.stringify(error.message))
  })
