# AGENTS.md — SyC Frontend

Internal gym management platform (Sano & Controlado). React 19 + Vite 7 + TypeScript 5.9,
feature-based architecture.

---

## Commands

```bash
pnpm dev        # Start Vite dev server
pnpm build      # Production build (ONLY when explicitly requested)
pnpm lint       # Run ESLint on all .ts / .tsx files
```

The project uses **pnpm** as package manager — never use `npm` or `yarn`
(a `preinstall` hook blocks them).

*pnpm build* must be executed only if the user explicitly requests a build.
Validation for code changes consists only of:
```bash
pnpm lint
```

---

## Architecture

Feature-based vertical slice. Three top-level source zones, each with a path alias:

```
src/
├── app/          (@app/*)      — providers, router, layouts; no business logic
├── features/     (@features/*) — one folder per business domain
│   └── <domain>/
│       ├── components/   — UI specific to this feature
│       ├── hooks/        — TanStack Query hooks (useQuery / useMutation)
│       ├── services/     — raw Axios API calls
│       ├── types/        — domain types
│       └── index.ts      — public barrel export
└── shared/       (@shared/*)  — cross-cutting utilities
    ├── api/              — Axios instance
    ├── components/ui/    — composite shared components (Form, Table…)
    ├── config/           — env.ts, queryClient.ts
    ├── hooks/            — generic, feature-agnostic hooks
    ├── lib/              — cn.ts, createStore.ts and other small utilities
    ├── stores/           — global Zustand stores
    ├── types/            — global types
    ├── ui/               — design system primitives (Button, Input, Card…)
    └── utils/            — pure utility functions
```

**Cross-zone import rules:**
- `@app` may import from `@features` and `@shared`.
- `@features/<domain>` may import from `@shared` but **never** from another feature directly — use the target feature's `index.ts` barrel if needed.
- `@shared` must never import from `@app` or `@features`.
- Never use deep relative imports (`../../../`) to cross zone boundaries; use aliases.

---

## TypeScript

Compiler is configured with `strict: true` plus:

- `noUnusedLocals` / `noUnusedParameters` — unused symbols are **errors**, not warnings.
- `verbatimModuleSyntax` — use `import type` for every type-only import.
- `erasableSyntaxOnly` — **no `enum`**, **no `namespace`**. Use `const` objects + derived types instead.
- `noFallthroughCasesInSwitch` — every switch case must break or return.

```typescript
// Enums — NEVER
enum Status { Active, Inactive }

// Correct pattern
const STATUS = { ACTIVE: "active", INACTIVE: "inactive" } as const;
type Status = (typeof STATUS)[keyof typeof STATUS];
```

- **Never use `any`.** Use `unknown` + type guards or generics.
- Prefer `interface` for object shapes; use `type` for unions, intersections, and derived types.
- Keep interfaces flat — nested objects get their own named interface.
- Always use `import type { Foo }` (or inline `import { type Foo }`) for type-only imports.

---

## Naming Conventions

| Entity                 | Convention            | Example                            |
| ---------------------- | --------------------- | ---------------------------------- |
| Components             | PascalCase            | `UserCard`, `LoginPage`            |
| Hooks                  | `use` + PascalCase    | `useLoginMutation`, `useDebounce`  |
| Services               | camelCase + `.api.ts` | `auth.api.ts`                      |
| Types / Interfaces     | PascalCase            | `UserProfile`, `ApiResponse`       |
| Zod schemas            | camelCase + `Schema`  | `loginSchema`                      |
| Constants              | SCREAMING_SNAKE_CASE  | `MAX_RETRIES`                      |
| Utility functions      | camelCase             | `formatCurrency`                   |
| Files (components)     | PascalCase            | `Button.tsx`, `Button.variants.ts` |
| Files (non-components) | camelCase             | `cn.ts`, `queryClient.ts`          |

---

## Component Patterns

- Props interface extends the corresponding HTML element attributes type.
- CVA variant logic lives in a co-located `ComponentName.variants.ts` file.
- Always use `cn()` for class composition — never string concatenation.
- Named exports for components (`export const Button`).
- Default exports for page-level components (`export default LoginPage`).
- Primitives (`shared/ui/`) carry **no visual opinions by default** — Card is just a `div`.
  All styling decisions live at the usage site or inside CVA variant definitions.

Accessibility requirements on form inputs:
- `aria-invalid={hasError || undefined}`
- `aria-describedby` pointing to the error message element id
- `data-invalid="true"` when in error state
- Error messages rendered with `role="alert"`

---

## Styling — TailwindCSS v4

Tailwind is integrated as a Vite plugin (`@tailwindcss/vite`). There is **no `tailwind.config.js`**.
Design tokens are defined in `src/index.css` inside the `@theme {}` block.

Rules:
- **Never** use `var(--color-*)` inside `className`. Use the semantic Tailwind class directly.
- **Never** use arbitrary hex values like `bg-[#1e293b]` — map to a design token instead.
- Use `cn()` whenever classes are conditional or may conflict.
- Use `style={}` only for truly dynamic runtime values (e.g., `style={{ width: \`${pct}%\` }}`).
- `var()` constants are only acceptable as props to third-party libraries that don't accept `className`.

---

## API Layer

```typescript
import { api } from "@shared/api/api";

// In a service file: features/auth/services/auth.api.ts
export async function login(credentials: LoginSchema) {
  const { data } = await api.post<AuthResponse>("/users/login", credentials);
  return data;
}
```

- All HTTP calls go through the single Axios instance at `@shared/api/api`.
- The instance uses `withCredentials: true` — authentication is cookie-based (JWT).
- A response interceptor handles 401 automatically: silent token refresh → retry → redirect to `/login`.
- **Components must never call service functions directly.** Always go through a TanStack Query hook.

### TanStack Query

```typescript
// features/auth/hooks/useLoginMutation.ts
import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth.api";

export function useLoginMutation() {
  return useMutation({ mutationFn: login });
}
```

Global defaults (configured in `@shared/config/queryClient.ts`):
- `staleTime: 5 minutes`
- `retry: 1`
- `refetchOnWindowFocus: false`

Server state lives **only** in TanStack Query — never in Zustand.

---

## Client State (Zustand)

Zustand manages all **client-side** state: auth session, UI state, notifications, and global modals.

### Store location — hybrid convention

| Scope         | Location                                       |
| ------------- | ---------------------------------------------- |
| Global/shared | `src/shared/stores/<name>.store.ts`            |
| Feature-local | `src/features/<domain>/stores/<name>.store.ts` |

### Naming

- Files: `camelCase.store.ts` — e.g. `auth.store.ts`, `ui.store.ts`
- Exported hook: `use<Name>Store` — e.g. `useAuthStore`, `useUIStore`

### Always use `createStore()` from `@shared/lib/createStore`

Never call Zustand's `create` directly. The factory automatically applies `devtools` middleware in development:

```typescript
// shared/lib/createStore.ts — already implemented
import { createStore } from "@shared/lib/createStore";
```

### Store template

```typescript
// features/auth/stores/auth.store.ts
import { createStore } from "@shared/lib/createStore";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = createStore<AuthState>("auth", (set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

### Selector pattern — subscribe to slices, not the whole store

```typescript
// In components
const user = useAuthStore((s) => s.user);
const logout = useAuthStore((s) => s.logout);
```

### Rules

- **Never store server/API data in Zustand** — that belongs exclusively to TanStack Query.
- Actions live **inside** the store initializer (not as external functions).
- State interface defined **separately** from `createStore` call.
- Use `import type` for type-only imports from Zustand and domain types.
- `erasableSyntaxOnly` applies: no `enum` or `namespace` inside stores.

---

## Environment Variables

Access environment variables **only** through `@shared/config/env.ts`. Never use `import.meta.env` directly in components or services.

```typescript
import { env } from "@shared/config/env";
const baseUrl = env.API_URL;
```

---

## Import Order

1. External libraries (`react`, `axios`, `zod`, …)
2. `@app/` imports
3. `@shared/` imports
4. `@features/` imports
5. Relative imports (`./`, `../`) — only within the same zone

Always use `import type` for type-only imports.

---

## Error Handling

- Use `unknown` in catch blocks, narrow with `instanceof Error` or `AxiosError` before accessing properties.
- Propagate API errors through TanStack Query's error state — do not swallow them.
- Global and per-feature `ErrorBoundary` components are planned; stub them where needed.

---

## Key Patterns
Components - **Purpose**: Pure presentation - **Rules**: - Receive typed props only - NO API calls - NO business logic - Minimal UI logic (local toggles, hovers) - Should be reusable - One component = one responsibility (SRP)

Custom Hooks - **Purpose**: Encapsulate stateful logic - **When to create**: - Uses React hooks (useState, useEffect, useCallback, etc.) - Manages state or side effects - API calls with state management - Complex logic that needs memoization - Reusable stateful behavior - **When NOT to create**: - Pure functions (use utils instead) - Static transformations - Simple formatters

Utils/Helpers - **Purpose**: Pure, reusable functions - **Examples**: - Date formatting: `formatLongDate(date: Date): string` - String transformations: `capitalize(str: string): string` - Data mapping: `mapStatusToLabel(status: string): string` - Calculations: `calculatePercentage(value: number, total: number): number` - **Rules**: - Always pure (same input = same output) - NO side effects - NO React hooks - Fully testable

Constants - **Purpose**: Static, immutable values - **Examples**: - Animation variants (Framer Motion) - Configuration objects - Enums/mappings - Color schemes - **Rules**: - NEVER inside components - Export as `const` with type annotations - Group by domain (animations, colors, routes, etc.)

## Key Principles
1. **Separation of Concerns**: Logic ≠ Presentation
2. **Single Responsibility**: One thing well 
3. **DRY**: Extract reusable code 
4. **Pure Functions**: Utils should be predictable
5. **Composition**: Build complex UIs from simple pieces
6. **Testability**: Pure functions + isolated components

## Tech Stack

- **React 19**
- **Vite 7**
- **TypeScript 5.9**
- **TanStack Router** — routing
- **TanStack Query** — data fetching
- **Tailwind CSS 4** — styling
- **Zustand** — state management
- **Axios** — API client
- **React Hook Form** + **Zod** — forms
