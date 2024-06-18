import { getLatestSuccessfulRelease } from './main'
import { setOutput, info } from '@actions/core'

export const run = async () => {
  try {
    const latestRelease = await getLatestSuccessfulRelease()
    info(
      `Found latest successful release, setting output ${JSON.stringify(latestRelease.sha)}`
    )
    setOutput('commit-sha', JSON.stringify(latestRelease.sha))
  } catch (error) {
    const errorMessage = "Couldn't find latest successful release"
    info(errorMessage)
    setOutput('error', JSON.stringify(errorMessage))
  }
}

run()
