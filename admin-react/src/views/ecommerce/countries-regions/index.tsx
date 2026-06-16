import { Container, Nav, Card, CardHeader } from 'react-bootstrap'
import { useState } from 'react'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import RegionsTable from './components/RegionsTable'
import CountriesTable from './components/CountriesTable'
import { TbMap, TbFlag } from 'react-icons/tb'

const Page = () => {
  const [activeTab, setActiveTab] = useState<'countries' | 'regions'>('countries')

  return (
    <Container fluid className="py-3">
      <PageBreadcrumb title="Quốc gia & Vùng du lịch" subtitle="E-commerce Catalog" />

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <CardHeader className="bg-white border-bottom p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <Nav variant="pills" className="bg-light p-1 rounded-pill gap-1 shadow-sm">
              <Nav.Item>
                <Nav.Link
                  className={`rounded-pill px-4 fw-semibold py-2 fs-sm d-flex align-items-center ${activeTab === 'countries' ? 'bg-primary text-white shadow-sm' : 'text-dark'}`}
                  onClick={() => setActiveTab('countries')}>
                  <TbFlag className="me-2 fs-base" /> Danh sách Quốc gia
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  className={`rounded-pill px-4 fw-semibold py-2 fs-sm d-flex align-items-center ${activeTab === 'regions' ? 'bg-primary text-white shadow-sm' : 'text-dark'}`}
                  onClick={() => setActiveTab('regions')}>
                  <TbMap className="me-2 fs-base" /> Danh mục Vùng du lịch
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </CardHeader>

        <div className="p-0">
          {activeTab === 'countries' ? (
            <CountriesTable />
          ) : (
            <RegionsTable />
          )}
        </div>
      </Card>
    </Container>
  )
}

export default Page
