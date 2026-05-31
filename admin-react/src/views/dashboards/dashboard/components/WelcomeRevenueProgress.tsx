import { Suspense } from 'react'
import { Badge, Button, Card, CardBody, Col, Row, Table } from 'react-bootstrap'
import { TbArrowRight, TbTrendingUp, TbCircleFilled } from 'react-icons/tb'
import { Link } from 'react-router'
import CountUp from 'react-countup'
import { RevenueChart } from '@/views/dashboards/dashboard/components/charts.tsx'
import { useDashboardStats } from '@/hooks/useDashboardStats'

const formatVND = (val: number) =>
  new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 }).format(val) + '₫'

const paymentBadge: Record<string, { label: string; variant: string }> = {
  paid: { label: 'Đã TT', variant: 'success' },
  pending: { label: 'Chờ TT', variant: 'warning' },
  processing: { label: 'Xử lý', variant: 'info' },
  cancelled: { label: 'Hủy', variant: 'danger' },
  refunded: { label: 'Hoàn', variant: 'secondary' },
  error: { label: 'Lỗi', variant: 'danger' },
}

const WelcomeRevenueProgress = () => {
  const stats = useDashboardStats()

  return (
    <Card className="border-0 shadow-sm">
      <CardBody className="p-0">
        <Row className="g-0">
          {/* LEFT — KPI summary */}
          <Col xxl={3} xl={6} className="order-xl-1 order-xxl-0">
            <div className="p-4 border-end border-dashed h-100 d-flex flex-column">
              <div className="mb-3">
                <h5 className="fw-bold mb-1">EZSim Dashboard</h5>
                <span className="text-muted fs-sm">
                  Có{' '}
                  <span className="text-warning fw-semibold">{stats.pendingOrders}</span>{' '}
                  đơn đang chờ xử lý.
                </span>
              </div>

              <div className="d-flex flex-column gap-3 flex-grow-1">
                <div className="d-flex justify-content-between align-items-center p-2 rounded bg-light bg-opacity-50">
                  <div>
                    <p className="mb-0 text-muted fs-xs text-uppercase fw-semibold">Doanh thu tháng</p>
                    <h6 className="mb-0 fw-bold text-success">
                      <CountUp
                        end={stats.totalRevenueMonthVND / 1_000_000}
                        decimals={1}
                        suffix=" tr₫"
                        enableScrollSpy
                        scrollSpyOnce
                      />
                    </h6>
                  </div>
                  <TbTrendingUp className="fs-2 text-success opacity-50" />
                </div>

                <div className="d-flex justify-content-between align-items-center p-2 rounded bg-light bg-opacity-50">
                  <div>
                    <p className="mb-0 text-muted fs-xs text-uppercase fw-semibold">Đơn hàng tháng</p>
                    <h6 className="mb-0 fw-bold text-primary">
                      <CountUp end={stats.totalOrdersMonth} suffix=" đơn" enableScrollSpy scrollSpyOnce />
                    </h6>
                  </div>
                  <span className="badge badge-soft-primary fs-sm">{stats.totalOrdersToday} hôm nay</span>
                </div>

                <div className="d-flex justify-content-between align-items-center p-2 rounded bg-light bg-opacity-50">
                  <div>
                    <p className="mb-0 text-muted fs-xs text-uppercase fw-semibold">Kho SIM sẵn</p>
                    <h6 className="mb-0 fw-bold text-info">
                      <CountUp end={stats.simAvailableCount} suffix=" SIM" enableScrollSpy scrollSpyOnce />
                    </h6>
                  </div>
                  <span className="badge badge-soft-danger fs-sm">{stats.simSoldCount} đã bán</span>
                </div>

                <div className="d-flex justify-content-between align-items-center p-2 rounded bg-light bg-opacity-50">
                  <div>
                    <p className="mb-0 text-muted fs-xs text-uppercase fw-semibold">Kho Thẻ sẵn</p>
                    <h6 className="mb-0 fw-bold text-warning">
                      <CountUp end={stats.cardAvailableCount} suffix=" thẻ" enableScrollSpy scrollSpyOnce />
                    </h6>
                  </div>
                  <span className="badge badge-soft-secondary fs-sm">{stats.cardSoldCount} đã dùng</span>
                </div>
              </div>

              <div className="text-center mt-3">
                <Link to="/reports/sales">
                  <Button variant="secondary" size="sm" className="rounded-pill px-3">
                    Xem báo cáo <TbArrowRight />
                  </Button>
                </Link>
              </div>
            </div>
          </Col>

          {/* CENTER — Revenue + Orders chart */}
          <Col xxl={6} className="order-xl-3 order-xxl-1">
            <div className="px-4 py-3 border-end border-dashed h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="card-title mb-0">Doanh thu & Đơn hàng</h5>
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="py-1 px-2 rounded-2 bg-light-subtle border text-success d-flex align-items-center gap-1"
                  >
                    <TbTrendingUp />
                    <span className="fw-bold fs-sm">+{stats.revenueGrowthPercent}%</span>
                  </div>
                  <Link to="/reports/sales" className="link-reset text-decoration-underline fw-semibold link-offset-3 fs-sm">
                    Chi tiết <TbArrowRight />
                  </Link>
                </div>
              </div>
              <p className="text-muted fs-xs mb-2">30 ngày qua trong tháng này</p>
              <Suspense>
                <RevenueChart />
              </Suspense>
            </div>
          </Col>

          {/* RIGHT — Recent orders */}
          <Col xxl={3} xl={6} className="order-xl-2 order-xxl-2">
            <div className="p-3 h-100 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-title mb-0">Đơn hàng gần đây</h6>
                <Link to="/orders" className="fs-sm text-muted">
                  Xem tất cả <TbArrowRight />
                </Link>
              </div>
              <div className="flex-grow-1 overflow-auto">
                <Table size="sm" className="align-middle mb-0 fs-xs">
                  <thead className="text-muted">
                    <tr>
                      <th className="border-0 pb-2">Mã đơn</th>
                      <th className="border-0 pb-2">Khách hàng</th>
                      <th className="border-0 pb-2 text-end">Tổng tiền</th>
                      <th className="border-0 pb-2">TT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order) => {
                      const ps = paymentBadge[order.paymentStatus] ?? { label: order.paymentStatus, variant: 'secondary' }
                      return (
                        <tr key={order.id}>
                          <td>
                            <Link to={`/orders/${order.id}`} className="fw-semibold text-primary">
                              {order.orderCode}
                            </Link>
                          </td>
                          <td className="text-muted text-truncate" style={{ maxWidth: 90 }}>
                            {order.customer.name}
                          </td>
                          <td className="text-end fw-semibold text-nowrap">
                            {formatVND(order.finalAmount)}
                          </td>
                          <td>
                            <Badge bg={ps.variant} className="fs-xxs">
                              {ps.label}
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </div>
              <div className="mt-2 pt-2 border-top border-dashed">
                <div className="d-flex justify-content-between align-items-center fs-xs text-muted">
                  <span>
                    <TbCircleFilled className="text-success me-1" />
                    Hôm nay: <b className="text-dark">{stats.totalOrdersToday} đơn</b>
                  </span>
                  <span>
                    Chờ: <b className="text-warning">{stats.pendingOrders}</b>
                  </span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default WelcomeRevenueProgress
