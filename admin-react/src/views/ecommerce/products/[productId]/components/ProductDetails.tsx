import { Badge, Col, Row, Card } from 'react-bootstrap'
import { TbStarFilled, TbCheck, TbTruck, TbShieldCheck, TbBolt } from 'react-icons/tb'

import { type TelecomProduct } from '../../../../../types/telecom'

interface ProductDetailsProps {
  product: TelecomProduct
}

const formatVND = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'available':
      return <Badge bg="success" className="px-3 py-2 fs-sm rounded-pill shadow-sm">Sẵn sàng bán</Badge>
    case 'reserved':
      return <Badge bg="warning" text="dark" className="px-3 py-2 fs-sm rounded-pill shadow-sm">Đang giữ số</Badge>
    case 'sold':
      return <Badge bg="secondary" className="px-3 py-2 fs-sm rounded-pill shadow-sm">Đã bán</Badge>
    case 'locked':
      return <Badge bg="danger" className="px-3 py-2 fs-sm rounded-pill shadow-sm">Tạm khóa</Badge>
    case 'out_of_stock':
      return <Badge bg="danger" className="px-3 py-2 fs-sm rounded-pill shadow-sm">Hết hàng kho</Badge>
    default:
      return <Badge bg="light" text="dark">{status}</Badge>
  }
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  return (
    <div className="p-4 bg-white rounded-4 shadow-sm border-0">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 border-bottom pb-3">
        {getStatusBadge(product.status)}
        <div className="d-inline-flex align-items-center bg-light px-3 py-1 rounded-pill">
          {[...Array(5)].map((_, index) => (
            <TbStarFilled key={index} size={18} className="text-warning" />
          ))}
          <span className="ms-2 fw-bold text-dark fs-sm">5.0 (128 Đánh giá)</span>
        </div>
      </div>

      <div className="my-3">
        <h2 className="fw-bolder text-dark mb-2">
          {product.type === 'sim' ? `SIM Số Đẹp ${product.carrier} - ${product.simNumber}` : `Thẻ Cào Viễn Thông ${product.carrier} ${product.faceValue.toLocaleString()}đ`}
        </h2>
        <p className="text-muted fs-sm mb-4">
          Mã sản phẩm: <span className="fw-bold text-dark">{product.id}</span> | Phát hành bởi <span className="fw-bold text-primary">{product.carrier}</span>
        </p>
      </div>

      {/* PRICE BLOCK */}
      <Card className="bg-light border-0 p-4 rounded-4 mb-4 shadow-sm">
        <div className="d-flex flex-wrap align-items-center gap-3">
          <span className="text-muted text-uppercase fw-bold fs-xs">Giá bán ưu đãi:</span>
          <h1 className="fw-black text-danger mb-0 display-6">
            {formatVND(product.price)}
          </h1>
          {product.type === 'sim' && product.originalPrice > product.price && (
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted text-decoration-line-through fs-5">
                {formatVND(product.originalPrice)}
              </span>
              <Badge bg="success" className="fs-xs px-2 py-1">
                Tiết kiệm {Math.round((1 - product.price / product.originalPrice) * 100)}%
              </Badge>
            </div>
          )}
          {product.type === 'card' && product.discountRate > 0 && (
            <Badge bg="success" className="fs-sm px-3 py-1">
              Chiết khấu {product.discountRate}%
            </Badge>
          )}
        </div>
      </Card>

      <h5 className="fw-bold text-dark mb-3">Thông Số Kỹ Thuật & Quyền Lợi</h5>
      
      {product.type === 'sim' ? (
        /* SIM SPECS */
        <Row className="g-3 mb-4">
          <Col sm={6} md={4}>
            <Card className="border p-3 rounded-3 bg-light-subtle h-100">
              <span className="text-muted fs-xs text-uppercase">Nhà mạng</span>
              <h5 className="fw-bold text-dark mt-1 mb-0">{product.carrier}</h5>
            </Card>
          </Col>
          <Col sm={6} md={4}>
            <Card className="border p-3 rounded-3 bg-light-subtle h-100">
              <span className="text-muted fs-xs text-uppercase">Phân loại</span>
              <h5 className="fw-bold text-dark mt-1 mb-0">{product.category}</h5>
            </Card>
          </Col>
          <Col sm={6} md={4}>
            <Card className="border p-3 rounded-3 bg-light-subtle h-100">
              <span className="text-muted fs-xs text-uppercase">Định dạng</span>
              <h5 className="fw-bold text-primary mt-1 mb-0">{product.format}</h5>
            </Card>
          </Col>
          <Col sm={6} md={4}>
            <Card className="border p-3 rounded-3 bg-light-subtle h-100">
              <span className="text-muted fs-xs text-uppercase">Tổng nút phong thủy</span>
              <h5 className="fw-bold text-success mt-1 mb-0">{product.attributes?.totalPoints ?? '?'} điểm</h5>
            </Card>
          </Col>
          <Col sm={6} md={4}>
            <Card className="border p-3 rounded-3 bg-light-subtle h-100">
              <span className="text-muted fs-xs text-uppercase">Mệnh phong thủy</span>
              <h5 className="fw-bold text-danger mt-1 mb-0">Mệnh {product.attributes?.element ?? '?'}</h5>
            </Card>
          </Col>
          <Col sm={6} md={4}>
            <Card className="border p-3 rounded-3 bg-light-subtle h-100">
              <span className="text-muted fs-xs text-uppercase">Gói cước đi kèm</span>
              <h5 className="fw-bold text-dark mt-1 mb-0 text-truncate" title={product.dataPlan}>{product.dataPlan.split('-')[0]}</h5>
            </Card>
          </Col>
        </Row>
      ) : (
        /* CARD SPECS */
        <Row className="g-3 mb-4">
          <Col sm={6} md={4}>
            <Card className="border p-3 rounded-3 bg-light-subtle h-100">
              <span className="text-muted fs-xs text-uppercase">Nhà mạng</span>
              <h5 className="fw-bold text-dark mt-1 mb-0">{product.carrier}</h5>
            </Card>
          </Col>
          <Col sm={6} md={4}>
            <Card className="border p-3 rounded-3 bg-light-subtle h-100">
              <span className="text-muted fs-xs text-uppercase">Mệnh giá gốc</span>
              <h5 className="fw-bold text-dark mt-1 mb-0">{formatVND(product.faceValue)}</h5>
            </Card>
          </Col>
          <Col sm={6} md={4}>
            <Card className="border p-3 rounded-3 bg-light-subtle h-100">
              <span className="text-muted fs-xs text-uppercase">Loại thẻ</span>
              <h5 className="fw-bold text-primary mt-1 mb-0">{product.cardType === 'data' ? 'Thẻ Data 3G/4G' : 'Thẻ nạp thoại'}</h5>
            </Card>
          </Col>
          <Col sm={6} md={4}>
            <Card className="border p-3 rounded-3 bg-light-subtle h-100">
              <span className="text-muted fs-xs text-uppercase">Tỷ lệ chiết khấu</span>
              <h5 className="fw-bold text-success mt-1 mb-0">{product.discountRate}%</h5>
            </Card>
          </Col>
          <Col sm={6} md={4}>
            <Card className="border p-3 rounded-3 bg-light-subtle h-100">
              <span className="text-muted fs-xs text-uppercase">Kho mã thẻ</span>
              <h5 className="fw-bold text-dark mt-1 mb-0">{product.stockCount.toLocaleString()} mã</h5>
            </Card>
          </Col>
          <Col sm={6} md={4}>
            <Card className="border p-3 rounded-3 bg-light-subtle h-100">
              <span className="text-muted fs-xs text-uppercase">Hình thức nhận</span>
              <h5 className="fw-bold text-info mt-1 mb-0">SMS / Email / Mã QR</h5>
            </Card>
          </Col>
        </Row>
      )}

      {product.type === 'sim' && product.highlightFeatures && product.highlightFeatures.length > 0 && (
        <div className="mb-4">
          <h6 className="fw-bold text-dark mb-2">Điểm Nổi Bật:</h6>
          <div className="d-flex flex-wrap gap-2">
            {product.highlightFeatures.map((feat, idx) => (
              <Badge key={idx} bg="primary" className="bg-primary-subtle text-primary px-3 py-2 fs-xs rounded-pill shadow-sm border border-primary-subtle">
                ✨ {feat}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {product.type === 'card' && product.dataPlanDescription && (
        <div className="mb-4 bg-info-subtle p-3 rounded-3 border border-info-subtle">
          <h6 className="fw-bold text-info-emphasis mb-1">Chi Tiết Gói Data:</h6>
          <p className="text-info-emphasis mb-0 fs-sm">{product.dataPlanDescription}</p>
        </div>
      )}

      <h6 className="fw-bold text-dark mb-3 mt-4">Cam Kết Dịch Vụ:</h6>
      <ul className="list-unstyled d-flex flex-column gap-2 text-muted fs-sm mb-0">
        <li className="d-flex align-items-center"><TbShieldCheck className="text-success me-2 fs-lg" /> Đăng ký chính chủ theo đúng quy định của Bộ Thông tin & Truyền thông.</li>
        <li className="d-flex align-items-center"><TbTruck className="text-primary me-2 fs-lg" /> Miễn phí giao hàng COD toàn quốc cho đơn hàng từ 500.000đ.</li>
        <li className="d-flex align-items-center"><TbBolt className="text-warning me-2 fs-lg" /> Kích hoạt và gửi mã ngay lập tức sau khi hoàn tất đăng ký thông tin.</li>
      </ul>
    </div>
  )
}

export default ProductDetails
