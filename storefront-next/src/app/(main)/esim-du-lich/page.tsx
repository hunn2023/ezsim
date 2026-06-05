import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui";
import { getEsimCountries } from "@/lib/api/esimApi";
import type { EsimCountrySummary } from "@/types/esim";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "eSIM Du lịch 200+ quốc gia | EZSIM",
  description: "Chọn quốc gia bạn đang đến để xem các gói eSIM phù hợp. Kích hoạt 30 giây.",
};

export default async function EsimDuLichPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const destinations = await getEsimCountries();
  const keyword = searchParams?.q?.trim().toLowerCase() ?? "";
  const filteredDestinations = keyword
    ? destinations.filter(
        (destination) =>
          destination.name.toLowerCase().includes(keyword) ||
          destination.region.toLowerCase().includes(keyword)
      )
    : destinations;

  const byRegion = filteredDestinations.reduce<Record<string, EsimCountrySummary[]>>((acc, d) => {
    (acc[d.region] ??= []).push(d);
    return acc;
  }, {});

  return (
    <>
      <Breadcrumb items={[{ label: "eSIM Du lịch" }]} />

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
          <h1 className="text-white mb-3">eSIM Du lịch 200+ quốc gia</h1>
          <p className="text-white/90 max-w-[680px]" style={{ fontSize: "16px" }}>
            Kết nối ngay khi đặt chân tới bất kỳ quốc gia nào. Quét QR là dùng — không cần tháo SIM gốc, không lo roaming.
          </p>
          {keyword && (
            <p className="text-white/90 mt-4" style={{ fontSize: "14px" }}>
              Kết quả tìm kiếm cho <b>{searchParams?.q}</b>: {filteredDestinations.length} điểm đến phù hợp.
            </p>
          )}
        </div>
      </section>

      <div className="max-w-container mx-auto px-6" style={{ padding: "32px 24px" }}>
        {Object.entries(byRegion).map(([region, list]) => (
          <section key={region} style={{ marginBottom: "48px" }}>
            <h2 className="section-title mb-6">{region}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
                  <div
                    className="bg-gray-100 mx-auto flex items-center justify-center"
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      marginBottom: "12px",
                      fontSize: "32px",
                    }}
                  >
                    {d.flag}
                  </div>
                  <div className="font-bold mb-1" style={{ fontSize: "15px" }}>{d.name}</div>
                  <div className="text-primary font-semibold" style={{ fontSize: "13px" }}>
                    Từ {d.startingPrice.toLocaleString("vi-VN")}đ
                  </div>
                  <div className="text-gray-500" style={{ fontSize: "12px", marginTop: "4px" }}>
                    {d.packageCount} gói khả dụng
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
                      🔥 BÁN CHẠY
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
              Chưa có điểm đến phù hợp
            </h2>
            <p className="text-gray-500" style={{ fontSize: "14px" }}>
              Thử tìm theo tên quốc gia khác hoặc quay lại danh sách đầy đủ.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
