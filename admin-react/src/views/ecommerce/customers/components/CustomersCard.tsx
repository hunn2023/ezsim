import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row as TableRow,
  type SortingState,
  type Table as TableType,
  useReactTable,
} from '@tanstack/react-table'
import { Button, Card, CardFooter, CardHeader, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Badge } from 'react-bootstrap'
import { Link } from 'react-router'
import { useState } from 'react'
import { LuDownload, LuPlus, LuSearch } from 'react-icons/lu'
import { TbChevronDown, TbEdit, TbEye, TbTrash, TbCheck, TbLock } from 'react-icons/tb'

import DataTable from '@/components/table/DataTable'
import DeleteConfirmationModal from '@/components/table/DeleteConfirmationModal'
import TablePagination from '@/components/table/TablePagination'
import { customers, type CustomerType } from '../data'

const formatVND = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
}

const getStatusBadge = (status: CustomerType['status']) => {
  switch (status) {
    case 'active':
      return <Badge bg="success" className="bg-success-subtle text-success border border-success-subtle px-2 py-1 fs-xs rounded-pill shadow-sm d-inline-flex align-items-center"><TbCheck className="me-1" /> Đang hoạt động</Badge>
    case 'locked':
      return <Badge bg="danger" className="bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 fs-xs rounded-pill shadow-sm d-inline-flex align-items-center"><TbLock className="me-1" /> Tạm khóa</Badge>
    default:
      return <Badge bg="secondary" className="px-2 py-1 fs-xs rounded-pill">{status}</Badge>
  }
}

const columnHelper = createColumnHelper<CustomerType>()

const CustomersCard = () => {
  const columns = [
    {
      id: 'select',
      header: ({ table }: { table: TableType<CustomerType> }) => (
        <input
          type="checkbox"
          className="form-check-input form-check-input-light fs-14"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }: { row: TableRow<CustomerType> }) => (
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
    columnHelper.accessor('name', {
      header: 'Khách hàng',
      cell: ({ row }) => (
        <div className="d-flex align-items-center gap-3">
          <div className="avatar avatar-sm flex-shrink-0">
            <img src={row.original.avatar} alt="" height={38} width={38} className="img-fluid rounded-circle shadow-sm border border-light-subtle" />
          </div>
          <div>
            <h6 className="mb-0 fw-bold text-dark">
              <Link to={`/customers/${row.original.id}`} className="text-dark text-decoration-none">
                {row.original.name}
              </Link>
            </h6>
            <span className="text-muted fs-xs font-monospace">{row.original.id}</span>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('phone', {
      header: 'Số điện thoại',
      cell: ({ row }) => <span className="fw-semibold text-dark fs-sm">{row.original.phone}</span>,
    }),
    columnHelper.accessor('email', {
      header: 'Email liên hệ',
      cell: ({ row }) => <span className="text-muted fs-sm">{row.original.email}</span>,
    }),
    columnHelper.accessor('address.province', {
      header: 'Tỉnh / Thành',
      cell: ({ row }) => (
        <div className="d-flex align-items-center fs-sm text-dark fw-medium">
          <img src={row.original.countryFlag} alt="" className="rounded-circle me-2 shadow-sm border" height={16} width={16} />
          {row.original.address.province}
        </div>
      ),
    }),
    columnHelper.accessor('joined.date', {
      header: 'Ngày gia nhập',
      cell: ({ row }) => (
        <div className="fs-sm text-dark fw-medium">
          {row.original.joined.date} <small className="text-muted ms-1">{row.original.joined.time}</small>
        </div>
      ),
    }),
    columnHelper.accessor('orders', {
      header: 'Số đơn',
      cell: ({ row }) => <span className="badge bg-primary-subtle text-primary px-2 py-1 fs-xs fw-bold rounded-pill">{row.original.orders} đơn</span>,
    }),
    columnHelper.accessor('totalSpends', {
      header: 'Tổng chi tiêu',
      cell: ({ row }) => <span className="fw-black text-danger fs-sm">{formatVND(row.original.totalSpends)}</span>,
    }),
    columnHelper.accessor('status', {
      header: 'Trạng thái',
      cell: ({ row }) => getStatusBadge(row.original.status),
    }),
    {
      header: 'Thao tác',
      id: 'actions',
      cell: ({ row }: { row: TableRow<CustomerType> }) => (
        <div className="d-flex gap-1">
          <Link to={`/customers/${row.original.id}`}>
            <Button variant="light" size="sm" className="btn-icon rounded-circle shadow-sm" title="Xem chi tiết">
              <TbEye className="fs-base text-primary" />
            </Button>
          </Link>
          <Button variant="light" size="sm" className="btn-icon rounded-circle shadow-sm ms-1" title="Chỉnh sửa">
            <TbEdit className="fs-base text-warning" />
          </Button>
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

  const [data, setData] = useState<CustomerType[]>(() => [...customers])
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 })

  const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>({})

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, pagination, rowSelection: selectedRowIds },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onRowSelectionChange: setSelectedRowIds,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = filterValue.toLowerCase()
      const matchName = row.original.name.toLowerCase().includes(search)
      const matchPhone = row.original.phone.includes(search)
      const matchEmail = row.original.email.toLowerCase().includes(search)
      const matchProv = row.original.address.province.toLowerCase().includes(search)
      return matchName || matchPhone || matchEmail || matchProv
    },
    enableColumnFilters: true,
    enableRowSelection: true,
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
      <CardHeader className="bg-white border-bottom p-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <h4 className="fw-bolder text-dark mb-0">Hồ Sơ Khách Hàng Viễn Thông</h4>
          {Object.keys(selectedRowIds).length > 0 && (
            <Button variant="danger" className="rounded-pill px-3 py-1 fs-sm fw-bold shadow-sm d-flex align-items-center" onClick={toggleDeleteModal}>
              <TbTrash className="fs-base me-1" /> Xóa ({Object.keys(selectedRowIds).length})
            </Button>
          )}
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <div className="app-search" style={{ minWidth: '260px' }}>
            <input
              type="search"
              className="form-control rounded-pill px-4 py-2 fs-sm bg-light border-0 shadow-none"
              placeholder="Tìm theo tên, SĐT hoặc Email..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <LuSearch className="app-search-icon text-muted ms-2" />
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

          <Dropdown align="end">
            <DropdownToggle variant="outline-secondary" className="rounded-pill px-3 py-1 fs-sm fw-bold shadow-sm d-flex align-items-center">
              <LuDownload className="me-1 fs-base" /> Xuất File <TbChevronDown className="align-middle ms-1" />
            </DropdownToggle>
            <DropdownMenu className="rounded-3 shadow border-0">
              <DropdownItem className="fs-sm py-2">Xuất file PDF</DropdownItem>
              <DropdownItem className="fs-sm py-2">Xuất file CSV</DropdownItem>
              <DropdownItem className="fs-sm py-2">Xuất file Excel</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Button variant="primary" className="rounded-pill px-4 py-2 fw-bold d-flex align-items-center shadow-sm">
            <LuPlus className="fs-base me-1" /> Thêm Khách Hàng
          </Button>
        </div>
      </CardHeader>
      <div className="p-0">
        <DataTable<CustomerType> table={table} emptyMessage="Không tìm thấy khách hàng nào phù hợp" />
      </div>

      {table.getRowModel().rows.length > 0 && (
        <CardFooter className="border-top bg-white p-4">
          <TablePagination
            totalItems={totalItems}
            start={start}
            end={end}
            itemsName="khách hàng"
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
        itemName="khách hàng"
      />
    </Card>
  )
}

export default CustomersCard
