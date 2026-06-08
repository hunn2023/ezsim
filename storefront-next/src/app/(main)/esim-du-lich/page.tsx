import type { Metadata } from "next";
import { Suspense } from "react";
import EsimDuLichContent from "./EsimDuLichContent";
import { getEsimCountries } from "@/lib/api/esimApi";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "eSIM Du lịch 200+ quốc gia | EZSIM",
  description: "Chọn quốc gia bạn đang đến để xem các gói eSIM phù hợp. Kích hoạt 30 giây.",
};

export default async function EsimDuLichPage() {
  const destinations = await getEsimCountries();

  return (
    <Suspense fallback={null}>
      <EsimDuLichContent destinations={destinations} />
    </Suspense>
  );
}
