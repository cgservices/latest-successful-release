import { Sync } from 'factory.ts'

export const commitFactory = Sync.makeFactory({
  sha: 'sha-1',
  html_url: '',
  commit: {
    message: '',
    author: { date: new Date() }
  }
})
