import { useEffect, useState } from 'react'
import { Container, Alert, Spinner, Button } from 'react-bootstrap'
import { useParams, Link } from 'react-router'
import { TbArrowLeft } from 'react-icons/tb'

import PageBreadcrumb from '@/components/PageBreadcrumb'
import { TelecomProductForm } from '../components/TelecomProductForm'
import { useTelecomProducts } from '../../../hooks/useTelecomProducts'
import { type TelecomProduct } from '../../../types/telecom'

const EditProductPage = () => {
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
        <p className="mt-2 text-muted">Đang tải thông tin sản phẩm...</p>
      </Container>
    )
  }

  if (!productData) {
    return (
      <Container fluid className="py-5 text-center">
        <Alert variant="warning" className="max-w-600 mx-auto p-4 rounded-4 shadow-sm">
          <h4 className="fw-bold">Không tìm thấy sản phẩm!</h4>
          <p className="text-muted">Sản phẩm với ID "{productId}" không tồn tại hoặc đã bị xóa.</p>
          <Link to="/products">
            <Button variant="primary" className="rounded-pill px-4 mt-3 fw-bold">
              <TbArrowLeft className="me-2" /> Quay lại danh sách
            </Button>
          </Link>
        </Alert>
      </Container>
    )
  }

  return (
    <Container fluid className="py-3">
      <PageBreadcrumb
        title={`Chỉnh sửa ${productData.type === 'sim' ? 'Số SIM' : 'Mã Thẻ'}: ${productData.type === 'sim' ? productData.simNumber : `${productData.carrier} ${productData.faceValue.toLocaleString()}đ`}`}
        subtitle="E-commerce Telecom"
      />
      <div className="max-w-1200 mx-auto">
        <div className="mb-3">
          <Link to="/products">
            <Button variant="link" className="text-dark fw-bold text-decoration-none px-0 d-flex align-items-center">
              <TbArrowLeft className="me-1" /> Quay lại danh sách
            </Button>
          </Link>
        </div>
        <TelecomProductForm initialData={productData} isEditMode={true} />
      </div>
    </Container>
  )
}

export default EditProductPage
