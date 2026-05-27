import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Button, Form, FormControl, FormLabel, FormSelect,
  InputGroup, Modal, ModalBody, ModalFooter, ModalHeader, Spinner,
} from 'react-bootstrap'
import { TbRefresh } from 'react-icons/tb'
import Swal from 'sweetalert2'
import { z } from 'zod'
import { categoryApi } from '@/api/categoryApi'
import type { Category } from '@/types/category'

// ─── Slug helpers ─────────────────────────────────────────────────────────────

const toSlug = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, (c) => (c === 'đ' ? 'd' : 'D'))
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  slug: z
    .string()
    .min(2, 'Slug phải có ít nhất 2 ký tự')
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang'),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
  status: z.enum(['active', 'inactive']),
})

type FormValues = z.infer<typeof schema>

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  show: boolean
  onHide: () => void
  editId?: string | null
  categories: Category[]
  onSaved: (cat: Category) => void
}

// ─── Modal ────────────────────────────────────────────────────────────────────

const toast = (icon: 'success' | 'error', title: string) =>
  Swal.fire({ toast: true, position: 'top-end', icon, title, timer: 2500, showConfirmButton: false, timerProgressBar: true })

const CategoryFormModal = ({ show, onHide, editId, categories, onSaved }: Props) => {
  const isEdit = !!editId

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isLoading },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', slug: '', description: '', image: '', parentId: '', status: 'active' },
  })

  // Auto-generate slug as user types name (only when creating or slug hasn't been manually edited)
  const nameValue = watch('name')
  useEffect(() => {
    if (!isEdit) {
      setValue('slug', toSlug(nameValue), { shouldValidate: false })
    }
  }, [nameValue, isEdit, setValue])

  // Load existing data when editing
  useEffect(() => {
    if (!show) return
    if (isEdit && editId) {
      void (async () => {
        try {
          const cat = await categoryApi.getById(editId)
          reset({
            name: cat.name,
            slug: cat.slug,
            description: cat.description ?? '',
            image: cat.image ?? '',
            parentId: cat.parentId ?? '',
            status: cat.status,
          })
        } catch {
          await toast('error', 'Không thể tải dữ liệu danh mục')
          onHide()
        }
      })()
    } else {
      reset({ name: '', slug: '', description: '', image: '', parentId: '', status: 'active' })
    }
  }, [show, isEdit, editId, reset, onHide])

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        ...values,
        image: values.image || undefined,
        parentId: values.parentId || undefined,
        description: values.description || undefined,
      }
      const saved = isEdit
        ? await categoryApi.update(editId!, payload)
        : await categoryApi.create(payload)

      await toast('success', isEdit ? `Đã cập nhật "${saved.name}"` : `Đã thêm "${saved.name}"`)
      onSaved(saved)
      onHide()
    } catch (err) {
      await toast('error', err instanceof Error ? err.message : 'Lưu thất bại')
    }
  }

  // Exclude self + descendants from parent options when editing
  const parentOptions = categories.filter((c) => c.id !== editId)

  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
      <ModalHeader closeButton>
        <Modal.Title>{isEdit ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</Modal.Title>
      </ModalHeader>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="d-flex flex-column gap-3">
          {/* Tên */}
          <Form.Group>
            <FormLabel>Tên danh mục <span className="text-danger">*</span></FormLabel>
            <FormControl
              placeholder="VD: eSIM Du lịch"
              isInvalid={!!errors.name}
              {...register('name')}
            />
            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
          </Form.Group>

          {/* Slug */}
          <Form.Group>
            <FormLabel>
              Slug <span className="text-danger">*</span>
              <span className="text-muted ms-2" style={{ fontSize: 12 }}>
                (tự động tạo, có thể sửa thủ công)
              </span>
            </FormLabel>
            <InputGroup>
              <FormControl
                placeholder="esim-du-lich"
                isInvalid={!!errors.slug}
                {...register('slug')}
              />
              <Button
                variant="outline-secondary"
                title="Tạo lại từ tên"
                type="button"
                onClick={() => setValue('slug', toSlug(nameValue), { shouldValidate: true })}
              >
                <TbRefresh />
              </Button>
              <Form.Control.Feedback type="invalid">{errors.slug?.message}</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          {/* Mô tả */}
          <Form.Group>
            <FormLabel>Mô tả</FormLabel>
            <FormControl as="textarea" rows={3} placeholder="Mô tả ngắn về danh mục..." {...register('description')} />
          </Form.Group>

          <div className="row g-3">
            {/* Ảnh */}
            <div className="col-md-6">
              <Form.Group>
                <FormLabel>URL ảnh</FormLabel>
                <FormControl placeholder="https://..." {...register('image')} />
                <Form.Text className="text-muted">Dán URL ảnh hoặc để trống</Form.Text>
              </Form.Group>
            </div>

            {/* Danh mục cha */}
            <div className="col-md-6">
              <Form.Group>
                <FormLabel>Danh mục cha</FormLabel>
                <FormSelect {...register('parentId')}>
                  <option value="">— Không có —</option>
                  {parentOptions.filter((c) => !c.parentId).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </FormSelect>
              </Form.Group>
            </div>
          </div>

          {/* Trạng thái */}
          <Form.Group>
            <FormLabel>Trạng thái</FormLabel>
            <div className="d-flex gap-4">
              <Form.Check type="radio" id="status-active" label="Hoạt động" value="active" {...register('status')} />
              <Form.Check type="radio" id="status-inactive" label="Ẩn" value="inactive" {...register('status')} />
            </div>
          </Form.Group>
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting || isLoading} className="d-flex align-items-center gap-2">
            {isSubmitting && <Spinner animation="border" size="sm" />}
            {isEdit ? 'Lưu thay đổi' : 'Thêm danh mục'}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default CategoryFormModal
