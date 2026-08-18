import { fail, type ActionFailure } from '@sveltejs/kit';
import postgres from 'postgres';
import { getEnvVar } from '$lib/server/env';
import { getBrevoEnv, upsertBrevoContact } from '$lib/server/brevo';
import { getTurnstileSecretKey, verifyTurnstileToken } from '$lib/server/turnstile';
import { readUtm, utmToBrevoAttributes } from '$lib/server/utm';
import type { Actions } from './$types';

function isValidEmail(v: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function failWith(status: 400 | 500, error: string): ActionFailure<{ error: string }> {
	if (status === 500) console.error('[newsletter] subscribe failed:', error);
	return fail(status, { error });
}

export const actions: Actions = {
	subscribe: async ({ request, platform, cookies }) => {
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
		const nicheSelect = String(form.get('niche') ?? '').trim();
		const nicheOther = String(form.get('nicheOther') ?? '').trim();
		const niche = nicheSelect === 'Other' ? nicheOther || 'Other' : nicheSelect;
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

		const utm = readUtm(cookies);

		// Freshly generated on every submit. If this is a brand-new row it
		// becomes the row's token. If the row already exists and was
		// previously unsubscribed, the upsert below swaps it in to rotate
		// the token — so an old unsubscribe link from a prior email can't be
		// replayed to re-suppress someone who has since resubscribed. If the
		// row exists and was never unsubscribed, the upsert keeps the
		// existing token untouched.
		const freshToken = crypto.randomUUID();

		const sql = postgres(databaseUrl, { prepare: false });
		try {
			await sql`
				insert into newsletter_subscribers (
					name, email, niche, submitted_ip, unsubscribe_token,
					utm_source, utm_medium, utm_campaign, utm_content, utm_term
				)
				values (
					${name || null},
					${email},
					${niche || null},
					${submittedIp},
					${freshToken},
					${utm.utm_source ?? null},
					${utm.utm_medium ?? null},
					${utm.utm_campaign ?? null},
					${utm.utm_content ?? null},
					${utm.utm_term ?? null}
				)
				on conflict (email) do update
				set name = coalesce(excluded.name, newsletter_subscribers.name),
					niche = coalesce(excluded.niche, newsletter_subscribers.niche),
					-- Resubscribing clears suppression state on our side; the
					-- Brevo blacklist flag is cleared separately below.
					unsubscribed_at = null,
					unsubscribe_token = case
						when newsletter_subscribers.unsubscribed_at is not null
							then excluded.unsubscribe_token
						else newsletter_subscribers.unsubscribe_token
					end,
					-- Re-subscribing under a new campaign updates attribution to the
					-- most recent one that brought them back.
					utm_source = coalesce(excluded.utm_source, newsletter_subscribers.utm_source),
					utm_medium = coalesce(excluded.utm_medium, newsletter_subscribers.utm_medium),
					utm_campaign = coalesce(excluded.utm_campaign, newsletter_subscribers.utm_campaign),
					utm_content = coalesce(excluded.utm_content, newsletter_subscribers.utm_content),
					utm_term = coalesce(excluded.utm_term, newsletter_subscribers.utm_term)
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
				// Submitting this form is an explicit, active opt-in — always
				// clear Brevo's blacklist flag so a prior unsubscribe doesn't
				// silently keep suppressing campaigns after someone resubscribes.
				emailBlacklisted: false,
				attributes: {
					SOURCE: 'newsletter_page',
					NICHE: niche || undefined,
					...utmToBrevoAttributes(utm)
				}
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
