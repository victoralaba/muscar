<script lang="ts">
	interface Props {
		label: string;
		before: string;
		after: string;
		beforeSub?: string;
		afterSub?: string;
	}

	let { label, before, after, beforeSub, afterSub }: Props = $props();
</script>

<div class="ba">
	<p class="ba-label">{label}</p>
	<div class="ba-grid">
		<div class="ba-side ba-before">
			<span class="ba-tag">Before</span>
			<span class="ba-value">{before}</span>
			{#if beforeSub}
				<span class="ba-sub">{beforeSub}</span>
			{/if}
		</div>
		<div class="ba-arrow" aria-hidden="true">→</div>
		<div class="ba-side ba-after">
			<span class="ba-tag">After</span>
			<span class="ba-value">{after}</span>
			{#if afterSub}
				<span class="ba-sub">{afterSub}</span>
			{/if}
		</div>
	</div>
</div>

<style>
	.ba {
		margin: clamp(1.5rem, 4vw, 2.5rem) 0;
	}
	.ba-label {
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--text-muted);
		font-weight: 600;
		margin: 0 0 0.75rem;
	}
	.ba-grid {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: clamp(0.75rem, 2vw, 1.5rem);
		background: var(--bg-card);
		border: 1px solid var(--bg-border);
		border-radius: var(--radius-lg);
		padding: clamp(1.25rem, 3vw, 2rem);
	}
	.ba-side {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.ba-tag {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		font-weight: 600;
	}
	.ba-before .ba-value {
		color: var(--text-secondary);
	}
	.ba-after .ba-value {
		color: var(--accent);
	}
	.ba-value {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 4vw, 2.4rem);
		line-height: 1;
		letter-spacing: -0.01em;
	}
	.ba-sub {
		font-size: 0.8rem;
		color: var(--text-muted);
		line-height: 1.5;
	}
	.ba-arrow {
		font-size: clamp(1.5rem, 3vw, 2rem);
		color: var(--accent);
		font-weight: 300;
	}
	@media (max-width: 560px) {
		.ba-grid {
			grid-template-columns: 1fr;
			text-align: left;
		}
		.ba-arrow {
			transform: rotate(90deg);
		}
	}
</style>
