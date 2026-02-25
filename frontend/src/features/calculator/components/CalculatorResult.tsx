import type { CalculatorResult as CalculatorResultType } from '../model/types'
import { formatCurrency } from '../../../shared/lib'

export interface CalculatorResultProps {
  result: CalculatorResultType | null
}

export function CalculatorResult({ result }: CalculatorResultProps) {
  if (result === null) {
    return (
      <div className="calculator-result calculator-result--empty">
        <p>Введите данные для расчета...</p>
      </div>
    )
  }

  return (
    <div className="calculator-result">
      <h2 className="calculator-result__title">Результат</h2>
      <dl className="calculator-result__list">
        <div className="calculator-result__row">
          <dt>Комиссия площадки</dt>
          <dd>{formatCurrency(result.commissionAmount)}</dd>
        </div>
        <div className="calculator-result__row">
          <dt>Доставка</dt>
          <dd>{formatCurrency(result.deliveryAmount)}</dd>
        </div>
        <div className="calculator-result__row">
          <dt>Упаковка</dt>
          <dd>{formatCurrency(result.packaging)}</dd>
        </div>
        <div className="calculator-result__row">
          <dt>Себестоимость</dt>
          <dd>{formatCurrency(result.costPrice)}</dd>
        </div>
        <div className="calculator-result__row calculator-result__row--total">
          <dt>Списания всего</dt>
          <dd>{formatCurrency(result.totalDeductions)}</dd>
        </div>
        <div
          className={`calculator-result__row calculator-result__profit ${
            result.profit < 0 ? 'calculator-result__profit--loss' : ''
          }`}
        >
          <dt>Прибыль</dt>
          <dd>{formatCurrency(result.profit)}</dd>
        </div>
      </dl>
    </div>
  )
}
