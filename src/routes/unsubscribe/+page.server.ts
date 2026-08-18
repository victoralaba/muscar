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

export const load: PageServerLoad = ({ url }) => {
	const email = url.searchParams.get('email')?.trim() ?? '';
	return { prefillEmail: isValidEmail(email) ? email : '' };
};

export const actions: Actions = {
	unsubscribe: async ({ request, platform }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();

		if (!isValidEmail(email)) {
			return failWith(400, 'Please enter a valid email address.');
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
		const databaseUrl = getEnvVar(platform, 'DATABASE_URL');
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

		return { ok: true };
	}
};
