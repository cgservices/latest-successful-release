import { getLatestSuccessfulRelease } from './main'

import { Command } from '@commander-js/extra-typings'
import { writeFileSync } from 'fs'

const program = new Command().option('--jsonOutputFilename <string>')

program.parse()

const options = program.opts()

const { jsonOutputFilename = '/tmp/latest-successful-release.txt' } = options

getLatestSuccessfulRelease()
  .then(latestSuccessfulRelease => {
    console.log(
      `Latest successful release: ${JSON.stringify(latestSuccessfulRelease)}`
    )

    writeFileSync(jsonOutputFilename, latestSuccessfulRelease.sha)
  })
  .catch(error => {
    console.warn(`Unable to get latest successful release: ${error.message}`)
    writeFileSync(jsonOutputFilename, '')
  })
