import {
  HeroBanner,
  FeaturedCategories,
  FeaturedProducts,
  NewProducts,
  PromotionSection,
} from "@/components/home";

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
