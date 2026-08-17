import { fail, type ActionFailure } from '@sveltejs/kit';
import { getEnvVar } from '$lib/server/env';
import { getBrevoEnv, sendTransactionalEmail } from '$lib/server/brevo';
import { getTurnstileSecretKey, verifyTurnstileToken } from '$lib/server/turnstile';
import { hasUtm, readUtm } from '$lib/server/utm';
import type { Actions } from './$types';

function isValidEmail(v: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function failWith(status: 400 | 500, error: string): ActionFailure<{ error: string }> {
	if (status === 500) console.error('[contact] send failed:', error);
	return fail(status, { error });
}

export const actions: Actions = {
	send: async ({ request, platform, cookies }) => {
		const brevo = getBrevoEnv(platform);
		if (!brevo.apiKey) {
			return failWith(500, 'BREVO_API_KEY is not configured.');
		}

		const turnstileSecret = getTurnstileSecretKey(platform);
		if (!turnstileSecret) {
			return failWith(500, 'TURNSTILE_SECRET_KEY is not configured.');
		}

		const toEmail = getEnvVar(platform, 'CONTACT_EMAIL');
		if (!toEmail) {
			return failWith(500, 'CONTACT_EMAIL is not configured.');
		}

		const form = await request.formData();
		const name = String(form.get('name') ?? '').trim();
		const email = String(form.get('email') ?? '').trim();
		const message = String(form.get('message') ?? '').trim();
		const turnstileToken = form.get('cf-turnstile-response');

		if (!isValidEmail(email)) {
			return failWith(400, 'Please enter a valid email address.');
		}
		if (!message) {
			return failWith(400, 'Please enter a message.');
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

		// No DB row for contact submissions, so the campaign that drove this
		// message is only ever visible here — fold it into the email body.
		const utm = readUtm(cookies);
		const utmLine = hasUtm(utm)
			? `\n\nCampaign: ${[
					utm.utm_source && `source=${utm.utm_source}`,
					utm.utm_medium && `medium=${utm.utm_medium}`,
					utm.utm_campaign && `campaign=${utm.utm_campaign}`,
					utm.utm_content && `content=${utm.utm_content}`,
					utm.utm_term && `term=${utm.utm_term}`
				]
					.filter(Boolean)
					.join(', ')}`
			: '';

		const result = await sendTransactionalEmail({
			apiKey: brevo.apiKey,
			fromEmail: toEmail,
			fromName: 'Muscar Contact Form',
			toEmail,
			toName: 'Muscar',
			replyToEmail: email,
			replyToName: name || undefined,
			subject: `New contact form message from ${name || email}`,
			textContent: `Name: ${name || '(not given)'}\nEmail: ${email}\n\n${message}${utmLine}`
		});

		if (!result.ok) {
			return failWith(500, result.error);
		}

		return { ok: true };
	}
};
