import { Container, Row, Col, Card, Table, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { TbCheck, TbX, TbKey, TbShieldLock, TbInfoCircle } from 'react-icons/tb'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useUsers } from '@/hooks/useUsers'

const Page = () => {
  const { permissions, roles } = useUsers()

  // Group permissions by module
  const moduleGroups = permissions.reduce<Record<string, typeof permissions>>((acc, p) => {
    if (!acc[p.module]) acc[p.module] = []
    acc[p.module].push(p)
    return acc
  }, {})

  const ROLE_COLOR_MAP: Record<string, string> = {
    'super_admin': '#ef4444',
    'admin': '#3b82f6',
    'operator': '#22c55e',
    'finance': '#f59e0b',
    'viewer': '#6b7280'
  }

  const hasPermission = (roleId: string, permId: string) => {
    return roles.find(r => r.id === roleId)?.permissionIds.includes(permId) ?? false
  }

  return (
    <Container fluid className="px-4 py-3">
      <PageBreadcrumb title="Ma trận Phân quyền Hệ thống" subtitle="Kiểm tra phân quyền chi tiết theo từng vai trò và module" />

      {/* Summary Stats */}
      <Row className="g-3 mb-4">
        <Col xl={3} sm={6}>
          <Card className="border-0 shadow-sm rounded-4" style={{ background: '#e8f0fe' }}>
            <Card.Body className="d-flex align-items-center gap-3 p-4">
              <div className="bg-primary bg-opacity-15 rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 52, height: 52, flexShrink: 0 }}>
                <TbKey className="text-primary fs-3" />
              </div>
              <div>
                <div className="fs-xxl fw-black text-dark">{permissions.length}</div>
                <div className="fs-xs text-muted fw-semibold">Tổng quyền hạn</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} sm={6}>
          <Card className="border-0 shadow-sm rounded-4" style={{ background: '#e6f9f0' }}>
            <Card.Body className="d-flex align-items-center gap-3 p-4">
              <div className="bg-success bg-opacity-15 rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 52, height: 52, flexShrink: 0 }}>
                <TbShieldLock className="text-success fs-3" />
              </div>
              <div>
                <div className="fs-xxl fw-black text-dark">{roles.length}</div>
                <div className="fs-xs text-muted fw-semibold">Vai trò</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} sm={6}>
          <Card className="border-0 shadow-sm rounded-4" style={{ background: '#fff8e6' }}>
            <Card.Body className="d-flex align-items-center gap-3 p-4">
              <div className="bg-warning bg-opacity-15 rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 52, height: 52, flexShrink: 0 }}>
                <TbCheck className="text-warning fs-3" />
              </div>
              <div>
                <div className="fs-xxl fw-black text-dark">
                  {roles.reduce((s, r) => s + r.permissionIds.length, 0)}
                </div>
                <div className="fs-xs text-muted fw-semibold">Tổng phân quyền đã cấp</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} sm={6}>
          <Card className="border-0 shadow-sm rounded-4" style={{ background: '#f5e6ff' }}>
            <Card.Body className="d-flex align-items-center gap-3 p-4">
              <div style={{ width: 52, height: 52, flexShrink: 0, background: '#e9d5ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TbInfoCircle style={{ color: '#7c3aed', fontSize: '1.5rem' }} />
              </div>
              <div>
                <div className="fs-xxl fw-black text-dark">{Object.keys(moduleGroups).length}</div>
                <div className="fs-xs text-muted fw-semibold">Module hệ thống</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Legend */}
      <div className="d-flex align-items-center gap-4 mb-3 px-1 fs-xs text-muted fw-semibold">
        <span className="d-flex align-items-center gap-1">
          <span className="bg-success rounded-circle d-inline-block" style={{ width: 12, height: 12 }}></span> Đã được cấp quyền
        </span>
        <span className="d-flex align-items-center gap-1">
          <span className="bg-danger bg-opacity-25 rounded-circle d-inline-block" style={{ width: 12, height: 12 }}></span> Chưa cấp quyền
        </span>
        <span className="ms-auto">
          Hover vào ô để xem mô tả quyền hạn
        </span>
      </div>

      {/* Permission Matrix Table */}
      {Object.entries(moduleGroups).map(([mod, perms]) => (
        <Card key={mod} className="border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4">
          <Card.Header className="bg-white border-bottom p-3 d-flex align-items-center gap-2">
            <Badge bg="dark" className="rounded-pill px-3 py-1 fs-xs fw-bold">{mod}</Badge>
            <span className="text-muted fs-xs">{perms.length} quyền hạn trong module này</span>
          </Card.Header>
          <div className="table-responsive p-0">
            <Table className="mb-0 table-borderless" style={{ tableLayout: 'fixed' }}>
              <thead className="bg-light border-bottom">
                <tr>
                  <th className="px-4 py-3 text-muted fs-xs" style={{ width: '35%' }}>Quyền hạn</th>
                  {roles.map(r => {
                    const color = ROLE_COLOR_MAP[r.code] || '#6b7280'
                    return (
                      <th key={r.id} className="py-3 text-center fs-xs" style={{ width: `${65 / roles.length}%` }}>
                        <div className="d-flex flex-column align-items-center gap-1">
                          <div className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: 32, height: 32, background: color + '20', flexShrink: 0 }}>
                            <TbShieldLock style={{ color, fontSize: '1rem' }} />
                          </div>
                          <span className="text-dark fw-semibold" style={{ fontSize: 11, textAlign: 'center', lineHeight: 1.2 }}>
                            {r.name.split(' ')[0]}
                          </span>
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {perms.map((p, i) => (
                  <tr key={p.id} className="border-bottom border-light-subtle align-middle"
                    style={{ background: i % 2 === 0 ? '#fafafa' : '#fff' }}>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-start gap-2">
                        <OverlayTrigger placement="right"
                          overlay={<Tooltip id={`tip-${p.id}`}>{p.description}</Tooltip>}>
                          <TbInfoCircle className="text-muted fs-sm mt-0 flex-shrink-0" style={{ cursor: 'help' }} />
                        </OverlayTrigger>
                        <div>
                          <div className="fw-semibold text-dark fs-sm">{p.name}</div>
                          <code className="fs-xs text-muted">{p.code}</code>
                        </div>
                      </div>
                    </td>
                    {roles.map(r => {
                      const granted = hasPermission(r.id, p.id)
                      const color = ROLE_COLOR_MAP[r.code] || '#6b7280'
                      return (
                        <td key={r.id} className="py-3 text-center">
                          <OverlayTrigger placement="top"
                            overlay={
                              <Tooltip id={`tip-${r.id}-${p.id}`}>
                                {r.name}: {granted ? `✅ Có quyền "${p.name}"` : `❌ Không có quyền "${p.name}"`}
                              </Tooltip>
                            }>
                            <div className="d-flex align-items-center justify-content-center" style={{ cursor: 'default' }}>
                              {granted ? (
                                <div className="rounded-circle d-flex align-items-center justify-content-center"
                                  style={{ width: 28, height: 28, background: '#dcfce7' }}>
                                  <TbCheck style={{ color: '#16a34a', fontSize: '1rem' }} />
                                </div>
                              ) : (
                                <div className="rounded-circle d-flex align-items-center justify-content-center"
                                  style={{ width: 28, height: 28, background: '#fee2e2' }}>
                                  <TbX style={{ color: '#dc2626', fontSize: '1rem' }} />
                                </div>
                              )}
                            </div>
                          </OverlayTrigger>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      ))}
    </Container>
  )
}

export default Page
