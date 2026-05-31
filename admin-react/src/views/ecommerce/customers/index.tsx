import { Col, Container, Row } from 'react-bootstrap'

import PageBreadcrumb from '@/components/PageBreadcrumb'
import CustomersCard from './components/CustomersCard'

const Page = () => {
  return (
    <Container fluid>
      <PageBreadcrumb title="Hồ Sơ Khách Hàng" subtitle="Quản lý Khách hàng" />

      <Row className="justify-content-center">
        <Col xxl={10}>
          <CustomersCard />
        </Col>
      </Row>
    </Container>
  )
}

export default Page
