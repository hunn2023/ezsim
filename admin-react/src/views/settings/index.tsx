import { Container } from 'react-bootstrap'
import PageBreadcrumb from '@/components/PageBreadcrumb'

const Page = () => {
  return (
    <Container fluid>
      <PageBreadcrumb title="Cài đặt" />
      <div className="card p-4 text-center text-muted">
        <p className="mb-0">Cài đặt hệ thống — đang phát triển</p>
      </div>
    </Container>
  )
}

export default Page
