import AppLogo from '@/components/AppLogo'
import { useAuthStore } from '@/stores/authStore'
import { author, currentYear } from '@/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Alert, Button, Card, Col, Container, Form, FormControl, FormLabel, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
})

type LoginForm = z.infer<typeof loginSchema>

const LoginPage = () => {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginForm) => {
    setError(null)
    try {
      await login(data.email, data.password)
      const returnUrl = searchParams.get('returnUrl') ?? '/dashboard'
      navigate(returnUrl, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại')
    }
  }

  return (
    <div className="auth-box overflow-hidden align-items-center d-flex" style={{ minHeight: '100vh' }}>
      <Container>
        <Row className="justify-content-center">
          <Col xxl={4} md={6} sm={8}>
            <div className="auth-brand text-center mb-4">
              <AppLogo />
              <h4 className="fw-bold mt-3">Trang quản trị</h4>
              <p className="text-muted w-lg-75 mx-auto">Chỉ dành cho Admin và Staff. Nhập thông tin đăng nhập để tiếp tục.</p>
            </div>

            <Card className="p-4 rounded-4">
              {error && (
                <Alert variant="danger" className="py-2 mb-3" style={{ fontSize: 13 }}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3 form-group">
                  <FormLabel>
                    Email <span className="text-danger">*</span>
                  </FormLabel>
                  <FormControl
                    type="email"
                    placeholder="admin@ezsim.vn"
                    isInvalid={!!errors.email}
                    {...register('email')}
                  />
                  {errors.email && (
                    <Form.Control.Feedback type="invalid">{errors.email.message}</Form.Control.Feedback>
                  )}
                </div>

                <div className="mb-4 form-group">
                  <FormLabel>
                    Mật khẩu <span className="text-danger">*</span>
                  </FormLabel>
                  <FormControl
                    type="password"
                    placeholder="••••••••"
                    isInvalid={!!errors.password}
                    {...register('password')}
                  />
                  {errors.password && (
                    <Form.Control.Feedback type="invalid">{errors.password.message}</Form.Control.Feedback>
                  )}
                </div>

                <div className="d-grid">
                  <Button type="submit" className="btn-primary fw-semibold py-2" disabled={isSubmitting}>
                    {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>
                </div>
              </Form>

              <p className="text-muted text-center mt-3 mb-0" style={{ fontSize: 12 }}>
                Quên mật khẩu? Liên hệ{' '}
                <Link to="mailto:admin@ezsim.vn" className="text-decoration-underline">
                  admin@ezsim.vn
                </Link>
              </p>
            </Card>

            <p className="text-center text-muted mt-4 mb-0">
              © 2014 - {currentYear} INSPINIA — by <span className="fw-semibold">{author}</span>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default LoginPage
