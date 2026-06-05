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
import { BlogSection } from "@/components/blog";
import { Suspense } from "react";

export const revalidate = 300;

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
      <Suspense
        fallback={
          <section className="py-12 md:py-16 bg-gradient-to-b from-white to-[#F8FBFF]">
            <div className="max-w-container mx-auto px-4 md:px-6">
              <div className="animate-pulse space-y-5">
                <div className="h-4 bg-gray-200 rounded w-56" />
                <div className="h-8 bg-gray-200 rounded w-72" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="rounded-2xl border border-gray-200 overflow-hidden">
                      <div className="aspect-[16/9] bg-gray-200" />
                      <div className="p-5 space-y-3">
                        <div className="h-3 bg-gray-200 rounded w-24" />
                        <div className="h-5 bg-gray-200 rounded w-4/5" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        }
      >
        <BlogSection />
      </Suspense>
    </>
  );
}
