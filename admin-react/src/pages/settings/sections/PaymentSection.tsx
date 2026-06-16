import { Alert, Card, CardBody, CardHeader, Form, Table } from 'react-bootstrap'
import { TbInfoCircle } from 'react-icons/tb'
import type { PaymentSettings } from '@/types/setting'

interface Props {
  value: PaymentSettings
  onChange: (patch: Partial<PaymentSettings>) => void
}

export default function PaymentSection({ value, onChange }: Props) {
  const togglProvider = (key: PaymentSettings['providers'][number]['key']) => {
    const next = value.providers.map((p) => (p.key === key ? { ...p, enabled: !p.enabled } : p))
    onChange({ providers: next })
  }

  return (
    <Card>
      <CardHeader><strong>Phương thức thanh toán</strong></CardHeader>
      <CardBody className="p-0">
        <Alert variant="light" className="d-flex align-items-start gap-2 m-3 mb-0 border">
          <TbInfoCircle className="fs-5 text-info flex-shrink-0 mt-1" />
          <div style={{ fontSize: 14 }}>
            Bật/tắt phương thức thanh toán hiển thị trên storefront. Cấu hình chi tiết khóa API/merchant
            được quản lý ở mục <strong>Phương thức thanh toán</strong> riêng.
          </div>
        </Alert>

        <Table hover className="mb-0 align-middle">
          <thead className="bg-light">
            <tr>
              <th>Phương thức</th>
              <th className="text-center" style={{ width: 160 }}>Bật trên storefront</th>
            </tr>
          </thead>
          <tbody>
            {value.providers.map((p) => (
              <tr key={p.key}>
                <td className="fw-semibold">{p.label}</td>
                <td className="text-center">
                  <Form.Check
                    type="switch"
                    id={`payment-${p.key}`}
                    checked={p.enabled}
                    onChange={() => togglProvider(p.key)}
                    label={p.enabled ? 'Đang bật' : 'Đang tắt'}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  )
}
