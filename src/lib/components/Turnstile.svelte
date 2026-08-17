<script lang="ts">
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';

	interface Props {
		onVerify?: (token: string) => void;
		onExpire?: () => void;
	}

	let { onVerify, onExpire }: Props = $props();

	let container: HTMLDivElement | undefined = $state();
	let widgetId: string | undefined;

	function loadScript(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (typeof window === 'undefined') return resolve();
			if (window.turnstile) return resolve();

			const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile]');
			if (existing) {
				existing.addEventListener('load', () => resolve());
				existing.addEventListener('error', () => reject(new Error('Failed to load Turnstile')));
				return;
			}

			const script = document.createElement('script');
			script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
			script.async = true;
			script.defer = true;
			script.dataset.turnstile = 'true';
			script.onload = () => resolve();
			script.onerror = () => reject(new Error('Failed to load Turnstile'));
			document.head.appendChild(script);
		});
	}

	onMount(() => {
		let cancelled = false;

		loadScript()
			.then(() => {
				if (cancelled || !container || !window.turnstile) return;
				widgetId = window.turnstile.render(container, {
					sitekey: env.PUBLIC_TURNSTILE_SITE_KEY ?? '',
					callback: (token: string) => onVerify?.(token),
					'expired-callback': () => onExpire?.(),
					'error-callback': () => onExpire?.()
				});
			})
			.catch((err) => console.error('[turnstile]', err));

		return () => {
			cancelled = true;
			if (window.turnstile && widgetId) {
				window.turnstile.remove(widgetId);
			}
		};
	});
</script>

<div bind:this={container} class="turnstile-widget"></div>

<style>
	.turnstile-widget {
		display: flex;
		justify-content: flex-start;
	}
</style>
