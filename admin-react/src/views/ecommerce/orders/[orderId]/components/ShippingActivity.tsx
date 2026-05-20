import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap'
import { shippingTimeline } from '../../data'

const ShippingActivity = () => {
  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
      <CardHeader className="border-bottom bg-white p-4">
        <CardTitle as="h5" className="fw-bold text-dark mb-0">Lịch Sử Xử Lý & Giao Vận (Timeline)</CardTitle>
      </CardHeader>
      <CardBody className="p-4">
        <div className="timeline">
          {shippingTimeline.map((item, idx) => (
            <div key={idx} className="timeline-item d-flex align-items-stretch">
              <div className="timeline-time pe-3 text-muted fs-xs fw-medium" style={{ minWidth: '135px' }}>{item.time ?? ''}</div>
              <div className={`timeline-dot bg-${item.variant} shadow-sm`} />
              <div className={`timeline-content ps-3 ${idx !== shippingTimeline.length - 1 ? 'pb-4' : ''}`}>
                <h6 className="mb-1 fw-bold text-dark">{item.title}</h6>
                <p className="mb-1 text-muted fs-sm">{item.description}</p>
                <div className="d-flex align-items-center justify-content-between mt-2 pt-1 border-top border-light-subtle">
                  <span className="text-muted fs-xs">
                    Mã vận đơn / QR ID: <span className="text-primary fw-semibold font-monospace">{item.trackingNo}</span>
                  </span>
                  <span className="badge bg-light text-dark border border-light-subtle fs-xxs px-2 py-1">Bởi: {item.by}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

export default ShippingActivity
