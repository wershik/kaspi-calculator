import type { CalculatorInput, CalculatorResult, DeliveryType, PriceRange, WeightTier } from './types'

const PRICE_THRESHOLD = 10_000
const DELIVERY_VAT_RATE = 0.16

/** Round to 2 decimal places */
function round2(x: number): number {
  return Math.round(x * 100) / 100
}

/** Round to 1 decimal place */
function round1(x: number): number {
  return Math.round(x * 10) / 10
}

/**
 * Delivery tariffs for price ≤ 10 000 ₸ (without VAT).
 * Source: Kaspi Гид, effective 01.01.2026.
 */
const DELIVERY_BY_PRICE_RANGE: Record<DeliveryType, Record<PriceRange, number>> = {
  kz: {
    '0_1000': 49.14,
    '1000_3000': 149.14,
    '3000_5000': 199.14,
    '5000_10000': 699.14,
  },
  express: {
    '0_1000': 49.14,
    '1000_3000': 149.14,
    '3000_5000': 199.14,
    '5000_10000': 799.14,
  },
}

/**
 * Delivery tariffs for price > 10 000 ₸ by weight (without VAT).
 * Source: Kaspi Гид, effective 01.01.2026.
 */
const DELIVERY_BY_WEIGHT: Record<DeliveryType, Record<WeightTier, number>> = {
  kz: {
    '0_5': 1099.14,
    '5_15': 1349.14,
    '15_30': 2299.14,
    '30_60': 2899.14,
    '60_100': 4149.14,
    '100_plus': 6449.14,
  },
  express: {
    '0_5': 1299.14,
    '5_15': 1699.14,
    '15_30': 3599.14,
    '30_60': 5649.14,
    '60_100': 8549.14,
    '100_plus': 11999.14,
  },
}

/**
 * Get delivery tariff (₸) without VAT. Uses price range when price ≤ 10 000,
 * weight tier when price > 10 000. Returns 0 if range/weight not provided.
 */
export function getDeliveryTariff(input: CalculatorInput): number {
  const { price, deliveryType, priceRange, weightTier } = input
  if (price <= PRICE_THRESHOLD) {
    if (!priceRange) return 0
    return DELIVERY_BY_PRICE_RANGE[deliveryType][priceRange]
  }
  if (!weightTier) return 0
  return DELIVERY_BY_WEIGHT[deliveryType][weightTier]
}

/**
 * VAT on delivery (16%). Rounded to 2 decimals.
 */
export function getDeliveryVat(deliveryTariff: number): number {
  return round2(deliveryTariff * DELIVERY_VAT_RATE)
}

/**
 * Total delivery cost (tariff + VAT). For backward compatibility.
 */
export function getDeliveryAmount(input: CalculatorInput): number {
  const tariff = getDeliveryTariff(input)
  const vat = getDeliveryVat(tariff)
  return round2(tariff + vat)
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
 * range/weight not selected per spec. Delivery is tariff + 16% VAT.
 */
export function calculate(input: CalculatorInput): CalculatorResult {
  const commissionAmount = getCommissionAmount(input.price, input.commissionPercent)
  const deliveryTariff = getDeliveryTariff(input)
  const deliveryVat = getDeliveryVat(deliveryTariff)
  const deliveryAmount = round2(deliveryTariff + deliveryVat)
  const totalDeductions = round2(commissionAmount + deliveryAmount + input.packaging)
  const profit = round2(
    input.price - commissionAmount - deliveryAmount - input.packaging - input.costPrice
  )
  const marginPercent =
    input.price !== 0 ? round1((profit / input.price) * 100) : 0
  return {
    commissionAmount,
    deliveryTariff,
    deliveryVat,
    deliveryAmount,
    packaging: input.packaging,
    costPrice: input.costPrice,
    profit,
    totalDeductions,
    marginPercent,
  }
}
