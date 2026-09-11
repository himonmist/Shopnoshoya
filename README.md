# স্বপ্নছোঁয়া (Shopnoshoya)

Official website for **স্বপ্নছোঁয়া**, a morning-exercise & community organization in Shopnonogor, Mirpur-9, Dhaka. Built from the provided design with a full content-management system so an admin can edit every page, manage images, and publish blog posts without touching code.

## Stack

- **Next.js 14** (App Router, TypeScript) — public site + admin panel in one app
- **PostgreSQL** via **Prisma ORM** — all content lives in the database
- **Vercel Blob** — image uploads from the admin panel
- Custom lightweight session auth (signed JWT cookie, `jose` + `bcryptjs`) — no third-party auth service required

## What's editable from the admin panel (`/admin`)

| Section | What you can do |
|---|---|
| সাইট কনটেন্ট (Settings) | Hero headline/description/images, homepage announcement, stats, about text, contact info, footer |
| কার্যক্রম (Activities) | Add/edit/delete activity cards shown on the homepage & Activities page |
| ইভেন্ট (Events) | Add/edit/delete past & upcoming events |
| গ্যালারি (Gallery) | Add/edit/delete/reorder gallery photos, upload new ones |
| টিপস (Tips) | Manage Fitness Tips & Healthy Lifestyle page content |
| ব্লগ (Blog) | Full blog CRUD — title, slug, cover image, tag, content, publish/unpublish |
| বার্তা (Messages) | View contact-form messages and membership applications submitted by visitors |

All public pages read directly from the database, so admin changes appear on the live site immediately — no rebuild needed.

## 1. Local setup

```bash
npm install
cp .env.example .env   # then fill in the values below
npm run db:push        # creates tables in your Postgres database
npm run db:seed        # loads the initial content + creates the admin account
npm run dev
```

### Environment variables (`.env`)

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Your PostgreSQL connection string (see step 2 below) |
| `AUTH_SECRET` | Any long random string, e.g. `openssl rand -base64 32` |
| `BLOB_READ_WRITE_TOKEN` | From Vercel Blob storage (see step 4) — optional locally, required for the admin panel's image upload button in production |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credentials for the first admin account created by `npm run db:seed` |

## 2. Create a free PostgreSQL database

Any managed Postgres works. The easiest option that pairs with Vercel:

1. Go to **[neon.tech](https://neon.tech)** → sign up (free tier is enough) → **Create a project**.
2. Copy the connection string it gives you (starts with `postgresql://...?sslmode=require`).
3. Paste it into `DATABASE_URL` in `.env` (locally) and later as a Vercel environment variable.

(Vercel Postgres or Supabase work exactly the same way — just use the connection string they give you.)

## 3. Push this code to GitHub

This repository is already connected to **https://github.com/himonmist/Shopnoshoya**. If you're setting it up fresh elsewhere:

```bash
git init
git remote add origin https://github.com/himonmist/Shopnoshoya.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

## 4. Deploy to Vercel

1. Go to **[vercel.com/new](https://vercel.com/new)** and import the `himonmist/Shopnoshoya` GitHub repository.
2. Vercel auto-detects Next.js — no build settings to change.
3. Before the first deploy, add these **Environment Variables** in the Vercel project settings:
   - `DATABASE_URL` — from step 2
   - `AUTH_SECRET` — a long random string
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` — the account you'll log into `/admin` with
4. In the Vercel project, go to **Storage → Create Database → Blob**, connect it to the project. This automatically adds `BLOB_READ_WRITE_TOKEN` for you (needed so the admin panel can upload images).
5. Deploy.
6. After the first successful deploy, run the database migration + seed **once** from your local machine (pointed at the production `DATABASE_URL`):

   ```bash
   DATABASE_URL="<your production connection string>" npm run db:push
   DATABASE_URL="<your production connection string>" ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="a-strong-password" npm run db:seed
   ```

   This creates all tables, loads the starting content (from the original design) and creates your admin login.
7. Visit `https://<your-vercel-domain>/admin/login` and sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set above.

From then on, every push to the `main` branch auto-deploys via Vercel, and all content edits happen live through `/admin` — no redeploys needed for content changes.

## Project structure

```
prisma/schema.prisma      Database schema (Settings, Activities, Events, Gallery, Tips, Blog, Messages, Admin)
prisma/seed.ts             Initial content loader (matches the original design copy)
src/app/                   Public pages (App Router) + /admin panel + /api routes
src/components/            Shared UI (Nav, Footer, forms) + admin/ (sidebar, generic CRUD table/editor)
src/lib/                   Prisma client, auth (session cookies), content fetchers, Blob upload helper
public/gallery/            The 31 photos from the original design
```

## Notes

- The public pages are resilient: if the database isn't reachable yet, they render with sensible default copy instead of crashing (useful right after a fresh deploy, before you've run `db:push`/`db:seed`).
- The `/login` page is a **member portal** placeholder (matches the original design) where visitors can submit a membership application, which lands in `/admin` → বার্তা. It isn't wired to real member accounts — this can be built out further on request.
- `npm audit` flags a build-time-only `postcss` advisory pulled in transitively by Next.js 14.2.x tooling; it affects source-map handling during the build step, not the deployed runtime.
