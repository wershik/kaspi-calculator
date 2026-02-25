import { useState, useCallback } from 'react'
import type { CalculatorInput, DeliveryType, PriceRange, WeightTier } from '../model/types'
import { Button, Input, Select } from '../../../shared/ui'
import {
  validateCalculatorInput,
  DELIVERY_OPTIONS,
  PRICE_RANGE_OPTIONS,
  WEIGHT_TIER_OPTIONS,
  PRICE_THRESHOLD,
} from '../../../shared/lib'

export interface CalculatorFormProps {
  onCalculate: (input: CalculatorInput) => void
}

const toNum = (s: string): number => (s === '' ? 0 : Number(s))

export function CalculatorForm({ onCalculate }: CalculatorFormProps) {
  const [price, setPrice] = useState('')
  const [commissionPercent, setCommissionPercent] = useState('')
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('kz')
  const [priceRange, setPriceRange] = useState<PriceRange | ''>('')
  const [weightTier, setWeightTier] = useState<WeightTier | ''>('')
  const [packaging, setPackaging] = useState('')
  const [costPrice, setCostPrice] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const priceNum = toNum(price)
  const showPriceRange = priceNum > 0 && priceNum <= PRICE_THRESHOLD
  const showWeightTier = priceNum > PRICE_THRESHOLD

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const input: CalculatorInput = {
        price: toNum(price),
        commissionPercent: toNum(commissionPercent),
        deliveryType,
        priceRange: showPriceRange && priceRange ? priceRange : undefined,
        weightTier: showWeightTier && weightTier ? weightTier : undefined,
        packaging: toNum(packaging),
        costPrice: toNum(costPrice),
      }
      const validation = validateCalculatorInput(input)
      if (validation.valid) {
        setErrors({})
        onCalculate(input)
      } else {
        const errMap: Record<string, string> = {}
        for (const { field, message } of validation.errors) {
          errMap[field] = message
        }
        setErrors(errMap)
      }
    },
    [
      price,
      commissionPercent,
      deliveryType,
      priceRange,
      weightTier,
      packaging,
      costPrice,
      showPriceRange,
      showWeightTier,
      onCalculate,
    ]
  )

  return (
    <form className="calculator-form" onSubmit={handleSubmit}>
      <div className="calculator-form__row">
        <Input
          label="Цена продажи на Kaspi (₸)"
          type="number"
          min={1}
          step={1}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          error={errors.price}
        />
        <Input
          label="Комиссия Kaspi (%)"
          type="number"
          min={0}
          max={100}
          step={0.1}
          value={commissionPercent}
          onChange={(e) => setCommissionPercent(e.target.value)}
          error={errors.commissionPercent}
        />
      </div>

      <div className="calculator-form__row">
        <Select
          label="Город доставки"
          options={DELIVERY_OPTIONS}
          value={deliveryType}
          onChange={(e) => setDeliveryType(e.target.value as DeliveryType)}
          error={errors.deliveryType}
        />
      </div>

      {showPriceRange && (
        <div className="calculator-form__row">
          <Select
            label="Диапазон цены (до 10 000 ₸)"
            options={PRICE_RANGE_OPTIONS}
            value={priceRange}
            onChange={(e) => setPriceRange((e.target.value || '') as PriceRange | '')}
            error={errors.priceRange}
          />
        </div>
      )}

      {showWeightTier && (
        <div className="calculator-form__row">
          <Select
            label="Вес товара (свыше 10 000 ₸)"
            options={WEIGHT_TIER_OPTIONS}
            value={weightTier}
            onChange={(e) => setWeightTier((e.target.value || '') as WeightTier | '')}
            error={errors.weightTier}
          />
        </div>
      )}

      <div className="calculator-form__row">
        <Input
          label="Упаковка (₸)"
          type="number"
          min={0}
          step={1}
          value={packaging}
          onChange={(e) => setPackaging(e.target.value)}
          error={errors.packaging}
        />
        <Input
          label="Себестоимость товара (₸)"
          type="number"
          min={0}
          step={1}
          value={costPrice}
          onChange={(e) => setCostPrice(e.target.value)}
          error={errors.costPrice}
        />
      </div>

      <div className="calculator-form__actions">
        <Button type="submit">Рассчитать прибыль</Button>
      </div>
    </form>
  )
}
