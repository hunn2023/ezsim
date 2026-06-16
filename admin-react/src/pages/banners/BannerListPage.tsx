import { useEffect, useMemo, useState } from 'react'
import {
  Badge, Button, Container, FormControl, InputGroup,
} from 'react-bootstrap'
import {
  TbArrowDown, TbArrowUp, TbEdit, TbPlus, TbRefresh,
  TbSearch, TbToggleLeft, TbToggleRight, TbTrash,
} from 'react-icons/tb'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import DataTable, { type Column } from '@/components/common/DataTable'
import { bannerApi } from '@/api/bannerApi'
import type { Banner, BannerPosition } from '@/types/banner'

const toast = (icon: 'success' | 'error', title: string) =>
  Swal.fire({ toast: true, position: 'top-end', icon, title, timer: 2500, showConfirmButton: false, timerProgressBar: true })

const POSITION_LABELS: Record<BannerPosition, string> = {
  hero:      'Hero',
  promotion: 'Khuyến mãi',
  sidebar:   'Sidebar',
  footer:    'Footer',
}

const POSITION_TONES: Record<BannerPosition, string> = {
  hero:      'primary',
  promotion: 'warning',
  sidebar:   'info',
  footer:    'secondary',
}

const StatusBadge = ({ status }: { status: Banner['status'] }) =>
  status === 'active'
    ? <Badge bg="" className="bg-success-subtle text-success-emphasis border border-success-subtle fw-semibold">Hoạt động</Badge>
    : <Badge bg="" className="bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle fw-semibold">Ẩn</Badge>

const PositionBadge = ({ position }: { position: BannerPosition }) => {
  const tone = POSITION_TONES[position] ?? 'secondary'
  return <Badge bg="" className={`bg-${tone}-subtle text-${tone}-emphasis border border-${tone}-subtle fw-semibold`}>{POSITION_LABELS[position] ?? position}</Badge>
}

const BannerListPage = () => {
  const navigate = useNavigate()
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await bannerApi.getAll()
      setBanners(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách banner')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void fetchData() }, [])

  const filtered = useMemo(() => {
    const kw = search.toLowerCase().trim()
    if (!kw) return banners
    return banners.filter((b) =>
      b.title.toLowerCase().includes(kw) ||
      (b.linkUrl ?? '').toLowerCase().includes(kw) ||
      POSITION_LABELS[b.position].toLowerCase().includes(kw)
    )
  }, [banners, search])

  const handleToggle = async (b: Banner) => {
    setBusyId(b.id)
    try {
      await bannerApi.toggle(b.id)
      setBanners((prev) =>
        prev.map((x) => x.id === b.id ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' } : x)
      )
      await toast('success', `Đã ${b.status === 'active' ? 'ẩn' : 'bật'} banner "${b.title}"`)
    } catch (err) {
      await toast('error', err instanceof Error ? err.message : 'Cập nhật trạng thái thất bại')
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async (b: Banner) => {
    const result = await Swal.fire({
      title: 'Xóa banner?',
      text: `Bạn có chắc chắn muốn xóa "${b.title}"? Hành động này không thể hoàn tác.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    })
    if (!result.isConfirmed) return

    setBusyId(b.id)
    try {
      await bannerApi.delete(b.id)
      setBanners((prev) => prev.filter((x) => x.id !== b.id))
      await toast('success', `Đã xóa banner "${b.title}"`)
    } catch (err) {
      await toast('error', err instanceof Error ? err.message : 'Xóa banner thất bại')
    } finally {
      setBusyId(null)
    }
  }

  const handleMove = async (b: Banner, dir: -1 | 1) => {
    // Reorder always operates on the canonical sortOrder list, ignoring search/sort
    const ordered = [...banners].sort((a, c) => a.sortOrder - c.sortOrder)
    const idx = ordered.findIndex((x) => x.id === b.id)
    const newIdx = idx + dir
    if (idx === -1 || newIdx < 0 || newIdx >= ordered.length) return

    const next = [...ordered]
    ;[next[idx], next[newIdx]] = [next[newIdx], next[idx]]
    const orderedIds = next.map((x) => x.id)

    setBusyId(b.id)
    try {
      const res = await bannerApi.reorder(orderedIds)
      setBanners(res.data)
    } catch (err) {
      await toast('error', err instanceof Error ? err.message : 'Sắp xếp thất bại')
    } finally {
      setBusyId(null)
    }
  }

  const sortedAll = useMemo(() => [...banners].sort((a, c) => a.sortOrder - c.sortOrder), [banners])

  const columns: Column<Banner>[] = [
    { id: 'order', header: 'Thứ tự', width: 80, sortAccessor: (b) => b.sortOrder,
      cell: (b) => {
        const idx = sortedAll.findIndex((x) => x.id === b.id)
        const isFirst = idx === 0
        const isLast = idx === sortedAll.length - 1
        const isBusy = busyId === b.id
        return (
          <div className="d-flex align-items-center gap-2">
            <span className="fw-semibold">{b.sortOrder}</span>
            <div className="d-flex flex-column">
              <Button
                size="sm" variant="link" className="p-0 lh-1"
                disabled={isFirst || isBusy}
                onClick={() => void handleMove(b, -1)}
                title="Lên"
              >
                <TbArrowUp />
              </Button>
              <Button
                size="sm" variant="link" className="p-0 lh-1"
                disabled={isLast || isBusy}
                onClick={() => void handleMove(b, 1)}
                title="Xuống"
              >
                <TbArrowDown />
              </Button>
            </div>
          </div>
        )
      } },
    { id: 'image', header: 'Ảnh', width: 140,
      cell: (b) => (
        <img
          src={b.image} alt={b.title}
          style={{ width: 120, height: 48, objectFit: 'cover', borderRadius: 4 }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
        />
      ) },
    { id: 'title', header: 'Tiêu đề', sortAccessor: (b) => b.title,
      cell: (b) => (
        <div>
          <div className="fw-semibold">{b.title}</div>
          {b.description && (
            <div className="text-muted text-truncate" style={{ fontSize: 12, maxWidth: 320 }}>{b.description}</div>
          )}
        </div>
      ) },
    { id: 'position', header: 'Vị trí', width: 130, sortAccessor: (b) => b.position,
      cell: (b) => <PositionBadge position={b.position} /> },
    { id: 'link', header: 'Link',
      cell: (b) => b.linkUrl
        ? <code style={{ fontSize: 12 }}>{b.linkUrl}</code>
        : <span className="text-muted">—</span> },
    { id: 'status', header: 'Trạng thái', width: 120, align: 'center', sortAccessor: (b) => b.status,
      cell: (b) => <StatusBadge status={b.status} /> },
    { id: 'createdAt', header: 'Ngày tạo', width: 130, sortAccessor: (b) => b.createdAt,
      cell: (b) => <span className="text-muted" style={{ fontSize: 12 }}>{new Date(b.createdAt).toLocaleDateString('vi-VN')}</span> },
    { id: 'actions', header: 'Thao tác', width: 200, align: 'end',
      cell: (b) => {
        const isBusy = busyId === b.id
        return (
          <div className="d-flex gap-1 justify-content-end">
            <Button
              size="sm" variant="light" className="btn-icon"
              disabled={isBusy}
              onClick={() => void handleToggle(b)}
              title={b.status === 'active' ? 'Ẩn banner' : 'Bật banner'}
            >
              {b.status === 'active'
                ? <TbToggleRight className="fs-lg text-success" />
                : <TbToggleLeft className="fs-lg text-secondary" />}
            </Button>
            <Button size="sm" variant="light" className="btn-icon"
              onClick={() => void navigate(`/banners/${b.id}/edit`)} title="Sửa">
              <TbEdit className="fs-lg text-primary" />
            </Button>
            <Button
              size="sm" variant="light" className="btn-icon"
              disabled={isBusy}
              onClick={() => void handleDelete(b)}
              title="Xóa"
            >
              <TbTrash className="fs-lg text-danger" />
            </Button>
          </div>
        )
      } },
  ]

  const toolbar = (
    <div className="d-flex flex-wrap align-items-center gap-2 justify-content-between">
      <InputGroup style={{ maxWidth: 360 }}>
        <InputGroup.Text><TbSearch /></InputGroup.Text>
        <FormControl
          placeholder="Tìm theo tiêu đề, link hoặc vị trí..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>
      <div className="d-flex gap-2">
        <Button variant="outline-secondary" onClick={() => void fetchData()} title="Tải lại">
          <TbRefresh />
        </Button>
        <Button variant="primary" onClick={() => void navigate('/banners/new')}>
          <TbPlus className="me-1" /> Thêm banner
        </Button>
      </div>
    </div>
  )

  return (
    <Container fluid>
      <PageBreadcrumb title="Banner" subtitle="Marketing" />
      <DataTable<Banner>
        data={filtered}
        columns={columns}
        rowKey={(b) => b.id}
        loading={loading}
        error={error}
        toolbar={toolbar}
        isFiltered={!!search}
        emptyText='Chưa có banner nào. Bấm "Thêm banner" để tạo mới.'
        emptyFilteredText="Không tìm thấy banner phù hợp."
        itemNoun="banner"
      />
    </Container>
  )
}

export default BannerListPage
