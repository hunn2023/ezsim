import { Container } from 'react-bootstrap'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import ProductStats from '@/views/ecommerce/products/components/ProductStats.tsx'
import ProductsListing from '@/views/ecommerce/products/components/ProductsListing.tsx'

const Page = () => {
  return (
    <Container fluid className="py-3">
      <PageBreadcrumb title="Quản lý Kho SIM & Thẻ Điện Thoại" subtitle="E-commerce Telecom" />

      <ProductStats />

      <ProductsListing />
    </Container>
  )
}

export default Page
