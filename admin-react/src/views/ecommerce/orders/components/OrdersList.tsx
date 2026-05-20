import {
  type ColumnFiltersState,
  createColumnHelper,
  type FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row as TableRow,
  type SortingState,
  type Table as TableType,
  useReactTable,
} from '@tanstack/react-table'
import { Button, Card, CardFooter, CardHeader } from 'react-bootstrap'
import { Link } from 'react-router'
import { useState } from 'react'
import { LuCalendar, LuCreditCard, LuPlus, LuSearch, LuTruck } from 'react-icons/lu'
import {
  TbEdit,
  TbEye,
  TbCheck,
  TbClock,
  TbX,
  TbQrcode,
  TbDeviceSim,
  TbTruck as TbTruckIcon,
  TbTrash,
  TbBuildingBank,
  TbCreditCard,
  TbWallet,
} from 'react-icons/tb'

import DataTable from '@/components/table/DataTable'
import DeleteConfirmationModal from '@/components/table/DeleteConfirmationModal'
import TablePagination from '@/components/table/TablePagination'
import { orders, type OrderType } from '../data'

const formatVND = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
}

const getPaymentStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return (
        <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fs-xs fw-semibold d-inline-flex align-items-center shadow-sm">
          <TbCheck className="me-1 fs-sm" /> Đã thanh toán
        </span>
      )
    case 'pending':
      return (
        <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1 fs-xs fw-semibold d-inline-flex align-items-center shadow-sm">
          <TbClock className="me-1 fs-sm" /> Chờ thanh toán
        </span>
      )
    case 'processing':
      return (
        <span className="badge bg-info-subtle text-info border border-info-subtle px-2 py-1 fs-xs fw-semibold d-inline-flex align-items-center shadow-sm">
          <TbClock className="me-1 fs-sm" /> Đang xử lý
        </span>
      )
    case 'error':
      return (
        <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 fs-xs fw-semibold d-inline-flex align-items-center shadow-sm">
          <TbX className="me-1 fs-sm" /> Lỗi thanh toán
        </span>
      )
    case 'cancelled':
      return (
        <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1 fs-xs fw-semibold d-inline-flex align-items-center shadow-sm">
          <TbX className="me-1 fs-sm" /> Đã hủy
        </span>
      )
    case 'refunded':
      return (
        <span className="badge bg-dark-subtle text-dark border border-dark-subtle px-2 py-1 fs-xs fw-semibold d-inline-flex align-items-center shadow-sm">
          Đã hoàn tiền
        </span>
      )
    default:
      return <span className="badge bg-light text-dark">{status}</span>
  }
}

const getOrderStatusBadge = (status: string) => {
  switch (status) {
    case 'qr_code_esim':
      return (
        <span className="badge bg-purple-subtle text-purple border border-purple-subtle px-2 py-1 fs-xs fw-semibold d-inline-flex align-items-center shadow-sm" style={{ color: '#6f42c1', backgroundColor: '#e2d9f3' }}>
          <TbQrcode className="me-1 fs-sm" /> Gửi QR eSIM
        </span>
      )
    case 'activation_code':
      return (
        <span className="badge bg-info-subtle text-info border border-info-subtle px-2 py-1 fs-xs fw-semibold d-inline-flex align-items-center shadow-sm">
          <TbDeviceSim className="me-1 fs-sm" /> Mã kích hoạt
        </span>
      )
    case 'manual_processing':
      return (
        <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1 fs-xs fw-semibold d-inline-flex align-items-center shadow-sm">
          <TbClock className="me-1 fs-sm" /> Xử lý thủ công
        </span>
      )
    case 'physical_sim_shipping':
      return (
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 fs-xs fw-semibold d-inline-flex align-items-center shadow-sm">
          <TbTruckIcon className="me-1 fs-sm" /> Giao SIM vật lý
        </span>
      )
    case 'delivered':
      return (
        <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fs-xs fw-semibold d-inline-flex align-items-center shadow-sm">
          <TbCheck className="me-1 fs-sm" /> Đã hoàn thành
        </span>
      )
    case 'cancelled':
      return (
        <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 fs-xs fw-semibold d-inline-flex align-items-center shadow-sm">
          <TbX className="me-1 fs-sm" /> Đã hủy đơn
        </span>
      )
    default:
      return <span className="badge bg-light text-dark">{status}</span>
  }
}

const getPaymentMethodIcon = (methodType: string) => {
  switch (methodType) {
    case 'E-Wallet':
      return <TbWallet className="text-primary me-1 fs-lg" />
    case 'Bank Transfer':
      return <TbBuildingBank className="text-info me-1 fs-lg" />
    case 'QR Code':
      return <TbQrcode className="text-success me-1 fs-lg" />
    case 'Card':
      return <TbCreditCard className="text-warning me-1 fs-lg" />
    default:
      return <TbWallet className="text-secondary me-1 fs-lg" />
  }
}

const columnHelper = createColumnHelper<OrderType>()

const dateRangeFilterFn: FilterFn<any> = (row, columnId, selectedRange) => {
  if (!selectedRange || selectedRange === 'All') return true

  const text = row.getValue<string>(columnId)
  if (!text) return false

  // Parse DD/MM/YYYY
  const parts = text.split('/')
  if (parts.length !== 3) return false
  const cellDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))
  if (isNaN(cellDate.getTime())) return false

  const now = new Date(2026, 4, 18) // Mock current date 18/05/2026
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  let rangeStart, rangeEnd

  switch (selectedRange) {
    case 'Today':
      return cellDate >= startOfToday && cellDate < endOfToday
    case 'Last 7 Days':
      rangeStart = new Date(now)
      rangeStart.setDate(now.getDate() - 7)
      rangeEnd = endOfToday
      return cellDate >= rangeStart && cellDate < rangeEnd
    case 'Last 30 Days':
      rangeStart = new Date(now)
      rangeStart.setDate(now.getDate() - 30)
      rangeEnd = endOfToday
      return cellDate >= rangeStart && cellDate < rangeEnd
    case 'This Year':
      rangeStart = new Date(now.getFullYear(), 0, 1)
      rangeEnd = new Date(now.getFullYear() + 1, 0, 1)
      return cellDate >= rangeStart && cellDate < rangeEnd
    default:
      return true
  }
}

const OrdersList = () => {
  const columns = [
    {
      id: 'select',
      header: ({ table }: { table: TableType<OrderType> }) => (
        <input
          type="checkbox"
          className="form-check-input form-check-input-light fs-14"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }: { row: TableRow<OrderType> }) => (
        <input
          type="checkbox"
          className="form-check-input form-check-input-light fs-14"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
    columnHelper.accessor('orderCode', {
      header: 'Mã Đơn Hàng',
      cell: ({ row }) => (
        <h5 className="fs-sm mb-0 fw-bold">
          <Link to={`/orders/${row.original.id}`} className="text-primary text-decoration-none">
            #{row.original.orderCode}
          </Link>
        </h5>
      ),
    }),
    columnHelper.accessor('date', {
      header: 'Ngày đặt',
      filterFn: dateRangeFilterFn,
      enableColumnFilter: true,
      cell: ({ row }) => (
        <div className="fw-medium text-dark fs-sm">
          {row.original.date} <small className="text-muted ms-1">{row.original.time}</small>
        </div>
      ),
    }),
    columnHelper.accessor('customer', {
      header: 'Khách hàng',
      cell: ({ row }) => (
        <div className="d-flex justify-content-start align-items-center gap-2">
          <div className="avatar avatar-sm flex-shrink-0">
            <img src={row.original.customer.avatar} alt="" height={36} width={36} className="img-fluid rounded-circle shadow-sm border" />
          </div>
          <div>
            <h5 className="text-nowrap fs-sm fw-bold text-dark mb-0 lh-base">{row.original.customer.name}</h5>
            <p className="text-muted fs-xs mb-0">{row.original.customer.phone}</p>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('totalAmount', {
      header: 'Tổng tiền',
      cell: ({ row }) => <span className="fw-black text-danger fs-sm">{formatVND(row.original.finalAmount)}</span>,
    }),
    columnHelper.accessor('paymentStatus', {
      header: 'Thanh toán',
      filterFn: 'equalsString',
      enableColumnFilter: true,
      cell: ({ row }) => getPaymentStatusBadge(row.original.paymentStatus),
    }),
    columnHelper.accessor('orderStatus', {
      header: 'Giao hàng & Xử lý',
      filterFn: 'equalsString',
      enableColumnFilter: true,
      cell: ({ row }) => getOrderStatusBadge(row.original.orderStatus),
    }),
    columnHelper.accessor('paymentInfo', {
      header: 'Cổng & Phương thức',
      cell: ({ row }) => (
        <div className="d-flex align-items-center fs-sm fw-medium text-dark">
          {getPaymentMethodIcon(row.original.paymentInfo.methodType)}
          <span>{row.original.paymentInfo.provider}</span>
          <span className="text-muted fs-xs ms-1">({row.original.paymentInfo.methodType})</span>
        </div>
      ),
    }),
    {
      header: 'Thao tác',
      id: 'actions',
      cell: ({ row }: { row: TableRow<OrderType> }) => (
        <div className="d-flex gap-1">
          <Link to={`/orders/${row.original.id}`}>
            <Button variant="light" size="sm" className="btn-icon rounded-circle shadow-sm" title="Xem chi tiết">
              <TbEye className="fs-base text-primary" />
            </Button>
          </Link>
          <Link to={`/orders/${row.original.id}`}>
            <Button variant="light" size="sm" className="btn-icon rounded-circle shadow-sm ms-1" title="Chỉnh sửa">
              <TbEdit className="fs-base text-warning" />
            </Button>
          </Link>
          <Button
            variant="light"
            size="sm"
            className="btn-icon rounded-circle shadow-sm ms-1"
            title="Xóa"
            onClick={() => {
              toggleDeleteModal()
              setSelectedRowIds({ [row.id]: true })
            }}>
            <TbTrash className="fs-base text-danger" />
          </Button>
        </div>
      ),
    },
  ]

  const [data, setData] = useState<OrderType[]>(() => [...orders])
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 })

  const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>({})

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, columnFilters, pagination, rowSelection: selectedRowIds },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onRowSelectionChange: setSelectedRowIds,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase()
      const matchCode = row.original.orderCode.toLowerCase().includes(search)
      const matchCust = row.original.customer.name.toLowerCase().includes(search) || row.original.customer.phone.includes(search)
      const matchItem = row.original.items.some((item) => item.productName.toLowerCase().includes(search))
      return matchCode || matchCust || matchItem
    },
    enableColumnFilters: true,
    enableRowSelection: true,
    filterFns: {
      dateRange: dateRangeFilterFn,
    },
  })

  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize
  const totalItems = table.getFilteredRowModel().rows.length

  const start = pageIndex * pageSize + 1
  const end = Math.min(start + pageSize - 1, totalItems)

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal)
  }

  const handleDelete = () => {
    const selectedIds = new Set(Object.keys(selectedRowIds))
    setData((old) => old.filter((_, idx) => !selectedIds.has(idx.toString())))
    setSelectedRowIds({})
    setPagination({ ...pagination, pageIndex: 0 })
    setShowDeleteModal(false)
  }

  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4">
      <CardHeader className="bg-white border-bottom p-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
          <h4 className="fw-bolder text-dark mb-0">Danh Sách Đơn Hàng Viễn Thông</h4>
          <div className="d-flex gap-2">
            {Object.keys(selectedRowIds).length > 0 && (
              <Button variant="danger" className="rounded-pill px-4 py-2 fw-bold d-flex align-items-center shadow-sm" onClick={toggleDeleteModal}>
                <TbTrash className="fs-base me-1" /> Xóa ({Object.keys(selectedRowIds).length})
              </Button>
            )}
            <Link to="/orders/new">
              <Button variant="primary" className="rounded-pill px-4 py-2 fw-bold d-flex align-items-center shadow-sm">
                <LuPlus className="fs-base me-1" /> Tạo Đơn Hàng
              </Button>
            </Link>
          </div>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-3 mt-3 pt-2 border-top border-light-subtle">
          <div className="app-search flex-grow-1" style={{ minWidth: '260px' }}>
            <input
              type="search"
              className="form-control rounded-pill px-4 py-2 fs-sm bg-light border-0 shadow-none"
              placeholder="Tìm theo mã đơn, tên hoặc SĐT khách hàng..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <LuSearch className="app-search-icon text-muted ms-2" />
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border border-light-subtle">
              <LuCreditCard className="text-muted me-2 fs-sm" />
              <select
                className="form-select form-select-sm bg-transparent border-0 shadow-none fw-medium text-dark"
                value={(table.getColumn('paymentStatus')?.getFilterValue() as string) ?? 'All'}
                onChange={(e) => table.getColumn('paymentStatus')?.setFilterValue(e.target.value === 'All' ? undefined : e.target.value)}>
                <option value="All">Tất cả thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="pending">Chờ thanh toán</option>
                <option value="processing">Đang xử lý</option>
                <option value="error">Lỗi giao dịch</option>
                <option value="cancelled">Đã hủy</option>
                <option value="refunded">Đã hoàn tiền</option>
              </select>
            </div>

            <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border border-light-subtle">
              <LuTruck className="text-muted me-2 fs-sm" />
              <select
                className="form-select form-select-sm bg-transparent border-0 shadow-none fw-medium text-dark"
                value={(table.getColumn('orderStatus')?.getFilterValue() as string) ?? 'All'}
                onChange={(e) => table.getColumn('orderStatus')?.setFilterValue(e.target.value === 'All' ? undefined : e.target.value)}>
                <option value="All">Tất cả hình thức giao</option>
                <option value="qr_code_esim">Gửi QR eSIM</option>
                <option value="activation_code">Mã kích hoạt</option>
                <option value="manual_processing">Xử lý thủ công</option>
                <option value="physical_sim_shipping">Giao SIM vật lý</option>
                <option value="delivered">Đã hoàn thành</option>
                <option value="cancelled">Đã hủy đơn</option>
              </select>
            </div>

            <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border border-light-subtle">
              <LuCalendar className="text-muted me-2 fs-sm" />
              <select
                className="form-select form-select-sm bg-transparent border-0 shadow-none fw-medium text-dark"
                value={(table.getColumn('date')?.getFilterValue() as string) ?? ''}
                onChange={(e) => table.getColumn('date')?.setFilterValue(e.target.value || undefined)}>
                <option value="All">Khoảng thời gian</option>
                <option value="Today">Hôm nay</option>
                <option value="Last 7 Days">7 ngày qua</option>
                <option value="Last 30 Days">30 ngày qua</option>
                <option value="This Year">Năm nay</option>
              </select>
            </div>

            <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border border-light-subtle">
              <span className="text-muted fs-xs me-2">Hiển thị:</span>
              <select
                className="form-select form-select-sm bg-transparent border-0 shadow-none fw-bold text-dark"
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}>
                {[5, 8, 10, 15, 20].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </CardHeader>

      <div className="p-0">
        <DataTable<OrderType> table={table} emptyMessage="Không tìm thấy đơn hàng nào phù hợp" />
      </div>

      {table.getRowModel().rows.length > 0 && (
        <CardFooter className="border-top bg-white p-4">
          <TablePagination
            totalItems={totalItems}
            start={start}
            end={end}
            itemsName="đơn hàng"
            showInfo
            previousPage={table.previousPage}
            canPreviousPage={table.getCanPreviousPage()}
            pageCount={table.getPageCount()}
            pageIndex={table.getState().pagination.pageIndex}
            setPageIndex={table.setPageIndex}
            nextPage={table.nextPage}
            canNextPage={table.getCanNextPage()}
          />
        </CardFooter>
      )}

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={toggleDeleteModal}
        onConfirm={handleDelete}
        selectedCount={Object.keys(selectedRowIds).length}
        itemName="đơn hàng"
      />
    </Card>
  )
}

export default OrdersList
