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
			utm: import('@victoralaba/muscar-core/server').UtmData;
		}
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
