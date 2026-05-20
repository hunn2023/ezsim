import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Button, Card, CardHeader, Col, Row, Badge, Nav } from 'react-bootstrap'
import { Link } from 'react-router'
import { useState, useMemo } from 'react'
import { LuSearch, LuTag, LuFilter } from 'react-icons/lu'
import { TbEdit, TbEye, TbPlus, TbTrash, TbDeviceSim, TbCreditCard, TbGridDots } from 'react-icons/tb'

import { useTelecomProducts } from '../../../../hooks/useTelecomProducts'
import DataTable from '@/components/table/DataTable'
import DeleteConfirmationModal from '@/components/table/DeleteConfirmationModal'
import TablePagination from '@/components/table/TablePagination'
import { type SimProduct, type CardProduct } from '../../../../types/telecom'

const formatVND = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
}

const formatSimNumber = (num: string) => {
  if (num.length === 10) {
    return `${num.slice(0, 3)}.${num.slice(3, 6)}.${num.slice(6)}`
  }
  return num
}

const getCarrierBadgeClass = (carrier: string) => {
  switch (carrier) {
    case 'Viettel':
      return 'bg-danger text-white'
    case 'Vinaphone':
      return 'bg-primary text-white'
    case 'Mobifone':
      return 'bg-info text-white'
    case 'Wintel':
      return 'bg-warning text-dark'
    case 'Vietnamobile':
      return 'bg-success text-white'
    case 'iTel':
      return 'bg-secondary text-white'
    default:
      return 'bg-dark text-white'
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'available':
      return <Badge bg="success" className="px-2 py-1 fs-xs">Sẵn sàng</Badge>
    case 'reserved':
      return <Badge bg="warning" text="dark" className="px-2 py-1 fs-xs">Đang giữ số</Badge>
    case 'sold':
      return <Badge bg="secondary" className="px-2 py-1 fs-xs">Đã bán</Badge>
    case 'locked':
      return <Badge bg="danger" className="px-2 py-1 fs-xs">Tạm khóa</Badge>
    case 'out_of_stock':
      return <Badge bg="danger" className="px-2 py-1 fs-xs">Hết kho</Badge>
    default:
      return <Badge bg="light" text="dark">{status}</Badge>
  }
}

const ProductsListing = () => {
  const { simProducts, cardProducts, deleteProduct } = useTelecomProducts()
  const [activeTab, setActiveTab] = useState<'sim' | 'card'>('sim')

  // Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCarrier, setSelectedCarrier] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [simPagination, setSimPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [cardPagination, setCardPagination] = useState({ pageIndex: 0, pageSize: 10 })

  // Modal delete state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteProduct(deletingId)
      setDeletingId(null)
      setShowDeleteModal(false)
    }
  }

  // --- SIM DATA & COLUMNS ---
  const filteredSims = useMemo(() => {
    return simProducts.filter((sim) => {
      const matchSearch = sim.simNumber.includes(searchQuery) || sim.dataPlan.toLowerCase().includes(searchQuery.toLowerCase())
      const matchCarrier = selectedCarrier === 'All' || sim.carrier === selectedCarrier
      const matchCategory = selectedCategory === 'All' || sim.category === selectedCategory
      const matchStatus = selectedStatus === 'All' || sim.status === selectedStatus
      return matchSearch && matchCarrier && matchCategory && matchStatus
    })
  }, [simProducts, searchQuery, selectedCarrier, selectedCategory, selectedStatus])

  const simColumns: ColumnDef<SimProduct, any>[] = useMemo(() => [
    {
      accessorKey: 'simNumber',
      header: 'Số SIM',
      cell: ({ row }) => (
        <div className="d-flex align-items-center">
          <span className={`badge me-2 fs-xs ${getCarrierBadgeClass(row.original.carrier)}`}>
            {row.original.carrier}
          </span>
          <div>
            <Link to={`/products/${row.original.id}`} className="text-dark fw-bold fs-base text-decoration-none">
              {formatSimNumber(row.original.simNumber)}
            </Link>
            <div className="text-muted fs-xxs mt-0">
              Điểm: {row.original.attributes?.totalPoints ?? '?'} | Mệnh {row.original.attributes?.element ?? '?'}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Phân loại',
      cell: ({ row }) => <span className="fw-medium text-secondary">{row.original.category}</span>,
    },
    {
      accessorKey: 'format',
      header: 'Định dạng',
      cell: ({ row }) => (
        <Badge bg={row.original.format === 'eSIM' ? 'success' : 'primary'} className="fs-xs px-2 py-1">
          {row.original.format}
        </Badge>
      ),
    },
    {
      accessorKey: 'dataPlan',
      header: 'Gói cước đi kèm',
      cell: ({ row }) => (
        <div className="text-truncate max-w-250" title={row.original.dataPlan}>
          <span className="fw-semibold text-dark">{row.original.dataPlan.split('-')[0]}</span>
          <span className="text-muted fs-xs ms-1">{row.original.dataPlan.split('-').slice(1).join('-')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Giá bán',
      cell: ({ row }) => <span className="fw-bold text-danger fs-base">{formatVND(row.original.price)}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }) => (
        <div className="d-flex gap-1">
          <Link to={`/products/${row.original.id}`}>
            <Button variant="light" size="sm" className="btn-icon rounded-circle shadow-sm" title="Xem chi tiết">
              <TbEye className="fs-base text-primary" />
            </Button>
          </Link>
          <Link to={`/products/edit/${row.original.id}`}>
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
              setDeletingId(row.original.id)
              setShowDeleteModal(true)
            }}>
            <TbTrash className="fs-base text-danger" />
          </Button>
        </div>
      ),
    },
  ], [])

  const simTable = useReactTable({
    data: filteredSims,
    columns: simColumns,
    state: { pagination: simPagination },
    onPaginationChange: setSimPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // --- CARD DATA & COLUMNS ---
  const filteredCards = useMemo(() => {
    return cardProducts.filter((card) => {
      const matchSearch = card.faceValue.toString().includes(searchQuery) || card.carrier.toLowerCase().includes(searchQuery.toLowerCase())
      const matchCarrier = selectedCarrier === 'All' || card.carrier === selectedCarrier
      const matchStatus = selectedStatus === 'All' || card.status === selectedStatus
      return matchSearch && matchCarrier && matchStatus
    })
  }, [cardProducts, searchQuery, selectedCarrier, selectedStatus])

  const cardColumns: ColumnDef<CardProduct, any>[] = useMemo(() => [
    {
      accessorKey: 'carrier',
      header: 'Nhà mạng',
      cell: ({ row }) => (
        <div className="d-flex align-items-center">
          <span className={`badge me-2 fs-xs ${getCarrierBadgeClass(row.original.carrier)}`}>
            {row.original.carrier}
          </span>
          <span className="fw-bold text-dark">{row.original.carrier} Top-up</span>
        </div>
      ),
    },
    {
      accessorKey: 'faceValue',
      header: 'Mệnh giá thẻ',
      cell: ({ row }) => <span className="fw-bolder text-dark fs-base">{formatVND(row.original.faceValue)}</span>,
    },
    {
      accessorKey: 'cardType',
      header: 'Loại thẻ',
      cell: ({ row }) => (
        <Badge bg={row.original.cardType === 'data' ? 'info' : 'primary'} className="fs-xs px-2 py-1">
          {row.original.cardType === 'data' ? 'Thẻ Data 3G/4G' : 'Thẻ nạp thoại'}
        </Badge>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Giá bán ra',
      cell: ({ row }) => (
        <div>
          <span className="fw-bold text-danger fs-base">{formatVND(row.original.price)}</span>
          <Badge bg="success" className="ms-2 fs-xxs">-{row.original.discountRate}%</Badge>
        </div>
      ),
    },
    {
      accessorKey: 'stockCount',
      header: 'Kho hàng',
      cell: ({ row }) => (
        <span className={`fw-medium ${row.original.stockCount < 500 ? 'text-warning' : 'text-success'}`}>
          {row.original.stockCount.toLocaleString()} mã thẻ
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }) => (
        <div className="d-flex gap-1">
          <Link to={`/products/${row.original.id}`}>
            <Button variant="light" size="sm" className="btn-icon rounded-circle shadow-sm" title="Xem chi tiết">
              <TbEye className="fs-base text-primary" />
            </Button>
          </Link>
          <Link to={`/products/edit/${row.original.id}`}>
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
              setDeletingId(row.original.id)
              setShowDeleteModal(true)
            }}>
            <TbTrash className="fs-base text-danger" />
          </Button>
        </div>
      ),
    },
  ], [])

  const cardTable = useReactTable({
    data: filteredCards,
    columns: cardColumns,
    state: { pagination: cardPagination },
    onPaginationChange: setCardPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const currentTotal = activeTab === 'sim' ? filteredSims.length : filteredCards.length
  const pageIndex = activeTab === 'sim' ? simPagination.pageIndex : cardPagination.pageIndex
  const pageSize = activeTab === 'sim' ? simPagination.pageSize : cardPagination.pageSize
  const start = pageIndex * pageSize + 1
  const end = Math.min(start + pageSize - 1, currentTotal)

  const handlePageSizeChange = (newSize: number) => {
    if (activeTab === 'sim') {
      simTable.setPageSize(newSize)
    } else {
      cardTable.setPageSize(newSize)
    }
  }

  const handlePageIndexChange = (newIndex: number) => {
    if (activeTab === 'sim') {
      simTable.setPageIndex(newIndex)
    } else {
      cardTable.setPageIndex(newIndex)
    }
  }

  return (
    <Row>
      <Col xs={12}>
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
          <CardHeader className="bg-white border-bottom p-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <Nav variant="pills" className="bg-light p-1 rounded-pill gap-1 shadow-sm">
                <Nav.Item>
                  <Nav.Link
                    className={`rounded-pill px-4 fw-semibold py-2 fs-sm d-flex align-items-center ${activeTab === 'sim' ? 'bg-primary text-white shadow-sm' : 'text-dark'}`}
                    onClick={() => {
                      setActiveTab('sim')
                    }}>
                    <TbDeviceSim className="me-2 fs-base" /> Kho SIM Di Động ({simProducts.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    className={`rounded-pill px-4 fw-semibold py-2 fs-sm d-flex align-items-center ${activeTab === 'card' ? 'bg-primary text-white shadow-sm' : 'text-dark'}`}
                    onClick={() => {
                      setActiveTab('card')
                    }}>
                    <TbCreditCard className="me-2 fs-base" /> Kho Thẻ Cào & Data ({cardProducts.length})
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <div className="d-flex align-items-center gap-2">
                <Link to="/add-product">
                  <Button variant="danger" className="rounded-pill px-4 py-2 fw-bold d-flex align-items-center shadow-sm">
                    <TbPlus className="fs-base me-2" /> Thêm Sản Phẩm Mới
                  </Button>
                </Link>
              </div>
            </div>

            <div className="d-flex flex-wrap align-items-center gap-3 mt-4 pt-2 border-top">
              <div className="app-search flex-grow-1" style={{ minWidth: '260px' }}>
                <input
                  type="search"
                  className="form-control rounded-pill px-4 py-2 fs-sm bg-light border-0 shadow-none"
                  placeholder={activeTab === 'sim' ? 'Tìm số SIM (ví dụ: 888 hoặc 098)...' : 'Tìm mệnh giá hoặc nhà mạng...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <LuSearch className="app-search-icon text-muted ms-2" />
              </div>

              <div className="d-flex align-items-center gap-2 flex-wrap">
                <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border">
                  <LuTag className="text-muted me-2 fs-sm" />
                  <select
                    className="form-select form-select-sm bg-transparent border-0 shadow-none fw-medium text-dark"
                    value={selectedCarrier}
                    onChange={(e) => setSelectedCarrier(e.target.value)}>
                    <option value="All">Tất cả nhà mạng</option>
                    <option value="Viettel">Viettel</option>
                    <option value="Vinaphone">Vinaphone</option>
                    <option value="Mobifone">Mobifone</option>
                    <option value="Vietnamobile">Vietnamobile</option>
                    <option value="Wintel">Wintel</option>
                    <option value="iTel">iTel</option>
                    {activeTab === 'card' && (
                      <>
                        <option value="Garena">Garena</option>
                        <option value="Zing">Zing</option>
                      </>
                    )}
                  </select>
                </div>

                {activeTab === 'sim' && (
                  <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border">
                    <LuFilter className="text-muted me-2 fs-sm" />
                    <select
                      className="form-select form-select-sm bg-transparent border-0 shadow-none fw-medium text-dark"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}>
                      <option value="All">Tất cả phân loại</option>
                      <option value="Số đẹp">SIM Số đẹp</option>
                      <option value="Data 4G/5G">SIM Data 4G/5G</option>
                      <option value="Du lịch">SIM Du lịch</option>
                    </select>
                  </div>
                )}

                <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border">
                  <span className="text-muted fs-xs me-2">Trạng thái:</span>
                  <select
                    className="form-select form-select-sm bg-transparent border-0 shadow-none fw-medium text-dark"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}>
                    <option value="All">Tất cả</option>
                    <option value="available">Sẵn sàng</option>
                    {activeTab === 'sim' && <option value="reserved">Đang giữ số</option>}
                    {activeTab === 'sim' && <option value="sold">Đã bán</option>}
                    {activeTab === 'card' && <option value="out_of_stock">Hết kho</option>}
                  </select>
                </div>

                <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border">
                  <span className="text-muted fs-xs me-2">Hiển thị:</span>
                  <select
                    className="form-select form-select-sm bg-transparent border-0 shadow-none fw-bold text-dark"
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}>
                    {[5, 10, 15, 25].map((size) => (
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
            {activeTab === 'sim' ? (
              <DataTable table={simTable} emptyMessage="Không tìm thấy số SIM nào phù hợp" />
            ) : (
              <DataTable table={cardTable} emptyMessage="Không tìm thấy mã thẻ nào phù hợp" />
            )}
          </div>

          {currentTotal > 0 && (
            <div className="p-4 border-top bg-white">
              <TablePagination
                totalItems={currentTotal}
                start={start}
                end={end}
                itemsName={activeTab === 'sim' ? 'SIM' : 'Mã thẻ'}
                showInfo
                previousPage={activeTab === 'sim' ? simTable.previousPage : cardTable.previousPage}
                canPreviousPage={activeTab === 'sim' ? simTable.getCanPreviousPage() : cardTable.getCanPreviousPage()}
                pageCount={activeTab === 'sim' ? simTable.getPageCount() : cardTable.getPageCount()}
                pageIndex={pageIndex}
                setPageIndex={handlePageIndexChange}
                nextPage={activeTab === 'sim' ? simTable.nextPage : cardTable.nextPage}
                canNextPage={activeTab === 'sim' ? simTable.getCanNextPage() : cardTable.getCanNextPage()}
              />
            </div>
          )}

          <DeleteConfirmationModal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteConfirm}
            selectedCount={1}
            itemName={activeTab === 'sim' ? 'số SIM này' : 'mã thẻ này'}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default ProductsListing
