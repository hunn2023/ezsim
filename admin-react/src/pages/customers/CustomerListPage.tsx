import { useEffect, useMemo, useState } from 'react'
import {
  Badge, Button, Col, Container, FormControl, FormSelect, InputGroup, Row,
} from 'react-bootstrap'
import { TbEye, TbRefresh, TbSearch } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import DataTable, { type Column } from '@/components/common/DataTable'
import { customerApi } from '@/api/customerApi'
import type { Customer, CustomerStatus } from '@/types/customer'

// ─── Formatters ───────────────────────────────────────────────────────────────

const formatVND = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n)

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

// ─── Badge ────────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<CustomerStatus, { text: string; label: string }> = {
  active:   { text: 'success',   label: 'Hoạt động' },
  inactive: { text: 'secondary', label: 'Ngừng hoạt động' },
  blocked:  { text: 'danger',    label: 'Đã khóa' },
}

const StatusBadge = ({ status }: { status: CustomerStatus }) => {
  const { text, label } = STATUS_MAP[status] ?? { text: 'secondary', label: status }
  return <Badge bg="" className={`bg-${text}-subtle text-${text}-emphasis border border-${text}-subtle fw-semibold`}>{label}</Badge>
}

// ─── Component ────────────────────────────────────────────────────────────────

const CustomerListPage = () => {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [keyword, setKeyword] = useState('')
  const [filterStatus, setFilterStatus] = useState<CustomerStatus | ''>('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await customerApi.getAll({ keyword, status: filterStatus, fromDate, toDate })
      setCustomers(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách khách hàng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void fetchData() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const kw = keyword.toLowerCase().trim()
      const matchKeyword =
        !kw ||
        c.fullName.toLowerCase().includes(kw) ||
        c.email.toLowerCase().includes(kw) ||
        c.phone.includes(keyword)
      const matchStatus = !filterStatus || c.status === filterStatus
      const dateStr = c.createdAt.slice(0, 10)
      const matchFrom = !fromDate || dateStr >= fromDate
      const matchTo = !toDate || dateStr <= toDate
      return matchKeyword && matchStatus && matchFrom && matchTo
    })
  }, [customers, keyword, filterStatus, fromDate, toDate])

  const columns: Column<Customer>[] = [
    { id: 'index', header: '#', width: 48,
      cell: (_c, idx) => <span className="text-muted" style={{ fontSize: 13 }}>{idx + 1}</span> },
    { id: 'fullName', header: 'Họ tên', sortAccessor: (c) => c.fullName,
      cell: (c) => <span className="fw-semibold">{c.fullName}</span> },
    { id: 'email', header: 'Email', sortAccessor: (c) => c.email,
      cell: (c) => <span className="text-muted" style={{ fontSize: 13 }}>{c.email}</span> },
    { id: 'phone', header: 'Số điện thoại',
      cell: (c) => <span className="text-muted" style={{ fontSize: 13 }}>{c.phone}</span> },
    { id: 'orderCount', header: 'Số đơn', align: 'center', sortAccessor: (c) => c.orderCount,
      cell: (c) => <span className="fw-semibold">{c.orderCount}</span> },
    { id: 'totalSpent', header: 'Tổng chi tiêu', align: 'end', sortAccessor: (c) => c.totalSpent,
      cell: (c) => <span className="text-nowrap fw-semibold text-danger">{formatVND(c.totalSpent)}</span> },
    { id: 'status', header: 'Trạng thái', align: 'center', sortAccessor: (c) => c.status,
      cell: (c) => <StatusBadge status={c.status} /> },
    { id: 'createdAt', header: 'Ngày tạo', sortAccessor: (c) => c.createdAt,
      cell: (c) => <span className="text-muted text-nowrap" style={{ fontSize: 12 }}>{formatDate(c.createdAt)}</span> },
    { id: 'actions', header: 'Thao tác', align: 'end',
      cell: (c) => (
        <div className="d-flex gap-1 justify-content-end" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="light" size="sm" className="btn-icon" title="Xem chi tiết"
            onClick={() => void navigate(`/customers/${c.id}`)}
          >
            <TbEye className="fs-lg text-info" />
          </Button>
        </div>
      ) },
  ]

  const toolbar = (
    <Row className="g-2 align-items-end">
      <Col xs={12} sm={6} md={4}>
        <InputGroup>
          <InputGroup.Text><TbSearch /></InputGroup.Text>
          <FormControl
            placeholder="Tìm tên, email hoặc số điện thoại..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </InputGroup>
      </Col>
      <Col xs={6} sm={4} md={2}>
        <FormSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}>
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Ngừng hoạt động</option>
          <option value="blocked">Đã khóa</option>
        </FormSelect>
      </Col>
      <Col xs={6} sm={4} md={2}>
        <FormControl
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          title="Từ ngày"
        />
      </Col>
      <Col xs={6} sm={4} md={2}>
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

  const isFiltered = !!(keyword || filterStatus || fromDate || toDate)

  return (
    <Container fluid>
      <PageBreadcrumb title="Khách hàng" subtitle="Quản lý" />
      <DataTable<Customer>
        data={filtered}
        columns={columns}
        rowKey={(c) => c.id}
        loading={loading}
        error={error}
        toolbar={toolbar}
        isFiltered={isFiltered}
        emptyText="Chưa có khách hàng nào"
        emptyFilteredText="Không tìm thấy khách hàng phù hợp"
        itemNoun="khách hàng"
        onRowClick={(c) => void navigate(`/customers/${c.id}`)}
      />
    </Container>
  )
}

export default CustomerListPage
