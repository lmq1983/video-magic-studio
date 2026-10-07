# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

"Master Clip" — a front-end UI for a video editing app (long video → many Shorts), generated with and synced to [Lovable](https://lovable.dev). UI text is Vietnamese. Today it is a single interactive page with no backend: buttons mostly set a toast-style `notice` string, uploads only read the file name, and nothing is processed.

## Commands

Package manager is Bun (`bun.lock`, `bunfig.toml`); npm also works per the README.

- `bun install` — install deps. `bunfig.toml` enforces a 24h `minimumReleaseAge` supply-chain guard; do not add entries to `minimumReleaseAgeExcludes` without asking the user.
- `bun run dev` — Vite dev server
- `bun run build` — production build (Nitro, Cloudflare target by default)
- `bun run lint` — ESLint (includes Prettier as a lint rule)
- `bun run format` — Prettier write

- `bun run test` — Vitest unit/component tests (jsdom + Testing Library), files `src/**/*.test.{ts,tsx}`; config in `vitest.config.ts`, separate from the Lovable `vite.config.ts`.

## Stack and architecture

- **TanStack Start** (React 19, SSR) on **Vite 8**, **Tailwind CSS v4**, shadcn/ui (new-york style) on Radix, `lucide-react` icons, TanStack Query.
- `vite.config.ts` uses `@lovable.dev/vite-tanstack-config`, which already bundles the React, Tailwind, tsconfig-paths, TanStack Start, Nitro and devtools plugins. Never add those plugins again; pass extra options through `defineConfig`.
- **Routing is file-based** in `src/routes/` (see `src/routes/README.md`). `__root.tsx` is the only layout (HTML shell, global `<head>` meta, Google Fonts Manrope/Sora, 404 and error components) and must keep its `<Outlet />`. `src/routeTree.gen.ts` is generated; never edit it.
- `src/routes/index.tsx` holds the whole Clips workspace (header, URL/upload/drag-drop input, mode and tab switches, AI tool grid, sample videos, recent projects) as one component with local `useState`. Per `AGENTS.md`, keep it a single route built from reusable primitives.
- `src/server.ts` (SSR entry, set via `tanstackStart.server.entry` in `vite.config.ts`) and `src/start.ts` (request middleware) wrap errors into `renderErrorPage()`. `start.ts` re-adds CSRF middleware for server functions; keep it if you edit that file.
- `src/lib/error-capture.ts` keeps the last thrown server error (with its cause chain) so `server.ts` can log it after h3 swallows it into a generic 500. `src/lib/lovable-error-reporting.ts` forwards client errors to Lovable's `window.__lovableEvents`.
- Path alias `@/*` → `src/*`. TypeScript is strict with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`, so array lookups are `T | undefined` and optional props cannot be passed `undefined` explicitly.

## Styling conventions

- All colors are semantic tokens defined in `src/styles.css` (`:root` / `.dark`, **oklch only**) and registered in the `@theme inline` block as `--color-<name>`. To add a color, add the variable in both blocks and register it there. Use classes like `bg-panel`, `text-brand`, `shadow-brand`; do not hard-code hex/rgb in components.
- Custom tokens beyond shadcn defaults: `brand`, `brand-strong`, `brand-foreground`, `panel`, `panel-raised`, `subtle`, `shadow-brand` (dark gold theme).
- Fonts: `font-sans` (Manrope), `font-display` (Sora).
- shadcn components live in `src/components/ui/`; `button.tsx` has project-specific variants (e.g. `nav`). Use `cn()` from `@/lib/utils` to merge classes.

## Assets

Videos in `src/assets/*.mp4.asset.json` are Lovable-hosted pointers (JSON with a `url` like `/__l5e/assets-v1/...`), not files. They resolve only inside Lovable's hosting, so sample videos will not play in a plain local dev server. Images (`*.jpg`) are real files.

## Lovable sync

`main` syncs both ways with the Lovable editor. Never force-push or rewrite pushed history, and keep `main` buildable. `.lovable/` holds Lovable's project metadata and plan notes; leave it alone.
