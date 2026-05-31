import { useState } from 'react'
import {
  Container, Row, Col, Card, Table, Badge, Button,
  Modal, Form, Alert, InputGroup
} from 'react-bootstrap'
import {
  TbBookmark, TbFolderPlus, TbSearch, TbEdit, TbTrash,
  TbCheck, TbX, TbListNumbers, TbNotes
} from 'react-icons/tb'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useCMS } from '@/hooks/useCMS'
import { type PostCategory } from '@/types/cms'

const Page = () => {
  const { categories, posts, addCategory, updateCategory, deleteCategory } = useCMS()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [alert, setAlert] = useState<{ show: boolean; variant: string; msg: string }>({ show: false, variant: 'success', msg: '' })

  // Add / Edit Modal state
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedCat, setSelectedCat] = useState<PostCategory | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [desc, setDesc] = useState('')
  const [displayOrder, setDisplayOrder] = useState<number>(1)
  const [status, setStatus] = useState<number>(1)

  // Delete modal state
  const [showDelete, setShowDelete] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<PostCategory | null>(null)

  const showAlert = (variant: string, msg: string) => {
    setAlert({ show: true, variant, msg })
    setTimeout(() => setAlert(a => ({ ...a, show: false })), 4000)
  }

  const handleOpenAdd = () => {
    setModalMode('add')
    setSelectedCat(null)
    setName('')
    setSlug('')
    setDesc('')
    setDisplayOrder(categories.length + 1)
    setStatus(1)
    setShowModal(true)
  }

  const handleOpenEdit = (cat: PostCategory) => {
    setModalMode('edit')
    setSelectedCat(cat)
    setName(cat.name)
    setSlug(cat.slug)
    setDesc(cat.description)
    setDisplayOrder(cat.displayOrder)
    setStatus(cat.status)
    setShowModal(true)
  }

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove tone marks in Vietnamese
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (val: string) => {
    setName(val)
    if (modalMode === 'add') {
      setSlug(generateSlug(val))
    }
  }

  const handleSave = () => {
    if (!name.trim() || !slug.trim()) return

    const dataPayload = {
      name,
      slug: slug.trim(),
      description: desc,
      displayOrder: Number(displayOrder),
      status
    }

    if (modalMode === 'add') {
      addCategory(dataPayload)
      showAlert('success', `Đã thêm danh mục mới "${name}"`)
    } else if (modalMode === 'edit' && selectedCat) {
      updateCategory(selectedCat.id, dataPayload)
      showAlert('success', `Đã cập nhật danh mục "${name}"`)
    }

    setShowModal(false)
  }

  const handleDeleteOpen = (cat: PostCategory) => {
    setDeleteTarget(cat)
    setShowDelete(true)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteCategory(deleteTarget.id)
    setShowDelete(false)
    showAlert('danger', `Đã xóa danh mục "${deleteTarget.name}"`)
    setDeleteTarget(null)
  }

  const handleToggleStatus = (cat: PostCategory) => {
    const nextStatus = cat.status === 1 ? 0 : 1
    updateCategory(cat.id, { status: nextStatus })
    showAlert('success', `Đã ${nextStatus === 1 ? 'kích hoạt' : 'tạm dừng'} danh mục "${cat.name}"`)
  }

  const getPostCount = (catId: string) => posts.filter(p => p.categoryId === catId).length

  const filtered = categories.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || String(c.status) === statusFilter
    return matchSearch && matchStatus
  }).sort((a, b) => a.displayOrder - b.displayOrder)

  return (
    <Container fluid className="px-4 py-3">
      <PageBreadcrumb title="Quản Lý Danh Mục Bài Viết" subtitle="CMS" />

      {alert.show && (
        <Alert variant={alert.variant} className="border-0 shadow-sm rounded-3 mb-4 py-2 px-3 fs-sm fw-semibold">
          {alert.msg}
        </Alert>
      )}

      {/* Main Table Card */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <Card.Header className="bg-white border-bottom p-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <h4 className="fw-bolder text-dark mb-1">Danh mục bài viết</h4>
              <p className="text-muted fs-sm mb-0">Quản lý các nhóm phân loại tin tức, bài viết cẩm nang viễn thông & du lịch.</p>
            </div>
            <Button variant="primary" className="rounded-pill px-3 py-2 fw-semibold d-flex align-items-center shadow-sm"
              onClick={handleOpenAdd}>
              <TbFolderPlus className="me-2 fs-5" /> Thêm danh mục
            </Button>
          </div>

          <div className="d-flex flex-wrap gap-3 mt-3 pt-3 border-top border-light-subtle">
            <InputGroup style={{ maxWidth: 320 }}>
              <InputGroup.Text className="bg-light border-0"><TbSearch className="text-muted" /></InputGroup.Text>
              <Form.Control
                className="bg-light border-0 shadow-none fs-sm"
                placeholder="Tìm tên, mô tả danh mục..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </InputGroup>
            <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border border-light-subtle gap-2">
              <TbBookmark className="text-muted" />
              <select className="form-select form-select-sm bg-transparent border-0 shadow-none fw-medium text-dark cursor-pointer"
                value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">Tất cả trạng thái</option>
                <option value="1">Đang hoạt động</option>
                <option value="0">Tạm dừng</option>
              </select>
            </div>
          </div>
        </Card.Header>

        <div className="table-responsive p-0">
          <Table hover className="mb-0 table-borderless">
            <thead className="bg-light border-bottom text-muted fs-xs">
              <tr>
                <th className="px-4 py-3" style={{ width: '80px' }}>Thứ tự</th>
                <th className="py-3">Tên Danh Mục</th>
                <th className="py-3">Đường dẫn tĩnh (Slug)</th>
                <th className="py-3">Mô tả chi tiết</th>
                <th className="py-3 text-center">Số bài viết</th>
                <th className="py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">Không tìm thấy danh mục phù hợp.</td>
                </tr>
              ) : filtered.map(c => (
                <tr key={c.id} className="border-bottom border-light-subtle align-middle">
                  <td className="px-4 py-3">
                    <Badge bg="light" className="text-dark border rounded-pill px-2 py-1 fw-bold fs-xs">
                      <TbListNumbers className="me-1 text-primary" /> {c.displayOrder}
                    </Badge>
                  </td>
                  <td className="py-3 fw-bold text-dark">{c.name}</td>
                  <td className="py-3 font-monospace text-muted fs-xs">/{c.slug}</td>
                  <td className="py-3 fs-xs text-muted" style={{ maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {c.description || <em className="text-muted-light">Không có mô tả</em>}
                  </td>
                  <td className="py-3 text-center">
                    <Badge bg={getPostCount(c.id) > 0 ? 'primary-subtle' : 'secondary-subtle'}
                      className={`${getPostCount(c.id) > 0 ? 'text-primary border border-primary-subtle' : 'text-muted border border-light-subtle'} rounded-pill px-2.5 py-1 fw-bold fs-xs`}>
                      <TbNotes className="me-1 fs-xs" /> {getPostCount(c.id)} bài
                    </Badge>
                  </td>
                  <td className="py-3 text-center">
                    <Form.Check
                      type="switch"
                      id={`switch-cat-${c.id}`}
                      checked={c.status === 1}
                      onChange={() => handleToggleStatus(c)}
                      className="fs-5 cursor-pointer d-inline-block"
                      title={c.status === 1 ? 'Tạm dừng hoạt động' : 'Kích hoạt hoạt động'}
                    />
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex gap-1 justify-content-end">
                      <Button variant="light" size="sm" className="btn-icon rounded-circle shadow-sm" title="Chỉnh sửa"
                        onClick={() => handleOpenEdit(c)}>
                        <TbEdit className="fs-base text-primary" />
                      </Button>
                      <Button variant="light" size="sm" className="btn-icon rounded-circle shadow-sm" title="Xóa danh mục"
                        onClick={() => handleDeleteOpen(c)}>
                        <TbTrash className="fs-base text-danger" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Add / Edit Category Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold fs-5">
            {modalMode === 'add' ? 'Thêm danh mục bài viết mới' : `Chỉnh sửa danh mục: ${selectedCat?.name}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          <Form className="fs-sm">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Tên danh mục <span className="text-danger">*</span></Form.Label>
              <Form.Control
                className="rounded-3 shadow-none border-light-subtle"
                placeholder="Ví dụ: Cẩm nang hướng dẫn APN"
                value={name}
                onChange={e => handleNameChange(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Đường dẫn tĩnh (Slug) <span className="text-danger">*</span></Form.Label>
              <Form.Control
                className="rounded-3 shadow-none border-light-subtle font-monospace fs-xs"
                placeholder="cam-nang-apn"
                value={slug}
                onChange={e => setSlug(e.target.value)}
              />
              <Form.Text className="text-muted">Slug tự động sinh, chỉ được chứa chữ thường không dấu và gạch ngang.</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Thứ tự hiển thị (Display Order)</Form.Label>
              <Form.Control
                type="number"
                className="rounded-3 shadow-none border-light-subtle font-monospace"
                value={displayOrder}
                onChange={e => setDisplayOrder(Number(e.target.value))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Mô tả ngắn gọn</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                className="rounded-3 shadow-none border-light-subtle"
                placeholder="Nhập mô tả ngắn cho danh mục..."
                value={desc}
                onChange={e => setDesc(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-semibold">Trạng thái danh mục</Form.Label>
              <Form.Select
                value={status}
                onChange={e => setStatus(Number(e.target.value))}
                className="rounded-3 shadow-none border-light-subtle cursor-pointer"
              >
                <option value={1}>Bật hoạt động</option>
                <option value={0}>Tạm ngưng</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" className="rounded-pill px-4" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="primary" className="rounded-pill px-4 fw-semibold" onClick={handleSave}
            disabled={!name.trim() || !slug.trim()}>
            {modalMode === 'add' ? 'Tạo danh mục' : 'Lưu thay đổi'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered size="sm">
        <Modal.Body className="p-4 text-center">
          <div className="bg-danger-subtle rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 60, height: 60 }}>
            <TbTrash className="text-danger fs-2" />
          </div>
          <h5 className="fw-bold mb-2">Xóa danh mục?</h5>
          <p className="text-muted fs-sm">Danh mục <strong>{deleteTarget?.name}</strong> sẽ bị xóa vĩnh viễn khỏi CMS. Các bài viết thuộc danh mục này sẽ chuyển về trạng thái Không phân loại!</p>
          <div className="d-flex gap-2 justify-content-center mt-3">
            <Button variant="light" className="rounded-pill px-4" onClick={() => setShowDelete(false)}>Hủy</Button>
            <Button variant="danger" className="rounded-pill px-4 fw-semibold" onClick={handleDelete}>Xóa</Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default Page
