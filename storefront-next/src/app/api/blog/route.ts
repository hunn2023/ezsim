import { NextResponse } from "next/server";
import { BLOG_PAGE_SIZE, getBlogPostsPage } from "@/lib/api/blogApi";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const limit = Number(url.searchParams.get("limit") ?? String(BLOG_PAGE_SIZE));
  const result = await getBlogPostsPage(page, limit);
  return NextResponse.json(result);
}
