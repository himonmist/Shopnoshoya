import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { resetAttemptStateAfterSuccess } from "@/lib/memberUtils";
import { withJsonErrors } from "@/lib/apiError";

// Protected by middleware (/api/admin/:path*) -- admin session required.
export const PUT = withJsonErrors(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const newPassword = String(body?.newPassword || "");

  if (newPassword.length < 6) {
    return NextResponse.json({ error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" }, { status: 400 });
  }

  const passwordHash = await hashPassword(newPassword);
  const { resetAttempts, resetLockedUntil } = resetAttemptStateAfterSuccess();
  await prisma.member.update({ where: { id }, data: { passwordHash, resetAttempts, resetLockedUntil } });

  return NextResponse.json({ ok: true });
});
