/** Delivery type: Kazakhstan (intercity) or Express (within city) */
export type DeliveryType = 'kz' | 'express'

/** Price range for orders up to 10 000 ₸ */
export type PriceRange = '0_1000' | '1000_3000' | '3000_5000' | '5000_10000'

/** Weight tier for orders above 10 000 ₸ */
export type WeightTier =
  | '0_5'
  | '5_15'
  | '15_30'
  | '30_60'
  | '60_100'
  | '100_plus'

/** Calculator form input */
export interface CalculatorInput {
  /** Selling price on Kaspi (₸), must be > 0 */
  price: number
  /** Commission percent (0–100) */
  commissionPercent: number
  /** Delivery type */
  deliveryType: DeliveryType
  /** Required when price ≤ 10 000 */
  priceRange?: PriceRange
  /** Required when price > 10 000 */
  weightTier?: WeightTier
  /** Packaging cost (₸), ≥ 0 */
  packaging: number
  /** Cost price (₸), ≥ 0 */
  costPrice: number
}

/** Result of profit calculation */
export interface CalculatorResult {
  commissionAmount: number
  deliveryAmount: number
  packaging: number
  costPrice: number
  profit: number
  totalDeductions: number
}
