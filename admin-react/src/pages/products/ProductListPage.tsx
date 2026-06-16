import { useEffect, useMemo, useState } from 'react'
import {
  Badge, Button, Container, FormControl, FormSelect, InputGroup, Spinner,
} from 'react-bootstrap'
import {
  TbEdit, TbEye, TbPlus, TbRefresh,
  TbSearch, TbToggleLeft, TbToggleRight, TbTrash,
} from 'react-icons/tb'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import DataTable, { type Column } from '@/components/common/DataTable'
import { productApi } from '@/api/productApi'
import type { Product } from '@/types/product'

const formatVND = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n)

const toast = (icon: 'success' | 'error', title: string) =>
  Swal.fire({ toast: true, position: 'top-end', icon, title, timer: 2500, showConfirmButton: false, timerProgressBar: true })

const ProductListPage = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [filterStock, setFilterStock] = useState<'all' | 'in' | 'out'>('all')
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

  const columns: Column<Product>[] = [
    { id: 'index', header: '#', width: 48,
      cell: (_p, idx) => <span className="text-muted" style={{ fontSize: 13 }}>{idx + 1}</span> },
    { id: 'name', header: 'Sản phẩm', sortAccessor: (p) => p.name,
      cell: (p) => (
        <div className="d-flex align-items-center gap-2">
          {p.image
            ? <img src={p.image} alt={p.name} width={36} height={36} className="rounded object-fit-cover flex-shrink-0" />
            : <div className="rounded bg-light d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 36, height: 36, fontSize: 12, color: '#aaa' }}>{p.name.charAt(0)}</div>}
          <span className="fw-semibold" style={{ maxWidth: 220 }}>{p.name}</span>
        </div>
      ) },
    { id: 'sku', header: 'SKU', sortAccessor: (p) => p.sku,
      cell: (p) => <code className="text-muted" style={{ fontSize: 12 }}>{p.sku}</code> },
    { id: 'category', header: 'Danh mục', sortAccessor: (p) => p.categoryName,
      cell: (p) => <Badge bg="light" text="dark" className="border">{p.categoryName}</Badge> },
    { id: 'price', header: 'Giá', align: 'end', sortAccessor: (p) => p.price,
      cell: (p) => (
        <span className={p.salePrice ? 'text-decoration-line-through text-muted' : ''}>
          {formatVND(p.price)}
        </span>
      ) },
    { id: 'salePrice', header: 'Sale', align: 'end', sortAccessor: (p) => p.salePrice ?? -1,
      cell: (p) => p.salePrice
        ? <span className="text-danger fw-semibold">{formatVND(p.salePrice)}</span>
        : <span className="text-muted">—</span> },
    { id: 'stock', header: 'Tồn kho', align: 'center', sortAccessor: (p) => p.stock,
      cell: (p) => p.stock === 0
        ? <Badge bg="" className="bg-danger-subtle text-danger-emphasis border border-danger-subtle fw-semibold">Hết hàng</Badge>
        : <span className="text-success fw-semibold">{p.stock}</span> },
    { id: 'status', header: 'Trạng thái', align: 'center', sortAccessor: (p) => p.status,
      cell: (p) => p.status === 'active'
        ? <Badge bg="" className="bg-success-subtle text-success-emphasis border border-success-subtle fw-semibold">Hoạt động</Badge>
        : <Badge bg="" className="bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle fw-semibold">Ẩn</Badge> },
    { id: 'createdAt', header: 'Ngày tạo', sortAccessor: (p) => p.createdAt,
      cell: (p) => <span className="text-muted" style={{ fontSize: 12 }}>{new Date(p.createdAt).toLocaleDateString('vi-VN')}</span> },
    { id: 'actions', header: 'Thao tác', align: 'end',
      cell: (prod) => (
        <div className="d-flex gap-1 justify-content-end">
          <Button variant="light" size="sm" className="btn-icon" title="Xem nhanh">
            <TbEye className="fs-lg text-info" />
          </Button>
          <Button
            variant="light" size="sm" className="btn-icon"
            title={prod.status === 'active' ? 'Ẩn' : 'Bật'}
            disabled={toggling === prod.id}
            onClick={() => void handleToggle(prod)}
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
            onClick={() => void handleDelete(prod)}>
            <TbTrash className="fs-lg text-danger" />
          </Button>
        </div>
      ) },
  ]

  const toolbar = (
    <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
      <InputGroup style={{ maxWidth: 280 }}>
        <InputGroup.Text><TbSearch /></InputGroup.Text>
        <FormControl
          placeholder="Tên hoặc SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      <div className="d-flex flex-wrap gap-2 align-items-center">
        <FormSelect style={{ width: 170 }} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">Tất cả danh mục</option>
          {categoryOptions.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
        </FormSelect>
        <FormSelect style={{ width: 150 }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}>
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Ẩn</option>
        </FormSelect>
        <FormSelect style={{ width: 140 }} value={filterStock} onChange={(e) => setFilterStock(e.target.value as typeof filterStock)}>
          <option value="all">Tất cả tồn kho</option>
          <option value="in">Còn hàng</option>
          <option value="out">Hết hàng</option>
        </FormSelect>
        <Button variant="outline-secondary" size="sm" onClick={() => void fetchData()} title="Tải lại">
          <TbRefresh />
        </Button>
        <Button variant="primary" size="sm" className="d-flex align-items-center gap-1"
          onClick={() => void navigate('/products/create')}>
          <TbPlus /> Thêm sản phẩm
        </Button>
      </div>
    </div>
  )

  const isFiltered = !!search || !!filterCategory || filterStatus !== 'all' || filterStock !== 'all'

  return (
    <Container fluid>
      <PageBreadcrumb title="Sản phẩm" subtitle="Quản lý" />
      <DataTable<Product>
        data={filtered}
        columns={columns}
        rowKey={(p) => p.id}
        loading={loading}
        error={error}
        toolbar={toolbar}
        isFiltered={isFiltered}
        emptyText="Chưa có sản phẩm nào"
        emptyFilteredText="Không tìm thấy sản phẩm phù hợp"
        itemNoun="sản phẩm"
      />
    </Container>
  )
}

export default ProductListPage
