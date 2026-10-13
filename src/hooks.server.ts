import type { Handle } from '@sveltejs/kit';
import { captureUtm } from '$lib/server/utm';
import { getEnvVar } from '$lib/server/env';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.utm = captureUtm(
		event.url,
		event.cookies,
		getEnvVar(event.platform, 'COOKIE_DOMAIN')
	);
	return resolve(event);
};
