import { Card, CardBody } from 'react-bootstrap'
import type { IconType } from 'react-icons'

interface StatisticCardProps {
  title: string
  value: string | number
  icon: IconType
  iconBg?: string
  change?: { value: number; label?: string }
}

const StatisticCard = ({ title, value, icon: Icon, iconBg = 'primary', change }: StatisticCardProps) => {
  const isPositive = change && change.value >= 0

  return (
    <Card className="h-100">
      <CardBody className="d-flex align-items-center gap-3">
        <div
          className={`d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 bg-${iconBg} bg-opacity-15`}
          style={{ width: 52, height: 52 }}>
          <Icon className={`fs-24 text-${iconBg}`} />
        </div>
        <div className="flex-grow-1 overflow-hidden">
          <p className="text-muted mb-1 text-truncate" style={{ fontSize: 13 }}>
            {title}
          </p>
          <h4 className="mb-0 fw-bold">{value}</h4>
          {change !== undefined && (
            <p className={`mb-0 mt-1 text-${isPositive ? 'success' : 'danger'}`} style={{ fontSize: 12 }}>
              {isPositive ? '▲' : '▼'} {Math.abs(change.value)}%
              {change.label && <span className="text-muted ms-1">{change.label}</span>}
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

export default StatisticCard
