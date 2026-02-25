import { describe, it, expect } from 'vitest'
import { calculate } from '../calculatorLogic'

describe('calculatorLogic', () => {
  it('returns an object', () => {
    expect(calculate()).toEqual({})
  })
})
