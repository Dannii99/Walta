# Walta — Documentation

This directory contains the canonical documentation for **Walta — Tu dinero, más claro**. The docs are organized in 4 files, each with a distinct purpose. Read in this order for a complete picture, or jump to the one you need.

## The four documents

### 1. [`architecture.md`](./architecture.md) — *The architectural "why"*

~600 lines. The big picture. For architects, senior engineers, and AI agents who need to understand the system in depth.

- **12 implementation phases** (from foundations to AI layer)
- **Final stack** with exact versions + status flags (active / installed-but-unused / removed)
- **Real project structure** (the directory tree as it exists today)
- **Hybrid Server/Client pattern** (Server Components + Prisma + Server Actions + Client Islands)
- **Prisma schema** (9 models, all fields)
- **UI & styling** (SaaS card pattern, dark mode, Recharts wrapper)
- **AI module** (GROQ client, schemas, 2-level cache, 4 features)
- **Agent handoff** (backlog, open questions)

### 2. [`module-reference.md`](./module-reference.md) — *Module-by-module tour*

~700 lines. For engineers working on a specific module. Each of the 9 product modules + cross-cutting concerns has its own section.

- **9 modules**: Auth, Onboarding, Dashboard, Gastos, Reglas, Simulaciones, Créditos, Historial, Configuración
- **10 cross-cutting concerns**: sidebar/nav, auth, theme, AI layer, error/loading/empty states, toasts, money display, validation pipeline, scripts, testing
- For each module: purpose, routes, key files, data flow, states, AI integration (if applicable), key decisions

### 3. [`project-context.md`](./project-context.md) — *The product "what" and "why"*

~250 lines. For PMs, designers, and engineers who need to understand the product vision.

- Problem statement, target users, value proposition
- MVP scope (Must/Should/Could/Out of scope)
- 7 main user flows
- 18 functional requirements
- 10 business rules
- Success criteria, assumptions, risks
- Open questions and engineering handoff notes

### 4. [`setup-plan.md`](./setup-plan.md) — *Developer "how to start"*

~150 lines. For new contributors setting up the project locally.

- Prerequisites (Node 20+, npm, Neon DB, GROQ API key)
- Real stack with exact versions
- First run commands (`npm install`, `prisma generate`, `prisma db push`, `npm run dev`)
- Dev commands table
- Key configuration files (`next.config.ts`, `prisma.config.ts`, `proxy.ts`, `app/globals.css`)
- Vitest gotchas (`server-only` stub, `next-auth` inline)
- Validation before commit

## Companion file

### [`../AGENTS.md`](../AGENTS.md) — *Agent quickstart*

The `AGENTS.md` at the repo root is a **quickstart for AI agents** that mirrors the docs in a compact form. It includes:

- Stack & versions (one-line summary)
- Developer commands
- Architecture & entrypoints
- Financial precision rules
- Database & Prisma
- Testing
- Styling & UI patterns
- Current state per module

The agent should prefer the docs in `doc/` for depth, but use `AGENTS.md` for quick reference.

## What is NOT here

- **Iteration log**: not maintained. Use `git log --oneline` instead.
- **Daily notes / dev journal**: not maintained. The architecture doc's §15 "Implementation History" has the high-level phase summary.
- **Sprint planning / tickets**: not maintained. This is a single-developer MVP.
- **Decisions log (ADR)**: not maintained. Key decisions are in the docs (especially `module-reference.md` "Key decisions" sections).

## Reading order for new contributors

1. [`project-context.md`](./project-context.md) — understand the product.
2. [`setup-plan.md`](./setup-plan.md) — get the project running locally.
3. [`architecture.md`](./architecture.md) sections 1-4 + 7 + 9 — understand the system.
4. [`module-reference.md`](./module-reference.md) — for the module you will touch.
5. [`AGENTS.md`](../AGENTS.md) — keep it open as a quick reference while you work.
