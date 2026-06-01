import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import HeroBanner from "@/components/home/HeroBanner";
import TrustBar from "@/components/home/TrustBar";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import PopularDestinations from "@/components/home/PopularDestinations";
import HowItWorks from "@/components/home/HowItWorks";
import GamePromo from "@/components/home/GamePromo";
import Testimonials from "@/components/home/Testimonials";

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
      <TrustBar />
      <FeaturedCategories />
      <PopularDestinations />
      <HowItWorks />
      <GamePromo />
      <Testimonials />
    </>
  );
}
