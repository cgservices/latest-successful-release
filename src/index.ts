import { getLatestSuccessfulRelease } from './main'
import { setOutput } from '@actions/core'

// import { Command } from '@commander-js/extra-typings'
import { writeFileSync } from 'fs'

// const program = new Command().option('--jsonOutputFilename <string>')
// setOutput('jsonOutputFilename', program.opts().jsonOutputFilename)
// program.parse()

// const options = program.opts()

// const { jsonOutputFilename = '/tmp/latest-successful-release.txt' } = options

getLatestSuccessfulRelease()
  .then(latestSuccessfulRelease => {
    console.log(
      `Latest successful release: ${JSON.stringify(latestSuccessfulRelease)}`
    )
    setOutput(
      'latestSuccessfulRelease',
      JSON.stringify(latestSuccessfulRelease)
    )
    // writeFileSync(jsonOutputFilename, latestSuccessfulRelease.sha)
  })
  .catch(error => {
    console.warn(`Unable to get latest successful release: ${error.message}`)
    setOutput(
      'Unable to get latest successful release',
      JSON.stringify(error.message)
    )
    // writeFileSync(jsonOutputFilename, '')
  })
