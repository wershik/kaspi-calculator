import { useState, useCallback } from 'react'
import { CalculatorForm, CalculatorResult } from '../features/calculator/components'
import { calculate } from '../features/calculator/model'
import type { CalculatorInput, CalculatorResult as CalculatorResultType } from '../features/calculator/model'

function App() {
  const [result, setResult] = useState<CalculatorResultType | null>(null)

  const handleCalculate = useCallback((input: CalculatorInput) => {
    setResult(calculate(input))
  }, [])

  return (
    <div className="app">
      <header className="app__header">
        <h1>ProKaspi Calculator</h1>
      </header>
      <main className="app__main">
        <section className="app__form">
          <CalculatorForm onCalculate={handleCalculate} />
        </section>
        <section className="app__result">
          <CalculatorResult result={result} />
        </section>
      </main>
    </div>
  )
}

export default App
