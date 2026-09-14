<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { IconBooks, IconArrowRight } from '@tabler/icons-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Case Studies — Muscar</title>
	<meta
		name="description"
		content="What actually happened when trade shops moved from paper to a running business. One page per engagement, one honest arc each."
	/>
</svelte:head>

<section class="cs-index-hero">
	<div class="cs-index-bg" aria-hidden="true"></div>
	<div class="cs-index-glow" aria-hidden="true"></div>

	<div class="cs-index-inner container">
		<div class="cs-index-badge-wrap">
			<Badge variant="outline" class="cs-index-badge">
				<IconBooks size={12} />
				Case studies
			</Badge>
		</div>

		<h1 class="cs-index-title">
			The shops.<br /><span class="accent">The receipts.</span>
		</h1>

		<p class="cs-index-sub">
			One page per engagement. What the shop looked like before, what got digitalized, what got
			automated, and what AI earned a seat and what did not. No composite stories dressed up as real
			ones. When a case is illustrative, we say so.
		</p>
	</div>
</section>

<section class="cs-list-section">
	<div class="container">
		{#if data.cases.length === 0}
			<p class="cs-empty">No case studies yet. The first one is being written.</p>
		{:else}
			<ul class="cs-list" role="list">
				{#each data.cases as c (c.slug)}
					<li class="cs-card">
						<a class="cs-card-link" href="/case-studies/{c.slug}">
							<div class="cs-card-top">
								<span class="cs-card-trade">{c.trade}</span>
								{#if c.illustrative}
									<span class="cs-card-illustrative">Illustrative</span>
								{/if}
							</div>

							<h2 class="cs-card-title">{c.title}</h2>

							<p class="cs-card-summary">{c.summary}</p>

							<div class="cs-card-headline">
								<span class="cs-card-headline-label">Headline</span>
								<span class="cs-card-headline-value">{c.headlineResult}</span>
							</div>

							<div class="cs-card-meta">
								<span>{c.teamSize}</span>
								<span aria-hidden="true">·</span>
								<span>{c.region}</span>
								<span aria-hidden="true">·</span>
								<span>{c.engagementLength}</span>
							</div>

							<span class="cs-card-arrow" aria-hidden="true">
								Read the case
								<IconArrowRight size={14} />
							</span>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>

<section class="cs-index-cta">
	<div class="cs-index-cta-inner container">
		<p class="cs-index-cta-body">If any of these shops look like yours, the way in is the same.</p>
		<Button href="/service#get-started" size="lg" class="cta-primary">
			Tell Us About Your Shop
			<IconArrowRight size={16} />
		</Button>
	</div>
</section>

<style>
	.container {
		max-width: var(--max-w);
		margin: 0 auto;
		padding: 0 clamp(1.25rem, 5vw, 2.5rem);
	}
	.accent {
		color: var(--accent);
	}

	.cs-index-hero {
		position: relative;
		overflow: hidden;
		padding: clamp(4rem, 9vw, 6.5rem) 0 clamp(2rem, 5vw, 3rem);
	}
	.cs-index-bg {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(var(--grid-line) 1px, transparent 1px),
			linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
		background-size: 60px 60px;
		mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
	}
	.cs-index-glow {
		position: absolute;
		top: -10%;
		left: 50%;
		transform: translateX(-50%);
		width: min(760px, 100vw);
		height: 500px;
		background: radial-gradient(ellipse at center top, var(--accent-glow) 0%, transparent 65%);
		pointer-events: none;
	}
	.cs-index-inner {
		position: relative;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	:global(.cs-index-badge) {
		border-color: var(--bg-border-strong) !important;
		color: var(--text-secondary) !important;
		background: var(--surface-soft) !important;
		display: flex !important;
		align-items: center !important;
		gap: 0.35rem !important;
		font-size: 0.78rem !important;
		letter-spacing: 0.02em !important;
	}
	.cs-index-badge-wrap {
		margin-bottom: 1.5rem;
	}
	.cs-index-title {
		font-family: var(--font-display);
		font-size: clamp(2.4rem, 6.5vw, 4.6rem);
		line-height: 1;
		letter-spacing: 0.02em;
		color: var(--text-primary);
		margin: 0;
	}
	.cs-index-sub {
		font-size: clamp(1rem, 1.9vw, 1.15rem);
		color: var(--text-secondary);
		line-height: 1.65;
		max-width: 620px;
		margin: 1.5rem auto 0;
		font-weight: 300;
	}

	.cs-list-section {
		padding: clamp(2rem, 5vw, 3rem) 0 clamp(4rem, 8vw, 6rem);
	}
	.cs-empty {
		text-align: center;
		color: var(--text-muted);
		font-size: 1rem;
		padding: 3rem 0;
	}
	.cs-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 1.25rem;
	}
	.cs-card {
		border: 1px solid var(--bg-border);
		background: var(--bg-card);
		border-radius: var(--radius-lg);
		transition:
			border-color 0.2s,
			transform 0.22s,
			box-shadow 0.22s;
	}
	.cs-card:hover {
		border-color: var(--accent);
		transform: translateY(-2px);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
	}
	.cs-card-link {
		display: block;
		padding: clamp(1.5rem, 4vw, 2.25rem);
		text-decoration: none;
		color: inherit;
	}
	.cs-card-top {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.85rem;
	}
	.cs-card-trade {
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--accent);
		font-weight: 700;
	}
	.cs-card-illustrative {
		display: inline-flex;
		align-items: center;
		padding: 0.15rem 0.55rem;
		border: 1px solid var(--accent);
		border-radius: 999px;
		color: var(--accent);
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-weight: 600;
	}
	.cs-card-title {
		font-family: var(--font-display);
		font-size: clamp(1.6rem, 3.5vw, 2.4rem);
		line-height: 1;
		letter-spacing: 0.02em;
		color: var(--text-primary);
		margin: 0 0 0.85rem;
	}
	.cs-card-summary {
		font-size: 0.98rem;
		color: var(--text-secondary);
		line-height: 1.6;
		margin: 0 0 1.5rem;
		max-width: 640px;
		font-weight: 300;
	}
	.cs-card-headline {
		display: inline-flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.75rem 1rem;
		background: linear-gradient(135deg, var(--accent-glow), transparent 60%), var(--surface-soft);
		border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--bg-border));
		border-radius: var(--radius-md);
		margin-bottom: 1rem;
	}
	.cs-card-headline-label {
		font-size: 0.68rem;
		color: var(--accent);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-weight: 700;
	}
	.cs-card-headline-value {
		font-family: var(--font-display);
		font-size: clamp(1.1rem, 2vw, 1.35rem);
		color: var(--text-primary);
		letter-spacing: 0.02em;
	}
	.cs-card-meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.4rem 0.75rem;
		font-size: 0.82rem;
		color: var(--text-muted);
		margin-bottom: 1.25rem;
	}
	.cs-card-arrow {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.85rem;
		color: var(--accent);
		font-weight: 600;
	}

	.cs-index-cta {
		padding: clamp(3rem, 6vw, 4.5rem) 0;
		background: var(--bg-card);
		border-top: 1px solid var(--bg-border);
	}
	.cs-index-cta-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		flex-wrap: wrap;
	}
	.cs-index-cta-body {
		font-size: clamp(1rem, 1.8vw, 1.1rem);
		color: var(--text-primary);
		line-height: 1.5;
		margin: 0;
		max-width: 480px;
		font-weight: 300;
	}

	@media (max-width: 500px) {
		.cs-index-cta-inner {
			flex-direction: column;
			align-items: stretch;
		}
		:global(.cs-index-cta .cta-primary) {
			width: 100%;
			justify-content: center !important;
		}
	}
</style>
