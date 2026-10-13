import { fail } from '@sveltejs/kit';
import {
	getClientIp,
	loadUnsubscribePage,
	unsubscribeFromNewsletter
} from '@victoralaba/muscar-core/server';
import { readEnv } from '$lib/server/env';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url, platform }) =>
	loadUnsubscribePage(readEnv(platform), url);

export const actions: Actions = {
	unsubscribe: async ({ request, platform }) => {
		const result = await unsubscribeFromNewsletter({
			form: await request.formData(),
			ip: getClientIp(request),
			env: readEnv(platform)
		});
		return result.ok
			? { ok: true, email: result.email }
			: fail(result.status, { error: result.error });
	}
};
