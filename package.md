# Shared package plan: `@victoralaba/muscar-core`

Status: the package is scaffolded in `victoralaba/muscar_core` (branch `indigo/relaxed-newton-e7xqi8`,
not yet on `main`, not yet published). Both sites still use their own copies. Written so a later
session can pick it up cold.

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

Done:

- [x] `muscar` PR #11 and `muscar_service` PR #1 merged.
- [x] `muscar_core` created, scaffolded, and pushed on the branch above: env reader, Brevo, Turnstile,
      UTM attribution, newsletter and unsubscribe handlers, analytics, the Turnstile component, 24
      unit tests, CI and a publish workflow. `pnpm check`, `pnpm test` and `pnpm build` (with
      publint) pass.
- [x] Validated end to end on a scratch copy of `muscar_service`: installed the packed tarball,
      migrated the code (recipe below), and `svelte-check` and `vite build` with the Cloudflare adapter
      both passed. The package code (including the SQL) ends up in the worker bundle.

Still to do, in order:

1. **`muscar_core` needs a `main` branch.** The repo was empty, so there is nothing to open a PR
   against. The user should add an initial commit on `main` (for example "Add a README" on GitHub),
   then rebase the scaffold branch onto it (`git rebase origin/main`) and open the PR.
2. Merge that PR, then tag `v0.1.0` and push the tag. The `Publish` workflow publishes to GitHub
   Packages. Confirm the package appears under the repo's Packages tab and is linked to the repo.
3. Give the sites read access: on the package's settings page, add `muscar` and `muscar_service`
   as repositories with read access (needed for their Actions and Dependabot).
4. The user creates a classic personal access token with `read:packages` and adds it as
   `NODE_AUTH_TOKEN` in both Cloudflare projects (build variables, encrypted).
5. Migrate `muscar_service` first, then `muscar` (recipe below), one PR each. Cloudflare previews
   will only build once step 4 is done.
6. Enable Dependabot in both sites for the `@victoralaba` scope.
7. Update both READMEs: their "Shared code" sections still say the files are copied by hand.

## Migration recipe (validated on a scratch copy of muscar_service)

In each site:

1. Add `.npmrc` (see Pipeline above) and `pnpm add @victoralaba/muscar-core`.
2. Delete `src/lib/server/{brevo,turnstile,utm}.ts`, `src/lib/components/Turnstile.svelte`,
   `src/lib/client/analytics.ts`.
3. Replace `src/lib/server/env.ts` with:

   ```ts
   import { env } from '$env/dynamic/private';
   import { createEnvReader } from '@victoralaba/muscar-core/server';

   /** Per-request env reader: `readEnv(platform)('KEY')`. */
   export const readEnv = createEnvReader(() => env);
   ```

4. `src/hooks.server.ts`: call `captureUtm(url, cookies, { domain, persist, secure: !dev })` with
   `domain: readEnv(event.platform)('COOKIE_DOMAIN')` and
   `persist: !needsCookieConsent(event.request.headers.get('cf-ipcountry'))`.
5. `+layout.server.ts`: read the env vars with `const env = readEnv(platform)` then `env('UMAMI_SCRIPT_URL')`
   and so on.
6. `/newsletter` and `/unsubscribe` `+page.server.ts` become thin wrappers over `subscribeToNewsletter`,
   `loadUnsubscribePage` and `unsubscribeFromNewsletter`. Each returns `{ ok: true }` or
   `{ ok: false, status, error }`, which the route turns into `fail(status, { error })`. See the
   `muscar_core` README for an example.
7. Contact (both sites) and the application form (`muscar_service` home) keep their own handlers
   but import `getBrevoEnv`, `getClientIp`, `isValidEmail`, `formatUtmLine`, `readUtm`,
   `sendTransactionalEmail`, `verifyTurnstileToken` and `getTurnstileSecretKey` from the package.
   Pass `readEnv(platform)` instead of `platform`. `muscar`'s survey handler does the same.
8. Pages: import `trackEvent` and `utmEventData` from `@victoralaba/muscar-core/client`. Import
   `Turnstile` from `@victoralaba/muscar-core/Turnstile.svelte` and pass
   `siteKey={env.PUBLIC_TURNSTILE_SITE_KEY ?? ''}` (`env` from `$env/dynamic/public`).
9. `src/app.d.ts`: type `locals.utm` as `import('@victoralaba/muscar-core/server').UtmData` and delete
   the `Window.turnstile` declaration (the package declares it).
10. `pnpm check` and `pnpm build`, then test a preview: newsletter signup, unsubscribe by link and
    by email, a contact message, the attribution cookie, and the EU skip (VPN to Germany).

Notes from the scaffold: the handlers' bot-check error text is now "Bot check failed. Please
retry." (em dash removed). `muscar`'s survey handler is not in the package.

## Current related setup (for context)

- Both Cloudflare projects share `DATABASE_URL` and `BREVO_NEWSLETTER_LIST_ID`.
- `SURVEY_SITE_URL` (services site only, `https://muscar.app`) drives the newsletter page's link
  back to `/survey`. Blank on the survey site.
- `COOKIE_DOMAIN` (optional, `.muscar.app`, same value on both) shares the `muscar_utm` attribution
  cookie. The cookie is skipped for visitors in the EU, EEA, UK and Switzerland (no consent banner).
- Contact email subjects are tagged `[survey]` and `[Services]`.
