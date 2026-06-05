import Link from "next/link";
import BlogCard from "./BlogCard";
import type { BlogListPageData } from "@/types/blog";

interface BlogListProps extends BlogListPageData {
  basePath?: string;
}

export default function BlogList({ posts, currentPage, totalPages, totalPosts, basePath = "/blog" }: BlogListProps) {
  const createPageHref = (page: number) => (page <= 1 ? basePath : `${basePath}?page=${page}`);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-gray-500">{totalPosts} bài viết</p>
        <p className="text-sm text-gray-500">Trang {currentPage}/{totalPages}</p>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-gray-500">
          Chưa có bài viết nào trong chuyên mục này.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 flex-wrap" aria-label="Phân trang blog">
              <Link
                href={createPageHref(Math.max(1, currentPage - 1))}
                aria-disabled={currentPage <= 1}
                className={`btn-outline btn-sm ${currentPage <= 1 ? "pointer-events-none opacity-40" : ""}`}
              >
                Trang trước
              </Link>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <Link
                  key={page}
                  href={createPageHref(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition ${
                    page === currentPage
                      ? "border-primary bg-primary text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary"
                  }`}
                >
                  {page}
                </Link>
              ))}

              <Link
                href={createPageHref(Math.min(totalPages, currentPage + 1))}
                aria-disabled={currentPage >= totalPages}
                className={`btn-outline btn-sm ${currentPage >= totalPages ? "pointer-events-none opacity-40" : ""}`}
              >
                Trang sau
              </Link>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
