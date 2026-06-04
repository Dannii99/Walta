# Setup Plan

How to set up **Walta — Tu dinero, más claro** locally and contribute to the **shipped MVP**. For the architectural *why*, see [`architecture.md`](./architecture.md). For module-by-module details, see [`module-reference.md`](./module-reference.md). For the agent quickstart, see [`../AGENTS.md`](../AGENTS.md).

## 1. Prerequisites

- **Node.js 20+** (Next.js 16 requires Node 20.9+).
- **npm** (this project uses npm; pnpm is not configured and `package-lock.json` is the source of truth).
- **A Neon Postgres database** (or any Postgres 15+ instance). Get a free Neon DB at <https://neon.tech>.
- **A GROQ API key** (for the AI features). Get one at <https://console.groq.com>.

## 2. Stack (Real, Not Proposed)

The dependencies below are exactly what is in `package.json` at the time of writing. Versions matter; the project does not work with older majors.

### Core
- `next@16.2.6` (App Router, Turbopack default)
- `react@19.2.4` + `react-dom@19.2.4`
- `typescript@5.x` (strict mode)

### Data
- `prisma@7.8.0` (client generated to `generated/prisma/`)
- `@prisma/adapter-neon` + `@neondatabase/serverless@1.1.x` (Prisma 7 requires the adapter)

### UI
- `tailwindcss@4.x` — **CSS-based config** in `app/globals.css` via `@theme inline`. **No `tailwind.config.ts`**.
- `shadcn/ui` (style: `base-nova`) — 13 components in `components/ui/`, manually installed.
- `recharts@3.8.1` — 4 modules use it.
- `framer-motion@12.40.0` — counters, stagger, page transitions, `AnimatePresence`.
- `lucide-react` — **all icons are Lucide** (no heroicons, no react-icons).
- `tw-animate-css@1.4.0` — required by Tailwind v4 for animate utilities.

### State
- `react-hook-form@7.76.1` + `@hookform/resolvers@5.4.0` + `zod@4.4.3`
- `next-themes@0.4.6` — `attribute="class"`, `storageKey="walta-theme"`, `disableTransitionOnChange`
- `sonner@2.0.7` — toasts

### Auth
- `next-auth@5.0.0-beta.31` (Auth.js v5) with hardcoded `CredentialsProvider`. JWT strategy.

### Money
- `dinero.js@2.0.2` — used only in `lib/currency.ts` (math). UI uses `Intl.NumberFormat` directly via `formatCOP`.

### Testing
- `vitest@4.1.7` (unit, jsdom env) — 119 tests in 9 files
- `@playwright/test@1.60.0` (E2E) — installed, no specs yet

### Lint
- `eslint@9.x` (flat config in `eslint.config.mjs`)

### Installed but not used (candidates for removal)

- `zustand@5.0.14` — 0 imports in source. Legacy from initial scaffolding.
- `next-pwa@5.6.0` — **incompatible with Next 16 + Turbopack**. In `package.json` but **NOT** in `next.config.ts`. The `/offline` page is a static fallback.
- `@tanstack/react-query@5.100.14` — configured in `app/providers.tsx` for future use, but 0 `useQuery` in production pages. Data flow is Server Component → Prisma → render.

## 3. First Run

```bash
# 1. Clone and install
git clone <repo-url> presupuesto-app
cd presupuesto-app
npm install

# 2. Environment variables
cat > .env <<EOF
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
GROQ_API_KEY="gsk_..."
EOF

# 3. Prisma: generate client + push schema
npx prisma generate
npx prisma db push

# 4. (Optional) seed demo data for the timeline
npx tsx scripts/seed-timeline-demo.ts

# 5. Start dev server
npm run dev
# → http://localhost:3000
# Login: demo@example.com / demo123
```

## 4. Project Structure (Top Level)

```
presupuesto-app/
├── app/                      # Next.js App Router (see module-reference.md)
│   ├── (auth)/login/         # Public login
│   ├── (dashboard)/          # Protected routes (sidebar layout)
│   │   ├── dashboard/        # KPIs, donut, health cards
│   │   ├── expenses/         # Gastos
│   │   ├── reglas/           # Ingreso + rule + categorías
│   │   ├── simulations/      # Simulador + AI advisor
│   │   ├── credits/          # Créditos + AI advisor
│   │   ├── history/          # Timeline de decisiones
│   │   └── settings/         # Tema + cuenta
│   ├── onboarding/           # Top-level wizard
│   ├── offline/              # PWA fallback static
│   ├── api/auth/             # NextAuth handler
│   ├── layout.tsx            # Root (Inter, providers, <html lang="es">)
│   ├── providers.tsx         # Session > Theme > Query > Toaster
│   └── globals.css           # Tailwind v4 @theme inline
├── components/               # 9 module folders + ui/ + shared/
├── lib/                      # engines, types, currency, ai/, recurrence
├── server/
│   ├── actions/              # 8 server action files
│   └── queries/              # 6 query files
├── prisma/schema.prisma      # 9 models
├── scripts/                  # seed-timeline-demo, test-ai-*
├── tests/unit/               # 9 test files (119 tests)
├── proxy.ts                  # Auth redirects (renamed from middleware.ts)
├── next.config.ts            # { turbopack: {} } only
├── prisma.config.ts          # dotenv + schema + datasource.url
├── eslint.config.mjs         # flat config
├── vitest.config.ts          # jsdom + server-only stub + inline next-auth
└── package.json
```

## 5. Dev Commands

| Task | Command |
|------|---------|
| Dev server (port 3000) | `npm run dev` |
| Production build | `npm run build` |
| Lint | `npm run lint` |
| Type check | `npx tsc --noEmit` |
| Unit tests | `npx vitest` |
| E2E tests | `npx playwright test` |
| Prisma generate | `npm run db:generate` |
| Prisma push schema | `npm run db:push` |
| Prisma Studio | `npm run db:studio` |
| Seed timeline demo | `npx tsx scripts/seed-timeline-demo.ts` |
| AI prompt smoke test (sims) | `npx tsx scripts/test-ai-prompt.ts` |
| AI prompt smoke test (loans) | `npx tsx scripts/test-loan-ai.ts` |

## 6. Key Configuration Files

### `next.config.ts` (7 lines)

```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  turbopack: {},
};
export default nextConfig;
```

Turbopack is the default. No PWA wired. No image domains.

### `prisma.config.ts`

```ts
import "dotenv/config";
import { defineConfig } from "prisma/config";
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: { url: process.env["DATABASE_URL"] },
});
```

Required by Prisma 7. Reads `.env` via `dotenv/config` (don't forget to import it).

### `proxy.ts` (renamed from `middleware.ts` per Next 16 deprecation)

```ts
export { auth as default } from "@/lib/auth";
// wraps auth((req) => ...) with redirect logic
```

Redirects unauthenticated users from `/` and `/dashboard/*` to `/login`. Redirects logged-in users from `/login` to `/dashboard`.

### `app/globals.css` — REQUIRED lines

```css
@import "tailwindcss";
@custom-variant dark (&:is(.dark, .dark *));  /* OBLIGATORIO para dark mode */
@theme inline { /* shadcn tokens */ }
```

**Without `@custom-variant dark`, `dark:` does not respond to next-themes toggles.** This is the #1 gotcha.

### `app/layout.tsx` — REQUIRED

- `suppressHydrationWarning` on `<html>` (next-themes flashes a class)
- `<html lang="es">`
- Inter font via `next/font/google`

## 7. Vitest Configuration Gotchas

`vitest.config.ts` has two non-obvious lines required to run tests:

```ts
resolve: {
  alias: { "server-only": path.resolve(__dirname, "tests/stubs/server-only.ts") },
},
test: {
  server: { deps: { inline: ["next-auth", "@auth/core"] } },
}
```

- **Why `server-only` stub**: `lib/timeline-types.ts` is used by both server (queries/actions) and client (`TimelineEvent`, `TimelineFilters`). The `import "server-only"` directive (if present) would break client imports. The stub returns an empty module.
- **Why `next-auth` inline**: `next-auth`'s `auth()` function imports `next-auth/lib/env.js`, which requires `next/server`. Vitest's jsdom env does not have `next/server` in the module graph, so we inline the dep so it gets bundled rather than lazily imported.

## 8. First Implementation Tasks (Already Done)

The implementation has gone through 12 phases. The MVP is shipped. New contributors should:

1. **Read** [`architecture.md`](./architecture.md) (sections 1-4 + 7 + 9 first).
2. **Read** [`module-reference.md`](./module-reference.md) for the module they will touch.
3. **Run** `npm run dev` and click through every module as the demo user.
4. **Pick a small task** from the backlog in the architecture doc (§ 17 Agent Handoff).
5. **Validate** with `npx tsc --noEmit` + `npm run lint` + `npm run build` + `npx vitest` before commit.

There is no "build the MVP from scratch" flow — that is done. The project is in iteration mode.

## 9. Validation Before Commit

Per [`AGENTS.md`](../AGENTS.md), before any commit:

1. `npx tsc --noEmit` must be 0 errors.
2. `npm run lint` must be 0 warnings.
3. `npm run build` must complete (17 routes).
4. `npx vitest` must pass (119 tests).
5. If Prisma schema changed: `npx prisma generate` + `npx prisma db push`.

## 10. What's Next (Backlog)

From [`architecture.md` § 17](./architecture.md#17-agent-handoff):

- Migrate loan AI cache to DB-backed (`Loan.aiAnalysis` + `aiAnalysisGeneratedAt`).
- Remove residual Recharts `width(-1)` warning (race condition with `motion.div` + `useTheme()`).
- Remove `zustand` and `next-pwa` from `package.json` (installed but unused).
- Replace hardcoded `CredentialsProvider` with real multi-tenant auth (Google OAuth + email magic link).
- Add savings goals module.
- Add multiple budget templates with custom category sets.
- Re-implement PWA via `serwist` (when Next 16 support is stable).
- Write Playwright E2E specs.
- Delete the placeholder `app/(dashboard)/page.tsx` (real dashboard is at `/dashboard`).
- Add `MonthlySnapshot.triggerEvent` for future automatic snapshots.
- Currency switcher (COP/USD/EUR).
- Delete account (cascade delete with confirmation).
- i18n (English version of the UI).
