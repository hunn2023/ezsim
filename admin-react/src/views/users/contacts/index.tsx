import { useState } from 'react'
import {
  Container, Row, Col, Card, Table, Badge, Button,
  Modal, Form, Alert, InputGroup
} from 'react-bootstrap'
import {
  TbUsers, TbUserPlus, TbSearch, TbEdit, TbTrash,
  TbShieldCheck, TbShieldOff, TbBan, TbCheck,
  TbMail, TbPhone, TbClock, TbFilter
} from 'react-icons/tb'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useUsers } from '@/hooks/useUsers'
import { type AppUser, type UserStatus } from '@/types/user'

const getStatusBadge = (status: UserStatus) => {
  switch (status) {
    case 1: return <Badge bg="success-subtle" className="text-success border border-success-subtle px-2 py-1 rounded-pill fs-xs fw-semibold"><TbCheck className="me-1" />Hoạt động</Badge>
    case 0: return <Badge bg="secondary-subtle" className="text-secondary border border-secondary-subtle px-2 py-1 rounded-pill fs-xs fw-semibold"><TbShieldOff className="me-1" />Tạm dừng</Badge>
    case 2: return <Badge bg="danger-subtle" className="text-danger border border-danger-subtle px-2 py-1 rounded-pill fs-xs fw-semibold"><TbBan className="me-1" />Bị chặn</Badge>
  }
}

const Page = () => {
  const { users, roles, updateUserStatus, updateUserRoles, addUser, deleteUser } = useUsers()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [alert, setAlert] = useState<{ show: boolean; variant: string; msg: string }>({ show: false, variant: 'success', msg: '' })

  // Add user modal
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newRoles, setNewRoles] = useState<string[]>([])

  // Role assign modal
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null)
  const [editRoles, setEditRoles] = useState<string[]>([])

  // Delete confirm modal
  const [showDelete, setShowDelete] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null)

  const showAlert = (variant: string, msg: string) => {
    setAlert({ show: true, variant, msg })
    setTimeout(() => setAlert(a => ({ ...a, show: false })), 4000)
  }

  const filtered = users.filter(u => {
    const matchSearch = u.fullName.toLowerCase().includes(search.toLowerCase())
      || u.email.toLowerCase().includes(search.toLowerCase())
      || u.phoneNumber.includes(search)
    const matchStatus = statusFilter === 'All' || String(u.status) === statusFilter
    return matchSearch && matchStatus
  })

  const handleStatusChange = (u: AppUser, status: UserStatus) => {
    updateUserStatus(u.id, status)
    showAlert('success', `Đã cập nhật trạng thái tài khoản "${u.fullName}"`)
  }

  const handleOpenRoles = (u: AppUser) => {
    setSelectedUser(u)
    setEditRoles([...u.roles])
    setShowRoleModal(true)
  }

  const handleSaveRoles = () => {
    if (!selectedUser) return
    updateUserRoles(selectedUser.id, editRoles)
    setShowRoleModal(false)
    showAlert('success', `Đã cập nhật vai trò cho "${selectedUser.fullName}"`)
  }

  const handleAddUser = () => {
    if (!newName.trim() || !newEmail.trim()) return
    addUser({
      email: newEmail,
      phoneNumber: newPhone,
      fullName: newName,
      avatarUrl: `https://i.pravatar.cc/150?u=${newEmail}`,
      status: 1,
      emailConfirmed: false,
      phoneConfirmed: false,
      roles: newRoles
    })
    setShowAdd(false)
    setNewName(''); setNewEmail(''); setNewPhone(''); setNewRoles([])
    showAlert('success', `Đã tạo tài khoản mới cho "${newName}"`)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteUser(deleteTarget.id)
    setShowDelete(false)
    showAlert('danger', `Đã xóa tài khoản "${deleteTarget.fullName}"`)
    setDeleteTarget(null)
  }

  const getRoleNames = (roleIds: string[]) =>
    roleIds.map(rid => roles.find(r => r.id === rid)?.name || rid)

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 1).length,
    inactive: users.filter(u => u.status === 0).length,
    banned: users.filter(u => u.status === 2).length
  }

  return (
    <Container fluid className="px-4 py-3">
      <PageBreadcrumb title="Quản lý Tài khoản & Liên hệ" subtitle="Hệ thống quản lý người dùng nội bộ" />

      {alert.show && (
        <Alert variant={alert.variant} className="border-0 shadow-sm rounded-3 mb-4 py-2 px-3 fs-sm fw-semibold">
          {alert.msg}
        </Alert>
      )}

      {/* Stats Row */}
      <Row className="g-3 mb-4">
        {[
          { label: 'Tổng tài khoản', value: stats.total, color: 'primary', bg: '#e8f0fe' },
          { label: 'Đang hoạt động', value: stats.active, color: 'success', bg: '#e6f9f0' },
          { label: 'Tạm dừng', value: stats.inactive, color: 'secondary', bg: '#f5f5f5' },
          { label: 'Bị chặn', value: stats.banned, color: 'danger', bg: '#fde8e8' }
        ].map((s, i) => (
          <Col xl={3} sm={6} key={i}>
            <Card className="border-0 shadow-sm rounded-4 h-100" style={{ background: s.bg }}>
              <Card.Body className="d-flex align-items-center gap-3 p-4">
                <div className={`bg-${s.color} bg-opacity-15 rounded-circle d-flex align-items-center justify-content-center`}
                  style={{ width: 52, height: 52, flexShrink: 0 }}>
                  <TbUsers className={`text-${s.color} fs-3`} />
                </div>
                <div>
                  <div className="fs-xxl fw-black text-dark">{s.value}</div>
                  <div className="fs-xs text-muted fw-semibold">{s.label}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Table Card */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <Card.Header className="bg-white border-bottom p-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <h4 className="fw-bolder text-dark mb-1">Danh sách tài khoản Admin</h4>
              <p className="text-muted fs-sm mb-0">Quản lý tất cả người dùng nội bộ và phân vai trò.</p>
            </div>
            <Button variant="primary" className="rounded-pill px-3 py-2 fw-semibold d-flex align-items-center shadow-sm"
              onClick={() => setShowAdd(true)}>
              <TbUserPlus className="me-2 fs-5" /> Thêm tài khoản
            </Button>
          </div>

          <div className="d-flex flex-wrap gap-3 mt-3 pt-3 border-top border-light-subtle">
            <InputGroup style={{ maxWidth: 320 }}>
              <InputGroup.Text className="bg-light border-0"><TbSearch className="text-muted" /></InputGroup.Text>
              <Form.Control
                className="bg-light border-0 shadow-none fs-sm"
                placeholder="Tìm tên, email, SĐT..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </InputGroup>
            <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border border-light-subtle gap-2">
              <TbFilter className="text-muted" />
              <select className="form-select form-select-sm bg-transparent border-0 shadow-none fw-medium text-dark"
                value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">Tất cả trạng thái</option>
                <option value="1">Hoạt động</option>
                <option value="0">Tạm dừng</option>
                <option value="2">Bị chặn</option>
              </select>
            </div>
          </div>
        </Card.Header>

        <div className="table-responsive p-0">
          <Table hover className="mb-0 table-borderless">
            <thead className="bg-light border-bottom text-muted fs-xs">
              <tr>
                <th className="px-4 py-3">Người dùng</th>
                <th className="py-3">Liên hệ</th>
                <th className="py-3">Vai trò</th>
                <th className="py-3 text-center">Xác minh</th>
                <th className="py-3 text-center">Trạng thái</th>
                <th className="py-3">Đăng nhập cuối</th>
                <th className="px-4 py-3 text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">Không tìm thấy tài khoản phù hợp.</td>
                </tr>
              ) : filtered.map(u => (
                <tr key={u.id} className="border-bottom border-light-subtle align-middle">
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <img src={u.avatarUrl} alt={u.fullName}
                        className="rounded-circle shadow-sm"
                        style={{ width: 42, height: 42, objectFit: 'cover' }}
                        onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName)}&background=6366f1&color=fff` }} />
                      <div>
                        <div className="fw-bold text-dark">{u.fullName}</div>
                        <small className="text-muted font-monospace fs-xs">{u.id}</small>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="d-flex align-items-center gap-1 text-muted fs-xs mb-1">
                      <TbMail className="fs-sm" /><span>{u.email}</span>
                    </div>
                    <div className="d-flex align-items-center gap-1 text-muted fs-xs">
                      <TbPhone className="fs-sm" /><span>{u.phoneNumber}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="d-flex flex-wrap gap-1">
                      {getRoleNames(u.roles).map((rName, i) => (
                        <Badge key={i} bg="primary-subtle" className="text-primary border border-primary-subtle rounded-pill px-2 py-1 fs-xs fw-semibold">
                          {rName}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <div className="d-flex gap-2 justify-content-center">
                      <span title="Email" className={`badge rounded-pill px-2 py-1 fs-xs ${u.emailConfirmed ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-muted'}`}>
                        Email {u.emailConfirmed ? '✓' : '✗'}
                      </span>
                      <span title="Phone" className={`badge rounded-pill px-2 py-1 fs-xs ${u.phoneConfirmed ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-muted'}`}>
                        SĐT {u.phoneConfirmed ? '✓' : '✗'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-center">{getStatusBadge(u.status)}</td>
                  <td className="py-3">
                    <div className="d-flex align-items-center gap-1 text-muted fs-xs">
                      <TbClock className="fs-sm" />
                      <span>{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('vi-VN') : 'Chưa đăng nhập'}</span>
                    </div>
                    <div className="text-muted fs-xs">Tạo: {new Date(u.createdAt).toLocaleDateString('vi-VN')}</div>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex gap-1 justify-content-end">
                      <Button variant="light" size="sm" className="btn-icon rounded-circle shadow-sm" title="Phân vai trò"
                        onClick={() => handleOpenRoles(u)}>
                        <TbShieldCheck className="fs-base text-primary" />
                      </Button>
                      {u.status !== 1 && (
                        <Button variant="light" size="sm" className="btn-icon rounded-circle shadow-sm" title="Kích hoạt"
                          onClick={() => handleStatusChange(u, 1)}>
                          <TbCheck className="fs-base text-success" />
                        </Button>
                      )}
                      {u.status !== 0 && (
                        <Button variant="light" size="sm" className="btn-icon rounded-circle shadow-sm" title="Tạm dừng"
                          onClick={() => handleStatusChange(u, 0)}>
                          <TbShieldOff className="fs-base text-warning" />
                        </Button>
                      )}
                      {u.status !== 2 && (
                        <Button variant="light" size="sm" className="btn-icon rounded-circle shadow-sm" title="Chặn tài khoản"
                          onClick={() => handleStatusChange(u, 2)}>
                          <TbBan className="fs-base text-danger" />
                        </Button>
                      )}
                      <Button variant="light" size="sm" className="btn-icon rounded-circle shadow-sm" title="Xóa tài khoản"
                        onClick={() => { setDeleteTarget(u); setShowDelete(true) }}>
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

      {/* Add User Modal */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold fs-5">Thêm tài khoản mới</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          <Form className="fs-sm">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Họ và tên <span className="text-danger">*</span></Form.Label>
              <Form.Control className="rounded-3 shadow-none border-light-subtle" placeholder="Nguyễn Văn A"
                value={newName} onChange={e => setNewName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Email <span className="text-danger">*</span></Form.Label>
              <Form.Control type="email" className="rounded-3 shadow-none border-light-subtle" placeholder="user@ezsim.vn"
                value={newEmail} onChange={e => setNewEmail(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Số điện thoại</Form.Label>
              <Form.Control className="rounded-3 shadow-none border-light-subtle" placeholder="09xxxxxxxx"
                value={newPhone} onChange={e => setNewPhone(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-semibold">Vai trò</Form.Label>
              <div className="d-flex flex-column gap-2 bg-light rounded-3 p-3">
                {roles.map(r => (
                  <Form.Check key={r.id} type="checkbox" id={`add-role-${r.id}`}
                    label={<span><strong>{r.name}</strong> <small className="text-muted">({r.code})</small></span>}
                    checked={newRoles.includes(r.id)}
                    onChange={e => setNewRoles(prev => e.target.checked ? [...prev, r.id] : prev.filter(x => x !== r.id))} />
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" className="rounded-pill px-4" onClick={() => setShowAdd(false)}>Hủy</Button>
          <Button variant="primary" className="rounded-pill px-4 fw-semibold" onClick={handleAddUser}
            disabled={!newName.trim() || !newEmail.trim()}>
            <TbUserPlus className="me-1" /> Tạo tài khoản
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Role Assignment Modal */}
      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold fs-5">Phân vai trò – {selectedUser?.fullName}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          <p className="text-muted fs-sm mb-3">Chọn các vai trò cần gán cho tài khoản này:</p>
          <div className="d-flex flex-column gap-3">
            {roles.map(r => (
              <div key={r.id}
                className={`border rounded-3 p-3 cursor-pointer transition-all ${editRoles.includes(r.id) ? 'border-primary bg-primary-subtle' : 'border-light-subtle bg-light'}`}
                onClick={() => setEditRoles(prev => prev.includes(r.id) ? prev.filter(x => x !== r.id) : [...prev, r.id])}
                style={{ cursor: 'pointer' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="fw-semibold text-dark">{r.name}</div>
                    <div className="text-muted fs-xs">{r.description}</div>
                    <Badge bg="secondary-subtle" className="text-muted border border-secondary-subtle rounded-pill px-2 py-0 fs-xs mt-1">
                      {r.permissionIds.length} quyền
                    </Badge>
                  </div>
                  <Form.Check type="checkbox" readOnly checked={editRoles.includes(r.id)}
                    className="ms-3 fs-5" style={{ pointerEvents: 'none' }} />
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" className="rounded-pill px-4" onClick={() => setShowRoleModal(false)}>Hủy</Button>
          <Button variant="primary" className="rounded-pill px-4 fw-semibold" onClick={handleSaveRoles}>
            <TbShieldCheck className="me-1" /> Lưu phân quyền
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
          <h5 className="fw-bold mb-2">Xóa tài khoản?</h5>
          <p className="text-muted fs-sm">Tài khoản <strong>{deleteTarget?.fullName}</strong> sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác!</p>
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
