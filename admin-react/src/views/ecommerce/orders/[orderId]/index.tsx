import { Col, Container, Row } from 'react-bootstrap'
import { useParams } from 'react-router'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import OrderSummary from './components/OrderSummary'
import CustomerDetails from './components/CustomerDetails'
import BillingDetails from './components/BillingDetails'
import ShippingAddress from './components/ShippingAddress'
import ShippingActivity from './components/ShippingActivity'
import { orders } from '../data'

const Page = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const order = orders.find((o) => o.id === orderId) || orders[0]

  return (
    <Container fluid>
      <PageBreadcrumb title={`Chi Tiết Đơn Hàng #${order.orderCode}`} subtitle="Quản lý Đơn hàng" />

      <Row className="justify-content-center">
        <Col xxl={12}>
          <Row className="g-4">
            <Col xl={8}>
              <OrderSummary order={order} />

              <ShippingActivity />
            </Col>
            <Col xl={4}>
              <CustomerDetails customer={order.customer} />

              <ShippingAddress address={order.shippingAddress} note={order.note} />

              <BillingDetails paymentInfo={order.paymentInfo} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default Page
