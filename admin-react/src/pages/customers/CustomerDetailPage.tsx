import { useEffect, useState } from 'react'
import {
  Alert, Badge, Button, Card, CardBody, CardHeader,
  Col, Container, Row, Spinner, Table,
} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router'
import {
  TbAlertCircle, TbArrowLeft, TbBuilding, TbCalendar, TbClock,
  TbEye, TbMail, TbMapPin, TbPhone, TbReceipt, TbUser, TbWallet,
} from 'react-icons/tb'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { customerApi } from '@/api/customerApi'
import type { CustomerDetail, CustomerStatus } from '@/types/customer'
import type { Order, OrderFulfillmentStatus, OrderPaymentStatus } from '@/types/order'

// ─── Formatters ───────────────────────────────────────────────────────────────

const formatVND = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n)

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })

// ─── Badge configs ────────────────────────────────────────────────────────────

const STATUS_MAP: Record<CustomerStatus, { bg: string; text: string; label: string }> = {
  active:   { bg: 'success',   text: 'success',   label: 'Hoạt động' },
  inactive: { bg: 'secondary', text: 'secondary', label: 'Ngừng hoạt động' },
  blocked:  { bg: 'danger',    text: 'danger',    label: 'Đã khóa' },
}

const PAYMENT_STATUS_MAP: Record<OrderPaymentStatus, { bg: string; text: string; label: string }> = {
  pending:    { bg: 'warning',   text: 'warning',   label: 'Chờ thanh toán' },
  processing: { bg: 'info',      text: 'info',      label: 'Đang xử lý' },
  paid:       { bg: 'success',   text: 'success',   label: 'Đã thanh toán' },
  error:      { bg: 'danger',    text: 'danger',    label: 'Lỗi giao dịch' },
  cancelled:  { bg: 'secondary', text: 'secondary', label: 'Đã hủy' },
  refunded:   { bg: 'dark',      text: 'dark',      label: 'Đã hoàn tiền' },
}

const FULFILLMENT_LABELS: Record<OrderFulfillmentStatus, string> = {
  qr_code_esim:          'Gửi QR eSIM',
  activation_code:       'Mã kích hoạt',
  manual_processing:     'Xử lý thủ công',
  physical_sim_shipping: 'Giao SIM vật lý',
  delivered:             'Đã hoàn thành',
  cancelled:             'Đã hủy',
}

function StatusBadge({ status }: { status: CustomerStatus }) {
  const { text, label } = STATUS_MAP[status] ?? { text: 'secondary', label: status }
  return <Badge bg="" className={`bg-${text}-subtle text-${text}-emphasis border border-${text}-subtle fw-semibold`}>{label}</Badge>
}

function PayBadge({ status }: { status: OrderPaymentStatus }) {
  const { text, label } = PAYMENT_STATUS_MAP[status] ?? { text: 'secondary', label: status }
  return <Badge bg="" className={`bg-${text}-subtle text-${text}-emphasis border border-${text}-subtle fw-semibold`}>{label}</Badge>
}

// ─── InfoRow helper ───────────────────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="d-flex align-items-start gap-2 py-1" style={{ fontSize: 14 }}>
      <Icon className="text-muted flex-shrink-0 mt-1" style={{ fontSize: 15 }} />
      <div>
        <div className="text-muted" style={{ fontSize: 11 }}>{label}</div>
        <div className="fw-semibold">{value}</div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: React.ReactNode; color: string }) {
  return (
    <Card className="mb-3">
      <CardBody className="d-flex align-items-center gap-3">
        <div className={`rounded-circle bg-${color} bg-opacity-15 d-flex align-items-center justify-content-center`} style={{ width: 48, height: 48 }}>
          <Icon className={`text-${color}`} style={{ fontSize: 24 }} />
        </div>
        <div>
          <div className="text-muted" style={{ fontSize: 12 }}>{label}</div>
          <div className="fw-bold fs-5">{value}</div>
        </div>
      </CardBody>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const CustomerDetailPage = () => {
  const { customerId } = useParams<{ customerId: string }>()
  const navigate = useNavigate()

  const [customer, setCustomer] = useState<CustomerDetail | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  useEffect(() => {
    if (!customerId) return
    setLoading(true)
    setNotFound(false)
    setOrdersError(null)

    customerApi.getById(customerId)
      .then((c) => {
        setCustomer(c)
        return customerApi.getOrders(customerId).then(
          (res) => setOrders(res.data),
          (err: Error) => setOrdersError(err.message),
        )
      })
      .catch((err: Error & { status?: number }) => {
        if (err.status === 404 || err.message.includes('tìm thấy')) setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [customerId])

  return (
    <Container fluid>
      <PageBreadcrumb title="Chi tiết khách hàng" subtitle="Khách hàng" />

      {loading && (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {!loading && notFound && (
        <Alert variant="danger" className="d-flex align-items-center gap-2">
          <TbAlertCircle className="fs-20 flex-shrink-0" />
          <div>
            Không tìm thấy khách hàng.
            <Button variant="link" className="p-0 ms-2" onClick={() => void navigate('/customers')}>← Quay lại danh sách</Button>
          </div>
        </Alert>
      )}

      {!loading && !notFound && customer && (
        <>
          {/* ── Header ──────────────────────────────── */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <h5 className="mb-0 fw-bold">{customer.fullName}</h5>
              <StatusBadge status={customer.status} />
              <span className="text-muted" style={{ fontSize: 13 }}>
                <TbCalendar className="me-1" />
                Tham gia {formatDate(customer.createdAt)}
              </span>
            </div>
            <Button variant="outline-secondary" size="sm" onClick={() => void navigate('/customers')}>
              <TbArrowLeft className="me-1" /> Quay lại
            </Button>
          </div>

          <Row className="g-3">
            {/* ── Left column ─────────────────────── */}
            <Col lg={8}>
              {/* Stats */}
              <Row className="g-3">
                <Col sm={6}>
                  <StatCard icon={TbReceipt} label="Tổng số đơn" value={customer.orderCount} color="primary" />
                </Col>
                <Col sm={6}>
                  <StatCard icon={TbWallet} label="Tổng chi tiêu" value={formatVND(customer.totalSpent)} color="success" />
                </Col>
              </Row>

              {/* Orders list */}
              <Card>
                <CardHeader>
                  <strong>Đơn hàng của khách</strong>
                  <span className="text-muted ms-2" style={{ fontSize: 13 }}>({orders.length})</span>
                </CardHeader>
                <CardBody className="p-0">
                  {ordersError && (
                    <Alert variant="danger" className="m-3 d-flex align-items-center gap-2 mb-0">
                      <TbAlertCircle className="fs-20 flex-shrink-0" /> {ordersError}
                    </Alert>
                  )}

                  {!ordersError && orders.length === 0 && (
                    <div className="text-center text-muted py-5">Khách hàng chưa có đơn hàng nào</div>
                  )}

                  {!ordersError && orders.length > 0 && (
                    <Table responsive hover className="mb-0 align-middle">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: 48 }}>#</th>
                          <th>Mã đơn</th>
                          <th className="text-end">Tổng tiền</th>
                          <th>Phương thức</th>
                          <th className="text-center">Trạng thái TT</th>
                          <th>Xử lý / Giao hàng</th>
                          <th>Ngày đặt</th>
                          <th className="text-end">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order, idx) => (
                          <tr key={order.id} style={{ cursor: 'pointer' }} onClick={() => void navigate(`/orders/${order.id}`)}>
                            <td className="text-muted" style={{ fontSize: 13 }}>{idx + 1}</td>
                            <td>
                              <span className="fw-semibold text-primary" style={{ fontSize: 13 }}>#{order.orderCode}</span>
                            </td>
                            <td className="text-end text-nowrap fw-semibold text-danger">{formatVND(order.totalAmount)}</td>
                            <td>
                              <Badge bg="light" text="dark" className="border" style={{ fontSize: 12 }}>{order.paymentProvider}</Badge>
                            </td>
                            <td className="text-center"><PayBadge status={order.paymentStatus} /></td>
                            <td><span className="text-muted" style={{ fontSize: 12 }}>{FULFILLMENT_LABELS[order.fulfillmentStatus] ?? order.fulfillmentStatus}</span></td>
                            <td className="text-muted text-nowrap" style={{ fontSize: 12 }}>{formatDateTime(order.createdAt)}</td>
                            <td onClick={(e) => e.stopPropagation()}>
                              <div className="d-flex gap-1 justify-content-end">
                                <Button variant="light" size="sm" className="btn-icon" title="Xem chi tiết đơn"
                                  onClick={() => void navigate(`/orders/${order.id}`)}>
                                  <TbEye className="fs-lg text-info" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </CardBody>
              </Card>
            </Col>

            {/* ── Right column ────────────────────── */}
            <Col lg={4}>
              {/* Profile info */}
              <Card className="mb-3">
                <CardHeader><strong>Thông tin liên hệ</strong></CardHeader>
                <CardBody>
                  <InfoRow icon={TbUser} label="Họ tên" value={customer.fullName} />
                  <InfoRow icon={TbMail} label="Email" value={customer.email} />
                  <InfoRow icon={TbPhone} label="Số điện thoại" value={customer.phone} />
                  {customer.address && (
                    <InfoRow icon={TbMapPin} label="Địa chỉ" value={customer.address} />
                  )}
                  {customer.city && (
                    <InfoRow icon={TbBuilding} label="Thành phố" value={customer.city} />
                  )}
                </CardBody>
              </Card>

              {/* Account info */}
              <Card className="mb-3">
                <CardHeader><strong>Thông tin tài khoản</strong></CardHeader>
                <CardBody>
                  <InfoRow icon={TbCalendar} label="Ngày tạo" value={formatDateTime(customer.createdAt)} />
                  {customer.lastLoginAt && (
                    <InfoRow icon={TbClock} label="Đăng nhập gần nhất" value={formatDateTime(customer.lastLoginAt)} />
                  )}
                </CardBody>
              </Card>

              {/* Internal note */}
              {customer.note && (
                <Card>
                  <CardHeader><strong>Ghi chú nội bộ</strong></CardHeader>
                  <CardBody>
                    <p className="mb-0 text-muted" style={{ fontSize: 14 }}>{customer.note}</p>
                  </CardBody>
                </Card>
              )}
            </Col>
          </Row>
        </>
      )}
    </Container>
  )
}

export default CustomerDetailPage
