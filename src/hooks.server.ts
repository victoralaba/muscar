import type { Handle } from '@sveltejs/kit';
import { captureUtm, needsCookieConsent } from '$lib/server/utm';
import { getEnvVar } from '$lib/server/env';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.utm = captureUtm(event.url, event.cookies, {
		domain: getEnvVar(event.platform, 'COOKIE_DOMAIN'),
		persist: !needsCookieConsent(event.request.headers.get('cf-ipcountry'))
	});
	return resolve(event);
};
