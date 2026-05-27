import { useEffect, useMemo, useState } from 'react'
import {
  Alert, Badge, Button, Card, CardBody, CardFooter, CardHeader,
  Container, FormControl, FormSelect, InputGroup, Spinner, Table,
} from 'react-bootstrap'
import {
  TbAlertCircle, TbEdit, TbEye, TbPlus, TbRefresh,
  TbSearch, TbToggleLeft, TbToggleRight, TbTrash,
} from 'react-icons/tb'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { productApi } from '@/api/productApi'
import type { Product } from '@/types/product'

const formatVND = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n)

const toast = (icon: 'success' | 'error', title: string) =>
  Swal.fire({ toast: true, position: 'top-end', icon, title, timer: 2500, showConfirmButton: false, timerProgressBar: true })

const ROWS_PER_PAGE = 10

const ProductListPage = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [filterStock, setFilterStock] = useState<'all' | 'in' | 'out'>('all')

  const [page, setPage] = useState(1)
  const [toggling, setToggling] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await productApi.getAll()
      setProducts(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void fetchData() }, [])

  // Unique categories for filter dropdown
  const categoryOptions = useMemo(() => {
    const map = new Map<string, string>()
    products.forEach((p) => map.set(p.categoryId, p.categoryName))
    return Array.from(map.entries())
  }, [products])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = search.toLowerCase()
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      const matchCat = !filterCategory || p.categoryId === filterCategory
      const matchStatus = filterStatus === 'all' || p.status === filterStatus
      const matchStock =
        filterStock === 'all' ||
        (filterStock === 'in' && p.stock > 0) ||
        (filterStock === 'out' && p.stock === 0)
      return matchSearch && matchCat && matchStatus && matchStock
    })
  }, [products, search, filterCategory, filterStatus, filterStock])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE)

  const resetPage = () => setPage(1)

  const handleToggle = async (prod: Product) => {
    setToggling(prod.id)
    try {
      await productApi.toggle(prod.id)
      setProducts((prev) =>
        prev.map((p) => p.id === prod.id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p)
      )
      await toast('success', `Đã ${prod.status === 'active' ? 'ẩn' : 'bật'} "${prod.name}"`)
    } catch {
      await toast('error', 'Cập nhật trạng thái thất bại')
    } finally {
      setToggling(null)
    }
  }

  const handleDelete = async (prod: Product) => {
    const result = await Swal.fire({
      title: 'Xóa sản phẩm?',
      html: `Sản phẩm <strong>${prod.name}</strong> sẽ bị xóa vĩnh viễn.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: 'Hủy',
      confirmButtonText: 'Xóa',
    })
    if (!result.isConfirmed) return
    try {
      await productApi.delete(prod.id)
      setProducts((prev) => prev.filter((p) => p.id !== prod.id))
      await toast('success', `Đã xóa "${prod.name}"`)
    } catch {
      await toast('error', 'Xóa sản phẩm thất bại')
    }
  }

  return (
    <Container fluid>
      <PageBreadcrumb title="Sản phẩm" subtitle="Quản lý" />

      <Card>
        {/* ── Toolbar ─────────────────────────────────── */}
        <CardHeader className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
          <InputGroup style={{ maxWidth: 280 }}>
            <InputGroup.Text><TbSearch /></InputGroup.Text>
            <FormControl
              placeholder="Tên hoặc SKU..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage() }}
            />
          </InputGroup>

          <div className="d-flex flex-wrap gap-2 align-items-center">
            <FormSelect style={{ width: 170 }} value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value); resetPage() }}>
              <option value="">Tất cả danh mục</option>
              {categoryOptions.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
            </FormSelect>

            <FormSelect style={{ width: 150 }} value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value as typeof filterStatus); resetPage() }}>
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ẩn</option>
            </FormSelect>

            <FormSelect style={{ width: 140 }} value={filterStock}
              onChange={(e) => { setFilterStock(e.target.value as typeof filterStock); resetPage() }}>
              <option value="all">Tất cả tồn kho</option>
              <option value="in">Còn hàng</option>
              <option value="out">Hết hàng</option>
            </FormSelect>

            <Button variant="outline-secondary" size="sm" onClick={fetchData} title="Tải lại">
              <TbRefresh />
            </Button>
            <Button variant="primary" size="sm" className="d-flex align-items-center gap-1"
              onClick={() => void navigate('/products/create')}>
              <TbPlus /> Thêm sản phẩm
            </Button>
          </div>
        </CardHeader>

        {/* ── Body ────────────────────────────────────── */}
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

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center text-muted py-5">
              {search || filterCategory || filterStatus !== 'all' || filterStock !== 'all'
                ? 'Không tìm thấy sản phẩm phù hợp'
                : 'Chưa có sản phẩm nào'}
            </div>
          )}

          {!loading && !error && pageRows.length > 0 && (
            <Table responsive hover className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 48 }}>#</th>
                  <th>Sản phẩm</th>
                  <th>SKU</th>
                  <th>Danh mục</th>
                  <th className="text-end">Giá</th>
                  <th className="text-end">Sale</th>
                  <th className="text-center">Tồn kho</th>
                  <th className="text-center">Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th className="text-end">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((prod, idx) => (
                  <tr key={prod.id}>
                    <td className="text-muted" style={{ fontSize: 13 }}>
                      {(currentPage - 1) * ROWS_PER_PAGE + idx + 1}
                    </td>

                    {/* Ảnh + tên */}
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {prod.image ? (
                          <img src={prod.image} alt={prod.name} width={36} height={36}
                            className="rounded object-fit-cover flex-shrink-0" />
                        ) : (
                          <div className="rounded bg-light d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{ width: 36, height: 36, fontSize: 12, color: '#aaa' }}>
                            {prod.name.charAt(0)}
                          </div>
                        )}
                        <span className="fw-semibold" style={{ maxWidth: 220 }}>{prod.name}</span>
                      </div>
                    </td>

                    <td><code className="text-muted" style={{ fontSize: 12 }}>{prod.sku}</code></td>
                    <td><Badge bg="light" text="dark" className="border">{prod.categoryName}</Badge></td>

                    {/* Giá gốc */}
                    <td className="text-end text-nowrap">
                      <span className={prod.salePrice ? 'text-decoration-line-through text-muted' : ''}>
                        {formatVND(prod.price)}
                      </span>
                    </td>

                    {/* Giá sale */}
                    <td className="text-end text-nowrap">
                      {prod.salePrice
                        ? <span className="text-danger fw-semibold">{formatVND(prod.salePrice)}</span>
                        : <span className="text-muted">—</span>}
                    </td>

                    {/* Tồn kho */}
                    <td className="text-center">
                      {prod.stock === 0
                        ? <Badge bg="danger" className="bg-opacity-15 text-danger">Hết hàng</Badge>
                        : <span className="text-success fw-semibold">{prod.stock}</span>}
                    </td>

                    {/* Trạng thái */}
                    <td className="text-center">
                      {prod.status === 'active'
                        ? <Badge bg="success" className="bg-opacity-15 text-success">Hoạt động</Badge>
                        : <Badge bg="secondary" className="bg-opacity-15 text-secondary">Ẩn</Badge>}
                    </td>

                    <td className="text-muted" style={{ fontSize: 12 }}>
                      {new Date(prod.createdAt).toLocaleDateString('vi-VN')}
                    </td>

                    {/* Thao tác */}
                    <td>
                      <div className="d-flex gap-1 justify-content-end">
                        <Button variant="light" size="sm" className="btn-icon" title="Xem nhanh">
                          <TbEye className="fs-lg text-info" />
                        </Button>
                        <Button
                          variant="light" size="sm" className="btn-icon"
                          title={prod.status === 'active' ? 'Ẩn' : 'Bật'}
                          disabled={toggling === prod.id}
                          onClick={() => handleToggle(prod)}
                        >
                          {toggling === prod.id
                            ? <Spinner animation="border" size="sm" />
                            : prod.status === 'active'
                              ? <TbToggleRight className="fs-lg text-success" />
                              : <TbToggleLeft className="fs-lg text-muted" />}
                        </Button>
                        <Button variant="light" size="sm" className="btn-icon" title="Chỉnh sửa"
                          onClick={() => void navigate(`/products/edit/${prod.id}`)}>
                          <TbEdit className="fs-lg text-primary" />
                        </Button>
                        <Button variant="light" size="sm" className="btn-icon" title="Xóa"
                          onClick={() => handleDelete(prod)}>
                          <TbTrash className="fs-lg text-danger" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>

        {/* ── Phân trang ──────────────────────────────── */}
        {!loading && !error && filtered.length > ROWS_PER_PAGE && (
          <CardFooter className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
            <span className="text-muted" style={{ fontSize: 13 }}>
              {(currentPage - 1) * ROWS_PER_PAGE + 1}–{Math.min(currentPage * ROWS_PER_PAGE, filtered.length)} / {filtered.length} sản phẩm
            </span>
            <div className="d-flex gap-1">
              <Button variant="outline-secondary" size="sm" disabled={currentPage <= 1} onClick={() => setPage((p) => p - 1)}>‹</Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button key={p} size="sm" variant={p === currentPage ? 'primary' : 'outline-secondary'} onClick={() => setPage(p)}>{p}</Button>
              ))}
              <Button variant="outline-secondary" size="sm" disabled={currentPage >= totalPages} onClick={() => setPage((p) => p + 1)}>›</Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </Container>
  )
}

export default ProductListPage
