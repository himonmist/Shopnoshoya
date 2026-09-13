// Pure, client-safe member utilities — no Prisma import here (this file is
// imported directly by client components; anything Prisma-dependent lives
// in lib/members.ts, which is server-only).

const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const BENGALI_MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];
const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function toBengaliDigits(n: number) {
  return String(n).split("").map((d) => BENGALI_DIGITS[Number(d)] ?? d).join("");
}

/** Formats a day-of-month + month-of-year (no year is ever stored) as a
 *  Bengali date string, e.g. formatBirthday(15, 3) -> "১৫ মার্চ". */
export function formatBirthday(day: number | null | undefined, month: number | null | undefined) {
  if (!day || !month) return "";
  const name = BENGALI_MONTHS[month - 1];
  if (!name) return "";
  return `${toBengaliDigits(day)} ${name}`;
}

/** Validates a day/month pair with no year: both must be present and form a
 *  real calendar date (Feb capped at 29 to allow leap-day birthdays), or
 *  both must be absent (the field is optional). */
export function validateBirthday(day: number | null | undefined, month: number | null | undefined) {
  const hasDay = day !== null && day !== undefined;
  const hasMonth = month !== null && month !== undefined;
  if (!hasDay && !hasMonth) return true;
  if (hasDay !== hasMonth) return false;
  if (!Number.isInteger(month) || month! < 1 || month! > 12) return false;
  if (!Number.isInteger(day) || day! < 1 || day! > 31) return false;
  return day! <= DAYS_IN_MONTH[month! - 1];
}

/** Validates an optional birth year. Captured during profile entry for the
 *  member's/admin's own record-keeping only — the public site and the
 *  member directory only ever display day+month (formatBirthday), never
 *  the year. */
export function validateBirthYear(year: number | null | undefined) {
  if (year === null || year === undefined) return true;
  if (!Number.isInteger(year)) return false;
  const currentYear = new Date().getFullYear();
  return year >= 1900 && year <= currentYear;
}

export type PublicMember = {
  id: string;
  fullName: string;
  photoUrl: string;
  profession: string;
  holding: string;
  hobby: string;
  aboutYou: string;
  birthDay: number | null;
  birthMonth: number | null;
  motiveWord: string;
};

export type DirectoryMember = PublicMember & { phone: string; email: string };

/** Strips a Member record down to only the fields safe to show publicly —
 *  an explicit allowlist (not a denylist) so a new sensitive field added to
 *  the Member model later can never leak here by accident. Never include
 *  passwordHash, phone, or email in this projection. */
export function toPublicMember(member: {
  id: string;
  fullName: string;
  photoUrl: string;
  profession: string;
  holding: string;
  hobby: string;
  aboutYou: string;
  birthDay: number | null;
  birthMonth: number | null;
  motiveWord: string;
  [key: string]: unknown;
}): PublicMember {
  return {
    id: member.id,
    fullName: member.fullName,
    photoUrl: member.photoUrl,
    profession: member.profession,
    holding: member.holding,
    hobby: member.hobby,
    aboutYou: member.aboutYou,
    birthDay: member.birthDay,
    birthMonth: member.birthMonth,
    motiveWord: member.motiveWord,
  };
}

/** Strips everything except ASCII letters and digits and lowercases the
 *  result, so differently-formatted building/flat entries ("8/B2", "8 B 2",
 *  "8-B-2") all normalize to the same search key ("8b2"). Stored alongside
 *  `holding` as `holdingKey` (set at signup and on profile update) and used
 *  for matching instead of the raw, free-form `holding` text.
 *  IMPORTANT: kept in exact lockstep with the SQL backfill in schemaSql.ts
 *  (`lower(regexp_replace(holding, '[^a-zA-Z0-9]', '', 'g'))`) — change
 *  both together, or search results will disagree with newly-saved values. */
export function normalizeHolding(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export const RESET_MAX_ATTEMPTS = 5;
export const RESET_LOCKOUT_MINUTES = 15;

/** Whether a forgot-password identity check is currently locked out. There
 *  is no SMS/email OTP service configured, so identity for a password reset
 *  is verified with phone + building/flat alone — inherently lower-entropy
 *  than a real OTP, which is exactly why this lockout exists: without it,
 *  an attacker who knows (or guesses) a member's phone number could brute
 *  force building/flat combinations. */
export function isResetLocked(lockedUntil: Date | null | undefined, now: Date = new Date()) {
  return !!lockedUntil && lockedUntil.getTime() > now.getTime();
}

/** Computes the next (resetAttempts, resetLockedUntil) state after one
 *  failed identity-verification attempt. Locks out for RESET_LOCKOUT_MINUTES
 *  once RESET_MAX_ATTEMPTS is reached, and resets the counter to 0 at the
 *  same time so the member gets a fresh set of attempts once the lock
 *  expires. */
export function nextFailedAttemptState(currentAttempts: number, now: Date = new Date()) {
  const attempts = currentAttempts + 1;
  if (attempts >= RESET_MAX_ATTEMPTS) {
    return { resetAttempts: 0, resetLockedUntil: new Date(now.getTime() + RESET_LOCKOUT_MINUTES * 60 * 1000) };
  }
  return { resetAttempts: attempts, resetLockedUntil: null as Date | null };
}

/** Clears the attempt counter and any lockout after a successful identity
 *  verification (or a successful password reset). */
export function resetAttemptStateAfterSuccess() {
  return { resetAttempts: 0, resetLockedUntil: null as Date | null };
}

/** Builds the Prisma `where` clause for the member-only directory search —
 *  a pure function so the "always scoped to approved members, never leaks
 *  pending/rejected applicants" guarantee is unit-testable without a
 *  database. Matches name and phone as typed, and building/flat via the
 *  normalized holdingKey so formatting differences (slashes, spaces,
 *  dashes) never block a match (phone is matched case-sensitively since
 *  digits have no case). */
export function buildMemberSearchWhere(query: string) {
  const q = query.trim();
  const where: { status: "approved"; OR?: any[] } = { status: "approved" };
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
      { holdingKey: { contains: normalizeHolding(q) } },
    ];
  }
  return where;
}
