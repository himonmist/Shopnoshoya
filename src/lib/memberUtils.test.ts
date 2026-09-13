import { describe, it, expect } from "vitest";
import {
  toPublicMember,
  formatBirthday,
  validateBirthday,
  validateBirthYear,
  buildMemberSearchWhere,
  normalizeHolding,
  isResetLocked,
  nextFailedAttemptState,
  resetAttemptStateAfterSuccess,
  RESET_MAX_ATTEMPTS,
} from "./memberUtils";

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

describe("validateBirthYear", () => {
  const currentYear = new Date().getFullYear();

  it("allows an empty year (optional field)", () => {
    expect(validateBirthYear(null)).toBe(true);
    expect(validateBirthYear(undefined)).toBe(true);
  });

  it("accepts a plausible birth year", () => {
    expect(validateBirthYear(1990)).toBe(true);
    expect(validateBirthYear(1900)).toBe(true);
    expect(validateBirthYear(currentYear)).toBe(true);
  });

  it("rejects a year in the future or before 1900", () => {
    expect(validateBirthYear(currentYear + 1)).toBe(false);
    expect(validateBirthYear(1899)).toBe(false);
  });

  it("rejects a non-integer", () => {
    expect(validateBirthYear(1990.5)).toBe(false);
  });
});

describe("normalizeHolding", () => {
  it("strips slashes, spaces, and dashes", () => {
    expect(normalizeHolding("8/B2")).toBe("8b2");
    expect(normalizeHolding("06/E10")).toBe("06e10");
    expect(normalizeHolding("B - 12")).toBe("b12");
  });

  it("lowercases the result", () => {
    expect(normalizeHolding("8B2")).toBe("8b2");
  });

  it("returns an empty string for empty input", () => {
    expect(normalizeHolding("")).toBe("");
    expect(normalizeHolding("   ")).toBe("");
  });

  it("makes differently-formatted equivalent addresses match", () => {
    expect(normalizeHolding("8/B2")).toBe(normalizeHolding("8 B 2"));
    expect(normalizeHolding("8/B2")).toBe(normalizeHolding("8-B-2"));
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

  it("searches name and phone as typed, and building/flat via the normalized holdingKey", () => {
    const where = buildMemberSearchWhere("8/B2");
    expect(where.OR).toEqual([
      { fullName: { contains: "8/B2", mode: "insensitive" } },
      { phone: { contains: "8/B2" } },
      { holdingKey: { contains: "8b2" } },
    ]);
  });

  it("normalizes the building/flat query so formatting differences don't block a match", () => {
    // Searching "8B2" (no separators) must still be able to match a stored
    // "8/B2" via holdingKey, since both normalize to "8b2".
    const where = buildMemberSearchWhere("8B2");
    expect(where.OR?.[2]).toEqual({ holdingKey: { contains: "8b2" } });
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

describe("forgot-password lockout state machine", () => {
  const now = new Date("2026-01-01T12:00:00Z");

  describe("isResetLocked", () => {
    it("is not locked when there's no lockedUntil", () => {
      expect(isResetLocked(null, now)).toBe(false);
      expect(isResetLocked(undefined, now)).toBe(false);
    });

    it("is not locked once the lockedUntil time has passed", () => {
      const past = new Date(now.getTime() - 1000);
      expect(isResetLocked(past, now)).toBe(false);
    });

    it("is locked while lockedUntil is still in the future", () => {
      const future = new Date(now.getTime() + 1000);
      expect(isResetLocked(future, now)).toBe(true);
    });
  });

  describe("nextFailedAttemptState", () => {
    it("increments attempts without locking, below the max", () => {
      const state = nextFailedAttemptState(0, now);
      expect(state.resetAttempts).toBe(1);
      expect(state.resetLockedUntil).toBeNull();
    });

    it("keeps incrementing right up to one below the max", () => {
      const state = nextFailedAttemptState(RESET_MAX_ATTEMPTS - 2, now);
      expect(state.resetAttempts).toBe(RESET_MAX_ATTEMPTS - 1);
      expect(state.resetLockedUntil).toBeNull();
    });

    it("locks out and resets the counter once the max is reached", () => {
      const state = nextFailedAttemptState(RESET_MAX_ATTEMPTS - 1, now);
      expect(state.resetAttempts).toBe(0);
      expect(state.resetLockedUntil).not.toBeNull();
      expect(state.resetLockedUntil!.getTime()).toBeGreaterThan(now.getTime());
    });
  });

  describe("resetAttemptStateAfterSuccess", () => {
    it("clears both the attempt counter and any lockout", () => {
      const state = resetAttemptStateAfterSuccess();
      expect(state.resetAttempts).toBe(0);
      expect(state.resetLockedUntil).toBeNull();
    });
  });
});
