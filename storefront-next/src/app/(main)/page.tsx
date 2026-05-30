import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import {
  HeroBanner,
  FeaturedCategories,
  FeaturedProducts,
  NewProducts,
  PromotionSection,
} from "@/components/home";

export const metadata: Metadata = buildMetadata({
  absoluteTitle: `${SITE.name} - ${SITE.tagline} | eSIM, Thẻ ĐT, Thẻ Game, Data 4G/5G`,
  description:
    "Mua eSIM du lịch 200+ quốc gia, thẻ viễn thông, thẻ game, gói Data 4G/5G — kích hoạt tức thì, giá tốt nhất. Giao dịch an toàn, hỗ trợ 24/7.",
  canonicalPath: "/",
});

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <FeaturedCategories />
      <FeaturedProducts />
      <NewProducts />
      <PromotionSection />
    </>
  );
}
