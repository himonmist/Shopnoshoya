import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeHolding, isResetLocked, nextFailedAttemptState, resetAttemptStateAfterSuccess } from "@/lib/memberUtils";
import { createResetProofToken } from "@/lib/memberAuth";
import { withJsonErrors } from "@/lib/apiError";

const GENERIC_ERROR = "তথ্য মিলছে না। ফোন নম্বর ও বিল্ডিং/ফ্ল্যাট নং সঠিকভাবে দিন।";

// No SMS/email service is configured, so identity here is verified with
// phone + building/flat alone -- lower-entropy than a real OTP. The lockout
// below (see memberUtils.ts) exists specifically to blunt brute-forcing
// this. Known, accepted limitation: a "locked out" response does confirm
// the phone number exists in the system (a non-existent phone can never
// reach the lockout branch), which a full anti-enumeration design would
// also hide -- not implemented here as disproportionate for this app's
// actual risk profile (a small, invite-only community), but worth stating
// plainly rather than leaving undocumented.
export const POST = withJsonErrors(async (req: NextRequest) => {
  const body = await req.json().catch(() => null);
  const phone = String(body?.phone || "").trim();
  const holding = String(body?.holding || "").trim();

  if (!phone || !holding) {
    return NextResponse.json({ error: "ফোন নম্বর ও বিল্ডিং/ফ্ল্যাট নং দিন" }, { status: 400 });
  }

  const member = await prisma.member.findUnique({ where: { phone } });
  if (!member) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }

  if (isResetLocked(member.resetLockedUntil)) {
    return NextResponse.json(
      { error: "অনেকবার ভুল তথ্য দেওয়া হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন, অথবা অ্যাডমিনের সাহায্য নিন।" },
      { status: 429 }
    );
  }

  const matches = member.status === "approved" && !!member.holdingKey && member.holdingKey === normalizeHolding(holding);

  if (!matches) {
    const { resetAttempts, resetLockedUntil } = nextFailedAttemptState(member.resetAttempts);
    await prisma.member.update({ where: { id: member.id }, data: { resetAttempts, resetLockedUntil } });
    if (resetLockedUntil) {
      return NextResponse.json(
        { error: "অনেকবার ভুল তথ্য দেওয়া হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন, অথবা অ্যাডমিনের সাহায্য নিন।" },
        { status: 429 }
      );
    }
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }

  const { resetAttempts, resetLockedUntil } = resetAttemptStateAfterSuccess();
  await prisma.member.update({ where: { id: member.id }, data: { resetAttempts, resetLockedUntil } });

  const token = await createResetProofToken(member.id, member.passwordHash);
  return NextResponse.json({ ok: true, token });
});
