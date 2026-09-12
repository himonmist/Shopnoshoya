import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const COOKIE_NAME = "shopnoshoya_admin_session";
const alg = "HS256";

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

const TYP = "admin";

export async function createSessionToken(adminId: string, email: string) {
  return new SignJWT({ sub: adminId, email, typ: TYP })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecretKey());
}

/** Verifies an admin session token. Rejects tokens missing the admin `typ`
 *  claim — critically, this includes member session tokens, which are
 *  signed with the same AUTH_SECRET. Without this check, a member's own
 *  valid session token could be replayed as the admin cookie and reach
 *  admin API routes that rely on middleware alone (see lib/crud.ts) with no
 *  further identity check of their own. */
export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (payload.typ !== TYP) return null;
    return payload as { sub: string; email: string };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getCurrentAdmin() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifySessionToken(token);
  if (!payload) return null;
  const admin = await prisma.admin.findUnique({ where: { id: payload.sub } });
  return admin;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
