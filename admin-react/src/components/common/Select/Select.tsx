import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { FormSelect } from 'react-bootstrap'
import FormField from '@/components/common/FormField/FormField'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

type BaseSelectProps = Omit<ComponentPropsWithoutRef<typeof FormSelect>, 'isInvalid' | 'children'>

export interface SelectProps extends BaseSelectProps {
  label?: ReactNode
  required?: boolean
  error?: string
  hint?: ReactNode
  loading?: boolean
  /** Options array. Alternative: pass children for full control. */
  options?: SelectOption[]
  /** Optional placeholder rendered as a disabled first <option value="">. */
  placeholder?: string
  /** Skip FormField wrapper. */
  bare?: boolean
  children?: ReactNode
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, required, error, hint, loading, options, placeholder, bare, disabled, children, ...rest },
  ref,
) {
  const isInvalid = !!error
  const isDisabled = disabled || loading

  const control = (
    <FormSelect
      {...rest}
      ref={ref}
      disabled={isDisabled}
      isInvalid={isInvalid}
      aria-invalid={isInvalid || undefined}
    >
      {placeholder !== undefined && (
        <option value="" disabled={required}>{placeholder}</option>
      )}
      {options
        ? options.map((o: SelectOption) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>
          ))
        : children}
    </FormSelect>
  )

  if (bare) return control

  return (
    <FormField label={label} required={required} error={error} hint={hint}>
      {control}
    </FormField>
  )
})

export default Select
