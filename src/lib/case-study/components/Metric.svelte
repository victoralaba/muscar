<script lang="ts">
	interface Props {
		value: string;
		unit?: string;
		label: string;
		context?: string;
	}

	let { value, unit, label, context }: Props = $props();
</script>

<div class="metric">
	<div class="metric-value">
		<span class="metric-num">{value}</span>
		{#if unit}<span class="metric-unit">{unit}</span>{/if}
	</div>
	<p class="metric-label">{label}</p>
	{#if context}
		<p class="metric-context">{context}</p>
	{/if}
</div>

<style>
	.metric {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding: clamp(1.25rem, 3vw, 1.75rem);
		background: var(--bg-card);
		border: 1px solid var(--bg-border);
		border-radius: var(--radius-lg);
	}
	.metric-value {
		display: flex;
		align-items: baseline;
		gap: 0.35rem;
	}
	.metric-num {
		font-family: var(--font-display);
		font-size: clamp(2.2rem, 5vw, 3.2rem);
		color: var(--accent);
		line-height: 1;
		letter-spacing: -0.01em;
	}
	.metric-unit {
		font-size: clamp(0.85rem, 1.4vw, 0.95rem);
		color: var(--text-muted);
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}
	.metric-label {
		font-size: 0.9rem;
		color: var(--text-primary);
		font-weight: 500;
		margin: 0;
		letter-spacing: 0.01em;
	}
	.metric-context {
		font-size: 0.8rem;
		color: var(--text-muted);
		line-height: 1.5;
		margin: 0.15rem 0 0;
	}
</style>
