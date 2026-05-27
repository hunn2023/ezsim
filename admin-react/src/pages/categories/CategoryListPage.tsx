"use client"
import { useEffect, useMemo, useState } from 'react'
import {
  Alert, Badge, Button, Card, CardBody, CardFooter, CardHeader,
  Container, FormControl, InputGroup, Spinner, Table,
} from 'react-bootstrap'
import { TbAlertCircle, TbEdit, TbPlus, TbRefresh, TbSearch, TbToggleLeft, TbToggleRight, TbTrash } from 'react-icons/tb'
import Swal from 'sweetalert2'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import CategoryFormModal from '@/components/categories/CategoryFormModal'
import { categoryApi } from '@/api/categoryApi'
import type { Category } from '@/types/category'

const toast = (icon: 'success' | 'error', title: string) =>
  Swal.fire({ toast: true, position: 'top-end', icon, title, timer: 2500, showConfirmButton: false, timerProgressBar: true })

const StatusBadge = ({ status }: { status: Category['status'] }) =>
  status === 'active'
    ? <Badge bg="success" className="bg-opacity-15 text-success">Hoạt động</Badge>
    : <Badge bg="secondary" className="bg-opacity-15 text-secondary">Ẩn</Badge>

const ROWS_PER_PAGE = 10

const CategoryListPage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [page, setPage] = useState(1)
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
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.slug.toLowerCase().includes(search.toLowerCase())
      const matchStatus = filterStatus === 'all' || c.status === filterStatus
      return matchSearch && matchStatus
    })
  }, [categories, search, filterStatus])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE)

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

  return (
    <Container fluid>
      <PageBreadcrumb title="Danh mục" subtitle="Quản lý" />

      <Card>
        <CardHeader className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
          {/* Search */}
          <InputGroup style={{ maxWidth: 280 }}>
            <InputGroup.Text><TbSearch /></InputGroup.Text>
            <FormControl
              placeholder="Tìm theo tên, slug..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />
          </InputGroup>

          <div className="d-flex gap-2 align-items-center">
            {/* Filter status */}
            <select
              className="form-select"
              style={{ width: 150 }}
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value as typeof filterStatus); setPage(1) }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ẩn</option>
            </select>

            <Button variant="outline-secondary" size="sm" onClick={fetchData} title="Tải lại">
              <TbRefresh />
            </Button>

            <Button variant="primary" size="sm" className="d-flex align-items-center gap-1" onClick={openCreate}>
              <TbPlus /> Thêm danh mục
            </Button>
          </div>
        </CardHeader>

        <CardBody className="p-0">
          {loading && (
            <div className="d-flex justify-content-center align-items-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          )}

          {!loading && error && (
            <Alert variant="danger" className="m-3 d-flex align-items-center gap-2">
              <TbAlertCircle className="fs-20 flex-shrink-0" />
              {error}
            </Alert>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center text-muted py-5">
              {search || filterStatus !== 'all' ? 'Không tìm thấy danh mục phù hợp' : 'Chưa có danh mục nào'}
            </div>
          )}

          {!loading && !error && pageRows.length > 0 && (
            <Table responsive hover className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 48 }}>#</th>
                  <th>Tên danh mục</th>
                  <th>Slug</th>
                  <th>Danh mục cha</th>
                  <th className="text-center">Sản phẩm</th>
                  <th className="text-center">Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th className="text-end">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((cat, idx) => (
                  <tr key={cat.id}>
                    <td className="text-muted" style={{ fontSize: 13 }}>
                      {(currentPage - 1) * ROWS_PER_PAGE + idx + 1}
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} width={32} height={32} className="rounded object-fit-cover" />
                        ) : (
                          <div className="rounded bg-light d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 32, height: 32, fontSize: 13, color: '#aaa' }}>
                            {cat.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="fw-semibold">{cat.name}</span>
                      </div>
                    </td>
                    <td><code className="text-muted" style={{ fontSize: 12 }}>{cat.slug}</code></td>
                    <td>{cat.parentName ?? <span className="text-muted">—</span>}</td>
                    <td className="text-center">{cat.productCount}</td>
                    <td className="text-center"><StatusBadge status={cat.status} /></td>
                    <td className="text-muted" style={{ fontSize: 12 }}>
                      {new Date(cat.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td>
                      <div className="d-flex gap-1 justify-content-end">
                        <Button
                          variant="light" size="sm" className="btn-icon"
                          title={cat.status === 'active' ? 'Ẩn danh mục' : 'Bật danh mục'}
                          disabled={toggling === cat.id}
                          onClick={() => handleToggle(cat)}
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
                        <Button
                          variant="light" size="sm" className="btn-icon" title="Xóa"
                          onClick={() => handleDelete(cat)}
                        >
                          <TbTrash className="fs-lg text-danger" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>

        {!loading && !error && filtered.length > ROWS_PER_PAGE && (
          <CardFooter className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
            <span className="text-muted" style={{ fontSize: 13 }}>
              Hiển thị {(currentPage - 1) * ROWS_PER_PAGE + 1}–{Math.min(currentPage * ROWS_PER_PAGE, filtered.length)} / {filtered.length}
            </span>
            <div className="d-flex gap-1">
              <Button variant="outline-secondary" size="sm" disabled={currentPage <= 1} onClick={() => setPage((p) => p - 1)}>‹</Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button key={p} size="sm" variant={p === currentPage ? 'primary' : 'outline-secondary'} onClick={() => setPage(p)}>
                  {p}
                </Button>
              ))}
              <Button variant="outline-secondary" size="sm" disabled={currentPage >= totalPages} onClick={() => setPage((p) => p + 1)}>›</Button>
            </div>
          </CardFooter>
        )}
      </Card>

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
