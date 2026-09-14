<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		label?: string;
	}

	let { children, label }: Props = $props();
</script>

<div class="metric-row-wrap">
	{#if label}
		<p class="metric-row-label">{label}</p>
	{/if}
	<div class="metric-row">
		{@render children()}
	</div>
</div>

<style>
	.metric-row-wrap {
		margin: clamp(1.5rem, 4vw, 2.5rem) 0;
	}
	.metric-row-label {
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--accent);
		font-weight: 600;
		margin: 0 0 1rem;
	}
	.metric-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1rem;
	}
</style>
