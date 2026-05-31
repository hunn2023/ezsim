import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { type OrderStatisticsType, orderStats } from '@/views/ecommerce/orders/data.ts'

const StatCard = ({ item }: { item: OrderStatisticsType }) => {
  return (
    <Card className="mb-3 border-0 shadow-sm rounded-4 bg-white overflow-hidden h-100">
      <CardBody className="p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="avatar-md flex-shrink-0">
            <span className={`avatar-title bg-${item.variant}-subtle text-${item.variant} rounded-circle fs-3 fw-bold shadow-sm`} style={{ width: '54px', height: '54px' }}>
              <item.icon />
            </span>
          </div>
          <span className={`badge bg-${item.variant}-subtle text-${item.variant} fs-xs px-2 py-1 rounded-pill border border-${item.variant}-subtle`}>
            {item.change}%
          </span>
        </div>
        <h3 className="fw-bolder text-dark mb-1 fs-3">{item.count}</h3>
        <p className="text-muted fw-medium fs-sm mb-0">{item.title}</p>
      </CardBody>
    </Card>
  )
}

const OrdersStats = () => {
  return (
    <Row className="row-cols-xxl-5 row-cols-md-3 row-cols-1 align-items-center g-1">
      {orderStats.map((item, idx) => (
        <Col key={idx}>
          <StatCard item={item} />
        </Col>
      ))}
    </Row>
  )
}

export default OrdersStats
