import { Button, Card, CardBody, CardHeader, CardTitle, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap'
import { TbBan, TbDotsVertical, TbEdit, TbMail, TbMapPin, TbPencil, TbPhone, TbShare, TbTrash } from 'react-icons/tb'
import { Link } from 'react-router'
import { type OrderType } from '../../data'

interface CustomerDetailsProps {
  customer: OrderType['customer']
}

const CustomerDetails = ({ customer }: CustomerDetailsProps) => {
  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
      <CardHeader className="justify-content-between border-bottom p-4 bg-white d-flex align-items-center">
        <CardTitle as="h5" className="fw-bold text-dark mb-0">Thông Tin Khách Hàng</CardTitle>
        <Button variant="light" size="sm" className="btn-icon rounded-circle shadow-sm">
          <TbPencil className="fs-base text-primary" />
        </Button>
      </CardHeader>
      <CardBody className="p-4">
        <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-light-subtle">
          <div className="me-3 flex-shrink-0">
            <img src={customer.avatar} width={54} height={54} alt="avatar" className="rounded-circle shadow-sm border border-light-subtle img-fluid" />
          </div>
          <div>
            <h5 className="mb-1 fw-bold text-dark">
              <Link to={`/customers`} className="text-dark text-decoration-none">
                {customer.name}
              </Link>
            </h5>
            <span className="badge bg-primary-subtle text-primary fs-xs px-2 py-1 rounded-pill">{customer.id}</span>
          </div>
          <div className="ms-auto">
            <Dropdown align="end">
              <DropdownToggle variant="link" className="btn-icon btn-ghost-light text-muted drop-arrow-none p-0 border-0 shadow-none">
                <TbDotsVertical className="fs-xl" />
              </DropdownToggle>

              <DropdownMenu className="rounded-3 shadow border-0">
                <DropdownItem className="fs-sm py-2">
                  <TbShare className="me-2 text-primary" /> Chia sẻ hồ sơ
                </DropdownItem>
                <DropdownItem className="fs-sm py-2">
                  <TbEdit className="me-2 text-warning" /> Chỉnh sửa
                </DropdownItem>
                <DropdownItem className="fs-sm py-2 text-warning">
                  <TbBan className="me-2 text-warning" /> Khóa tài khoản
                </DropdownItem>
                <DropdownItem className="fs-sm py-2 text-danger">
                  <TbTrash className="me-2 text-danger" /> Xóa dữ liệu
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <ul className="list-unstyled text-muted mb-0 d-flex flex-column gap-3 fs-sm">
          <li>
            <div className="d-flex align-items-center gap-3">
              <div className="avatar-xs flex-shrink-0">
                <span className="avatar-title bg-light text-primary rounded-circle shadow-sm p-2 fs-5">
                  <TbMail />
                </span>
              </div>
              <div className="text-truncate">
                <span className="text-muted d-block fs-xs">Email liên hệ:</span>
                <a href={`mailto:${customer.email}`} className="text-dark fw-semibold text-decoration-none text-truncate d-block">
                  {customer.email}
                </a>
              </div>
            </div>
          </li>
          <li>
            <div className="d-flex align-items-center gap-3">
              <div className="avatar-xs flex-shrink-0">
                <span className="avatar-title bg-light text-success rounded-circle shadow-sm p-2 fs-5">
                  <TbPhone />
                </span>
              </div>
              <div>
                <span className="text-muted d-block fs-xs">Số điện thoại / Zalo:</span>
                <a href={`tel:${customer.phone}`} className="text-dark fw-semibold text-decoration-none">
                  {customer.phone}
                </a>
              </div>
            </div>
          </li>
          <li>
            <div className="d-flex align-items-center gap-3">
              <div className="avatar-xs flex-shrink-0">
                <span className="avatar-title bg-light text-danger rounded-circle shadow-sm p-2 fs-5">
                  <TbMapPin />
                </span>
              </div>
              <div>
                <span className="text-muted d-block fs-xs">Quốc gia:</span>
                <span className="text-dark fw-semibold">Việt Nam (VN)</span>
              </div>
            </div>
          </li>
        </ul>
      </CardBody>
    </Card>
  )
}

export default CustomerDetails
