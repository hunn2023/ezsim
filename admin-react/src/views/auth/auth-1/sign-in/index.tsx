import AppLogo from '@/components/AppLogo'
import { useAuthContext } from '@/context/useAuthContext'
import { author, currentYear } from '@/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Alert, Button, Card, Col, Container, Form, FormControl, FormLabel, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { z } from 'zod'
import PageMetaData from '@/components/PageMetaData'

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
})

type LoginForm = z.infer<typeof loginSchema>

const Page = () => {
  const { login } = useAuthContext()
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
    <>
      <PageMetaData title="Đăng nhập" />
      <div className="auth-box overflow-hidden align-items-center d-flex" style={{ minHeight: '100vh' }}>
        <Container>
          <Row className="justify-content-center">
            <Col xxl={4} md={6} sm={8}>
              <div className="auth-brand text-center mb-4">
                <AppLogo />
                <h4 className="fw-bold mt-3">Chào mừng trở lại</h4>
                <p className="text-muted w-lg-75 mx-auto">Nhập email và mật khẩu để tiếp tục.</p>
              </div>

              <Card className="p-4 rounded-4">
                {error && (
                  <Alert variant="danger" className="py-2 text-sm">
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
                    {errors.email && <Form.Control.Feedback type="invalid">{errors.email.message}</Form.Control.Feedback>}
                  </div>

                  <div className="mb-3 form-group">
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

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="form-check">
                      <input className="form-check-input form-check-input-light fs-14" type="checkbox" id="rememberMe" />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Ghi nhớ đăng nhập
                      </label>
                    </div>
                    <Link to="/auth-1/reset-password" className="text-decoration-underline link-offset-3 text-muted">
                      Quên mật khẩu?
                    </Link>
                  </div>

                  <div className="d-grid">
                    <Button type="submit" className="btn-primary fw-semibold py-2" disabled={isSubmitting}>
                      {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </Button>
                  </div>
                </Form>
              </Card>

              <p className="text-center text-muted mt-4 mb-0">
                © 2014 - {currentYear} INSPINIA — by <span className="fw-semibold">{author}</span>
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default Page
