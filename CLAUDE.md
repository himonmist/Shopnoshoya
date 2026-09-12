# Development policy for this repository

These two rules are **mandatory for every change**, not suggestions — apply them without being asked again.

## 1. Test-Driven Development (TDD)

- For any new feature, bugfix, or behavior change: **write the failing test first**, then implement until it passes, then refactor.
- Tests live next to the code as `*.test.ts` and run with **Vitest** (`npm test`).
- A change is not "done" until it has a test covering the behavior it adds or fixes — this includes bugfixes (write a test that reproduces the bug before fixing it).
- Prioritize tests for: auth/session logic (`src/lib/auth.ts`), API route input validation and authorization, data transformations (slugify, image size limits, settings merging), and anything handling user input.
- UI-only rendering with no meaningful logic doesn't need a unit test, but any conditional logic inside a component (e.g. `PopupAnnouncement`'s localStorage/seen-state logic) does.
- Run `npm test` before considering any task complete. Do not ship a change with a failing or skipped test.

## 2. Security — full scrutiny, no exceptions

Every change touching an API route, auth, database query, file upload, or user input must be checked against this list before it's considered done:

- **AuthZ**: every `/api/admin/*` route must be reachable only by an authenticated admin. Verify `middleware.ts` covers new routes — new routes under `/api/admin/**` are covered automatically by the matcher, but double-check new top-level route groups.
- **Input validation**: never trust `req.json()` / `formData()` contents. Validate types, lengths, and required fields server-side even if the client form already validates.
- **Injection**: only use Prisma's query builder (parameterized) — never string-concatenate raw SQL. The one exception (`$executeRawUnsafe` in `/api/setup` and `schemaSql.ts`) only ever runs fixed, hardcoded DDL strings with no user input interpolated — keep it that way.
- **Secrets**: never commit `.env`, tokens, or connection strings. `AUTH_SECRET`, `DATABASE_URL`, `SETUP_TOKEN`, `BLOB_READ_WRITE_TOKEN` are env-only. Don't log secret values.
- **Errors**: every route handler must return JSON on error (use `withJsonErrors` from `src/lib/apiError.ts`) — never let an exception produce an empty-body response (this was a real bug, see git history).
- **File uploads**: enforce size limits (`MAX_DB_IMAGE_BYTES` in `src/lib/upload.ts`) and validate it's actually an image before storing/serving.
- **`/api/setup`**: must stay gated behind `SETUP_TOKEN` — never remove that check or make it work without a configured token.
- **Dependencies**: run `npm audit` after adding/upgrading any package; don't ship known-exploitable transitive vulnerabilities when a fixed version is available (see commit history for the Next.js/`@vercel/blob` version bumps done for exactly this reason).
- When in doubt, treat it as a security question and check rather than assume.

## Project context (for orientation, not policy)

Next.js 14 App Router + Prisma/PostgreSQL site + CMS for স্বপ্নছোঁয়া. Public pages read content server-side via `src/lib/content.ts` (always with a safe fallback if the DB is unreachable). `/admin` is a session-cookie-gated CMS (see `src/lib/auth.ts`, `middleware.ts`). `/api/setup` provisions the database schema + seed data one time via a bearer-token-gated endpoint, since this environment cannot reach the Postgres host directly over its wire protocol — see git history for why.
