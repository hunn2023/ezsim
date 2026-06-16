import { useEffect, useMemo, useState } from 'react'
import {
  Badge, Button, Col, Container, FormControl, FormSelect, InputGroup, Row,
} from 'react-bootstrap'
import { TbEye, TbRefresh, TbSearch } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import DataTable, { type Column } from '@/components/common/DataTable'
import { orderApi } from '@/api/orderApi'
import type { Order, OrderFulfillmentStatus, OrderPaymentStatus, PaymentProvider } from '@/types/order'

// ─── Formatters ───────────────────────────────────────────────────────────────

const formatVND = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n)

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

// ─── Badge helpers ────────────────────────────────────────────────────────────

const PAYMENT_STATUS_MAP: Record<OrderPaymentStatus, { text: string; label: string }> = {
  pending:    { text: 'warning',   label: 'Chờ thanh toán' },
  processing: { text: 'info',      label: 'Đang xử lý' },
  paid:       { text: 'success',   label: 'Đã thanh toán' },
  error:      { text: 'danger',    label: 'Lỗi giao dịch' },
  cancelled:  { text: 'secondary', label: 'Đã hủy' },
  refunded:   { text: 'dark',      label: 'Đã hoàn tiền' },
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
  const { text, label } = PAYMENT_STATUS_MAP[status] ?? { text: 'secondary', label: status }
  return <Badge bg="" className={`bg-${text}-subtle text-${text}-emphasis border border-${text}-subtle fw-semibold`}>{label}</Badge>
}

// ─── Component ────────────────────────────────────────────────────────────────

const OrderListPage = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [keyword, setKeyword] = useState('')
  const [phone, setPhone] = useState('')
  const [filterStatus, setFilterStatus] = useState<OrderPaymentStatus | ''>('')
  const [filterMethod, setFilterMethod] = useState<PaymentProvider | ''>('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

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

  const columns: Column<Order>[] = [
    { id: 'index', header: '#', width: 48,
      cell: (_o, idx) => <span className="text-muted" style={{ fontSize: 13 }}>{idx + 1}</span> },
    { id: 'orderCode', header: 'Mã đơn', sortAccessor: (o) => o.orderCode,
      cell: (o) => <span className="fw-semibold text-primary" style={{ fontSize: 13 }}>#{o.orderCode}</span> },
    { id: 'customerName', header: 'Khách hàng', sortAccessor: (o) => o.customerName,
      cell: (o) => <span className="fw-semibold">{o.customerName}</span> },
    { id: 'customerPhone', header: 'Số điện thoại',
      cell: (o) => <span className="text-muted" style={{ fontSize: 13 }}>{o.customerPhone}</span> },
    { id: 'totalAmount', header: 'Tổng tiền', align: 'end', sortAccessor: (o) => o.totalAmount,
      cell: (o) => <span className="text-nowrap fw-semibold text-danger">{formatVND(o.totalAmount)}</span> },
    { id: 'paymentProvider', header: 'Phương thức', sortAccessor: (o) => o.paymentProvider,
      cell: (o) => <Badge bg="light" text="dark" className="border" style={{ fontSize: 12 }}>{o.paymentProvider}</Badge> },
    { id: 'paymentStatus', header: 'Trạng thái TT', align: 'center', sortAccessor: (o) => o.paymentStatus,
      cell: (o) => <PaymentStatusBadge status={o.paymentStatus} /> },
    { id: 'fulfillmentStatus', header: 'Xử lý / Giao hàng', sortAccessor: (o) => o.fulfillmentStatus,
      cell: (o) => <span className="text-muted" style={{ fontSize: 12 }}>{FULFILLMENT_MAP[o.fulfillmentStatus]?.label ?? o.fulfillmentStatus}</span> },
    { id: 'createdAt', header: 'Ngày đặt', sortAccessor: (o) => o.createdAt,
      cell: (o) => <span className="text-muted text-nowrap" style={{ fontSize: 12 }}>{formatDate(o.createdAt)}</span> },
    { id: 'actions', header: 'Thao tác', align: 'end',
      cell: (o) => (
        <div className="d-flex gap-1 justify-content-end" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="light" size="sm" className="btn-icon" title="Xem chi tiết"
            onClick={() => void navigate(`/orders/${o.id}`)}
          >
            <TbEye className="fs-lg text-info" />
          </Button>
        </div>
      ) },
  ]

  const toolbar = (
    <Row className="g-2 align-items-end">
      <Col xs={12} sm={6} md={3}>
        <InputGroup>
          <InputGroup.Text><TbSearch /></InputGroup.Text>
          <FormControl
            placeholder="Mã đơn hàng..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </InputGroup>
      </Col>
      <Col xs={12} sm={6} md={2}>
        <FormControl
          placeholder="Số điện thoại..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </Col>
      <Col xs={6} sm={4} md={2}>
        <FormSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}>
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ thanh toán</option>
          <option value="processing">Đang xử lý</option>
          <option value="paid">Đã thanh toán</option>
          <option value="error">Lỗi giao dịch</option>
          <option value="cancelled">Đã hủy</option>
          <option value="refunded">Đã hoàn tiền</option>
        </FormSelect>
      </Col>
      <Col xs={6} sm={4} md={2}>
        <FormSelect value={filterMethod} onChange={(e) => setFilterMethod(e.target.value as typeof filterMethod)}>
          <option value="">Tất cả PT thanh toán</option>
          <option value="VNPay">VNPay</option>
          <option value="MoMo">MoMo</option>
          <option value="ZaloPay">ZaloPay</option>
          <option value="VietQR">VietQR</option>
          <option value="Visa/Mastercard">Visa/Mastercard</option>
          <option value="COD">COD</option>
        </FormSelect>
      </Col>
      <Col xs={6} sm={4} md={1}>
        <FormControl
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          title="Từ ngày"
        />
      </Col>
      <Col xs={6} sm={4} md={1}>
        <FormControl
          type="date"
          value={toDate}
          min={fromDate || undefined}
          onChange={(e) => setToDate(e.target.value)}
          title="Đến ngày"
        />
      </Col>
      <Col xs="auto">
        <Button variant="outline-secondary" onClick={() => void fetchData()} title="Tải lại">
          <TbRefresh />
        </Button>
      </Col>
    </Row>
  )

  const isFiltered = !!(keyword || phone || filterStatus || filterMethod || fromDate || toDate)

  return (
    <Container fluid>
      <PageBreadcrumb title="Đơn hàng" subtitle="Quản lý" />
      <DataTable<Order>
        data={filtered}
        columns={columns}
        rowKey={(o) => o.id}
        loading={loading}
        error={error}
        toolbar={toolbar}
        isFiltered={isFiltered}
        emptyText="Chưa có đơn hàng nào"
        emptyFilteredText="Không tìm thấy đơn hàng phù hợp"
        itemNoun="đơn hàng"
        onRowClick={(o) => void navigate(`/orders/${o.id}`)}
      />
    </Container>
  )
}

export default OrderListPage
