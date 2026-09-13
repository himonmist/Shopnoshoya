import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentMember } from "@/lib/memberAuth";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { withJsonErrors } from "@/lib/apiError";

export const POST = withJsonErrors(async (req: NextRequest) => {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const currentPassword = String(body?.currentPassword || "");
  const newPassword = String(body?.newPassword || "");

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "বর্তমান ও নতুন পাসওয়ার্ড দিন" }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" }, { status: 400 });
  }

  const valid = await verifyPassword(currentPassword, member.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "বর্তমান পাসওয়ার্ড সঠিক নয়" }, { status: 401 });
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.member.update({ where: { id: member.id }, data: { passwordHash } });

  return NextResponse.json({ ok: true });
});
