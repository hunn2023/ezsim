import { Container } from 'react-bootstrap'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { TelecomProductForm } from '../components/TelecomProductForm'

const Page = () => {
  return (
    <Container fluid className="py-3">
      <PageBreadcrumb title="Thêm Sản Phẩm Viễn Thông" subtitle="E-commerce Telecom" />
      <div className="max-w-1200 mx-auto">
        <TelecomProductForm />
      </div>
    </Container>
  )
}

export default Page
