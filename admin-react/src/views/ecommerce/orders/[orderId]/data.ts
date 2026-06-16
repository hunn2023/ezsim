export type TimelineEvent = {
  time: string | null
  title: string
  description: string
  trackingNo: string
  by: string
  variant: string
}

export const shippingTimeline: TimelineEvent[] = [
  {
    time: '18/05/2026, 15:30',
    title: 'Giao hàng / Kích hoạt thành công',
    description: 'Đơn hàng đã được giao đến tay khách hàng hoặc mã QR eSIM đã được quét thành công.',
    trackingNo: 'EZ-9928102',
    by: 'Hệ thống ezsim',
    variant: 'success',
  },
  {
    time: '18/05/2026, 14:45',
    title: 'Đang giao hàng / Gửi thông tin',
    description: 'Nhân viên giao hàng đang trên đường giao SIM vật lý hoặc hệ thống đang gửi email chứa QR Code.',
    trackingNo: 'EZ-9928102',
    by: 'Viettel Post / Zalo ZNS',
    variant: 'primary',
  },
  {
    time: '18/05/2026, 14:35',
    title: 'Đăng ký thông tin chính chủ',
    description: 'Hồ sơ CMND/CCCD của khách hàng đã được kiểm duyệt và đồng bộ với cơ sở dữ liệu Bộ TT&TT.',
    trackingNo: 'EZ-9928102',
    by: 'Nhân viên kiểm duyệt',
    variant: 'info',
  },
  {
    time: '18/05/2026, 14:32',
    title: 'Thanh toán thành công',
    description: 'Hệ thống ghi nhận giao dịch thanh toán qua cổng đa kênh thành công.',
    trackingNo: 'EZ-9928102',
    by: 'Cổng thanh toán',
    variant: 'success',
  },
  {
    time: '18/05/2026, 14:30',
    title: 'Đơn hàng được khởi tạo',
    description: 'Khách hàng đặt hàng thành công trên hệ thống ezsim.',
    trackingNo: 'EZ-9928102',
    by: 'Hệ thống ezsim',
    variant: 'secondary',
  },
]
