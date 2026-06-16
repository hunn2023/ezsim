import { useMemo, useState } from 'react'
import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Button, Form, Modal, Badge } from 'react-bootstrap'
import { TbPlus, TbEdit, TbTrash } from 'react-icons/tb'
import { LuSearch } from 'react-icons/lu'
import { useCountriesRegions } from '../../../../hooks/useCountriesRegions'
import { type Region } from '../../../../types/telecom'
import DataTable from '@/components/table/DataTable'
import DeleteConfirmationModal from '@/components/table/DeleteConfirmationModal'
import TablePagination from '@/components/table/TablePagination'

const RegionsTable = () => {
  const { regions, addRegion, updateRegion, deleteRegion } = useCountriesRegions()

  // Table states
  const [searchQuery, setSearchQuery] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingRegion, setEditingRegion] = useState<Region | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [displayOrder, setDisplayOrder] = useState(1)
  const [status, setStatus] = useState(true)
  const [isPublished, setIsPublished] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)

  const handleOpenForm = (region: Region | null = null) => {
    if (region) {
      setEditingRegion(region)
      setName(region.name)
      setCode(region.code)
      setDescription(region.description || '')
      setDisplayOrder(region.displayOrder)
      setStatus(region.status)
      setIsPublished(region.isPublished)
      setIsFeatured(region.isFeatured)
    } else {
      setEditingRegion(null)
      setName('')
      setCode('')
      setDescription('')
      setDisplayOrder(regions.length + 1)
      setStatus(true)
      setIsPublished(true)
      setIsFeatured(false)
    }
    setShowFormModal(true)
  }

  const handleSaveRegion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !code) return

    const data = {
      name,
      code: code.toLowerCase(),
      description,
      displayOrder: Number(displayOrder),
      status,
      isPublished,
      isFeatured
    }

    if (editingRegion) {
      updateRegion(editingRegion.id, data)
    } else {
      addRegion(data)
    }
    setShowFormModal(false)
  }

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteRegion(deletingId)
      setDeletingId(null)
      setShowDeleteModal(false)
    }
  }

  // Filters
  const filteredRegions = useMemo(() => {
    return regions.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [regions, searchQuery])

  const columns: ColumnDef<Region, any>[] = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Tên vùng',
      cell: ({ row }) => (
        <div>
          <span className="fw-bold text-dark fs-base">{row.original.name}</span>
          {row.original.isFeatured && (
            <Badge bg="danger" className="ms-2 fs-xxs">Nổi bật</Badge>
          )}
        </div>
      )
    },
    {
      accessorKey: 'code',
      header: 'Mã vùng',
      cell: ({ row }) => <code className="bg-light text-primary px-2 py-1 rounded fs-xs fw-semibold">{row.original.code}</code>
    },
    {
      accessorKey: 'description',
      header: 'Mô tả',
      cell: ({ row }) => <span className="text-muted fs-sm">{row.original.description || '-'}</span>
    },
    {
      accessorKey: 'displayOrder',
      header: 'Thứ tự hiển thị',
      cell: ({ row }) => <span className="fw-semibold text-secondary">{row.original.displayOrder}</span>
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <Badge bg={row.original.status ? 'success' : 'secondary'} className="fs-xs px-2 py-1">
          {row.original.status ? 'Hoạt động' : 'Tạm dừng'}
        </Badge>
      )
    },
    {
      accessorKey: 'isPublished',
      header: 'Xuất bản',
      cell: ({ row }) => (
        <Badge bg={row.original.isPublished ? 'info' : 'warning'} className="fs-xs px-2 py-1">
          {row.original.isPublished ? 'Đã đăng' : 'Bản nháp'}
        </Badge>
      )
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }) => (
        <div className="d-flex gap-1">
          <Button 
            variant="light" 
            size="sm" 
            className="btn-icon rounded-circle shadow-sm" 
            title="Chỉnh sửa"
            onClick={() => handleOpenForm(row.original)}>
            <TbEdit className="fs-base text-warning" />
          </Button>
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
      )
    }
  ], [regions])

  const table = useReactTable({
    data: filteredRegions,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const currentTotal = filteredRegions.length
  const pageIndex = pagination.pageIndex
  const pageSize = pagination.pageSize
  const start = pageIndex * pageSize + 1
  const end = Math.min(start + pageSize - 1, currentTotal)

  return (
    <div>
      <div className="p-4 border-bottom bg-white d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div className="app-search flex-grow-1" style={{ maxWidth: '350px' }}>
          <Form.Control
            type="search"
            className="rounded-pill px-4 py-2 fs-sm bg-light border-0 shadow-none"
            placeholder="Tìm vùng du lịch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <LuSearch className="app-search-icon text-muted ms-2" />
        </div>
        <Button variant="danger" className="rounded-pill px-4 py-2 fw-bold d-flex align-items-center shadow-sm" onClick={() => handleOpenForm(null)}>
          <TbPlus className="fs-base me-2" /> Thêm Vùng Du Lịch
        </Button>
      </div>

      <DataTable table={table} emptyMessage="Không tìm thấy vùng du lịch nào" />

      {currentTotal > 0 && (
        <div className="p-4 border-top bg-white">
          <TablePagination
            totalItems={currentTotal}
            start={start}
            end={end}
            itemsName="Vùng"
            showInfo
            previousPage={table.previousPage}
            canPreviousPage={table.getCanPreviousPage()}
            pageCount={table.getPageCount()}
            pageIndex={pageIndex}
            setPageIndex={(newIdx) => table.setPageIndex(newIdx)}
            nextPage={table.nextPage}
            canNextPage={table.getCanNextPage()}
          />
        </div>
      )}

      {/* Form Modal */}
      <Modal show={showFormModal} onHide={() => setShowFormModal(false)} centered className="rounded-4">
        <Form onSubmit={handleSaveRegion}>
          <Modal.Header closeButton className="border-0 px-4 pt-4">
            <Modal.Title className="fw-bold fs-4">
              {editingRegion ? 'Chỉnh sửa vùng du lịch' : 'Thêm vùng du lịch mới'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-4">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold fs-sm">Tên vùng du lịch <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Ví dụ: Đông Nam Á (ASEAN)"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="py-2"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold fs-sm">Mã vùng <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Ví dụ: asean"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="py-2"
              />
              <Form.Text className="text-muted fs-xs">Dùng làm mã định danh, thường viết thường không dấu cách (vd: europe, east-asia).</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold fs-sm">Mô tả ngắn</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Mô tả các quốc gia hoặc đặc trưng gói cước..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold fs-sm">Thứ tự hiển thị</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="py-2"
              />
            </Form.Group>
            <div className="d-flex flex-wrap gap-4 py-2 border-top border-bottom mb-3">
              <Form.Check
                type="switch"
                id="status-switch"
                label="Kích hoạt hoạt động"
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
                className="fw-medium fs-sm"
              />
              <Form.Check
                type="switch"
                id="publish-switch"
                label="Đăng xuất bản"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="fw-medium fs-sm"
              />
              <Form.Check
                type="switch"
                id="featured-switch"
                label="Đưa vào mục nổi bật"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="fw-medium fs-sm"
              />
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 px-4 pb-4">
            <Button variant="light" className="rounded-pill px-4" onClick={() => setShowFormModal(false)}>
              Hủy
            </Button>
            <Button variant="danger" className="rounded-pill px-4" type="submit">
              Lưu thay đổi
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        selectedCount={1}
        itemName="vùng du lịch này"
      />
    </div>
  )
}

export default RegionsTable
