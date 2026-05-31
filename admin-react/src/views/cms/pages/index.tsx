import { useState } from 'react'
import {
  Container, Row, Col, Card, Table, Badge, Button,
  Modal, Form, Alert, InputGroup
} from 'react-bootstrap'
import {
  TbFileText, TbFileCode, TbSearch, TbEdit, TbTrash,
  TbWorld, TbBookmark, TbSeo, TbClock
} from 'react-icons/tb'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useCMS } from '@/hooks/useCMS'
import { type StaticPage } from '@/types/cms'

const Page = () => {
  const { pages, addPage, updatePage, deletePage } = useCMS()

  const [search, setSearch] = useState('')
  const [alert, setAlert] = useState<{ show: boolean; variant: string; msg: string }>({ show: false, variant: 'success', msg: '' })

  // Write / Edit Modal State
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedPage, setSelectedPage] = useState<StaticPage | null>(null)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')

  // Delete Confirm Modal State
  const [showDelete, setShowDelete] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<StaticPage | null>(null)

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
    setSelectedPage(null)
    setTitle('')
    setSlug('')
    setContent('')
    setMetaTitle('')
    setMetaDescription('')
    setShowModal(true)
  }

  const handleOpenEdit = (p: StaticPage) => {
    setModalMode('edit')
    setSelectedPage(p)
    setTitle(p.title)
    setSlug(p.slug)
    setContent(p.content)
    setMetaTitle(p.metaTitle || '')
    setMetaDescription(p.metaDescription || '')
    setShowModal(true)
  }

  const handleSave = () => {
    if (!title.trim() || !slug.trim()) return

    const dataPayload = {
      title,
      slug: slug.trim(),
      content,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null
    }

    if (modalMode === 'add') {
      addPage(dataPayload)
      showAlert('success', `Đã xuất bản trang tĩnh mới "${title}"`)
    } else if (modalMode === 'edit' && selectedPage) {
      updatePage(selectedPage.id, dataPayload)
      showAlert('success', `Đã cập nhật trang tĩnh "${title}"`)
    }

    setShowModal(false)
  }

  const handleDeleteOpen = (p: StaticPage) => {
    setDeleteTarget(p)
    setShowDelete(true)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deletePage(deleteTarget.id)
    setShowDelete(false)
    showAlert('danger', `Đã xóa trang tĩnh "${deleteTarget.title}"`)
    setDeleteTarget(null)
  }

  const filtered = pages.filter(p => {
    return p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <Container fluid className="px-4 py-3">
      <PageBreadcrumb title="Quản Lý Trang Tĩnh (Static Pages)" subtitle="CMS" />

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
              <h4 className="fw-bolder text-dark mb-1">Trang tĩnh & Meta SEO</h4>
              <p className="text-muted fs-sm mb-0">Quản lý điều khoản, chính sách, hướng dẫn sử dụng và cấu hình thẻ SEO cho trang đích.</p>
            </div>
            <Button variant="primary" className="rounded-pill px-3 py-2 fw-semibold d-flex align-items-center shadow-sm"
              onClick={handleOpenAdd}>
              <TbFileCode className="me-2 fs-5" /> Thêm trang tĩnh
            </Button>
          </div>

          <div className="d-flex flex-wrap gap-3 mt-3 pt-3 border-top border-light-subtle">
            <InputGroup style={{ maxWidth: 320 }}>
              <InputGroup.Text className="bg-light border-0"><TbSearch className="text-muted" /></InputGroup.Text>
              <Form.Control
                className="bg-light border-0 shadow-none fs-sm"
                placeholder="Tìm tiêu đề trang, slug..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </InputGroup>
          </div>
        </Card.Header>

        <div className="table-responsive p-0">
          <Table hover className="mb-0 table-borderless">
            <thead className="bg-light border-bottom text-muted fs-xs">
              <tr>
                <th className="px-4 py-3">Trang</th>
                <th className="py-3">Đường dẫn tĩnh</th>
                <th className="py-3" style={{ width: '380px' }}>SEO Meta Tags</th>
                <th className="py-3">Cập nhật lúc</th>
                <th className="px-4 py-3 text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-muted">Không tìm thấy trang tĩnh nào.</td>
                </tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="border-bottom border-light-subtle align-middle">
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-2.5">
                      <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: 38, height: 38 }}>
                        <TbFileText className="fs-4" />
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{p.title}</div>
                        <small className="font-monospace text-muted fs-2xs">{p.id}</small>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="badge bg-light text-dark border font-monospace fs-xs rounded">/{p.slug}</span>
                  </td>
                  <td className="py-3">
                    <div className="bg-light rounded-3 p-2.5 border border-light-subtle">
                      <div className="d-flex align-items-center gap-1 mb-1 fs-2xs fw-bold text-primary text-truncate" style={{ maxWidth: '350px' }}>
                        <TbWorld className="fs-xs" /> {p.metaTitle || <em className="text-muted fw-normal">Trùng tiêu đề trang</em>}
                      </div>
                      <div className="text-muted fs-2xs text-truncate" style={{ maxWidth: '350px' }} title={p.metaDescription || ''}>
                        <TbSeo className="me-1 fs-xs" /> {p.metaDescription || <em className="text-muted-light">Chưa cấu hình mô tả SEO</em>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-muted fs-xs">
                    <div className="d-flex align-items-center gap-1">
                      <TbClock />
                      <span>{new Date(p.updatedAt).toLocaleString('vi-VN')}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex gap-1 justify-content-end">
                      <Button variant="light" size="sm" className="btn-icon rounded-circle shadow-sm" title="Chỉnh sửa"
                        onClick={() => handleOpenEdit(p)}>
                        <TbEdit className="fs-base text-primary" />
                      </Button>
                      <Button variant="light" size="sm" className="btn-icon rounded-circle shadow-sm" title="Xóa trang"
                        onClick={() => handleDeleteOpen(p)}>
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

      {/* Write / Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered scrollable>
        <Modal.Header closeButton className="border-bottom px-4">
          <Modal.Title className="fw-bold fs-5">
            {modalMode === 'add' ? 'Thêm trang tĩnh mới' : `Chỉnh sửa trang: ${selectedPage?.title}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-4 fs-sm">
          <Form>
            <Row className="g-3">
              {/* Title */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-dark">Tiêu đề trang <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    className="rounded-3 shadow-none border-light-subtle"
                    placeholder="Ví dụ: Chính sách giao nhận eSIM"
                    value={title}
                    onChange={e => handleTitleChange(e.target.value)}
                  />
                </Form.Group>
              </Col>

              {/* Slug */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-dark">Đường dẫn URL tĩnh (Slug) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    className="rounded-3 shadow-none border-light-subtle font-monospace fs-xs"
                    placeholder="chinh-sach-giao-nhan"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                  />
                </Form.Group>
              </Col>

              {/* Content */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-dark">Nội dung trang chi tiết</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={8}
                    className="rounded-3 shadow-none border-light-subtle font-monospace fs-xs"
                    placeholder="Nhập nội dung hiển thị của trang..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                  />
                </Form.Group>
              </Col>

              {/* SEO Meta Box divider */}
              <Col md={12} className="mt-4 mb-2">
                <div className="d-flex align-items-center gap-2">
                  <Badge bg="dark" className="rounded-pill px-2.5 py-1.5 fs-2xs uppercase fw-bold"><TbSeo className="me-1" /> Cấu hình SEO Meta Tags</Badge>
                  <div className="flex-grow-1 border-top border-light-subtle"></div>
                </div>
              </Col>

              {/* Meta Title */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-dark">Thẻ SEO Tiêu đề (Meta Title)</Form.Label>
                  <Form.Control
                    className="rounded-3 shadow-none border-light-subtle fs-xs"
                    placeholder="Nhập tiêu đề hiển thị trên Google..."
                    value={metaTitle}
                    onChange={e => setMetaTitle(e.target.value)}
                  />
                  <Form.Text className="text-muted">Độ dài lý tưởng: 50-60 ký tự. Để trống hệ thống sẽ tự động dùng Tiêu đề trang.</Form.Text>
                </Form.Group>
              </Col>

              {/* Meta Description */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-dark">Thẻ SEO Mô tả (Meta Description)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    className="rounded-3 shadow-none border-light-subtle fs-xs"
                    placeholder="Nhập mô tả tóm tắt hiển thị trên Google..."
                    value={metaDescription}
                    onChange={e => setMetaDescription(e.target.value)}
                  />
                  <Form.Text className="text-muted">Độ dài lý tưởng: 150-160 ký tự. Giúp tối ưu click-through-rate khi hiển thị kết quả tìm kiếm.</Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-top px-4">
          <Button variant="outline-secondary" className="rounded-pill px-3" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="primary" className="rounded-pill px-4 fw-semibold" onClick={handleSave}
            disabled={!title.trim() || !slug.trim()}>
            {modalMode === 'add' ? 'Xuất bản trang' : 'Lưu cập nhật'}
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
          <h5 className="fw-bold mb-2">Xóa trang tĩnh?</h5>
          <p className="text-muted fs-sm">Trang <strong>{deleteTarget?.title}</strong> sẽ bị xóa vĩnh viễn khỏi hệ thống. Đường dẫn /pages/{deleteTarget?.slug} sẽ bị mất!</p>
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
