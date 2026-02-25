import type { CalculatorInput, PriceRange, WeightTier } from '../../features/calculator/model/types'

const PRICE_THRESHOLD = 10_000

export interface ValidationError {
  field: string
  message: string
}

export type ValidationResult =
  | { valid: true }
  | { valid: false; errors: ValidationError[] }

export function validateCalculatorInput(input: Partial<CalculatorInput>): ValidationResult {
  const errors: ValidationError[] = []

  const price = input.price
  if (price == null || typeof price !== 'number' || Number.isNaN(price)) {
    errors.push({ field: 'price', message: 'Введите цену продажи' })
  } else if (price <= 0) {
    errors.push({ field: 'price', message: 'Цена должна быть больше 0' })
  }

  const commissionPercent = input.commissionPercent
  if (
    commissionPercent == null ||
    typeof commissionPercent !== 'number' ||
    Number.isNaN(commissionPercent)
  ) {
    errors.push({ field: 'commissionPercent', message: 'Введите комиссию Kaspi (%)' })
  } else if (commissionPercent < 0 || commissionPercent > 100) {
    errors.push({ field: 'commissionPercent', message: 'Комиссия должна быть от 0 до 100%' })
  }

  if (!input.deliveryType) {
    errors.push({ field: 'deliveryType', message: 'Выберите тип доставки' })
  }

  const packaging = input.packaging
  if (packaging == null || typeof packaging !== 'number' || Number.isNaN(packaging)) {
    errors.push({ field: 'packaging', message: 'Введите стоимость упаковки' })
  } else if (packaging < 0) {
    errors.push({ field: 'packaging', message: 'Упаковка не может быть отрицательной' })
  }

  const costPrice = input.costPrice
  if (costPrice == null || typeof costPrice !== 'number' || Number.isNaN(costPrice)) {
    errors.push({ field: 'costPrice', message: 'Введите себестоимость' })
  } else if (costPrice < 0) {
    errors.push({ field: 'costPrice', message: 'Себестоимость не может быть отрицательной' })
  }

  if (typeof price === 'number' && price > 0 && price <= PRICE_THRESHOLD) {
    const range = input.priceRange
    if (!range || !isValidPriceRange(range)) {
      errors.push({ field: 'priceRange', message: 'Выберите диапазон цены (до 10 000 ₸)' })
    }
  }

  if (typeof price === 'number' && price > PRICE_THRESHOLD) {
    const weight = input.weightTier
    if (!weight || !isValidWeightTier(weight)) {
      errors.push({ field: 'weightTier', message: 'Выберите вес товара (свыше 10 000 ₸)' })
    }
  }

  if (errors.length > 0) return { valid: false, errors }
  return { valid: true }
}

const PRICE_RANGE_VALUES: PriceRange[] = [
  '0_1000',
  '1000_3000',
  '3000_5000',
  '5000_10000',
]

function isValidPriceRange(value: string): value is PriceRange {
  return PRICE_RANGE_VALUES.includes(value as PriceRange)
}

const WEIGHT_TIER_VALUES: WeightTier[] = [
  '0_5',
  '5_15',
  '15_30',
  '30_60',
  '60_100',
  '100_plus',
]

function isValidWeightTier(value: string): value is WeightTier {
  return WEIGHT_TIER_VALUES.includes(value as WeightTier)
}
