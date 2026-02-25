import { describe, it, expect } from 'vitest'
import { validateCalculatorInput } from '../validation'

describe('validateCalculatorInput', () => {
  it('returns valid for correct input (price ≤ 10 000)', () => {
    const result = validateCalculatorInput({
      price: 5000,
      commissionPercent: 10,
      deliveryType: 'kz',
      priceRange: '3000_5000',
      packaging: 0,
      costPrice: 1000,
    })
    expect(result.valid).toBe(true)
  })

  it('returns valid for correct input (price > 10 000)', () => {
    const result = validateCalculatorInput({
      price: 15000,
      commissionPercent: 12,
      deliveryType: 'express',
      weightTier: '5_15',
      packaging: 100,
      costPrice: 8000,
    })
    expect(result.valid).toBe(true)
  })

  it('returns error when price is 0', () => {
    const result = validateCalculatorInput({
      price: 0,
      commissionPercent: 10,
      deliveryType: 'kz',
      priceRange: '0_1000',
      packaging: 0,
      costPrice: 0,
    })
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.errors.some((e) => e.field === 'price')).toBe(true)
    }
  })

  it('returns error when price is negative', () => {
    const result = validateCalculatorInput({
      price: -100,
      commissionPercent: 10,
      deliveryType: 'kz',
      packaging: 0,
      costPrice: 0,
    })
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.errors.some((e) => e.field === 'price')).toBe(true)
    }
  })

  it('returns error when commission > 100', () => {
    const result = validateCalculatorInput({
      price: 1000,
      commissionPercent: 101,
      deliveryType: 'kz',
      priceRange: '0_1000',
      packaging: 0,
      costPrice: 0,
    })
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.errors.some((e) => e.field === 'commissionPercent')).toBe(true)
    }
  })

  it('returns error when price ≤ 10 000 and priceRange missing', () => {
    const result = validateCalculatorInput({
      price: 5000,
      commissionPercent: 10,
      deliveryType: 'kz',
      packaging: 0,
      costPrice: 0,
    })
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.errors.some((e) => e.field === 'priceRange')).toBe(true)
    }
  })

  it('returns error when price > 10 000 and weightTier missing', () => {
    const result = validateCalculatorInput({
      price: 15000,
      commissionPercent: 10,
      deliveryType: 'kz',
      packaging: 0,
      costPrice: 0,
    })
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.errors.some((e) => e.field === 'weightTier')).toBe(true)
    }
  })
})
