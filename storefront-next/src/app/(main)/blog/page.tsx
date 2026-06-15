import type { Metadata } from "next";
import BlogPageClient from "@/app/(main)/blog/BlogPageClient";
import { getBlogPostsPage, BLOG_PAGE_SIZE } from "@/lib/api/blogApi";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Blog tin tức eSIM",
  description: "Tin tức, hướng dẫn và mẹo sử dụng eSIM khi đi du lịch quốc tế.",
  canonicalPath: "/blog",
});

interface BlogPageProps {
  searchParams?: {
    page?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = Math.max(1, Number(searchParams?.page) || 1);

  try {
    const [blogPageVi, blogPageEn] = await Promise.all([
      getBlogPostsPage(page, BLOG_PAGE_SIZE, "vi"),
      getBlogPostsPage(page, BLOG_PAGE_SIZE, "en"),
    ]);

    return <BlogPageClient blogPageVi={blogPageVi} blogPageEn={blogPageEn} />;
  } catch {
    return <BlogPageClient blogPageVi={null} blogPageEn={null} />;
  }
}
