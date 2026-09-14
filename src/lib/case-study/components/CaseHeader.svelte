<script lang="ts">
	import type { CaseMetadata } from '../types';

	interface Props {
		metadata: CaseMetadata;
	}

	let { metadata }: Props = $props();
</script>

<header class="cs-header">
	<div class="cs-header-bg" aria-hidden="true"></div>

	<div class="cs-header-inner">
		<div class="cs-header-meta">
			<span class="cs-header-eyebrow">Case Study</span>
			{#if metadata.illustrative}
				<span class="cs-illustrative-pill">Illustrative</span>
			{/if}
		</div>

		<h1 class="cs-header-title">{metadata.title}</h1>
		<p class="cs-header-summary">{metadata.summary}</p>

		<dl class="cs-header-stats">
			<div>
				<dt>Trade</dt>
				<dd>{metadata.trade}</dd>
			</div>
			<div>
				<dt>Team size</dt>
				<dd>{metadata.teamSize}</dd>
			</div>
			<div>
				<dt>Region</dt>
				<dd>{metadata.region}</dd>
			</div>
			<div>
				<dt>Engagement</dt>
				<dd>{metadata.engagementLength}</dd>
			</div>
		</dl>

		<div class="cs-header-headline">
			<span class="cs-header-headline-label">Headline result</span>
			<span class="cs-header-headline-value">{metadata.headlineResult}</span>
		</div>
	</div>
</header>

<style>
	.cs-header {
		position: relative;
		overflow: hidden;
		padding: clamp(4rem, 9vw, 6.5rem) 0 clamp(2.5rem, 5vw, 4rem);
	}
	.cs-header-bg {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(var(--grid-line) 1px, transparent 1px),
			linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
		background-size: 48px 48px;
		mask-image: radial-gradient(ellipse 60% 70% at 20% 20%, black 40%, transparent 100%);
	}
	.cs-header-inner {
		position: relative;
		max-width: var(--max-w);
		margin: 0 auto;
		padding: 0 clamp(1.25rem, 5vw, 2.5rem);
	}
	.cs-header-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.25rem;
	}
	.cs-header-eyebrow {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--accent);
		font-weight: 700;
	}
	.cs-illustrative-pill {
		display: inline-flex;
		align-items: center;
		padding: 0.2rem 0.65rem;
		border: 1px solid var(--accent);
		border-radius: 999px;
		color: var(--accent);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-weight: 600;
	}
	.cs-header-title {
		font-family: var(--font-display);
		font-size: clamp(2.6rem, 7vw, 5rem);
		line-height: 1;
		letter-spacing: 0.02em;
		color: var(--text-primary);
		margin: 0 0 1.25rem;
		max-width: 900px;
	}
	.cs-header-summary {
		font-size: clamp(1.05rem, 2vw, 1.25rem);
		color: var(--text-secondary);
		line-height: 1.6;
		font-weight: 300;
		margin: 0 0 2.5rem;
		max-width: 620px;
	}
	.cs-header-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 1rem;
		max-width: 780px;
		margin: 0 0 2.5rem;
		padding: 0;
	}
	.cs-header-stats > div {
		padding: 0.85rem 1rem;
		background: var(--bg-card);
		border: 1px solid var(--bg-border);
		border-radius: var(--radius-md);
	}
	.cs-header-stats dt {
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		font-weight: 600;
		margin-bottom: 0.25rem;
	}
	.cs-header-stats dd {
		font-size: 0.98rem;
		color: var(--text-primary);
		margin: 0;
		font-weight: 500;
	}
	.cs-header-headline {
		display: inline-flex;
		flex-direction: column;
		gap: 0.35rem;
		padding: 1rem 1.5rem;
		background: linear-gradient(135deg, var(--accent-glow), transparent 60%), var(--bg-card);
		border: 1px solid var(--accent);
		border-radius: var(--radius-md);
	}
	.cs-header-headline-label {
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--accent);
		font-weight: 700;
	}
	.cs-header-headline-value {
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 3vw, 2rem);
		letter-spacing: 0.02em;
		color: var(--text-primary);
	}
</style>
