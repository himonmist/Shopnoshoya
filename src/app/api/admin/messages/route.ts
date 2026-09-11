export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withJsonErrors } from "@/lib/apiError";

export const GET = withJsonErrors(async () => {
  const [messages, members] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.memberApplication.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  return NextResponse.json({ messages, members });
});
