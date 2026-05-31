import { useState } from 'react'
import {
  Container, Row, Col, Card, Table, Badge, Button,
  Modal, Form, Alert, ProgressBar
} from 'react-bootstrap'
import {
  TbShieldLock, TbShieldPlus, TbEdit, TbTrash,
  TbCheck, TbLock, TbUsers, TbKey
} from 'react-icons/tb'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useUsers } from '@/hooks/useUsers'
import { type Role } from '@/types/user'

const ROLE_COLOR_MAP: Record<string, string> = {
  'super_admin': 'danger',
  'admin': 'primary',
  'operator': 'success',
  'finance': 'warning',
  'viewer': 'secondary'
}

const Page = () => {
  const { roles, permissions, users, addRole, updateRole, deleteRole, toggleRolePermission } = useUsers()
  const [alert, setAlert] = useState<{ show: boolean; variant: string; msg: string }>({ show: false, variant: 'success', msg: '' })

  // Create Role modal
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCode, setNewCode] = useState('')
  const [newDesc, setNewDesc] = useState('')

  // Edit Role permissions modal
  const [showPerms, setShowPerms] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  // Delete confirm
  const [showDelete, setShowDelete] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null)

  const showAlert = (variant: string, msg: string) => {
    setAlert({ show: true, variant, msg })
    setTimeout(() => setAlert(a => ({ ...a, show: false })), 4000)
  }

  const handleCreate = () => {
    if (!newName.trim() || !newCode.trim()) return
    addRole({ name: newName, code: newCode.toLowerCase().replace(/\s+/g, '_'), description: newDesc, permissionIds: [] })
    setShowCreate(false)
    setNewName(''); setNewCode(''); setNewDesc('')
    showAlert('success', `Đã tạo vai trò "${newName}" thành công`)
  }

  const handleOpenPerms = (r: Role) => {
    setSelectedRole(r)
    setShowPerms(true)
  }

  const handleTogglePerm = (permId: string) => {
    if (!selectedRole) return
    toggleRolePermission(selectedRole.id, permId)
    // Refresh local selection from state (it's reactive via hook)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteRole(deleteTarget.id)
    setShowDelete(false)
    showAlert('danger', `Đã xóa vai trò "${deleteTarget.name}"`)
    setDeleteTarget(null)
  }

  const getUserCount = (roleId: string) => users.filter(u => u.roles.includes(roleId)).length

  // Group permissions by module
  const moduleGroups = permissions.reduce<Record<string, typeof permissions>>((acc, p) => {
    if (!acc[p.module]) acc[p.module] = []
    acc[p.module].push(p)
    return acc
  }, {})

  const currentRolePerms = selectedRole
    ? roles.find(r => r.id === selectedRole.id)?.permissionIds || []
    : []

  return (
    <Container fluid className="px-4 py-3">
      <PageBreadcrumb title="Quản lý Vai trò (Roles)" subtitle="Thiết lập nhóm quyền và phân quyền hệ thống" />

      {alert.show && (
        <Alert variant={alert.variant} className="border-0 shadow-sm rounded-3 mb-4 py-2 px-3 fs-sm fw-semibold">
          {alert.msg}
        </Alert>
      )}

      {/* Stats */}
      <Row className="g-3 mb-4">
        <Col xl={3} sm={6}>
          <Card className="border-0 shadow-sm rounded-4 h-100" style={{ background: '#e8f0fe' }}>
            <Card.Body className="d-flex align-items-center gap-3 p-4">
              <div className="bg-primary bg-opacity-15 rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 52, height: 52, flexShrink: 0 }}>
                <TbShieldLock className="text-primary fs-3" />
              </div>
              <div>
                <div className="fs-xxl fw-black text-dark">{roles.length}</div>
                <div className="fs-xs text-muted fw-semibold">Tổng số vai trò</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} sm={6}>
          <Card className="border-0 shadow-sm rounded-4 h-100" style={{ background: '#e6f9f0' }}>
            <Card.Body className="d-flex align-items-center gap-3 p-4">
              <div className="bg-success bg-opacity-15 rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 52, height: 52, flexShrink: 0 }}>
                <TbKey className="text-success fs-3" />
              </div>
              <div>
                <div className="fs-xxl fw-black text-dark">{permissions.length}</div>
                <div className="fs-xs text-muted fw-semibold">Tổng quyền hạn</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} sm={6}>
          <Card className="border-0 shadow-sm rounded-4 h-100" style={{ background: '#fff8e6' }}>
            <Card.Body className="d-flex align-items-center gap-3 p-4">
              <div className="bg-warning bg-opacity-15 rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 52, height: 52, flexShrink: 0 }}>
                <TbUsers className="text-warning fs-3" />
              </div>
              <div>
                <div className="fs-xxl fw-black text-dark">{users.length}</div>
                <div className="fs-xs text-muted fw-semibold">Người dùng nội bộ</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} sm={6}>
          <Card className="border-0 shadow-sm rounded-4 h-100" style={{ background: '#f5e6ff' }}>
            <Card.Body className="d-flex align-items-center gap-3 p-4">
              <div className="bg-purple bg-opacity-15 rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 52, height: 52, flexShrink: 0, background: '#e9d5ff' }}>
                <TbLock style={{ color: '#7c3aed' }} className="fs-3" />
              </div>
              <div>
                <div className="fs-xxl fw-black text-dark">
                  {Object.keys(moduleGroups).length}
                </div>
                <div className="fs-xs text-muted fw-semibold">Module bảo vệ</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Roles Table */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <Card.Header className="bg-white border-bottom p-4 d-flex align-items-center justify-content-between">
          <div>
            <h4 className="fw-bolder text-dark mb-1">Danh sách Vai trò</h4>
            <p className="text-muted fs-sm mb-0">Cấu hình nhóm quyền và xem số người dùng mỗi vai trò.</p>
          </div>
          <Button variant="primary" className="rounded-pill px-3 py-2 fw-semibold d-flex align-items-center shadow-sm"
            onClick={() => setShowCreate(true)}>
            <TbShieldPlus className="me-2 fs-5" /> Tạo vai trò mới
          </Button>
        </Card.Header>

        <div className="table-responsive p-0">
          <Table hover className="mb-0 table-borderless">
            <thead className="bg-light border-bottom text-muted fs-xs">
              <tr>
                <th className="px-4 py-3">Vai trò</th>
                <th className="py-3">Mô tả</th>
                <th className="py-3 text-center">Người dùng</th>
                <th className="py-3">Mức độ phân quyền</th>
                <th className="px-4 py-3 text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(r => {
                const pct = Math.round((r.permissionIds.length / permissions.length) * 100)
                const color = ROLE_COLOR_MAP[r.code] || 'secondary'
                const uCount = getUserCount(r.id)
                return (
                  <tr key={r.id} className="border-bottom border-light-subtle align-middle">
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className={`bg-${color} bg-opacity-15 rounded-circle d-flex align-items-center justify-content-center`}
                          style={{ width: 44, height: 44, flexShrink: 0 }}>
                          <TbShieldLock className={`text-${color} fs-4`} />
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{r.name}</div>
                          <Badge bg={`${color}-subtle`} className={`text-${color} border border-${color}-subtle rounded-pill px-2 py-0 fs-xs`}>
                            {r.code}
                          </Badge>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-muted fs-sm">{r.description}</span>
                    </td>
                    <td className="py-3 text-center">
                      <Badge bg={uCount > 0 ? 'primary-subtle' : 'secondary-subtle'}
                        className={`${uCount > 0 ? 'text-primary border-primary' : 'text-muted border-secondary'} border rounded-pill px-2 py-1 fs-sm fw-bold`}>
                        {uCount}
                      </Badge>
                    </td>
                    <td className="py-3" style={{ minWidth: 200 }}>
                      <div className="d-flex align-items-center gap-2">
                        <ProgressBar
                          now={pct}
                          variant={pct === 100 ? 'danger' : pct > 60 ? 'primary' : pct > 30 ? 'success' : 'secondary'}
                          style={{ height: 6, flex: 1 }}
                          className="rounded-pill"
                        />
                        <span className="fs-xs text-muted fw-semibold">{r.permissionIds.length}/{permissions.length}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <Button variant="outline-primary" size="sm" className="rounded-pill px-3 fw-semibold"
                          onClick={() => handleOpenPerms(r)}>
                          <TbEdit className="me-1" /> Phân quyền
                        </Button>
                        <Button variant="light" size="sm" className="btn-icon rounded-circle shadow-sm" title="Xóa vai trò"
                          onClick={() => { setDeleteTarget(r); setShowDelete(true) }}>
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

      {/* Create Role Modal */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold fs-5">Tạo vai trò mới</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          <Form className="fs-sm">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Tên vai trò <span className="text-danger">*</span></Form.Label>
              <Form.Control className="rounded-3 shadow-none border-light-subtle" placeholder="Ví dụ: Content Manager"
                value={newName} onChange={e => setNewName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Mã vai trò (Code) <span className="text-danger">*</span></Form.Label>
              <Form.Control className="rounded-3 shadow-none border-light-subtle font-monospace" placeholder="content_manager"
                value={newCode} onChange={e => setNewCode(e.target.value)} />
              <Form.Text className="text-muted">Chỉ dùng chữ thường và dấu gạch chân.</Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-semibold">Mô tả</Form.Label>
              <Form.Control as="textarea" rows={3} className="rounded-3 shadow-none border-light-subtle"
                placeholder="Mô tả ngắn gọn nhiệm vụ của vai trò..."
                value={newDesc} onChange={e => setNewDesc(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" className="rounded-pill px-4" onClick={() => setShowCreate(false)}>Hủy</Button>
          <Button variant="primary" className="rounded-pill px-4 fw-semibold" onClick={handleCreate}
            disabled={!newName.trim() || !newCode.trim()}>
            <TbShieldPlus className="me-1" /> Tạo vai trò
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Permission Assignment Modal */}
      <Modal show={showPerms} onHide={() => setShowPerms(false)} centered size="lg" scrollable>
        <Modal.Header closeButton className="border-0 pb-0">
          <div>
            <Modal.Title className="fw-bold fs-5">Phân quyền – {selectedRole?.name}</Modal.Title>
            <p className="text-muted fs-xs mb-0 mt-1">Tick vào quyền cần gán cho vai trò này</p>
          </div>
        </Modal.Header>
        <Modal.Body className="pt-3">
          {Object.entries(moduleGroups).map(([mod, perms]) => (
            <div key={mod} className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Badge bg="dark" className="rounded-pill px-2 py-1 fs-xs">{mod}</Badge>
                <div className="flex-grow-1 border-top border-light-subtle"></div>
              </div>
              <Row className="g-2">
                {perms.map(p => {
                  const checked = currentRolePerms.includes(p.id)
                  return (
                    <Col md={6} key={p.id}>
                      <div
                        className={`border rounded-3 p-3 cursor-pointer transition-all ${checked ? 'border-primary bg-primary-subtle' : 'border-light-subtle bg-light'}`}
                        onClick={() => handleTogglePerm(p.id)}
                        style={{ cursor: 'pointer' }}>
                        <div className="d-flex align-items-start gap-2">
                          <div className={`mt-0 rounded d-flex align-items-center justify-content-center flex-shrink-0`}
                            style={{ width: 20, height: 20, background: checked ? '#2563eb' : '#e5e7eb' }}>
                            {checked && <TbCheck style={{ color: '#fff', fontSize: 14 }} />}
                          </div>
                          <div>
                            <div className="fw-semibold text-dark fs-sm">{p.name}</div>
                            <div className="text-muted" style={{ fontSize: 11 }}>{p.description}</div>
                            <code className="fs-xs text-muted">{p.code}</code>
                          </div>
                        </div>
                      </div>
                    </Col>
                  )
                })}
              </Row>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <span className="text-muted fs-sm me-auto">
            Đã chọn <strong>{currentRolePerms.length}</strong> / {permissions.length} quyền
          </span>
          <Button variant="light" className="rounded-pill px-4" onClick={() => setShowPerms(false)}>Đóng</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered size="sm">
        <Modal.Body className="p-4 text-center">
          <div className="bg-danger-subtle rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 60, height: 60 }}>
            <TbTrash className="text-danger fs-2" />
          </div>
          <h5 className="fw-bold mb-2">Xóa vai trò?</h5>
          <p className="text-muted fs-sm">Vai trò <strong>{deleteTarget?.name}</strong> sẽ bị xóa. Người dùng đang giữ vai trò này sẽ mất quyền tương ứng!</p>
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
