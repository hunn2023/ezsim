import { useEffect, useState } from 'react'
import { Alert, Container, Spinner } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router'
import Swal from 'sweetalert2'
import { TbAlertCircle } from 'react-icons/tb'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import ProductForm from './ProductForm'
import { productApi } from '@/api/productApi'
import type { Product, ProductFormData } from '@/types/product'

const toast = (icon: 'success' | 'error', title: string) =>
  Swal.fire({ toast: true, position: 'top-end', icon, title, timer: 2500, showConfirmButton: false, timerProgressBar: true })

const ProductEditPage = () => {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!productId) return
    setLoading(true)
    productApi.getById(productId)
      .then(setProduct)
      .catch((err: Error & { status?: number }) => {
        if (err.status === 404 || err.message.includes('tìm thấy')) setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [productId])

  const handleSubmit = async (data: ProductFormData) => {
    if (!productId || submitting) return
    setSubmitting(true)
    try {
      await productApi.update(productId, data)
      await toast('success', `Đã cập nhật "${data.name}"`)
      void navigate('/products')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Cập nhật thất bại'
      await toast('error', msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container fluid>
      <PageBreadcrumb title="Sửa sản phẩm" subtitle="Sản phẩm" />

      {loading && (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {!loading && notFound && (
        <Alert variant="danger" className="d-flex align-items-center gap-2">
          <TbAlertCircle className="fs-20 flex-shrink-0" />
          Không tìm thấy sản phẩm. Sản phẩm có thể đã bị xóa.
        </Alert>
      )}

      {!loading && !notFound && product && (
        <ProductForm
          defaultValues={{
            name: product.name,
            slug: product.slug,
            sku: product.sku,
            categoryId: product.categoryId,
            shortDescription: product.shortDescription,
            description: product.description,
            price: product.price,
            salePrice: product.salePrice,
            stock: product.stock,
            thumbnail: product.image ?? '',
            images: product.images,
            featured: product.featured,
            status: product.status,
          }}
          onSubmit={handleSubmit}
          isSubmitting={submitting}
          submitLabel="Lưu thay đổi"
        />
      )}
    </Container>
  )
}

export default ProductEditPage
