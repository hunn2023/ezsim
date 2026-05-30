import {
  Button, Card, CardBody, CardHeader, Col,
  Form, FormControl, FormLabel, FormSelect, Row, Spinner,
} from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TbPhotoOff } from 'react-icons/tb'
import ImageUploader from '@/components/common/ImageUploader'
import type { BannerFormData } from '@/api/bannerApi'

const schema = z.object({
  title: z.string().min(2, 'Tiêu đề phải có ít nhất 2 ký tự'),
  description: z.string().optional(),
  image: z.string().min(1, 'Vui lòng tải lên ảnh banner'),
  linkUrl: z.string().optional(),
  position: z.enum(['hero', 'promotion', 'sidebar', 'footer']),
  sortOrder: z.coerce.number({ invalid_type_error: 'Thứ tự là số' }).int().min(0, 'Thứ tự không âm'),
  status: z.enum(['active', 'inactive']),
})

type FormValues = z.infer<typeof schema>

const POSITION_OPTIONS: Array<{ value: FormValues['position']; label: string; hint: string }> = [
  { value: 'hero',      label: 'Hero (trên cùng)',  hint: 'Slider lớn ngay đầu trang chủ' },
  { value: 'promotion', label: 'Khuyến mãi',        hint: 'Khu vực ưu đãi giữa trang' },
  { value: 'sidebar',   label: 'Sidebar',           hint: 'Cột phải, các trang danh sách sản phẩm' },
  { value: 'footer',    label: 'Footer',            hint: 'Phía cuối trang, dạng dải nhỏ' },
]

interface Props {
  defaultValues?: Partial<FormValues>
  onSubmit: (data: BannerFormData) => Promise<void> | void
  submitLabel?: string
  isSubmitting?: boolean
  onCancel?: () => void
}

export default function BannerForm({
  defaultValues,
  onSubmit,
  submitLabel = 'Lưu banner',
  isSubmitting = false,
  onCancel,
}: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      image: '',
      linkUrl: '',
      position: 'hero',
      sortOrder: 1,
      status: 'active',
      ...defaultValues,
    },
  })

  const imageValue = watch('image')
  const titleValue = watch('title')
  const descriptionValue = watch('description')
  const positionValue = watch('position')

  const submit = (values: FormValues) => {
    const payload: BannerFormData = {
      title: values.title,
      description: values.description?.trim() || undefined,
      image: values.image,
      linkUrl: values.linkUrl?.trim() || undefined,
      position: values.position,
      sortOrder: values.sortOrder,
      status: values.status,
    }
    return onSubmit(payload)
  }

  const positionLabel = POSITION_OPTIONS.find((o) => o.value === positionValue)?.label ?? positionValue

  return (
    <Form onSubmit={handleSubmit(submit)} noValidate>
      <Row className="g-3">
        {/* ── Left column: form ─────────────────────────── */}
        <Col lg={7}>
          <Card className="mb-3">
            <CardHeader><strong>Thông tin banner</strong></CardHeader>
            <CardBody className="d-flex flex-column gap-3">
              <Form.Group>
                <FormLabel>Tiêu đề <span className="text-danger">*</span></FormLabel>
                <FormControl
                  {...register('title')}
                  placeholder="VD: Khuyến mãi eSIM Du lịch hè 2026"
                  isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <FormLabel>Mô tả ngắn</FormLabel>
                <FormControl
                  as="textarea"
                  rows={3}
                  {...register('description')}
                  placeholder="Mô tả ngắn hiển thị bên dưới tiêu đề banner..."
                />
                <Form.Text className="text-muted">Tối đa 1–2 dòng để hiển thị tốt trên storefront.</Form.Text>
              </Form.Group>

              <Form.Group>
                <FormLabel>Ảnh banner <span className="text-danger">*</span></FormLabel>
                <ImageUploader
                  value={imageValue || undefined}
                  onChange={(url) => setValue('image', url ?? '', { shouldValidate: true })}
                  maxSizeMB={5}
                />
                {errors.image && (
                  <div className="text-danger" style={{ fontSize: 13 }}>{errors.image.message}</div>
                )}
                <Form.Text className="text-muted">Nên dùng ảnh tỉ lệ 16:6 (VD 1600×600) để hiển thị rõ ở vị trí Hero.</Form.Text>
              </Form.Group>

              <Form.Group>
                <FormLabel>Đường dẫn (link)</FormLabel>
                <FormControl
                  {...register('linkUrl')}
                  placeholder="VD: /products?category=esim-du-lich"
                />
                <Form.Text className="text-muted">Nơi banner sẽ chuyển đến khi nhấp. Bỏ trống nếu không liên kết.</Form.Text>
              </Form.Group>
            </CardBody>
          </Card>

          <Card className="mb-3">
            <CardHeader><strong>Hiển thị</strong></CardHeader>
            <CardBody>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <FormLabel>Vị trí <span className="text-danger">*</span></FormLabel>
                    <FormSelect {...register('position')} isInvalid={!!errors.position}>
                      {POSITION_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </FormSelect>
                    <Form.Text className="text-muted">
                      {POSITION_OPTIONS.find((o) => o.value === positionValue)?.hint}
                    </Form.Text>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <FormLabel>Thứ tự hiển thị</FormLabel>
                    <FormControl
                      type="number"
                      min={0}
                      {...register('sortOrder')}
                      isInvalid={!!errors.sortOrder}
                    />
                    <Form.Control.Feedback type="invalid">{errors.sortOrder?.message}</Form.Control.Feedback>
                    <Form.Text className="text-muted">Số nhỏ hơn sẽ hiển thị trước.</Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mt-3">
                <FormLabel>Trạng thái</FormLabel>
                <div className="d-flex gap-4">
                  <Form.Check type="radio" id="banner-active"   label="Hoạt động" value="active"   {...register('status')} />
                  <Form.Check type="radio" id="banner-inactive" label="Ẩn"        value="inactive" {...register('status')} />
                </div>
              </Form.Group>
            </CardBody>
          </Card>

          {/* Submit row */}
          <div className="d-flex gap-2 justify-content-end">
            {onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
                Hủy
              </Button>
            )}
            <Button type="submit" variant="primary" disabled={isSubmitting} className="d-flex align-items-center gap-2">
              {isSubmitting && <Spinner animation="border" size="sm" />}
              {submitLabel}
            </Button>
          </div>
        </Col>

        {/* ── Right column: preview ─────────────────────── */}
        <Col lg={5}>
          <Card className="position-sticky" style={{ top: 16 }}>
            <CardHeader className="d-flex justify-content-between align-items-center">
              <strong>Xem trước</strong>
              <span className="text-muted" style={{ fontSize: 12 }}>{positionLabel}</span>
            </CardHeader>
            <CardBody>
              {imageValue ? (
                <div className="position-relative rounded overflow-hidden border" style={{ background: '#f5f5f5' }}>
                  <img
                    src={imageValue}
                    alt={titleValue || 'Banner preview'}
                    style={{ width: '100%', aspectRatio: '16 / 6', objectFit: 'cover', display: 'block' }}
                  />
                  {(titleValue || descriptionValue) && (
                    <div
                      className="position-absolute bottom-0 start-0 end-0 p-3 text-white"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0))' }}
                    >
                      {titleValue && <div className="fw-bold" style={{ fontSize: 18, lineHeight: 1.2 }}>{titleValue}</div>}
                      {descriptionValue && (
                        <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>{descriptionValue}</div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="d-flex flex-column align-items-center justify-content-center text-muted rounded border"
                  style={{ aspectRatio: '16 / 6', background: '#fafafa' }}
                >
                  <TbPhotoOff style={{ fontSize: 32 }} />
                  <div className="mt-2" style={{ fontSize: 13 }}>Chưa có ảnh để xem trước</div>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Form>
  )
}
