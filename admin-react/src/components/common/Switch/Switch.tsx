import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { Form } from 'react-bootstrap'

type BaseCheckProps = Omit<ComponentPropsWithoutRef<typeof Form.Check>, 'isInvalid' | 'type' | 'label'>

export interface SwitchProps extends BaseCheckProps {
  label?: ReactNode
  error?: string
  hint?: ReactNode
  loading?: boolean
  /** Render as a "switch" (default) or a regular "checkbox". */
  variant?: 'switch' | 'checkbox'
}

/**
 * Switch / Checkbox with consistent label + error styling.
 * Forwards ref so it works with react-hook-form's register().
 */
const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, error, hint, loading, variant = 'switch', disabled, id: idProp, className, ...rest },
  ref,
) {
  const autoId = useId()
  const id = idProp ?? autoId
  const isInvalid = !!error
  const isDisabled = disabled || loading

  return (
    <Form.Group className={className}>
      <Form.Check
        {...rest}
        ref={ref}
        id={id}
        type={variant}
        label={label}
        disabled={isDisabled}
        isInvalid={isInvalid}
        aria-invalid={isInvalid || undefined}
      />
      {error
        ? <div className="invalid-feedback d-block" style={{ fontSize: 13 }}>{error}</div>
        : hint
          ? <Form.Text className="text-muted">{hint}</Form.Text>
          : null}
    </Form.Group>
  )
})

export default Switch
