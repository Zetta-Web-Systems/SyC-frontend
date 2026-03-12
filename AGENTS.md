# AGENTS.md — SyC Frontend

Internal gym management platform (Sano & Controlado). React 19 + Vite 7 + TypeScript 5.9,
feature-based architecture. Early-stage project — `features/` is not yet populated.

---

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # Type-check + production build (tsc -b && vite build)
npm run lint       # Run ESLint on all .ts / .tsx files
npm run preview    # Preview the production build locally
```

**There is no test framework configured yet.** Playwright (E2E) is planned but not installed.
Do not attempt to run tests; add them only when explicitly asked.

Run `npm run lint` to check for lint violations before finishing a task.

---
# Agent Skills

The following global skills define the main implementation patterns:

- `frontend-architecture` — project structure, feature modules, API layer, state management patterns
- `react-19` — React 19 patterns with React Compiler
- `typescript` — strict TypeScript patterns
- `tailwind-4` — Tailwind CSS 4 styling rules
- `skill-creator` — creating and documenting new agent skills

Agents **must apply these skills automatically when their trigger conditions match the task.**

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
    ├── lib/              — cn.ts and other small utilities
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

All design system primitives must follow this structure:

```tsx
// Button/Button.tsx
import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@shared/lib/cn";
import { buttonVariants } from "./Button.variants";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, className }))} {...props} />
  ),
);
Button.displayName = "Button";
```

Rules:
- Use `forwardRef` on every primitive — always set `displayName`.
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

Available custom tokens (use these — never hardcode colors):

```
Primary palette:   bg-primary-{50…950}, text-primary-{50…950}
Secondary palette: bg-secondary-{50…950}
Semantic:          text-error, bg-success, text-warning, text-info
```

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

Server state lives **only** in TanStack Query — never in Zustand (when added).

---

## Forms

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
type LoginSchema = z.infer<typeof loginSchema>;

const form = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });
```

- Define the Zod schema first, derive the TypeScript type with `z.infer`.
- Schema files live next to the form component or in `features/<domain>/types/`.

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
3. `@features/` imports
4. `@shared/` imports
5. Relative imports (`./`, `../`) — only within the same zone

Always use `import type` for type-only imports.

---

## Error Handling

- Use `unknown` in catch blocks, narrow with `instanceof Error` or `AxiosError` before accessing properties.
- Propagate API errors through TanStack Query's error state — do not swallow them.
- Global and per-feature `ErrorBoundary` components are planned; stub them where needed.

---

## Planned (not yet installed)

The following tools are in the architecture plan but have **not** been added yet:
- **TanStack Router** — routing
- **Zustand** — client state
- **Playwright** — E2E testing
- **Phosphor Icons** — icon library

Do not install these unless explicitly instructed.
