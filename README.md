# Muscar

The survey and newsletter site for Muscar, served at `muscar.app`. It asks trade business owners
what is real about AI and what is noise, then reports the findings back in plain language.

The paid service offer and case studies live in a separate repo, `muscar_service`, served at
`services.muscar.app`. That site is pitched personally and is not linked from here.

Built with SvelteKit (Svelte 5), Tailwind, and shadcn-svelte, deployed to Cloudflare.

## Routes

- `/`: landing page
- `/survey`: the survey (questions in `src/lib/survey/schema.ts`, wording reference in `src/docs/survey.md`)
- `/newsletter`, `/unsubscribe`: signup and unsubscribe, shared with `muscar_service`
- `/about`, `/contact`, `/privacy`, `/terms`

## Developing

```sh
pnpm install
cp .env.example .env
pnpm dev
```

Other scripts: `pnpm check` (types), `pnpm lint`, `pnpm format`, `pnpm build`.

## Environment

Copy `.env.example` and fill it in. On Cloudflare, set the same names as project variables.

- `DATABASE_URL`: Postgres. The survey and newsletter write here.
- `BREVO_API_KEY`, `BREVO_NEWSLETTER_LIST_ID`, `BREVO_SURVEY_LIST_ID`: email and contacts.
- `TURNSTILE_SECRET_KEY`, `PUBLIC_TURNSTILE_SITE_KEY`: bot check on every form.
- `CONTACT_EMAIL`: where contact form messages go. Messages are tagged `[survey]` in the subject.
- `UMAMI_SCRIPT_URL`, `UMAMI_WEBSITE_ID`: optional analytics.
- `COOKIE_DOMAIN`: optional, e.g. `.muscar.app`. Shares the campaign attribution cookie with the
  services site. Set the same value on both sites.
- `SURVEY_SITE_URL`: leave blank here. Used by the services site to link back to `/survey`.

## Database

SQL migrations are in `src/files/`, numbered in the order they should be run. Apply them by hand
against `DATABASE_URL`. `001` and `004` belong to the survey. `002`, `003`, `005`, and `006` belong
to the newsletter and are also in `muscar_service`. Both sites use the same database and the same
Brevo newsletter list.

## Shared code with muscar_service

These files are copies and must be kept in step by hand: `src/lib/server/{brevo,env,turnstile,utm}.ts`,
`src/hooks.server.ts`, `src/routes/newsletter`, `src/routes/unsubscribe`, and
`src/lib/components/Turnstile.svelte`. A fix in one needs the same fix in the other.

## Cookies

The only cookie we set is `muscar_utm`, which remembers the campaign link a visitor arrived from for 30 days. There is no consent banner, so the cookie is not set for visitors in the EU, EEA, UK, or Switzerland (detected from Cloudflare's `cf-ipcountry` header). See `needsCookieConsent` in `src/lib/server/utm.ts`.
