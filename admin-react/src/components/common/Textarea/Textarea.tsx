import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { FormControl } from 'react-bootstrap'
import FormField from '@/components/common/FormField/FormField'

type BaseTextareaProps = Omit<ComponentPropsWithoutRef<typeof FormControl>, 'isInvalid' | 'as'>

export interface TextareaProps extends BaseTextareaProps {
  label?: ReactNode
  required?: boolean
  error?: string
  hint?: ReactNode
  loading?: boolean
  rows?: number
  /** Skip FormField wrapper. */
  bare?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, required, error, hint, loading, rows = 3, bare, disabled, ...rest },
  ref,
) {
  const isInvalid = !!error
  const isDisabled = disabled || loading

  const control = (
    <FormControl
      {...rest}
      as="textarea"
      rows={rows}
      ref={ref as React.Ref<HTMLTextAreaElement>}
      disabled={isDisabled}
      isInvalid={isInvalid}
      aria-invalid={isInvalid || undefined}
    />
  )

  if (bare) return control

  return (
    <FormField label={label} required={required} error={error} hint={hint}>
      {control}
    </FormField>
  )
})

export default Textarea
