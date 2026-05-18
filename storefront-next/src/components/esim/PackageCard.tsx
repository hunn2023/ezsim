import Icon from "@/components/ui/Icon";
import Link from "next/link";

export interface PackageData {
  data: string;
  dataUnit: string;
  subtitle: string;
  tag: string;
  tagType?: "default" | "unlimited" | "popular";
  features: string[];
  price: number;
  oldPrice?: number;
  discount?: string;
  featured?: boolean;
  featuredLabel?: string;
}

export default function PackageCard({ pkg }: { pkg: PackageData }) {
  const tagStyles = {
    default: "bg-primary/10 text-primary",
    unlimited: "bg-amber-100 text-amber-800",
    popular: "bg-green-100 text-green-800",
  };

  return (
    <div className={`bg-white rounded-2xl p-6 border-[1.5px] relative transition-all flex flex-col hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,102,255,0.08)] ${
      pkg.featured ? "border-primary border-2" : "border-gray-200"
    }`}>
      {pkg.featuredLabel && (
        <span className="absolute -top-3 left-6 bg-primary text-white px-3 py-1 rounded-md text-[11px] font-bold">
          {pkg.featuredLabel}
        </span>
      )}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-[28px] font-extrabold text-navy tracking-tight">
            {pkg.data} <span className="text-sm text-gray-500 font-medium">{pkg.dataUnit}</span>
          </div>
          <div className="text-[13px] text-gray-500 mt-1">{pkg.subtitle}</div>
        </div>
        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${tagStyles[pkg.tagType || "default"]}`}>
          {pkg.tag}
        </span>
      </div>

      <ul className="my-4 flex-grow space-y-1">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-[13px] text-gray-700 py-1">
            <Icon icon="check-circle" className="text-primary w-4" /> {f}
          </li>
        ))}
      </ul>

      <div className="border-t border-gray-100 my-4" />

      <div className="flex justify-between items-end gap-3">
        <div>
          {pkg.oldPrice && (
            <div className="line-through text-gray-500 text-[13px] mb-0.5">
              {pkg.oldPrice.toLocaleString("vi-VN")}đ
            </div>
          )}
          <span className="text-2xl font-extrabold text-navy tracking-tight">
            {pkg.price.toLocaleString("vi-VN")}
            <span className="text-sm text-gray-500 ml-0.5">đ</span>
          </span>
          {pkg.discount && (
            <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-md text-[11px] font-bold ml-2">
              {pkg.discount}
            </span>
          )}
        </div>
        <Link href="#" className="gradient-primary text-white py-3 px-5 rounded-[10px] font-bold text-sm flex items-center gap-1.5 no-underline hover:scale-[1.02] transition">
          Mua ngay <Icon icon="arrow-right" />
        </Link>
      </div>
    </div>
  );
}
