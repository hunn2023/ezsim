import type { ReactNode } from 'react'
import { Form } from 'react-bootstrap'

export interface FormFieldProps {
  label?: ReactNode
  required?: boolean
  error?: string
  hint?: ReactNode
  htmlFor?: string
  className?: string
  children: ReactNode
}

/**
 * Labelled wrapper for form controls. Provides:
 * - Label with optional required asterisk
 * - Inline error message (Bootstrap "invalid-feedback" semantics)
 * - Optional helper text shown only when no error
 *
 * Use with Input/Select/Textarea/Switch which set `aria-invalid` based on `error`.
 */
const FormField = ({ label, required, error, hint, htmlFor, className, children }: FormFieldProps) => {
  return (
    <Form.Group className={className} controlId={htmlFor}>
      {label && (
        <Form.Label>
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </Form.Label>
      )}
      {children}
      {error
        ? <div className="invalid-feedback d-block" style={{ fontSize: 13 }}>{error}</div>
        : hint
          ? <Form.Text className="text-muted">{hint}</Form.Text>
          : null}
    </Form.Group>
  )
}

export default FormField
