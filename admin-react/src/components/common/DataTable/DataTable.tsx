import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  Alert, Button, Card, CardBody, CardFooter, CardHeader,
  Spinner, Table,
} from 'react-bootstrap'
import { TbAlertCircle, TbArrowsSort, TbSortAscending, TbSortDescending } from 'react-icons/tb'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Column<T> {
  id: string
  header: ReactNode
  /** Renderer for the cell. */
  cell: (row: T, index: number) => ReactNode
  /** Provide to make the column sortable. */
  sortAccessor?: (row: T) => string | number
  width?: number | string
  align?: 'start' | 'center' | 'end'
  className?: string
  headerClassName?: string
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  rowKey: (row: T) => string

  loading?: boolean
  error?: string | null

  /** Rows per page. Pass 0 or Infinity to disable pagination. Default 10. */
  pageSize?: number

  /** Optional toolbar (search box, filters, action buttons) rendered in the card header. */
  toolbar?: ReactNode

  /** Whether the user has applied filters/search (controls empty-state copy). */
  isFiltered?: boolean
  emptyText?: string
  emptyFilteredText?: string

  /** Noun for footer counter. Default "mục". */
  itemNoun?: string

  /** Click on a body row. Action buttons should call e.stopPropagation. */
  onRowClick?: (row: T) => void
  rowClassName?: string

  className?: string
}

type SortDir = 'asc' | 'desc'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function alignClass(align?: Column<unknown>['align']): string {
  if (align === 'center') return 'text-center'
  if (align === 'end') return 'text-end'
  return ''
}

function compareSortValues(a: string | number, b: string | number): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), 'vi')
}

// ─── Component ────────────────────────────────────────────────────────────────

function DataTable<T>({
  data,
  columns,
  rowKey,
  loading = false,
  error = null,
  pageSize = 10,
  toolbar,
  isFiltered = false,
  emptyText = 'Chưa có dữ liệu',
  emptyFilteredText = 'Không tìm thấy kết quả phù hợp',
  itemNoun = 'mục',
  onRowClick,
  rowClassName,
  className,
}: DataTableProps<T>) {
  const [sortId, setSortId] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(1)

  const sortedData = useMemo(() => {
    if (!sortId) return data
    const col = columns.find((c) => c.id === sortId && c.sortAccessor)
    if (!col?.sortAccessor) return data
    const acc = col.sortAccessor
    const sign = sortDir === 'asc' ? 1 : -1
    return [...data].sort((a, b) => sign * compareSortValues(acc(a), acc(b)))
  }, [data, columns, sortId, sortDir])

  const usePagination = pageSize > 0 && Number.isFinite(pageSize)
  const totalPages = usePagination ? Math.max(1, Math.ceil(sortedData.length / pageSize)) : 1
  const currentPage = Math.min(page, totalPages)
  const pageRows = usePagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData

  // Reset to first page when the upstream data changes
  useEffect(() => { setPage(1) }, [data.length])

  const handleSort = (col: Column<T>) => {
    if (!col.sortAccessor) return
    if (sortId === col.id) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortId(col.id)
      setSortDir('asc')
    }
  }

  return (
    <Card className={className}>
      {toolbar && <CardHeader>{toolbar}</CardHeader>}

      <CardBody className="p-0">
        {loading && (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        )}

        {!loading && error && (
          <Alert variant="danger" className="m-3 d-flex align-items-center gap-2">
            <TbAlertCircle className="fs-20 flex-shrink-0" /> {error}
          </Alert>
        )}

        {!loading && !error && sortedData.length === 0 && (
          <div className="text-center text-muted py-5">
            {isFiltered ? emptyFilteredText : emptyText}
          </div>
        )}

        {!loading && !error && pageRows.length > 0 && (
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                {columns.map((col) => {
                  const isActive = sortId === col.id
                  const Icon = !col.sortAccessor
                    ? null
                    : isActive
                      ? sortDir === 'asc' ? TbSortAscending : TbSortDescending
                      : TbArrowsSort
                  return (
                    <th
                      key={col.id}
                      style={col.width ? { width: col.width } : undefined}
                      className={[
                        col.headerClassName ?? '',
                        alignClass(col.align),
                        col.sortAccessor ? 'user-select-none' : '',
                      ].filter(Boolean).join(' ')}
                      onClick={col.sortAccessor ? () => handleSort(col) : undefined}
                      role={col.sortAccessor ? 'button' : undefined}
                    >
                      <span className="d-inline-flex align-items-center gap-1">
                        {col.header}
                        {Icon && <Icon className={isActive ? 'text-primary' : 'text-muted'} style={{ fontSize: 14 }} />}
                      </span>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row, idx) => {
                const globalIdx = usePagination ? (currentPage - 1) * pageSize + idx : idx
                return (
                  <tr
                    key={rowKey(row)}
                    className={rowClassName}
                    style={onRowClick ? { cursor: 'pointer' } : undefined}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.id}
                        className={[col.className ?? '', alignClass(col.align)].filter(Boolean).join(' ')}
                      >
                        {col.cell(row, globalIdx)}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </Table>
        )}
      </CardBody>

      {!loading && !error && usePagination && sortedData.length > pageSize && (
        <CardFooter className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
          <span className="text-muted" style={{ fontSize: 13 }}>
            {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sortedData.length)} / {sortedData.length} {itemNoun}
          </span>
          <div className="d-flex gap-1">
            <Button variant="outline-secondary" size="sm" disabled={currentPage <= 1} onClick={() => setPage((p) => p - 1)}>‹</Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button key={p} size="sm" variant={p === currentPage ? 'primary' : 'outline-secondary'} onClick={() => setPage(p)}>
                {p}
              </Button>
            ))}
            <Button variant="outline-secondary" size="sm" disabled={currentPage >= totalPages} onClick={() => setPage((p) => p + 1)}>›</Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

export default DataTable
