// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env;
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties;
		}

		// interface Error {}
		interface Locals {
			utm: import('$lib/server/utm').UtmData;
		}
		// interface PageData {}
		// interface PageState {}
	}

	interface Window {
		turnstile?: {
			render: (
				container: HTMLElement,
				options: {
					sitekey: string;
					callback?: (token: string) => void;
					'expired-callback'?: () => void;
					'error-callback'?: () => void;
				}
			) => string;
			remove: (widgetId: string) => void;
			reset: (widgetId?: string) => void;
		};
	}
}

export {};
