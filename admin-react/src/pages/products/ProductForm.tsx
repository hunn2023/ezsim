import { useEffect, useState } from 'react'
import {
  Button, Card, CardBody, CardHeader, Col,
  Form, FormControl, FormSelect, InputGroup, Row, Spinner,
} from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TbRefresh } from 'react-icons/tb'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { categoryApi } from '@/api/categoryApi'
import ImageUploader from '@/components/common/ImageUploader'
import type { Category } from '@/types/category'
import type { ProductFormData } from '@/types/product'

// ─── slug helper ──────────────────────────────────────────────────────────────

function toSlug(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// ─── validation schema ────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(2, 'Tên tối thiểu 2 ký tự'),
  slug: z.string().min(2, 'Slug tối thiểu 2 ký tự').regex(/^[a-z0-9-]+$/, 'Slug chỉ gồm a-z, 0-9, dấu gạch ngang'),
  sku: z.string().min(2, 'SKU tối thiểu 2 ký tự'),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number({ invalid_type_error: 'Vui lòng nhập giá' }).min(0, 'Giá không được âm'),
  salePrice: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? null : Number(v)),
    z.number().min(0, 'Giá sale không được âm').nullable().optional(),
  ),
  stock: z.coerce.number({ invalid_type_error: 'Vui lòng nhập tồn kho' }).int().min(0, 'Tồn kho không được âm'),
  featured: z.boolean(),
  status: z.enum(['active', 'inactive']),
})

type FormValues = z.infer<typeof schema>

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  defaultValues?: Partial<FormValues & { thumbnail?: string; images?: string[] }>
  onSubmit: (data: ProductFormData) => Promise<void>
  submitLabel?: string
  isSubmitting?: boolean
}

export default function ProductForm({ defaultValues, onSubmit, submitLabel = 'Lưu sản phẩm', isSubmitting = false }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const [catsLoading, setCatsLoading] = useState(true)
  const [thumbnail, setThumbnail] = useState<string>(defaultValues?.thumbnail ?? '')
  const [imageList, setImageList] = useState<string[]>(defaultValues?.images ?? [])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      slug: '',
      sku: '',
      categoryId: '',
      shortDescription: '',
      description: '',
      price: 0,
      salePrice: null,
      stock: 0,
      featured: false,
      status: 'active',
      ...defaultValues,
    },
  })

  const nameValue = watch('name')

  useEffect(() => {
    categoryApi.getAll()
      .then((res) => setCategories(res.data.filter((c) => c.status === 'active')))
      .catch(() => {})
      .finally(() => setCatsLoading(false))
  }, [])

  const handleAutoSlug = () => {
    const name = getValues('name')
    if (name) setValue('slug', toSlug(name), { shouldValidate: true })
  }

  useEffect(() => {
    if (!defaultValues?.slug && nameValue) {
      setValue('slug', toSlug(nameValue), { shouldValidate: false })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameValue])

  const handleFormSubmit = (values: FormValues) => {
    const data: ProductFormData = {
      name: values.name,
      slug: values.slug,
      sku: values.sku,
      categoryId: values.categoryId,
      shortDescription: values.shortDescription,
      description: values.description,
      price: values.price,
      salePrice: values.salePrice ?? null,
      stock: values.stock,
      thumbnail: thumbnail || undefined,
      images: imageList,
      featured: values.featured,
      status: values.status,
    }
    return onSubmit(data)
  }

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Row className="g-3">
        {/* ── Left column ─────────────────────────────── */}
        <Col lg={8}>
          {/* Basic info */}
          <Card className="mb-3">
            <CardHeader><strong>Thông tin cơ bản</strong></CardHeader>
            <CardBody className="d-flex flex-column gap-3">
              {/* Tên */}
              <Form.Group>
                <Form.Label>Tên sản phẩm <span className="text-danger">*</span></Form.Label>
                <FormControl
                  {...register('name')}
                  placeholder="VD: eSIM Nhật Bản 7 ngày 10GB"
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
              </Form.Group>

              {/* Slug */}
              <Form.Group>
                <Form.Label>Slug <span className="text-danger">*</span></Form.Label>
                <InputGroup>
                  <FormControl
                    {...register('slug')}
                    placeholder="esim-nhat-ban-7-ngay-10gb"
                    isInvalid={!!errors.slug}
                  />
                  <Button variant="outline-secondary" type="button" onClick={handleAutoSlug} title="Tạo slug từ tên">
                    <TbRefresh />
                  </Button>
                  <Form.Control.Feedback type="invalid">{errors.slug?.message}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              {/* SKU */}
              <Form.Group>
                <Form.Label>SKU <span className="text-danger">*</span></Form.Label>
                <FormControl
                  {...register('sku')}
                  placeholder="VD: ESIM-JP-7D-10G"
                  isInvalid={!!errors.sku}
                />
                <Form.Control.Feedback type="invalid">{errors.sku?.message}</Form.Control.Feedback>
              </Form.Group>

              {/* Danh mục */}
              <Form.Group>
                <Form.Label>Danh mục <span className="text-danger">*</span></Form.Label>
                <FormSelect {...register('categoryId')} isInvalid={!!errors.categoryId} disabled={catsLoading}>
                  <option value="">{catsLoading ? 'Đang tải...' : '— Chọn danh mục —'}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </FormSelect>
                <Form.Control.Feedback type="invalid">{errors.categoryId?.message}</Form.Control.Feedback>
              </Form.Group>

              {/* Mô tả ngắn */}
              <Form.Group>
                <Form.Label>Mô tả ngắn</Form.Label>
                <FormControl
                  as="textarea"
                  rows={2}
                  {...register('shortDescription')}
                  placeholder="Mô tả ngắn hiển thị trong danh sách..."
                />
              </Form.Group>
            </CardBody>
          </Card>

          {/* Description (rich text) */}
          <Card className="mb-3">
            <CardHeader><strong>Mô tả chi tiết</strong></CardHeader>
            <CardBody>
              <ReactQuill
                theme="snow"
                value={watch('description') ?? ''}
                onChange={(val) => setValue('description', val)}
                style={{ minHeight: 180 }}
              />
            </CardBody>
          </Card>

          {/* Extra images */}
          <Card className="mb-3">
            <CardHeader><strong>Ảnh phụ</strong></CardHeader>
            <CardBody>
              <ImageUploader
                multiple
                value={imageList}
                onChange={setImageList}
                maxSizeMB={5}
              />
            </CardBody>
          </Card>
        </Col>

        {/* ── Right column ─────────────────────────────── */}
        <Col lg={4}>
          {/* Pricing */}
          <Card className="mb-3">
            <CardHeader><strong>Giá & Tồn kho</strong></CardHeader>
            <CardBody className="d-flex flex-column gap-3">
              <Form.Group>
                <Form.Label>Giá bán (VNĐ) <span className="text-danger">*</span></Form.Label>
                <FormControl
                  type="number"
                  min={0}
                  {...register('price')}
                  isInvalid={!!errors.price}
                  placeholder="0"
                />
                <Form.Control.Feedback type="invalid">{errors.price?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>Giá khuyến mãi (VNĐ)</Form.Label>
                <FormControl
                  type="number"
                  min={0}
                  {...register('salePrice')}
                  isInvalid={!!errors.salePrice}
                  placeholder="Để trống nếu không có"
                />
                <Form.Control.Feedback type="invalid">{errors.salePrice?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>Tồn kho <span className="text-danger">*</span></Form.Label>
                <FormControl
                  type="number"
                  min={0}
                  step={1}
                  {...register('stock')}
                  isInvalid={!!errors.stock}
                  placeholder="0"
                />
                <Form.Control.Feedback type="invalid">{errors.stock?.message}</Form.Control.Feedback>
              </Form.Group>
            </CardBody>
          </Card>

          {/* Thumbnail */}
          <Card className="mb-3">
            <CardHeader><strong>Ảnh đại diện</strong></CardHeader>
            <CardBody>
              <ImageUploader
                value={thumbnail}
                onChange={(url) => setThumbnail(url ?? '')}
                maxSizeMB={5}
              />
            </CardBody>
          </Card>

          {/* Status & options */}
          <Card className="mb-3">
            <CardHeader><strong>Trạng thái</strong></CardHeader>
            <CardBody className="d-flex flex-column gap-2">
              <FormSelect {...register('status')}>
                <option value="active">Hoạt động</option>
                <option value="inactive">Ẩn</option>
              </FormSelect>

              <Form.Check
                type="switch"
                id="featured-switch"
                label="Sản phẩm nổi bật"
                {...register('featured')}
              />
            </CardBody>
          </Card>

          {/* Submit */}
          <div className="d-grid">
            <Button type="submit" variant="primary" disabled={isSubmitting} size="lg">
              {isSubmitting ? <><Spinner animation="border" size="sm" className="me-2" />Đang lưu...</> : submitLabel}
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  )
}
