export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";
import { withJsonErrors } from "@/lib/apiError";

export const GET = withJsonErrors(async () => {
  const posts = await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
  return NextResponse.json(posts);
});

export const POST = withJsonErrors(async (req: NextRequest) => {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  delete body.id;

  let slug = String(body.slug || body.title || "").trim();
  slug = slug ? slugify(slug, { lower: true, strict: true }) : `post-${Date.now()}`;

  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const post = await prisma.blogPost.create({
    data: {
      slug,
      title: body.title || "শিরোনামহীন",
      excerpt: body.excerpt || "",
      content: body.content || "",
      imageUrl: body.imageUrl || "",
      tag: body.tag || "",
      authorName: body.authorName || "",
      published: body.published ?? true,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
    },
  });
  return NextResponse.json(post);
});
