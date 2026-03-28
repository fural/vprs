---
name: src-structure-conventions
description: "Use when: defining or refactoring a src architecture; deciding whether code belongs in shared, core, layout, routes, or modules; separating Zod schemas from TypeScript types and interfaces; organizing feature pods; following kebab-case file names; avoiding style files because Tailwind CSS is preferred; and keeping route-level container logic in TanStack Router file-based routes."
argument-hint: "Optionally specify the feature name or src path you are working in"
---

# Src Structure Conventions

Use this skill to define or refactor a `src/` structure for React projects.

Prefer these conventions for new work. When refactoring an existing project, move toward this structure incrementally instead of renaming unrelated files.

## Folder Map

- `src/assets`: Static assets imported by the app.
- `src/shared`: Reusable code shared across features.
- `src/shared/components`: Shared presentational UI building blocks.
- `src/shared/hooks`: Shared React hooks.
- `src/shared/utils`: Shared framework-agnostic helpers.
- `src/shared/types`: Shared TypeScript-only types and interfaces.
- `src/shared/schemas`: Shared Zod schemas and validation utilities.
- `src/core`: Application-wide infrastructure and cross-cutting concerns.
- `src/core/api`: Shared API client config, routes, query config, and API providers.
- `src/core/constants`: Global config values, constants, and config helpers.
- `src/core/i18n`: Translation setup, typed keys, i18n providers, and helpers.
- `src/core/log`: Logging contracts and logging implementation.
- `src/core/theme`: Theme contracts, config, and provider code.
- `src/routes`: File-based TanStack Router route files. Keep route-level loaders, search params, guards, and composition here.
- `src/favicon`: Source-controlled favicon assets.
- `src/modules`: Feature modules grouped by domain.
- `src/modules/<feature>/api`: Feature-specific API calls, mocks, and data-fetch hooks.
- `src/modules/<feature>/mappers`: Feature-specific data transformation code.
- `src/modules/<feature>/utils`: Feature-specific framework-agnostic helpers.
- `src/modules/<feature>/types`: Feature-specific TypeScript types and interfaces.
- `src/modules/<feature>/schemas`: Feature-specific Zod schemas and runtime validation.
- `src/modules/<feature>/pods`: Small, self-contained feature UI slices.
- `src/modules/<feature>/pods/<pod>`: Local files for one pod, usually component, constants, tests, local types, and local schemas when needed.

## Preferred Naming Rules

- Use lowercase kebab-case for folder names and file basenames.
- Prefer dashes instead of dot-qualified role suffixes for new files.
- Use `.tsx` only for files that render JSX.
- Use `.ts` for schemas, types, constants, hooks without JSX, mappers, API helpers, and route loaders.
- Keep `index.ts` only for directory public exports.
- Keep tooling-required suffixes when needed: `*.test.ts`, `*.test.tsx`, and `*.d.ts`.

## Types Versus Schemas

- Use `types` for TypeScript-only contracts: `type`, `interface`, utility types, and props shapes.
- Use `schemas` for Zod definitions and runtime validation.
- If a type is inferred from a Zod schema and only used next to that schema, keep it in the same schema file.

```ts
// src/modules/info/schemas/info-schema.ts
import { z } from "zod";

export const infoSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type Info = z.infer<typeof infoSchema>;
```

- If a type is shared broadly and does not require runtime validation, place it in `types`.

## Route Composition

- Prefer TanStack Router file-based routes.
- Keep route-level composition, data loading, search param parsing, and page wiring in route files.
- Do not create pod containers by default if the same responsibility belongs in a route file.
- Use pod-level containers only when a UI slice is reused outside a single route and genuinely needs its own composition layer.

## Pod Guidance

- Keep pod folder names descriptive and kebab-case, for example `interesting-section` or `header-app`.
- Pods should stay focused on a UI slice, not become mini feature roots.
- Default pod contents are component, constants, tests, and optional local `types` or `schemas` files.
- Skip files that do not add value.

## One Complete Module Example

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
        info-api-hook.ts
      mappers/
        info-mapper.ts
      utils/
        info-utils.ts
      types/
        info-type.ts
        interesting-section-type.ts
      schemas/
        info-schema.ts
      pods/
        interesting-section/
          interesting-section-component.tsx
          interesting-section-constants.ts
          interesting-section-type.ts
          interesting-section-schema.ts
          interesting-section.test.tsx
          index.ts
```

Example responsibilities:

- `info-api.ts`: feature API calls
- `info-api-hook.ts`: React Query or async hook wrapper for API usage
- `info-mapper.ts`: transforms API output into UI-friendly data
- `info-type.ts`: feature-level TypeScript contracts
- `info-schema.ts`: feature-level Zod validation
- `info-utils.ts`: feature-level utility functions
- `interesting-section-component.tsx`: presentational pod UI
- `interesting-section-constants.ts`: static pod configuration
- `interesting-section-type.ts`: pod-local TypeScript contracts when they are not shared feature-wide
- `interesting-section-schema.ts`: pod-local Zod schema when runtime validation is needed
- `routes/info.tsx`: route-level container logic, loaders, and composition

## File Naming Patterns

- `*-api.ts`: API call implementation
- `*-api-hook.ts`: hook wrapper around an API
- `*-mapper.ts`: pure data transformation
- `*-type.ts`: TypeScript-only type or interface definitions
- `*-schema.ts`: Zod schema definitions and inferred types when local
- `*-component.tsx`: presentational component
- `*-constants.ts`: local constants

## Decision Rules

1. Put code in `shared` only if it is reused across multiple modules.
2. Put code in `core` only if it is application-wide infrastructure or a cross-cutting concern.
3. Put route-owned composition in `routes`, especially with TanStack Router file-based routing.
4. Put domain-specific code in `modules/<feature>`.
5. Put pure TypeScript contracts in `types` and runtime validation in `schemas`.
6. Put pure transformation logic in `mappers`.
7. Keep pods presentational by default.
8. Prefer the smallest file set that matches the responsibility. Do not create files just to mirror a pattern.

## Refactoring Guidance

- Replace `common` with `shared` in the target architecture.
- Replace `model`, `models`, and `vm` with either `types` or `schemas` depending on whether runtime validation is required.
- Replace pod containers with route-level composition where TanStack Router file-based routes are the primary container boundary.
