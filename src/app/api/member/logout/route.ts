import { NextResponse } from "next/server";
import { clearMemberSessionCookie } from "@/lib/memberAuth";

export async function POST() {
  await clearMemberSessionCookie();
  return NextResponse.json({ ok: true });
}
