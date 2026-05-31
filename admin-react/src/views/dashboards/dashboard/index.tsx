import { Col, Container, Row } from 'react-bootstrap'

import StatCards from './components/StatCards'
import WelcomeRevenueProgress from './components/WelcomeRevenueProgress'
import CarrierStockWidget from './components/CarrierStockWidget'
import TopProductsWidget from './components/TopProductsWidget'
import PageMetaData from '@/components/PageMetaData'

const Page = () => {
  return (
    <>
      <PageMetaData title="Dashboard – EZSim Admin" />
      <Container fluid>
        <Row className="mt-3">
          <Col xs={12}>
            <WelcomeRevenueProgress />
          </Col>
        </Row>

        <StatCards />

        <Row className="g-3 mt-1">
          <Col xxl={4} xl={6}>
            <CarrierStockWidget />
          </Col>
          <Col xxl={8} xl={6}>
            <TopProductsWidget />
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Page
