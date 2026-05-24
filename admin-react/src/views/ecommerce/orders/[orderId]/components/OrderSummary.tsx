import { Button, Card, CardBody, CardHeader, Table } from 'react-bootstrap'
import { TbCalendar, TbPencil, TbTrash, TbTruck, TbQrcode, TbDeviceSim } from 'react-icons/tb'
import { type OrderType } from '../../data'

interface OrderSummaryProps {
  order: OrderType
}

const formatVND = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
}

const getPaymentStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fs-xs fw-semibold me-1">Đã thanh toán</span>
    case 'pending':
      return <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1 fs-xs fw-semibold me-1">Chờ thanh toán</span>
    case 'error':
      return <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 fs-xs fw-semibold me-1">Lỗi giao dịch</span>
    default:
      return <span className="badge bg-light text-dark me-1">{status}</span>
  }
}

const getOrderStatusBadge = (status: string) => {
  switch (status) {
    case 'qr_code_esim':
      return <span className="badge bg-purple-subtle text-purple border border-purple-subtle px-2 py-1 fs-xs fw-semibold"><TbQrcode className="me-1"/>QR eSIM</span>
    case 'activation_code':
      return <span className="badge bg-info-subtle text-info border border-info-subtle px-2 py-1 fs-xs fw-semibold"><TbDeviceSim className="me-1"/>Mã kích hoạt</span>
    case 'physical_sim_shipping':
      return <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 fs-xs fw-semibold"><TbTruck className="me-1"/>Giao SIM vật lý</span>
    case 'delivered':
      return <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fs-xs fw-semibold">Đã giao</span>
    default:
      return <span className="badge bg-light text-dark">{status}</span>
  }
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const subtotal = order.items.reduce((acc, item) => acc + item.totalPrice, 0)
  const vat = Math.round(subtotal * 0.1)

  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
      <CardHeader className="align-items-start bg-white border-bottom p-4 justify-content-between d-flex">
        <div>
          <h3 className="mb-1 d-flex fs-4 fw-bolder text-dark align-items-center">Đơn Hàng #{order.orderCode}</h3>
          <p className="text-muted fw-medium fs-sm mb-3 d-flex align-items-center">
            <TbCalendar className="me-2 text-primary" size={18} /> {order.date} <small className="text-muted ms-1">{order.time}</small>
          </p>
          <div className="d-flex align-items-center">
            {getPaymentStatusBadge(order.paymentStatus)}
            {getOrderStatusBadge(order.orderStatus)}
          </div>
        </div>
        <div className="ms-auto d-flex gap-2">
          <Button variant="outline-primary" className="rounded-pill px-3 py-1 fw-bold fs-sm d-flex align-items-center shadow-sm">
            <TbPencil className="me-1" /> Chỉnh sửa
          </Button>
          <Button variant="danger" className="rounded-pill px-3 py-1 fw-bold fs-sm d-flex align-items-center shadow-sm">
            <TbTrash className="me-1" /> Hủy đơn
          </Button>
        </div>
      </CardHeader>
      <CardBody className="p-4">
        <h5 className="fw-bold text-dark mb-3">Chi Tiết Mặt Hàng Viễn Thông</h5>
        <Table responsive bordered className="table-custom align-middle mb-4">
          <thead className="bg-light align-middle">
            <tr className="text-uppercase fs-xs text-muted fw-bold">
              <th className="py-3 px-4">Sản phẩm</th>
              <th className="py-3 px-3">Đơn giá</th>
              <th className="py-3 px-3 text-center">Số lượng</th>
              <th className="py-3 px-4 text-end">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="py-3 px-4">
                  <div className="d-flex align-items-center">
                    <div className="avatar-md me-3 flex-shrink-0 bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center fw-bold fs-4">
                      {item.carrier[0]}
                    </div>
                    <div>
                      <h6 className="mb-1 fw-bold text-dark">{item.productName}</h6>
                      <p className="text-muted mb-0 fs-xs">Phân loại: <span className="text-primary fw-semibold">{item.variantName}</span> | Nhà mạng: {item.carrier}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 fw-semibold text-dark">{formatVND(item.unitPrice)}</td>
                <td className="py-3 px-3 text-center fw-bold text-dark">{item.quantity}</td>
                <td className="py-3 px-4 text-end fw-bold text-danger">{formatVND(item.totalPrice)}</td>
              </tr>
            ))}
            <tr className="border-top">
              <td colSpan={3} className="text-end fw-semibold text-muted py-3 px-4">
                Tổng tiền hàng (Subtotal):
              </td>
              <td className="text-end fw-bold text-dark py-3 px-4">{formatVND(subtotal)}</td>
            </tr>
            <tr>
              <td colSpan={3} className="text-end fw-semibold text-muted py-2 px-4">
                Thuế GTGT (VAT 10%):
              </td>
              <td className="text-end fw-bold text-dark py-2 px-4">{formatVND(vat)}</td>
            </tr>
            {order.discountAmount > 0 && (
              <tr>
                <td colSpan={3} className="text-end fw-semibold text-muted py-2 px-4">
                  Chiết khấu / Ưu đãi:
                </td>
                <td className="text-end text-success fw-bold py-2 px-4">-{formatVND(order.discountAmount)}</td>
              </tr>
            )}
            <tr>
              <td colSpan={3} className="text-end fw-semibold text-muted py-2 px-4">
                Phí vận chuyển / Kích hoạt:
              </td>
              <td className="text-end fw-bold text-dark py-2 px-4">{order.shippingFee === 0 ? 'Miễn phí' : formatVND(order.shippingFee)}</td>
            </tr>
            <tr className="border-top bg-light">
              <td colSpan={3} className="text-end fw-black text-uppercase text-dark py-3 px-4 fs-5">
                Tổng thanh toán:
              </td>
              <td className="fw-black text-end text-danger py-3 px-4 fs-4">{formatVND(order.finalAmount)}</td>
            </tr>
          </tbody>
        </Table>
      </CardBody>
    </Card>
  )
}

export default OrderSummary
