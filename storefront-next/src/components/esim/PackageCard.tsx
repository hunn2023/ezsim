import Icon from "@/components/ui/Icon";
import type { EsimPackage } from "@/types/esim";

interface PackageCardProps {
  pkg: EsimPackage;
  onBuy?: (pkg: EsimPackage) => void;
}

export default function PackageCard({ pkg, onBuy }: PackageCardProps) {
  const tagStyles: Record<NonNullable<EsimPackage["tagType"]>, { bg: string; color: string }> = {
    default:   { bg: "rgba(0,102,255,0.1)", color: "#0066FF" },
    unlimited: { bg: "#FEF3C7",              color: "#92400E" },
    popular:   { bg: "#DCFCE7",              color: "#166534" },
  };
  const tagStyle = tagStyles[pkg.tagType || "default"];

  return (
    <div
      className="bg-white relative transition-all flex flex-col group hover:-translate-y-0.5"
      style={{
        borderRadius: "16px",
        padding: "24px",
        border: pkg.featured ? "2px solid #0066FF" : "1.5px solid #E2E8F0",
      }}
    >
      {pkg.featuredLabel && (
        <span
          className="absolute text-white font-bold"
          style={{
            top: "-12px",
            left: "24px",
            background: "#0066FF",
            padding: "4px 12px",
            borderRadius: "6px",
            fontSize: "11px",
          }}
        >
          {pkg.featuredLabel}
        </span>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div
            className="font-extrabold text-navy"
            style={{ fontSize: "28px", letterSpacing: "-0.5px" }}
          >
            {pkg.data}{" "}
            <span className="text-gray-500 font-medium" style={{ fontSize: "14px" }}>
              {pkg.dataUnit}
            </span>
          </div>
          <div className="text-gray-500" style={{ fontSize: "13px", marginTop: "4px" }}>
            {pkg.subtitle}
          </div>
        </div>
        <span
          className="font-bold"
          style={{
            background: tagStyle.bg,
            color: tagStyle.color,
            padding: "4px 10px",
            borderRadius: "6px",
            fontSize: "11px",
          }}
        >
          {pkg.tag}
        </span>
      </div>

      {/* Features */}
      <ul className="list-none flex-grow" style={{ margin: "16px 0" }}>
        {pkg.features.map((f) => (
          <li
            key={f}
            className="flex items-center gap-2 text-gray-700"
            style={{ fontSize: "13px", padding: "4px 0" }}
          >
            <Icon icon="check-circle" className="text-primary" style={{ width: "16px" }} /> {f}
          </li>
        ))}
      </ul>

      {/* Divider */}
      <div style={{ borderTop: "1px solid #F1F5F9", margin: "16px 0" }} />

      {/* Footer */}
      <div className="flex justify-between items-end gap-3">
        <div>
          {pkg.oldPrice && (
            <div
              className="line-through text-gray-500"
              style={{ fontSize: "13px", marginBottom: "2px" }}
            >
              {pkg.oldPrice.toLocaleString("vi-VN")}đ
            </div>
          )}
          <div>
            <span
              className="font-extrabold text-navy"
              style={{ fontSize: "24px", letterSpacing: "-0.5px" }}
            >
              {pkg.price.toLocaleString("vi-VN")}
              <span className="text-gray-500" style={{ fontSize: "14px", marginLeft: "2px" }}>
                đ
              </span>
            </span>
            {pkg.discount && (
              <span
                className="font-bold ml-2"
                style={{
                  background: "#FEE2E2",
                  color: "#991B1B",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontSize: "11px",
                }}
              >
                {pkg.discount}
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onBuy?.(pkg)}
          className="gradient-primary text-white font-bold no-underline flex items-center gap-1.5 hover:scale-[1.02] transition"
          style={{
            padding: "12px 20px",
            borderRadius: "10px",
            fontSize: "14px",
          }}
        >
          Mua ngay <Icon icon="arrow-right" />
        </button>
      </div>
    </div>
  );
}
