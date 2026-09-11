export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const s = await prisma.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  return NextResponse.json(s);
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  delete body.id;
  delete body.updatedAt;
  const s = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: body,
    create: { id: 1, ...body },
  });
  return NextResponse.json(s);
}
