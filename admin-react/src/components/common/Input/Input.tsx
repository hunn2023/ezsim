import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { FormControl, InputGroup } from 'react-bootstrap'
import FormField from '@/components/common/FormField/FormField'

type BaseInputProps = Omit<ComponentPropsWithoutRef<typeof FormControl>, 'isInvalid'>

export interface InputProps extends BaseInputProps {
  label?: ReactNode
  required?: boolean
  error?: string
  hint?: ReactNode
  /** Loading state — disables input and shows a spinner-like prefix. */
  loading?: boolean
  /** Icon or content shown before the input (uses InputGroup). */
  prefix?: ReactNode
  /** Icon or content shown after the input (uses InputGroup). */
  suffix?: ReactNode
  /** Skip the FormField wrapper (label/error). Use when nesting inside another container. */
  bare?: boolean
}

/**
 * Input wraps react-bootstrap FormControl with label/error/required mark/loading.
 * Forwards ref so it works with react-hook-form's register().
 */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, required, error, hint, loading, prefix, suffix, bare, disabled, className, ...rest },
  ref,
) {
  const isInvalid = !!error
  const isDisabled = disabled || loading

  const control = (
    <FormControl
      {...rest}
      ref={ref}
      disabled={isDisabled}
      isInvalid={isInvalid}
      aria-invalid={isInvalid || undefined}
      className={className}
    />
  )

  const wrapped = prefix || suffix
    ? (
      <InputGroup>
        {prefix && <InputGroup.Text>{prefix}</InputGroup.Text>}
        {control}
        {suffix && <InputGroup.Text>{suffix}</InputGroup.Text>}
      </InputGroup>
    )
    : control

  if (bare) return wrapped

  return (
    <FormField label={label} required={required} error={error} hint={hint}>
      {wrapped}
    </FormField>
  )
})

export default Input
