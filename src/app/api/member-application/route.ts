import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const fullName = String(body.fullName || "").trim();
  const holding = String(body.holding || "").trim();
  const phone = String(body.phone || "").trim();

  if (!fullName || !phone) {
    return NextResponse.json({ error: "নাম ও ফোন নম্বর আবশ্যক" }, { status: 400 });
  }

  try {
    await prisma.memberApplication.create({ data: { fullName, holding, phone } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "সার্ভার ত্রুটি, আবার চেষ্টা করুন" }, { status: 500 });
  }
}
