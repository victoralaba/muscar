import { fail } from '@sveltejs/kit';
import { getClientIp, readUtm, subscribeToNewsletter } from '@victoralaba/muscar-core/server';
import { readEnv } from '$lib/server/env';
import type { Actions } from './$types';

export const actions: Actions = {
	subscribe: async ({ request, platform, cookies }) => {
		const result = await subscribeToNewsletter({
			form: await request.formData(),
			ip: getClientIp(request),
			env: readEnv(platform),
			utm: readUtm(cookies)
		});
		return result.ok ? { ok: true } : fail(result.status, { error: result.error });
	}
};
