import type { Handle } from '@sveltejs/kit';
import { captureUtm } from '$lib/server/utm';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.utm = captureUtm(event.url, event.cookies);
	return resolve(event);
};
