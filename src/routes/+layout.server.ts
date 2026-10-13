import { readEnv } from '$lib/server/env';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals, platform }) => {
	const env = readEnv(platform);
	return {
		utm: locals.utm,
		// Base URL of the site that hosts /survey (no trailing slash). Blank means this site.
		surveyUrl: (env('SURVEY_SITE_URL') ?? '').replace(/\/+$/, ''),
		umami: {
			scriptUrl: env('UMAMI_SCRIPT_URL'),
			websiteId: env('UMAMI_WEBSITE_ID')
		}
	};
};
