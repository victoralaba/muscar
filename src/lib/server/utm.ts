import type { Cookies } from '@sveltejs/kit';
import { dev } from '$app/environment';

const COOKIE_NAME = 'muscar_utm';

// 30 days: long enough that someone who clicks an email link today and
// converts on a later visit still gets attributed to that campaign, short
// enough that stale attribution data doesn't linger indefinitely.
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

type UtmKey = (typeof UTM_KEYS)[number];

export type UtmData = Partial<Record<UtmKey, string>>;

function parseCookie(raw: string | undefined): UtmData {
	if (!raw) return {};

	try {
		const parsed: unknown = JSON.parse(raw);
		if (typeof parsed !== 'object' || parsed === null) return {};

		const out: UtmData = {};
		for (const key of UTM_KEYS) {
			const value = (parsed as Record<string, unknown>)[key];
			if (typeof value === 'string' && value) out[key] = value;
		}
		return out;
	} catch {
		return {};
	}
}

/**
 * Reads utm_* params off the current request URL. If any are present, they
 * overwrite the stored attribution cookie (last campaign touch wins) so
 * that a follow-up click from a different campaign updates attribution.
 * Otherwise, falls back to whatever was already stored from an earlier
 * page in this session — this is what lets a landing-page click on an
 * email link still get credited when the person converts a few pages
 * later (e.g. lands on `/`, then submits the form on `/survey`).
 *
 * Pass `domain` (e.g. `.muscar.app`) to share the cookie across subdomains so
 * attribution survives a hop between the survey and services sites.
 *
 * Pass `persist: false` to skip the cookie entirely (see `needsCookieConsent`).
 *
 * Called once per request from `hooks.server.ts` and stashed on
 * `event.locals.utm`.
 */
export function captureUtm(
	url: URL,
	cookies: Cookies,
	{ domain, persist = true }: { domain?: string; persist?: boolean } = {}
): UtmData {
	const fromUrl: UtmData = {};
	for (const key of UTM_KEYS) {
		const value = url.searchParams.get(key);
		if (value) fromUrl[key] = value;
	}

	// No consent banner, so in regions that require consent for non-essential cookies
	// we neither read nor write the attribution cookie. UTM params on the current
	// request are still returned for that one request.
	if (!persist) return fromUrl;

	if (Object.keys(fromUrl).length > 0) {
		cookies.set(COOKIE_NAME, JSON.stringify(fromUrl), {
			path: '/',
			...(domain ? { domain } : {}),
			maxAge: MAX_AGE_SECONDS,
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev
		});
		return fromUrl;
	}

	return parseCookie(cookies.get(COOKIE_NAME));
}

/** Reads the stored attribution cookie without touching it. */
export function readUtm(cookies: Cookies): UtmData {
	return parseCookie(cookies.get(COOKIE_NAME));
}

/** True if any utm_* value is present. */
export function hasUtm(utm: UtmData): boolean {
	return UTM_KEYS.some((key) => Boolean(utm[key]));
}

/** Maps utm data onto Brevo contact attribute keys. */
export function utmToBrevoAttributes(utm: UtmData): Record<string, string> {
	const out: Record<string, string> = {};
	if (utm.utm_source) out.UTM_SOURCE = utm.utm_source;
	if (utm.utm_medium) out.UTM_MEDIUM = utm.utm_medium;
	if (utm.utm_campaign) out.UTM_CAMPAIGN = utm.utm_campaign;
	if (utm.utm_content) out.UTM_CONTENT = utm.utm_content;
	if (utm.utm_term) out.UTM_TERM = utm.utm_term;
	return out;
}

// ISO 3166-1 alpha-2 codes of the EU, the rest of the EEA, the UK, and Switzerland.
const CONSENT_REGIONS = new Set([
	'AT',
	'BE',
	'BG',
	'HR',
	'CY',
	'CZ',
	'DK',
	'EE',
	'FI',
	'FR',
	'DE',
	'GR',
	'HU',
	'IE',
	'IT',
	'LV',
	'LT',
	'LU',
	'MT',
	'NL',
	'PL',
	'PT',
	'RO',
	'SK',
	'SI',
	'ES',
	'SE',
	'IS',
	'LI',
	'NO',
	'GB',
	'CH'
]);

/**
 * True when the visitor is in a region where a non-essential cookie needs prior
 * consent. `country` is Cloudflare's `cf-ipcountry` header; when it is missing
 * (local dev) we assume no restriction.
 */
export function needsCookieConsent(country: string | null | undefined): boolean {
	return !!country && CONSENT_REGIONS.has(country.toUpperCase());
}
