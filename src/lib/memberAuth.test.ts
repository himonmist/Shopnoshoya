import { describe, it, expect, beforeAll } from "vitest";

beforeAll(() => {
  process.env.AUTH_SECRET = "test-secret-do-not-use-in-production-32chars";
});

describe("member session tokens", () => {
  it("round-trips a valid token back to its original claims", async () => {
    const { createMemberSessionToken, verifyMemberSessionToken } = await import("./memberAuth");
    const token = await createMemberSessionToken("member_123", "01700000000");
    const payload = await verifyMemberSessionToken(token);
    expect(payload?.sub).toBe("member_123");
    expect(payload?.phone).toBe("01700000000");
  });

  it("rejects a garbage/non-JWT string", async () => {
    const { verifyMemberSessionToken } = await import("./memberAuth");
    expect(await verifyMemberSessionToken("not-a-real-token")).toBeNull();
  });

  it("rejects a token signed with a different secret", async () => {
    const { createMemberSessionToken, verifyMemberSessionToken } = await import("./memberAuth");
    const token = await createMemberSessionToken("member_123", "01700000000");

    process.env.AUTH_SECRET = "a-completely-different-secret-value-here";
    expect(await verifyMemberSessionToken(token)).toBeNull();
    process.env.AUTH_SECRET = "test-secret-do-not-use-in-production-32chars";
  });

  it("rejects an admin session token even though both are signed with the same AUTH_SECRET", async () => {
    // Defense-in-depth: a member token must never be usable as an admin token or vice
    // versa, even though they share a signing secret and could theoretically collide.
    const { createSessionToken: createAdminToken } = await import("./auth");
    const { verifyMemberSessionToken } = await import("./memberAuth");
    const adminToken = await createAdminToken("admin_123", "admin@example.com");
    expect(await verifyMemberSessionToken(adminToken)).toBeNull();
  });
});
