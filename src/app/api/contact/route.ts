import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const subject = String(body.subject || "").trim();
  const message = String(body.message || "").trim();

  if (!name || !phone || !message) {
    return NextResponse.json({ error: "নাম, ফোন নম্বর ও বার্তা আবশ্যক" }, { status: 400 });
  }

  try {
    await prisma.contactMessage.create({ data: { name, phone, subject, message } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "সার্ভার ত্রুটি, আবার চেষ্টা করুন" }, { status: 500 });
  }
}
