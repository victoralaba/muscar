# Shared package plan: `@victoralaba/muscar-core`

Status: planned, not started. Written so a later session can pick it up cold.

## Why

`muscar` (survey + newsletter, `muscar.app`) and `muscar_service` (services, `services.muscar.app`)
both carry copies of the same code. A fix in one has to be repeated by hand in the other. The plan
is to move the shared logic into a private npm package hosted on GitHub Packages.

Decision already made: use GitHub Packages (not a git dependency, not a monorepo).

## What is duplicated today

Identical in both repos:

- `src/lib/server/brevo.ts`, `turnstile.ts`, `utm.ts`, `env.ts`
- `src/hooks.server.ts`
- `src/lib/components/Turnstile.svelte`
- `src/lib/client/analytics.ts`
- `src/routes/newsletter/*`, `src/routes/unsubscribe/*`
- `src/routes/+layout.server.ts` (almost identical)
- the newsletter migrations `002`, `003`, `005`, `006` in `src/files/`

## What goes in the package

- Server helpers: `brevo`, `turnstile`, `utm` (including `needsCookieConsent`), `env`.
- `Turnstile.svelte` and `analytics.ts`.
- The newsletter and unsubscribe logic as plain functions (subscribe, unsubscribe, token handling).

## What stays in each site

SvelteKit routes cannot live in a package. Each site keeps thin route files that call the shared
functions: `/newsletter`, `/unsubscribe`, `hooks.server.ts`, `+layout.server.ts`. Pages and copy
that differ per site (home, about, contact, privacy, terms) stay where they are.

## Changes the package needs

- `env.ts` imports `$env/dynamic/private`, which only exists inside a SvelteKit app. Replace it with
  a function that takes the environment as an argument, and have each site pass in
  `process.env` / `platform.env`.
- Build with `@sveltejs/package` (`svelte-package`) into `dist/`, with an `exports` map.
- Peer dependencies: `svelte`, `@sveltejs/kit`, `postgres`. Do not bundle them.
- Consumers may need `ssr.noExternal: ['@victoralaba/muscar-core']` in `vite.config.ts` so Vite
  processes the `.svelte` files and any SvelteKit imports.

## Pipeline

1. New repo `victoralaba/muscar_core` publishes `@victoralaba/muscar-core`. GitHub requires the
   scope to equal the owner name, lowercase.
2. A GitHub Action publishes on every version tag (`v*`). It uses the built-in `GITHUB_TOKEN` with
   `packages: write`. No personal token is needed to publish.
3. Both sites get a `.npmrc`:

   ```
   @victoralaba:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
   ```

4. Installing a private package needs a token. As far as we know this must be a classic personal
   access token with `read:packages`, because fine-grained tokens did not cover packages. Verify
   against the current GitHub docs.
5. Add that token as `NODE_AUTH_TOKEN` in the Cloudflare build variables for both projects, and
   export it locally before `pnpm install`.
6. Turn on Dependabot or Renovate in both sites so a new package version opens a PR in each.

Free tier note (figures from memory, check current pricing): private packages on the free plan
include roughly 500 MB storage and 1 GB of downloads a month. Two small sites are far below that.

## Steps for the next session

Prerequisites, done by the user:

- [ ] Merge `muscar` PR #11 and `muscar_service` PR #1 so the work starts from clean `main` branches.
- [ ] Approve creating `victoralaba/muscar_core` (or create it), then attach it to the session.
- [ ] Create the classic token (`read:packages`) and add it as `NODE_AUTH_TOKEN` in both Cloudflare
      projects.

Then:

1. Scaffold `muscar_core` (`pnpm`, `@sveltejs/package`, `tsconfig`, `package.json` with `exports`,
   `publishConfig.registry`, peer dependencies).
2. Move the shared files over. Refactor `env.ts` to take the environment as input. Turn the
   newsletter and unsubscribe actions into functions.
3. Add the publish workflow, tag `v0.1.0`, and confirm the package appears under the repo's
   Packages tab.
4. In each site: add `.npmrc`, install the package, delete the duplicated files, rewrite the route
   files as thin wrappers, update imports.
5. Run `pnpm check` and `pnpm build` in both sites, then deploy a preview on Cloudflare and test
   the newsletter signup, unsubscribe, and the attribution cookie.
6. Update both READMEs. Their "Shared code" sections currently say the files are copied by hand.

## Current related setup (for context)

- Both Cloudflare projects share `DATABASE_URL` and `BREVO_NEWSLETTER_LIST_ID`.
- `SURVEY_SITE_URL` (services site only, `https://muscar.app`) drives the newsletter page's link
  back to `/survey`. Blank on the survey site.
- `COOKIE_DOMAIN` (optional, `.muscar.app`, same value on both) shares the `muscar_utm` attribution
  cookie. The cookie is skipped for visitors in the EU, EEA, UK and Switzerland (no consent banner).
- Contact email subjects are tagged `[survey]` and `[Services]`.
