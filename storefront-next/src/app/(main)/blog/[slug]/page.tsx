import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui";
import { BlogDetail } from "@/components/blog";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/api/blogApi";
import { LANGUAGE_COOKIE, normalizeLanguage } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

interface BlogDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const language = normalizeLanguage(cookies().get(LANGUAGE_COOKIE)?.value);
  const post = await getBlogPostBySlug(params.slug, language);

  if (!post) {
    return buildMetadata({
      title: "Bài viết không tồn tại",
      description:
        language === "vi"
          ? "Bài viết bạn tìm không tồn tại hoặc đã được gỡ bỏ."
          : "The article you requested does not exist or has been removed.",
      canonicalPath: `/blog/${params.slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    image: post.thumbnail,
    canonicalPath: `/blog/${post.slug}`,
    type: "article",
  });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const language = normalizeLanguage(cookies().get(LANGUAGE_COOKIE)?.value);
  const post = await getBlogPostBySlug(params.slug, language);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedBlogPosts(post.slug, 3, language);

  const breadcrumbLabel = language === "vi" ? "Blog tin tức" : "Blog";

  return (
    <>
      <Breadcrumb
        items={[
          { label: breadcrumbLabel, href: "/blog" },
          { label: post.title },
        ]}
      />

      <BlogDetail
        title={post.title}
        excerpt={post.excerpt}
        thumbnail={post.thumbnail}
        publishedAt={post.publishedAt}
        author={post.author}
        content={post.content}
        relatedPosts={relatedPosts}
        language={language}
      />
    </>
  );
}
