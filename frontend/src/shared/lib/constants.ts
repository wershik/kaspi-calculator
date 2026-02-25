import type { DeliveryType, PriceRange, WeightTier } from '../../features/calculator/model/types'

export const DELIVERY_OPTIONS: { value: DeliveryType; label: string }[] = [
  { value: 'kz', label: 'Казахстан (Межгород)' },
  { value: 'express', label: 'Express (Внутри города)' },
]

export const PRICE_RANGE_OPTIONS: { value: PriceRange; label: string }[] = [
  { value: '0_1000', label: 'До 1 000 ₸' },
  { value: '1000_3000', label: '1 000 – 3 000 ₸' },
  { value: '3000_5000', label: '3 000 – 5 000 ₸' },
  { value: '5000_10000', label: '5 000 – 10 000 ₸' },
]

export const WEIGHT_TIER_OPTIONS: { value: WeightTier; label: string }[] = [
  { value: '0_5', label: 'До 5 кг' },
  { value: '5_15', label: '5 – 15 кг' },
  { value: '15_30', label: '15 – 30 кг' },
  { value: '30_60', label: '30 – 60 кг' },
  { value: '60_100', label: '60 – 100 кг' },
  { value: '100_plus', label: 'Свыше 100 кг' },
]

export const PRICE_THRESHOLD = 10_000
