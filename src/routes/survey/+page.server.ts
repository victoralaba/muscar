import { fail, type ActionFailure } from '@sveltejs/kit';
import postgres, { type JSONValue } from 'postgres';
import { env as processEnv } from '$env/dynamic/private';
import type { Actions } from './$types';

interface SubmitPayload {
	name: string;
	email: string;
	wantsReports: boolean;
	answers: Record<string, unknown>;
	otherValues: Record<string, string>;
}

function getDatabaseUrl(platform: App.Platform | undefined): string | undefined {
	const fromEnv = processEnv.DATABASE_URL;
	const fromPlatform =
		typeof platform?.env === 'object' && platform.env !== null && 'DATABASE_URL' in platform.env
			? (platform.env as unknown as { DATABASE_URL?: string }).DATABASE_URL
			: undefined;
	return fromEnv ?? fromPlatform;
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

		return { ok: true };
	}
};
