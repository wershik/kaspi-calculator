# Testing Policy

## 1. Tests are required for:
- Any logic change
- Any bug fix
- Any rule modification

## 2. Tests must:
- Cover edge cases
- Be deterministic
- Avoid real external network calls

## 3. Test Levels

- Unit — required for logic
- Integration — optional
- E2E (Playwright) — for user flows

For `prokaspi-calculator` specifically:

- Unit:
  - Обязательны для функций расчёта комиссий и прибыли в модуле `src/features/calculator/model/calculatorLogic.ts`.
  - Должны покрывать:
    - различные диапазоны цен;
    - разные города доставки и типы доставки;
    - разные веса и стоимость упаковки;
    - граничные случаи (минимальные/максимальные значения, нули, некорректный ввод).
  - Реализация — Vitest + @testing-library/react (для проверки простых UI‑сценариев при необходимости).
- Integration (опционально):
  - Совместная работа формы и блока результата (проверка передачи корректных данных в расчёт).
- E2E (Playwright):
  - Основной пользовательский сценарий:
    - пользователь заполняет форму аналогично [`online.prokaspi.kz/calculator`](https://online.prokaspi.kz/calculator);
    - нажимает кнопку «Рассчитать прибыль»;
    - получает ожидаемый результат.
  - E2E‑тесты запускаются против собранной версии фронтенда без какого‑либо бэкенда.

## 4. Commit Rule

Code without tests is not complete.