import { Card, CardBody, CardHeader, Col, Form, FormControl, FormLabel, Row } from 'react-bootstrap'
import ImageUploader from '@/components/common/ImageUploader'
import type { StoreSettings } from '@/types/setting'

interface Props {
  value: StoreSettings
  onChange: (patch: Partial<StoreSettings>) => void
  errors: Partial<Record<keyof StoreSettings, string>>
}

export default function StoreSection({ value, onChange, errors }: Props) {
  return (
    <Card>
      <CardHeader><strong>Thông tin cửa hàng</strong></CardHeader>
      <CardBody>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <FormLabel>Tên cửa hàng <span className="text-danger">*</span></FormLabel>
              <FormControl
                value={value.name}
                onChange={(e) => onChange({ name: e.target.value })}
                isInvalid={!!errors.name}
                placeholder="EZSIM"
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <FormLabel>Hotline <span className="text-danger">*</span></FormLabel>
              <FormControl
                value={value.hotline}
                onChange={(e) => onChange({ hotline: e.target.value })}
                isInvalid={!!errors.hotline}
                placeholder="1900 1234"
              />
              <Form.Control.Feedback type="invalid">{errors.hotline}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <FormLabel>Email hỗ trợ <span className="text-danger">*</span></FormLabel>
              <FormControl
                type="email"
                value={value.supportEmail}
                onChange={(e) => onChange({ supportEmail: e.target.value })}
                isInvalid={!!errors.supportEmail}
                placeholder="support@ezsim.vn"
              />
              <Form.Control.Feedback type="invalid">{errors.supportEmail}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <FormLabel>Giờ làm việc</FormLabel>
              <FormControl
                value={value.workingHours}
                onChange={(e) => onChange({ workingHours: e.target.value })}
                placeholder="T2–T7: 8h00 – 22h00"
              />
            </Form.Group>
          </Col>

          <Col xs={12}>
            <Form.Group>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl
                as="textarea"
                rows={2}
                value={value.address}
                onChange={(e) => onChange({ address: e.target.value })}
                placeholder="Số nhà, đường, quận, thành phố"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <FormLabel>Logo</FormLabel>
              <ImageUploader
                value={value.logo || undefined}
                onChange={(url) => onChange({ logo: url ?? '' })}
                maxSizeMB={2}
              />
              <Form.Text className="text-muted">PNG/SVG nền trong, khuyến nghị 240×60.</Form.Text>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <FormLabel>Favicon</FormLabel>
              <ImageUploader
                value={value.favicon || undefined}
                onChange={(url) => onChange({ favicon: url ?? '' })}
                maxSizeMB={1}
              />
              <Form.Text className="text-muted">Ảnh vuông 32×32 hoặc 64×64.</Form.Text>
            </Form.Group>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}
