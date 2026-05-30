import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Button, Form, InputGroup,
  Modal, ModalBody, ModalFooter, ModalHeader, Spinner,
} from 'react-bootstrap'
import { TbRefresh } from 'react-icons/tb'
import Swal from 'sweetalert2'
import { z } from 'zod'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import Textarea from '@/components/common/Textarea'
import FormField from '@/components/common/FormField'
import { categoryApi } from '@/api/categoryApi'
import type { Category } from '@/types/category'

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

interface Props {
  show: boolean
  onHide: () => void
  editId?: string | null
  categories: Category[]
  onSaved: (cat: Category) => void
}

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

  const nameValue = watch('name')
  useEffect(() => {
    if (!isEdit) {
      setValue('slug', toSlug(nameValue), { shouldValidate: false })
    }
  }, [nameValue, isEdit, setValue])

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

  const parentOptions = categories
    .filter((c) => c.id !== editId && !c.parentId)
    .map((c) => ({ value: c.id, label: c.name }))

  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
      <ModalHeader closeButton>
        <Modal.Title>{isEdit ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</Modal.Title>
      </ModalHeader>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="d-flex flex-column gap-3">
          <Input
            label="Tên danh mục"
            required
            placeholder="VD: eSIM Du lịch"
            error={errors.name?.message}
            {...register('name')}
          />

          <FormField
            label={<>Slug <span className="text-muted ms-1" style={{ fontSize: 12 }}>(tự động tạo, có thể sửa thủ công)</span></>}
            required
            error={errors.slug?.message}
          >
            <InputGroup>
              <Input
                bare
                placeholder="esim-du-lich"
                error={errors.slug?.message}
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
            </InputGroup>
          </FormField>

          <Textarea
            label="Mô tả"
            rows={3}
            placeholder="Mô tả ngắn về danh mục..."
            {...register('description')}
          />

          <div className="row g-3">
            <div className="col-md-6">
              <Input
                label="URL ảnh"
                placeholder="https://..."
                hint="Dán URL ảnh hoặc để trống"
                {...register('image')}
              />
            </div>

            <div className="col-md-6">
              <Select
                label="Danh mục cha"
                placeholder="— Không có —"
                options={parentOptions}
                {...register('parentId')}
              />
            </div>
          </div>

          <FormField label="Trạng thái">
            <div className="d-flex gap-4">
              <Form.Check type="radio" id="status-active"   label="Hoạt động" value="active"   {...register('status')} />
              <Form.Check type="radio" id="status-inactive" label="Ẩn"        value="inactive" {...register('status')} />
            </div>
          </FormField>
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>Hủy</Button>
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
