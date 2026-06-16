import { Col, Container, Row } from 'react-bootstrap'

import PageBreadcrumb from '@/components/PageBreadcrumb'
import OrdersList from './components/OrdersList'
import OrdersStats from '@/views/ecommerce/orders/components/OrdersStats.tsx'

const Page = () => {
  return (
    <Container fluid>
      <PageBreadcrumb title="Quản Lý Đơn Hàng" subtitle="Hệ thống Giao dịch" />

      <OrdersStats />

      <Row>
        <Col cols={12}>
          <OrdersList />
        </Col>
      </Row>
    </Container>
  )
}

export default Page
