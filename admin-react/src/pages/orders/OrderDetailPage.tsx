import { useEffect, useState } from 'react'
import {
  Alert, Badge, Button, Card, CardBody, CardHeader,
  Col, Container, Row, Spinner, Table,
} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router'
import { TbAlertCircle, TbArrowLeft, TbBuilding, TbCalendar, TbCreditCard, TbMapPin, TbPhone, TbUser } from 'react-icons/tb'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { orderApi } from '@/api/orderApi'
import type { OrderDetail, OrderFulfillmentStatus, OrderPaymentStatus } from '@/types/order'

// ─── Formatters ───────────────────────────────────────────────────────────────

const formatVND = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n)

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

// ─── Badge configs ────────────────────────────────────────────────────────────

const PAYMENT_STATUS: Record<OrderPaymentStatus, { bg: string; text: string; label: string }> = {
  pending:    { bg: 'warning',   text: 'warning',   label: 'Chờ thanh toán' },
  processing: { bg: 'info',      text: 'info',      label: 'Đang xử lý' },
  paid:       { bg: 'success',   text: 'success',   label: 'Đã thanh toán' },
  error:      { bg: 'danger',    text: 'danger',    label: 'Lỗi giao dịch' },
  cancelled:  { bg: 'secondary', text: 'secondary', label: 'Đã hủy' },
  refunded:   { bg: 'dark',      text: 'dark',      label: 'Đã hoàn tiền' },
}

const FULFILLMENT: Record<OrderFulfillmentStatus, { label: string; bg: string; text: string }> = {
  qr_code_esim:          { label: 'Gửi QR eSIM',      bg: 'primary',   text: 'primary' },
  activation_code:       { label: 'Mã kích hoạt',     bg: 'info',      text: 'info' },
  manual_processing:     { label: 'Xử lý thủ công',   bg: 'warning',   text: 'warning' },
  physical_sim_shipping: { label: 'Giao SIM vật lý',  bg: 'primary',   text: 'primary' },
  delivered:             { label: 'Đã hoàn thành',    bg: 'success',   text: 'success' },
  cancelled:             { label: 'Đã hủy',           bg: 'secondary', text: 'secondary' },
}

function PayBadge({ status }: { status: OrderPaymentStatus }) {
  const { bg, text, label } = PAYMENT_STATUS[status] ?? { bg: 'light', text: 'dark', label: status }
  return <Badge bg={bg} className={`bg-opacity-15 text-${text}`}>{label}</Badge>
}

function FulBadge({ status }: { status: OrderFulfillmentStatus }) {
  const { bg, text, label } = FULFILLMENT[status] ?? { bg: 'light', text: 'dark', label: status }
  return <Badge bg={bg} className={`bg-opacity-15 text-${text}`}>{label}</Badge>
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

// ─── Page ─────────────────────────────────────────────────────────────────────

const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!orderId) return
    setLoading(true)
    orderApi.getById(orderId)
      .then(setOrder)
      .catch((err: Error & { status?: number }) => {
        if (err.status === 404 || err.message.includes('tìm thấy')) setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [orderId])

  return (
    <Container fluid>
      <PageBreadcrumb title="Chi tiết đơn hàng" subtitle="Đơn hàng" />

      {loading && (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {!loading && notFound && (
        <Alert variant="danger" className="d-flex align-items-center gap-2">
          <TbAlertCircle className="fs-20 flex-shrink-0" />
          <div>
            Không tìm thấy đơn hàng.
            <Button variant="link" className="p-0 ms-2" onClick={() => void navigate('/orders')}>← Quay lại danh sách</Button>
          </div>
        </Alert>
      )}

      {!loading && !notFound && order && (
        <>
          {/* ── Header ──────────────────────────────── */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <h5 className="mb-0 fw-bold">#{order.orderCode}</h5>
              <PayBadge status={order.paymentStatus} />
              <FulBadge status={order.fulfillmentStatus} />
              <span className="text-muted" style={{ fontSize: 13 }}>
                <TbCalendar className="me-1" />
                {formatDateTime(order.createdAt)}
              </span>
            </div>
            <Button variant="outline-secondary" size="sm" onClick={() => void navigate('/orders')}>
              <TbArrowLeft className="me-1" /> Quay lại
            </Button>
          </div>

          <Row className="g-3">
            {/* ── Left column ─────────────────────── */}
            <Col lg={8}>
              {/* Product list */}
              <Card className="mb-3">
                <CardHeader><strong>Sản phẩm trong đơn</strong></CardHeader>
                <CardBody className="p-0">
                  <Table responsive className="mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Sản phẩm</th>
                        <th className="text-center">SL</th>
                        <th className="text-end">Đơn giá</th>
                        <th className="text-end">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, i) => (
                        <tr key={item.id}>
                          <td className="text-muted" style={{ fontSize: 13 }}>{i + 1}</td>
                          <td>
                            <div className="fw-semibold" style={{ fontSize: 14 }}>{item.productName}</div>
                            {item.variantName && (
                              <div className="text-muted" style={{ fontSize: 12 }}>{item.variantName}</div>
                            )}
                          </td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end text-nowrap">{formatVND(item.unitPrice)}</td>
                          <td className="text-end text-nowrap fw-semibold">{formatVND(item.totalPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>

              {/* Price summary */}
              <Card className="mb-3">
                <CardBody>
                  <div className="d-flex flex-column gap-1" style={{ fontSize: 14 }}>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Tạm tính</span>
                      <span>{formatVND(order.subtotal)}</span>
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="d-flex justify-content-between text-success">
                        <span>Giảm giá</span>
                        <span>−{formatVND(order.discountAmount)}</span>
                      </div>
                    )}
                    {order.shippingFee > 0 && (
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Phí vận chuyển</span>
                        <span>{formatVND(order.shippingFee)}</span>
                      </div>
                    )}
                    <hr className="my-1" />
                    <div className="d-flex justify-content-between fw-bold fs-6">
                      <span>Tổng cộng</span>
                      <span className="text-danger">{formatVND(order.totalAmount)}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Note */}
              {order.note && (
                <Card className="mb-3">
                  <CardHeader><strong>Ghi chú</strong></CardHeader>
                  <CardBody>
                    <p className="mb-0 text-muted" style={{ fontSize: 14 }}>{order.note}</p>
                  </CardBody>
                </Card>
              )}

              {/* Status history */}
              {order.statusHistory && order.statusHistory.length > 0 && (
                <Card>
                  <CardHeader><strong>Lịch sử trạng thái</strong></CardHeader>
                  <CardBody>
                    <div className="d-flex flex-column gap-2">
                      {order.statusHistory.map((evt, i) => (
                        <div key={i} className="d-flex align-items-start gap-3">
                          <div
                            className="rounded-circle bg-primary flex-shrink-0 mt-1"
                            style={{ width: 8, height: 8, marginTop: 6 }}
                          />
                          <div>
                            <div className="fw-semibold" style={{ fontSize: 14 }}>{evt.label}</div>
                            {evt.note && <div className="text-muted" style={{ fontSize: 12 }}>{evt.note}</div>}
                            <div className="text-muted" style={{ fontSize: 12 }}>{formatDateTime(evt.createdAt)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}
            </Col>

            {/* ── Right column ────────────────────── */}
            <Col lg={4}>
              {/* Customer info */}
              <Card className="mb-3">
                <CardHeader><strong>Khách hàng</strong></CardHeader>
                <CardBody>
                  <InfoRow icon={TbUser} label="Họ tên" value={order.customerName} />
                  <InfoRow icon={TbPhone} label="Số điện thoại" value={order.customerPhone} />
                  {order.customerEmail && (
                    <InfoRow icon={TbBuilding} label="Email" value={order.customerEmail} />
                  )}
                </CardBody>
              </Card>

              {/* Shipping address */}
              {order.shippingAddress && (
                <Card className="mb-3">
                  <CardHeader><strong>Thông tin giao hàng</strong></CardHeader>
                  <CardBody>
                    <InfoRow icon={TbUser} label="Người nhận" value={order.shippingAddress.fullName} />
                    <InfoRow icon={TbPhone} label="Điện thoại" value={order.shippingAddress.phone} />
                    <InfoRow icon={TbMapPin} label="Địa chỉ" value={order.shippingAddress.address} />
                    <InfoRow icon={TbBuilding} label="Thành phố" value={order.shippingAddress.city} />
                  </CardBody>
                </Card>
              )}

              {/* Payment info */}
              <Card className="mb-3">
                <CardHeader><strong>Phương thức thanh toán</strong></CardHeader>
                <CardBody>
                  <InfoRow icon={TbCreditCard} label="Cổng thanh toán" value={order.paymentProvider} />
                  <InfoRow icon={TbCreditCard} label="Trạng thái" value={<PayBadge status={order.paymentStatus} />} />
                  {order.paymentTransactionCode && (
                    <InfoRow icon={TbBuilding} label="Mã giao dịch" value={
                      <code style={{ fontSize: 12 }}>{order.paymentTransactionCode}</code>
                    } />
                  )}
                  {order.paymentPaidAt && (
                    <InfoRow icon={TbCalendar} label="Thời gian thanh toán" value={formatDateTime(order.paymentPaidAt)} />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  )
}

export default OrderDetailPage
