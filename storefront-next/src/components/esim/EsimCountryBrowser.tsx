"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import Icon from "@/components/ui/Icon";
import { useCartStore } from "@/lib/cartStore";
import { filterEsimPackages, getPackageCountByQuickTag } from "@/lib/api/esimApi";
import type { EsimCountryDetail, EsimPackageFilters, PackageQuickTag } from "@/types/esim";
import Sidebar from "./Sidebar";
import QuickPills from "./QuickPills";
import PackageCard from "./PackageCard";
import InfoTabs from "./InfoTabs";

const INITIAL_FILTERS: EsimPackageFilters = {
  days: [],
  dataRanges: [],
  featureTags: [],
  quickTag: "all",
  sort: "recommended",
};

type ViewMode = "grid" | "list";

export default function EsimCountryBrowser({ country }: { country: EsimCountryDetail }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [filters, setFilters] = useState<EsimPackageFilters>(INITIAL_FILTERS);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredPackages = useMemo(
    () => filterEsimPackages(country.packages, filters),
    [country.packages, filters]
  );

  const visiblePackages = filteredPackages.slice(0, visibleCount);
  const quickTagCounts = useMemo(() => getPackageCountByQuickTag(country.packages), [country.packages]);

  const handleQuickTagChange = (quickTag: PackageQuickTag | "all") => {
    setFilters((current) => ({ ...current, quickTag }));
    setVisibleCount(6);
  };

  const handleSidebarApply = (
    nextFilters: Pick<EsimPackageFilters, "days" | "dataRanges" | "featureTags" | "minPrice" | "maxPrice">
  ) => {
    setFilters((current) => ({ ...current, ...nextFilters }));
    setVisibleCount(6);
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
    setVisibleCount(6);
  };

  const handleSortChange = (sort: EsimPackageFilters["sort"]) => {
    setFilters((current) => ({ ...current, sort }));
  };

  const handleBuy = (pkg: EsimCountryDetail["packages"][number]) => {
    addToCart({
      id: pkg.id,
      name: `${country.name} ${pkg.data} ${pkg.dataUnit} - ${pkg.days} ngày`,
      slug: pkg.slug,
      href: `/esim-du-lich/${country.slug}`,
      image: pkg.image,
      price: pkg.price,
      quantity: 1,
      stock: pkg.stock,
    });

    toast.success(`Đã thêm gói ${pkg.data} ${pkg.dataUnit} vào giỏ hàng`);
  };

  return (
    <div className="max-w-container mx-auto px-6 grid md:grid-cols-[280px_1fr] gap-6" style={{ padding: "32px 24px" }}>
      <Sidebar
        packages={country.packages}
        appliedFilters={{
          days: filters.days,
          dataRanges: filters.dataRanges,
          featureTags: filters.featureTags,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
        }}
        onApply={handleSidebarApply}
        onReset={handleReset}
      />

      <main>
        <QuickPills
          packages={country.packages}
          activeTag={filters.quickTag}
          onSelect={handleQuickTagChange}
        />

        <div
          className="bg-white flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center"
          style={{
            padding: "16px 20px",
            borderRadius: "12px",
            border: "1px solid #E2E8F0",
            marginBottom: "20px",
          }}
        >
          <div className="text-gray-700" style={{ fontSize: "14px" }}>
            Hiển thị <b className="text-navy">{visiblePackages.length === 0 ? 0 : 1}-{visiblePackages.length}</b> trong tổng số{" "}
            <b className="text-navy">{filteredPackages.length}</b> gói {country.name}
          </div>

          <div className="flex flex-wrap items-center gap-3" style={{ fontSize: "14px" }}>
            <span>Sắp xếp:</span>
            <select
              value={filters.sort}
              onChange={(event) => handleSortChange(event.target.value as EsimPackageFilters["sort"])}
              className="font-sans bg-white cursor-pointer"
              style={{
                padding: "8px 32px 8px 12px",
                border: "1.5px solid #E2E8F0",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              <option value="recommended">Phù hợp nhất</option>
              <option value="price_asc">Giá thấp đến cao</option>
              <option value="price_desc">Giá cao đến thấp</option>
              <option value="bestseller">Bán chạy nhất</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`cursor-pointer flex items-center justify-center ${
                  viewMode === "grid" ? "bg-primary text-white" : "bg-white text-gray-500"
                }`}
                style={{
                  width: "36px",
                  height: "36px",
                  border: viewMode === "grid" ? "1.5px solid #0066FF" : "1.5px solid #E2E8F0",
                  borderRadius: "8px",
                }}
                aria-label="Hiển thị dạng lưới"
              >
                <Icon icon="th-large" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`cursor-pointer flex items-center justify-center ${
                  viewMode === "list" ? "bg-primary text-white" : "bg-white text-gray-500"
                }`}
                style={{
                  width: "36px",
                  height: "36px",
                  border: viewMode === "list" ? "1.5px solid #0066FF" : "1.5px solid #E2E8F0",
                  borderRadius: "8px",
                }}
                aria-label="Hiển thị dạng danh sách"
              >
                <Icon icon="list" />
              </button>
            </div>
          </div>
        </div>

        {visiblePackages.length > 0 ? (
          <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
            {visiblePackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} onBuy={handleBuy} />
            ))}
          </div>
        ) : (
          <div
            className="bg-white text-center"
            style={{ borderRadius: "16px", border: "1px solid #E2E8F0", padding: "48px 24px" }}
          >
            <div className="text-4xl mb-3">🧭</div>
            <h3 className="text-navy font-bold mb-2">Không tìm thấy gói phù hợp</h3>
            <p className="text-gray-500 mb-4">Thử nới bộ lọc hoặc chọn nhanh một nhóm gói khác.</p>
            <button
              type="button"
              onClick={handleReset}
              className="btn-outline"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        {visiblePackages.length < filteredPackages.length && (
          <div className="text-center" style={{ marginTop: "32px" }}>
            <button
              type="button"
              onClick={() => setVisibleCount((current) => current + 6)}
              className="gradient-primary text-white font-bold cursor-pointer inline-flex items-center gap-2"
              style={{
                padding: "12px 24px",
                borderRadius: "10px",
                fontSize: "14px",
              }}
            >
              <Icon icon="plus" /> Xem thêm {Math.min(6, filteredPackages.length - visiblePackages.length)} gói
            </button>
          </div>
        )}

        <InfoTabs />
      </main>
    </div>
  );
}
