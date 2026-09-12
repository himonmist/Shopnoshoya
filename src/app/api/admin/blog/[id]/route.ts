import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";
import { withJsonErrors } from "@/lib/apiError";

export const PUT = withJsonErrors(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const data: any = {
    title: body.title,
    excerpt: body.excerpt,
    content: body.content,
    imageUrl: body.imageUrl,
    tag: body.tag,
    authorName: body.authorName,
    published: body.published,
  };
  if (body.publishedAt) data.publishedAt = new Date(body.publishedAt);
  if (body.slug) {
    const slug = slugify(String(body.slug), { lower: true, strict: true });
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing || existing.id === id) data.slug = slug;
  }

  const post = await prisma.blogPost.update({ where: { id }, data });
  return NextResponse.json(post);
});

export const DELETE = withJsonErrors(async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
