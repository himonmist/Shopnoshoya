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

  it("rejects a forgot-password reset-proof token as a full session", async () => {
    // The reset-proof token is a one-time credential for "set new password"
    // only -- it must never be accepted as a real login session.
    const { createResetProofToken, verifyMemberSessionToken } = await import("./memberAuth");
    const proof = await createResetProofToken("member_123", "$2a$10$somePasswordHash");
    expect(await verifyMemberSessionToken(proof)).toBeNull();
  });
});

describe("forgot-password reset-proof tokens", () => {
  it("round-trips a valid proof token, carrying a password fingerprint", async () => {
    const { createResetProofToken, verifyResetProofToken } = await import("./memberAuth");
    const token = await createResetProofToken("member_123", "$2a$10$currentPasswordHashExample");
    const payload = await verifyResetProofToken(token);
    expect(payload?.sub).toBe("member_123");
    expect(typeof payload?.pwv).toBe("string");
    expect(payload!.pwv.length).toBeGreaterThan(0);
  });

  it("rejects a real member session token used as a reset proof", async () => {
    const { createMemberSessionToken, verifyResetProofToken } = await import("./memberAuth");
    const sessionToken = await createMemberSessionToken("member_123", "01700000000");
    expect(await verifyResetProofToken(sessionToken)).toBeNull();
  });

  it("rejects an admin session token used as a reset proof", async () => {
    const { createSessionToken: createAdminToken } = await import("./auth");
    const { verifyResetProofToken } = await import("./memberAuth");
    const adminToken = await createAdminToken("admin_123", "admin@example.com");
    expect(await verifyResetProofToken(adminToken)).toBeNull();
  });

  it("rejects a garbage string", async () => {
    const { verifyResetProofToken } = await import("./memberAuth");
    expect(await verifyResetProofToken("not-a-real-token")).toBeNull();
  });
});

describe("passwordFingerprint (makes the reset-proof token effectively single-use)", () => {
  it("is identical for the same password hash", async () => {
    const { passwordFingerprint } = await import("./memberAuth");
    expect(passwordFingerprint("$2a$10$sameHash")).toBe(passwordFingerprint("$2a$10$sameHash"));
  });

  it("changes when the password hash changes", async () => {
    // This is what makes replaying a used reset-proof token fail: after a
    // successful reset the stored passwordHash changes, so the token's
    // fingerprint (captured at verify-time) no longer matches.
    const { passwordFingerprint } = await import("./memberAuth");
    expect(passwordFingerprint("$2a$10$oldHash")).not.toBe(passwordFingerprint("$2a$10$newHash"));
  });

  it("never contains the actual password hash text", async () => {
    const { passwordFingerprint } = await import("./memberAuth");
    const hash = "$2a$10$averysecretbcrypthashvalue";
    expect(passwordFingerprint(hash)).not.toContain(hash);
  });
});
