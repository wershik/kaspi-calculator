import { describe, it, expect } from 'vitest'
import {
  calculate,
  getCommissionAmount,
  getDeliveryAmount,
} from '../calculatorLogic'
import type { CalculatorInput } from '../types'

const baseInput: CalculatorInput = {
  price: 5000,
  commissionPercent: 10,
  deliveryType: 'kz',
  priceRange: '3000_5000',
  packaging: 100,
  costPrice: 3000,
}

describe('getCommissionAmount', () => {
  it('computes commission from price and percent', () => {
    expect(getCommissionAmount(1000, 10)).toBe(100)
    expect(getCommissionAmount(5000, 12.5)).toBe(625)
  })

  it('returns 0 when commission is 0', () => {
    expect(getCommissionAmount(1000, 0)).toBe(0)
  })

  it('returns full price when commission is 100', () => {
    expect(getCommissionAmount(1000, 100)).toBe(1000)
  })

  it('rounds to 2 decimal places', () => {
    expect(getCommissionAmount(100, 33.33)).toBe(33.33)
  })
})

describe('getDeliveryAmount', () => {
  it('uses price range when price ≤ 10 000', () => {
    expect(
      getDeliveryAmount({
        ...baseInput,
        price: 2000,
        priceRange: '1000_3000',
        weightTier: undefined,
      })
    ).toBe(399)
    expect(
      getDeliveryAmount({
        ...baseInput,
        price: 8000,
        priceRange: '5000_10000',
        deliveryType: 'express',
        weightTier: undefined,
      })
    ).toBe(799)
  })

  it('uses weight tier when price > 10 000', () => {
    expect(
      getDeliveryAmount({
        ...baseInput,
        price: 15000,
        priceRange: undefined,
        weightTier: '0_5',
      })
    ).toBe(799)
    expect(
      getDeliveryAmount({
        ...baseInput,
        price: 20000,
        priceRange: undefined,
        weightTier: '15_30',
        deliveryType: 'express',
      })
    ).toBe(2299)
  })

  it('returns 0 when price ≤ 10 000 and priceRange not set', () => {
    expect(
      getDeliveryAmount({
        ...baseInput,
        price: 5000,
        priceRange: undefined,
        weightTier: undefined,
      })
    ).toBe(0)
  })

  it('returns 0 when price > 10 000 and weightTier not set', () => {
    expect(
      getDeliveryAmount({
        ...baseInput,
        price: 15000,
        priceRange: undefined,
        weightTier: undefined,
      })
    ).toBe(0)
  })

  it('returns 0 for price range 0_1000', () => {
    expect(
      getDeliveryAmount({
        ...baseInput,
        price: 500,
        priceRange: '0_1000',
        weightTier: undefined,
      })
    ).toBe(0)
  })
})

describe('calculate', () => {
  it('returns full result with commission, delivery, profit', () => {
    const result = calculate(baseInput)
    expect(result.commissionAmount).toBe(500)
    expect(result.deliveryAmount).toBe(599)
    expect(result.packaging).toBe(100)
    expect(result.costPrice).toBe(3000)
    expect(result.profit).toBe(801) // 5000 - 500 - 599 - 100 - 3000
    expect(result.totalDeductions).toBe(1199)
  })

  it('allows zero packaging and cost', () => {
    const result = calculate({
      ...baseInput,
      packaging: 0,
      costPrice: 0,
    })
    expect(result.packaging).toBe(0)
    expect(result.costPrice).toBe(0)
    expect(result.profit).toBe(3901) // 5000 - 500 - 599
  })

  it('allows negative profit (loss)', () => {
    const result = calculate({
      ...baseInput,
      costPrice: 5000,
    })
    expect(result.profit).toBe(-1199)
  })

  it('rounds profit and totalDeductions to 2 decimals', () => {
    const result = calculate({
      price: 1000,
      commissionPercent: 33.33,
      deliveryType: 'kz',
      priceRange: '0_1000',
      packaging: 0,
      costPrice: 0,
    })
    expect(result.commissionAmount).toBe(333.3)
    expect(result.profit).toBe(666.7)
  })

  it('uses delivery 0 when range not provided for price ≤ 10 000', () => {
    const result = calculate({
      ...baseInput,
      price: 5000,
      priceRange: undefined,
      weightTier: undefined,
    })
    expect(result.deliveryAmount).toBe(0)
    expect(result.profit).toBe(1400) // 5000 - 500 - 0 - 100 - 3000
  })

  it('uses delivery by weight when price > 10 000', () => {
    const result = calculate({
      ...baseInput,
      price: 25000,
      priceRange: undefined,
      weightTier: '5_15',
      packaging: 200,
      costPrice: 15000,
    })
    expect(result.deliveryAmount).toBe(999)
    expect(result.commissionAmount).toBe(2500)
    expect(result.profit).toBe(6301) // 25000 - 2500 - 999 - 200 - 15000
  })
})
