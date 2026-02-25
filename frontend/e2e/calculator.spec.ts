import { test, expect } from '@playwright/test'

test.describe('Calculator flow', () => {
  test('user fills form, calculates profit, sees result', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /ProKaspi Calculator/i })).toBeVisible()

    // Price and commission
    await page.getByLabel(/Цена продажи на Kaspi/).fill('5000')
    await page.getByLabel(/Комиссия Kaspi/).fill('10')

    // Delivery type
    await page.getByLabel(/Город доставки/).selectOption('kz')

    // Price range (shown for price ≤ 10 000)
    await page.getByLabel(/Диапазон цены/).selectOption('3000_5000')

    // Packaging and cost
    await page.getByLabel(/Упаковка/).fill('100')
    await page.getByLabel(/Себестоимость товара/).fill('3000')

    await page.getByRole('button', { name: 'Рассчитать прибыль' }).click()

    // Result: profit 801 ₸ (5000 - 500 - 599 - 100 - 3000)
    await expect(page.getByText('Результат')).toBeVisible()
    await expect(page.getByText(/Прибыль/)).toBeVisible()
    await expect(page.locator('.calculator-result').filter({ hasText: '801' })).toBeVisible()
  })
})
