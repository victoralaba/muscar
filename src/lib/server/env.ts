import { env as processEnv } from '$env/dynamic/private';

/**
 * Reads an env var from process env (local dev / Node) first, falling back
 * to the Cloudflare `platform.env` binding (Pages/Workers runtime).
 */
export function getEnvVar(platform: App.Platform | undefined, key: string): string | undefined {
	const platformEnv =
		typeof platform?.env === 'object' && platform.env !== null
			? (platform.env as unknown as Record<string, string | undefined>)
			: undefined;

	return processEnv[key] ?? platformEnv?.[key];
}
