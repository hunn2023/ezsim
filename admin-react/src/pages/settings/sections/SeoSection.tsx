import { Card, CardBody, CardHeader, Col, Form, FormControl, FormLabel, Row } from 'react-bootstrap'
import ImageUploader from '@/components/common/ImageUploader'
import type { SeoSettings } from '@/types/setting'

interface Props {
  value: SeoSettings
  onChange: (patch: Partial<SeoSettings>) => void
  errors: Partial<Record<keyof SeoSettings, string>>
}

export default function SeoSection({ value, onChange, errors }: Props) {
  return (
    <Card>
      <CardHeader><strong>Cài đặt SEO</strong></CardHeader>
      <CardBody>
        <Row className="g-3">
          <Col xs={12}>
            <Form.Group>
              <FormLabel>Tiêu đề mặc định <span className="text-danger">*</span></FormLabel>
              <FormControl
                value={value.title}
                onChange={(e) => onChange({ title: e.target.value })}
                isInvalid={!!errors.title}
                maxLength={120}
                placeholder="EZSIM — eSIM, thẻ cào & data 4G/5G chính hãng"
              />
              <Form.Text className="text-muted">{value.title.length}/120 — nên giữ trong 50–60 ký tự.</Form.Text>
              <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col xs={12}>
            <Form.Group>
              <FormLabel>Mô tả meta <span className="text-danger">*</span></FormLabel>
              <FormControl
                as="textarea"
                rows={3}
                value={value.description}
                onChange={(e) => onChange({ description: e.target.value })}
                isInvalid={!!errors.description}
                maxLength={300}
                placeholder="Mô tả ngắn gọn về website..."
              />
              <Form.Text className="text-muted">{value.description.length}/300 — nên giữ trong 150–160 ký tự.</Form.Text>
              <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col xs={12}>
            <Form.Group>
              <FormLabel>Từ khóa</FormLabel>
              <FormControl
                value={value.keywords}
                onChange={(e) => onChange({ keywords: e.target.value })}
                placeholder="esim, esim du lịch, thẻ cào, data 4g"
              />
              <Form.Text className="text-muted">Phân cách bằng dấu phẩy.</Form.Text>
            </Form.Group>
          </Col>

          <Col xs={12}>
            <Form.Group>
              <FormLabel>Ảnh chia sẻ (Open Graph)</FormLabel>
              <ImageUploader
                value={value.ogImage || undefined}
                onChange={(url) => onChange({ ogImage: url ?? '' })}
                maxSizeMB={3}
              />
              <Form.Text className="text-muted">Tỉ lệ 1.91:1 (1200×630). Hiển thị khi share Facebook/Zalo.</Form.Text>
            </Form.Group>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}
