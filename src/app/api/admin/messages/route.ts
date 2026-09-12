export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withJsonErrors } from "@/lib/apiError";

export const GET = withJsonErrors(async () => {
  const [messages, members] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.member.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        holding: true,
        phone: true,
        email: true,
        profession: true,
        hobby: true,
        aboutYou: true,
        birthDay: true,
        birthMonth: true,
        motiveWord: true,
        photoUrl: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        // passwordHash intentionally excluded — never sent to the client, admin included
      },
    }),
  ]);
  return NextResponse.json({ messages, members });
});
