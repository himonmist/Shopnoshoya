import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seedData";
import { SCHEMA_STATEMENTS } from "@/lib/schemaSql";

export const dynamic = "force-dynamic";

// One-time, secret-protected endpoint: creates all tables (if missing) and
// loads the initial content + admin account. Call once after first deploy,
// then remove SETUP_TOKEN from the project's environment variables to lock
// it down permanently (the route always 404s without a configured token).
export async function POST(req: NextRequest) {
  const configuredToken = process.env.SETUP_TOKEN;
  if (!configuredToken) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const providedToken = req.headers.get("x-setup-token");
  if (providedToken !== configuredToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    return NextResponse.json({ error: "ADMIN_EMAIL / ADMIN_PASSWORD not configured" }, { status: 500 });
  }

  // Best-effort: apply every statement and keep going past failures (e.g. a
  // UNIQUE constraint that can't be added yet because of pre-existing
  // duplicate data) so one problem statement never blocks the rest of an
  // incremental migration. Every failure is reported back, never hidden.
  const schemaResults: string[] = [];
  for (const [i, stmt] of SCHEMA_STATEMENTS.entries()) {
    try {
      await prisma.$executeRawUnsafe(stmt);
      schemaResults.push(`[${i + 1}] ok`);
    } catch (err: any) {
      const message = err?.meta?.message || err?.message || String(err);
      if (/already exists/i.test(message)) {
        schemaResults.push(`[${i + 1}] already existed, skipped`);
      } else {
        schemaResults.push(`[${i + 1}] FAILED: ${message}`);
      }
    }
  }

  try {
    await seedDatabase(prisma, { adminEmail, adminPassword });
  } catch (err: any) {
    return NextResponse.json({ error: `Seeding failed: ${err?.message || err}`, schemaResults }, { status: 500 });
  }

  const hasFailures = schemaResults.some((r) => r.includes("FAILED"));
  return NextResponse.json({ ok: !hasFailures, schemaResults });
}
