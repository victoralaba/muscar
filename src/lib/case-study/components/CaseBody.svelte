<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<article class="cs-body">
	<div class="cs-body-inner">
		{@render children()}
	</div>
</article>

<style>
	.cs-body {
		padding: clamp(2rem, 5vw, 3rem) 0 clamp(4rem, 8vw, 6rem);
	}
	.cs-body-inner {
		max-width: 780px;
		margin: 0 auto;
		padding: 0 clamp(1.25rem, 5vw, 2.5rem);
	}
	.cs-body-inner :global(h2) {
		font-family: var(--font-display);
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		line-height: 1.05;
		letter-spacing: 0.02em;
		color: var(--text-primary);
		margin: clamp(2.5rem, 5vw, 3.5rem) 0 1.25rem;
	}
	.cs-body-inner :global(h3) {
		font-family: var(--font-display);
		font-size: clamp(1.35rem, 2.5vw, 1.7rem);
		letter-spacing: 0.03em;
		color: var(--text-primary);
		margin: 2rem 0 0.9rem;
	}
	.cs-body-inner :global(p) {
		font-size: clamp(1rem, 1.7vw, 1.08rem);
		line-height: 1.75;
		color: var(--text-secondary);
		font-weight: 300;
		margin: 0 0 1.15rem;
	}
	.cs-body-inner :global(p strong),
	.cs-body-inner :global(p b) {
		color: var(--text-primary);
		font-weight: 600;
	}
	.cs-body-inner :global(a) {
		color: var(--accent);
		text-decoration: none;
		border-bottom: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
		transition: border-color 0.2s;
	}
	.cs-body-inner :global(a:hover) {
		border-bottom-color: var(--accent);
	}
	.cs-body-inner :global(ul) {
		list-style: none;
		padding: 0;
		margin: 0.5rem 0 1.25rem;
	}
	.cs-body-inner :global(ul li) {
		font-size: 1rem;
		line-height: 1.65;
		color: var(--text-secondary);
		padding-left: 1.25rem;
		position: relative;
		margin-bottom: 0.5rem;
		font-weight: 300;
	}
	.cs-body-inner :global(ul li::before) {
		content: '';
		position: absolute;
		top: 0.75rem;
		left: 0;
		width: 8px;
		height: 1px;
		background: var(--accent);
	}
	.cs-body-inner :global(hr) {
		border: none;
		border-top: 1px solid var(--bg-border);
		margin: clamp(2.5rem, 5vw, 3.5rem) 0;
	}
	.cs-body-inner :global(code) {
		background: var(--surface-soft);
		padding: 0.1rem 0.4rem;
		border-radius: 4px;
		font-family: 'DM Mono', ui-monospace, monospace;
		font-size: 0.9em;
		color: var(--text-primary);
	}
</style>
