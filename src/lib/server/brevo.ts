import { getEnvVar } from '$lib/server/env';

export interface BrevoEnv {
	apiKey?: string;
	newsletterListId?: string;
	surveyListId?: string;
}

/** Resolves Brevo config from process env or the Cloudflare platform binding. */
export function getBrevoEnv(platform: App.Platform | undefined): BrevoEnv {
	return {
		apiKey: getEnvVar(platform, 'BREVO_API_KEY'),
		newsletterListId: getEnvVar(platform, 'BREVO_NEWSLETTER_LIST_ID'),
		surveyListId: getEnvVar(platform, 'BREVO_SURVEY_LIST_ID')
	};
}

interface SendEmailArgs {
	apiKey: string;
	toEmail: string;
	toName?: string;
	fromEmail: string;
	fromName?: string;
	replyToEmail?: string;
	replyToName?: string;
	subject: string;
	textContent: string;
}

/** Sends a transactional email via Brevo's REST API (no SDK dep). */
export async function sendTransactionalEmail({
	apiKey,
	toEmail,
	toName,
	fromEmail,
	fromName,
	replyToEmail,
	replyToName,
	subject,
	textContent
}: SendEmailArgs): Promise<{ ok: true } | { ok: false; error: string }> {
	const body = {
		sender: { email: fromEmail, name: fromName },
		to: [{ email: toEmail, name: toName }],
		...(replyToEmail ? { replyTo: { email: replyToEmail, name: replyToName } } : {}),
		subject,
		textContent
	};

	try {
		const res = await fetch('https://api.brevo.com/v3/smtp/email', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				accept: 'application/json',
				'api-key': apiKey
			},
			body: JSON.stringify(body)
		});

		if (res.ok) return { ok: true };

		const payload = (await res.json().catch(() => null)) as { message?: string } | null;
		const message = payload?.message ?? `Brevo email request failed with status ${res.status}`;
		console.error('[brevo] send email failed:', message);
		return { ok: false, error: message };
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		console.error('[brevo] send email threw:', message);
		return { ok: false, error: message };
	}
}
/**
 * Blacklists a contact from marketing emails via Brevo's REST API directly
 * (no SDK dep). This is what "unsubscribe" means in Brevo — the contact
 * stays on its lists but Brevo will no longer send it campaign email.
 *
 * Note: per Brevo's docs, updating a blacklisted contact's *email address*
 * later will silently remove the blacklist, so nothing else should ever
 * PUT a new email over this contact.
 */
export async function unsubscribeBrevoContact({
	apiKey,
	email
}: {
	apiKey: string;
	email: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
	try {
		const res = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
			method: 'PUT',
			headers: {
				'content-type': 'application/json',
				accept: 'application/json',
				'api-key': apiKey
			},
			body: JSON.stringify({ emailBlacklisted: true })
		});

		// Brevo returns 204 on success. A 404 means the contact was never in
		// Brevo to begin with — treat that as a successful no-op rather than
		// an error, since the end state the user wants (no email from us) is
		// already true.
		if (res.ok || res.status === 204) return { ok: true };
		if (res.status === 404) return { ok: true };

		const payload = (await res.json().catch(() => null)) as { message?: string } | null;
		const message = payload?.message ?? `Brevo request failed with status ${res.status}`;
		console.error('[brevo] unsubscribe failed:', message);
		return { ok: false, error: message };
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		console.error('[brevo] unsubscribe threw:', message);
		return { ok: false, error: message };
	}
}

interface UpsertContactArgs {
	apiKey: string;
	email: string;
	listId?: string;
	name?: string;
	attributes?: Record<string, unknown>;
}

/**
 * Creates or updates a Brevo contact via the REST API directly (no SDK dep).
 * Uses updateEnabled so re-submitting (newsletter form twice, or survey +
 * newsletter for the same person) just merges attributes/lists instead of
 * erroring on "contact already exists".
 */
export async function upsertBrevoContact({
	apiKey,
	email,
	listId,
	name,
	attributes = {}
}: UpsertContactArgs): Promise<{ ok: true } | { ok: false; error: string }> {
	const firstName = name?.trim().split(/\s+/)[0];

	const body = {
		email,
		updateEnabled: true,
		listIds: listId ? [Number(listId)] : undefined,
		attributes: {
			...(firstName ? { FIRSTNAME: firstName } : {}),
			...(name ? { LASTNAME: name.trim().split(/\s+/).slice(1).join(' ') || undefined } : {}),
			...attributes
		}
	};

	try {
		const res = await fetch('https://api.brevo.com/v3/contacts', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				accept: 'application/json',
				'api-key': apiKey
			},
			body: JSON.stringify(body)
		});

		// Brevo returns 204 on success, 400 with code "duplicate_parameter"
		// when the contact already exists but nothing changed — both are fine.
		if (res.ok || res.status === 204) {
			return { ok: true };
		}

		const payload = (await res.json().catch(() => null)) as {
			code?: string;
			message?: string;
		} | null;
		if (payload?.code === 'duplicate_parameter') {
			return { ok: true };
		}

		const message = payload?.message ?? `Brevo request failed with status ${res.status}`;
		console.error('[brevo] upsert failed:', message);
		return { ok: false, error: message };
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		console.error('[brevo] upsert threw:', message);
		return { ok: false, error: message };
	}
}
