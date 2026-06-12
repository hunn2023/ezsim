import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import CategoryPageClient from "./CategoryPageClient";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return [
    { slug: "esim" },
    { slug: "the-nap" },
    { slug: "the-game" },
    { slug: "data" },
  ];
}

export function generateMetadata({ params }: PageProps): Metadata {
  const nameMap: Record<string, string> = {
    esim: "eSIM Du lịch",
    "the-nap": "Thẻ Viễn thông",
    "the-game": "Thẻ Game",
    data: "Data 4G/5G",
  };
  const name = nameMap[params.slug] ?? params.slug;
  return {
    title: `${name} | ${SITE.name}`,
    description: `Khám phá các sản phẩm ${name} chính hãng tại ${SITE.name}. Giá tốt, giao hàng nhanh.`,
  };
}

export default function CategoryPage({ params }: PageProps) {
  return <CategoryPageClient slug={params.slug} />;
}
