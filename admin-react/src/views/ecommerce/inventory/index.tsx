import { useState, useMemo } from 'react'
import { Container, Nav, Card, CardHeader, Button, Modal, Form, Row, Col, Badge } from 'react-bootstrap'
import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { TbDeviceSim, TbCreditCard, TbHistory, TbPlus, TbTrash, TbCheck, TbAlertCircle } from 'react-icons/tb'
import { LuSearch, LuFilter } from 'react-icons/lu'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useInventory } from '../../../hooks/useInventory'
import { useTelecomProducts } from '../../../hooks/useTelecomProducts'
import { type InventoryItem, type InventoryTransaction, type InventoryItemStatus } from '../../../types/telecom'
import DataTable from '@/components/table/DataTable'
import TablePagination from '@/components/table/TablePagination'
import DeleteConfirmationModal from '@/components/table/DeleteConfirmationModal'

const formatVND = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
}

const Page = () => {
  const { inventoryItems, transactions, bulkImport, updateItemStatus, deleteItem } = useInventory()
  const { simProducts, cardProducts } = useTelecomProducts()

  const [activeTab, setActiveTab] = useState<'sim' | 'card' | 'logs'>('sim')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [productFilter, setProductFilter] = useState('All')

  // Table Pagination states
  const [simPagination, setSimPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [cardPagination, setCardPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [logsPagination, setLogsPagination] = useState({ pageIndex: 0, pageSize: 10 })

  // Modals state
  const [showImportModal, setShowImportModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Form Bulk Import state
  const [importType, setImportType] = useState<'sim' | 'card'>('sim')
  const [selectedProductId, setSelectedProductId] = useState('')
  const [rawText, setRawText] = useState('')
  const [importNote, setImportNote] = useState('')
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccessCount, setImportSuccessCount] = useState<number | null>(null)

  // Filters for SIM Items
  const filteredSimItems = useMemo(() => {
    return inventoryItems.filter(item => {
      if (item.type !== 'sim') return false
      const matchSearch = item.serialNumber.includes(searchQuery) || item.productName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchStatus = statusFilter === 'All' || item.status === statusFilter
      const matchProduct = productFilter === 'All' || item.productVariantId === productFilter
      return matchSearch && matchStatus && matchProduct
    })
  }, [inventoryItems, searchQuery, statusFilter, productFilter])

  // Filters for Card Items
  const filteredCardItems = useMemo(() => {
    return inventoryItems.filter(item => {
      if (item.type !== 'card') return false
      const matchSearch = item.serialNumber.includes(searchQuery) || 
                          (item.pinCode && item.pinCode.includes(searchQuery)) || 
                          item.productName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchStatus = statusFilter === 'All' || item.status === statusFilter
      const matchProduct = productFilter === 'All' || item.productVariantId === productFilter
      return matchSearch && matchStatus && matchProduct
    })
  }, [inventoryItems, searchQuery, statusFilter, productFilter])

  // Filters for Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      return tx.productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
             tx.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
             tx.inventoryItemId.includes(searchQuery)
    })
  }, [transactions, searchQuery])

  // --- COLUMNS DEFINITIONS ---
  const simColumns: ColumnDef<InventoryItem, any>[] = useMemo(() => [
    {
      accessorKey: 'productName',
      header: 'Tên SIM / Số SIM',
      cell: ({ row }) => (
        <div>
          <span className="fw-bold text-dark fs-base">{row.original.productName}</span>
          <div className="text-muted fs-xxs">ID: {row.original.productVariantId}</div>
        </div>
      )
    },
    {
      accessorKey: 'serialNumber',
      header: 'Số Serial phôi SIM (ICCID)',
      cell: ({ row }) => <code className="text-primary fw-semibold fs-sm">{row.original.serialNumber}</code>
    },
    {
      accessorKey: 'importedAt',
      header: 'Ngày nhập kho',
      cell: ({ row }) => <span className="fs-sm">{new Date(row.original.importedAt).toLocaleDateString('vi-VN')}</span>
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <select
          className={`form-select form-select-xs d-inline-block w-auto py-0 px-2 fw-semibold border-0 rounded fs-xs bg-light`}
          value={row.original.status}
          onChange={(e) => updateItemStatus(row.original.id, e.target.value as InventoryItemStatus)}>
          <option value="available">Sẵn có</option>
          <option value="sold">Đã bán</option>
          <option value="locked">Khóa</option>
        </select>
      )
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }) => (
        <Button
          variant="light"
          size="sm"
          className="btn-icon rounded-circle shadow-sm"
          title="Xóa khỏi kho"
          onClick={() => {
            setDeletingId(row.original.id)
            setShowDeleteModal(true)
          }}>
          <TbTrash className="fs-base text-danger" />
        </Button>
      )
    }
  ], [inventoryItems, updateItemStatus])

  const cardColumns: ColumnDef<InventoryItem, any>[] = useMemo(() => [
    {
      accessorKey: 'productName',
      header: 'Loại thẻ nạp',
      cell: ({ row }) => (
        <div>
          <span className="fw-bold text-dark fs-base">{row.original.productName}</span>
          <div className="text-muted fs-xxs">ID: {row.original.productVariantId}</div>
        </div>
      )
    },
    {
      accessorKey: 'serialNumber',
      header: 'Số Serial',
      cell: ({ row }) => <code className="text-primary fw-semibold fs-sm">{row.original.serialNumber}</code>
    },
    {
      accessorKey: 'pinCode',
      header: 'Mã PIN thẻ cào',
      cell: ({ row }) => <code className="text-success fw-bold fs-sm">{row.original.pinCode || '-'}</code>
    },
    {
      accessorKey: 'expirationDate',
      header: 'Hạn sử dụng',
      cell: ({ row }) => (
        <span className="fs-sm text-secondary">
          {row.original.expirationDate ? new Date(row.original.expirationDate).toLocaleDateString('vi-VN') : 'Không giới hạn'}
        </span>
      )
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <select
          className={`form-select form-select-xs d-inline-block w-auto py-0 px-2 fw-semibold border-0 rounded fs-xs bg-light`}
          value={row.original.status}
          onChange={(e) => updateItemStatus(row.original.id, e.target.value as InventoryItemStatus)}>
          <option value="available">Sẵn có</option>
          <option value="sold">Đã bán</option>
          <option value="expired">Hết hạn</option>
          <option value="locked">Khóa</option>
        </select>
      )
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }) => (
        <Button
          variant="light"
          size="sm"
          className="btn-icon rounded-circle shadow-sm"
          title="Xóa khỏi kho"
          onClick={() => {
            setDeletingId(row.original.id)
            setShowDeleteModal(true)
          }}>
          <TbTrash className="fs-base text-danger" />
        </Button>
      )
    }
  ], [inventoryItems, updateItemStatus])

  const logsColumns: ColumnDef<InventoryTransaction, any>[] = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'Mã log',
      cell: ({ row }) => <span className="text-secondary fw-semibold fs-xs">{row.original.id}</span>
    },
    {
      accessorKey: 'productName',
      header: 'Sản phẩm',
      cell: ({ row }) => <span className="fw-semibold text-dark fs-sm">{row.original.productName}</span>
    },
    {
      accessorKey: 'transactionType',
      header: 'Loại biến động',
      cell: ({ row }) => {
        const type = row.original.transactionType
        return (
          <Badge bg={type === 'import' ? 'success' : type === 'export' ? 'info' : 'warning'} className="fs-xs px-2 py-1">
            {type === 'import' ? 'Nhập kho' : type === 'export' ? 'Xuất kho' : 'Điều chỉnh'}
          </Badge>
        )
      }
    },
    {
      accessorKey: 'note',
      header: 'Nội dung chi tiết',
      cell: ({ row }) => <span className="text-muted fs-sm">{row.original.note}</span>
    },
    {
      accessorKey: 'createdAt',
      header: 'Thời gian thực hiện',
      cell: ({ row }) => <span className="fs-sm">{new Date(row.original.createdAt).toLocaleString('vi-VN')}</span>
    }
  ], [transactions])

  // React Tables
  const simTable = useReactTable({
    data: filteredSimItems,
    columns: simColumns,
    state: { pagination: simPagination },
    onPaginationChange: setSimPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const cardTable = useReactTable({
    data: filteredCardItems,
    columns: cardColumns,
    state: { pagination: cardPagination },
    onPaginationChange: setCardPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const logsTable = useReactTable({
    data: filteredTransactions,
    columns: logsColumns,
    state: { pagination: logsPagination },
    onPaginationChange: setLogsPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  // Table pagination calculations
  const currentTotal = activeTab === 'sim' ? filteredSimItems.length : activeTab === 'card' ? filteredCardItems.length : filteredTransactions.length
  const pageIndex = activeTab === 'sim' ? simPagination.pageIndex : activeTab === 'card' ? cardPagination.pageIndex : logsPagination.pageIndex
  const pageSize = activeTab === 'sim' ? simPagination.pageSize : activeTab === 'card' ? cardPagination.pageSize : logsPagination.pageSize
  const start = pageIndex * pageSize + 1
  const end = Math.min(start + pageSize - 1, currentTotal)

  const handlePageSizeChange = (newSize: number) => {
    if (activeTab === 'sim') simTable.setPageSize(newSize)
    else if (activeTab === 'card') cardTable.setPageSize(newSize)
    else logsTable.setPageSize(newSize)
  }

  const handlePageIndexChange = (newIdx: number) => {
    if (activeTab === 'sim') simTable.setPageIndex(newIdx)
    else if (activeTab === 'card') cardTable.setPageIndex(newIdx)
    else logsTable.setPageIndex(newIdx)
  }

  // --- ACTIONS HANDLERS ---
  const handleOpenImport = () => {
    setImportType('sim')
    setSelectedProductId(simProducts[0]?.id || '')
    setRawText('')
    setImportNote('')
    setImportError(null)
    setImportSuccessCount(null)
    setShowImportModal(true)
  }

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setImportError(null)
    setImportSuccessCount(null)

    if (!selectedProductId || !rawText.trim()) {
      setImportError('Vui lòng điền đầy đủ các thông tin cần thiết!')
      return
    }

    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean)
    const itemsToImport: { serialNumber: string; pinCode?: string; expirationDate?: string }[] = []

    let targetProduct: any = null
    if (importType === 'sim') {
      targetProduct = simProducts.find(p => p.id === selectedProductId)
      if (!targetProduct) return

      for (const line of lines) {
        // Just serial ICCID
        if (line.length < 10) {
          setImportError(`ICCID / Serial: "${line}" không hợp lệ. Vui lòng kiểm tra lại!`)
          return
        }
        itemsToImport.push({ serialNumber: line })
      }
    } else {
      targetProduct = cardProducts.find(p => p.id === selectedProductId)
      if (!targetProduct) return

      for (const line of lines) {
        // Expecting: Serial | PIN or Serial | PIN | Hạn sử dụng
        const parts = line.split('|').map(p => p.trim())
        if (parts.length < 2) {
          setImportError(`Dòng: "${line}" không đúng định dạng. Phải chứa ít nhất "Serial | PIN".`)
          return
        }
        itemsToImport.push({
          serialNumber: parts[0],
          pinCode: parts[1],
          expirationDate: parts[2] ? new Date(parts[2]).toISOString() : undefined
        })
      }
    }

    const count = bulkImport(
      selectedProductId,
      importType === 'sim' ? `${targetProduct.simNumber} (${targetProduct.carrier})` : `Thẻ cào ${targetProduct.carrier} ${formatVND(targetProduct.faceValue)}`,
      importType,
      targetProduct.carrier,
      itemsToImport,
      importNote || `Import ${itemsToImport.length} sản phẩm bằng tay`
    )

    setImportSuccessCount(count)
    setRawText('')
    setImportNote('')
    setTimeout(() => {
      setShowImportModal(false)
    }, 1500)
  }

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteItem(deletingId)
      setDeletingId(null)
      setShowDeleteModal(false)
    }
  }

  // Active products to populate select in bulk import
  const currentImportProducts = useMemo(() => {
    return importType === 'sim' ? simProducts : cardProducts
  }, [importType, simProducts, cardProducts])

  // Handle product type changes inside import modal
  const handleImportTypeChange = (type: 'sim' | 'card') => {
    setImportType(type)
    const list = type === 'sim' ? simProducts : cardProducts
    setSelectedProductId(list[0]?.id || '')
  }

  return (
    <Container fluid className="py-3">
      <PageBreadcrumb title="Quản lý chi tiết kho (Serial/PIN)" subtitle="E-commerce Stock" />

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <CardHeader className="bg-white border-bottom p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <Nav variant="pills" className="bg-light p-1 rounded-pill gap-1 shadow-sm">
              <Nav.Item>
                <Nav.Link
                  className={`rounded-pill px-4 fw-semibold py-2 fs-sm d-flex align-items-center ${activeTab === 'sim' ? 'bg-primary text-white shadow-sm' : 'text-dark'}`}
                  onClick={() => { setActiveTab('sim'); setProductFilter('All'); setStatusFilter('All'); }}>
                  <TbDeviceSim className="me-2 fs-base" /> Kho phôi SIM / eSIM
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  className={`rounded-pill px-4 fw-semibold py-2 fs-sm d-flex align-items-center ${activeTab === 'card' ? 'bg-primary text-white shadow-sm' : 'text-dark'}`}
                  onClick={() => { setActiveTab('card'); setProductFilter('All'); setStatusFilter('All'); }}>
                  <TbCreditCard className="me-2 fs-base" /> Kho Serial & PIN Thẻ
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  className={`rounded-pill px-4 fw-semibold py-2 fs-sm d-flex align-items-center ${activeTab === 'logs' ? 'bg-primary text-white shadow-sm' : 'text-dark'}`}
                  onClick={() => { setActiveTab('logs'); }}>
                  <TbHistory className="me-2 fs-base" /> Nhật ký xuất nhập kho
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <div className="d-flex align-items-center gap-2">
              <Button variant="danger" className="rounded-pill px-4 py-2 fw-bold d-flex align-items-center shadow-sm" onClick={handleOpenImport}>
                <TbPlus className="fs-base me-2" /> Nhập kho hàng loạt
              </Button>
            </div>
          </div>

          {activeTab !== 'logs' && (
            <div className="d-flex flex-wrap align-items-center gap-3 mt-4 pt-2 border-top">
              <div className="app-search flex-grow-1" style={{ minWidth: '260px', maxWidth: '350px' }}>
                <input
                  type="search"
                  className="form-control rounded-pill px-4 py-2 fs-sm bg-light border-0 shadow-none"
                  placeholder={activeTab === 'sim' ? 'Tìm số SIM hoặc ICCID/Serial...' : 'Tìm serial, mã PIN hoặc tên thẻ...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <LuSearch className="app-search-icon text-muted ms-2" />
              </div>

              <div className="d-flex align-items-center gap-2 flex-wrap">
                <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border">
                  <span className="text-muted fs-xs me-2">Theo sản phẩm:</span>
                  <select
                    className="form-select form-select-sm bg-transparent border-0 shadow-none fw-medium text-dark"
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}>
                    <option value="All">Tất cả sản phẩm</option>
                    {activeTab === 'sim' ? (
                      simProducts.map(p => (
                        <option key={p.id} value={p.id}>{p.simNumber} ({p.carrier})</option>
                      ))
                    ) : (
                      cardProducts.map(p => (
                        <option key={p.id} value={p.id}>{p.carrier} {formatVND(p.faceValue)}</option>
                      ))
                    )}
                  </select>
                </div>

                <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border">
                  <LuFilter className="text-muted me-2 fs-sm" />
                  <select
                    className="form-select form-select-sm bg-transparent border-0 shadow-none fw-medium text-dark"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="All">Tất cả trạng thái</option>
                    <option value="available">Sẵn có</option>
                    <option value="sold">Đã bán</option>
                    {activeTab === 'card' && <option value="expired">Hết hạn</option>}
                    <option value="locked">Tạm khóa</option>
                  </select>
                </div>

                <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border">
                  <span className="text-muted fs-xs me-2">Hiển thị:</span>
                  <select
                    className="form-select form-select-sm bg-transparent border-0 shadow-none fw-bold text-dark"
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}>
                    {[5, 10, 15, 25].map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="d-flex flex-wrap align-items-center gap-3 mt-4 pt-2 border-top">
              <div className="app-search flex-grow-1" style={{ minWidth: '260px', maxWidth: '350px' }}>
                <input
                  type="search"
                  className="form-control rounded-pill px-4 py-2 fs-sm bg-light border-0 shadow-none"
                  placeholder="Tìm nội dung log hoặc mã sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <LuSearch className="app-search-icon text-muted ms-2" />
              </div>
              <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border">
                <span className="text-muted fs-xs me-2">Hiển thị:</span>
                <select
                  className="form-select form-select-sm bg-transparent border-0 shadow-none fw-bold text-dark"
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}>
                  {[5, 10, 15, 25].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </CardHeader>

        <div className="p-0">
          {activeTab === 'sim' ? (
            <DataTable table={simTable} emptyMessage="Không có SIM/eSIM nào trong kho khớp bộ lọc" />
          ) : activeTab === 'card' ? (
            <DataTable table={cardTable} emptyMessage="Không có mã thẻ cào nào trong kho khớp bộ lọc" />
          ) : (
            <DataTable table={logsTable} emptyMessage="Không tìm thấy nhật ký biến động kho nào" />
          )}
        </div>

        {currentTotal > 0 && (
          <div className="p-4 border-top bg-white">
            <TablePagination
              totalItems={currentTotal}
              start={start}
              end={end}
              itemsName={activeTab === 'sim' ? 'SIM' : activeTab === 'card' ? 'Mã thẻ' : 'Dòng nhật ký'}
              showInfo
              previousPage={activeTab === 'sim' ? simTable.previousPage : activeTab === 'card' ? cardTable.previousPage : logsTable.previousPage}
              canPreviousPage={activeTab === 'sim' ? simTable.getCanPreviousPage() : activeTab === 'card' ? cardTable.getCanPreviousPage() : logsTable.getCanPreviousPage()}
              pageCount={activeTab === 'sim' ? simTable.getPageCount() : activeTab === 'card' ? cardTable.getPageCount() : logsTable.getPageCount()}
              pageIndex={pageIndex}
              setPageIndex={handlePageIndexChange}
              nextPage={activeTab === 'sim' ? simTable.nextPage : activeTab === 'card' ? cardTable.nextPage : logsTable.nextPage}
              canNextPage={activeTab === 'sim' ? simTable.getCanNextPage() : activeTab === 'card' ? cardTable.getCanNextPage() : logsTable.getCanNextPage()}
            />
          </div>
        )}
      </Card>

      {/* Bulk Import Modal */}
      <Modal show={showImportModal} onHide={() => setShowImportModal(false)} centered size="lg" className="rounded-4">
        <Form onSubmit={handleImportSubmit}>
          <Modal.Header closeButton className="border-0 px-4 pt-4">
            <Modal.Title className="fw-bold fs-4">Nhập kho hàng loạt bằng tay (PIN & Serial)</Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-4">
            {importSuccessCount !== null && (
              <div className="alert alert-success d-flex align-items-center mb-3 py-2 fs-sm">
                <TbCheck className="me-2 fs-lg" /> Đã nhập thành công <strong>{importSuccessCount}</strong> sản phẩm vào kho hàng!
              </div>
            )}
            {importError && (
              <div className="alert alert-danger d-flex align-items-center mb-3 py-2 fs-sm">
                <TbAlertCircle className="me-2 fs-lg" /> {importError}
              </div>
            )}

            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="fw-semibold fs-sm">Loại sản phẩm kho</Form.Label>
                  <div className="d-flex gap-3 py-1">
                    <Form.Check
                      type="radio"
                      id="import-sim"
                      label="Kho SIM / eSIM"
                      checked={importType === 'sim'}
                      onChange={() => handleImportTypeChange('sim')}
                      className="fw-medium text-dark"
                    />
                    <Form.Check
                      type="radio"
                      id="import-card"
                      label="Kho thẻ cào/Data"
                      checked={importType === 'card'}
                      onChange={() => handleImportTypeChange('card')}
                      className="fw-medium text-dark"
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="fw-semibold fs-sm">Liên kết tới sản phẩm cụ thể *</Form.Label>
                  <Form.Select
                    required
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="py-2">
                    <option value="" disabled>-- Chọn sản phẩm trong kho --</option>
                    {currentImportProducts.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.type === 'sim' ? `${p.simNumber} [${p.carrier}]` : `${p.carrier} Mệnh giá ${formatVND(p.faceValue)}`}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-2">
                  <Form.Label className="fw-semibold fs-sm">
                    {importType === 'sim' ? 'Danh sách phôi SIM/ICCID (Mỗi số 1 dòng) *' : 'Danh sách Serial & PIN (Định dạng: Serial | PIN | Hạn dùng-yyyy-mm-dd) *'}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={8}
                    required
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder={
                      importType === 'sim' 
                        ? 'Ví dụ:\n8984040000001234567\n8984040000001234568\n8984040000001234569' 
                        : 'Ví dụ (Hạn sử dụng có thể bỏ trống):\n1000123456789 | 1234567890123 | 2028-12-31\n1000123456790 | 1234567890124 | 2028-12-31\n1000123456791 | 1234567890125'
                    }
                    className="font-monospace fs-sm"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-2">
                  <Form.Label className="fw-semibold fs-sm">Ghi chú cho phiên nhập kho này</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ví dụ: Nhập kho tháng 5 đại lý Viettel, lô hàng 100 chiếc..."
                    value={importNote}
                    onChange={(e) => setImportNote(e.target.value)}
                    className="py-2"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0 px-4 pb-4">
            <Button variant="light" className="rounded-pill px-4" onClick={() => setShowImportModal(false)}>
              Hủy
            </Button>
            <Button variant="danger" className="rounded-pill px-5 fw-bold" type="submit">
              Xác nhận nhập kho
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        selectedCount={1}
        itemName="mã kho này"
      />
    </Container>
  )
}

export default Page
