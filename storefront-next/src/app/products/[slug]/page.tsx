import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/api/products";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductImages from "@/components/product/ProductImages";
import ProductInfo from "@/components/product/ProductInfo";
import ProductPrice from "@/components/product/ProductPrice";
import AddToCartSection from "@/components/product/AddToCartSection";
import RelatedProducts from "@/components/product/RelatedProducts";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Không tìm thấy sản phẩm" };

  return {
    title: `${product.name} - EZSim`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Sản phẩm", href: "/products" },
          { label: product.category, href: `/categories/${product.categoryId}` },
          { label: product.name },
        ]}
      />

      <section className="max-w-container mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Product detail - 2 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left: Gallery */}
          <ProductImages images={product.images} productName={product.name} />

          {/* Right: Info + Price + Actions */}
          <div className="space-y-6">
            <ProductInfo
              name={product.name}
              sku={product.sku}
              description={product.description}
              longDescription={product.longDescription}
            />

            <ProductPrice
              price={product.price}
              salePrice={product.salePrice}
              stock={product.stock}
              inStock={product.inStock}
            />

            <AddToCartSection
              productId={product.id}
              productName={product.name}
              productSlug={product.slug}
              productImage={product.image}
              productPrice={product.salePrice ?? product.price}
              stock={product.stock}
              inStock={product.inStock}
            />
          </div>
        </div>

        {/* Related products */}
        <RelatedProducts products={relatedProducts} />
      </section>
    </>
  );
}
