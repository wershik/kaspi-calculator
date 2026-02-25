/**
 * Format number as KZT currency (e.g. "1 234,56 ₸").
 */
export function formatCurrency(value: number): string {
  return `${value.toLocaleString('ru-KZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} ₸`
}
