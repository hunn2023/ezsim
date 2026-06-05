import { mockBlogPosts } from "@/lib/mock-blog-posts";
import type { BlogPost, BlogPostSummary } from "@/types/blog";

export const BLOG_PAGE_SIZE = 6;

export interface BlogListResult {
  posts: BlogPostSummary[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}

function sortByPublishDateDesc(a: { publishedAt: string }, b: { publishedAt: string }) {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

export async function getBlogPosts(): Promise<BlogPostSummary[]> {
  return getSortedBlogPosts().map(({ content: _content, ...summary }) => summary);
}

export async function getLatestBlogPosts(limit = 3): Promise<BlogPostSummary[]> {
  return getSortedBlogPosts()
    .slice(0, limit)
    .map(({ content: _content, ...summary }) => summary);
}

export async function getBlogPostsPage(page = 1, pageSize = BLOG_PAGE_SIZE): Promise<BlogListResult> {
  const sortedPosts = getSortedBlogPosts();
  const totalPosts = sortedPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * pageSize;

  return {
    posts: sortedPosts
      .slice(startIndex, startIndex + pageSize)
      .map(({ content: _content, ...summary }) => summary),
    currentPage,
    totalPages,
    totalPosts,
  };
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return mockBlogPosts.find((post) => post.slug === slug) ?? null;
}

export async function getRelatedBlogPosts(slug: string, limit = 3): Promise<BlogPostSummary[]> {
  return getSortedBlogPosts()
    .filter((post) => post.slug !== slug)
    .slice(0, limit)
    .map(({ content: _content, ...summary }) => summary);
}

export async function getBlogSlugs(): Promise<string[]> {
  return getSortedBlogPosts().map((post) => post.slug);
}

function getSortedBlogPosts(): BlogPost[] {
  return [...mockBlogPosts].sort(sortByPublishDateDesc);
}
