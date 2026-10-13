import { fail, type ActionFailure } from '@sveltejs/kit';
import {
	formatUtmLine,
	getBrevoEnv,
	getClientIp,
	getTurnstileSecretKey,
	isValidEmail,
	readUtm,
	sendTransactionalEmail,
	verifyTurnstileToken
} from '@victoralaba/muscar-core/server';
import { readEnv } from '$lib/server/env';
import type { Actions } from './$types';

function failWith(status: 400 | 500, error: string): ActionFailure<{ error: string }> {
	if (status === 500) console.error('[contact] send failed:', error);
	return fail(status, { error });
}

export const actions: Actions = {
	send: async ({ request, platform, cookies }) => {
		const env = readEnv(platform);
		const brevo = getBrevoEnv(env);
		if (!brevo.apiKey) {
			return failWith(500, 'BREVO_API_KEY is not configured.');
		}

		const turnstileSecret = getTurnstileSecretKey(env);
		if (!turnstileSecret) {
			return failWith(500, 'TURNSTILE_SECRET_KEY is not configured.');
		}

		const toEmail = env('CONTACT_EMAIL');
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

		const verified = await verifyTurnstileToken(
			typeof turnstileToken === 'string' ? turnstileToken : null,
			turnstileSecret,
			getClientIp(request)
		);
		if (!verified) {
			return failWith(400, 'Bot check failed — please retry.');
		}

		// No DB row for contact submissions, so the campaign that drove this
		// message is only ever visible here — fold it into the email body.
		const utm = readUtm(cookies);
		const utmLine = formatUtmLine(utm);

		const result = await sendTransactionalEmail({
			apiKey: brevo.apiKey,
			fromEmail: toEmail,
			fromName: 'Muscar Contact Form',
			toEmail,
			toName: 'Muscar',
			replyToEmail: email,
			replyToName: name || undefined,
			subject: `[survey] New contact form message from ${name || email}`,
			textContent: `Name: ${name || '(not given)'}\nEmail: ${email}\n\n${message}${utmLine}`
		});

		if (!result.ok) {
			return failWith(500, result.error);
		}

		return { ok: true };
	}
};
