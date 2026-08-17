declare global {
	interface Window {
		umami?: {
			track: (eventName: string, eventData?: Record<string, unknown>) => void;
		};
	}
}

/** Minimal local copy of the server-side UtmData shape to avoid pulling a
 * `$lib/server` module into the client bundle just for a type. */
type UtmLike = Partial<
	Record<'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_content' | 'utm_term', string>
>;

/**
 * Fires a custom Umami event. Silently no-ops if the script hasn't loaded
 * yet, is blocked (ad blockers), or isn't configured — analytics should
 * never be able to break the page.
 */
export function trackEvent(name: string, data?: Record<string, unknown>) {
	if (typeof window === 'undefined') return;
	try {
		window.umami?.track(name, data);
	} catch {
		// analytics must never break the app
	}
}

/** Drops empty utm_* values so events don't carry blank keys. */
export function utmEventData(utm: UtmLike | undefined): Record<string, string> {
	if (!utm) return {};
	return Object.fromEntries(
		Object.entries(utm).filter((entry): entry is [string, string] => Boolean(entry[1]))
	);
}
