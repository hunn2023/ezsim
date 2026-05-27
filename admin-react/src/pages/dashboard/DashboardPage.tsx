import { useEffect, useState } from 'react'
import { Alert, Badge, Card, CardBody, CardHeader, CardTitle, Col, Container, Row, Spinner, Table } from 'react-bootstrap'
import { TbAlertCircle, TbCurrencyDong, TbPackage, TbShoppingCart, TbUsers } from 'react-icons/tb'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import StatisticCard from '@/components/dashboard/StatisticCard'
import { dashboardApi, type DashboardStats, type RecentOrder } from '@/api/dashboardApi'

const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount)

const formatNumber = (n: number) => new Intl.NumberFormat('vi-VN').format(n)

const ORDER_STATUS_LABELS: Record<string, { label: string; variant: string }> = {
  pending: { label: 'Chờ xử lý', variant: 'warning' },
  processing: { label: 'Đang xử lý', variant: 'info' },
  completed: { label: 'Hoàn thành', variant: 'success' },
  cancelled: { label: 'Đã hủy', variant: 'danger' },
  paid: { label: 'Đã thanh toán', variant: 'success' },
}

const statusInfo = (status: string) =>
  ORDER_STATUS_LABELS[status] ?? { label: status, variant: 'secondary' }

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchAll = async () => {
      setLoading(true)
      setError(null)
      try {
        const [statsRes, ordersRes] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getRecentOrders(),
        ])
        if (!cancelled) {
          setStats(statsRes)
          setRecentOrders(ordersRes.data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void fetchAll()
    return () => { cancelled = true }
  }, [])

  return (
    <Container fluid>
      <PageBreadcrumb title="Dashboard" />

      {loading && (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {!loading && error && (
        <Alert variant="danger" className="d-flex align-items-center gap-2">
          <TbAlertCircle className="fs-20 flex-shrink-0" />
          <span>{error}</span>
        </Alert>
      )}

      {!loading && !error && stats && (
        <>
          {/* Statistic cards */}
          <Row xs={1} sm={2} xl={4} className="g-3 mb-4">
            <Col>
              <StatisticCard
                title="Tổng đơn hàng"
                value={formatNumber(stats.totalOrders)}
                icon={TbShoppingCart}
                iconBg="primary"
              />
            </Col>
            <Col>
              <StatisticCard
                title="Doanh thu"
                value={formatVND(stats.totalRevenue)}
                icon={TbCurrencyDong}
                iconBg="success"
              />
            </Col>
            <Col>
              <StatisticCard
                title="Sản phẩm"
                value={formatNumber(stats.totalProducts)}
                icon={TbPackage}
                iconBg="warning"
              />
            </Col>
            <Col>
              <StatisticCard
                title="Khách hàng"
                value={formatNumber(stats.totalCustomers)}
                icon={TbUsers}
                iconBg="info"
              />
            </Col>
          </Row>

          <Row className="g-3">
            {/* Recent orders */}
            <Col xl={8}>
              <Card className="h-100">
                <CardHeader>
                  <CardTitle as="h5" className="mb-0">Đơn hàng mới nhất</CardTitle>
                </CardHeader>
                <CardBody className="p-0">
                  {recentOrders.length === 0 ? (
                    <div className="text-center text-muted py-5">Chưa có đơn hàng nào</div>
                  ) : (
                    <Table responsive hover className="mb-0 align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Mã đơn</th>
                          <th>Khách hàng</th>
                          <th>Tổng tiền</th>
                          <th>Trạng thái</th>
                          <th>Ngày tạo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => {
                          const ps = statusInfo(order.paymentStatus)
                          return (
                            <tr key={order.id}>
                              <td>
                                <span className="fw-semibold text-primary">{order.orderCode}</span>
                              </td>
                              <td>{order.customerName}</td>
                              <td className="text-nowrap">{formatVND(order.total)}</td>
                              <td>
                                <Badge bg={ps.variant} className="bg-opacity-15" style={{ color: `var(--bs-${ps.variant})` }}>
                                  {ps.label}
                                </Badge>
                              </td>
                              <td className="text-muted text-nowrap" style={{ fontSize: 12 }}>
                                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </Table>
                  )}
                </CardBody>
              </Card>
            </Col>

            {/* Order status breakdown */}
            <Col xl={4}>
              <Card className="h-100">
                <CardHeader>
                  <CardTitle as="h5" className="mb-0">Thống kê trạng thái đơn</CardTitle>
                </CardHeader>
                <CardBody>
                  {Object.entries(stats.ordersByStatus).length === 0 ? (
                    <div className="text-center text-muted py-4">Chưa có dữ liệu</div>
                  ) : (
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                      {Object.entries(stats.ordersByStatus).map(([key, count]) => {
                        const total = Object.values(stats.ordersByStatus).reduce((a, b) => a + b, 0)
                        const pct = total > 0 ? Math.round((count / total) * 100) : 0
                        const info = statusInfo(key)
                        return (
                          <li key={key}>
                            <div className="d-flex justify-content-between mb-1" style={{ fontSize: 13 }}>
                              <span>{info.label}</span>
                              <span className="fw-semibold">{formatNumber(count)}</span>
                            </div>
                            <div className="progress" style={{ height: 6 }}>
                              <div
                                className={`progress-bar bg-${info.variant}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Empty state — API returned but stats is null (shouldn't normally happen) */}
      {!loading && !error && !stats && (
        <div className="text-center text-muted py-5">
          <TbPackage className="fs-48 mb-2 d-block mx-auto" />
          <p>Chưa có dữ liệu dashboard</p>
        </div>
      )}
    </Container>
  )
}

export default DashboardPage
