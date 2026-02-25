import { describe, it, expect } from 'vitest'
import { formatCurrency } from '../format'

describe('formatCurrency', () => {
  it('formats integer as KZT with thousands separator and ₸', () => {
    expect(formatCurrency(1000)).toMatch(/1[\s\u202f]000 ₸/)
    expect(formatCurrency(50000)).toMatch(/50[\s\u202f]000 ₸/)
    expect(formatCurrency(1000)).toContain('₸')
  })

  it('formats decimal with up to 2 fraction digits', () => {
    expect(formatCurrency(1234.5)).toMatch(/1[\s\u202f]234,5 ₸/)
    expect(formatCurrency(99.99)).toContain('99,99')
    expect(formatCurrency(99.99)).toContain('₸')
  })
})
