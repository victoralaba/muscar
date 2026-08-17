import { fail, type ActionFailure } from '@sveltejs/kit';
import postgres, { type JSONValue } from 'postgres';
import { getEnvVar } from '$lib/server/env';
import { getBrevoEnv, upsertBrevoContact } from '$lib/server/brevo';
import { getTurnstileSecretKey, verifyTurnstileToken } from '$lib/server/turnstile';
import type { Actions } from './$types';

interface SubmitPayload {
	name: string;
	email: string;
	wantsReports: boolean;
	answers: Record<string, unknown>;
	otherValues: Record<string, string>;
}

function getDatabaseUrl(platform: App.Platform | undefined): string | undefined {
	return getEnvVar(platform, 'DATABASE_URL');
}

function parsePayload(raw: string): SubmitPayload | null {
	try {
		const data = JSON.parse(raw) as Partial<SubmitPayload>;
		if (typeof data?.name !== 'string' || typeof data?.email !== 'string') return null;
		return {
			name: data.name,
			email: data.email,
			wantsReports: Boolean(data.wantsReports),
			answers: typeof data.answers === 'object' && data.answers !== null ? data.answers : {},
			otherValues:
				typeof data.otherValues === 'object' && data.otherValues !== null
					? (data.otherValues as Record<string, string>)
					: {}
		};
	} catch {
		return null;
	}
}

function failWith(error: string): ActionFailure<{ error: string }> {
	console.error('[survey] submit failed:', error);
	return fail(500, { error });
}

export const actions: Actions = {
	submit: async ({ request, platform }) => {
		const databaseUrl = getDatabaseUrl(platform);
		if (!databaseUrl) {
			return failWith('DATABASE_URL is not configured.');
		}

		const turnstileSecret = getTurnstileSecretKey(platform);
		if (!turnstileSecret) {
			return failWith('TURNSTILE_SECRET_KEY is not configured.');
		}

		const form = await request.formData();
		const raw = form.get('payload');
		if (typeof raw !== 'string') {
			return fail(400, { error: 'Missing payload.' });
		}

		const payload = parsePayload(raw);
		if (!payload) {
			return fail(400, { error: 'Invalid payload.' });
		}

		const forwarded =
			request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for');
		const submittedIp = forwarded?.split(',')[0]?.trim() ?? null;

		const turnstileToken = form.get('cf-turnstile-response');
		const verified = await verifyTurnstileToken(
			typeof turnstileToken === 'string' ? turnstileToken : null,
			turnstileSecret,
			submittedIp
		);
		if (!verified) {
			return fail(400, { error: 'Bot check failed — please retry.' });
		}

		const sql = postgres(databaseUrl, { prepare: false });
		try {
			await sql`
				insert into survey_responses (name, email, wants_reports, answers, other_values, submitted_ip)
				values (
					${payload.name},
					${payload.email},
					${payload.wantsReports},
					${sql.json(payload.answers as JSONValue)},
					${sql.json(payload.otherValues as JSONValue)},
					${submittedIp}
				)
			`;
		} catch (err) {
			return failWith(err instanceof Error ? err.message : String(err));
		} finally {
			await sql.end({ timeout: 2 });
		}

		// Best-effort: push opted-in respondents to Brevo. A Brevo failure
		// shouldn't fail the survey submission itself — the response is
		// already saved above — so we just log it.
		if (payload.wantsReports) {
			const brevo = getBrevoEnv(platform);
			if (brevo.apiKey) {
				const result = await upsertBrevoContact({
					apiKey: brevo.apiKey,
					email: payload.email,
					listId: brevo.surveyListId,
					name: payload.name,
					attributes: { SOURCE: 'survey_page' }
				});
				if (!result.ok) {
					console.error('[survey] brevo upsert failed:', result.error);
				}
			} else {
				console.error('[survey] BREVO_API_KEY is not configured; skipping Brevo sync.');
			}
		}

		return { ok: true };
	}
};
