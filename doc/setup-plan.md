# Setup Plan

## 1. Goal

Inicializar el proyecto completo de **Walta — Tu dinero, más claro** (Visual Personal Budget + Financial Simulator) con el stack Next.js 16 full-stack, Prisma + Neon Postgres, PWA, y el sistema de diseño visual (shadcn/ui + Tailwind v4 + Framer Motion).

Este documento es la guía de arranque. Siguiendo estos pasos, el proyecto quedará listo para que el agente especialista implemente las fases del `architecture.md`.

## 2. Selected Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: Neon Postgres (serverless)
- **ORM**: Prisma
- **Auth**: Auth.js (NextAuth.js v5)
- **Styling**: TailwindCSS
- **UI Library**: shadcn/ui + Tremor
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Client**: Zustand
- **State Server**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Decimal Precision**: Dinero.js
- **PWA**: next-pwa
- **Testing**: Vitest (unit) + Playwright (E2E)

## 3. Package Manager

**pnpm** (recomendado por velocidad y eficiencia de disco). Si no está disponible, usar npm.

## 4. Initialization Command

```bash
# Crear proyecto Next.js con App Router, TypeScript, Tailwind, ESLint
npx create-next-app@latest presupuesto-app --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-pnpm

cd presupuesto-app
```

## 5. Dependencies

### Core (ya vienen con create-next-app)
- next
- react
- react-dom
- typescript
- tailwindcss
- postcss
- autoprefixer
- eslint-config-next

### Instalar después de la inicialización

```bash
# UI Components y estilos
pnpm dlx shadcn-ui@latest init

# Tremor (dashboard components)
pnpm add @tremor/react

# Charts
pnpm add recharts

# Animaciones
pnpm add framer-motion

# Icons
pnpm add lucide-react

# Estado global cliente
pnpm add zustand

# Server state / data fetching
pnpm add @tanstack/react-query

# Forms y validación
pnpm add react-hook-form @hookform/resolvers zod

# Precisión decimal financiera
pnpm add dinero.js

# PWA
pnpm add next-pwa

# Auth
pnpm add next-auth@beta

# Prisma + Neon
pnpm add prisma @prisma/client @neondatabase/serverless
pnpm add -D prisma

# Testing
pnpm add -D vitest @vitejs/plugin-react jsdom
pnpm add -D @playwright/test

# Utilidades
pnpm add clsx tailwind-merge
```

### Nota sobre shadcn/ui
Después de `shadcn-ui init`, instalar los componentes base necesarios:

```bash
pnpm dlx shadcn-ui@latest add button card input label dialog select tabs skeleton badge progress toast
```

## 6. Initial Configuration

### 6.1 TypeScript (`tsconfig.json`)
Asegurar que está configurado con:
- `"strict": true`
- `"baseUrl": "."`
- `"paths": { "@/*": ["./*"] }`

### 6.2 TailwindCSS (`tailwind.config.ts`)
- Extender configuración con colores de Tremor (ver documentación de Tremor para `tailwind.config`).
- Agregar `darkMode: "class"` para soporte futuro de modo oscuro.
- Configurar `fontFamily` con Inter.

### 6.3 Prisma
1. Crear archivo `prisma/schema.prisma` con el schema propuesto en `architecture.md`.
2. Crear `.env` con `DATABASE_URL` apuntando a Neon.
3. Ejecutar:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### 6.4 Auth.js (`auth.ts`)
1. Configurar Auth.js v5 con el provider de credenciales o Google OAuth.
2. Crear `app/api/auth/[...nextauth]/route.ts`.
3. Agregar `NEXTAUTH_SECRET` y `NEXTAUTH_URL` a `.env`.

### 6.5 PWA (`next.config.js`)
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // otras configs
};

module.exports = withPWA(nextConfig);
```

Crear `public/manifest.json` y agregar iconos en `public/icons/`.

### 6.6 Providers Globales (`app/layout.tsx`)
Wrappers necesarios en el root:
- `QueryClientProvider` (TanStack Query)
- `SessionProvider` (Auth.js)
- `Toaster` (shadcn/ui toast)

### 6.7 Metadata y SEO base
En `app/layout.tsx`:
- `title`: "Walta — Tu dinero, más claro"
- `description`: "Controla tu dinero de forma visual. Simula decisiones financieras importantes."
- `theme-color` para PWA.

## 7. Initial Structure

Al finalizar el setup, la estructura debe verse así:

```
presupuesto-app/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (dashboard)/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── expenses/
│   │   ├── simulations/
│   │   ├── history/
│   │   └── settings/
│   ├── api/
│   │   └── auth/[...nextauth]/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/              # shadcn components
│   ├── budget/
│   ├── charts/
│   ├── simulations/
│   └── shared/
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── utils.ts
│   ├── currency.ts
│   └── constants.ts
├── hooks/
├── types/
│   └── index.ts
├── server/
│   ├── actions/
│   └── queries/
├── prisma/
│   └── schema.prisma
├── public/
│   ├── manifest.json
│   └── icons/
├── tests/
│   ├── unit/
│   └── e2e/
├── middleware.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
└── package.json
```

## 8. First Implementation Phases

### Paso 0: Verificación de Setup
- [ ] `pnpm dev` corre sin errores.
- [ ] `next build` compila exitosamente.
- [ ] Prisma se conecta a Neon y `db push` crea las tablas.
- [ ] Auth funciona (página de login carga).
- [ ] PWA manifest es detectado por Chrome DevTools.

### Paso 1: Schema DB + Conexión
- [ ] Definir `schema.prisma` completo.
- [ ] Crear singleton `lib/prisma.ts`.
- [ ] Seed de datos mínimos (1 usuario de prueba, 1 presupuesto de prueba).

### Paso 2: Sistema de Moneda
- [ ] Implementar `lib/currency.ts` con Dinero.js.
- [ ] Formato COP correcto: `$ 1.234.567,89`.
- [ ] Helpers: `sum`, `subtract`, `percentage`, `isGreaterThan`.

### Paso 3: Layout Base + Navegación
- [ ] Layout del dashboard con sidebar responsive.
- [ ] Navegación entre Dashboard, Gastos, Simulaciones, Historial.
- [ ] Mostrar nombre de usuario y logout.

### Paso 4: Onboarding Mínimo
- [ ] Pantalla de bienvenida.
- [ ] Formulario: ingreso mensual + selección de plantilla.
- [ ] Guardar en DB y redirigir a Dashboard.

## 9. Validation Commands

```bash
# Desarrollo
pnpm dev

# Build de producción (debe pasar siempre antes de commit)
pnpm build

# Type checking
pnpm tsc --noEmit

# Linting
pnpm lint

# Tests unitarios
pnpm vitest

# Tests E2E
pnpm exec playwright test

# Prisma (después de cambiar schema)
npx prisma generate
npx prisma db push
npx prisma studio      # para inspeccionar datos
```

## 10. Agent Handoff

**Specialist agent:** `frontend-react-next`

**Contexto:** El proyecto no existe. Este `setup-plan.md` + `architecture.md` son la fuente de verdad.

**Instrucciones de handoff:**
1. Ejecutar los pasos de inicialización en orden (Sección 4, 5, 6).
2. No saltarse la configuración de Prisma/Neon ni de Auth. Son bloqueantes para todo lo demás.
3. Una vez que `pnpm dev` y `next build` funcionen con el layout base, proceder a implementar las Fases del `architecture.md`.
4. Prioridad absoluta: que el onboarding cree un presupuesto real en la base de datos y el dashboard lo muestre. Eso es el "momento mágico" del MVP.
5. Si surge algún conflicto entre este plan y el `architecture.md`, el `architecture.md` tiene prioridad.
6. Reportar inmediatamente si alguna librería (especialmente Tremor o next-pwa) tiene incompatibilidad con la versión de Next.js instalada.
