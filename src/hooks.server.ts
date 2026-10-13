import { dev } from '$app/environment';
import type { Handle } from '@sveltejs/kit';
import { captureUtm, needsCookieConsent } from '@victoralaba/muscar-core/server';
import { readEnv } from '$lib/server/env';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.utm = captureUtm(event.url, event.cookies, {
		domain: readEnv(event.platform)('COOKIE_DOMAIN'),
		persist: !needsCookieConsent(event.request.headers.get('cf-ipcountry')),
		secure: !dev
	});
	return resolve(event);
};
