import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentMember } from "@/lib/memberAuth";
import { validateBirthday } from "@/lib/members";
import { withJsonErrors } from "@/lib/apiError";

export const dynamic = "force-dynamic";

function omitPasswordHash<T extends { passwordHash?: string }>(member: T) {
  const { passwordHash, ...rest } = member;
  return rest;
}

export const GET = withJsonErrors(async () => {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(omitPasswordHash(member));
});

export const PUT = withJsonErrors(async (req: NextRequest) => {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const fullName = String(body.fullName ?? member.fullName).trim();
  const phone = String(body.phone ?? member.phone).trim();
  if (!fullName || !phone) {
    return NextResponse.json({ error: "নাম ও ফোন নম্বর আবশ্যক" }, { status: 400 });
  }

  const birthDay = body.birthDay === "" || body.birthDay === null || body.birthDay === undefined ? null : Number(body.birthDay);
  const birthMonth = body.birthMonth === "" || body.birthMonth === null || body.birthMonth === undefined ? null : Number(body.birthMonth);
  if (!validateBirthday(birthDay, birthMonth)) {
    return NextResponse.json({ error: "জন্মদিন সঠিক নয় (দিন ১-৩১, মাস ১-১২, দুটোই দিন অথবা দুটোই ফাঁকা)" }, { status: 400 });
  }

  if (phone !== member.phone) {
    const existing = await prisma.member.findUnique({ where: { phone } });
    if (existing && existing.id !== member.id) {
      return NextResponse.json({ error: "এই ফোন নম্বর অন্য একজন সদস্য ব্যবহার করছেন" }, { status: 409 });
    }
  }

  const updated = await prisma.member.update({
    where: { id: member.id },
    data: {
      fullName,
      phone,
      email: String(body.email ?? member.email),
      holding: String(body.holding ?? member.holding),
      profession: String(body.profession ?? member.profession),
      hobby: String(body.hobby ?? member.hobby),
      aboutYou: String(body.aboutYou ?? member.aboutYou),
      motiveWord: String(body.motiveWord ?? member.motiveWord),
      photoUrl: String(body.photoUrl ?? member.photoUrl),
      birthDay,
      birthMonth,
    },
  });

  return NextResponse.json(omitPasswordHash(updated));
});
