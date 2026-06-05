import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui";
import { BlogList } from "@/components/blog";
import { getBlogPostsPage, BLOG_PAGE_SIZE } from "@/lib/api/blogApi";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "Blog tin tức eSIM",
  description: "Tin tức, hướng dẫn và mẹo sử dụng eSIM khi đi du lịch quốc tế.",
  canonicalPath: "/blog",
});

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  try {
    const requestedPage = Number(searchParams?.page ?? "1");
    const page =
      Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const { posts, currentPage, totalPages, totalPosts } =
      await getBlogPostsPage(page, BLOG_PAGE_SIZE);

    return (
      <>
        <Breadcrumb items={[{ label: "Tin tổng hợp", href: "/blog" }]} />

        <section className="max-w-container mx-auto px-4 md:px-6 py-6 md:py-10">
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-navy">
              Tin tức tổng hợp
            </h1>
            <p className="text-gray-500 mt-2 max-w-3xl">
              Cập nhật xu hướng, kinh nghiệm và hướng dẫn sử dụng eSIM để bạn
              luôn chủ động trong mỗi chuyến đi.
            </p>
          </header>

          {totalPosts === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-10 text-center">
              <h2 className="text-xl font-bold text-navy">Chưa có bài viết</h2>
              <p className="text-gray-500 mt-2">
                Nội dung sẽ được cập nhật sớm.
              </p>
            </div>
          ) : (
            <BlogList
              posts={posts}
              currentPage={currentPage}
              totalPages={totalPages}
              totalPosts={totalPosts}
            />
          )}
        </section>
      </>
    );
  } catch {
    return (
      <>
        <Breadcrumb items={[{ label: "Blog tin tức" }]} />
        <section className="max-w-container mx-auto px-4 md:px-6 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
            Không thể tải danh sách bài viết. Vui lòng thử lại sau.
          </div>
        </section>
      </>
    );
  }
}
