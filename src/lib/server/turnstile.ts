import { getEnvVar } from '$lib/server/env';

export function getTurnstileSecretKey(platform: App.Platform | undefined): string | undefined {
	return getEnvVar(platform, 'TURNSTILE_SECRET_KEY');
}

/**
 * Verifies a Turnstile token against Cloudflare's siteverify endpoint.
 * Returns false (rather than throwing) on any network/parse failure so
 * callers can uniformly treat it as "bot check failed".
 */
export async function verifyTurnstileToken(
	token: string | null | undefined,
	secretKey: string,
	remoteIp?: string | null
): Promise<boolean> {
	if (!token) return false;

	const body = new URLSearchParams();
	body.set('secret', secretKey);
	body.set('response', token);
	if (remoteIp) body.set('remoteip', remoteIp);

	try {
		const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			headers: { 'content-type': 'application/x-www-form-urlencoded' },
			body
		});
		const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
		return data?.success === true;
	} catch (err) {
		console.error('[turnstile] verify threw:', err instanceof Error ? err.message : String(err));
		return false;
	}
}
