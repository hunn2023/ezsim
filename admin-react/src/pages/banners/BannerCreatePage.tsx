import { useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import { TbArrowLeft } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import BannerForm from '@/pages/banners/BannerForm'
import { bannerApi, type BannerFormData } from '@/api/bannerApi'

const toast = (icon: 'success' | 'error', title: string) =>
  Swal.fire({ toast: true, position: 'top-end', icon, title, timer: 2500, showConfirmButton: false, timerProgressBar: true })

const BannerCreatePage = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: BannerFormData) => {
    setIsSubmitting(true)
    try {
      const saved = await bannerApi.create(data)
      await toast('success', `Đã thêm banner "${saved.title}"`)
      void navigate('/banners')
    } catch (err) {
      await toast('error', err instanceof Error ? err.message : 'Lưu banner thất bại')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container fluid>
      <PageBreadcrumb title="Thêm banner" subtitle="Marketing" />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 fw-bold">Thêm banner mới</h5>
        <Button variant="outline-secondary" size="sm" onClick={() => void navigate('/banners')}>
          <TbArrowLeft className="me-1" /> Quay lại
        </Button>
      </div>

      <BannerForm
        onSubmit={handleSubmit}
        submitLabel="Thêm banner"
        isSubmitting={isSubmitting}
        onCancel={() => void navigate('/banners')}
      />
    </Container>
  )
}

export default BannerCreatePage
