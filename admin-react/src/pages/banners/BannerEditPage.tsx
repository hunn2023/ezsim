import { useEffect, useState } from 'react'
import { Alert, Button, Container, Spinner } from 'react-bootstrap'
import { TbAlertCircle, TbArrowLeft } from 'react-icons/tb'
import { useNavigate, useParams } from 'react-router'
import Swal from 'sweetalert2'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import BannerForm from '@/pages/banners/BannerForm'
import { bannerApi, type BannerFormData } from '@/api/bannerApi'
import type { Banner } from '@/types/banner'

const toast = (icon: 'success' | 'error', title: string) =>
  Swal.fire({ toast: true, position: 'top-end', icon, title, timer: 2500, showConfirmButton: false, timerProgressBar: true })

const BannerEditPage = () => {
  const { bannerId } = useParams<{ bannerId: string }>()
  const navigate = useNavigate()

  const [banner, setBanner] = useState<Banner | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!bannerId) return
    setLoading(true)
    bannerApi.getById(bannerId)
      .then(setBanner)
      .catch((err: Error & { status?: number }) => {
        if (err.status === 404 || err.message.includes('tìm thấy')) setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [bannerId])

  const handleSubmit = async (data: BannerFormData) => {
    if (!bannerId) return
    setIsSubmitting(true)
    try {
      const saved = await bannerApi.update(bannerId, data)
      await toast('success', `Đã cập nhật banner "${saved.title}"`)
      void navigate('/banners')
    } catch (err) {
      await toast('error', err instanceof Error ? err.message : 'Cập nhật banner thất bại')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container fluid>
      <PageBreadcrumb title="Sửa banner" subtitle="Marketing" />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 fw-bold">{banner ? `Sửa "${banner.title}"` : 'Sửa banner'}</h5>
        <Button variant="outline-secondary" size="sm" onClick={() => void navigate('/banners')}>
          <TbArrowLeft className="me-1" /> Quay lại
        </Button>
      </div>

      {loading && (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {!loading && notFound && (
        <Alert variant="danger" className="d-flex align-items-center gap-2">
          <TbAlertCircle className="fs-20" />
          <div>
            Không tìm thấy banner.
            <Button variant="link" className="p-0 ms-2" onClick={() => void navigate('/banners')}>← Quay lại danh sách</Button>
          </div>
        </Alert>
      )}

      {!loading && !notFound && banner && (
        <BannerForm
          defaultValues={{
            title: banner.title,
            description: banner.description ?? '',
            image: banner.image,
            linkUrl: banner.linkUrl ?? '',
            position: banner.position,
            sortOrder: banner.sortOrder,
            status: banner.status,
          }}
          onSubmit={handleSubmit}
          submitLabel="Lưu thay đổi"
          isSubmitting={isSubmitting}
          onCancel={() => void navigate('/banners')}
        />
      )}
    </Container>
  )
}

export default BannerEditPage
