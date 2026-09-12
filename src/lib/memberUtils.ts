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

/** Builds the Prisma `where` clause for the member-only directory search —
 *  a pure function so the "always scoped to approved members, never leaks
 *  pending/rejected applicants" guarantee is unit-testable without a
 *  database. Matches name, phone, or building/flat (holding) as a
 *  case-insensitive substring (phone is matched case-sensitively since
 *  digits have no case, which also sidesteps Postgres's `mode: insensitive`
 *  requiring a citext/ILIKE index consideration for numeric-only columns). */
export function buildMemberSearchWhere(query: string) {
  const q = query.trim();
  const where: { status: "approved"; OR?: any[] } = { status: "approved" };
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
      { holding: { contains: q, mode: "insensitive" } },
    ];
  }
  return where;
}
