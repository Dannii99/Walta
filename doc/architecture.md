# Frontend Architecture

## 1. Architecture Status

**Proposed architecture before project initialization.**

No existe proyecto todavía. Esta arquitectura es una propuesta basada en el `project-context.md` y las decisiones del Product Owner. El stack fue seleccionado considerando:
- Requerimiento de backend real (Neon Postgres + Prisma)
- Necesidad de PWA desde el inicio
- Prioridad en visualización moderna, original y tipo dashboard
- MVP que debe escalar naturalmente a más usuarios y funcionalidades

## 2. Technology Decision

**Framework seleccionado: Next.js 14+ (App Router)**

**Razones principales:**
1. **Full-stack integrado**: Next.js permite API Routes y Server Actions, eliminando la necesidad de un backend separado (Node/Express) para comunicarse con Prisma + Neon. El MVP crece dentro de un solo proyecto.
2. **Ecosistema visual superior**: React tiene el ecosistema más maduro de librerías para dashboards financieros modernos (Tremor, shadcn/ui, Recharts, Framer Motion). Esto responde directamente al requerimiento de que la visual sea "muy original y moderna".
3. **PWA nativo**: `next-pwa` convierte la app en PWA con Service Worker de forma estándar.
4. **Server Components**: Permiten cargar datos del presupuesto directamente desde Prisma sin exponer lógica al cliente, reduciendo JavaScript enviado al navegador.
5. **Escalabilidad implícita**: Cuando el producto crezca a multiusuario, autenticación avanzada o features colaborativas, Next.js ya tiene la estructura para soportarlo.

**Alternativas evaluadas:**
- *React + Vite*: Requeriría crear un backend separado para Prisma/Neon. Aumenta la complejidad del MVP innecesariamente.
- *Vue + Nuxt*: Buen DX, pero el ecosistema de librerías UI tipo "dashboard financiero" (Tremor, shadcn) es significativamente menor en Vue.
- *Angular*: Demasiado verboso para un MVP. Menor cantidad de librerías visuales modernas listas para usar.

## 3. Context

Producto: **Aplicación de control de presupuesto personal visual + simulador financiero**.

El usuario debe poder crear un presupuesto en minutos, ver su salud financiera mediante gráficos e indicadores de color (semáforo), registrar gastos, y simular compras grandes (vehículo, vivienda) con un veredicto de viabilidad basado en su presupuesto real.

El MVP incluye historial mensual y persistencia en Neon Postgres. Debe funcionar como PWA.

## 4. Proposed Stack

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| **Framework** | Next.js 14+ (App Router) | Full-stack React, routing, API, SSR/SSG opcional |
| **Language** | TypeScript | Tipado estricto en toda la aplicación |
| **Database** | Neon Postgres (serverless) | Persistencia de presupuestos, gastos, simulaciones, historial |
| **ORM** | Prisma | Modelado de datos, migraciones, queries type-safe |
| **Styling** | TailwindCSS | Utility-first CSS, rápido, consistente, personalizable |
| **UI Components** | shadcn/ui + Tremor | Componentes base accesibles (shadcn) + componentes de dashboard financiero (Tremor) |
| **Charts** | Recharts | Gráficos de dona, barras y áreas. Liviano y declarativo |
| **Animations** | Framer Motion | Transiciones de página, microinteracciones, animaciones de entrada para números y gráficos |
| **Icons** | Lucide React | Iconografía consistente y moderna |
| **State (Client)** | Zustand | Estado UI global ligero (modales, filtros, draft de formularios) |
| **State (Server)** | TanStack Query (React Query) | Fetching, caching, sincronización con el servidor. Invalidación automática de queries tras mutaciones |
| **Forms** | React Hook Form + Zod | Validación performante y type-safe de formularios |
| **Auth** | NextAuth.js v5 (Auth.js) | Autenticación simple (credentials o OAuth). Aislamiento de datos por usuario |
| **Decimal Precision** | Dinero.js | Cálculos financieros exactos sin errores de punto flotante |
| **PWA** | next-pwa | Service Worker, manifest, offline support |
| **Moneda** | Intl.NumberFormat + config COP | Formato de moneda colombiana por defecto, arquitectura preparada para multi-moneda |

## 5. Proposed Structure

```
my-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Grupo de rutas: login, register
│   ├── (dashboard)/              # Grupo de rutas: layout con sidebar/nav
│   │   ├── page.tsx              # Dashboard principal (Server Component)
│   │   ├── expenses/
│   │   ├── simulations/
│   │   ├── history/
│   │   ├── reglas/               # Regla de presupuesto (50/30/20) + CRUD categorías
│   │   └── settings/             # Personalización (tema, etc.)
│   ├── api/                      # API Routes (webhooks, auth callbacks si es necesario)
│   ├── layout.tsx                # Root layout (providers, fonts, metadata)
│   └── globals.css
├── components/
│   ├── ui/                       # Componentes base de shadcn/ui (Button, Card, Input, etc.)
│   ├── budget/                   # Componentes específicos de presupuesto
│   ├── charts/                   # Wrappers de Recharts (DonutChart, BarChart, etc.)
│   ├── simulations/              # Formularios y resultados de simulación
│   └── shared/                   # Layout, Header, Sidebar, Loading states
├── lib/
│   ├── prisma.ts                 # Singleton de Prisma Client
│   ├── auth.ts                   # Configuración de Auth.js
│   ├── utils.ts                  # Helpers (cn, formatters, etc.)
│   ├── currency.ts               # Wrapper de Dinero.js + Intl para COP
│   └── constants.ts              # Reglas por defecto, tasas referenciales, etc.
├── hooks/
│   ├── use-budget.ts             # Lógica de presupuesto activo
│   ├── use-simulation.ts         # Lógica de simulación
│   └── use-health-status.ts      # Cálculo de semáforos y alertas
├── types/
│   └── index.ts                  # Tipos compartidos (Budget, Transaction, Simulation, etc.)
├── server/
│   ├── actions/                  # Server Actions (mutaciones directas a DB)
│   │   ├── budget-actions.ts
│   │   ├── transaction-actions.ts
│   │   └── simulation-actions.ts
│   └── queries/                  # Funciones de fetching para Server Components
│       ├── budget-queries.ts
│       └── simulation-queries.ts
├── prisma/
│   └── schema.prisma             # Esquema de base de datos
├── public/
│   ├── manifest.json             # PWA manifest
│   └── icons/
└── middleware.ts                 # Protección de rutas, redirecciones
```

## 6. Architecture Goals

1. **Visual-first**: La arquitectura debe permitir renderizar dashboards complejos con gráficos, números grandes y animaciones sin lag.
2. **Tiempo al valor < 5 minutos**: El onboarding debe ser rápido. La arquitectura no debe imponer pasos técnicos (como verificación de email) antes de ver valor.
3. **Crecimiento sin reescritura**: El mismo proyecto debe soportar el MVP y fases futuras (multi-moneda, metas de ahorro, exportación) sin cambiar de framework.
4. **Precisión financiera**: Ningún cálculo debe perder centavos por errores de punto flotante.
5. **Offline-capable**: Como PWA, la app debe funcionar sin conexión después de la primera carga, mostrando datos cacheados.
6. **Type safety end-to-end**: Desde la base de datos (Prisma) hasta el UI (TypeScript + Zod), sin `any` en lógica de negocio.

## 7. Proposed Direction

### Enfoque híbrido: Server Components + Client Islands

- **Server Components (default)**: Dashboard inicial, listados de gastos, historial mensual. Se cargan directamente desde Prisma en el servidor. Menos JS al cliente.
- **Client Components (islas)**: Formularios de ingreso de datos, gráficos interactivos (Recharts requiere cliente), simulador con cálculos en tiempo real, animaciones (Framer Motion).

### Comunicación Cliente-Servidor

- **Server Actions** para mutaciones (crear gasto, guardar simulación). Reemplazan API routes tradicionales para operaciones simples.
- **TanStack Query** para cachear y sincronizar datos del servidor en componentes cliente. Cuando una Server Action invalida una query, el dashboard se actualiza automáticamente.

### Modelo de Datos Frontend

El estado se divide en dos capas:
1. **Server State**: Fuente de verdad en Neon. Manejado por Prisma + TanStack Query.
2. **Client State**: Estado transitorio de UI (formularios en edición, filtros activos, toast notifications). Manejado por Zustand.

No se usa Redux. La complejidad no lo justifica.

## 8. Feature Organization

### Presupuesto (Budget)
- `app/(dashboard)/page.tsx`: Dashboard principal. Server Component que carga el presupuesto activo.
- `components/budget/`: Tarjetas de resumen, lista de categorías, formulario de gasto.
- `server/actions/transaction-actions.ts`: Crear, editar, eliminar gastos (modelo `Transaction` en Prisma).

### Simulación (Simulation)
- `app/(dashboard)/simulations/page.tsx`: Lista de simulaciones guardadas.
- `app/(dashboard)/simulations/vehicle/page.tsx`: Simulador de vehículo.
- `components/simulations/`: Formulario de 4 campos, resultado con veredicto visual.
- `lib/simulation-engine.ts`: Motor de cálculo de cuotas y veredictos (puro TypeScript, sin dependencias de framework).

### Reglas Financieras (Rules)
- `lib/constants.ts`: Regla 50/30/20 por defecto.
- `app/(dashboard)/reglas/page.tsx`: Módulo top-level con editor de porcentajes (RuleEditor) y CRUD de categorías (CategoryManager).
- `components/reglas/`: Componentes del módulo.
- `hooks/use-health-status.ts`: Calcula el estado de salud (verde/amarillo/rojo) comparando gastos reales vs regla.

### Historial Mensual (History)
- `app/(dashboard)/history/page.tsx`: Vista de meses anteriores.
- `prisma/schema.prisma`: Modelo `MonthlySnapshot` para guardar estado cerrado de cada mes.

## 9. Data and API Integration

### Esquema Prisma (propuesta inicial)

```prisma
model User {
  id            String         @id @default(cuid())
  email         String         @unique
  name          String?
  budgets       Budget[]
  simulations   Simulation[]
  createdAt     DateTime       @default(now())
}

model Budget {
  id            String         @id @default(cuid())
  userId        String
  user          User           @relation(fields: [userId], references: [id])
  name          String
  income        Decimal        @db.Decimal(15, 2)
  currency      String         @default("COP")
  rule          Json           // { needs: 50, wants: 30, savings: 20 }
  categories    Category[]
  transactions  Transaction[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model Category {
  id            String         @id @default(cuid())
  budgetId      String
  budget        Budget         @relation(fields: [budgetId], references: [id], onDelete: Cascade)
  name          String
  type          String         // NEEDS, WANTS, SAVINGS, DEBT
  color         String         // hex para gráficos
  transactions  Transaction[]
}

model Transaction {
  id            String         @id @default(cuid())
  categoryId    String
  category      Category       @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  amount        Decimal        @db.Decimal(15, 2)
  description   String?
  date          DateTime       @default(now())
  createdAt     DateTime       @default(now())
}

model Simulation {
  id            String         @id @default(cuid())
  userId        String
  user          User           @relation(fields: [userId], references: [id])
  type          String         // VEHICLE, HOUSING, etc.
  title         String
  inputs        Json           // { price, downPayment, term, rate }
  result        Json           // { monthlyPayment, verdict, availableAfter }
  createdAt     DateTime       @default(now())
}
```

### Patrón de Datos

- **Reads**: Server Components usan `server/queries/` para hacer `prisma.budget.findFirst(...)` directamente.
- **Writes**: Server Actions reciben datos validados por Zod, ejecutan lógica de negocio, interactúan con Prisma, y revalidan rutas (`revalidatePath` / `revalidateTag`).
- **Sync**: TanStack Query en el cliente se encarga de refrescar el cache cuando detecta invalidación.

## 10. UI and Styling Strategy

### Sistema Visual

- **Base**: TailwindCSS con variables CSS para el tema (modo claro/oscuro preparado desde el inicio).
- **Componentes base**: shadcn/ui proporciona inputs, botones, modales, dropdowns accesibles y sin estilos forzados.
- **Componentes de dashboard**: Tremor aporta `Card`, `Metric`, `ProgressBar`, `AreaChart`, `DonutChart` estilizados para analytics. Esto acelera enormemente la construcción del dashboard financiero.
- **Gráficos custom**: Recharts para casos específicos que Tremor no cubra (ej. gráfico de semáforo circular).

### Paleta y Semántica

- **Verde (saludable)**: `#10B981` — dentro del rango de la regla.
- **Amarillo (ajustado)**: `#F59E0B` — cerca del límite.
- **Rojo (riesgo)**: `#EF4444` — excedido o no recomendable.
- **Azul (acción/primary)**: `#3B82F6`.
- **Fondo**: Gris muy claro (`#F8FAFC`) para escritorio, blanco puro para cards.

### Tipografía
- **Headlines**: Inter (font-weight 700/800) para números grandes y títulos.
- **Body**: Inter (font-weight 400/500) para legibilidad.
- **Números**: Tabular nums activados (`font-variant-numeric: tabular-nums`) para que los montos no "bailen" al actualizarse.

### Animaciones
- **Framer Motion** para:
  - Entrada escalonada de cards en el dashboard (`staggerChildren`).
  - Transición de números (contadores animados) cuando cambia el disponible.
  - Cambios de estado en el semáforo (transición suave de color).
  - Navegación entre páginas (slide/fade).

### Responsive
- Mobile-first para formularios (el onboarding debe funcionar en móvil).
- Dashboard optimizado para escritorio (donde se consume la información densa), pero usable en tablet.

## 11. State Management

### Server State (TanStack Query)

```typescript
// hooks/use-budget.ts
export function useBudget() {
  return useQuery({
    queryKey: ['budget', 'active'],
    queryFn: () => fetch('/api/budget').then(res => res.json())
  });
}
```

- Cachea el presupuesto activo.
- Invalida automáticamente cuando se crea/edita un gasto.

### Client State (Zustand)

```typescript
// stores/ui-store.ts
interface UIState {
  sidebarOpen: boolean;
  simulationDraft: SimulationInput | null;
  toast: Toast | null;
  setSidebarOpen: (open: boolean) => void;
}
```

- NO guarda datos de negocio (presupuesto, gastos). Solo estado de UI.
- Permite compartir estado de draft del simulador entre vistas sin prop drilling.

### Form State (React Hook Form + Zod)

- Todo formulario (gasto, simulación, reglas) usa RHF para performance y Zod para validación type-safe.

## 12. Error, Loading, and Empty States

### Loading
- **Server Components**: `loading.tsx` en cada ruta muestra skeletons con `shadcn/ui Skeleton`.
- **Client Components**: Spinners locales en botones de acción (estado `isPending` de Server Actions).
- **Dashboard**: Los números grandes aparecen con fade-in; los gráficos muestran un placeholder animado mientras cargan.

### Error
- **Errores de servidor**: `error.tsx` en App Router captura errores de fetch/Prisma. Muestra mensaje amigable con opción de reintentar.
- **Errores de validación**: Zod muestra mensajes inline en formularios.
- **Errores de cálculo**: Si una simulación produce un número inválido (ej. tasa negativa), se captura y se muestra alerta visual sin crashear.

### Empty States
- **Sin presupuesto**: Redirección automática al onboarding. No se muestra dashboard vacío.
- **Sin gastos**: Card ilustrada con CTA "Agregar tu primer gasto".
- **Sin simulaciones**: Lista vacía con mensaje motivador y botón "Simular una compra".

## 13. Testing and Validation Strategy

### Unit Tests (Vitest)
- Motor de simulación (`lib/simulation-engine.ts`): Verificar que la fórmula de amortización y los veredictos respeten las reglas de negocio exactas.
- Helpers de moneda (`lib/currency.ts`): Formateo correcto de COP, redondeo, cálculos con Dinero.js.
- Validaciones Zod: Esquemas de formularios.

### Integration Tests (Playwright)
- Flujo completo de onboarding → dashboard → agregar gasto → ver semáforo.
- Flujo de simulación de vehículo con veredicto esperado.
- Persistencia: recargar página y verificar que los datos permanecen.

### Visual Regression
- Screenshots del dashboard y del simulador para detectar cambios accidentales en UI.

### Validación Manual
- Checklist antes de cada release:
  - [ ] Onboarding < 5 minutos
  - [ ] Gráficos renderizan correctamente en Chrome, Firefox, Safari
  - [ ] PWA instalable desde Chrome
  - [ ] Offline: se ven datos cacheados al desconectar red
  - [ ] Cálculos de cuota coinciden con calculadora financiera estándar

## 14. Risks and Tradeoffs

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| **Next.js App Router es relativamente nuevo** | Medium | Usar patrones establecidos (Server Actions, `loading.tsx`). Evitar experimental features. |
| **Tremor + shadcn pueden chocar en estilos** | Low | Ambos usan Tailwind. Tremor es configurable. shadcn es copiar-pegar, así que se ajusta fácil. |
| **Prisma + Neon en serverless** | Medium | Neon es serverless-friendly. Prisma requiere connection pooling (usar `@neondatabase/serverless` adapter). |
| **PWA + Auth offline** | Medium | Auth.js requiere red para validar sesión. Para offline, cachear token JWT y degradar gracefulmente a modo solo-lectura. |
| **Precisión decimal en JSON** | High | Prisma `Decimal` se serializa a string en JSON. Asegurar que el cliente siempre reciba strings y use Dinero.js antes de mostrar. |
| **Bundle size con Tremor + Recharts + Framer Motion** | Medium | Usar `dynamic` imports para gráficos. Tremor tree-shakea bien. Framer Motion se puede importar solo donde se use. |

## 15. Implementation Plan

### Fase 1: Fundamentos (Setup)
- Inicializar Next.js 14 con TypeScript, Tailwind, ESLint.
- Configurar shadcn/ui.
- Configurar Prisma + Neon. Crear schema inicial.
- Configurar Auth.js (credentials simple o OAuth Google).
- Configurar PWA (next-pwa, manifest, icons).
- Configurar TanStack Query y Zustand providers.

### Fase 2: Modelo de Datos + API
- Definir schema Prisma completo (User, Budget, Category, Transaction, Simulation).
- Crear Server Actions para CRUD de presupuesto y gastos.
- Crear queries para Server Components.
- Implementar `lib/currency.ts` con Dinero.js y formato COP.

### Fase 3: Onboarding
- Pantalla de bienvenida (3 frases).
- Flujo de selección: plantilla vs en blanco.
- Formulario de ingreso mensual + categorías iniciales.
- Guardar presupuesto en DB y redirigir a Dashboard.

### Fase 4: Dashboard Visual
- Layout con sidebar/nav.
- KPIs grandes (Ingreso, Gastos, Disponible) con animación de contador.
- Gráfico de distribución (donut) por categoría.
- Semáforos de salud por categoría (barras de progreso con color).
- Lista de gastos recientes (Dashboard: Distribución por Categoría; Módulo `/expenses`: tabla completa).
- Recalcular semáforos según nueva regla.

### Fase 5: Registro de Gastos
- Modal/formulario para agregar/editar/eliminar gastos.
- Actualización en tiempo real del dashboard (TanStack Query invalidation).

### Fase 6: Reglas Financieras
- Mostrar regla activa en dashboard.
- Pantalla de configuración de reglas (editor de porcentajes con validación 100%).
- Recalcular semáforos según nueva regla.

### Fase 7: Simulador de Vehículo
- Formulario de 4 campos (precio, entrada, plazo, tasa).
- Motor de cálculo de cuota + veredicto.
- Vista de resultado visual con comparación contra disponible.
- Guardar simulación en DB.

### Fase 8: Historial Mensual
- Lógica de "cierre de mes": snapshot del presupuesto actual.
- Vista de historial con lista de meses.
- Comparación básica mes vs mes.

### Fase 9: PWA + Polish
- Service Worker funcionando.
- Estrategia de cache para datos (Stale-While-Revalidate).
- Modo oscuro (si no se hizo antes con Tailwind).
- Animaciones finales con Framer Motion.
- Testing E2E con Playwright.

## 16. Agent Handoff

**Specialist agent:** `frontend-react-next`

**Instructions for implementation:**
1. **Stack**: Next.js 14+ (App Router), TypeScript, TailwindCSS, shadcn/ui, Tremor, Recharts, Framer Motion, TanStack Query, Zustand, React Hook Form + Zod, Auth.js, Prisma + Neon, Dinero.js.
2. **Priority**: Fase 1 y Fase 2 primero (setup + modelo de datos). Sin DB funcional, no avanzar a UI.
3. **Visual priority**: El dashboard debe sentirse "vivo". Usar Framer Motion para contadores y transiciones. Los semáforos deben ser inmediatamente legibles.
4. **Business logic isolation**: Todo cálculo financiero (disponible, cuotas, veredictos) debe vivir en `lib/` puro, sin dependencias de React. Debe ser 100% testeable con Vitest.
5. **Decimal safety**: NUNCA usar `number` para montos. Usar `Decimal` de Prisma en DB, `string` en JSON, y Dinero.js en el cliente.
6. **Auth approach**: Para el MVP, implementar Auth.js con Google OAuth o credentials simple. Cada usuario ve solo sus datos. No implementar roles ni permisos avanzados.
7. **PWA**: Configurar next-pwa desde el inicio. El Service Worker debe cachear al menos el shell de la app y los datos de TanStack Query.
8. **Moneda**: Todo formateo pasa por `lib/currency.ts`. Asumir COP por defecto pero dejar la puerta abierta a multi-moneda (campo `currency` en Budget ya preparado).
9. **No exportar**: No implementar PDF/image export en esta fase.
10. **Validation checklist**:
    - Build pasa sin errores (`next build`).
    - Prisma migrate funciona contra Neon.
    - Auth permite login y aisla datos.
    - Dashboard carga datos desde Server Component.
    - Agregar gasto actualiza dashboard sin recarga.
    - Simulador de vehículo genera veredicto correcto según reglas de negocio.
    - PWA es instalable desde Chrome DevTools.
