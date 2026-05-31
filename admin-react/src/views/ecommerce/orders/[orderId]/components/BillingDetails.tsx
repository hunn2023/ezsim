import { Button, Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap'
import { TbPencil, TbBuildingBank, TbCreditCard, TbQrcode, TbWallet, TbCheck, TbClock, TbX } from 'react-icons/tb'
import { type OrderType } from '../../data'

interface BillingDetailsProps {
  paymentInfo: OrderType['paymentInfo']
}

const formatVND = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
}

const getPaymentMethodIcon = (methodType: string) => {
  switch (methodType) {
    case 'E-Wallet':
      return <TbWallet className="text-primary me-3 flex-shrink-0" size={32} />
    case 'Bank Transfer':
      return <TbBuildingBank className="text-info me-3 flex-shrink-0" size={32} />
    case 'QR Code':
      return <TbQrcode className="text-success me-3 flex-shrink-0" size={32} />
    case 'Card':
      return <TbCreditCard className="text-warning me-3 flex-shrink-0" size={32} />
    default:
      return <TbWallet className="text-secondary me-3 flex-shrink-0" size={32} />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'SUCCESS':
      return <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fs-xs fw-semibold"><TbCheck className="me-1"/>Thành công</span>
    case 'PENDING':
      return <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1 fs-xs fw-semibold"><TbClock className="me-1"/>Chờ xử lý TT</span>
    case 'FAILED':
      return <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 fs-xs fw-semibold"><TbX className="me-1"/>Thất bại</span>
    case 'REFUNDED':
      return <span className="badge bg-dark-subtle text-dark border border-dark-subtle px-2 py-1 fs-xs fw-semibold">Đã hoàn</span>
    default:
      return <span className="badge bg-light text-dark">{status}</span>
  }
}

const BillingDetails = ({ paymentInfo }: BillingDetailsProps) => {
  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
      <CardHeader className="justify-content-between border-bottom p-4 bg-white d-flex align-items-center">
        <CardTitle as="h5" className="fw-bold text-dark mb-0">Thông Tin Thanh Toán</CardTitle>
        <Button variant="light" size="sm" className="btn-icon rounded-circle shadow-sm">
          <TbPencil className="fs-base text-primary" />
        </Button>
      </CardHeader>
      <CardBody className="p-4">
        <div className="d-flex align-items-center mb-4">
          {getPaymentMethodIcon(paymentInfo.methodType)}
          <div>
            <h6 className="mb-1 fw-bold text-dark">{paymentInfo.provider}</h6>
            <p className="text-muted mb-0 fs-xs">Phương thức: <span className="text-primary fw-semibold">{paymentInfo.methodType}</span></p>
          </div>
          <div className="ms-auto flex-shrink-0">
            {getStatusBadge(paymentInfo.status)}
          </div>
        </div>
        <hr className="my-3 border-light-subtle" />
        <div className="d-flex flex-column gap-2 fs-sm text-muted">
          <div className="d-flex justify-content-between">
            <span>Mã giao dịch cổng TT:</span>
            <span className="text-dark fw-bold font-monospace fs-xs">{paymentInfo.transactionCode}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Số tiền giao dịch:</span>
            <span className="text-danger fw-black fs-base">{formatVND(paymentInfo.amount)}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Đơn vị tiền tệ:</span>
            <span className="text-dark fw-semibold">{paymentInfo.currency}</span>
          </div>
          {paymentInfo.paidAt && (
            <div className="d-flex justify-content-between">
              <span>Thời gian ghi nhận:</span>
              <span className="text-dark fw-medium fs-xs">{paymentInfo.paidAt}</span>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

export default BillingDetails
