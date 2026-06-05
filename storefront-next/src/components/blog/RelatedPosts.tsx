import Link from "next/link";
import BlogCard from "./BlogCard";
import type { BlogPostSummary } from "@/types/blog";

interface RelatedPostsProps {
  posts: BlogPostSummary[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-14">
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <p className="text-sm font-semibold text-primary uppercase tracking-[0.18em] mb-2">
            Bài viết liên quan
          </p>
          <h2 className="text-2xl font-bold text-navy">Đọc thêm</h2>
        </div>
        <Link
          href="/blog"
          className="text-primary font-semibold hover:underline hidden md:inline-flex"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
