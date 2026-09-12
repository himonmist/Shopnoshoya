import { describe, it, expect } from "vitest";
import { toPublicMember, formatBirthday, validateBirthday, buildMemberSearchWhere } from "./memberUtils";

const fullMember = {
  id: "m1",
  fullName: "রহিম উদ্দিন",
  phone: "01711111111",
  email: "rahim@example.com",
  passwordHash: "$2a$10$secrethashvalueshouldneverleaveserver",
  profession: "শিক্ষক",
  holding: "বি-১২",
  hobby: "বই পড়া",
  aboutYou: "আমি একজন...",
  birthDay: 15,
  birthMonth: 3,
  motiveWord: "সততা",
  photoUrl: "/gallery/g01.jpg",
  status: "approved",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("toPublicMember", () => {
  it("never includes the password hash", () => {
    const pub = toPublicMember(fullMember);
    expect(JSON.stringify(pub)).not.toContain("secrethashvalueshouldneverleave");
    expect((pub as any).passwordHash).toBeUndefined();
  });

  it("never includes contact details (phone, email)", () => {
    const pub = toPublicMember(fullMember);
    expect((pub as any).phone).toBeUndefined();
    expect((pub as any).email).toBeUndefined();
  });

  it("still includes the public-facing profile fields", () => {
    const pub = toPublicMember(fullMember);
    expect(pub.fullName).toBe("রহিম উদ্দিন");
    expect(pub.profession).toBe("শিক্ষক");
    expect(pub.holding).toBe("বি-১২");
    expect(pub.hobby).toBe("বই পড়া");
    expect(pub.aboutYou).toBe("আমি একজন...");
    expect(pub.motiveWord).toBe("সততা");
    expect(pub.photoUrl).toBe("/gallery/g01.jpg");
    expect(pub.birthDay).toBe(15);
    expect(pub.birthMonth).toBe(3);
  });
});

describe("formatBirthday", () => {
  it("formats a valid day/month in Bengali", () => {
    expect(formatBirthday(15, 3)).toBe("১৫ মার্চ");
  });

  it("returns empty string when day or month is missing", () => {
    expect(formatBirthday(null, 3)).toBe("");
    expect(formatBirthday(15, null)).toBe("");
    expect(formatBirthday(null, null)).toBe("");
  });
});

describe("validateBirthday", () => {
  it("accepts valid day/month combinations", () => {
    expect(validateBirthday(1, 1)).toBe(true);
    expect(validateBirthday(31, 12)).toBe(true);
    expect(validateBirthday(29, 2)).toBe(true); // allow leap-day as a calendar date
  });

  it("rejects out-of-range day or month", () => {
    expect(validateBirthday(0, 1)).toBe(false);
    expect(validateBirthday(32, 1)).toBe(false);
    expect(validateBirthday(15, 0)).toBe(false);
    expect(validateBirthday(15, 13)).toBe(false);
  });

  it("rejects impossible day-for-month combinations", () => {
    expect(validateBirthday(31, 4)).toBe(false); // April has 30 days
    expect(validateBirthday(30, 2)).toBe(false); // February never has 30 days
  });

  it("allows both fields empty (optional field)", () => {
    expect(validateBirthday(null, null)).toBe(true);
  });

  it("rejects only one of the two being set", () => {
    expect(validateBirthday(15, null)).toBe(false);
    expect(validateBirthday(null, 3)).toBe(false);
  });
});

describe("buildMemberSearchWhere", () => {
  it("always scopes to approved members, even with an empty query", () => {
    const where = buildMemberSearchWhere("");
    expect(where.status).toBe("approved");
    expect(where.OR).toBeUndefined();
  });

  it("scopes to approved members even when a query is given", () => {
    const where = buildMemberSearchWhere("রহিম");
    expect(where.status).toBe("approved");
  });

  it("searches name, phone, and building/flat (holding) with a query", () => {
    const where = buildMemberSearchWhere("8B2");
    expect(where.OR).toEqual([
      { fullName: { contains: "8B2", mode: "insensitive" } },
      { phone: { contains: "8B2" } },
      { holding: { contains: "8B2", mode: "insensitive" } },
    ]);
  });

  it("trims whitespace from the query", () => {
    const where = buildMemberSearchWhere("  রহিম  ");
    expect(where.OR?.[0]).toEqual({ fullName: { contains: "রহিম", mode: "insensitive" } });
  });

  it("treats a whitespace-only query the same as empty", () => {
    const where = buildMemberSearchWhere("   ");
    expect(where.OR).toBeUndefined();
  });
});
