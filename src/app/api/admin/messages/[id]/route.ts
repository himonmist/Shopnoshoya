import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withJsonErrors } from "@/lib/apiError";

export const PUT = withJsonErrors(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const message = await prisma.contactMessage.update({
    where: { id },
    data: { read: body.read ?? true },
  });
  return NextResponse.json(message);
});

export const DELETE = withJsonErrors(async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  await prisma.contactMessage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
