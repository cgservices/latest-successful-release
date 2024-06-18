import { Sync } from 'factory.ts'

export const workflowRunFactory = Sync.makeFactory({
  run_number: 1,
  path: '.github/workflows/release.yml',
  conclusion: 'success',
  status: 'completed'
})
