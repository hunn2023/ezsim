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
import { type Country } from '../../../../types/telecom'
import DataTable from '@/components/table/DataTable'
import DeleteConfirmationModal from '@/components/table/DeleteConfirmationModal'
import TablePagination from '@/components/table/TablePagination'

const CountriesTable = () => {
  const { regions, countries, addCountry, updateCountry, deleteCountry } = useCountriesRegions()

  // Table states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('All')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingCountry, setEditingCountry] = useState<Country | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [regionId, setRegionId] = useState('')
  const [code, setCode] = useState('')
  const [flagEmoji, setFlagEmoji] = useState('')
  const [status, setStatus] = useState(true)

  const regionMap = useMemo(() => {
    return new Map(regions.map(r => [r.id, r.name]))
  }, [regions])

  const handleOpenForm = (country: Country | null = null) => {
    if (country) {
      setEditingCountry(country)
      setName(country.name)
      setRegionId(country.regionId)
      setCode(country.code)
      setFlagEmoji(country.flagEmoji)
      setStatus(country.status)
    } else {
      setEditingCountry(null)
      setName('')
      setRegionId(regions[0]?.id || '')
      setCode('')
      setFlagEmoji('')
      setStatus(true)
    }
    setShowFormModal(true)
  }

  const handleSaveCountry = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !regionId || !code) return

    const data = {
      name,
      regionId,
      code: code.toUpperCase(),
      flagEmoji: flagEmoji || '🌐',
      status
    }

    if (editingCountry) {
      updateCountry(editingCountry.id, data)
    } else {
      addCountry(data)
    }
    setShowFormModal(false)
  }

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteCountry(deletingId)
      setDeletingId(null)
      setShowDeleteModal(false)
    }
  }

  // Filters
  const filteredCountries = useMemo(() => {
    return countries.filter(c => {
      const matchQuery = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.code.toLowerCase().includes(searchQuery.toLowerCase())
      const matchRegion = selectedRegionFilter === 'All' || c.regionId === selectedRegionFilter
      return matchQuery && matchRegion
    })
  }, [countries, searchQuery, selectedRegionFilter])

  const columns: ColumnDef<Country, any>[] = useMemo(() => [
    {
      accessorKey: 'flagEmoji',
      header: 'Quốc kỳ',
      cell: ({ row }) => (
        <span className="fs-3" style={{ lineHeight: 1 }}>{row.original.flagEmoji}</span>
      )
    },
    {
      accessorKey: 'name',
      header: 'Tên quốc gia',
      cell: ({ row }) => <span className="fw-bold text-dark fs-base">{row.original.name}</span>
    },
    {
      accessorKey: 'code',
      header: 'Mã ISO (2 ký tự)',
      cell: ({ row }) => <span className="fw-semibold text-secondary">{row.original.code}</span>
    },
    {
      accessorKey: 'regionId',
      header: 'Thuộc vùng du lịch',
      cell: ({ row }) => (
        <span className="fw-medium text-info">{regionMap.get(row.original.regionId) || 'Không xác định'}</span>
      )
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
  ], [countries, regionMap])

  const table = useReactTable({
    data: filteredCountries,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const currentTotal = filteredCountries.length
  const pageIndex = pagination.pageIndex
  const pageSize = pagination.pageSize
  const start = pageIndex * pageSize + 1
  const end = Math.min(start + pageSize - 1, currentTotal)

  return (
    <div>
      <div className="p-4 border-bottom bg-white d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div className="d-flex align-items-center gap-3 flex-grow-1" style={{ maxWidth: '600px' }}>
          <div className="app-search flex-grow-1" style={{ maxWidth: '350px' }}>
            <Form.Control
              type="search"
              className="rounded-pill px-4 py-2 fs-sm bg-light border-0 shadow-none"
              placeholder="Tìm quốc gia (tên, mã ISO)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <LuSearch className="app-search-icon text-muted ms-2" />
          </div>

          <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border" style={{ minWidth: '220px' }}>
            <span className="text-muted fs-xs me-2">Lọc theo vùng:</span>
            <select
              className="form-select form-select-sm bg-transparent border-0 shadow-none fw-medium text-dark"
              value={selectedRegionFilter}
              onChange={(e) => setSelectedRegionFilter(e.target.value)}>
              <option value="All">Tất cả các vùng</option>
              {regions.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>

        <Button variant="danger" className="rounded-pill px-4 py-2 fw-bold d-flex align-items-center shadow-sm" onClick={() => handleOpenForm(null)}>
          <TbPlus className="fs-base me-2" /> Thêm Quốc Gia
        </Button>
      </div>

      <DataTable table={table} emptyMessage="Không tìm thấy quốc gia nào phù hợp" />

      {currentTotal > 0 && (
        <div className="p-4 border-top bg-white">
          <TablePagination
            totalItems={currentTotal}
            start={start}
            end={end}
            itemsName="Quốc gia"
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
        <Form onSubmit={handleSaveCountry}>
          <Modal.Header closeButton className="border-0 px-4 pt-4">
            <Modal.Title className="fw-bold fs-4">
              {editingCountry ? 'Chỉnh sửa quốc gia' : 'Thêm quốc gia mới'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-4">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold fs-sm">Tên quốc gia <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Ví dụ: Nhật Bản"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="py-2"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold fs-sm">Thuộc vùng du lịch <span className="text-danger">*</span></Form.Label>
              <Form.Select
                required
                value={regionId}
                onChange={(e) => setRegionId(e.target.value)}
                className="py-2">
                <option value="" disabled>-- Chọn vùng du lịch --</option>
                {regions.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold fs-sm">Mã ISO quốc gia <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                maxLength={2}
                placeholder="Ví dụ: JP"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="py-2"
              />
              <Form.Text className="text-muted fs-xs">Mã chuẩn 2 ký tự (vd: VN, JP, KR, US).</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold fs-sm">Biểu tượng quốc kỳ (Emoji)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ví dụ: 🇯🇵"
                value={flagEmoji}
                onChange={(e) => setFlagEmoji(e.target.value)}
                className="py-2"
              />
              <Form.Text className="text-muted fs-xs">Dán emoji quốc kỳ tương ứng của nước đó.</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="country-status-switch"
                label="Kích hoạt hoạt động"
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
                className="fw-medium fs-sm py-2"
              />
            </Form.Group>
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
        itemName="quốc gia này"
      />
    </div>
  )
}

export default CountriesTable
