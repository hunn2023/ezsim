import type { Metadata } from "next";
import EsimDuLichWrapper from "./EsimDuLichWrapper";

export const metadata: Metadata = {
  title: "eSIM Du lịch 200+ quốc gia | EZSIM",
  description: "Chọn quốc gia bạn đang đến để xem các gói eSIM phù hợp. Kích hoạt 30 giây.",
};

export default function EsimDuLichPage() {
  return <EsimDuLichWrapper />;
}
