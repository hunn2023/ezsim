"use client";

import { Breadcrumb } from "@/components/ui";
import { BlogList } from "@/components/blog";
import { useLanguage } from "@/hooks/useLanguage";
import type { BlogListResult } from "@/lib/api/blogApi";

interface BlogPageClientProps {
  blogPageVi: BlogListResult | null;
  blogPageEn: BlogListResult | null;
}

export default function BlogPageClient({ blogPageVi, blogPageEn }: BlogPageClientProps) {
  const { language } = useLanguage();
  const text = {
    breadcrumb: language === "vi" ? "Tin tổng hợp" : "Blog",
    heading: language === "vi" ? "Tin tức tổng hợp" : "News & insights",
    subtitle:
      language === "vi"
        ? "Cập nhật xu hướng, kinh nghiệm và hướng dẫn sử dụng eSIM để bạn luôn chủ động trong mỗi chuyến đi."
        : "Latest trends, practical tips, and eSIM guides to help you stay connected on every trip.",
    emptyTitle: language === "vi" ? "Chưa có bài viết" : "No posts yet",
    emptyDescription: language === "vi" ? "Nội dung sẽ được cập nhật sớm." : "New content will be published soon.",
    loadError:
      language === "vi"
        ? "Không thể tải danh sách bài viết. Vui lòng thử lại sau."
        : "Unable to load blog posts. Please try again later.",
  };

  const blogPage = language === "en" ? blogPageEn : blogPageVi;

  if (!blogPage) {
    return (
      <>
        <Breadcrumb items={[{ label: text.breadcrumb }]} />
        <section className="max-w-container mx-auto px-4 md:px-6 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
            {text.loadError}
          </div>
        </section>
      </>
    );
  }

  const { posts, currentPage, totalPages, totalPosts } = blogPage;

  return (
    <>
      <Breadcrumb items={[{ label: text.breadcrumb, href: "/blog" }]} />

      <section className="max-w-container mx-auto px-4 md:px-6 py-6 md:py-10">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-navy">{text.heading}</h1>
          <p className="text-gray-500 mt-2 max-w-3xl">{text.subtitle}</p>
        </header>

        {totalPosts === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-10 text-center">
            <h2 className="text-xl font-bold text-navy">{text.emptyTitle}</h2>
            <p className="text-gray-500 mt-2">{text.emptyDescription}</p>
          </div>
        ) : (
          <BlogList
            posts={posts}
            currentPage={currentPage}
            totalPages={totalPages}
            totalPosts={totalPosts}
            language={language}
          />
        )}
      </section>
    </>
  );
}
