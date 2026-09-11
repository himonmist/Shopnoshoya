import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));
  const member = await prisma.memberApplication.update({
    where: { id: params.id },
    data: { status: body.status || "pending" },
  });
  return NextResponse.json(member);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.memberApplication.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
