import Link from "next/link";
import { BlogCard } from "@/components/blog";
import { getLatestBlogPosts } from "@/lib/api/blogApi";

export default async function BlogSection() {
  const posts = await getLatestBlogPosts(3);

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white to-[#F8FBFF]">
      <div className="max-w-container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-[0.18em] mb-2">
              Tin tức tổng hợp
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-navy">
              Bài viết mới nhất
            </h2>
            <p className="text-gray-500 mt-2 max-w-2xl">
              Cập nhật kinh nghiệm, mẹo chọn gói và hướng dẫn sử dụng eSIM dành
              cho mọi chuyến đi.
            </p>
          </div>

          <Link
            href="/blog"
            className="text-primary font-semibold hover:underline inline-flex items-center gap-2"
          >
            Xem tất cả bài viết
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-gray-500">
            Chưa có bài viết nào để hiển thị.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
