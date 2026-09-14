<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		children: Snippet;
	}

	let { title, children }: Props = $props();
</script>

<aside class="callout">
	{#if title}<p class="callout-title">{title}</p>{/if}
	<div class="callout-body">
		{@render children()}
	</div>
</aside>

<style>
	.callout {
		margin: clamp(1.75rem, 4vw, 2.5rem) 0;
		padding: clamp(1.25rem, 3vw, 1.75rem);
		border: 1px solid var(--bg-border);
		border-left: 3px solid var(--accent);
		border-radius: var(--radius-md);
		background: var(--surface-soft);
	}
	.callout-title {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--accent);
		font-weight: 700;
		margin: 0 0 0.6rem;
	}
	.callout-body :global(p) {
		font-size: 0.98rem;
		color: var(--text-primary);
		line-height: 1.65;
		margin: 0 0 0.75rem;
		font-weight: 300;
	}
	.callout-body :global(p:last-child) {
		margin-bottom: 0;
	}
</style>
