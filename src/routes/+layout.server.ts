import { getEnvVar } from '$lib/server/env';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals, platform }) => {
	return {
		utm: locals.utm,
		umami: {
			scriptUrl: getEnvVar(platform, 'UMAMI_SCRIPT_URL'),
			websiteId: getEnvVar(platform, 'UMAMI_WEBSITE_ID')
		}
	};
};
