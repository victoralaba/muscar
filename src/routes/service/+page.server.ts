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
	if (status === 500) console.error('[service] send failed:', error);
	return fail(status, { error });
}

const TRADE_LABELS: Record<string, string> = {
	hvac: 'HVAC',
	plumbing: 'Plumbing',
	electrical: 'Electrical',
	roofing: 'Roofing',
	general_contracting: 'General contracting / construction',
	landscaping: 'Landscaping',
	auto_repair: 'Auto repair',
	painting: 'Painting',
	cleaning: 'Cleaning',
	other: 'Other'
};

const TEAM_SIZE_LABELS: Record<string, string> = {
	just_me: 'Just me',
	'2_5': '2–5',
	'6_15': '6–15',
	'16_plus': '16+'
};

const URGENCY_LABELS: Record<string, string> = {
	not_urgent: 'Not urgent (planning ahead)',
	somewhat_non_urgent: 'Somewhat non-urgent (sometime this quarter)',
	somewhat_urgent: 'Somewhat urgent (this month if possible)',
	quite_urgent: 'Quite urgent (traction in a few weeks)'
};

export const actions: Actions = {
	apply: async ({ request, platform, cookies }) => {
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
		const businessName = String(form.get('business_name') ?? '').trim();
		const tradeKey = String(form.get('trade') ?? '').trim();
		const tradeOther = String(form.get('trade_other') ?? '').trim();
		const teamSizeKey = String(form.get('team_size') ?? '').trim();
		const urgencyKey = String(form.get('urgency') ?? '').trim();
		const notes = String(form.get('notes') ?? '').trim();
		const turnstileToken = form.get('cf-turnstile-response');

		if (!name) return failWith(400, 'Please tell us your name.');
		if (!isValidEmail(email)) return failWith(400, 'Please enter a valid email address.');
		if (!businessName) return failWith(400, 'Please tell us your business name.');
		if (!TRADE_LABELS[tradeKey]) return failWith(400, 'Please pick your trade.');
		if (tradeKey === 'other' && !tradeOther) return failWith(400, 'Please tell us your trade.');
		if (!TEAM_SIZE_LABELS[teamSizeKey]) return failWith(400, 'Please pick your team size.');
		if (!URGENCY_LABELS[urgencyKey]) return failWith(400, 'Please pick a timeline.');

		const forwarded =
			request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for');
		const submittedIp = forwarded?.split(',')[0]?.trim() ?? null;

		const verified = await verifyTurnstileToken(
			typeof turnstileToken === 'string' ? turnstileToken : null,
			turnstileSecret,
			submittedIp
		);
		if (!verified) return failWith(400, 'Bot check failed — please retry.');

		const tradeDisplay = tradeKey === 'other' ? `Other — ${tradeOther}` : TRADE_LABELS[tradeKey];

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

		const textContent = [
			`Name: ${name}`,
			`Email: ${email}`,
			`Business: ${businessName}`,
			`Trade: ${tradeDisplay}`,
			`Team size: ${TEAM_SIZE_LABELS[teamSizeKey]}`,
			`Timeline: ${URGENCY_LABELS[urgencyKey]}`,
			'',
			`Notes:`,
			notes ? notes : '(none)'
		].join('\n');

		const result = await sendTransactionalEmail({
			apiKey: brevo.apiKey,
			fromEmail: toEmail,
			fromName: 'Muscar Service Enquiry',
			toEmail,
			toName: 'Muscar',
			replyToEmail: email,
			replyToName: name,
			subject: `New service enquiry — ${businessName} (${TRADE_LABELS[tradeKey] ?? tradeKey})`,
			textContent: `${textContent}${utmLine}`
		});

		if (!result.ok) return failWith(500, result.error);

		return { ok: true };
	}
};
