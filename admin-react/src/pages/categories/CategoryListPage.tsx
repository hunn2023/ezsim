"use client"
import { useEffect, useMemo, useState } from 'react'
import {
  Badge, Button, Container, FormControl, InputGroup, Spinner,
} from 'react-bootstrap'
import { TbEdit, TbPlus, TbRefresh, TbSearch, TbToggleLeft, TbToggleRight, TbTrash } from 'react-icons/tb'
import Swal from 'sweetalert2'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import CategoryFormModal from '@/components/categories/CategoryFormModal'
import DataTable, { type Column } from '@/components/common/DataTable'
import { categoryApi } from '@/api/categoryApi'
import type { Category } from '@/types/category'

const toast = (icon: 'success' | 'error', title: string) =>
  Swal.fire({ toast: true, position: 'top-end', icon, title, timer: 2500, showConfirmButton: false, timerProgressBar: true })

const StatusBadge = ({ status }: { status: Category['status'] }) =>
  status === 'active'
    ? <Badge bg="" className="bg-success-subtle text-success-emphasis border border-success-subtle fw-semibold">Hoạt động</Badge>
    : <Badge bg="" className="bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle fw-semibold">Ẩn</Badge>

const CategoryListPage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [toggling, setToggling] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const openCreate = () => { setEditId(null); setModalOpen(true) }
  const openEdit = (id: string) => { setEditId(id); setModalOpen(true) }

  const handleSaved = (saved: Category) => {
    setCategories((prev) => {
      const exists = prev.find((c) => c.id === saved.id)
      return exists ? prev.map((c) => (c.id === saved.id ? saved : c)) : [...prev, saved]
    })
  }

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await categoryApi.getAll()
      setCategories(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh mục')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void fetchData() }, [])

  const filtered = useMemo(() => {
    return categories.filter((c) => {
      const kw = search.toLowerCase()
      const matchSearch = c.name.toLowerCase().includes(kw) || c.slug.toLowerCase().includes(kw)
      const matchStatus = filterStatus === 'all' || c.status === filterStatus
      return matchSearch && matchStatus
    })
  }, [categories, search, filterStatus])

  const handleToggle = async (cat: Category) => {
    setToggling(cat.id)
    try {
      await categoryApi.toggle(cat.id)
      setCategories((prev) =>
        prev.map((c) => c.id === cat.id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c)
      )
      await toast('success', `Đã ${cat.status === 'active' ? 'ẩn' : 'bật'} danh mục "${cat.name}"`)
    } catch {
      await toast('error', 'Cập nhật trạng thái thất bại')
    } finally {
      setToggling(null)
    }
  }

  const handleDelete = async (cat: Category) => {
    const result = await Swal.fire({
      title: 'Xóa danh mục?',
      html: `Danh mục <strong>${cat.name}</strong> sẽ bị xóa vĩnh viễn.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: 'Hủy',
      confirmButtonText: 'Xóa',
    })
    if (!result.isConfirmed) return
    try {
      await categoryApi.delete(cat.id)
      setCategories((prev) => prev.filter((c) => c.id !== cat.id))
      await toast('success', `Đã xóa danh mục "${cat.name}"`)
    } catch {
      await toast('error', 'Xóa danh mục thất bại')
    }
  }

  const columns: Column<Category>[] = [
    {
      id: 'index', header: '#', width: 48,
      cell: (_row, idx) => <span className="text-muted" style={{ fontSize: 13 }}>{idx + 1}</span>,
    },
    {
      id: 'name', header: 'Tên danh mục', sortAccessor: (c) => c.name,
      cell: (c) => (
        <div className="d-flex align-items-center gap-2">
          {c.image ? (
            <img src={c.image} alt={c.name} width={32} height={32} className="rounded object-fit-cover" />
          ) : (
            <div className="rounded bg-light d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 32, height: 32, fontSize: 13, color: '#aaa' }}>
              {c.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="fw-semibold">{c.name}</span>
        </div>
      ),
    },
    {
      id: 'slug', header: 'Slug', sortAccessor: (c) => c.slug,
      cell: (c) => <code className="text-muted" style={{ fontSize: 12 }}>{c.slug}</code>,
    },
    {
      id: 'parent', header: 'Danh mục cha',
      cell: (c) => c.parentName ?? <span className="text-muted">—</span>,
    },
    {
      id: 'productCount', header: 'Sản phẩm', align: 'center', sortAccessor: (c) => c.productCount,
      cell: (c) => c.productCount,
    },
    {
      id: 'status', header: 'Trạng thái', align: 'center', sortAccessor: (c) => c.status,
      cell: (c) => <StatusBadge status={c.status} />,
    },
    {
      id: 'createdAt', header: 'Ngày tạo', sortAccessor: (c) => c.createdAt,
      cell: (c) => (
        <span className="text-muted" style={{ fontSize: 12 }}>
          {new Date(c.createdAt).toLocaleDateString('vi-VN')}
        </span>
      ),
    },
    {
      id: 'actions', header: 'Thao tác', align: 'end',
      cell: (cat) => (
        <div className="d-flex gap-1 justify-content-end">
          <Button
            variant="light" size="sm" className="btn-icon"
            title={cat.status === 'active' ? 'Ẩn danh mục' : 'Bật danh mục'}
            disabled={toggling === cat.id}
            onClick={() => void handleToggle(cat)}
          >
            {toggling === cat.id
              ? <Spinner animation="border" size="sm" />
              : cat.status === 'active'
                ? <TbToggleRight className="fs-lg text-success" />
                : <TbToggleLeft className="fs-lg text-muted" />
            }
          </Button>
          <Button variant="light" size="sm" className="btn-icon" title="Chỉnh sửa" onClick={() => openEdit(cat.id)}>
            <TbEdit className="fs-lg text-primary" />
          </Button>
          <Button variant="light" size="sm" className="btn-icon" title="Xóa" onClick={() => void handleDelete(cat)}>
            <TbTrash className="fs-lg text-danger" />
          </Button>
        </div>
      ),
    },
  ]

  const toolbar = (
    <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
      <InputGroup style={{ maxWidth: 280 }}>
        <InputGroup.Text><TbSearch /></InputGroup.Text>
        <FormControl
          placeholder="Tìm theo tên, slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      <div className="d-flex gap-2 align-items-center">
        <select
          className="form-select"
          style={{ width: 150 }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Ẩn</option>
        </select>

        <Button variant="outline-secondary" size="sm" onClick={() => void fetchData()} title="Tải lại">
          <TbRefresh />
        </Button>

        <Button variant="primary" size="sm" className="d-flex align-items-center gap-1" onClick={openCreate}>
          <TbPlus /> Thêm danh mục
        </Button>
      </div>
    </div>
  )

  return (
    <Container fluid>
      <PageBreadcrumb title="Danh mục" subtitle="Quản lý" />

      <DataTable<Category>
        data={filtered}
        columns={columns}
        rowKey={(c) => c.id}
        loading={loading}
        error={error}
        toolbar={toolbar}
        isFiltered={!!search || filterStatus !== 'all'}
        emptyText="Chưa có danh mục nào"
        emptyFilteredText="Không tìm thấy danh mục phù hợp"
        itemNoun="danh mục"
      />

      <CategoryFormModal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        editId={editId}
        categories={categories}
        onSaved={handleSaved}
      />
    </Container>
  )
}

export default CategoryListPage
