import { Alert, Button, Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap'
import { TbPencil, TbMapPin, TbInfoCircle } from 'react-icons/tb'
import { type OrderType } from '../../data'

interface ShippingAddressProps {
  address?: OrderType['shippingAddress']
  note?: string
}

const ShippingAddress = ({ address, note }: ShippingAddressProps) => {
  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
      <CardHeader className="justify-content-between border-bottom p-4 bg-white d-flex align-items-center">
        <CardTitle as="h5" className="fw-bold text-dark mb-0">Địa Chỉ & Nhận Hàng</CardTitle>
        <Button variant="light" size="sm" className="btn-icon rounded-circle shadow-sm">
          <TbPencil className="fs-base text-primary" />
        </Button>
      </CardHeader>
      <CardBody className="p-4">
        <div className="bg-light-subtle p-3 rounded-4 border border-light-subtle mb-4 text-center">
          <TbMapPin size={32} className="text-danger mb-2" />
          <h6 className="fw-bold text-dark mb-1">Điểm Nhận & Bàn Giao</h6>
          <p className="text-muted fs-xs mb-0">Dịch vụ giao hàng tận nhà & đồng bộ eSIM online</p>
        </div>

        {address ? (
          <div className="d-flex align-items-start mb-4">
            <div className="flex-grow-1">
              <h6 className="mb-1 fw-bold text-dark">{address.fullName}</h6>
              <p className="text-muted fs-sm mb-2 lh-base">
                {address.address},
                <br />
                {address.ward}, {address.district},
                <br />
                {address.province}
              </p>
              <p className="mb-0 text-muted fs-sm">
                <strong>SĐT Nhận hàng:</strong> <span className="text-dark fw-semibold">{address.phone}</span>
              </p>
            </div>
            <div className="ms-auto flex-shrink-0">
              <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fs-xs rounded-pill">Mặc định</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-3">
            <p className="text-muted fs-sm mb-0">Đơn hàng không yêu cầu giao vận vật lý (eSIM / Thẻ trực tiếp)</p>
          </div>
        )}

        {note && (
          <Alert variant="warning" className="mb-0 rounded-3 border-warning-subtle bg-warning-subtle p-3 shadow-sm">
            <div className="d-flex align-items-center mb-1">
              <TbInfoCircle className="text-warning me-2 fs-5" />
              <h6 className="mb-0 fw-bold text-warning-emphasis fs-sm">Ghi chú của khách hàng:</h6>
            </div>
            <p className="fst-italic mb-0 text-warning-emphasis fs-xs ps-4">{note}</p>
          </Alert>
        )}
      </CardBody>
    </Card>
  )
}

export default ShippingAddress
