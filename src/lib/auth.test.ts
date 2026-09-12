import { describe, it, expect, beforeAll } from "vitest";

beforeAll(() => {
  process.env.AUTH_SECRET = "test-secret-do-not-use-in-production-32chars";
});

describe("password hashing", () => {
  it("verifies a correct password against its hash", async () => {
    const { hashPassword, verifyPassword } = await import("./auth");
    const hash = await hashPassword("correct horse battery staple");
    expect(await verifyPassword("correct horse battery staple", hash)).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const { hashPassword, verifyPassword } = await import("./auth");
    const hash = await hashPassword("correct horse battery staple");
    expect(await verifyPassword("wrong password", hash)).toBe(false);
  });

  it("never stores the plaintext password in the hash", async () => {
    const { hashPassword } = await import("./auth");
    const plaintext = "correct horse battery staple";
    const hash = await hashPassword(plaintext);
    expect(hash).not.toContain(plaintext);
  });
});

describe("session tokens", () => {
  it("round-trips a valid token back to its original claims", async () => {
    const { createSessionToken, verifySessionToken } = await import("./auth");
    const token = await createSessionToken("admin_123", "admin@example.com");
    const payload = await verifySessionToken(token);
    expect(payload?.sub).toBe("admin_123");
    expect(payload?.email).toBe("admin@example.com");
  });

  it("rejects a garbage/non-JWT string", async () => {
    const { verifySessionToken } = await import("./auth");
    expect(await verifySessionToken("not-a-real-token")).toBeNull();
  });

  it("rejects a token signed with a different secret", async () => {
    const { createSessionToken, verifySessionToken } = await import("./auth");
    const token = await createSessionToken("admin_123", "admin@example.com");

    process.env.AUTH_SECRET = "a-completely-different-secret-value-here";
    const payload = await verifySessionToken(token);
    expect(payload).toBeNull();

    process.env.AUTH_SECRET = "test-secret-do-not-use-in-production-32chars";
  });

  it("rejects an empty string", async () => {
    const { verifySessionToken } = await import("./auth");
    expect(await verifySessionToken("")).toBeNull();
  });

  it("rejects a member session token even though both are signed with the same AUTH_SECRET", async () => {
    // Regression test for a real privilege-escalation bug found via manual
    // testing: the generic admin CRUD routes (lib/crud.ts) trust the
    // middleware's admin-cookie check alone with no further identity lookup,
    // so a member replaying their own valid token as the admin cookie must
    // be rejected right here, not just at the member-token side.
    const { verifySessionToken } = await import("./auth");
    const { createMemberSessionToken } = await import("./memberAuth");
    const memberToken = await createMemberSessionToken("member_123", "01700000000");
    expect(await verifySessionToken(memberToken)).toBeNull();
  });
});
