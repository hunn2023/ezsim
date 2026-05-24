import { useState, useEffect } from 'react'
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
  Alert
} from 'react-bootstrap'
import { Link } from 'react-router'
import {
  TbCreditCard,
  TbWallet,
  TbBuildingBank,
  TbQrcode,
  TbCheck,
  TbX,
  TbClock,
  TbSettings,
  TbRefresh,
  TbTerminal2,
  TbBroadcast,
  TbShieldCheck,
  TbSearch,
  TbEye
} from 'react-icons/tb'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { usePayments } from '@/hooks/usePayments'
import { type PaymentProvider, type PaymentTransaction } from '@/types/payment'

const formatVND = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
}

const getPaymentStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return (
        <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fs-xs fw-semibold d-inline-flex align-items-center shadow-sm">
          <TbCheck className="me-1 fs-sm" /> Đã thanh toán
        </span>
      )
    case 'pending':
      return (
        <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1 fs-xs fw-semibold d-inline-flex align-items-center shadow-sm">
          <TbClock className="me-1 fs-sm" /> Chờ xử lý
        </span>
      )
    case 'processing':
      return (
        <span className="badge bg-info-subtle text-info border border-info-subtle px-2 py-1 fs-xs fw-semibold d-inline-flex align-items-center shadow-sm">
          <TbClock className="me-1 fs-sm" /> Đang xử lý
        </span>
      )
    case 'failed':
      return (
        <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 fs-xs fw-semibold d-inline-flex align-items-center shadow-sm">
          <TbX className="me-1 fs-sm" /> Thất bại
        </span>
      )
    case 'refunded':
      return (
        <span className="badge bg-dark-subtle text-dark border border-dark-subtle px-2 py-1 fs-xs fw-semibold d-inline-flex align-items-center shadow-sm">
          <TbRefresh className="me-1 fs-sm" /> Đã hoàn tiền
        </span>
      )
    default:
      return <span className="badge bg-light text-dark">{status}</span>
  }
}

const getPaymentMethodIcon = (methodType: string) => {
  switch (methodType) {
    case 'E-Wallet':
      return <TbWallet className="text-primary me-2 fs-5" />
    case 'Bank Transfer':
      return <TbBuildingBank className="text-info me-2 fs-5" />
    case 'QR Code':
      return <TbQrcode className="text-success me-2 fs-5" />
    case 'Card':
      return <TbCreditCard className="text-warning me-2 fs-5" />
    default:
      return <TbWallet className="text-secondary me-2 fs-5" />
  }
}

const Page = () => {
  const {
    providers,
    methods,
    transactions,
    callbacks,
    toggleProviderStatus,
    updateProviderSettings,
    toggleMethodStatus,
    simulateWebhookCallback,
    refundTransaction
  } = usePayments()

  // Local states
  const [activeTab, setActiveTab] = useState<string>('gateways')
  const [searchTx, setSearchTx] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [providerFilter, setProviderFilter] = useState<string>('All')

  // Edit Gateway modal state
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false)
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null)
  const [apiKeyInput, setApiKeyInput] = useState<string>('')
  const [secretKeyInput, setSecretKeyInput] = useState<string>('')
  const [environmentInput, setEnvironmentInput] = useState<0 | 1>(0)

  // Refund Modal state
  const [showRefundModal, setShowRefundModal] = useState<boolean>(false)
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null)
  const [refundReason, setRefundReason] = useState<string>('')

  // View Log Modal state
  const [showLogModal, setShowLogModal] = useState<boolean>(false)
  const [logPayload, setLogPayload] = useState<string>('')
  const [logTitle, setLogTitle] = useState<string>('')

  // Webhook Simulator state
  const [simProvider, setSimProvider] = useState<string>('PROV-VNPAY')
  const [simOrderCode, setSimOrderCode] = useState<string>('ORD-882912')
  const [simStatus, setSimStatus] = useState<'success' | 'failed' | 'invalid_signature'>('success')
  const [simAmount, setSimAmount] = useState<number>(1230000)
  const [simAlert, setSimAlert] = useState<{ show: boolean; variant: string; message: string }>({
    show: false,
    variant: 'success',
    message: ''
  })

  // Dynamic order list from localStorage for simulator
  const [orderList, setOrderList] = useState<any[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('ezsim_orders')
    if (stored) {
      setOrderList(JSON.parse(stored))
    }
  }, [callbacks, transactions])

  // Open config modal
  const handleOpenConfig = (p: PaymentProvider) => {
    setSelectedProvider(p)
    setApiKeyInput(p.apiKey)
    setSecretKeyInput(p.secretKey)
    setEnvironmentInput(p.environment)
    setShowConfigModal(true)
  }

  const handleSaveConfig = () => {
    if (selectedProvider) {
      updateProviderSettings(selectedProvider.id, {
        apiKey: apiKeyInput,
        secretKey: secretKeyInput,
        environment: environmentInput
      })
      setShowConfigModal(false)
    }
  }

  // Open refund modal
  const handleOpenRefund = (tx: PaymentTransaction) => {
    setSelectedTx(tx)
    setRefundReason('')
    setShowRefundModal(true)
  }

  const handleSaveRefund = () => {
    if (selectedTx) {
      refundTransaction(selectedTx.id, refundReason)
      setShowRefundModal(false)
    }
  }

  // Open view logs
  const handleOpenLogs = (title: string, payload: string) => {
    setLogTitle(title)
    setLogPayload(payload)
    setShowLogModal(true)
  }

  // Handle mock Webhook send
  const handleSendWebhook = () => {
    const chosenProvider = providers.find(p => p.id === simProvider)
    const providerName = chosenProvider ? chosenProvider.name : 'VNPay'

    let payload: any = {}
    const txId = Math.floor(100000000 + Math.random() * 900000000).toString()

    if (providerName.toLowerCase() === 'vnpay') {
      payload = {
        vnp_Amount: (simAmount * 100).toString(),
        vnp_BankCode: 'NCB',
        vnp_BankTranNo: `VNPAY-${txId}`,
        vnp_CardType: 'ATM',
        vnp_OrderInfo: `Thanh toan don hang ${simOrderCode}`,
        vnp_ResponseCode: simStatus === 'success' ? '00' : '99',
        vnp_TxnRef: simOrderCode
      }
    } else if (providerName.toLowerCase() === 'momo') {
      payload = {
        partnerCode: 'MOMO',
        orderId: simOrderCode,
        amount: simAmount,
        transId: txId,
        resultCode: simStatus === 'success' ? 0 : 99,
        message: simStatus === 'success' ? 'Success' : 'Transaction failed due to balance'
      }
    } else if (providerName.toLowerCase() === 'stripe') {
      payload = {
        stripe_charge_id: `ch_stripe_${txId}`,
        amount: simAmount,
        currency: 'vnd',
        status: simStatus === 'success' ? 'succeeded' : 'failed',
        order_id: simOrderCode
      }
    } else {
      // PayOS / PayPal
      payload = {
        orderCode: simOrderCode,
        amount: simAmount,
        status: simStatus === 'success' ? 'PAID' : 'FAILED',
        transId: `PAYOS-${txId}`
      }
    }

    const res = simulateWebhookCallback(simProvider, simOrderCode, simStatus, payload)

    setSimAlert({
      show: true,
      variant: res.success ? 'success' : 'danger',
      message: res.message
    })

    // Auto dismiss alert after 5s
    setTimeout(() => {
      setSimAlert(prev => ({ ...prev, show: false }))
    }, 5000)
  }

  // Filtered transactions list
  const filteredTransactions = transactions.filter(tx => {
    const matchSearch =
      tx.orderCode.toLowerCase().includes(searchTx.toLowerCase()) ||
      tx.transactionCode.toLowerCase().includes(searchTx.toLowerCase())

    const matchStatus = statusFilter === 'All' || tx.status === statusFilter
    const matchProv = providerFilter === 'All' || tx.paymentProviderId === providerFilter

    return matchSearch && matchStatus && matchProv
  })

  // Theme borders/colors mapping for gateways
  const getProviderTheme = (name: string) => {
    switch (name.toLowerCase()) {
      case 'vnpay':
        return {
          borderLeft: '5px solid #005baa',
          badgeBg: '#005baa',
          gradient: 'linear-gradient(135deg, #e6f0fa 0%, #ffffff 100%)'
        }
      case 'momo':
        return {
          borderLeft: '5px solid #a50064',
          badgeBg: '#a50064',
          gradient: 'linear-gradient(135deg, #fbeaf3 0%, #ffffff 100%)'
        }
      case 'paypal':
        return {
          borderLeft: '5px solid #003087',
          badgeBg: '#003087',
          gradient: 'linear-gradient(135deg, #e6ebf5 0%, #ffffff 100%)'
        }
      case 'stripe':
        return {
          borderLeft: '5px solid #635bff',
          badgeBg: '#635bff',
          gradient: 'linear-gradient(135deg, #f0eefc 0%, #ffffff 100%)'
        }
      case 'payos':
        return {
          borderLeft: '5px solid #ff4500',
          badgeBg: '#ff4500',
          gradient: 'linear-gradient(135deg, #fff0eb 0%, #ffffff 100%)'
        }
      default:
        return {
          borderLeft: '5px solid #6c757d',
          badgeBg: '#6c757d',
          gradient: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
        }
    }
  }

  return (
    <Container fluid className="px-4 py-3">
      <PageBreadcrumb
        title="Quản Lý Đa Cổng Thanh Toán"
        subtitle="Hệ thống tích hợp cổng & đối soát giao dịch"
      />

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'gateways')}>
        {/* Header Tab Navigation */}
        <Row className="mb-4">
          <Col xs={12}>
            <Card className="border-0 shadow-sm rounded-4 bg-white p-2">
              <Nav variant="pills" className="nav-justified gap-1">
                <Nav.Item>
                  <Nav.Link eventKey="gateways" className="rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center">
                    <TbShieldCheck className="me-2 fs-5" /> Cổng thanh toán (Gateways)
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="methods" className="rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center">
                    <TbCreditCard className="me-2 fs-5" /> Phương thức (Methods)
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="transactions" className="rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center">
                    <TbRefresh className="me-2 fs-5" /> Đối soát & Giao dịch
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="simulator" className="rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center">
                    <TbTerminal2 className="me-2 fs-5" /> Bộ giả lập Webhook
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card>
          </Col>
        </Row>

        {/* Tab Content */}
        <Tab.Content>
          {/* TAB 1: PAYMENT GATEWAYS */}
          <Tab.Pane eventKey="gateways">
            <Row className="g-4">
              {providers.map((p) => {
                const theme = getProviderTheme(p.name)
                return (
                  <Col xl={4} md={6} key={p.id}>
                    <Card
                      className="border-0 shadow-sm rounded-4 overflow-hidden h-100 transition-all hover-translate-y"
                      style={{
                        background: theme.gradient,
                        borderLeft: theme.borderLeft,
                        transition: 'transform 0.2s ease-in-out'
                      }}
                    >
                      <Card.Body className="p-4 d-flex flex-column justify-content-between">
                        <div>
                          {/* Logo and Switch Toggle */}
                          <div className="d-flex align-items-center justify-content-between mb-4">
                            <div className="bg-white p-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '80px', height: '48px' }}>
                              <img
                                src={p.logoUrl}
                                alt={p.name}
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  objectFit: 'contain'
                                }}
                                onError={(e) => {
                                  // Fallback text if image fails to load
                                  (e.target as HTMLElement).style.display = 'none'
                                }}
                              />
                              <span className="fw-bold text-muted fs-xs" style={{ display: p.logoUrl ? 'none' : 'block' }}>
                                {p.name}
                              </span>
                            </div>
                            <Form.Check
                              type="switch"
                              id={`switch-${p.id}`}
                              checked={p.isActive}
                              onChange={() => toggleProviderStatus(p.id)}
                              className="fs-4 custom-switch cursor-pointer"
                              title={p.isActive ? 'Bấm để hủy kích hoạt' : 'Bấm để kích hoạt'}
                            />
                          </div>

                          {/* Provider Info */}
                          <h4 className="fw-bold text-dark mb-1">{p.displayName}</h4>
                          <p className="text-muted fs-xs mb-3">Mã định danh: <code className="bg-light px-1 rounded">{p.id}</code></p>

                          {/* Details Badges */}
                          <div className="d-flex gap-2 mb-4 flex-wrap">
                            <Badge bg={p.isActive ? 'success' : 'secondary'} className="rounded-pill px-2.5 py-1.5 fs-xs fw-semibold">
                              {p.isActive ? 'Hoạt động' : 'Tạm dừng'}
                            </Badge>
                            <Badge
                              bg={p.environment === 1 ? 'danger' : 'warning'}
                              text={p.environment === 1 ? 'white' : 'dark'}
                              className="rounded-pill px-2.5 py-1.5 fs-xs fw-semibold"
                            >
                              {p.environment === 1 ? 'Production' : 'Sandbox (Test)'}
                            </Badge>
                          </div>

                          {/* Secure Parameter masked summary */}
                          <div className="bg-white rounded-3 p-3 mb-4 border border-light-subtle fs-xs text-dark shadow-sm">
                            <div className="d-flex justify-content-between mb-1.5">
                              <span className="text-muted">API Client ID:</span>
                              <span className="font-monospace fw-bold">{p.apiKey ? `${p.apiKey.slice(0, 8)}...` : 'Chưa thiết lập'}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span className="text-muted">Secret Hash Key:</span>
                              <span className="font-monospace fw-bold">{p.secretKey ? '••••••••••••••••' : 'Chưa thiết lập'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Config Action Button */}
                        <div className="mt-auto">
                          <Button
                            variant="outline-dark"
                            size="sm"
                            className="w-100 rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center shadow-sm"
                            onClick={() => handleOpenConfig(p)}
                          >
                            <TbSettings className="me-1.5 fs-base" /> Cấu hình tham số
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          </Tab.Pane>

          {/* TAB 2: PAYMENT METHODS */}
          <Tab.Pane eventKey="methods">
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4">
              <Card.Header className="bg-white border-bottom p-4">
                <h4 className="fw-bolder text-dark mb-1">Phương thức thanh toán cụ thể</h4>
                <p className="text-muted fs-sm mb-0">Quản lý kích hoạt các kênh thanh toán phụ trợ và thiết lập phí dịch vụ đối soát.</p>
              </Card.Header>

              <div className="p-0 table-responsive">
                <Table hover responsive className="mb-0 table-borderless">
                  <thead className="bg-light border-bottom text-muted fs-xs uppercase">
                    <tr>
                      <th className="px-4 py-3">Phương thức</th>
                      <th className="py-3">Phân loại</th>
                      <th className="py-3">Cổng liên kết</th>
                      <th className="py-3 text-center">Phí dịch vụ ước tính</th>
                      <th className="py-3 text-center">Trạng thái</th>
                      <th className="px-4 py-3 text-end">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {methods.map((m) => {
                      const linkedProv = providers.find(p => p.id === m.providerId)
                      return (
                        <tr key={m.id} className="border-bottom border-light-subtle">
                          <td className="px-4 py-3">
                            <div className="d-flex align-items-center">
                              <div className="bg-light p-2.5 rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '42px', height: '42px' }}>
                                {getPaymentMethodIcon(m.type)}
                              </div>
                              <div>
                                <h6 className="fw-bold mb-0 text-dark">{m.name}</h6>
                                <small className="text-muted font-monospace fs-xs">{m.id}</small>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <Badge bg="secondary-subtle" className="text-dark rounded-pill px-2.5 py-1 fw-bold fs-xs border border-secondary-subtle">
                              {m.type}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <span className="fw-semibold text-primary">{linkedProv ? linkedProv.name : 'Unknown'}</span>
                          </td>
                          <td className="py-3 text-center">
                            <span className="fw-bold text-dark fs-sm">
                              {m.feeRate}% {m.feeFixed ? `+ ${formatVND(m.feeFixed)}` : ''}
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <Badge bg={m.isActive ? 'success-subtle' : 'secondary-subtle'} className={`px-2.5 py-1.5 fs-xs rounded-pill border ${m.isActive ? 'text-success border-success-subtle' : 'text-muted border-light-subtle'}`}>
                              {m.isActive ? 'Đang bật' : 'Đang tắt'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-end">
                            <Button
                              variant={m.isActive ? 'outline-danger' : 'outline-success'}
                              size="sm"
                              className="rounded-pill px-3 py-1.5 fw-semibold"
                              onClick={() => toggleMethodStatus(m.id)}
                            >
                              {m.isActive ? 'Hủy kích hoạt' : 'Kích hoạt'}
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Tab.Pane>

          {/* TAB 3: TRANSACTIONS & LOGS */}
          <Tab.Pane eventKey="transactions">
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4">
              <Card.Header className="bg-white border-bottom p-4">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                  <div>
                    <h4 className="fw-bolder text-dark mb-1">Nhật ký giao dịch đối soát</h4>
                    <p className="text-muted fs-sm mb-0">Theo dõi trạng thái thanh toán thời gian thực từ các webhook liên kết.</p>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="d-flex flex-wrap align-items-center gap-3 mt-3 pt-2 border-top border-light-subtle">
                  <div className="app-search flex-grow-1" style={{ minWidth: '280px', position: 'relative' }}>
                    <input
                      type="search"
                      className="form-control rounded-pill px-4 py-2 fs-sm bg-light border-0 shadow-none"
                      placeholder="Tìm theo mã giao dịch, mã đơn hàng..."
                      value={searchTx}
                      onChange={(e) => setSearchTx(e.target.value)}
                    />
                    <TbSearch className="app-search-icon text-muted" style={{ position: 'absolute', right: '15px', top: '12px' }} />
                  </div>

                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    {/* Status Filter */}
                    <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border border-light-subtle">
                      <span className="text-muted fs-xs me-2">Trạng thái:</span>
                      <select
                        className="form-select form-select-sm bg-transparent border-0 shadow-none fw-medium text-dark cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="All">Tất cả trạng thái</option>
                        <option value="paid">Đã thanh toán</option>
                        <option value="pending">Chờ xử lý</option>
                        <option value="failed">Thất bại</option>
                        <option value="refunded">Đã hoàn tiền</option>
                      </select>
                    </div>

                    {/* Provider Filter */}
                    <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border border-light-subtle">
                      <span className="text-muted fs-xs me-2">Cổng:</span>
                      <select
                        className="form-select form-select-sm bg-transparent border-0 shadow-none fw-medium text-dark cursor-pointer"
                        value={providerFilter}
                        onChange={(e) => setProviderFilter(e.target.value)}
                      >
                        <option value="All">Tất cả cổng</option>
                        {providers.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </Card.Header>

              <div className="p-0 table-responsive">
                <Table hover responsive className="mb-0 table-borderless">
                  <thead className="bg-light border-bottom text-muted fs-xs uppercase">
                    <tr>
                      <th className="px-4 py-3">Mã đơn hàng</th>
                      <th className="py-3">Cổng & Phương thức</th>
                      <th className="py-3">Mã giao dịch cổng</th>
                      <th className="py-3 text-end">Số tiền</th>
                      <th className="py-3 text-center">Trạng thái</th>
                      <th className="py-3">Thời gian</th>
                      <th className="px-4 py-3 text-end">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-5 text-muted">
                          Không tìm thấy giao dịch nào phù hợp.
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((tx) => {
                        return (
                          <tr key={tx.id} className="border-bottom border-light-subtle">
                            <td className="px-4 py-3">
                              <h6 className="fw-bold mb-0 text-dark">
                                <Link to={`/orders/${tx.orderId}`} className="text-primary text-decoration-none">
                                  #{tx.orderCode}
                                </Link>
                              </h6>
                              <small className="text-muted font-monospace fs-xs">{tx.id}</small>
                            </td>
                            <td className="py-3">
                              <div className="d-flex align-items-center">
                                {getPaymentMethodIcon(tx.paymentMethod)}
                                <div>
                                  <span className="fw-bold text-dark d-block leading-tight">{tx.paymentProviderName}</span>
                                  <small className="text-muted fs-xs">{tx.paymentMethod}</small>
                                </div>
                              </div>
                            </td>
                            <td className="py-3">
                              <code className="text-dark bg-light px-2 py-1 rounded font-monospace fs-xs">{tx.transactionCode}</code>
                            </td>
                            <td className="py-3 text-end">
                              <span className="fw-black text-danger fs-sm">{formatVND(tx.amount)}</span>
                            </td>
                            <td className="py-3 text-center">
                              {getPaymentStatusBadge(tx.status)}
                            </td>
                            <td className="py-3">
                              <span className="fs-xs text-muted fw-semibold">
                                {new Date(tx.createdAt).toLocaleString('vi-VN')}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-end">
                              <div className="d-flex gap-1.5 justify-content-end">
                                <Button
                                  variant="light"
                                  size="sm"
                                  className="btn-icon rounded-circle shadow-sm"
                                  title="Xem phản hồi JSON"
                                  onClick={() => handleOpenLogs(`Thông điệp Giao dịch #${tx.orderCode}`, tx.responseMessage)}
                                >
                                  <TbEye className="fs-base text-primary" />
                                </Button>
                                {tx.status === 'paid' && (
                                  <Button
                                    variant="light"
                                    size="sm"
                                    className="btn-icon rounded-circle shadow-sm"
                                    title="Hoàn tiền"
                                    onClick={() => handleOpenRefund(tx)}
                                  >
                                    <TbRefresh className="fs-base text-warning" />
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

          {/* TAB 4: WEBHOOK SIMULATOR */}
          <Tab.Pane eventKey="simulator">
            <Row className="g-4">
              {/* Simulator form */}
              <Col lg={5}>
                <Card className="border-0 shadow-sm rounded-4 bg-white p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary-subtle p-2.5 rounded-circle d-flex align-items-center justify-content-center me-3">
                      <TbBroadcast className="text-primary fs-4" />
                    </div>
                    <div>
                      <h4 className="fw-bolder text-dark mb-0">Webhook Callback Simulator</h4>
                      <p className="text-muted fs-xs mb-0">Giả lập phát tín hiệu callback từ phía đối tác cổng thanh toán.</p>
                    </div>
                  </div>

                  {simAlert.show && (
                    <Alert variant={simAlert.variant} className="border-0 shadow-sm rounded-3 py-2 px-3 fs-xs fw-semibold mb-3">
                      {simAlert.message}
                    </Alert>
                  )}

                  <Form className="fs-sm">
                    {/* Choose provider */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold text-dark">1. Chọn Cổng thanh toán đối tác</Form.Label>
                      <Form.Select
                        value={simProvider}
                        onChange={(e) => setSimProvider(e.target.value)}
                        className="rounded-3 shadow-none border-light-subtle"
                      >
                        {providers.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.isActive ? 'Active' : 'Inactive'})</option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    {/* Choose order */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold text-dark">2. Chọn Đơn hàng cần thanh toán</Form.Label>
                      <Form.Select
                        value={simOrderCode}
                        onChange={(e) => {
                          setSimOrderCode(e.target.value)
                          // Auto set matching finalAmount
                          const matchOrd = orderList.find(o => o.orderCode === e.target.value)
                          if (matchOrd) setSimAmount(matchOrd.finalAmount)
                        }}
                        className="rounded-3 shadow-none border-light-subtle"
                      >
                        {orderList.map(o => (
                          <option key={o.id} value={o.orderCode}>
                            #{o.orderCode} - {o.customer.name} ({formatVND(o.finalAmount)} - Trạng thái: {o.paymentStatus})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    {/* Amount preview */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold text-dark">3. Số tiền Giao dịch (VNĐ)</Form.Label>
                      <Form.Control
                        type="number"
                        value={simAmount}
                        onChange={(e) => setSimAmount(Number(e.target.value))}
                        className="rounded-3 shadow-none border-light-subtle font-monospace fw-bold text-danger"
                      />
                    </Form.Group>

                    {/* Choose status */}
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold text-dark">4. Chọn Trạng thái phản hồi giả lập</Form.Label>
                      <div className="d-flex gap-3">
                        <Form.Check
                          type="radio"
                          id="status-success"
                          label="Thành công (200 OK)"
                          checked={simStatus === 'success'}
                          onChange={() => setSimStatus('success')}
                          className="cursor-pointer"
                        />
                        <Form.Check
                          type="radio"
                          id="status-failed"
                          label="Thất bại"
                          checked={simStatus === 'failed'}
                          onChange={() => setSimStatus('failed')}
                          className="cursor-pointer"
                        />
                        <Form.Check
                          type="radio"
                          id="status-badhash"
                          label="Lỗi chữ ký (Bad Hash)"
                          checked={simStatus === 'invalid_signature'}
                          onChange={() => setSimStatus('invalid_signature')}
                          className="cursor-pointer"
                        />
                      </div>
                    </Form.Group>

                    {/* Trigger Webhook button */}
                    <Button
                      variant="primary"
                      className="w-100 rounded-pill py-2.5 fw-bold shadow-sm d-flex align-items-center justify-content-center"
                      onClick={handleSendWebhook}
                    >
                      <TbBroadcast className="me-2 fs-5 animate-pulse" /> Phát tín hiệu Webhook Callback
                    </Button>
                  </Form>
                </Card>
              </Col>

              {/* Callbacks logs list */}
              <Col lg={7}>
                <Card className="border-0 shadow-sm rounded-4 bg-white p-4 h-100">
                  <h4 className="fw-bolder text-dark mb-1">Nhật ký nhận Webhook thời gian thực</h4>
                  <p className="text-muted fs-sm mb-4">Các tin nhắn Callback đã ghi nhận từ nhà cung cấp dịch vụ.</p>

                  <div className="overflow-auto border rounded-3 p-1 bg-light" style={{ maxHeight: '420px' }}>
                    {callbacks.length === 0 ? (
                      <div className="text-center py-5 text-muted fs-sm">
                        Chưa ghi nhận callback nào trong phiên làm việc.
                      </div>
                    ) : (
                      callbacks.map((cb) => {
                        const isSuccess = cb.status === 'success'
                        const isSigErr = cb.status === 'invalid_signature'
                        return (
                          <Card className="border-0 shadow-none bg-white rounded-3 p-3 mb-2 border-bottom border-light-subtle" key={cb.id}>
                            <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2 fs-xs">
                              <div>
                                <span className="fw-black text-primary fs-sm me-2">{cb.providerName}</span>
                                <code className="bg-light text-dark px-1.5 py-0.5 rounded font-monospace">{cb.id}</code>
                              </div>
                              <div className="d-flex gap-1.5 align-items-center">
                                <Badge
                                  bg={isSuccess ? 'success-subtle' : isSigErr ? 'danger-subtle' : 'warning-subtle'}
                                  className={`border px-2.5 py-1 ${isSuccess ? 'text-success border-success-subtle' : isSigErr ? 'text-danger border-danger-subtle' : 'text-warning border-warning-subtle'}`}
                                >
                                  {isSuccess ? 'Thành công (200 OK)' : isSigErr ? 'Lỗi chữ ký' : 'Giao dịch thất bại'}
                                </Badge>
                                <span className="text-muted fw-semibold">
                                  {new Date(cb.receivedAt).toLocaleTimeString('vi-VN')}
                                </span>
                              </div>
                            </div>

                            {/* Masked Signature */}
                            <div className="d-flex align-items-center justify-content-between text-muted fs-2xs mb-2">
                              <span>Signature Hash:</span>
                              <code className="text-dark font-monospace">{cb.signature}</code>
                            </div>

                            {/* Raw Payload Accordion Trigger */}
                            <div className="mt-2.5 d-flex justify-content-between align-items-center">
                              <span className="text-muted fs-2xs">Payload Callback (JSON):</span>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="py-1 px-2.5 rounded-3 fs-2xs fw-bold"
                                onClick={() => handleOpenLogs(`Webhook Payload ${cb.id}`, cb.payload)}
                              >
                                Xem JSON thô
                              </Button>
                            </div>
                          </Card>
                        )
                      })
                    )}
                  </div>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* --- MODAL 1: EDIT CONFIGURATION --- */}
      <Modal show={showConfigModal} onHide={() => setShowConfigModal(false)} centered rounded-4>
        <Modal.Header closeButton className="border-bottom px-4">
          <Modal.Title className="fw-bolder text-dark">
            Cấu hình tham số: {selectedProvider?.displayName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-4 fs-sm">
          <Form>
            {/* Merchant ID */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-dark">
                {selectedProvider?.name.toLowerCase() === 'vnpay' ? 'Mã Merchant (vnp_TmnCode)' : 'Mã đối tác (Partner Code / Client ID)'}
              </Form.Label>
              <Form.Control
                type="text"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="rounded-3 shadow-none border-light-subtle font-monospace fw-bold"
              />
            </Form.Group>

            {/* Secret key */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-dark">
                {selectedProvider?.name.toLowerCase() === 'vnpay' ? 'Mã bí mật băm hash (vnp_HashSecret)' : 'Khóa bảo mật API (Secret Key / Signature Secret)'}
              </Form.Label>
              <Form.Control
                type="password"
                value={secretKeyInput}
                onChange={(e) => setSecretKeyInput(e.target.value)}
                className="rounded-3 shadow-none border-light-subtle font-monospace"
              />
            </Form.Group>

            {/* Environment Toggle */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-dark">Môi trường kiểm thử kết nối</Form.Label>
              <Form.Select
                value={environmentInput}
                onChange={(e) => setEnvironmentInput(Number(e.target.value) as 0 | 1)}
                className="rounded-3 shadow-none border-light-subtle cursor-pointer"
              >
                <option value={0}>Sandbox (Kiểm thử cục bộ / Developer)</option>
                <option value={1}>Production (Môi trường Live thực tế)</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-top px-4">
          <Button variant="outline-secondary" className="rounded-pill px-3" onClick={() => setShowConfigModal(false)}>
            Hủy bỏ
          </Button>
          <Button variant="primary" className="rounded-pill px-4 fw-bold" onClick={handleSaveConfig}>
            Lưu cấu hình
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- MODAL 2: REFUND GIAO DỊCH --- */}
      <Modal show={showRefundModal} onHide={() => setShowRefundModal(false)} centered>
        <Modal.Header closeButton className="border-bottom px-4 text-warning bg-warning-subtle">
          <Modal.Title className="fw-bolder">
            Xác nhận hoàn tiền giao dịch
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-4 fs-sm">
          <div className="mb-3">
            Bạn đang yêu cầu hoàn tiền cho giao dịch đơn hàng <strong className="text-dark">#{selectedTx?.orderCode}</strong> trị giá <strong className="text-danger">{selectedTx && formatVND(selectedTx.amount)}</strong>.
          </div>
          <Alert variant="warning" className="border-0 rounded-3 fs-xs mb-3 py-2 px-3 fw-medium">
            Hành động này sẽ cập nhật trạng thái giao dịch sang <strong>Refunded</strong> và đồng bộ trạng thái thanh toán của Đơn hàng tương ứng. Không thể hoàn tác hoạt động này.
          </Alert>
          <Form>
            <Form.Group>
              <Form.Label className="fw-semibold text-dark">Lý do hoàn tiền chi tiết</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Nhập lý do hoàn tiền (ví dụ: Khách hàng hủy đơn, lỗi phôi SIM...)"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="rounded-3 shadow-none border-light-subtle"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-top px-4">
          <Button variant="outline-secondary" className="rounded-pill px-3" onClick={() => setShowRefundModal(false)}>
            Hủy bỏ
          </Button>
          <Button variant="danger" className="rounded-pill px-4 fw-bold shadow-sm" onClick={handleSaveRefund} disabled={!refundReason.trim()}>
            Xác nhận hoàn tiền
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- MODAL 3: VIEW LOGS / DETAILS --- */}
      <Modal show={showLogModal} onHide={() => setShowLogModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-bottom px-4">
          <Modal.Title className="fw-bolder text-dark font-monospace fs-sm">
            {logTitle}
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
            {logPayload.startsWith('{') ? JSON.stringify(JSON.parse(logPayload), null, 2) : logPayload}
          </pre>
        </Modal.Body>
        <Modal.Footer className="border-top px-4">
          <Button variant="secondary" className="rounded-pill px-4 fw-bold" onClick={() => setShowLogModal(false)}>
            Đóng lại
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Page
