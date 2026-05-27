import { useEffect, useMemo, useState } from 'react'
import {
  Alert, Badge, Button, Card, CardBody, CardFooter, CardHeader,
  Col, Container, FormControl, FormSelect, InputGroup, Row, Spinner, Table,
} from 'react-bootstrap'
import {
  TbAlertCircle, TbEye, TbRefresh, TbSearch,
} from 'react-icons/tb'
import { useNavigate } from 'react-router'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { orderApi } from '@/api/orderApi'
import type { Order, OrderFulfillmentStatus, OrderPaymentStatus, PaymentProvider } from '@/types/order'

// ─── Formatters ───────────────────────────────────────────────────────────────

const formatVND = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n)

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

// ─── Badge helpers ────────────────────────────────────────────────────────────

const PAYMENT_STATUS_MAP: Record<OrderPaymentStatus, { bg: string; text: string; label: string }> = {
  pending:    { bg: 'warning',   text: 'warning',   label: 'Chờ thanh toán' },
  processing: { bg: 'info',      text: 'info',      label: 'Đang xử lý' },
  paid:       { bg: 'success',   text: 'success',   label: 'Đã thanh toán' },
  error:      { bg: 'danger',    text: 'danger',    label: 'Lỗi giao dịch' },
  cancelled:  { bg: 'secondary', text: 'secondary', label: 'Đã hủy' },
  refunded:   { bg: 'dark',      text: 'dark',      label: 'Đã hoàn tiền' },
}

const FULFILLMENT_MAP: Record<OrderFulfillmentStatus, { label: string }> = {
  qr_code_esim:          { label: 'Gửi QR eSIM' },
  activation_code:       { label: 'Mã kích hoạt' },
  manual_processing:     { label: 'Xử lý thủ công' },
  physical_sim_shipping: { label: 'Giao SIM vật lý' },
  delivered:             { label: 'Đã hoàn thành' },
  cancelled:             { label: 'Đã hủy' },
}

const PaymentStatusBadge = ({ status }: { status: OrderPaymentStatus }) => {
  const { bg, text, label } = PAYMENT_STATUS_MAP[status] ?? { bg: 'light', text: 'dark', label: status }
  return <Badge bg={bg} className={`bg-opacity-15 text-${text}`}>{label}</Badge>
}

const ROWS_PER_PAGE = 10

// ─── Component ────────────────────────────────────────────────────────────────

const OrderListPage = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters (client-side in mock, sent as query params in production)
  const [keyword, setKeyword] = useState('')
  const [phone, setPhone] = useState('')
  const [filterStatus, setFilterStatus] = useState<OrderPaymentStatus | ''>('')
  const [filterMethod, setFilterMethod] = useState<PaymentProvider | ''>('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [page, setPage] = useState(1)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await orderApi.getAll({ keyword, phone, status: filterStatus, paymentMethod: filterMethod, fromDate, toDate })
      setOrders(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void fetchData() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const resetPage = () => setPage(1)

  // Client-side filter (mock already filters server-side, but this ensures correctness locally too)
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const kw = keyword.toLowerCase()
      const matchKeyword = !kw || o.orderCode.toLowerCase().includes(kw)
      const matchPhone = !phone || o.customerPhone.includes(phone)
      const matchStatus = !filterStatus || o.paymentStatus === filterStatus
      const matchMethod = !filterMethod || o.paymentProvider === filterMethod
      const dateStr = o.createdAt.slice(0, 10)
      const matchFrom = !fromDate || dateStr >= fromDate
      const matchTo = !toDate || dateStr <= toDate
      return matchKeyword && matchPhone && matchStatus && matchMethod && matchFrom && matchTo
    })
  }, [orders, keyword, phone, filterStatus, filterMethod, fromDate, toDate])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE)

  return (
    <Container fluid>
      <PageBreadcrumb title="Đơn hàng" subtitle="Quản lý" />

      <Card>
        {/* ── Toolbar ─────────────────────────────────── */}
        <CardHeader>
          <Row className="g-2 align-items-end">
            {/* Search mã đơn */}
            <Col xs={12} sm={6} md={3}>
              <InputGroup>
                <InputGroup.Text><TbSearch /></InputGroup.Text>
                <FormControl
                  placeholder="Mã đơn hàng..."
                  value={keyword}
                  onChange={(e) => { setKeyword(e.target.value); resetPage() }}
                />
              </InputGroup>
            </Col>

            {/* Search SĐT */}
            <Col xs={12} sm={6} md={2}>
              <FormControl
                placeholder="Số điện thoại..."
                value={phone}
                onChange={(e) => { setPhone(e.target.value); resetPage() }}
              />
            </Col>

            {/* Filter trạng thái */}
            <Col xs={6} sm={4} md={2}>
              <FormSelect value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value as typeof filterStatus); resetPage() }}>
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chờ thanh toán</option>
                <option value="processing">Đang xử lý</option>
                <option value="paid">Đã thanh toán</option>
                <option value="error">Lỗi giao dịch</option>
                <option value="cancelled">Đã hủy</option>
                <option value="refunded">Đã hoàn tiền</option>
              </FormSelect>
            </Col>

            {/* Filter phương thức */}
            <Col xs={6} sm={4} md={2}>
              <FormSelect value={filterMethod} onChange={(e) => { setFilterMethod(e.target.value as typeof filterMethod); resetPage() }}>
                <option value="">Tất cả PT thanh toán</option>
                <option value="VNPay">VNPay</option>
                <option value="MoMo">MoMo</option>
                <option value="ZaloPay">ZaloPay</option>
                <option value="VietQR">VietQR</option>
                <option value="Visa/Mastercard">Visa/Mastercard</option>
                <option value="COD">COD</option>
              </FormSelect>
            </Col>

            {/* Date range */}
            <Col xs={6} sm={4} md={1}>
              <FormControl
                type="date"
                value={fromDate}
                onChange={(e) => { setFromDate(e.target.value); resetPage() }}
                title="Từ ngày"
              />
            </Col>
            <Col xs={6} sm={4} md={1}>
              <FormControl
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => { setToDate(e.target.value); resetPage() }}
                title="Đến ngày"
              />
            </Col>

            {/* Refresh */}
            <Col xs="auto">
              <Button variant="outline-secondary" onClick={() => void fetchData()} title="Tải lại">
                <TbRefresh />
              </Button>
            </Col>
          </Row>
        </CardHeader>

        {/* ── Body ────────────────────────────────────── */}
        <CardBody className="p-0">
          {loading && (
            <div className="d-flex justify-content-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          )}

          {!loading && error && (
            <Alert variant="danger" className="m-3 d-flex align-items-center gap-2">
              <TbAlertCircle className="fs-20 flex-shrink-0" /> {error}
            </Alert>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center text-muted py-5">
              {keyword || phone || filterStatus || filterMethod || fromDate || toDate
                ? 'Không tìm thấy đơn hàng phù hợp'
                : 'Chưa có đơn hàng nào'}
            </div>
          )}

          {!loading && !error && pageRows.length > 0 && (
            <Table responsive hover className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 48 }}>#</th>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Số điện thoại</th>
                  <th className="text-end">Tổng tiền</th>
                  <th>Phương thức</th>
                  <th className="text-center">Trạng thái TT</th>
                  <th>Xử lý / Giao hàng</th>
                  <th>Ngày đặt</th>
                  <th className="text-end">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((order, idx) => (
                  <tr key={order.id} style={{ cursor: 'pointer' }} onClick={() => void navigate(`/orders/${order.id}`)}>
                    <td className="text-muted" style={{ fontSize: 13 }}>
                      {(currentPage - 1) * ROWS_PER_PAGE + idx + 1}
                    </td>
                    <td>
                      <span className="fw-semibold text-primary" style={{ fontSize: 13 }}>#{order.orderCode}</span>
                    </td>
                    <td className="fw-semibold">{order.customerName}</td>
                    <td className="text-muted" style={{ fontSize: 13 }}>{order.customerPhone}</td>
                    <td className="text-end text-nowrap fw-semibold text-danger">{formatVND(order.totalAmount)}</td>
                    <td>
                      <Badge bg="light" text="dark" className="border" style={{ fontSize: 12 }}>{order.paymentProvider}</Badge>
                    </td>
                    <td className="text-center">
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </td>
                    <td>
                      <span className="text-muted" style={{ fontSize: 12 }}>
                        {FULFILLMENT_MAP[order.fulfillmentStatus]?.label ?? order.fulfillmentStatus}
                      </span>
                    </td>
                    <td className="text-muted text-nowrap" style={{ fontSize: 12 }}>{formatDate(order.createdAt)}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="d-flex gap-1 justify-content-end">
                        <Button
                          variant="light" size="sm" className="btn-icon" title="Xem chi tiết"
                          onClick={() => void navigate(`/orders/${order.id}`)}
                        >
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

        {/* ── Phân trang ──────────────────────────────── */}
        {!loading && !error && filtered.length > ROWS_PER_PAGE && (
          <CardFooter className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
            <span className="text-muted" style={{ fontSize: 13 }}>
              {(currentPage - 1) * ROWS_PER_PAGE + 1}–{Math.min(currentPage * ROWS_PER_PAGE, filtered.length)} / {filtered.length} đơn hàng
            </span>
            <div className="d-flex gap-1">
              <Button variant="outline-secondary" size="sm" disabled={currentPage <= 1} onClick={() => setPage((p) => p - 1)}>‹</Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button key={p} size="sm" variant={p === currentPage ? 'primary' : 'outline-secondary'} onClick={() => setPage(p)}>{p}</Button>
              ))}
              <Button variant="outline-secondary" size="sm" disabled={currentPage >= totalPages} onClick={() => setPage((p) => p + 1)}>›</Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </Container>
  )
}

export default OrderListPage
