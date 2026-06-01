import Link from "next/link";
import Icon from "@/components/ui/Icon";

interface Destination {
  flag: string;
  flagCode: string;
  name: string;
  price: string;
  bestseller?: boolean;
  slug: string;
}

const destinations: Destination[] = [
  { flag: "🇯🇵", flagCode: "jp", name: "Nhật Bản", price: "Từ 99.000đ", bestseller: true, slug: "nhat-ban" },
  { flag: "🇰🇷", flagCode: "kr", name: "Hàn Quốc", price: "Từ 89.000đ", bestseller: true, slug: "han-quoc" },
  { flag: "🇹🇭", flagCode: "th", name: "Thái Lan", price: "Từ 69.000đ", slug: "thai-lan" },
  { flag: "🇨🇳", flagCode: "cn", name: "Trung Quốc", price: "Từ 99.000đ", slug: "trung-quoc" },
  { flag: "🇸🇬", flagCode: "sg", name: "Singapore", price: "Từ 79.000đ", slug: "singapore" },
  { flag: "🇺🇸", flagCode: "us", name: "Mỹ", price: "Từ 199.000đ", slug: "my" },
  { flag: "🇫🇷", flagCode: "fr", name: "Pháp", price: "Từ 159.000đ", slug: "phap" },
  { flag: "🇬🇧", flagCode: "gb", name: "Anh Quốc", price: "Từ 169.000đ", slug: "anh-quoc" },
  { flag: "🇩🇪", flagCode: "de", name: "Đức", price: "Từ 149.000đ", slug: "duc" },
  { flag: "🇦🇺", flagCode: "au", name: "Úc", price: "Từ 189.000đ", slug: "uc" },
  { flag: "🇲🇾", flagCode: "my", name: "Malaysia", price: "Từ 69.000đ", slug: "malaysia" },
  { flag: "🇪🇺", flagCode: "eu", name: "Châu Âu", price: "Từ 249.000đ", slug: "chau-au" },
];

export default function PopularDestinations() {
  return (
    <section style={{ padding: "0 0 64px" }}>
      <div className="max-w-container mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="section-title">Điểm đến phổ biến</h2>
            <p className="section-subtitle">Top quốc gia khách Việt Nam mua nhiều nhất</p>
          </div>
          <Link
            href="/esim-du-lich"
            className="text-primary font-semibold flex items-center gap-1.5 hover:opacity-80 transition"
            style={{ fontSize: "14px" }}
          >
            Xem tất cả 200+ quốc gia <Icon icon="arrow-right" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {destinations.map((d) => (
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
                  border: "1px solid #E2E8F0",
                  overflow: "hidden",
                }}
                aria-label={`Cờ ${d.name}`}
              >
                <img
                  src={`https://flagcdn.com/w80/${d.flagCode}.png`}
                  alt={d.flag}
                  width={56}
                  height={56}
                  loading="lazy"
                  style={{ width: "56px", height: "56px", objectFit: "cover" }}
                />
              </div>
              <div className="font-bold mb-1" style={{ fontSize: "15px" }}>
                {d.name}
              </div>
              <div className="text-primary font-semibold" style={{ fontSize: "13px" }}>
                {d.price}
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
      </div>
    </section>
  );
}
