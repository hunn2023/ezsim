import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { TbPointFilled, TbArrowUpRight, TbArrowDownRight } from 'react-icons/tb'
import { TbCurrencyDong, TbShoppingCart, TbDeviceSim, TbCreditCard, TbClock } from 'react-icons/tb'
import { Link } from 'react-router'
import CountUp from 'react-countup'
import { useDashboardStats } from '@/hooks/useDashboardStats'

const formatMillions = (val: number) => {
  if (val >= 1_000_000_000) return { value: val / 1_000_000_000, suffix: ' tỷ' }
  if (val >= 1_000_000) return { value: val / 1_000_000, suffix: ' tr' }
  return { value: val / 1_000, suffix: 'k' }
}

const StatCards = () => {
  const stats = useDashboardStats()

  const todayRevenue = formatMillions(stats.totalRevenueTodayVND)
  const monthRevenue = formatMillions(stats.totalRevenueMonthVND)

  const cards = [
    {
      id: 1,
      title: 'Doanh thu hôm nay',
      value: todayRevenue.value,
      suffix: todayRevenue.suffix + ' ₫',
      decimals: 1,
      badgeText: '+12.5%',
      badgeVariant: 'success',
      icon: TbCurrencyDong,
      pointColor: 'success',
      description: 'Tháng này:',
      total: new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 }).format(stats.totalRevenueMonthVND) + '₫',
      url: '/reports/sales',
    },
    {
      id: 2,
      title: 'Đơn hàng tháng này',
      value: stats.totalOrdersMonth,
      suffix: '',
      decimals: 0,
      badgeText: `+${Math.round(stats.totalOrdersMonth * 0.08)} mới`,
      badgeVariant: 'primary',
      icon: TbShoppingCart,
      pointColor: 'primary',
      description: 'Hôm nay:',
      total: `${stats.totalOrdersToday} đơn`,
      url: '/orders',
    },
    {
      id: 3,
      title: 'SIM sẵn trong kho',
      value: stats.simAvailableCount,
      suffix: ' SIM',
      decimals: 0,
      badgeText: `${stats.simSoldCount} đã bán`,
      badgeVariant: 'secondary',
      icon: TbDeviceSim,
      pointColor: 'info',
      description: 'Tổng SP:',
      total: `${stats.totalSimProducts} loại`,
      url: '/inventory',
    },
    {
      id: 4,
      title: 'Thẻ cào sẵn trong kho',
      value: stats.cardAvailableCount,
      suffix: ' thẻ',
      decimals: 0,
      badgeText: `${stats.cardSoldCount} đã dùng`,
      badgeVariant: 'secondary',
      icon: TbCreditCard,
      pointColor: 'warning',
      description: 'Tổng SP:',
      total: `${stats.totalCardProducts} loại`,
      url: '/inventory',
    },
    {
      id: 5,
      title: 'Đơn chờ xử lý',
      value: stats.pendingOrders,
      suffix: ' đơn',
      decimals: 0,
      badgeText: `${stats.cancelledOrders} đã hủy`,
      badgeVariant: 'danger',
      icon: TbClock,
      pointColor: 'warning',
      description: 'Cần xem:',
      total: 'Ngay',
      url: '/orders',
    },
  ]

  return (
    <Row className="row-cols-xxl-5 row-cols-md-3 row-cols-1 align-items-center g-3 my-1">
      {cards.map((card) => {
        const IconComponent = card.icon
        const isNegative = card.badgeVariant === 'danger'
        return (
          <Col key={card.id}>
            <Card className="h-100 border-0 shadow-sm">
              <CardBody>
                <Link to={card.url} className="text-muted float-end mt-n1 fs-xl">
                  <TbArrowUpRight />
                </Link>
                <h6 className="text-muted mb-3 text-truncate" title={card.title}>
                  {card.title}
                </h6>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="avatar-md flex-shrink-0">
                    <span className={`avatar-title text-bg-light rounded-circle fs-22 text-${card.pointColor}`}>
                      <IconComponent />
                    </span>
                  </div>
                  <h4 className="mb-0 fw-bold">
                    <CountUp
                      end={card.value}
                      suffix={card.suffix}
                      decimals={card.decimals}
                      enableScrollSpy
                      scrollSpyOnce
                    />
                  </h4>
                  <span
                    className={`badge badge-soft-${card.badgeVariant} fw-medium ms-auto fs-xs d-flex align-items-center gap-1`}
                  >
                    {isNegative ? <TbArrowDownRight /> : <TbArrowUpRight />}
                    {card.badgeText}
                  </span>
                </div>
                <p className="mb-0 fs-sm">
                  <span className={`text-${card.pointColor}`}>
                    <TbPointFilled />
                  </span>
                  <span className="text-muted">{card.description}</span>
                  <span className="float-end fw-semibold">{card.total}</span>
                </p>
              </CardBody>
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}

export default StatCards
