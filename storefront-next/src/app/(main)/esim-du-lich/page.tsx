import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui";
import { getEsimCountries } from "@/lib/api/esimApi";
import { LANGUAGE_COOKIE, normalizeLanguage } from "@/lib/i18n";
import type { EsimCountrySummary } from "@/types/esim";

const COUNTRY_FLAG_CODES: Record<string, string> = {
  "nhat-ban": "jp",
  "han-quoc": "kr",
  "thai-lan": "th",
  "chau-au": "eu",
  "my": "us",
};

const REGION_BADGES: Record<EsimCountrySummary["region"], string> = {
  "Châu Á": "🌏",
  "Châu Âu": "",
  "Châu Mỹ": "🌎",
  "Châu Đại Dương": "🌊",
};

const REGION_FLAG_CODES: Partial<Record<EsimCountrySummary["region"], string>> = {
  "Châu Âu": "eu",
};

export const revalidate = 300;

export const metadata: Metadata = {
  title: "eSIM Du lịch 200+ quốc gia | EZSIM",
  description: "Chọn quốc gia bạn đang đến để xem các gói eSIM phù hợp. Kích hoạt 30 giây.",
};

export default async function EsimDuLichPage({
  searchParams,
}: {
  searchParams?: { q?: string | string[]; region?: string | string[]; country?: string | string[] };
}) {
  const language = normalizeLanguage(cookies().get(LANGUAGE_COOKIE)?.value);
  const destinations = await getEsimCountries();
  const readSingleParam = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;

  const keywordRaw = readSingleParam(searchParams?.q)?.trim() ?? "";
  const keyword = keywordRaw.toLowerCase();
  const selectedRegion = readSingleParam(searchParams?.region)?.trim() ?? "";
  const selectedCountry = readSingleParam(searchParams?.country)?.trim() ?? "";

  const keywordFilteredDestinations = keyword
    ? destinations.filter(
        (destination) =>
          destination.name.toLowerCase().includes(keyword) ||
          destination.region.toLowerCase().includes(keyword)
      )
    : destinations;

  const regionOrder: EsimCountrySummary["region"][] = [
    "Châu Á",
    "Châu Âu",
    "Châu Mỹ",
    "Châu Đại Dương",
  ];

  const regionCounts = keywordFilteredDestinations.reduce<Record<string, number>>((acc, destination) => {
    acc[destination.region] = (acc[destination.region] ?? 0) + 1;
    return acc;
  }, {});

  const countriesForCountryFilter = selectedRegion
    ? keywordFilteredDestinations.filter((destination) => destination.region === selectedRegion)
    : keywordFilteredDestinations;

  const filteredDestinations = keywordFilteredDestinations.filter((destination) => {
    const byRegion = !selectedRegion || destination.region === selectedRegion;
    const byCountry = !selectedCountry || destination.slug === selectedCountry;
    return byRegion && byCountry;
  });

  const buildFilterHref = (next: { region?: string; country?: string }) => {
    const params = new URLSearchParams();
    if (keywordRaw) params.set("q", keywordRaw);
    if (next.region) params.set("region", next.region);
    if (next.country) params.set("country", next.country);
    const queryString = params.toString();
    return queryString ? `/esim-du-lich?${queryString}` : "/esim-du-lich";
  };

  const getFlagCode = (slug: string) => COUNTRY_FLAG_CODES[slug] ?? null;
  const displayCountryName = (destination: EsimCountrySummary) => {
    if (language === "vi") return destination.name;

    const map: Record<string, string> = {
      "nhat-ban": "Japan",
      "han-quoc": "South Korea",
      "thai-lan": "Thailand",
      "chau-au": "Europe",
      "my": "United States",
    };
    return map[destination.slug] ?? destination.name;
  };

  const displayRegionName = (region: EsimCountrySummary["region"]) => {
    if (language === "vi") return region;

    const map: Record<EsimCountrySummary["region"], string> = {
      "Châu Á": "Asia",
      "Châu Âu": "Europe",
      "Châu Mỹ": "Americas",
      "Châu Đại Dương": "Oceania",
    };

    return map[region];
  };

  const text = {
    breadcrumb: language === "vi" ? "eSIM Du lịch" : "Travel eSIM",
    heroTitle: language === "vi" ? "eSIM Du lịch 200+ quốc gia" : "Travel eSIM in 200+ countries",
    heroDescription:
      language === "vi"
        ? "Kết nối ngay khi đặt chân tới bất kỳ quốc gia nào. Quét QR là dùng — không cần tháo SIM gốc, không lo roaming."
        : "Stay connected the moment you arrive. Scan the QR code and go online instantly with no SIM swap and no roaming stress.",
    searchResultPrefix: language === "vi" ? "Kết quả tìm kiếm cho" : "Search results for",
    searchResultSuffix: language === "vi" ? "điểm đến phù hợp." : "matching destinations.",
    filterTitle: language === "vi" ? "Lọc điểm đến" : "Filter destinations",
    filterRegion: language === "vi" ? "Khu vực" : "Region",
    filterAllRegions: language === "vi" ? "Tất cả khu vực" : "All regions",
    filterCountry: language === "vi" ? "Quốc gia" : "Country",
    filterAllCountries: language === "vi" ? "Tất cả quốc gia" : "All countries",
    clearFilters: language === "vi" ? "Xóa bộ lọc" : "Clear filters",
    from: language === "vi" ? "Từ" : "From",
    packagesAvailable: language === "vi" ? "gói khả dụng" : "packages available",
    bestSeller: language === "vi" ? "🔥 BÁN CHẠY" : "🔥 BEST SELLER",
    emptyTitle: language === "vi" ? "Chưa có điểm đến phù hợp" : "No matching destinations yet",
    emptyDescription:
      language === "vi"
        ? "Thử tìm theo tên quốc gia khác hoặc quay lại danh sách đầy đủ."
        : "Try another country keyword or return to the full destination list.",
  };

  const byRegion = filteredDestinations.reduce<Record<string, EsimCountrySummary[]>>((acc, d) => {
    (acc[d.region] ??= []).push(d);
    return acc;
  }, {});

  const orderedByRegionEntries = regionOrder
    .map((region) => [region, byRegion[region] ?? []] as const)
    .filter(([, list]) => list.length > 0);

  return (
    <>
      <Breadcrumb items={[{ label: text.breadcrumb }]} />

      {/* Hero - mockup style header xanh đậm */}
      <section className="gradient-primary text-white relative overflow-hidden" style={{ padding: "48px 0" }}>
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-50%",
            right: "-10%",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div className="max-w-container mx-auto px-6 relative">
          <h1 className="text-white mb-3">{text.heroTitle}</h1>
          <p className="text-white/90 max-w-[680px]" style={{ fontSize: "16px" }}>
            {text.heroDescription}
          </p>
          {keyword && (
            <p className="text-white/90 mt-4" style={{ fontSize: "14px" }}>
              {text.searchResultPrefix} <b>{searchParams?.q}</b>: {filteredDestinations.length} {text.searchResultSuffix}
            </p>
          )}
        </div>
      </section>

      <div
        className="max-w-container mx-auto px-6 grid md:grid-cols-[280px_1fr] gap-6"
        style={{ padding: "32px 24px" }}
      >
        <aside className="relative z-20 bg-white rounded-2xl p-6 border border-gray-200 h-fit md:sticky md:top-[120px]">
          <h3 className="text-lg font-bold mb-5">{text.filterTitle}</h3>

          <div className="mb-6 pb-6 border-b border-gray-100">
            <div className="font-bold text-sm mb-3">{text.filterRegion}</div>
            <div className="flex flex-col gap-2">
              <Link
                href={buildFilterHref({ region: "", country: selectedCountry })}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                  !selectedRegion ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{text.filterAllRegions}</span>
                <span className="text-xs">{keywordFilteredDestinations.length}</span>
              </Link>
              {regionOrder
                .filter((region) => (regionCounts[region] ?? 0) > 0)
                .map((region) => (
                  <Link
                    key={region}
                    href={buildFilterHref({ region, country: "" })}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                      selectedRegion === region ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {REGION_FLAG_CODES[region] ? (
                        <span className="inline-flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-slate-100" aria-hidden>
                          <img
                            src={`https://flagcdn.com/w40/${REGION_FLAG_CODES[region]}.png`}
                            alt={region}
                            width={20}
                            height={20}
                            loading="lazy"
                            className="h-full w-full rounded-full object-cover"
                          />
                        </span>
                      ) : (
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs" aria-hidden>
                          {REGION_BADGES[region]}
                        </span>
                      )}
                      {displayRegionName(region)}
                    </span>
                    <span className="text-xs">{regionCounts[region]}</span>
                  </Link>
                ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="font-bold text-sm mb-3">{text.filterCountry}</div>
            <div className="max-h-[360px] overflow-y-auto flex flex-col gap-2 pr-1">
              <Link
                href={buildFilterHref({ region: selectedRegion, country: "" })}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                  !selectedCountry ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs" aria-hidden>
                  🌐
                </span>
                <span>{text.filterAllCountries}</span>
              </Link>
              {countriesForCountryFilter.map((destination) => (
                <Link
                  key={destination.slug}
                  href={buildFilterHref({ region: selectedRegion, country: destination.slug })}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                    selectedCountry === destination.slug
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {getFlagCode(destination.slug) ? (
                    <span
                      className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100"
                      aria-hidden
                    >
                      <img
                        src={`https://flagcdn.com/w40/${getFlagCode(destination.slug)}.png`}
                        alt={destination.name}
                        width={20}
                        height={20}
                        loading="lazy"
                        className="h-full w-full rounded-full object-cover"
                      />
                    </span>
                  ) : (
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px]" aria-hidden>
                      {destination.flag}
                    </span>
                  )}
                  <span className="truncate">{displayCountryName(destination)}</span>
                </Link>
              ))}
            </div>
          </div>

          {(selectedRegion || selectedCountry || keywordRaw) && (
            <Link
              href="/esim-du-lich"
              className="w-full inline-flex items-center justify-center bg-gray-50 text-gray-700 py-3 rounded-[10px] font-bold text-sm border border-gray-200"
            >
              {text.clearFilters}
            </Link>
          )}
        </aside>

        <main>
          {orderedByRegionEntries.map(([region, list]) => (
            <section key={region} style={{ marginBottom: "48px" }}>
              <h2 className="section-title mb-6">{displayRegionName(region)}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {list.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/esim-du-lich/${d.slug}`}
                    className="bg-white text-center text-navy no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-primary"
                    style={{
                      border: "1px solid #E2E8F0",
                      borderRadius: "16px",
                      padding: "20px",
                    }}
                  >
                    {getFlagCode(d.slug) ? (
                      <div
                        className="bg-gray-100 mx-auto flex items-center justify-center overflow-hidden"
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "50%",
                          marginBottom: "12px",
                        }}
                      >
                        <img
                          src={`https://flagcdn.com/w80/${getFlagCode(d.slug)}.png`}
                          alt={d.name}
                          width={56}
                          height={56}
                          loading="lazy"
                          className="h-full w-full rounded-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="bg-gray-100 mx-auto flex items-center justify-center"
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "50%",
                          marginBottom: "12px",
                          fontSize: "28px",
                        }}
                        aria-hidden
                      >
                        {d.flag}
                      </div>
                    )}
                    <div className="font-bold mb-1" style={{ fontSize: "15px" }}>{displayCountryName(d)}</div>
                    <div className="text-primary font-semibold" style={{ fontSize: "13px" }}>
                      {text.from} {d.startingPrice.toLocaleString("vi-VN")}đ
                    </div>
                    <div className="text-gray-500" style={{ fontSize: "12px", marginTop: "4px" }}>
                      {d.packageCount} {text.packagesAvailable}
                    </div>
                    {d.bestseller && (
                      <span
                        className="inline-block font-bold mt-1.5"
                        style={{
                          background: "#FEF3C7",
                          color: "#92400E",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "10px",
                        }}
                      >
                        {text.bestSeller}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          ))}

          {filteredDestinations.length === 0 && (
            <div
              className="bg-white text-center"
              style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "48px 24px" }}
            >
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🌏</div>
              <h2 className="text-navy font-bold" style={{ fontSize: "20px", marginBottom: "8px" }}>
                {text.emptyTitle}
              </h2>
              <p className="text-gray-500" style={{ fontSize: "14px" }}>
                {text.emptyDescription}
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
