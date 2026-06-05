import type { BlogPost, BlogPostSummary } from "@/types/blog";

const BLOG_API_BASE = process.env.NEXT_PUBLIC_BLOG_API_BASE;

function getApiBase(): string {
  if (!BLOG_API_BASE) {
    throw new Error("NEXT_PUBLIC_BLOG_API_BASE is not configured");
  }
  return BLOG_API_BASE;
}

// Placeholder for real backend integration. This layer is intentionally not wired yet.
export async function fetchBlogPostsHttp(): Promise<BlogPostSummary[]> {
  const response = await fetch(`${getApiBase()}/blog`, {
    method: "GET",
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch blog posts");
  }

  return response.json() as Promise<BlogPostSummary[]>;
}

export async function fetchBlogPostBySlugHttp(slug: string): Promise<BlogPost | null> {
  const response = await fetch(`${getApiBase()}/blog/${encodeURIComponent(slug)}`, {
    method: "GET",
    next: { revalidate: 300 },
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error("Failed to fetch blog post");
  }

  return response.json() as Promise<BlogPost>;
}
