import type { SelectHTMLAttributes } from 'react'

export interface SelectOption<T extends string = string> {
  value: T
  label: string
}

export interface SelectProps<T extends string = string>
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  label?: string
  error?: string
  options: SelectOption<T>[]
  className?: string
}

export function Select<T extends string = string>({
  label,
  error,
  options,
  className = '',
  id,
  ...rest
}: SelectProps<T>) {
  const selectId = id ?? label?.replace(/\s+/g, '-').toLowerCase()
  return (
    <div className={`input-group ${className}`.trim()}>
      {label && (
        <label htmlFor={selectId} className="input-group__label">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`input-group__input input-group__select ${error ? 'input-group__input--error' : ''}`.trim()}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
        {...rest}
      >
        <option value="">— Выберите —</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={`${selectId}-error`} className="input-group__error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
