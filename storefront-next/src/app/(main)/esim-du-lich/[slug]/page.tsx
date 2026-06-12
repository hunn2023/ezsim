import type { Metadata } from "next";
import EsimCountryPageClient from "./EsimCountryPageClient";

export const dynamicParams = false;

export async function generateStaticParams() {
  return [
    { slug: "nhat-ban" },
    { slug: "han-quoc" },
    { slug: "thai-lan" },
    { slug: "chau-au" },
    { slug: "my" },
    { slug: "singapore" },
    { slug: "dai-loan" },
    { slug: "trung-quoc" },
    { slug: "uc" },
    { slug: "canada" },
  ];
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const nameMap: Record<string, string> = {
    "nhat-ban": "Nhật Bản",
    "han-quoc": "Hàn Quốc",
    "thai-lan": "Thái Lan",
    "chau-au": "Châu Âu",
    "my": "Mỹ",
    "singapore": "Singapore",
    "dai-loan": "Đài Loan",
    "trung-quoc": "Trung Quốc",
    "uc": "Úc",
    "canada": "Canada",
  };
  const name = nameMap[params.slug] ?? params.slug;
  return {
    title: `eSIM ${name} - Kết nối ngay khi đặt chân | EZSIM`,
  };
}

export default function EsimCountryPage({ params }: { params: { slug: string } }) {
  return <EsimCountryPageClient slug={params.slug} />;
}
