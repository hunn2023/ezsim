import { Card, CardBody, CardHeader, CardTitle, ProgressBar } from 'react-bootstrap'
import { TbDeviceSim, TbCreditCard, TbArrowRight } from 'react-icons/tb'
import { Link } from 'react-router'
import { useTelecomProducts } from '@/hooks/useTelecomProducts'
import type { SimProduct, CardProduct } from '@/types/telecom'

const formatVND = (val: number) =>
  new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 0 }).format(val)

// Mock "sold count" based on seeded data (in real app this comes from orders)
const getMockSoldCount = (id: string, idx: number) => {
  const seed = id.charCodeAt(id.length - 1) + idx
  return Math.round(5 + ((seed * 137) % 95))
}

const TopProductsWidget = () => {
  const { simProducts, cardProducts } = useTelecomProducts()

  const topSims: (SimProduct & { soldCount: number })[] = simProducts
    .slice(0, 4)
    .map((p, i) => ({ ...p, soldCount: getMockSoldCount(p.id, i) }))
    .sort((a, b) => b.soldCount - a.soldCount)

  const topCards: (CardProduct & { soldCount: number })[] = cardProducts
    .slice(0, 4)
    .map((p, i) => ({ ...p, soldCount: getMockSoldCount(p.id, i + 10) }))
    .sort((a, b) => b.soldCount - a.soldCount)

  const maxSim = Math.max(...topSims.map((p) => p.soldCount), 1)
  const maxCard = Math.max(...topCards.map((p) => p.soldCount), 1)

  return (
    <Card className="border-0 shadow-sm h-100">
      <CardHeader className="border-light d-flex justify-content-between align-items-center">
        <CardTitle className="mb-0 fs-sm fw-semibold">Top sản phẩm bán chạy</CardTitle>
        <Link to="/products" className="fs-xs text-muted">
          Xem tất cả <TbArrowRight />
        </Link>
      </CardHeader>
      <CardBody className="pt-2">
        {/* SIM */}
        <div className="mb-3">
          <p className="fs-xs fw-semibold text-uppercase text-muted mb-2 d-flex align-items-center gap-1">
            <TbDeviceSim className="text-info" /> SIM Số
          </p>
          <div className="d-flex flex-column gap-2">
            {topSims.map((p) => (
              <div key={p.id}>
                <div className="d-flex justify-content-between mb-1">
                  <Link to={`/products/${p.id}`} className="fs-xs fw-medium text-truncate" style={{ maxWidth: 160 }}>
                    {p.simNumber}
                    <span className="text-muted ms-1">({p.carrier})</span>
                  </Link>
                  <span className="fs-xs text-muted">{formatVND(p.price)}₫ · {p.soldCount} bán</span>
                </div>
                <ProgressBar
                  now={(p.soldCount / maxSim) * 100}
                  variant="info"
                  style={{ height: 4, borderRadius: 3 }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div>
          <p className="fs-xs fw-semibold text-uppercase text-muted mb-2 d-flex align-items-center gap-1">
            <TbCreditCard className="text-warning" /> Thẻ cào
          </p>
          <div className="d-flex flex-column gap-2">
            {topCards.map((p) => (
              <div key={p.id}>
                <div className="d-flex justify-content-between mb-1">
                  <span className="fs-xs fw-medium text-truncate" style={{ maxWidth: 160 }}>
                    {p.carrier}{' '}
                    <span className="text-muted">
                      {new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(p.faceValue)}₫
                    </span>
                  </span>
                  <span className="fs-xs text-muted">{formatVND(p.price)}₫ · {p.soldCount} bán</span>
                </div>
                <ProgressBar
                  now={(p.soldCount / maxCard) * 100}
                  variant="warning"
                  style={{ height: 4, borderRadius: 3 }}
                />
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default TopProductsWidget
