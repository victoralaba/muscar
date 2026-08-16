import { fail, type ActionFailure } from '@sveltejs/kit';
import postgres from 'postgres';
import { getEnvVar } from '$lib/server/env';
import { getBrevoEnv, upsertBrevoContact } from '$lib/server/brevo';
import { getTurnstileSecretKey, verifyTurnstileToken } from '$lib/server/turnstile';
import type { Actions } from './$types';

function isValidEmail(v: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function failWith(status: 400 | 500, error: string): ActionFailure<{ error: string }> {
	if (status === 500) console.error('[newsletter] subscribe failed:', error);
	return fail(status, { error });
}

export const actions: Actions = {
	subscribe: async ({ request, platform }) => {
		const databaseUrl = getEnvVar(platform, 'DATABASE_URL');
		if (!databaseUrl) {
			return failWith(500, 'DATABASE_URL is not configured.');
		}

		const turnstileSecret = getTurnstileSecretKey(platform);
		if (!turnstileSecret) {
			return failWith(500, 'TURNSTILE_SECRET_KEY is not configured.');
		}

		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();
		const name = String(form.get('name') ?? '').trim();
		const niche = String(form.get('niche') ?? '').trim();
		const turnstileToken = form.get('cf-turnstile-response');

		if (!isValidEmail(email)) {
			return failWith(400, 'Please enter a valid email address.');
		}

		const forwarded =
			request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for');
		const submittedIp = forwarded?.split(',')[0]?.trim() ?? null;

		const verified = await verifyTurnstileToken(
			typeof turnstileToken === 'string' ? turnstileToken : null,
			turnstileSecret,
			submittedIp
		);
		if (!verified) {
			return failWith(400, 'Bot check failed — please retry.');
		}

		const sql = postgres(databaseUrl, { prepare: false });
		try {
			await sql`
				insert into newsletter_subscribers (name, email, niche, submitted_ip)
				values (
					${name || null},
					${email},
					${niche || null},
					${submittedIp}
				)
				on conflict (email) do update
				set name = coalesce(excluded.name, newsletter_subscribers.name),
					niche = coalesce(excluded.niche, newsletter_subscribers.niche)
			`;
		} catch (err) {
			return failWith(500, err instanceof Error ? err.message : String(err));
		} finally {
			await sql.end({ timeout: 2 });
		}

		// Best-effort: the DB row above is the source of truth. A Brevo hiccup
		// shouldn't fail the signup.
		const brevo = getBrevoEnv(platform);
		if (brevo.apiKey) {
			const result = await upsertBrevoContact({
				apiKey: brevo.apiKey,
				email,
				listId: brevo.newsletterListId,
				name: name || undefined,
				attributes: { SOURCE: 'newsletter_page', NICHE: niche || undefined }
			});
			if (!result.ok) {
				console.error('[newsletter] brevo upsert failed:', result.error);
			}
		} else {
			console.error('[newsletter] BREVO_API_KEY is not configured; skipping Brevo sync.');
		}

		return { ok: true };
	}
};
