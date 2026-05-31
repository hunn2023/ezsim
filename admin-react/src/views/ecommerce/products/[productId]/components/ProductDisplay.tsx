import { Button, Card, CardBody, Badge } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router'
import { TbEdit, TbTrash, TbDeviceSim, TbCreditCard, TbQrcode, TbBarcode } from 'react-icons/tb'
import { useState } from 'react'

import { type TelecomProduct } from '../../../../../types/telecom'
import DeleteConfirmationModal from '@/components/table/DeleteConfirmationModal'
import { useTelecomProducts } from '../../../../../hooks/useTelecomProducts'

interface ProductDisplayProps {
  product: TelecomProduct
}

const formatSimNumber = (num: string) => {
  if (num.length === 10) {
    return `${num.slice(0, 3)}.${num.slice(3, 6)}.${num.slice(6)}`
  }
  return num
}

export const ProductDisplay = ({ product }: ProductDisplayProps) => {
  const navigate = useNavigate()
  const { deleteProduct } = useTelecomProducts()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDeleteConfirm = () => {
    deleteProduct(product.id)
    navigate('/products')
  }

  const getCardBackground = (carrier: string) => {
    switch (carrier) {
      case 'Viettel':
        return 'linear-gradient(135deg, #ee0033 0%, #ff5566 100%)'
      case 'Vinaphone':
        return 'linear-gradient(135deg, #0055c4 0%, #0088ff 100%)'
      case 'Mobifone':
        return 'linear-gradient(135deg, #003e8c 0%, #00a1ff 100%)'
      case 'Wintel':
        return 'linear-gradient(135deg, #d31145 0%, #ff4b72 100%)'
      case 'Vietnamobile':
        return 'linear-gradient(135deg, #f26522 0%, #ff9500 100%)'
      case 'iTel':
        return 'linear-gradient(135deg, #5b6770 0%, #8e9ca8 100%)'
      default:
        return 'linear-gradient(135deg, #2b3035 0%, #4b5258 100%)'
    }
  }

  return (
    <div className="mb-4">
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white p-4">
        <CardBody className="p-0 text-center">
          {/* SIM OR CARD GRAPHIC MOCKUP */}
          <div
            className="rounded-4 p-4 shadow-lg text-white d-flex flex-column justify-content-between position-relative overflow-hidden mb-4"
            style={{
              background: getCardBackground(product.carrier),
              minHeight: '280px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
            }}>
            {/* Holographic reflection overlay */}
            <div
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 60%)',
                pointerEvents: 'none',
              }}
            />

            <div className="d-flex justify-content-between align-items-center z-1">
              <span className="fw-bolder fs-lg bg-white text-dark px-3 py-1 rounded-pill shadow-sm">
                {product.carrier}
              </span>
              <Badge bg="light" text="dark" className="fs-xs px-2 py-1 shadow-sm">
                {product.type === 'sim' ? product.format : product.cardType === 'data' ? 'Data Card' : 'Topup Card'}
              </Badge>
            </div>

            <div className="my-4 z-1">
              {product.type === 'sim' ? (
                <div>
                  <div className="d-flex justify-content-center align-items-center mb-3">
                    <div className="bg-warning text-dark p-2 rounded-3 shadow-sm d-inline-block me-3" style={{ width: '48px', height: '38px', border: '1px solid #d4af37' }}>
                      <div className="w-100 h-100 border border-dark rounded-1 opacity-75" />
                    </div>
                    <TbDeviceSim size={48} className="opacity-75" />
                  </div>
                  <h2 className="fw-bolder tracking-wide fs-2 mb-1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                    {formatSimNumber(product.simNumber)}
                  </h2>
                  <p className="fs-xs opacity-75 mb-0">{product.category} - {product.dataPlan}</p>
                </div>
              ) : (
                <div>
                  <TbCreditCard size={56} className="mb-2 opacity-75" />
                  <h2 className="fw-bolder fs-1 mb-1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                    {product.faceValue.toLocaleString()} VNĐ
                  </h2>
                  <p className="fs-xs opacity-75 mb-0">Thẻ nạp viễn thông chính hãng</p>
                </div>
              )}
            </div>

            <div className="d-flex justify-content-between align-items-end z-1 fs-xs opacity-75 border-top pt-2 border-light-subtle">
              <span>ID: {product.id}</span>
              {product.type === 'sim' && product.format === 'eSIM' ? (
                <div className="d-flex align-items-center"><TbQrcode size={20} className="me-1" /> Hỗ trợ Quét QR</div>
              ) : (
                <div className="d-flex align-items-center"><TbBarcode size={20} className="me-1" /> Mã vạch an toàn</div>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-center gap-2">
            <Link to={`/products/edit/${product.id}`}>
              <Button variant="outline-primary" className="rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center">
                <TbEdit className="me-1 fs-base" /> Chỉnh sửa
              </Button>
            </Link>
            <Button
              variant="danger"
              className="rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center"
              onClick={() => setShowDeleteModal(true)}>
              <TbTrash className="me-1 fs-base" /> Xóa sản phẩm
            </Button>
          </div>
        </CardBody>
      </Card>

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        selectedCount={1}
        itemName={product.type === 'sim' ? 'số SIM này' : 'mã thẻ này'}
      />
    </div>
  )
}

export default ProductDisplay
