import { describe, it, expect } from 'vitest'
import {
  calculate,
  getCommissionAmount,
  getDeliveryAmount,
  getDeliveryTariff,
  getDeliveryVat,
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

describe('getDeliveryTariff', () => {
  it('uses official tariffs by price range when price ≤ 10 000', () => {
    expect(
      getDeliveryTariff({
        ...baseInput,
        price: 500,
        priceRange: '0_1000',
        weightTier: undefined,
      })
    ).toBe(49.14)
    expect(
      getDeliveryTariff({
        ...baseInput,
        price: 2000,
        priceRange: '1000_3000',
        weightTier: undefined,
      })
    ).toBe(149.14)
    expect(
      getDeliveryTariff({
        ...baseInput,
        price: 4000,
        priceRange: '3000_5000',
        deliveryType: 'express',
        weightTier: undefined,
      })
    ).toBe(199.14)
    expect(
      getDeliveryTariff({
        ...baseInput,
        price: 8000,
        priceRange: '5000_10000',
        deliveryType: 'kz',
        weightTier: undefined,
      })
    ).toBe(699.14)
    expect(
      getDeliveryTariff({
        ...baseInput,
        price: 8000,
        priceRange: '5000_10000',
        deliveryType: 'express',
        weightTier: undefined,
      })
    ).toBe(799.14)
  })

  it('uses official tariffs by weight when price > 10 000', () => {
    expect(
      getDeliveryTariff({
        ...baseInput,
        price: 15000,
        priceRange: undefined,
        weightTier: '0_5',
        deliveryType: 'kz',
      })
    ).toBe(1099.14)
    expect(
      getDeliveryTariff({
        ...baseInput,
        price: 15000,
        priceRange: undefined,
        weightTier: '0_5',
        deliveryType: 'express',
      })
    ).toBe(1299.14)
    expect(
      getDeliveryTariff({
        ...baseInput,
        price: 20000,
        priceRange: undefined,
        weightTier: '15_30',
        deliveryType: 'express',
      })
    ).toBe(3599.14)
    expect(
      getDeliveryTariff({
        ...baseInput,
        price: 20000,
        priceRange: undefined,
        weightTier: '15_30',
        deliveryType: 'kz',
      })
    ).toBe(2299.14)
  })

  it('returns 0 when price ≤ 10 000 and priceRange not set', () => {
    expect(
      getDeliveryTariff({
        ...baseInput,
        price: 5000,
        priceRange: undefined,
        weightTier: undefined,
      })
    ).toBe(0)
  })

  it('returns 0 when price > 10 000 and weightTier not set', () => {
    expect(
      getDeliveryTariff({
        ...baseInput,
        price: 15000,
        priceRange: undefined,
        weightTier: undefined,
      })
    ).toBe(0)
  })
})

describe('getDeliveryVat', () => {
  it('computes 16% VAT on tariff, rounded to 2 decimals', () => {
    expect(getDeliveryVat(199.14)).toBe(31.86)
    expect(getDeliveryVat(49.14)).toBe(7.86)
    expect(getDeliveryVat(0)).toBe(0)
  })
})

describe('getDeliveryAmount', () => {
  it('returns tariff + VAT (total delivery cost)', () => {
    const input = {
      ...baseInput,
      price: 4000,
      priceRange: '3000_5000' as const,
      deliveryType: 'express' as const,
      weightTier: undefined,
    }
    const tariff = getDeliveryTariff(input)
    const vat = getDeliveryVat(tariff)
    expect(getDeliveryAmount(input)).toBe(Math.round((tariff + vat) * 100) / 100)
    expect(getDeliveryAmount(input)).toBe(231) // 199.14 + 31.86
  })

  it('returns 0 when no range/weight', () => {
    expect(
      getDeliveryAmount({
        ...baseInput,
        price: 5000,
        priceRange: undefined,
        weightTier: undefined,
      })
    ).toBe(0)
  })
})

describe('calculate', () => {
  it('returns full result with commission, delivery (tariff + VAT), profit, margin', () => {
    const result = calculate(baseInput)
    expect(result.commissionAmount).toBe(500)
    expect(result.deliveryTariff).toBe(199.14)
    expect(result.deliveryVat).toBe(31.86)
    expect(result.deliveryAmount).toBe(231)
    expect(result.packaging).toBe(100)
    expect(result.costPrice).toBe(3000)
    // 5000 - 500 - 231 - 100 - 3000 = 1169
    expect(result.profit).toBe(1169)
    expect(result.totalDeductions).toBe(831) // 500 + 231 + 100
    expect(result.marginPercent).toBe(23.4) // (1169.01/5000)*100 ≈ 23.38 → 23.4
  })

  it('matches ProKaspi example: 6000 ₸, 8%, Express, 3000–5000, упаковка 200, себестоимость 4000', () => {
    const input: CalculatorInput = {
      price: 6000,
      commissionPercent: 8,
      deliveryType: 'express',
      priceRange: '3000_5000',
      packaging: 200,
      costPrice: 4000,
    }
    const result = calculate(input)
    expect(result.commissionAmount).toBe(480) // 8% of 6000
    expect(result.deliveryTariff).toBe(199.14)
    expect(result.deliveryVat).toBe(31.86)
    expect(result.deliveryAmount).toBe(231)
    expect(result.packaging).toBe(200)
    expect(result.costPrice).toBe(4000)
    // 6000 - 480 - 231 - 200 - 4000 = 1089
    expect(result.profit).toBe(1089)
    expect(result.totalDeductions).toBe(911)
    expect(result.marginPercent).toBe(18.2)
  })

  it('matches ProKaspi screenshot: same inputs but costPrice 40 000 (loss)', () => {
    const input: CalculatorInput = {
      price: 6000,
      commissionPercent: 8,
      deliveryType: 'express',
      priceRange: '3000_5000',
      packaging: 200,
      costPrice: 40000,
    }
    const result = calculate(input)
    expect(result.commissionAmount).toBe(480)
    expect(result.deliveryTariff).toBe(199.14)
    expect(result.deliveryVat).toBe(31.86)
    expect(result.deliveryAmount).toBe(231)
    expect(result.costPrice).toBe(40000)
    // 6000 - 480 - 231 - 200 - 40000 = -34911
    expect(result.profit).toBe(-34911)
    expect(result.marginPercent).toBe(-581.8)
  })

  it('allows zero packaging and cost', () => {
    const result = calculate({
      ...baseInput,
      packaging: 0,
      costPrice: 0,
    })
    expect(result.packaging).toBe(0)
    expect(result.costPrice).toBe(0)
    // 5000 - 500 - 231 = 4269
    expect(result.profit).toBe(4269)
    expect(result.marginPercent).toBe(85.4)
  })

  it('allows negative profit (loss) and negative margin', () => {
    const result = calculate({
      ...baseInput,
      costPrice: 5000,
    })
    expect(result.profit).toBe(-831) // 5000 - 500 - 231 - 100 - 5000
    expect(result.marginPercent).toBe(-16.6)
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
    expect(result.deliveryTariff).toBe(49.14)
    expect(result.deliveryVat).toBe(7.86)
    expect(result.profit).toBe(609.7) // 1000 - 333.3 - 49.14 - 7.86
  })

  it('uses delivery 0 when range not provided for price ≤ 10 000', () => {
    const result = calculate({
      ...baseInput,
      price: 5000,
      priceRange: undefined,
      weightTier: undefined,
    })
    expect(result.deliveryTariff).toBe(0)
    expect(result.deliveryVat).toBe(0)
    expect(result.deliveryAmount).toBe(0)
    expect(result.profit).toBe(1400) // 5000 - 500 - 0 - 100 - 3000
    expect(result.marginPercent).toBe(28)
  })

  it('uses delivery by weight when price > 10 000', () => {
    const input = {
      ...baseInput,
      price: 25000,
      priceRange: undefined,
      weightTier: '5_15' as const,
      deliveryType: 'kz' as const,
      packaging: 200,
      costPrice: 15000,
    }
    expect(getDeliveryTariff(input)).toBe(1349.14)
    const result = calculate(input)
    expect(result.deliveryTariff).toBe(1349.14)
    expect(result.deliveryVat).toBe(215.86)
    expect(result.deliveryAmount).toBe(1565)
    expect(result.commissionAmount).toBe(2500)
    // 25000 - 2500 - 1565 - 200 - 15000 = 5735
    expect(result.profit).toBe(5735)
    expect(result.marginPercent).toBe(22.9)
  })
})
