import { useState } from 'react'
import { Container } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import ProductForm from './ProductForm'
import { productApi } from '@/api/productApi'
import type { ProductFormData } from '@/types/product'

const toast = (icon: 'success' | 'error', title: string) =>
  Swal.fire({ toast: true, position: 'top-end', icon, title, timer: 2500, showConfirmButton: false, timerProgressBar: true })

const ProductCreatePage = () => {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (data: ProductFormData) => {
    if (submitting) return
    setSubmitting(true)
    try {
      await productApi.create(data)
      await toast('success', `Đã thêm sản phẩm "${data.name}"`)
      void navigate('/products')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Thêm sản phẩm thất bại'
      await toast('error', msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container fluid>
      <PageBreadcrumb title="Thêm sản phẩm" subtitle="Sản phẩm" />
      <ProductForm onSubmit={handleSubmit} isSubmitting={submitting} submitLabel="Thêm sản phẩm" />
    </Container>
  )
}

export default ProductCreatePage
