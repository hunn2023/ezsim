import { Suspense } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Badge } from 'react-bootstrap'
import { TbDeviceSim, TbCreditCard } from 'react-icons/tb'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { CarrierPieChart } from './charts'

const CARRIER_COLORS: Record<string, string> = {
  Viettel: '#e53935',
  Vinaphone: '#1e88e5',
  Mobifone: '#43a047',
  Vietnamobile: '#fb8c00',
  iTel: '#8e24aa',
  Wintel: '#00acc1',
}

const CarrierStockWidget = () => {
  const { carrierStats } = useDashboardStats()

  const pieData = carrierStats
    .filter((c) => c.simCount + c.cardCount > 0)
    .map((c) => ({
      name: c.carrier,
      value: c.simCount + c.cardCount,
      itemStyle: { color: CARRIER_COLORS[c.carrier] ?? '#aaa' },
    }))

  return (
    <Card className="border-0 shadow-sm h-100">
      <CardHeader className="border-light">
        <CardTitle className="mb-0 fs-sm fw-semibold">Kho hàng theo nhà mạng</CardTitle>
      </CardHeader>
      <CardBody className="pt-2">
        <Suspense>
          <CarrierPieChart data={pieData} />
        </Suspense>
        <div className="mt-2">
          {carrierStats.map((c) => (
            <div
              key={c.carrier}
              className="d-flex justify-content-between align-items-center py-1 border-bottom border-dashed"
            >
              <div className="d-flex align-items-center gap-2">
                <span
                  className="rounded-circle d-inline-block"
                  style={{ width: 10, height: 10, backgroundColor: CARRIER_COLORS[c.carrier] ?? '#aaa', flexShrink: 0 }}
                />
                <span className="fs-xs fw-medium">{c.carrier}</span>
              </div>
              <div className="d-flex gap-2">
                <Badge bg="light" text="dark" className="fs-xxs d-flex align-items-center gap-1">
                  <TbDeviceSim className="text-info" /> {c.simCount}
                </Badge>
                <Badge bg="light" text="dark" className="fs-xxs d-flex align-items-center gap-1">
                  <TbCreditCard className="text-warning" /> {c.cardCount}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

export default CarrierStockWidget
