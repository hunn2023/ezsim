import { Container } from 'react-bootstrap'
import PageBreadcrumb from '@/components/PageBreadcrumb'

const Page = () => {
  return (
    <Container fluid>
      <PageBreadcrumb title="Banners" subtitle="Ecommerce" />
      <div className="card p-4 text-center text-muted">
        <p className="mb-0">Quản lý banner — đang phát triển</p>
      </div>
    </Container>
  )
}

export default Page
