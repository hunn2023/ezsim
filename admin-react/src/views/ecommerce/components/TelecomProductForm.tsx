import { useState, useEffect } from 'react'
import { Button, Card, Col, Form, InputGroup, Row, Badge, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import { TbDeviceSim, TbCreditCard, TbCheck, TbX, TbCalculator } from 'react-icons/tb'

import { useTelecomProducts } from '../../../hooks/useTelecomProducts'
import { useCountriesRegions } from '../../../hooks/useCountriesRegions'
import { type CarrierType, type SimCategory, type SimFormat, type SimStatus, type CardType, type CardStatus, type TelecomProduct } from '../../../types/telecom'

interface TelecomProductFormProps {
  initialData?: TelecomProduct
  isEditMode?: boolean
}

const CARRIERS: CarrierType[] = ['Viettel', 'Vinaphone', 'Mobifone', 'Vietnamobile', 'Wintel', 'iTel', 'Garena', 'Zing']
const SIM_CATEGORIES: SimCategory[] = ['Số đẹp', 'Data 4G/5G', 'Du lịch']
const SIM_FORMATS: SimFormat[] = ['Vật lý', 'eSIM']
const SIM_STATUSES: { label: string; value: SimStatus }[] = [
  { label: 'Sẵn sàng bán', value: 'available' },
  { label: 'Đang giữ số', value: 'reserved' },
  { label: 'Đã bán', value: 'sold' },
  { label: 'Tạm khóa', value: 'locked' },
]

const CARD_STATUSES: { label: string; value: CardStatus }[] = [
  { label: 'Có sẵn hàng', value: 'available' },
  { label: 'Hết hàng trong kho', value: 'out_of_stock' },
  { label: 'Tạm khóa', value: 'locked' },
]

const FACE_VALUES = [10000, 20000, 50000, 100000, 200000, 500000, 1000000]

export const TelecomProductForm = ({ initialData, isEditMode = false }: TelecomProductFormProps) => {
  const navigate = useNavigate()
  const { addProduct, updateProduct } = useTelecomProducts()
  const { countries } = useCountriesRegions()
  const activeCountries = countries.filter(c => c.status)

  const [productType, setProductType] = useState<'sim' | 'card'>(initialData ? initialData.type : 'sim')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // SIM State
  const [simCountryId, setSimCountryId] = useState(
    initialData && initialData.type === 'sim' && (initialData as any).attributes?.countryId
      ? (initialData as any).attributes.countryId
      : ''
  )
  const [simNumber, setSimNumber] = useState(initialData && initialData.type === 'sim' ? initialData.simNumber : '')
  const [simCarrier, setSimCarrier] = useState<CarrierType>(initialData && initialData.type === 'sim' ? initialData.carrier : 'Viettel')
  const [simCategory, setSimCategory] = useState<SimCategory>(initialData && initialData.type === 'sim' ? initialData.category : 'Số đẹp')
  const [simFormat, setSimFormat] = useState<SimFormat>(initialData && initialData.type === 'sim' ? initialData.format : 'Vật lý')
  const [dataPlan, setDataPlan] = useState(initialData && initialData.type === 'sim' ? initialData.dataPlan : 'V120N - 4GB/ngày')
  const [simPrice, setSimPrice] = useState<number>(initialData && initialData.type === 'sim' ? initialData.price : 250000)
  const [simOriginalPrice, setSimOriginalPrice] = useState<number>(initialData && initialData.type === 'sim' ? initialData.originalPrice : 300000)
  const [simStatus, setSimStatus] = useState<SimStatus>(initialData && initialData.type === 'sim' ? initialData.status : 'available')
  const [highlightFeatures, setHighlightFeatures] = useState<string>(
    initialData && initialData.type === 'sim' ? initialData.highlightFeatures.join(', ') : 'Số sảnh đẹp, Đăng ký chính chủ dễ dàng'
  )

  // Card State
  const [cardCarrier, setCardCarrier] = useState<CarrierType>(initialData && initialData.type === 'card' ? initialData.carrier : 'Viettel')
  const [faceValue, setFaceValue] = useState<number>(initialData && initialData.type === 'card' ? initialData.faceValue : 100000)
  const [discountRate, setDiscountRate] = useState<number>(initialData && initialData.type === 'card' ? initialData.discountRate : 3.5)
  const [cardType, setCardType] = useState<CardType>(initialData && initialData.type === 'card' ? initialData.cardType : 'topup')
  const [stockCount, setStockCount] = useState<number>(initialData && initialData.type === 'card' ? initialData.stockCount : 500)
  const [dataPlanDesc, setDataPlanDesc] = useState<string>(
    initialData && initialData.type === 'card' && initialData.dataPlanDescription ? initialData.dataPlanDescription : 'Gói Data 15GB tốc độ cao'
  )
  const [cardStatus, setCardStatus] = useState<CardStatus>(initialData && initialData.type === 'card' ? initialData.status : 'available')

  // Auto detect carrier for SIM numbers
  useEffect(() => {
    if (productType === 'sim' && simNumber.length >= 3) {
      const head = simNumber.slice(0, 3)
      if (['098', '097', '086', '032', '033', '034', '035', '036', '037', '038', '039'].includes(head)) setSimCarrier('Viettel')
      else if (['091', '094', '088', '081', '082', '083', '084', '085'].includes(head)) setSimCarrier('Vinaphone')
      else if (['090', '093', '089', '070', '076', '077', '078', '079'].includes(head)) setSimCarrier('Mobifone')
      else if (['092', '056', '058'].includes(head)) setSimCarrier('Vietnamobile')
      else if (head === '055') setSimCarrier('Wintel')
      else if (head === '087') setSimCarrier('iTel')
    }
  }, [simNumber, productType])

  const calculateTotalPoints = (num: string) => {
    if (!num) return 0
    const sum = num.split('').reduce((acc, curr) => acc + (parseInt(curr) || 0), 0)
    const lastDigit = sum % 10
    return lastDigit === 0 ? 10 : lastDigit
  }

  const getFengShuiElement = (num: string): 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ' => {
    if (!num) return 'Kim'
    const lastNum = parseInt(num.slice(-1)) || 0
    if ([1, 6].includes(lastNum)) return 'Thủy'
    if ([2, 7].includes(lastNum)) return 'Hỏa'
    if ([3, 8].includes(lastNum)) return 'Mộc'
    if ([4, 9].includes(lastNum)) return 'Kim'
    return 'Thổ'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (productType === 'sim') {
      const cleanNum = simNumber.replace(/\D/g, '')
      if (cleanNum.length !== 10) {
        setErrorMsg('Số điện thoại SIM phải có chính xác 10 chữ số!')
        return
      }
      if (simPrice <= 0) {
        setErrorMsg('Giá bán SIM phải lớn hơn 0!')
        return
      }

      const totalPoints = calculateTotalPoints(cleanNum)
      const element = getFengShuiElement(cleanNum)

      const simPayload = {
        type: 'sim' as const,
        simNumber: cleanNum,
        carrier: simCarrier,
        category: simCategory,
        format: simFormat,
        dataPlan,
        price: simPrice,
        originalPrice: simOriginalPrice > simPrice ? simOriginalPrice : simPrice + 50000,
        status: simStatus,
        attributes: {
          totalPoints,
          element,
          headCode: cleanNum.slice(0, 3),
          tailCode: cleanNum.slice(-4),
          countryId: simCategory === 'Du lịch' ? simCountryId : undefined,
        },
        highlightFeatures: highlightFeatures.split(',').map((s) => s.trim()).filter(Boolean),
      }

      if (isEditMode && initialData) {
        updateProduct(initialData.id, simPayload)
        setSuccessMsg('Đã cập nhật số SIM thành công!')
      } else {
        addProduct(simPayload)
        setSuccessMsg('Đã thêm số SIM mới vào kho!')
      }
    } else {
      // Card Payload
      if (faceValue <= 0) {
        setErrorMsg('Mệnh giá thẻ phải lớn hơn 0!')
        return
      }
      if (stockCount < 0) {
        setErrorMsg('Số lượng thẻ không được âm!')
        return
      }

      const calculatedPrice = Math.round(faceValue * (1 - discountRate / 100))
      const cardPayload = {
        type: 'card' as const,
        carrier: cardCarrier,
        faceValue,
        price: calculatedPrice,
        discountRate,
        cardType,
        stockCount,
        dataPlanDescription: cardType === 'data' ? dataPlanDesc : undefined,
        status: cardStatus,
      }

      if (isEditMode && initialData) {
        updateProduct(initialData.id, cardPayload)
        setSuccessMsg('Đã cập nhật thông tin thẻ thành công!')
      } else {
        addProduct(cardPayload)
        setSuccessMsg('Đã nhập lô thẻ mới vào kho!')
      }
    }

    setTimeout(() => {
      navigate('/products')
    }, 1200)
  }

  const calculatedCardPrice = Math.round(faceValue * (1 - discountRate / 100))

  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden p-4 mb-4">
      {successMsg && (
        <Alert variant="success" className="d-flex align-items-center rounded-3 fs-sm fw-medium">
          <TbCheck className="me-2 fs-lg" /> {successMsg}
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="danger" className="d-flex align-items-center rounded-3 fs-sm fw-medium">
          <TbX className="me-2 fs-lg" /> {errorMsg}
        </Alert>
      )}

      {!isEditMode && (
        <div className="mb-4 text-center">
          <label className="form-label text-muted fw-bold text-uppercase fs-xs mb-2">Chọn Loại Sản Phẩm Muốn Nhập</label>
          <div className="d-flex justify-content-center gap-3">
            <Button
              variant={productType === 'sim' ? 'primary' : 'outline-secondary'}
              className="rounded-pill px-4 py-2 d-flex align-items-center fw-bold shadow-sm"
              onClick={() => setProductType('sim')}>
              <TbDeviceSim className="me-2 fs-lg" /> SIM Di Động
            </Button>
            <Button
              variant={productType === 'card' ? 'primary' : 'outline-secondary'}
              className="rounded-pill px-4 py-2 d-flex align-items-center fw-bold shadow-sm"
              onClick={() => setProductType('card')}>
              <TbCreditCard className="me-2 fs-lg" /> Thẻ Cào & Thẻ Data
            </Button>
          </div>
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        {productType === 'sim' ? (
          /* --- SIM FORM --- */
          <Row className="g-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-dark fs-sm">Số điện thoại SIM *</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light fw-bold text-primary">📞</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Nhập 10 số (ví dụ: 0988888888)"
                    value={simNumber}
                    onChange={(e) => setSimNumber(e.target.value)}
                    required
                    maxLength={11}
                    className="fw-bold fs-base"
                  />
                </InputGroup>
                <Form.Text className="text-muted fs-xs">
                  Hệ thống tự động tính điểm tổng nút: <Badge bg="info">{calculateTotalPoints(simNumber)} điểm</Badge> | Mệnh: <Badge bg="secondary">{getFengShuiElement(simNumber)}</Badge>
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-dark fs-sm">Nhà mạng phân phối *</Form.Label>
                <Form.Select value={simCarrier} onChange={(e) => setSimCarrier(e.target.value as CarrierType)} className="fw-semibold">
                  {CARRIERS.filter((c) => !['Garena', 'Zing'].includes(c)).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-dark fs-sm">Phân loại SIM</Form.Label>
                <Form.Select value={simCategory} onChange={(e) => setSimCategory(e.target.value as SimCategory)} className="fw-semibold">
                  {SIM_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {simCategory === 'Du lịch' && (
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold text-dark fs-sm">Quốc gia của SIM du lịch *</Form.Label>
                  <Form.Select 
                    value={simCountryId} 
                    onChange={(e) => setSimCountryId(e.target.value)} 
                    className="fw-semibold" 
                    required>
                    <option value="" disabled>-- Chọn quốc gia --</option>
                    {activeCountries.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.flagEmoji} {c.name} ({c.code})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            )}

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-dark fs-sm">Định dạng SIM</Form.Label>
                <div className="d-flex gap-4 pt-2">
                  {SIM_FORMATS.map((f) => (
                    <Form.Check
                      key={f}
                      type="radio"
                      id={`format-${f}`}
                      label={f === 'eSIM' ? 'eSIM (Quét mã QR trực tuyến)' : 'SIM Vật Lý (Giao thẻ tận nơi)'}
                      name="sim-format"
                      checked={simFormat === f}
                      onChange={() => setSimFormat(f)}
                      className="fw-semibold fs-sm text-dark"
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-bold text-dark fs-sm">Gói cước khuyến mãi kèm theo *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ví dụ: V120N - Miễn phí 4GB/ngày và gọi nội mạng"
                  value={dataPlan}
                  onChange={(e) => setDataPlan(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-dark fs-sm">Giá bán thực tế (VNĐ) *</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    value={simPrice}
                    onChange={(e) => setSimPrice(Number(e.target.value))}
                    required
                    min={1000}
                    step={1000}
                    className="fw-bold text-danger"
                  />
                  <InputGroup.Text className="bg-light fw-bold">VNĐ</InputGroup.Text>
                </InputGroup>
                <Form.Text className="text-muted fs-xs">
                  Hiển thị: <span className="fw-bold text-danger">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(simPrice)}</span>
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-dark fs-sm">Giá niêm yết gốc (VNĐ)</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    value={simOriginalPrice}
                    onChange={(e) => setSimOriginalPrice(Number(e.target.value))}
                    min={simPrice}
                    step={1000}
                  />
                  <InputGroup.Text className="bg-light">VNĐ</InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-dark fs-sm">Trạng thái kho hàng</Form.Label>
                <Form.Select value={simStatus} onChange={(e) => setSimStatus(e.target.value as SimStatus)} className="fw-semibold">
                  {SIM_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-dark fs-sm">Điểm nổi bật (Phân cách bằng dấu phẩy)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ví dụ: Đầu số thần tài, Phong thủy cực tốt cho kinh doanh"
                  value={highlightFeatures}
                  onChange={(e) => setHighlightFeatures(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        ) : (
          /* --- CARD FORM --- */
          <Row className="g-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-dark fs-sm">Nhà mạng phát hành *</Form.Label>
                <Form.Select value={cardCarrier} onChange={(e) => setCardCarrier(e.target.value as CarrierType)} className="fw-semibold">
                  {CARRIERS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-dark fs-sm">Loại thẻ</Form.Label>
                <div className="d-flex gap-4 pt-2">
                  <Form.Check
                    type="radio"
                    id="card-topup"
                    label="Thẻ cào nạp thoại thông thường"
                    checked={cardType === 'topup'}
                    onChange={() => setCardType('topup')}
                    className="fw-semibold fs-sm text-dark"
                  />
                  <Form.Check
                    type="radio"
                    id="card-data"
                    label="Thẻ nạp Data 3G/4G"
                    checked={cardType === 'data'}
                    onChange={() => setCardType('data')}
                    className="fw-semibold fs-sm text-dark"
                  />
                </div>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-dark fs-sm">Mệnh giá thẻ (VNĐ) *</Form.Label>
                <InputGroup>
                  <Form.Select
                    value={faceValue}
                    onChange={(e) => setFaceValue(Number(e.target.value))}
                    className="fw-bold text-primary">
                    {FACE_VALUES.map((val) => (
                      <option key={val} value={val}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-dark fs-sm">Tỷ lệ chiết khấu bán ra (%) *</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light"><TbCalculator /></InputGroup.Text>
                  <Form.Control
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    value={discountRate}
                    onChange={(e) => setDiscountRate(Number(e.target.value))}
                    required
                  />
                  <InputGroup.Text className="bg-light">%</InputGroup.Text>
                </InputGroup>
                <Form.Text className="text-muted fs-xs">
                  Giá bán ra thực tế: <Badge bg="success" className="fs-xs px-2 py-1">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculatedCardPrice)}</Badge> (Chiết khấu {discountRate}%)
                </Form.Text>
              </Form.Group>
            </Col>

            {cardType === 'data' && (
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-bold text-dark fs-sm">Mô tả gói Data đi kèm *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ví dụ: Gói ST100K - 15GB tốc độ cao trong 30 ngày"
                    value={dataPlanDesc}
                    onChange={(e) => setDataPlanDesc(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            )}

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-dark fs-sm">Số lượng mã thẻ nhập kho *</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    min="0"
                    step="10"
                    value={stockCount}
                    onChange={(e) => setStockCount(Number(e.target.value))}
                    required
                  />
                  <InputGroup.Text className="bg-light">mã thẻ</InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold text-dark fs-sm">Trạng thái</Form.Label>
                <Form.Select value={cardStatus} onChange={(e) => setCardStatus(e.target.value as CardStatus)} className="fw-semibold">
                  {CARD_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        )}

        <div className="d-flex justify-content-end gap-3 pt-4 mt-4 border-top">
          <Button variant="outline-secondary" className="rounded-pill px-4 fw-bold" onClick={() => navigate('/products')}>
            Hủy Bỏ
          </Button>
          <Button variant="danger" type="submit" className="rounded-pill px-5 fw-bold shadow-sm">
            {isEditMode ? 'Lưu Thay Đổi' : 'Đăng Sản Phẩm'}
          </Button>
        </div>
      </Form>
    </Card>
  )
}
