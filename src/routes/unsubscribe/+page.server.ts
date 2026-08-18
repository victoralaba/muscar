import { fail, type ActionFailure } from '@sveltejs/kit';
import postgres from 'postgres';
import { getEnvVar } from '$lib/server/env';
import { getBrevoEnv, unsubscribeBrevoContact } from '$lib/server/brevo';
import type { Actions, PageServerLoad } from './$types';

function isValidEmail(v: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function failWith(status: 400 | 500, error: string): ActionFailure<{ error: string }> {
	if (status === 500) console.error('[unsubscribe] failed:', error);
	return fail(status, { error });
}

// Looks up the subscriber a token belongs to. Returns null on any miss
// (invalid token, DB not configured, query error) so callers can fall back
// to the manual-entry form rather than leaking why it failed.
async function resolveToken(
	databaseUrl: string | undefined,
	token: string
): Promise<string | null> {
	if (!databaseUrl) return null;

	const sql = postgres(databaseUrl, { prepare: false });
	try {
		const rows = await sql<{ email: string }[]>`
			select email from newsletter_subscribers
			where unsubscribe_token = ${token}
			limit 1
		`;
		return rows[0]?.email ?? null;
	} catch (err) {
		console.error(
			'[unsubscribe] token lookup failed:',
			err instanceof Error ? err.message : String(err)
		);
		return null;
	} finally {
		await sql.end({ timeout: 2 });
	}
}

// Links out to this page use an opaque `?token=` instead of `?email=` so a
// subscriber's address is never sitting in the URL — where it would get
// swept into analytics (Umami captures search params on pageviews) and
// browser/server access logs, and where anyone who could guess or find the
// link could unsubscribe someone else just by knowing their email.
export const load: PageServerLoad = async ({ url, platform }) => {
	const token = url.searchParams.get('token')?.trim() ?? '';
	if (!token) return { email: '', token: '' };

	const databaseUrl = getEnvVar(platform, 'DATABASE_URL');
	const email = await resolveToken(databaseUrl, token);

	// Invalid/expired token: fall back to the manual-entry form instead of
	// erroring, same as if they'd navigated here with nothing at all.
	return { email: email ?? '', token: email ? token : '' };
};

export const actions: Actions = {
	unsubscribe: async ({ request, platform }) => {
		const form = await request.formData();
		const token = String(form.get('token') ?? '').trim();
		const manualEmail = String(form.get('email') ?? '').trim();

		const databaseUrl = getEnvVar(platform, 'DATABASE_URL');

		// When a token is present it's the only thing we trust for who to
		// unsubscribe — never the accompanying email field, which a person
		// could tamper with client-side before submitting.
		let email: string;
		if (token) {
			const resolved = await resolveToken(databaseUrl, token);
			if (!resolved) {
				return failWith(400, 'This unsubscribe link is invalid or has expired.');
			}
			email = resolved;
		} else {
			if (!isValidEmail(manualEmail)) {
				return failWith(400, 'Please enter a valid email address.');
			}
			email = manualEmail;
		}

		const brevo = getBrevoEnv(platform);
		if (!brevo.apiKey) {
			return failWith(500, 'BREVO_API_KEY is not configured.');
		}

		// Brevo is the source of truth for whether we actually stop emailing
		// someone, so that call has to succeed for this action to succeed.
		const result = await unsubscribeBrevoContact({ apiKey: brevo.apiKey, email });
		if (!result.ok) {
			return failWith(500, result.error);
		}

		// Best-effort mirror in our own DB so newsletter_subscribers reflects
		// reality too. A failure here shouldn't undo the Brevo unsubscribe
		// above, which is the part that actually matters to the person.
		if (databaseUrl) {
			const sql = postgres(databaseUrl, { prepare: false });
			try {
				await sql`
					update newsletter_subscribers
					set unsubscribed_at = now()
					where email = ${email}
				`;
			} catch (err) {
				console.error(
					'[unsubscribe] DB update failed:',
					err instanceof Error ? err.message : String(err)
				);
			} finally {
				await sql.end({ timeout: 2 });
			}
		} else {
			console.error('[unsubscribe] DATABASE_URL is not configured; skipping DB mirror.');
		}

		return { ok: true, email };
	}
};
