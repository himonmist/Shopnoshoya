import { prisma } from "./prisma";
import { buildMemberSearchWhere, type PublicMember, type DirectoryMember } from "./memberUtils";

export { formatBirthday, validateBirthday, toPublicMember, buildMemberSearchWhere } from "./memberUtils";
export type { PublicMember, DirectoryMember } from "./memberUtils";

const PUBLIC_MEMBER_SELECT = {
  id: true,
  fullName: true,
  photoUrl: true,
  profession: true,
  holding: true,
  hobby: true,
  aboutYou: true,
  birthDay: true,
  birthMonth: true,
  motiveWord: true,
} as const;

/** Fetches approved members for the public directory. Uses an explicit
 *  Prisma `select` (not a full findMany + filter) so passwordHash/phone/
 *  email never leave the database layer at all. */
export async function getApprovedMembers(): Promise<PublicMember[]> {
  try {
    return await prisma.member.findMany({
      where: { status: "approved" },
      select: PUBLIC_MEMBER_SELECT,
      orderBy: { fullName: "asc" },
    });
  } catch {
    return [];
  }
}

const DIRECTORY_SELECT = {
  ...PUBLIC_MEMBER_SELECT,
  phone: true,
  email: true,
} as const;

const DIRECTORY_PAGE_SIZE = 20;

/** Fetches one page of the member-only directory (full contact details
 *  included — never passwordHash), optionally filtered by a search query
 *  against name / phone / building+flat. Only ever returns approved
 *  members. Caller (the API route) is responsible for requiring a logged-in
 *  member session before calling this. */
export async function searchApprovedMembers({ page = 1, query = "" }: { page?: number; query?: string }) {
  const where = buildMemberSearchWhere(query);
  const safePage = Math.max(1, Math.floor(page) || 1);
  const [members, total] = await Promise.all([
    prisma.member.findMany({
      where,
      select: DIRECTORY_SELECT,
      orderBy: { fullName: "asc" },
      skip: (safePage - 1) * DIRECTORY_PAGE_SIZE,
      take: DIRECTORY_PAGE_SIZE,
    }),
    prisma.member.count({ where }),
  ]);
  return { members: members as DirectoryMember[], total, page: safePage, pageSize: DIRECTORY_PAGE_SIZE };
}
