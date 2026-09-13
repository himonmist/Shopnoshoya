import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyResetProofToken, passwordFingerprint } from "@/lib/memberAuth";
import { hashPassword } from "@/lib/auth";
import { withJsonErrors } from "@/lib/apiError";

const EXPIRED_MESSAGE = "সময় শেষ হয়ে গেছে, আবার শুরু করুন";

export const POST = withJsonErrors(async (req: NextRequest) => {
  const body = await req.json().catch(() => null);
  const token = String(body?.token || "");
  const newPassword = String(body?.newPassword || "");

  if (!token || !newPassword) {
    return NextResponse.json({ error: "টোকেন ও নতুন পাসওয়ার্ড আবশ্যক" }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" }, { status: 400 });
  }

  const payload = await verifyResetProofToken(token);
  if (!payload) {
    return NextResponse.json({ error: EXPIRED_MESSAGE }, { status: 401 });
  }

  const member = await prisma.member.findUnique({ where: { id: payload.sub } });
  // The fingerprint check makes this token single-use: it was computed from
  // the password hash at the moment identity was verified, so a token
  // replayed after a successful reset (which changes the hash) fails here
  // with the same "expired" message -- no need to distinguish "used" from
  // "expired" to the caller, since neither reveals anything useful anyway.
  if (!member || passwordFingerprint(member.passwordHash) !== payload.pwv) {
    return NextResponse.json({ error: EXPIRED_MESSAGE }, { status: 401 });
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.member.update({ where: { id: member.id }, data: { passwordHash } });

  return NextResponse.json({ ok: true });
});
