<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import {
		IconInfoCircle,
		IconArrowRight,
		IconClipboardList,
		IconChartBar,
		IconMail,
		IconBolt,
		IconShieldCheck,
		IconUsers
	} from '@tabler/icons-svelte';

	const principles = [
		{
			text: 'We ask real trade business owners what actually happened when they tried AI — not what a vendor claims.',
			icon: IconClipboardList
		},
		{
			text: 'We pull the answers together and look for patterns across trades, tools, and business sizes.',
			icon: IconChartBar
		},
		{
			text: 'One newsletter. Plain language. No pitch buried in every issue.',
			icon: IconMail
		},
		{
			text: "When something's worth trying, we say exactly how to start — no vague 'leverage AI' advice.",
			icon: IconBolt
		},
		{
			text: 'We call out marketing dressed up as innovation, by name when we can.',
			icon: IconShieldCheck
		},
		{
			text: 'Your answers shape what gets covered next. This runs on real responses, not our guesses.',
			icon: IconUsers
		}
	];
</script>

<svelte:head>
	<title>About — Muscar</title>
	<meta
		name="description"
		content="Muscar asks trade business owners what's real about AI and what's noise, then reports back in plain language."
	/>
</svelte:head>

<section class="ab-hero" aria-labelledby="ab-hl">
	<div class="ab-bg-grid" aria-hidden="true"></div>
	<div class="ab-glow" aria-hidden="true"></div>

	<div class="ab-inner container">
		<div class="ab-badge-wrap">
			<Badge variant="outline" class="ab-badge">
				<IconInfoCircle size={12} />
				About Muscar
			</Badge>
		</div>

		<h1 id="ab-hl" class="ab-headline">
			Cutting through the <span class="accent">AI noise</span> for the trades.
		</h1>

		<p class="ab-sub">
			Everyone selling software to trade businesses says it's "AI-powered." Almost nobody says what
			that actually means, or whether it worked for anyone. Muscar exists to close that gap — by
			asking the people who tried it.
		</p>
	</div>
</section>

<section class="ab-why" aria-labelledby="ab-why-hl">
	<div class="ab-why-grid container">
		<h2 id="ab-why-hl" class="ab-why-hl">Why this exists</h2>
		<div class="ab-why-body">
			<p>
				Trade business owners get pitched AI tools constantly — scheduling assistants,
				call-answering bots, quote generators, marketing platforms that promise the moon. Some of it
				helps. A lot of it is a subscription nobody remembers cancelling.
			</p>
			<p>
				There's no one keeping score. Vendors aren't going to tell you their tool didn't pan out. So
				we're building the record ourselves: a running survey of what owners in HVAC, plumbing,
				electrical, roofing, and other trades have actually tried, what stuck, and what they'd tell
				a friend to skip.
			</p>
			<p>
				The findings go out as a plain-language newsletter — not a sales funnel for a product we're
				building on the side.
			</p>
		</div>
	</div>
</section>

<section class="ab-principles" aria-labelledby="ab-principles-hl">
	<div class="container">
		<h2 id="ab-principles-hl" class="ab-principles-hl">How we work</h2>
		<ul class="ab-principles-list">
			{#each principles as item, i (i)}
				<li class="ab-principles-item">
					<span class="ab-principles-icon"><item.icon size={18} /></span>
					<span>{item.text}</span>
				</li>
			{/each}
		</ul>
	</div>
</section>

<section class="ab-cta" aria-labelledby="ab-cta-hl">
	<div class="ab-cta-inner container">
		<h2 id="ab-cta-hl" class="ab-cta-hl">Add your answers to the record.</h2>
		<p class="ab-cta-sub">
			Five minutes. No name required. Or just get the findings when they're ready.
		</p>
		<div class="ab-cta-actions">
			<Button href="/survey" size="lg" class="cta-primary">
				Take the Survey
				<IconArrowRight size={15} />
			</Button>
			<Button href="/newsletter" size="lg" variant="outline" class="cta-secondary">
				Get the Newsletter
			</Button>
		</div>
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

	/* ── HERO ── */
	.ab-hero {
		position: relative;
		overflow: hidden;
	}
	.ab-bg-grid {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(var(--grid-line) 1px, transparent 1px),
			linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
		background-size: 60px 60px;
		mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
	}
	.ab-glow {
		position: absolute;
		top: -10%;
		left: 50%;
		transform: translateX(-50%);
		width: min(700px, 100vw);
		height: 500px;
		background: radial-gradient(ellipse at center top, var(--accent-glow) 0%, transparent 65%);
		pointer-events: none;
	}

	.ab-inner {
		position: relative;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: clamp(4.5rem, 10vw, 7rem) 0 clamp(3.5rem, 7vw, 5rem);
	}

	:global(.ab-badge) {
		border-color: var(--bg-border-strong) !important;
		color: var(--text-secondary) !important;
		background: var(--surface-soft) !important;
		display: flex !important;
		align-items: center !important;
		gap: 0.35rem !important;
		font-size: 0.78rem !important;
		letter-spacing: 0.02em !important;
	}
	.ab-badge-wrap {
		margin-bottom: 1.5rem;
	}

	.ab-headline {
		font-family: var(--font-display);
		font-size: clamp(2.4rem, 6vw, 4rem);
		line-height: 1.05;
		letter-spacing: 0.02em;
		color: var(--text-primary);
		margin: 0;
		max-width: 700px;
	}
	.ab-sub {
		font-size: clamp(1rem, 2vw, 1.1rem);
		color: var(--text-secondary);
		line-height: 1.65;
		max-width: 560px;
		margin: 1.25rem 0 0;
		font-weight: 300;
	}

	/* ── WHY ── */
	.ab-why {
		padding: var(--section-pad) 0;
		background: var(--bg-card);
		border-top: 1px solid var(--bg-border);
		border-bottom: 1px solid var(--bg-border);
	}
	.ab-why-grid {
		max-width: 720px;
	}
	.ab-why-hl {
		font-family: var(--font-display);
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		letter-spacing: 0.02em;
		color: var(--text-primary);
		margin: 0 0 1.5rem;
	}
	.ab-why-body {
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
	}
	.ab-why-body p {
		font-size: 1.02rem;
		line-height: 1.75;
		color: var(--text-secondary);
		font-weight: 300;
		margin: 0;
	}

	/* ── PRINCIPLES ── */
	.ab-principles {
		padding: var(--section-pad) 0;
	}
	.ab-principles-hl {
		font-family: var(--font-display);
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		letter-spacing: 0.02em;
		color: var(--text-primary);
		text-align: center;
		margin: 0 0 2.5rem;
	}
	.ab-principles-list {
		list-style: none;
		margin: 0 auto;
		padding: 0;
		max-width: 640px;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}
	.ab-principles-item {
		display: flex;
		align-items: flex-start;
		gap: 0.85rem;
		font-size: 1rem;
		color: var(--text-primary);
		line-height: 1.55;
		font-weight: 300;
	}
	.ab-principles-icon {
		flex-shrink: 0;
		display: grid;
		place-items: center;
		width: 2.1rem;
		height: 2.1rem;
		border-radius: var(--radius-sm);
		background: var(--surface-soft);
		color: var(--accent);
		margin-top: 0.1rem;
	}

	/* ── CTA ── */
	.ab-cta {
		padding: var(--section-pad) 0;
		background: var(--bg-card);
		border-top: 1px solid var(--bg-border);
	}
	.ab-cta-inner {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.ab-cta-hl {
		font-family: var(--font-display);
		font-size: clamp(1.9rem, 4.5vw, 2.8rem);
		letter-spacing: 0.02em;
		color: var(--text-primary);
		margin: 0;
	}
	.ab-cta-sub {
		font-size: 1rem;
		color: var(--text-secondary);
		font-weight: 300;
		margin: 0.9rem 0 2rem;
		max-width: 460px;
	}
	.ab-cta-actions {
		display: flex;
		gap: 0.85rem;
		flex-wrap: wrap;
		justify-content: center;
	}
</style>
