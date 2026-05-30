import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/constants";
import { Suspense } from "react";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/api/categoriesApi";
import { ProductQueryParams } from "@/types/product";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CategoryProducts from "./CategoryProducts";

interface PageProps {
  params: { slug: string };
  searchParams: ProductQueryParams;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return { title: "Không tìm thấy danh mục", robots: { index: false } };

  return buildMetadata({
    title: category.name,
    description:
      category.description ??
      `Khám phá các sản phẩm ${category.name} chính hãng tại ${SITE.name}. Giá tốt, giao hàng nhanh.`,
    canonicalPath: `/categories/${category.slug}`,
  });
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const { products, totalPages } = await getProductsByCategory(params.slug, searchParams);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Danh mục", href: "/products" },
          { label: category.name },
        ]}
      />

      <section className="max-w-container mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Category header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-navy">{category.name}</h1>
          <p className="text-gray-500 mt-2 max-w-2xl">{category.description}</p>
        </div>

        {/* Products section with filter/sort */}
        <Suspense fallback={<ProductsLoading />}>
          <CategoryProducts
            products={products}
            totalPages={totalPages}
            categorySlug={params.slug}
          />
        </Suspense>
      </section>
    </>
  );
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="aspect-[4/3] bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-5 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
