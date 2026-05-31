import { useState } from 'react'
import {
  Container, Row, Col, Card, Table, Badge, Button,
  Modal, Form, Alert, InputGroup
} from 'react-bootstrap'
import {
  TbNews, TbFilePlus, TbSearch, TbEdit, TbTrash,
  TbCheck, TbClock, TbEye, TbCalendar, TbListNumbers,
  TbUser, TbTag, TbEyeOff
} from 'react-icons/tb'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useCMS } from '@/hooks/useCMS'
import { type BlogPost } from '@/types/cms'

const getStatusBadge = (status: number) => {
  switch (status) {
    case 1:
      return (
        <Badge bg="success-subtle" className="text-success border border-success-subtle px-2.5 py-1 rounded-pill fs-xs fw-semibold">
          <TbCheck className="me-1" />Đã đăng
        </Badge>
      )
    case 0:
      return (
        <Badge bg="warning-subtle" className="text-warning border border-warning-subtle px-2.5 py-1 rounded-pill fs-xs fw-semibold">
          <TbClock className="me-1" />Bản nháp
        </Badge>
      )
    case 2:
      return (
        <Badge bg="secondary-subtle" className="text-secondary border border-secondary-subtle px-2.5 py-1 rounded-pill fs-xs fw-semibold">
          <TbEyeOff className="me-1" />Lưu trữ
        </Badge>
      )
    default:
      return <Badge bg="light" className="text-dark">N/A</Badge>
  }
}

const Page = () => {
  const { posts, categories, addPost, updatePost, deletePost } = useCMS()

  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [alert, setAlert] = useState<{ show: boolean; variant: string; msg: string }>({ show: false, variant: 'success', msg: '' })

  // Write / Edit Modal State
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [catId, setCatId] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [status, setStatus] = useState<number>(1)
  const [sortOrder, setSortOrder] = useState<number>(1)
  const [endDate, setEndDate] = useState<string>('')
  const [isActive, setIsActive] = useState<boolean>(true)

  // Delete Confirm Modal State
  const [showDelete, setShowDelete] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null)

  const showAlert = (variant: string, msg: string) => {
    setAlert({ show: true, variant, msg })
    setTimeout(() => setAlert(a => ({ ...a, show: false })), 4000)
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

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (modalMode === 'add') {
      setSlug(generateSlug(val))
    }
  }

  const handleOpenAdd = () => {
    setModalMode('add')
    setSelectedPost(null)
    setTitle('')
    setSlug('')
    setCatId(categories[0]?.id || '')
    setSummary('')
    setContent('')
    setThumbnailUrl('https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500&auto=format&fit=crop&q=60')
    setStatus(1)
    setSortOrder(posts.length + 1)
    setEndDate('')
    setIsActive(true)
    setShowModal(true)
  }

  const handleOpenEdit = (post: BlogPost) => {
    setModalMode('edit')
    setSelectedPost(post)
    setTitle(post.title)
    setSlug(post.slug)
    setCatId(post.categoryId || '')
    setSummary(post.summary)
    setContent(post.content)
    setThumbnailUrl(post.thumbnailUrl || '')
    setStatus(post.status)
    setSortOrder(post.sortOrder)
    setEndDate(post.endDate || '')
    setIsActive(post.isActive)
    setShowModal(true)
  }

  const handleSave = () => {
    if (!title.trim() || !slug.trim()) return

    const dataPayload = {
      title,
      slug: slug.trim(),
      categoryId: catId || null,
      categoryName: categories.find(c => c.id === catId)?.name || 'Không phân loại',
      summary,
      content,
      thumbnailUrl: thumbnailUrl || null,
      status,
      sortOrder: Number(sortOrder),
      endDate: endDate || null,
      isActive
    }

    if (modalMode === 'add') {
      addPost(dataPayload)
      showAlert('success', `Đã xuất bản bài viết mới "${title}" thành công.`)
    } else if (modalMode === 'edit' && selectedPost) {
      updatePost(selectedPost.id, dataPayload)
      showAlert('success', `Đã cập nhật bài viết "${title}" thành công.`)
    }

    setShowModal(false)
  }

  const handleDeleteOpen = (post: BlogPost) => {
    setDeleteTarget(post)
    setShowDelete(true)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deletePost(deleteTarget.id)
    setShowDelete(false)
    showAlert('danger', `Đã xóa bài viết "${deleteTarget.title}" khỏi hệ thống.`)
    setDeleteTarget(null)
  }

  const handleToggleActive = (post: BlogPost) => {
    updatePost(post.id, { isActive: !post.isActive })
    showAlert('success', `Đã ${!post.isActive ? 'kích hoạt' : 'tắt hiển thị'} bài viết "${post.title}"`)
  }

  const filtered = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.summary.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'All' || p.categoryId === catFilter
    const matchStatus = statusFilter === 'All' || String(p.status) === statusFilter
    return matchSearch && matchCat && matchStatus
  }).sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <Container fluid className="px-4 py-3">
      <PageBreadcrumb title="Quản Lý Bài Viết (Tin Tức & Cẩm Nang)" subtitle="CMS" />

      {alert.show && (
        <Alert variant={alert.variant} className="border-0 shadow-sm rounded-3 mb-4 py-2 px-3 fs-sm fw-semibold">
          {alert.msg}
        </Alert>
      )}

      {/* Main Container */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <Card.Header className="bg-white border-bottom p-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <h4 className="fw-bolder text-dark mb-1">Danh sách bài viết tin tức & cẩm nang</h4>
              <p className="text-muted fs-sm mb-0">Viết bài viết cẩm nang cài đặt eSIM, cập nhật tin khuyến mãi, mẹo du lịch quốc tế.</p>
            </div>
            <Button variant="primary" className="rounded-pill px-3 py-2 fw-semibold d-flex align-items-center shadow-sm"
              onClick={handleOpenAdd}>
              <TbFilePlus className="me-2 fs-5" /> Viết bài mới
            </Button>
          </div>

          <div className="d-flex flex-wrap gap-3 mt-3 pt-3 border-top border-light-subtle">
            <InputGroup style={{ maxWidth: 320 }}>
              <InputGroup.Text className="bg-light border-0"><TbSearch className="text-muted" /></InputGroup.Text>
              <Form.Control
                className="bg-light border-0 shadow-none fs-sm"
                placeholder="Tìm tiêu đề, tóm tắt..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </InputGroup>
            
            <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border border-light-subtle gap-2">
              <TbTag className="text-muted" />
              <select className="form-select form-select-sm bg-transparent border-0 shadow-none fw-medium text-dark cursor-pointer"
                value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                <option value="All">Tất cả danh mục</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border border-light-subtle gap-2">
              <TbNews className="text-muted" />
              <select className="form-select form-select-sm bg-transparent border-0 shadow-none fw-medium text-dark cursor-pointer"
                value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">Tất cả trạng thái</option>
                <option value="1">Đã đăng</option>
                <option value="0">Bản nháp</option>
                <option value="2">Lưu trữ</option>
              </select>
            </div>
          </div>
        </Card.Header>

        <div className="table-responsive p-0">
          <Table hover className="mb-0 table-borderless">
            <thead className="bg-light border-bottom text-muted fs-xs">
              <tr>
                <th className="px-4 py-3" style={{ width: '100px' }}>Bài viết</th>
                <th className="py-3" style={{ width: '350px' }}>Tiêu đề / tóm tắt</th>
                <th className="py-3">Danh mục</th>
                <th className="py-3">Tác giả</th>
                <th className="py-3 text-center">Trạng thái</th>
                <th className="py-3">Ngày tạo / Hạn khuyến mãi</th>
                <th className="py-3 text-center">Hiển thị</th>
                <th className="px-4 py-3 text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-5 text-muted">Không tìm thấy bài viết phù hợp.</td>
                </tr>
              ) : filtered.map(p => {
                const catObj = categories.find(c => c.id === p.categoryId)
                return (
                  <tr key={p.id} className="border-bottom border-light-subtle align-middle">
                    <td className="px-4 py-3">
                      {p.thumbnailUrl ? (
                        <img src={p.thumbnailUrl} alt={p.title}
                          className="rounded-3 shadow-sm"
                          style={{ width: 80, height: 50, objectFit: 'cover' }}
                          onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x50/e5e7eb/6b7280?text=News' }} />
                      ) : (
                        <div className="bg-light rounded-3 d-flex align-items-center justify-content-center border" style={{ width: 80, height: 50 }}>
                          <TbNews className="text-muted" />
                        </div>
                      )}
                    </td>
                    <td className="py-3">
                      <div>
                        <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '330px' }} title={p.title}>{p.title}</div>
                        <small className="text-muted d-block text-truncate" style={{ maxWidth: '330px' }} title={p.summary}>{p.summary}</small>
                        <small className="font-monospace text-muted fs-2xs">{p.id} | /posts/{p.slug}</small>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge bg="primary-subtle" className="text-primary border border-primary-subtle rounded-pill px-2.5 py-1 fw-bold fs-2xs">
                        {catObj ? catObj.name : 'Không phân loại'}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted fs-xs fw-semibold">
                      <div className="d-flex align-items-center gap-1">
                        <TbUser /> <span>{p.authorName}</span>
                      </div>
                    </td>
                    <td className="py-3 text-center">{getStatusBadge(p.status)}</td>
                    <td className="py-3">
                      <div className="fs-xs text-muted">Tạo: {new Date(p.createdAt).toLocaleDateString('vi-VN')}</div>
                      {p.endDate ? (
                        <div className="fs-xs text-danger fw-bold d-flex align-items-center gap-1 mt-1">
                          <TbCalendar /> <span>Hết hạn: {new Date(p.endDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                      ) : (
                        <small className="text-muted fs-2xs">Vô thời hạn</small>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      <Form.Check
                        type="switch"
                        id={`switch-post-${p.id}`}
                        checked={p.isActive}
                        onChange={() => handleToggleActive(p)}
                        className="fs-5 cursor-pointer d-inline-block"
                        title={p.isActive ? 'Ẩn khỏi người dùng' : 'Hiển thị công khai'}
                      />
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="d-flex gap-1 justify-content-end">
                        <Button variant="light" size="sm" className="btn-icon rounded-circle shadow-sm" title="Chỉnh sửa"
                          onClick={() => handleOpenEdit(p)}>
                          <TbEdit className="fs-base text-primary" />
                        </Button>
                        <Button variant="light" size="sm" className="btn-icon rounded-circle shadow-sm" title="Xóa bài viết"
                          onClick={() => handleDeleteOpen(p)}>
                          <TbTrash className="fs-base text-danger" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Editor/Form Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered scrollable>
        <Modal.Header closeButton className="border-bottom px-4">
          <Modal.Title className="fw-bold fs-5">
            {modalMode === 'add' ? 'Tạo bài viết mới' : `Chỉnh sửa bài viết: ${selectedPost?.title}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-4 fs-sm">
          <Form>
            <Row className="g-3">
              {/* Title */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-dark">Tiêu đề bài viết <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    className="rounded-3 shadow-none border-light-subtle fw-bold"
                    placeholder="Nhập tiêu đề hấp dẫn..."
                    value={title}
                    onChange={e => handleTitleChange(e.target.value)}
                  />
                </Form.Group>
              </Col>

              {/* Slug */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-dark">Đường dẫn tĩnh (Slug) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    className="rounded-3 shadow-none border-light-subtle font-monospace fs-xs"
                    placeholder="du-lich-chau-au-esim"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                  />
                </Form.Group>
              </Col>

              {/* Category */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-dark">Danh mục phân loại</Form.Label>
                  <Form.Select
                    value={catId}
                    onChange={e => setCatId(e.target.value)}
                    className="rounded-3 shadow-none border-light-subtle cursor-pointer"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.filter(c => c.status === 1).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Thumbnail URL */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-dark">URL ảnh đại diện bài viết (Thumbnail URL)</Form.Label>
                  <Form.Control
                    className="rounded-3 shadow-none border-light-subtle font-monospace fs-xs"
                    placeholder="https://image-url..."
                    value={thumbnailUrl}
                    onChange={e => setThumbnailUrl(e.target.value)}
                  />
                </Form.Group>
              </Col>

              {/* Summary */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-dark">Mô tả ngắn gọn (Summary) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    className="rounded-3 shadow-none border-light-subtle"
                    placeholder="Nhập tóm tắt thu hút người đọc..."
                    value={summary}
                    onChange={e => setSummary(e.target.value)}
                  />
                </Form.Group>
              </Col>

              {/* Content */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-dark">Nội dung chi tiết bài viết (HTML / Text)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={8}
                    className="rounded-3 shadow-none border-light-subtle font-monospace fs-xs"
                    placeholder="Soạn thảo nội dung bài viết..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                  />
                </Form.Group>
              </Col>

              {/* Sort Order */}
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-dark">Thứ tự ưu tiên (Sort Order)</Form.Label>
                  <Form.Control
                    type="number"
                    value={sortOrder}
                    onChange={e => setSortOrder(Number(e.target.value))}
                    className="rounded-3 shadow-none border-light-subtle font-monospace"
                  />
                </Form.Group>
              </Col>

              {/* Status Selection */}
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-dark">Trạng thái phát hành</Form.Label>
                  <Form.Select
                    value={status}
                    onChange={e => setStatus(Number(e.target.value))}
                    className="rounded-3 shadow-none border-light-subtle cursor-pointer"
                  >
                    <option value={1}>Đã đăng (Công khai)</option>
                    <option value={0}>Bản nháp</option>
                    <option value={2}>Lưu trữ</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* End Date (e.g. for promotions) */}
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-dark">Thời hạn khuyến mãi (Nếu có)</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={endDate ? endDate.substring(0, 16) : ''}
                    onChange={e => setEndDate(e.target.value ? new Date(e.target.value).toISOString() : '')}
                    className="rounded-3 shadow-none border-light-subtle font-monospace cursor-pointer"
                  />
                </Form.Group>
              </Col>

              {/* IsActive Toggle */}
              <Col md={12}>
                <div className="d-flex align-items-center justify-content-between bg-light p-3 rounded-3 border">
                  <div>
                    <div className="fw-semibold text-dark">Kích hoạt hiển thị công khai</div>
                    <div className="text-muted fs-xs">Bật để cho phép hiển thị bài viết trên cổng tin tức của khách hàng.</div>
                  </div>
                  <Form.Check
                    type="switch"
                    id="switch-modal-active"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="fs-4 cursor-pointer"
                  />
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-top px-4">
          <Button variant="outline-secondary" className="rounded-pill px-3" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="primary" className="rounded-pill px-4 fw-semibold" onClick={handleSave}
            disabled={!title.trim() || !slug.trim()}>
            {modalMode === 'add' ? 'Viết bài ngay' : 'Cập nhật bài viết'}
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
          <h5 className="fw-bold mb-2">Xóa bài viết?</h5>
          <p className="text-muted fs-sm">Bài viết <strong>{deleteTarget?.title}</strong> sẽ bị xóa vĩnh viễn khỏi CMS. Hành động này không thể phục hồi!</p>
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
