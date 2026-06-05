import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumb } from "@/components/ui";
import { BlogDetail } from "@/components/blog";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/api/blogApi";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

const getCachedBlogPostBySlug = cache(async (slug: string) => getBlogPostBySlug(slug));

interface BlogDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const post = await getCachedBlogPostBySlug(params.slug);

  if (!post) {
    return buildMetadata({
      title: "Bài viết không tồn tại",
      description: "Bài viết bạn tìm không tồn tại hoặc đã được gỡ bỏ.",
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
  const post = await getCachedBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedBlogPosts(post.slug, 3);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Blog tin tức", href: "/blog" },
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
      />
    </>
  );
}
