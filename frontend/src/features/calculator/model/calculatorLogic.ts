import type { CalculatorInput, CalculatorResult, DeliveryType, PriceRange, WeightTier } from './types'

const PRICE_THRESHOLD = 10_000

/** Round to 2 decimal places */
function round2(x: number): number {
  return Math.round(x * 100) / 100
}

/**
 * Delivery tariffs for price ≤ 10 000 ₸ by price range and delivery type.
 * Values in ₸ (approximate; update from Kaspi when needed).
 */
const DELIVERY_BY_PRICE_RANGE: Record<DeliveryType, Record<PriceRange, number>> = {
  kz: { '0_1000': 0, '1000_3000': 399, '3000_5000': 599, '5000_10000': 799 },
  express: { '0_1000': 0, '1000_3000': 499, '3000_5000': 699, '5000_10000': 799 },
}

/**
 * Delivery tariffs for price > 10 000 ₸ by weight tier and delivery type.
 * Values in ₸ (approximate; update from Kaspi when needed).
 */
const DELIVERY_BY_WEIGHT: Record<DeliveryType, Record<WeightTier, number>> = {
  kz: {
    '0_5': 799,
    '5_15': 999,
    '15_30': 2299,
    '30_60': 3599,
    '60_100': 4999,
    '100_plus': 6499,
  },
  express: {
    '0_5': 799,
    '5_15': 999,
    '15_30': 2299,
    '30_60': 3599,
    '60_100': 4999,
    '100_plus': 6499,
  },
}

/**
 * Get delivery amount (₸) from input. Uses price range when price ≤ 10 000,
 * weight tier when price > 10 000. Returns 0 if range/weight not provided.
 */
export function getDeliveryAmount(input: CalculatorInput): number {
  const { price, deliveryType, priceRange, weightTier } = input
  if (price <= PRICE_THRESHOLD) {
    if (!priceRange) return 0
    return DELIVERY_BY_PRICE_RANGE[deliveryType][priceRange]
  }
  if (!weightTier) return 0
  return DELIVERY_BY_WEIGHT[deliveryType][weightTier]
}

/**
 * Compute commission amount from price and percent.
 */
export function getCommissionAmount(price: number, commissionPercent: number): number {
  return round2(price * (commissionPercent / 100))
}

/**
 * Calculate profit and all result fields. Assumes input is valid (price > 0,
 * commission 0–100, packaging ≥ 0, costPrice ≥ 0). Uses delivery = 0 when
 * range/weight not selected per spec.
 */
export function calculate(input: CalculatorInput): CalculatorResult {
  const commissionAmount = getCommissionAmount(input.price, input.commissionPercent)
  const deliveryAmount = getDeliveryAmount(input)
  const totalDeductions = round2(commissionAmount + deliveryAmount + input.packaging)
  const profit = round2(
    input.price - commissionAmount - deliveryAmount - input.packaging - input.costPrice
  )
  return {
    commissionAmount,
    deliveryAmount,
    packaging: input.packaging,
    costPrice: input.costPrice,
    profit,
    totalDeductions,
  }
}
