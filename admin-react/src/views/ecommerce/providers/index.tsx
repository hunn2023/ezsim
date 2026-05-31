import { useState } from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  Nav,
  Tab,
  Button,
  Form,
  Badge,
  Modal,
  Table,
  Alert,
  Spinner
} from 'react-bootstrap'
import {
  TbSettings,
  TbSearch,
  TbEye,
  TbDatabase,
  TbCloudUpload,
  TbAlertTriangle,
  TbCheck,
  TbCoins,
  TbActivity,
  TbListDetails,
  TbChartPie
} from 'react-icons/tb'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useProviders } from '@/hooks/useProviders'
import { type WholesalerProvider } from '@/types/provider'

const formatUSD = (val: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
}

const getActionTypeBadge = (action: string) => {
  switch (action) {
    case 'purchase_esim':
      return (
        <Badge bg="primary-subtle" className="text-primary rounded-pill px-2.5 py-1.5 fs-xs border border-primary-subtle">
          Mua eSIM
        </Badge>
      )
    case 'activate_esim':
      return (
        <Badge bg="success-subtle" className="text-success rounded-pill px-2.5 py-1.5 fs-xs border border-success-subtle">
          Kích hoạt eSIM
        </Badge>
      )
    case 'topup_plan':
      return (
        <Badge bg="warning-subtle" className="text-warning rounded-pill px-2.5 py-1.5 fs-xs border border-warning-subtle">
          Nạp gói cước
        </Badge>
      )
    case 'query_balance':
      return (
        <Badge bg="info-subtle" className="text-info rounded-pill px-2.5 py-1.5 fs-xs border border-info-subtle">
          Kiểm tra số dư
        </Badge>
      )
    default:
      return <Badge bg="secondary-subtle" className="text-dark">{action}</Badge>
  }
}

const getHTTPStatusBadge = (code: number) => {
  if (code >= 200 && code < 300) {
    return <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fs-2xs fw-bold">{code} OK</span>
  }
  if (code >= 400 && code < 500) {
    return <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 fs-2xs fw-bold">{code} Client Err</span>
  }
  return <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1 fs-2xs fw-bold">{code} Server Err</span>
}

const Page = () => {
  const {
    providers,
    logs,
    statuses,
    toggleProviderStatus,
    updateProviderSettings,
    topupProviderBalance,
    pingProviderApi,
    reprovisionEsim
  } = useProviders()

  const [activeTab, setActiveTab] = useState<string>('wholesalers')
  const [searchLog, setSearchLog] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [providerFilter, setProviderFilter] = useState<string>('All')

  // Loading states for ping simulation
  const [pingingId, setPingingId] = useState<string | null>(null)

  // Config Wholesaler Modal State
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false)
  const [selectedWholesaler, setSelectedWholesaler] = useState<WholesalerProvider | null>(null)
  const [baseUrlInput, setBaseUrlInput] = useState<string>('')
  const [apiKeyInput, setApiKeyInput] = useState<string>('')

  // Topup Wholesaler Balance State
  const [showTopupModal, setShowTopupModal] = useState<boolean>(false)
  const [topupAmount, setTopupAmount] = useState<number>(500)

  // View API response drawer
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false)
  const [responseTitle, setResponseTitle] = useState<string>('')
  const [responseJson, setResponseJson] = useState<string>('')

  // Global alerts for reprovision actions
  const [reprovAlert, setReprovAlert] = useState<{ show: boolean; variant: string; message: string }>({
    show: false,
    variant: 'success',
    message: ''
  })

  // Trigger api ping simulation
  const handlePing = (id: string) => {
    setPingingId(id)
    setTimeout(() => {
      pingProviderApi(id)
      setPingingId(null)
    }, 800)
  }

  // Handle wholesaler configurations
  const handleOpenConfig = (w: WholesalerProvider) => {
    setSelectedWholesaler(w)
    setBaseUrlInput(w.apiBaseUrl)
    setApiKeyInput(w.apiKey)
    setShowConfigModal(true)
  }

  const handleSaveConfig = () => {
    if (selectedWholesaler) {
      updateProviderSettings(selectedWholesaler.id, {
        apiBaseUrl: baseUrlInput,
        apiKey: apiKeyInput
      })
      setShowConfigModal(false)
    }
  }

  // Handle wholesalel top-ups
  const handleOpenTopup = (w: WholesalerProvider) => {
    setSelectedWholesaler(w)
    setTopupAmount(500)
    setShowTopupModal(true)
  }

  const handleSaveTopup = () => {
    if (selectedWholesaler) {
      topupProviderBalance(selectedWholesaler.id, topupAmount)
      setShowTopupModal(false)
      // Display visual toast alert
      setReprovAlert({
        show: true,
        variant: 'success',
        message: `Đã nạp thành công ${formatUSD(topupAmount)} vào tài khoản Wholesaler ${selectedWholesaler.name}!`
      })
      setTimeout(() => setReprovAlert(prev => ({ ...prev, show: false })), 4000)
    }
  }

  // Handle eSIM reprovision retry
  const handleReprovision = (logId: string) => {
    const res = reprovisionEsim(logId)
    setReprovAlert({
      show: true,
      variant: res.success ? 'success' : 'danger',
      message: res.message
    })

    // Auto dismiss alert after 5s
    setTimeout(() => {
      setReprovAlert(prev => ({ ...prev, show: false }))
    }, 6000)
  }

  // Open view response drawer
  const handleOpenResponse = (logId: string) => {
    const logObj = logs.find(l => l.id === logId)
    if (!logObj) return

    const providerName = logObj.providerName
    const statusRecord = statuses.find(s => s.providerId === logObj.providerId && s.createdAt === logObj.createdAt)
    const jsonStr = statusRecord ? statusRecord.responseBody : '{"error": "No response captured"}'

    setResponseTitle(`API Response: ${providerName} (${logObj.id})`)
    setResponseJson(jsonStr)
    setShowResponseModal(true)
  }

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchSearch =
      log.variantName.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.id.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.content.toLowerCase().includes(searchLog.toLowerCase())

    const matchStatus =
      statusFilter === 'All' ||
      (statusFilter === 'success' && log.status) ||
      (statusFilter === 'error' && !log.status)

    const matchProv = providerFilter === 'All' || log.providerId === providerFilter

    return matchSearch && matchStatus && matchProv
  })

  // Wholesaler Card Theme Borders & Backgrounds
  const getProviderTheme = (name: string) => {
    switch (name.toLowerCase()) {
      case 'gigsky':
        return {
          borderLeft: '5px solid #005baa',
          badgeBg: '#005baa',
          gradient: 'linear-gradient(135deg, #e6f0fa 0%, #ffffff 100%)',
          textClass: 'text-primary'
        }
      case 'keepgo':
        return {
          borderLeft: '5px solid #ffaa00',
          badgeBg: '#ffaa00',
          gradient: 'linear-gradient(135deg, #fffbf0 0%, #ffffff 100%)',
          textClass: 'text-warning'
        }
      case 'telna':
        return {
          borderLeft: '5px solid #e03131',
          badgeBg: '#e03131',
          gradient: 'linear-gradient(135deg, #fff0f0 0%, #ffffff 100%)',
          textClass: 'text-danger'
        }
      case 'joytel':
        return {
          borderLeft: '5px solid #37b24d',
          badgeBg: '#37b24d',
          gradient: 'linear-gradient(135deg, #f4fbf7 0%, #ffffff 100%)',
          textClass: 'text-success'
        }
      default:
        return {
          borderLeft: '5px solid #6c757d',
          badgeBg: '#6c757d',
          gradient: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          textClass: 'text-secondary'
        }
    }
  }

  return (
    <Container fluid className="px-4 py-3">
      <PageBreadcrumb
        title="Quản Lý eSIM Wholesaler API"
        subtitle="Hệ thống cấu hình API đối tác & Giám sát cấp phát eSIM tự động"
      />

      {reprovAlert.show && (
        <Alert variant={reprovAlert.variant} className="border-0 shadow-sm rounded-4 py-3 px-4 fw-semibold mb-4 d-flex align-items-center">
          {reprovAlert.variant === 'success' ? <TbCheck className="me-2.5 fs-4" /> : <TbAlertTriangle className="me-2.5 fs-4" />}
          <div>{reprovAlert.message}</div>
        </Alert>
      )}

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'wholesalers')}>
        {/* Navigation Tabs */}
        <Row className="mb-4">
          <Col xs={12}>
            <Card className="border-0 shadow-sm rounded-4 bg-white p-2">
              <Nav variant="pills" className="nav-justified gap-1">
                <Nav.Item>
                  <Nav.Link eventKey="wholesalers" className="rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center">
                    <TbDatabase className="me-2 fs-5" /> eSIM Wholesalers (Kết nối)
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="logs" className="rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center">
                    <TbListDetails className="me-2 fs-5" /> Nhật ký API & Cấp phát lại (eSIM Logs)
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="analytics" className="rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center">
                    <TbChartPie className="me-2 fs-5" /> Thống kê & Phân tích
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card>
          </Col>
        </Row>

        {/* Tab contents */}
        <Tab.Content>
          {/* TAB 1: WHOLESALER CONNECTORS */}
          <Tab.Pane eventKey="wholesalers">
            <Row className="g-4">
              {providers.map((w) => {
                const theme = getProviderTheme(w.name)
                const isPingLoading = pingingId === w.id
                return (
                  <Col xl={6} key={w.id}>
                    <Card
                      className="border-0 shadow-sm rounded-4 overflow-hidden h-100 transition-all"
                      style={{
                        background: theme.gradient,
                        borderLeft: theme.borderLeft,
                        transition: 'transform 0.2s ease-in-out'
                      }}
                    >
                      <Card.Body className="p-4">
                        <Row className="align-items-start g-3">
                          {/* Logo and Switch Trigger */}
                          <Col sm={8}>
                            <div className="d-flex align-items-center mb-3">
                              <div className="bg-white p-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center me-3" style={{ width: '80px', height: '48px' }}>
                                <img
                                  src={w.logoUrl}
                                  alt={w.name}
                                  style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain'
                                  }}
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none'
                                  }}
                                />
                                <span className="fw-black text-muted fs-sm" style={{ display: w.logoUrl ? 'none' : 'block' }}>
                                  {w.name}
                                </span>
                              </div>
                              <div>
                                <h4 className="fw-bold text-dark mb-0">{w.displayName}</h4>
                                <small className="text-muted font-monospace">{w.id}</small>
                              </div>
                            </div>
                          </Col>

                          {/* Switch active toggle */}
                          <Col sm={4} className="text-sm-end d-flex justify-content-sm-end align-items-center mt-3 mt-sm-0">
                            <Form.Check
                              type="switch"
                              id={`switch-prov-${w.id}`}
                              checked={w.isActive}
                              onChange={() => toggleProviderStatus(w.id)}
                              className="fs-4 custom-switch cursor-pointer"
                              title={w.isActive ? 'Hủy kích hoạt kết nối' : 'Kích hoạt kết nối API'}
                            />
                          </Col>
                        </Row>

                        <hr className="my-3 border-light-subtle" />

                        {/* Account Balance and Connection ping status */}
                        <Row className="g-3 align-items-center mb-4">
                          <Col xs={6}>
                            <div className="bg-white p-3 rounded-4 border border-light-subtle shadow-sm">
                              <span className="text-muted fs-xs d-block mb-1">Số dư Tài khoản Wholesaler:</span>
                              <h3 className={`fw-black mb-0 font-monospace ${w.balance === 0 ? 'text-danger animate-pulse' : 'text-success'}`}>
                                {formatUSD(w.balance)}
                              </h3>
                              {w.balance === 0 && (
                                <Badge bg="danger" className="rounded-pill fs-2xs px-2 py-0.5 mt-1.5 fw-bold d-inline-flex align-items-center animate-bounce">
                                  <TbAlertTriangle className="me-1 fs-xs" /> Hết tiền tài khoản
                                </Badge>
                              )}
                            </div>
                          </Col>
                          <Col xs={6}>
                            <div className="bg-white p-3 rounded-4 border border-light-subtle shadow-sm h-100 d-flex flex-column justify-content-center">
                              <span className="text-muted fs-xs d-block mb-1">Đường truyền & Trạng thái:</span>
                              <div className="d-flex align-items-center flex-wrap gap-2">
                                <Badge
                                  bg={w.status === 'connected' ? 'success' : w.status === 'error' ? 'danger' : 'secondary'}
                                  className="rounded-pill px-2.5 py-1.5 fs-xs fw-bold"
                                >
                                  {w.status === 'connected' ? 'Đã kết nối' : w.status === 'error' ? 'Lỗi API (402)' : 'Tắt kết nối'}
                                </Badge>
                                {w.isActive && w.pingTimeMs > 0 && (
                                  <span className="fs-xs fw-bold text-dark font-monospace d-flex align-items-center">
                                    <TbActivity className="text-success me-1 fs-sm animate-pulse" /> {w.pingTimeMs}ms
                                  </span>
                                )}
                              </div>
                            </div>
                          </Col>
                        </Row>

                        {/* Masked API settings */}
                        <div className="bg-white rounded-4 p-3.5 mb-4 border border-light-subtle fs-xs text-dark shadow-sm">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">API Endpoint:</span>
                            <span className="font-monospace fw-semibold text-dark text-break text-end" style={{ maxWidth: '75%' }}>{w.apiBaseUrl}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Bearer Token:</span>
                            <span className="font-monospace fw-bold text-dark">{w.apiKey ? `${w.apiKey.slice(0, 10)}••••••••` : 'Chưa thiết lập'}</span>
                          </div>
                        </div>

                        {/* Action buttons row */}
                        <Row className="g-2">
                          <Col xs={4}>
                            <Button
                              variant="outline-dark"
                              size="sm"
                              className="w-100 rounded-pill py-2 fw-bold d-flex align-items-center justify-content-center"
                              onClick={() => handleOpenConfig(w)}
                            >
                              <TbSettings className="me-1 fs-base" /> Cấu hình
                            </Button>
                          </Col>
                          <Col xs={4}>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="w-100 rounded-pill py-2 fw-bold d-flex align-items-center justify-content-center"
                              onClick={() => handleOpenTopup(w)}
                            >
                              <TbCoins className="me-1 fs-base" /> Nạp tiền
                            </Button>
                          </Col>
                          <Col xs={4}>
                            <Button
                              variant="outline-success"
                              size="sm"
                              disabled={isPingLoading || !w.isActive}
                              className="w-100 rounded-pill py-2 fw-bold d-flex align-items-center justify-content-center shadow-none"
                              onClick={() => handlePing(w.id)}
                            >
                              {isPingLoading ? (
                                <Spinner animation="border" size="sm" className="me-1" />
                              ) : (
                                <TbActivity className="me-1 fs-base" />
                              )}
                              Ping Test
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          </Tab.Pane>

          {/* TAB 2: API CONNECTION LOGS */}
          <Tab.Pane eventKey="logs">
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4">
              <Card.Header className="bg-white border-bottom p-4">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                  <div>
                    <h4 className="fw-bolder text-dark mb-1">Nhật ký kết nối Wholesaler API</h4>
                    <p className="text-muted fs-sm mb-0">Giám sát các gói cước được cấp phát từ các đầu cổng viễn thông quốc tế.</p>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="d-flex flex-wrap align-items-center gap-3 mt-3 pt-2 border-top border-light-subtle">
                  <div className="app-search flex-grow-1" style={{ minWidth: '280px', position: 'relative' }}>
                    <input
                      type="search"
                      className="form-control rounded-pill px-4 py-2 fs-sm bg-light border-0 shadow-none"
                      placeholder="Tìm theo sản phẩm, mã log, nội dung..."
                      value={searchLog}
                      onChange={(e) => setSearchLog(e.target.value)}
                    />
                    <TbSearch className="app-search-icon text-muted" style={{ position: 'absolute', right: '15px', top: '12px' }} />
                  </div>

                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    {/* Status Filter */}
                    <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border border-light-subtle">
                      <span className="text-muted fs-xs me-2">Kết quả:</span>
                      <select
                        className="form-select form-select-sm bg-transparent border-0 shadow-none fw-medium text-dark cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="All">Tất cả kết quả</option>
                        <option value="success">Thành công</option>
                        <option value="error">Thất bại</option>
                      </select>
                    </div>

                    {/* Provider Filter */}
                    <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border border-light-subtle">
                      <span className="text-muted fs-xs me-2">Wholesaler:</span>
                      <select
                        className="form-select form-select-sm bg-transparent border-0 shadow-none fw-medium text-dark cursor-pointer"
                        value={providerFilter}
                        onChange={(e) => setProviderFilter(e.target.value)}
                      >
                        <option value="All">Tất cả Wholesalers</option>
                        {providers.map(w => (
                          <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </Card.Header>

              {/* Logs Table */}
              <div className="p-0 table-responsive">
                <Table hover responsive className="mb-0 table-borderless">
                  <thead className="bg-light border-bottom text-muted fs-xs uppercase">
                    <tr>
                      <th className="px-4 py-3">Mã log API</th>
                      <th className="py-3">Hành động</th>
                      <th className="py-3">Wholesaler</th>
                      <th className="py-3">Sản phẩm / variant</th>
                      <th className="py-3 text-center">HTTP Code</th>
                      <th className="py-3">Thời gian kết nối</th>
                      <th className="px-4 py-3 text-end">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-5 text-muted">
                          Không tìm thấy nhật ký kết nối viễn thông nào phù hợp.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => {
                        const statusRecord = statuses.find(s => s.providerId === log.providerId && s.createdAt === log.createdAt)
                        const statusCode = statusRecord ? statusRecord.statusCode : 200
                        const isSuccess = log.status

                        return (
                          <tr key={log.id} className="border-bottom border-light-subtle">
                            <td className="px-4 py-3">
                              <code className="bg-light text-dark px-2 py-1 rounded font-monospace fs-xs">{log.id}</code>
                            </td>
                            <td className="py-3">
                              {getActionTypeBadge(log.type)}
                            </td>
                            <td className="py-3">
                              <span className="fw-bold text-dark">{log.providerName}</span>
                            </td>
                            <td className="py-3">
                              <div style={{ maxWidth: '240px' }}>
                                <span className="fw-semibold text-dark d-block text-truncate leading-tight">{log.variantName}</span>
                                <small className="text-muted fs-xs font-monospace">{log.variantId}</small>
                              </div>
                            </td>
                            <td className="py-3 text-center">
                              {getHTTPStatusBadge(statusCode)}
                            </td>
                            <td className="py-3">
                              <span className="fs-xs text-muted fw-semibold">
                                {new Date(log.createdAt).toLocaleString('vi-VN')}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-end">
                              <div className="d-flex gap-1.5 justify-content-end align-items-center">
                                {/* Details Trigger */}
                                <Button
                                  variant="light"
                                  size="sm"
                                  className="btn-icon rounded-circle shadow-sm"
                                  title="Xem Response thô"
                                  onClick={() => handleOpenResponse(log.id)}
                                >
                                  <TbEye className="fs-base text-primary" />
                                </Button>

                                {/* Reprovision (Retry) trigger */}
                                {!isSuccess && log.type === 'purchase_esim' && (
                                  <Button
                                    variant="outline-warning"
                                    size="sm"
                                    className="rounded-pill px-3 py-1 fw-bold fs-xs d-inline-flex align-items-center shadow-sm"
                                    title="Cấp phát lại eSIM và đẩy thẳng vào Kho hàng"
                                    onClick={() => handleReprovision(log.id)}
                                  >
                                    <TbCloudUpload className="me-1 fs-sm animate-pulse" /> Cấp phát lại
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Tab.Pane>

          {/* TAB 3: STATS & ANALYTICS */}
          <Tab.Pane eventKey="analytics">
            <Row className="g-4 mb-4">
              {/* Stat Card 1 */}
              <Col xl={3} sm={6}>
                <Card className="border-0 shadow-sm rounded-4 bg-white p-4">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted fw-bold fs-sm">Tổng số cuộc gọi API</span>
                    <div className="bg-primary-subtle p-2 rounded-3 text-primary d-flex align-items-center justify-content-center">
                      <TbActivity className="fs-4" />
                    </div>
                  </div>
                  <h2 className="fw-black mb-1 font-monospace">2,452</h2>
                  <span className="text-success fs-xs fw-bold">+18.5% từ tháng trước</span>
                </Card>
              </Col>

              {/* Stat Card 2 */}
              <Col xl={3} sm={6}>
                <Card className="border-0 shadow-sm rounded-4 bg-white p-4">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted fw-bold fs-sm">Tỷ lệ kết nối Thành công</span>
                    <div className="bg-success-subtle p-2 rounded-3 text-success d-flex align-items-center justify-content-center">
                      <TbCheck className="fs-4" />
                    </div>
                  </div>
                  <h2 className="fw-black mb-1 font-monospace">98.6%</h2>
                  <span className="text-success fs-xs fw-bold">+0.4% cải thiện</span>
                </Card>
              </Col>

              {/* Stat Card 3 */}
              <Col xl={3} sm={6}>
                <Card className="border-0 shadow-sm rounded-4 bg-white p-4">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted fw-bold fs-sm">Độ trễ (Latency) Trung bình</span>
                    <div className="bg-info-subtle p-2 rounded-3 text-info d-flex align-items-center justify-content-center">
                      <TbActivity className="fs-4 animate-pulse" />
                    </div>
                  </div>
                  <h2 className="fw-black mb-1 font-monospace">68ms</h2>
                  <span className="text-success fs-xs fw-bold">Ổn định (Dưới 100ms)</span>
                </Card>
              </Col>

              {/* Stat Card 4 */}
              <Col xl={3} sm={6}>
                <Card className="border-0 shadow-sm rounded-4 bg-white p-4">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted fw-bold fs-sm">Quỹ Wholesalers còn lại</span>
                    <div className="bg-warning-subtle p-2 rounded-3 text-warning d-flex align-items-center justify-content-center">
                      <TbCoins className="fs-4" />
                    </div>
                  </div>
                  <h2 className="fw-black mb-1 font-monospace">{formatUSD(providers.reduce((acc, curr) => acc + curr.balance, 0))}</h2>
                  <span className="text-danger fs-xs fw-bold">Cần bổ sung quỹ Telna</span>
                </Card>
              </Col>
            </Row>

            {/* Graphic visual overview */}
            <Row>
              <Col lg={7}>
                <Card className="border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
                  <h5 className="fw-bolder text-dark mb-1">Mật độ giao dịch & sản lượng theo Wholesaler</h5>
                  <p className="text-muted fs-xs mb-4">Tỷ trọng cấp phát eSIM dựa trên giá cước và độ tin cậy kết nối API.</p>

                  <div className="d-flex align-items-center gap-4 flex-wrap justify-content-center py-4">
                    {providers.map((w, index) => {
                      const share = [45, 30, 15, 10][index] || 10
                      const theme = getProviderTheme(w.name)
                      return (
                        <div key={w.id} className="text-center p-3 rounded-4 bg-light border" style={{ minWidth: '120px' }}>
                          <span className="fw-black text-dark fs-2 mb-1 d-block font-monospace">{share}%</span>
                          <span className={`fw-black fs-sm d-block ${theme.textClass}`}>{w.name}</span>
                          <small className="text-muted fs-xs">Ping: {w.pingTimeMs || 'N/A'}ms</small>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              </Col>
              
              <Col lg={5}>
                <Card className="border-0 shadow-sm rounded-4 bg-white p-4 mb-4 h-100">
                  <h5 className="fw-bolder text-dark mb-1">Kiểm định API viễn thông</h5>
                  <p className="text-muted fs-xs mb-3">Các chỉ tiêu đo lường chất lượng tích hợp nhà cung cấp viễn thông eSIM.</p>
                  
                  <div className="fs-sm mt-2">
                    <div className="d-flex justify-content-between mb-2 pb-2 border-bottom border-light-subtle">
                      <span className="text-muted">Định dạng nạp SIM tự động:</span>
                      <strong className="text-dark">LPA String (QR Code eSIM)</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2 pb-2 border-bottom border-light-subtle">
                      <span className="text-muted">Cơ chế phát hiện lỗi số dư:</span>
                      <strong className="text-danger">Tự động báo động (HTTP 402)</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2 pb-2 border-bottom border-light-subtle">
                      <span className="text-muted">Cấp phát dự phòng (Fallback):</span>
                      <strong className="text-success">Cấp phát tay từ Phôi SIM Kho hàng</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Thời gian cấp phát trung bình:</span>
                      <strong className="text-dark">1.2 giây/eSIM</strong>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* --- MODAL 1: EDIT CONFIG --- */}
      <Modal show={showConfigModal} onHide={() => setShowConfigModal(false)} centered>
        <Modal.Header closeButton className="border-bottom px-4">
          <Modal.Title className="fw-bolder text-dark">
            Cấu hình đối tác: {selectedWholesaler?.displayName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-4 fs-sm">
          <Form>
            {/* Base Endpoint URL */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-dark">wholesaler Base API Gateway Endpoint URL</Form.Label>
              <Form.Control
                type="text"
                value={baseUrlInput}
                onChange={(e) => setBaseUrlInput(e.target.value)}
                className="rounded-3 shadow-none border-light-subtle font-monospace"
              />
            </Form.Group>

            {/* Bearer token */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-dark">API Access Token / Authorization Bearer Secret</Form.Label>
              <Form.Control
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="rounded-3 shadow-none border-light-subtle font-monospace"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-top px-4">
          <Button variant="outline-secondary" className="rounded-pill px-3" onClick={() => setShowConfigModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" className="rounded-pill px-4 fw-bold shadow-sm" onClick={handleSaveConfig}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- MODAL 2: TOPUP ACCOUNT FUNDS --- */}
      <Modal show={showTopupModal} onHide={() => setShowTopupModal(false)} centered>
        <Modal.Header closeButton className="border-bottom px-4 bg-primary-subtle text-primary">
          <Modal.Title className="fw-bolder">
            Nạp quỹ tài khoản eSIM Wholesaler
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-4 fs-sm">
          <div className="mb-3 text-muted">
            Tài khoản API đối tác <strong className="text-dark">{selectedWholesaler?.name}</strong> hiện đang có số dư khả dụng là <strong className="text-success font-monospace fw-bold">{selectedWholesaler && formatUSD(selectedWholesaler.balance)}</strong>.
          </div>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-dark">Chọn số tiền USD cần bổ sung vào quỹ</Form.Label>
              <Form.Select
                value={topupAmount}
                onChange={(e) => setTopupAmount(Number(e.target.value))}
                className="rounded-3 shadow-none border-light-subtle font-monospace fw-bold text-success cursor-pointer"
              >
                <option value={100}>+ $100.00 USD</option>
                <option value={200}>+ $200.00 USD</option>
                <option value={500}>+ $500.00 USD</option>
                <option value={1000}>+ $1,000.00 USD</option>
                <option value={2000}>+ $2,000.00 USD</option>
              </Form.Select>
            </Form.Group>
            <Alert variant="info" className="border-0 rounded-3 fs-xs mb-0 py-2.5 px-3">
              Tiền sẽ được cộng trực tiếp vào quỹ wholesale viễn thông ngay tức khắc. Mọi cuộc gọi API cấp phát eSIM bị treo do lỗi hết tiền (Code 402) sẽ có thể thực hiện **Reprovision (Cấp phát lại)** ngay lập tức.
            </Alert>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-top px-4">
          <Button variant="outline-secondary" className="rounded-pill px-3" onClick={() => setShowTopupModal(false)}>
            Hủy
          </Button>
          <Button variant="success" className="rounded-pill px-4 fw-bold shadow-sm" onClick={handleSaveTopup}>
            Nạp tiền ngay
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- MODAL 3: VIEW API RAW JSON RESPONSE --- */}
      <Modal show={showResponseModal} onHide={() => setShowResponseModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-bottom px-4">
          <Modal.Title className="fw-bolder text-dark font-monospace fs-sm">
            {responseTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <pre
            className="mb-0 p-4 bg-dark text-success font-monospace fs-xs"
            style={{
              maxHeight: '450px',
              overflowY: 'auto',
              borderRadius: '0 0 12px 12px'
            }}
          >
            {responseJson.startsWith('{') ? JSON.stringify(JSON.parse(responseJson), null, 2) : responseJson}
          </pre>
        </Modal.Body>
        <Modal.Footer className="border-top px-4">
          <Button variant="secondary" className="rounded-pill px-4 fw-bold" onClick={() => setShowResponseModal(false)}>
            Đóng lại
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Page
