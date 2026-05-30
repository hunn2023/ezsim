import { useState } from 'react'
import { Button, Card, CardBody, CardHeader, Spinner } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { TbCheck, TbKey, TbLock, TbQrcode, TbTruckDelivery, TbX } from 'react-icons/tb'
import { orderApi } from '@/api/orderApi'
import type { OrderDetail, OrderFulfillmentStatus } from '@/types/order'

interface ActionConfig {
  to: OrderFulfillmentStatus
  label: string
  variant: string
  icon: React.ElementType
  requireConfirm: boolean
  confirmTitle?: string
  confirmText?: string
}

const CONFIRM_CANCEL: Pick<ActionConfig, 'requireConfirm' | 'confirmTitle' | 'confirmText'> = {
  requireConfirm: true,
  confirmTitle: 'Hủy đơn hàng?',
  confirmText: 'Đơn hàng sẽ bị hủy. Hành động này không thể hoàn tác.',
}

const CONFIRM_COMPLETE: Pick<ActionConfig, 'requireConfirm' | 'confirmTitle' | 'confirmText'> = {
  requireConfirm: true,
  confirmTitle: 'Hoàn thành đơn?',
  confirmText: 'Xác nhận khách hàng đã nhận và sử dụng thành công.',
}

const ACTIONS_BY_STATUS: Record<OrderFulfillmentStatus, ActionConfig[]> = {
  manual_processing: [
    { to: 'qr_code_esim',          label: 'Gửi QR eSIM',       variant: 'info',           icon: TbQrcode,         requireConfirm: false },
    { to: 'activation_code',       label: 'Gửi mã kích hoạt',  variant: 'info',           icon: TbKey,            requireConfirm: false },
    { to: 'physical_sim_shipping', label: 'Giao SIM vật lý',   variant: 'primary',        icon: TbTruckDelivery,  requireConfirm: false },
    { to: 'cancelled',             label: 'Hủy đơn',           variant: 'outline-danger', icon: TbX,              ...CONFIRM_CANCEL },
  ],
  physical_sim_shipping: [
    { to: 'delivered',             label: 'Hoàn thành đơn',    variant: 'success',        icon: TbCheck,          ...CONFIRM_COMPLETE },
    { to: 'cancelled',             label: 'Hủy đơn',           variant: 'outline-danger', icon: TbX,              ...CONFIRM_CANCEL },
  ],
  qr_code_esim: [
    { to: 'delivered',             label: 'Hoàn thành đơn',    variant: 'success',        icon: TbCheck,          ...CONFIRM_COMPLETE },
  ],
  activation_code: [
    { to: 'delivered',             label: 'Hoàn thành đơn',    variant: 'success',        icon: TbCheck,          ...CONFIRM_COMPLETE },
  ],
  delivered: [],
  cancelled: [],
}

const toast = (icon: 'success' | 'error', title: string) =>
  Swal.fire({ toast: true, position: 'top-end', icon, title, timer: 2500, showConfirmButton: false, timerProgressBar: true })

interface Props {
  order: OrderDetail
  onUpdated: (next: OrderDetail) => void
}

export default function OrderStatusActions({ order, onUpdated }: Props) {
  const [pending, setPending] = useState<OrderFulfillmentStatus | null>(null)
  const actions = ACTIONS_BY_STATUS[order.fulfillmentStatus] ?? []
  const isTerminal = actions.length === 0
  const lockedLabel = order.fulfillmentStatus === 'delivered' ? 'đã hoàn thành' : 'đã hủy'

  const handleAction = async (action: ActionConfig) => {
    if (action.requireConfirm) {
      const result = await Swal.fire({
        title: action.confirmTitle ?? 'Xác nhận?',
        text: action.confirmText,
        icon: action.to === 'cancelled' ? 'warning' : 'question',
        showCancelButton: true,
        confirmButtonColor: action.to === 'cancelled' ? '#d33' : '#3085d6',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
      })
      if (!result.isConfirmed) return
    }

    setPending(action.to)
    try {
      const updated = await orderApi.updateStatus(order.id, action.to)
      onUpdated(updated)
      await toast('success', 'Cập nhật trạng thái thành công')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Cập nhật trạng thái thất bại'
      await toast('error', msg)
    } finally {
      setPending(null)
    }
  }

  return (
    <Card className="mb-3">
      <CardHeader><strong>Thao tác đơn hàng</strong></CardHeader>
      <CardBody>
        {isTerminal ? (
          <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: 14 }}>
            <TbLock />
            <span>
              Đơn hàng <strong>{lockedLabel}</strong>, không thể cập nhật trạng thái.
            </span>
          </div>
        ) : (
          <div className="d-flex flex-wrap gap-2">
            {actions.map((action) => {
              const Icon = action.icon
              const isLoading = pending === action.to
              return (
                <Button
                  key={action.to}
                  variant={action.variant}
                  size="sm"
                  disabled={pending !== null}
                  onClick={() => void handleAction(action)}
                >
                  {isLoading
                    ? <Spinner animation="border" size="sm" className="me-1" />
                    : <Icon className="me-1" />
                  }
                  {action.label}
                </Button>
              )
            })}
          </div>
        )}
      </CardBody>
    </Card>
  )
}
