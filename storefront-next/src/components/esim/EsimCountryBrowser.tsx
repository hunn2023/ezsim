"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
import { useCartStore } from "@/lib/cartStore";
import { useCartAnimation } from "@/components/ui/CartAnimation";
import { useLanguage } from "@/hooks/useLanguage";
import { filterEsimPackages } from "@/lib/api/esimApi";
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
  const { triggerFlyToCart } = useCartAnimation();
  const { language } = useLanguage();
  const [filters, setFilters] = useState<EsimPackageFilters>(INITIAL_FILTERS);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredPackages = useMemo(
    () => filterEsimPackages(country.packages, filters),
    [country.packages, filters]
  );

  const visiblePackages = filteredPackages.slice(0, visibleCount);

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

  const handleBuy = (pkg: EsimCountryDetail["packages"][number], quantity: number, triggerElement: HTMLElement | null) => {
    addToCart({
      id: pkg.id,
      name: `${country.name} ${pkg.data} ${pkg.dataUnit} - ${pkg.days} ngày`,
      slug: pkg.slug,
      href: `/esim-du-lich/${country.slug}`,
      image: pkg.image,
      price: pkg.price,
      quantity,
      stock: pkg.stock,
    });

    triggerFlyToCart(pkg.image, triggerElement);
  };

  const text = {
    showing: language === "vi" ? "Hiển thị" : "Showing",
    inTotal: language === "vi" ? "trong tổng số" : "out of",
    packages: language === "vi" ? "gói" : "packages",
    sortBy: language === "vi" ? "Sắp xếp:" : "Sort by:",
    sortRecommended: language === "vi" ? "Phù hợp nhất" : "Recommended",
    sortPriceAsc: language === "vi" ? "Giá thấp đến cao" : "Price low to high",
    sortPriceDesc: language === "vi" ? "Giá cao đến thấp" : "Price high to low",
    sortBestSeller: language === "vi" ? "Bán chạy nhất" : "Best seller",
    sortRating: language === "vi" ? "Đánh giá cao nhất" : "Top rated",
    gridView: language === "vi" ? "Hiển thị dạng lưới" : "Grid view",
    listView: language === "vi" ? "Hiển thị dạng danh sách" : "List view",
    noPackageTitle: language === "vi" ? "Không tìm thấy gói phù hợp" : "No matching package found",
    noPackageDescription:
      language === "vi"
        ? "Thử nới bộ lọc hoặc chọn nhanh một nhóm gói khác."
        : "Try relaxing filters or picking another quick package group.",
    clearFilters: language === "vi" ? "Xóa bộ lọc" : "Clear filters",
    showMore: language === "vi" ? "Xem thêm" : "Show more",
    packageSuffix: language === "vi" ? "gói" : "packages",
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
            {text.showing} <b className="text-navy">{visiblePackages.length === 0 ? 0 : 1}-{visiblePackages.length}</b> {text.inTotal}{" "}
            <b className="text-navy">{filteredPackages.length}</b> {text.packages} {country.name}
          </div>

          <div className="flex flex-wrap items-center gap-3" style={{ fontSize: "14px" }}>
            <span>{text.sortBy}</span>
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
              <option value="recommended">{text.sortRecommended}</option>
              <option value="price_asc">{text.sortPriceAsc}</option>
              <option value="price_desc">{text.sortPriceDesc}</option>
              <option value="bestseller">{text.sortBestSeller}</option>
              <option value="rating">{text.sortRating}</option>
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
                aria-label={text.gridView}
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
                aria-label={text.listView}
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
            <h3 className="text-navy font-bold mb-2">{text.noPackageTitle}</h3>
            <p className="text-gray-500 mb-4">{text.noPackageDescription}</p>
            <button
              type="button"
              onClick={handleReset}
              className="btn-outline"
            >
              {text.clearFilters}
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
              <Icon icon="plus" /> {text.showMore} {Math.min(6, filteredPackages.length - visiblePackages.length)} {text.packageSuffix}
            </button>
          </div>
        )}

        <InfoTabs />
      </main>
    </div>
  );
}
