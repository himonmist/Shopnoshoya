import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { withJsonErrors } from "@/lib/apiError";

export const POST = withJsonErrors(async (req: NextRequest) => {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const fullName = String(body.fullName || "").trim();
  const holding = String(body.holding || "").trim();
  const phone = String(body.phone || "").trim();
  const password = String(body.password || "");

  if (!fullName || !phone || !password) {
    return NextResponse.json({ error: "নাম, ফোন নম্বর ও পাসওয়ার্ড আবশ্যক" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" }, { status: 400 });
  }

  const existing = await prisma.member.findUnique({ where: { phone } });
  if (existing) {
    return NextResponse.json({ error: "এই ফোন নম্বর দিয়ে ইতিমধ্যে আবেদন করা হয়েছে" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  await prisma.member.create({
    data: { fullName, holding, phone, passwordHash, status: "pending" },
  });

  return NextResponse.json({ ok: true });
});
