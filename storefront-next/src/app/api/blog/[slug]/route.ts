import { NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/api/blogApi";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}
