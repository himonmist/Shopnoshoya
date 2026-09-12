import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const COOKIE_NAME = "shopnoshoya_member_session";
const alg = "HS256";
const TYP = "member";

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function createMemberSessionToken(memberId: string, phone: string) {
  return new SignJWT({ sub: memberId, phone, typ: TYP })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecretKey());
}

/** Verifies a member session token. Rejects tokens missing the member `typ`
 *  claim, which keeps member and admin tokens mutually unusable even though
 *  both are signed with the same AUTH_SECRET (defense-in-depth). */
export async function verifyMemberSessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (payload.typ !== TYP) return null;
    return payload as { sub: string; phone: string; typ: string };
  } catch {
    return null;
  }
}

export async function setMemberSessionCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearMemberSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Returns the logged-in member's full record, or null if not logged in,
 *  the token is invalid, or the account is no longer approved (rejected /
 *  suspended members lose access immediately even with a valid token). */
export async function getCurrentMember() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifyMemberSessionToken(token);
  if (!payload) return null;
  const member = await prisma.member.findUnique({ where: { id: payload.sub } });
  if (!member || member.status !== "approved") return null;
  return member;
}

export const MEMBER_SESSION_COOKIE_NAME = COOKIE_NAME;
