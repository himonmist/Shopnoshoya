import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentMember } from "@/lib/memberAuth";
import { withJsonErrors } from "@/lib/apiError";
import slugify from "slugify";

export const dynamic = "force-dynamic";

export const GET = withJsonErrors(async () => {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await prisma.blogPost.findMany({
    where: { authorMemberId: member.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
});

export const POST = withJsonErrors(async (req: NextRequest) => {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const title = String(body.title || "").trim();
  const content = String(body.content || "").trim();
  if (!title || !content) {
    return NextResponse.json({ error: "শিরোনাম ও লেখা আবশ্যক" }, { status: 400 });
  }

  let slug = slugify(title, { lower: true, strict: true }) || `post-${Date.now()}`;
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const post = await prisma.blogPost.create({
    data: {
      slug,
      title,
      excerpt: String(body.excerpt || "").trim() || content.slice(0, 160),
      content,
      imageUrl: String(body.imageUrl || ""),
      tag: String(body.tag || ""),
      published: false,
      authorMemberId: member.id,
      authorName: member.fullName,
    },
  });

  return NextResponse.json(post);
});
