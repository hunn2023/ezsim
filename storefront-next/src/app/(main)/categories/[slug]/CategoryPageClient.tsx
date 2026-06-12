"use client";

import { useEffect, useState } from "react";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/api/categoriesApi";
import type { Category, Product } from "@/types/product";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CategoryProducts from "./CategoryProducts";

export default function CategoryPageClient({ slug }: { slug: string }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const cat = await getCategoryBySlug(slug);
      setCategory(cat);
      if (cat) {
        const result = await getProductsByCategory(slug, {});
        setProducts(result.products);
        setTotalPages(result.totalPages);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-container mx-auto px-4 md:px-6 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-5 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-container mx-auto px-4 md:px-6 py-10 text-center">
        <h1 className="text-2xl font-bold text-navy">Không tìm thấy danh mục</h1>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Danh mục", href: "/esim-du-lich" },
          { label: category.name },
        ]}
      />

      <section className="max-w-container mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-navy">{category.name}</h1>
          {category.description && (
            <p className="text-gray-500 mt-2 max-w-2xl">{category.description}</p>
          )}
        </div>

        <CategoryProducts
          products={products}
          totalPages={totalPages}
          categorySlug={slug}
        />
      </section>
    </>
  );
}
