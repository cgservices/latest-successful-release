import { truthy } from './truthy'

describe('truthy', () => {
  it('should remove falsy entries from array', () => {
    expect([1, 3, 0, null, undefined].filter(truthy)).toEqual([1, 3])
  })
})
