---
name: src-structure-conventions
description: "Use when: defining or refactoring a src architecture; deciding where code belongs (shared, core, routes, modules); separating Zod schemas from TypeScript types; organizing feature pods; following kebab-case naming; and keeping route-level logic in TanStack Router file-based routes."
argument-hint: "Optionally specify the feature name or src path you are working in"
---

# Src Structure Conventions

Use this skill to define or refactor a `src/` structure for React projects.

Prefer these conventions for new work. When refactoring, move toward this structure incrementally rather than renaming unrelated files.

## Folder Map

- `src/assets`: Static assets imported by the app.
- `src/shared`: Reusable code shared across features.
  - `components`: Shared presentational UI building blocks.
  - `hooks`: Shared React hooks.
  - `utils`: Shared framework-agnostic helpers.
  - `types`: Shared TypeScript-only types and interfaces.
  - `schemas`: Shared Zod schemas and validation utilities.
- `src/core`: Application-wide infrastructure and cross-cutting concerns.
  - `api`: Shared API client config, routes, query config, and API providers.
  - `constants`: Global config values and config helpers.
  - `i18n`: Translation setup, typed keys, i18n providers, and helpers.
  - `log`: Logging contracts and implementation.
  - `theme`: Theme contracts, config, and provider.
- `src/routes`: File-based TanStack Router routes. Keep loaders, search params, guards, and composition here.
- `src/modules/<feature>`: Feature module.
  - `api`: Feature API calls. One file per API resource.
  - `queries`: TanStack Query key factories and `queryOptions`. One file per resource.
  - `store`: Zustand stores for ephemeral UI state (e.g. wizard steps, draft form data).
  - `mappers`: Data transformation between API and UI shapes.
  - `utils`: Feature-specific framework-agnostic helpers.
  - `types`: Feature-specific TypeScript types and interfaces.
  - `schemas`: Feature-specific Zod schemas and runtime validation.
  - `pods`: Small, self-contained UI slices.
- `src/favicon`: Source-controlled favicon assets.

## Decision Rules

1. `shared` — only if reused across multiple modules.
2. `core` — only for application-wide infrastructure or cross-cutting concerns.
3. `routes` — route-level composition, loaders, search params, and page wiring.
4. `modules/<feature>` — all domain-specific code.
5. `modules/<feature>/queries` — TanStack Query key factories and `queryOptions`, one file per resource.
6. `modules/<feature>/store` — ephemeral UI state only; use TanStack Query for server state.
7. `types` vs `schemas` — TypeScript-only contracts go in `types`; runtime Zod validation goes in `schemas`.
8. `mappers` — pure data transformation only.
9. Pods are presentational by default; avoid turning them into mini feature roots.
10. Prefer the smallest file set that matches the responsibility. Don't create files just to mirror a pattern.

## Naming

- Use lowercase kebab-case for all folder names and file basenames.
- Use `.tsx` only for files that render JSX; use `.ts` for everything else.
- Use `index.ts` only for re-exports.
- Keep tooling-required suffixes: `*.test.ts`, `*.test.tsx`, `*.d.ts`.

| Pattern                            | Responsibility                                             |
| ---------------------------------- | ---------------------------------------------------------- |
| `*-api.ts`                         | API call implementation                                    |
| `*-queries.ts`                     | TanStack Query key factory and `queryOptions` map          |
| `*-store.ts` / `create-*-store.ts` | Zustand store (use `create-` prefix for factory functions) |
| `*-mapper.ts`                      | Pure data transformation                                   |
| `*-type.ts`                        | TypeScript-only types and interfaces                       |
| `*-schema.ts`                      | Zod schema and inferred types                              |
| `*-component.tsx`                  | Presentational component                                   |
| `*-constants.ts`                   | Local constants                                            |

## Types vs Schemas

- Use `types` for TypeScript-only contracts: `type`, `interface`, utility types, and props shapes.
- Use `schemas` for Zod definitions and runtime validation.
- If a type is inferred from a Zod schema and only used alongside it, keep both in the same file.
- If a type is shared broadly without runtime validation, place it in `types`.

```ts
// src/modules/info/schemas/info-schema.ts
import { z } from "zod";

export const infoSchema = z.object({ id: z.string(), name: z.string() });
export type Info = z.infer<typeof infoSchema>;
```

## Queries

- One file per API resource in `<feature>/queries/` (e.g. `info-queries.ts`).
- Each file exports a typed key factory (`*Keys`) and a `queryOptions` map (`*Queries`).
- Key factories use `as const` tuples following `all → lists → list(filters) → details → detail(id)`.
- `queryOptions` entries call `*-api.ts` functions; they never call `useQuery` directly.

```ts
// src/modules/info/queries/info-queries.ts
import { queryOptions } from "@tanstack/react-query";
import { getInfo, getInfoList } from "@/modules/info/api/info-api";
import type { InfoListFilters } from "@/modules/info/schemas/info-schema";

export const infoKeys = {
  all: ["info"] as const,
  lists: () => [...infoKeys.all, "list"] as const,
  list: (filters: InfoListFilters) => [...infoKeys.lists(), filters] as const,
  details: () => [...infoKeys.all, "detail"] as const,
  detail: (id: string) => [...infoKeys.details(), id] as const,
};

export const infoQueries = {
  list: (filters: InfoListFilters) =>
    queryOptions({
      queryKey: infoKeys.list(filters),
      queryFn: () => getInfoList(filters),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: infoKeys.detail(id),
      queryFn: () => getInfo(id),
      enabled: !!id,
    }),
};
```

## Store

- One file per store in `<feature>/store/`.
- Use only for ephemeral UI state that must survive step navigation (e.g. wizards, draft data). Never for server state.
- Export a factory function (prefix `create-`) when initialization parameters are needed; use a plain `create()` store otherwise.
- Use `createSelectors` from `@/lib/zustand` to expose individual state selectors.

```ts
// src/modules/info/store/create-info-store.ts
import { create } from "zustand/react";
import { createSelectors } from "@/lib/zustand";

type InfoStore = {
  name: string;
  setName: (name: string) => void;
  reset: () => void;
};

export function createInfoStore(initialName = "") {
  return createSelectors(
    create<InfoStore>()((set) => ({
      name: initialName,
      setName: (name) => set({ name }),
      reset: () => set({ name: initialName }),
    })),
  );
}
```

## Route Composition

- Prefer TanStack Router file-based routes.
- Keep route-level composition, data loading, search param parsing, and page wiring in route files.
- Do not create pod containers by default if the same responsibility belongs in a route file.
- Use pod-level containers only when a UI slice is reused outside a single route and needs its own composition layer.

## Pod Guidance

- Pod folder names are descriptive and kebab-case (e.g. `interesting-section`, `header-app`).
- Pods stay focused on a UI slice; they are not mini feature roots.
- Default contents: component, constants, tests, and optional local `types` or `schemas`.
- Skip files that don't add value.

## Complete Module Example

```text
src/
  shared/
    components/
    hooks/
    utils/
    types/
    schemas/
  core/
    api/
    i18n/
    theme/
  routes/
    __root.tsx
    info.tsx
  modules/
    info/
      api/
        info-api.ts
      queries/
        info-queries.ts
      store/
        create-info-store.ts
      mappers/
        info-mapper.ts
      utils/
        info-utils.ts
      types/
        info-type.ts
      schemas/
        info-schema.ts
      pods/
        interesting-section/
          interesting-section-component.tsx
          interesting-section-constants.ts
          interesting-section.test.tsx
          index.ts
```
