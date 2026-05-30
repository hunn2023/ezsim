import { Card, CardBody, CardHeader, Form, FormControl, FormLabel, InputGroup } from 'react-bootstrap'
import { TbBrandFacebook, TbBrandInstagram, TbBrandTiktok, TbBrandYoutube, TbMessageCircle } from 'react-icons/tb'
import type { SocialSettings } from '@/types/setting'

interface Props {
  value: SocialSettings
  onChange: (patch: Partial<SocialSettings>) => void
  errors: Partial<Record<keyof SocialSettings, string>>
}

const FIELDS: Array<{ key: keyof SocialSettings; label: string; icon: React.ElementType; placeholder: string }> = [
  { key: 'facebook',  label: 'Facebook',  icon: TbBrandFacebook,  placeholder: 'https://facebook.com/ezsim.vn' },
  { key: 'zalo',      label: 'Zalo',      icon: TbMessageCircle,  placeholder: 'https://zalo.me/0123456789' },
  { key: 'instagram', label: 'Instagram', icon: TbBrandInstagram, placeholder: 'https://instagram.com/ezsim' },
  { key: 'youtube',   label: 'YouTube',   icon: TbBrandYoutube,   placeholder: 'https://youtube.com/@ezsim' },
  { key: 'tiktok',    label: 'TikTok',    icon: TbBrandTiktok,    placeholder: 'https://tiktok.com/@ezsim' },
]

export default function SocialSection({ value, onChange, errors }: Props) {
  return (
    <Card>
      <CardHeader><strong>Mạng xã hội</strong></CardHeader>
      <CardBody className="d-flex flex-column gap-3">
        {FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
          <Form.Group key={key}>
            <FormLabel>{label}</FormLabel>
            <InputGroup>
              <InputGroup.Text><Icon /></InputGroup.Text>
              <FormControl
                value={value[key] ?? ''}
                onChange={(e) => onChange({ [key]: e.target.value } as Partial<SocialSettings>)}
                placeholder={placeholder}
                isInvalid={!!errors[key]}
              />
              <Form.Control.Feedback type="invalid">{errors[key]}</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        ))}
        <Form.Text className="text-muted">Bỏ trống nếu chưa có. Link sẽ được hiển thị ở footer storefront.</Form.Text>
      </CardBody>
    </Card>
  )
}
