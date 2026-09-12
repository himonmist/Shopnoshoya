import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withJsonErrors } from "@/lib/apiError";

export const PUT = withJsonErrors(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const member = await prisma.member.update({
    where: { id },
    data: { status: body.status || "pending" },
  });
  const { passwordHash, ...safeMember } = member;
  return NextResponse.json(safeMember);
});

export const DELETE = withJsonErrors(async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  await prisma.member.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
