import { getEnvVar } from '$lib/server/env';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals, platform }) => {
	return {
		utm: locals.utm,
		// Base URL of the site that hosts /survey (no trailing slash). Blank means this site.
		surveyUrl: (getEnvVar(platform, 'SURVEY_SITE_URL') ?? '').replace(/\/+$/, ''),
		umami: {
			scriptUrl: getEnvVar(platform, 'UMAMI_SCRIPT_URL'),
			websiteId: getEnvVar(platform, 'UMAMI_WEBSITE_ID')
		}
	};
};
