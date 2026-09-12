import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { createMemberSessionToken, setMemberSessionCookie } from "@/lib/memberAuth";
import { withJsonErrors } from "@/lib/apiError";

export const POST = withJsonErrors(async (req: NextRequest) => {
  const body = await req.json().catch(() => null);
  const phone = String(body?.phone || "").trim();
  const password = String(body?.password || "");

  if (!phone || !password) {
    return NextResponse.json({ error: "ফোন নম্বর ও পাসওয়ার্ড দিন" }, { status: 400 });
  }

  const member = await prisma.member.findUnique({ where: { phone } });
  if (!member || !member.passwordHash) {
    return NextResponse.json({ error: "ভুল ফোন নম্বর বা পাসওয়ার্ড" }, { status: 401 });
  }

  const valid = await verifyPassword(password, member.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "ভুল ফোন নম্বর বা পাসওয়ার্ড" }, { status: 401 });
  }

  if (member.status === "pending") {
    return NextResponse.json({ error: "আপনার সদস্যপদের আবেদন এখনো অনুমোদনের অপেক্ষায় আছে" }, { status: 403 });
  }
  if (member.status === "rejected") {
    return NextResponse.json({ error: "আপনার সদস্যপদের আবেদন গৃহীত হয়নি। বিস্তারিত জানতে যোগাযোগ করুন।" }, { status: 403 });
  }
  if (member.status !== "approved") {
    return NextResponse.json({ error: "আপনার একাউন্টে প্রবেশাধিকার নেই" }, { status: 403 });
  }

  const token = await createMemberSessionToken(member.id, member.phone);
  await setMemberSessionCookie(token);

  return NextResponse.json({ ok: true });
});
