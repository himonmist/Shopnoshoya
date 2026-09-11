export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [messages, members] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.memberApplication.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  return NextResponse.json({ messages, members });
}
