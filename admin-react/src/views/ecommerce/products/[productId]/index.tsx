import { useEffect, useState } from 'react'
import { Card, CardBody, Col, Container, Row, Alert, Spinner, Button } from 'react-bootstrap'
import { useParams, Link } from 'react-router'
import { TbArrowLeft } from 'react-icons/tb'

import PageBreadcrumb from '@/components/PageBreadcrumb'
import ProductDisplay from '@/views/ecommerce/products/[productId]/components/ProductDisplay.tsx'
import ProductDetails from '@/views/ecommerce/products/[productId]/components/ProductDetails.tsx'
import ProductReviews from '@/views/ecommerce/reviews/components/ProductReviews.tsx'
import { useTelecomProducts } from '../../../../hooks/useTelecomProducts'
import { type TelecomProduct } from '../../../../types/telecom'

const Page = () => {
  const { productId } = useParams<{ productId: string }>()
  const { products } = useTelecomProducts()

  const [loading, setLoading] = useState(true)
  const [productData, setProductData] = useState<TelecomProduct | null>(null)

  useEffect(() => {
    if (productId) {
      const found = products.find((p) => p.id === productId)
      if (found) {
        setProductData(found)
      }
      setLoading(false)
    }
  }, [productId, products])

  if (loading) {
    return (
      <Container fluid className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Đang tải thông tin chi tiết...</p>
      </Container>
    )
  }

  if (!productData) {
    return (
      <Container fluid className="py-5 text-center">
        <Alert variant="warning" className="max-w-600 mx-auto p-4 rounded-4 shadow-sm">
          <h4 className="fw-bold">Không tìm thấy sản phẩm!</h4>
          <p className="text-muted">Sản phẩm với ID "{productId}" không tồn tại hoặc đã bị xóa khỏi kho.</p>
          <Link to="/products">
            <Button variant="primary" className="rounded-pill px-4 mt-3 fw-bold">
              <TbArrowLeft className="me-2" /> Quay lại kho hàng
            </Button>
          </Link>
        </Alert>
      </Container>
    )
  }

  return (
    <Container fluid className="py-3">
      <PageBreadcrumb title="Chi Tiết Sản Phẩm Viễn Thông" subtitle="E-commerce Telecom" />

      <div className="mb-3">
        <Link to="/products">
          <Button variant="link" className="text-dark fw-bold text-decoration-none px-0 d-flex align-items-center">
            <TbArrowLeft className="me-1" /> Quay lại danh sách
          </Button>
        </Link>
      </div>

      <Row className="g-4 justify-content-center">
        <Col lg={4} xl={4}>
          <ProductDisplay product={productData} />
        </Col>

        <Col lg={8} xl={8}>
          <div className="d-flex flex-column gap-4">
            <ProductDetails product={productData} />
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white p-4">
              <ProductReviews />
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Page
