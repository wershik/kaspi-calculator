// Calculator model — types and logic
export type {
  CalculatorInput,
  CalculatorResult,
  DeliveryType,
  PriceRange,
  WeightTier,
} from './types'
export {
  calculate,
  getCommissionAmount,
  getDeliveryAmount,
} from './calculatorLogic'
