import clsx from 'clsx'
import { Card, CardBody, Col, Row, Button } from 'react-bootstrap'
import { TbDeviceMobile, TbCreditCard, TbCoins, TbCheck, TbRotateClockwise } from 'react-icons/tb'
import { useTelecomProducts } from '../../../../hooks/useTelecomProducts'

const ProductStats = () => {
  const { simProducts, cardProducts, resetToInitial } = useTelecomProducts()

  const totalSims = simProducts.length
  const availableSims = simProducts.filter((s) => s.status === 'available').length
  const totalCards = cardProducts.length
  const totalCardStock = cardProducts.reduce((sum, c) => sum + c.stockCount, 0)
  
  const totalInventoryValue =
    simProducts.reduce((sum, s) => sum + (s.status === 'available' ? s.price : 0), 0) +
    cardProducts.reduce((sum, c) => sum + c.price * c.stockCount, 0)

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  }

  const stats = [
    {
      id: 'sims',
      title: 'Tổng số lượng SIM',
      value: totalSims.toString(),
      subValue: `${availableSims} đang có sẵn`,
      icon: TbDeviceMobile,
      iconBg: 'primary',
      metric: 'Tỷ lệ sẵn sàng',
      metricValue: totalSims > 0 ? `${Math.round((availableSims / totalSims) * 100)}%` : '0%',
    },
    {
      id: 'cards',
      title: 'Mã thẻ & Thẻ Data',
      value: totalCards.toString(),
      subValue: `${totalCardStock} mã thẻ trong kho`,
      icon: TbCreditCard,
      iconBg: 'info',
      metric: 'Mệnh giá từ 10K - 500K',
      metricValue: 'Sẵn sàng',
    },
    {
      id: 'value',
      title: 'Tổng giá trị kho hàng',
      value: formatVND(totalInventoryValue),
      subValue: 'Ước tính doanh thu',
      icon: TbCoins,
      iconBg: 'success',
      metric: 'Hệ sinh thái',
      metricValue: 'SIM & Thẻ',
    },
  ]

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0 fw-bold text-dark">Thống Kê Tổng Quan Kho Hàng</h4>
        <Button variant="outline-warning" size="sm" onClick={resetToInitial} title="Đặt lại dữ liệu mẫu ban đầu">
          <TbRotateClockwise className="me-1 fs-sm" /> Reset Dữ liệu Mẫu
        </Button>
      </div>
      <Row className="row-cols-xl-3 row-cols-md-3 row-cols-1 g-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Col key={stat.id}>
              <Card className="h-100 border-0 shadow-sm rounded-3 overflow-hidden">
                <CardBody className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <span className="text-muted text-uppercase fw-semibold fs-xs">{stat.title}</span>
                      <h3 className="mb-1 mt-2 fw-bolder text-dark">{stat.value}</h3>
                      <p className="text-muted fs-xs mb-0">{stat.subValue}</p>
                    </div>
                    <div className="avatar-lg flex-shrink-0">
                      <span className={clsx('avatar-title fs-22 rounded-circle shadow-sm', 'text-bg-' + stat.iconBg)}>
                        <Icon size={26} />
                      </span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
                    <span className="text-muted fs-xs d-flex align-items-center">
                      <TbCheck className="text-success me-1 fs-base" /> {stat.metric}
                    </span>
                    <span className="fw-bold fs-xs text-dark">{stat.metricValue}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default ProductStats
