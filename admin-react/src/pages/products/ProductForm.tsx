import { useEffect, useState } from 'react'
import {
  Button, Card, CardBody, CardHeader, Col,
  Form, InputGroup, Row, Spinner,
} from 'react-bootstrap'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TbRefresh } from 'react-icons/tb'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { categoryApi } from '@/api/categoryApi'
import ImageUploader from '@/components/common/ImageUploader'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import Textarea from '@/components/common/Textarea'
import Switch from '@/components/common/Switch'
import FormField from '@/components/common/FormField'
import type { Category } from '@/types/category'
import type { ProductFormData } from '@/types/product'

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
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
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

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }))

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Row className="g-3">
        {/* ── Left column ─────────────────────────────── */}
        <Col lg={8}>
          <Card className="mb-3">
            <CardHeader><strong>Thông tin cơ bản</strong></CardHeader>
            <CardBody className="d-flex flex-column gap-3">
              <Input
                label="Tên sản phẩm"
                required
                placeholder="VD: eSIM Nhật Bản 7 ngày 10GB"
                error={errors.name?.message}
                {...register('name')}
              />

              <FormField label="Slug" required error={errors.slug?.message}>
                <InputGroup>
                  <Input
                    bare
                    placeholder="esim-nhat-ban-7-ngay-10gb"
                    error={errors.slug?.message}
                    {...register('slug')}
                  />
                  <Button variant="outline-secondary" type="button" onClick={handleAutoSlug} title="Tạo slug từ tên">
                    <TbRefresh />
                  </Button>
                </InputGroup>
              </FormField>

              <Input
                label="SKU"
                required
                placeholder="VD: ESIM-JP-7D-10G"
                error={errors.sku?.message}
                {...register('sku')}
              />

              <Select
                label="Danh mục"
                required
                loading={catsLoading}
                placeholder={catsLoading ? 'Đang tải...' : '— Chọn danh mục —'}
                options={categoryOptions}
                error={errors.categoryId?.message}
                {...register('categoryId')}
              />

              <Textarea
                label="Mô tả ngắn"
                rows={2}
                placeholder="Mô tả ngắn hiển thị trong danh sách..."
                {...register('shortDescription')}
              />
            </CardBody>
          </Card>

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
          <Card className="mb-3">
            <CardHeader><strong>Giá & Tồn kho</strong></CardHeader>
            <CardBody className="d-flex flex-column gap-3">
              <Input
                label="Giá bán (VNĐ)"
                required
                type="number"
                min={0}
                placeholder="0"
                error={errors.price?.message}
                {...register('price')}
              />

              <Input
                label="Giá khuyến mãi (VNĐ)"
                type="number"
                min={0}
                placeholder="Để trống nếu không có"
                error={errors.salePrice?.message}
                {...register('salePrice')}
              />

              <Input
                label="Tồn kho"
                required
                type="number"
                min={0}
                step={1}
                placeholder="0"
                error={errors.stock?.message}
                {...register('stock')}
              />
            </CardBody>
          </Card>

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

          <Card className="mb-3">
            <CardHeader><strong>Trạng thái</strong></CardHeader>
            <CardBody className="d-flex flex-column gap-2">
              <Select
                bare
                options={[
                  { value: 'active', label: 'Hoạt động' },
                  { value: 'inactive', label: 'Ẩn' },
                ]}
                {...register('status')}
              />

              <Switch
                label="Sản phẩm nổi bật"
                {...register('featured')}
              />
            </CardBody>
          </Card>

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
