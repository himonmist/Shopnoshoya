import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentMember } from "@/lib/memberAuth";
import { withJsonErrors } from "@/lib/apiError";

export const PUT = withJsonErrors(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post || post.authorMemberId !== member.id) {
    return NextResponse.json({ error: "লেখাটি খুঁজে পাওয়া যায়নি" }, { status: 404 });
  }
  if (post.published) {
    return NextResponse.json({ error: "প্রকাশিত লেখা সম্পাদনা করা যাবে না, যোগাযোগ পাতার মাধ্যমে অ্যাডমিনকে জানান" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const title = String(body.title || post.title).trim();
  const content = String(body.content || post.content).trim();
  if (!title || !content) {
    return NextResponse.json({ error: "শিরোনাম ও লেখা আবশ্যক" }, { status: 400 });
  }

  const updated = await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      content,
      excerpt: String(body.excerpt ?? post.excerpt),
      imageUrl: String(body.imageUrl ?? post.imageUrl),
      tag: String(body.tag ?? post.tag),
    },
  });

  return NextResponse.json(updated);
});

export const DELETE = withJsonErrors(async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post || post.authorMemberId !== member.id) {
    return NextResponse.json({ error: "লেখাটি খুঁজে পাওয়া যায়নি" }, { status: 404 });
  }

  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
