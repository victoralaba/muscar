<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import {
		IconArrowRight,
		IconCheck,
		IconBolt,
		IconTool,
		IconDroplet,
		IconFlame,
		IconLeaf,
		IconPaint,
		IconHome,
		IconShieldCheck,
		IconClock,
		IconClipboardList,
		IconChartBar,
		IconMail,
		IconUsers,
		IconQuote,
		IconSearch
	} from '@tabler/icons-svelte';

	const trades = [
		{ label: 'HVAC', icon: IconFlame },
		{ label: 'Plumbing', icon: IconDroplet },
		{ label: 'Electrical', icon: IconBolt },
		{ label: 'Roofing', icon: IconHome },
		{ label: 'Landscaping', icon: IconLeaf },
		{ label: 'Painting', icon: IconPaint },
		{ label: 'Cleaning', icon: IconShieldCheck },
		{ label: 'General Contracting', icon: IconTool }
	];

	const marqueeItems = [...trades, ...trades, ...trades, ...trades];

	// PLACEHOLDER — swap for the analyst's real numbers once the survey report is done.
	const findings = [
		{
			stat: '68%',
			context:
				"of the owners who've responded so far can't say whether an AI tool they tried actually saved them money.",
			observation: "That gap is the whole reason we started asking."
		},
		{
			stat: '3',
			statUnit: '/week',
			context:
				'is roughly how many "AI-powered" tools get pitched to the average business owner we talked to.',
			observation: 'Almost none of them explain what the tool actually does.'
		},
		{
			stat: '1 in 5',
			context:
				"say they tried something, kept using it past a month, and would recommend it to another owner.",
			observation: "That's the number we're trying to move."
		}
	];

	const whatWeDo = [
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
			text: "We call out marketing dressed up as innovation, by name when we can.",
			icon: IconShieldCheck
		},
		{
			text: 'Your answers shape what gets covered next. This runs on real responses, not our guesses.',
			icon: IconUsers
		}
	];

	const steps = [
		{
			num: '01',
			title: 'You answer a few questions',
			body: "About five minutes. What you've tried, what worked, what didn't, what you'd never touch again. No name required."
		},
		{
			num: '02',
			title: 'We look for the pattern',
			body: "One answer is an anecdote. Hundreds of answers, sorted by trade and tool type, start to show what's actually true."
		},
		{
			num: '03',
			title: 'You get the plain version',
			body: "Straight into the newsletter — what to try, what to skip, and why. No follow-up sales call."
		}
	];

	// Early, unverified responses — not polished testimonials. Swap or expand once the report is out.
	const signals = [
		{
			quote: "I don't know what's hype and what's actually going to help me.",
			role: 'Plumbing business owner, survey response'
		},
		{
			quote: 'Everyone is selling AI. Nobody is explaining it.',
			role: 'Roofing business owner, survey response'
		},
		{
			quote: 'I just want to know what to actually do on Monday morning.',
			role: 'HVAC business owner, survey response'
		}
	];
</script>

<!-- HERO -->
<section class="hero" aria-labelledby="hero-hl">
	<div class="hero-bg-grid" aria-hidden="true"></div>
	<div class="hero-glow" aria-hidden="true"></div>

	<div class="hero-inner container">
		<div class="hero-badge-wrap">
			<Badge variant="outline" class="hero-badge">
				<IconSearch size={12} />
				Live research, open now
			</Badge>
		</div>

		<p class="hero-lead anim-up">We're asking</p>
		<p class="hero-number anim-up d1" aria-label="500+">500+</p>
		<p class="hero-lead-after anim-up d2">blue-collar business owners one question.</p>

		<h1 id="hero-hl" class="hero-headline anim-up d3">
			What's real about AI —<br />
			<span class="accent">and what's noise?</span>
		</h1>

		<p class="hero-sub anim-up d4">
			We're surveying trade businesses to find out what's actually working, cutting past the marketing, and turning the answers into plain, usable guidance. No pitch. No hype.
		</p>

		<div class="hero-actions anim-up d5">
			<Button href="/survey" size="lg" class="cta-primary">
				Take the 5-Minute Survey
				<IconArrowRight size={16} />
			</Button>
			<Button href="/newsletter" size="lg" variant="outline" class="cta-secondary">
				Get the Newsletter
			</Button>
		</div>

		<div class="hero-proof anim-up d6">
			<span class="proof-item">
				<IconCheck size={14} class="proof-icon" aria-hidden="true" />
				Anonymous
			</span>
			<span class="proof-dot" aria-hidden="true">·</span>
			<span class="proof-item">
				<IconCheck size={14} class="proof-icon" aria-hidden="true" />
				5 minutes
			</span>
			<span class="proof-dot" aria-hidden="true">·</span>
			<span class="proof-item">
				<IconCheck size={14} class="proof-icon" aria-hidden="true" />
				Results shared back
			</span>
		</div>
	</div>
</section>

<!-- MARQUEE -->
<div class="marquee-strip" aria-label="Trades we're surveying">
	<div class="marquee-track">
		{#each marqueeItems as trade, i (i)}
			{@const Icon = trade.icon}
			<span class="marquee-chip">
				<Icon size={15} class="marquee-icon" aria-hidden="true" />
				{trade.label}
			</span>
		{/each}
	</div>
</div>

<!-- FINDINGS -->
<section class="findings" id="findings" aria-labelledby="findings-hl">
	<div class="container">
		<div class="section-head">
			<p class="eyebrow">Early Signals · Preliminary</p>
			<h2 id="findings-hl" class="section-title">Here's what we're<br /><span class="accent">hearing so far.</span></h2>
			<p class="section-note">Based on responses collected to date. The full report lands once enough owners weigh in.</p>
		</div>

		<div class="findings-list">
			{#each findings as f, i (f.stat)}
				<div class="finding" data-index={i}>
					<span class="finding-watermark" aria-hidden="true">{f.stat}</span>
					<div class="finding-body">
						<span class="finding-stat">
							{f.stat}
							{#if f.statUnit}<span class="finding-unit">{f.statUnit}</span>{/if}
						</span>
						<p class="finding-context">{f.context}</p>
						<p class="finding-obs">{f.observation}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- WHAT WE DO -->
<section class="possibilities" id="what-we-do" aria-labelledby="poss-hl">
	<div class="container">
		<div class="section-head">
			<p class="eyebrow">What We Do</p>
			<h2 id="poss-hl" class="section-title">Research first.<br /><span class="accent">Opinions second.</span></h2>
		</div>

		<div class="bento">
			{#each whatWeDo as p, i (p.text)}
				{@const Icon = p.icon}
				<div class="bento-card" data-i={i}>
					<div class="bento-icon" aria-hidden="true">
						<Icon size={22} />
					</div>
					<p class="bento-text">{p.text}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- PROCESS -->
<section class="process" id="process" aria-labelledby="process-hl">
	<div class="process-glow" aria-hidden="true"></div>
	<div class="container">
		<div class="section-head">
			<p class="eyebrow">How It Works</p>
			<h2 id="process-hl" class="section-title">Three steps.<br /><span class="accent">No sales call.</span></h2>
		</div>

		<div class="process-flow">
			{#each steps as step (step.num)}
				<div class="process-card">
					<span class="process-wm" aria-hidden="true">{step.num}</span>
					<div class="process-content">
						<h3 class="process-title">{step.title}</h3>
						<p class="process-body">{step.body}</p>
					</div>
				</div>
			{/each}
		</div>

		<div class="process-cta">
			<Button href="/survey" size="lg" class="cta-primary">
				Start With the Survey
				<IconArrowRight size={16} />
			</Button>
		</div>
	</div>
</section>

<!-- EARLY SIGNALS (quotes) -->
<section class="signals" id="signals" aria-labelledby="signals-hl">
	<div class="signals-inner container">
		<div class="signals-label">
			<IconQuote size={14} aria-hidden="true" />
			<span id="signals-hl" class="sr-only">Early survey responses</span>
			<span aria-hidden="true">A few unedited answers so far.</span>
		</div>

		<div class="signals-grid">
			{#each signals as s (s.quote)}
				<div class="signal-card">
					<blockquote class="signal-quote">"{s.quote}"</blockquote>
					<p class="signal-role">{s.role}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA -->
<section class="cta-section" id="cta" aria-labelledby="cta-hl">
	<div class="cta-glow" aria-hidden="true"></div>
	<div class="cta-inner container">
		<Badge variant="outline" class="cta-badge">
			<IconClock size={12} />
			5 minutes, zero pitch
		</Badge>

		<h2 id="cta-hl" class="cta-headline">
			Tell us what's<br /><span class="accent">actually happening.</span>
		</h2>

		<p class="cta-sub">
			Your answers become the research. The research becomes the newsletter. Take the survey, or just get the plain-language version in your inbox.
		</p>

		<div class="cta-actions">
			<div class="cta-buttons">
				<Button href="/survey" size="lg" class="cta-primary">
					Take the Survey
					<IconArrowRight size={16} />
				</Button>
				<Button href="/newsletter" size="lg" variant="outline" class="cta-secondary">
					Just Get the Newsletter
				</Button>
			</div>
			<p class="cta-note">No name required for the survey. Unsubscribe anytime from the newsletter.</p>
		</div>

		<div class="cta-checks" role="list">
			{#each ['Anonymous responses', 'Plain-language findings', 'No sales calls', 'Shapes what we cover next'] as item (item)}
				<span class="cta-check" role="listitem">
					<IconCheck size={14} class="proof-icon" aria-hidden="true" />
					{item}
				</span>
			{/each}
		</div>
	</div>
</section>

<style>
	/* ── TOKENS ── */
	.container { max-width: var(--max-w); margin: 0 auto; padding: 0 clamp(1.25rem, 5vw, 2.5rem); }
	.accent { color: var(--accent); }
	.eyebrow { font-size: 0.78rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; margin: 0 0 0.75rem; }
	.section-head { text-align: center; max-width: 620px; margin: 0 auto clamp(3rem, 6vw, 5rem); }
	.section-title { font-family: var(--font-display); font-size: clamp(2.4rem, 6vw, 4.2rem); line-height: 0.98; letter-spacing: 0.03em; color: var(--text-primary); margin: 0 0 1rem; }
	.section-note { font-size: 0.85rem; color: var(--text-muted); margin: 0.5rem 0 0; }
	.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

	/* ── HERO ── */
	.hero { position: relative; min-height: 100vh; min-height: 100dvh; display: flex; align-items: center; overflow: hidden; }
	.hero-bg-grid { position: absolute; inset: 0; background-image: linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%); }
	.hero-glow { position: absolute; top: -10%; left: 50%; transform: translateX(-50%); width: min(700px, 100vw); height: 500px; background: radial-gradient(ellipse at center top, var(--accent-glow) 0%, transparent 65%); pointer-events: none; }

	.hero-inner { position: relative; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; padding: clamp(6rem, 12vw, 10rem) 0 clamp(4rem, 8vw, 6rem); width: 100%; }

	:global(.hero-badge) { border-color: var(--bg-border-strong) !important; color: var(--text-secondary) !important; background: var(--surface-soft) !important; display: flex !important; align-items: center !important; gap: 0.35rem !important; font-size: 0.78rem !important; letter-spacing: 0.02em !important; }
	.hero-badge-wrap { margin-bottom: 1.5rem; }

	.hero-lead { font-size: clamp(0.9rem, 1.5vw, 1.1rem); color: var(--text-muted); letter-spacing: 0.15em; text-transform: uppercase; margin: 0; }
	.hero-number { font-family: var(--font-display); font-size: clamp(7rem, 20vw, 16rem); color: var(--accent); line-height: 0.82; letter-spacing: -0.03em; margin: 0; }
	.hero-lead-after { font-family: var(--font-display); font-size: clamp(1.3rem, 3vw, 2.2rem); color: var(--text-primary); letter-spacing: 0.02em; margin: 0; }
	.hero-headline { font-family: var(--font-display); font-size: clamp(2.2rem, 5.5vw, 4.2rem); line-height: 1; letter-spacing: 0.02em; color: var(--text-primary); margin: 1.5rem 0 0; }
	.hero-sub { font-size: clamp(1rem, 2vw, 1.15rem); color: var(--text-secondary); line-height: 1.65; max-width: 480px; margin: 1rem 0 0; font-weight: 300; }
	.hero-actions { margin-top: 1.5rem; display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; justify-content: center; }

	:global(.cta-primary) { background: var(--accent) !important; color: var(--button-ink) !important; border-color: var(--accent) !important; font-weight: 600 !important; display: flex !important; align-items: center !important; gap: 0.4rem !important; border-radius: var(--radius-md) !important; transition: background 0.18s, transform 0.15s !important; }
	:global(.cta-primary:hover) { background: var(--accent-dim) !important; border-color: var(--accent-dim) !important; transform: translateY(-1px) !important; }

	:global(.cta-secondary) { background: transparent !important; color: var(--text-primary) !important; border-color: var(--bg-border-strong) !important; font-weight: 600 !important; border-radius: var(--radius-md) !important; transition: border-color 0.18s, background 0.18s, transform 0.15s !important; }
	:global(.cta-secondary:hover) { border-color: var(--accent) !important; background: var(--accent-glow) !important; transform: translateY(-1px) !important; }

	.hero-proof { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; justify-content: center; margin-top: 1.5rem; }
	.proof-item { display: flex; align-items: center; gap: 0.35rem; font-size: 0.82rem; color: var(--text-muted); }
	:global(.proof-icon) { color: var(--accent) !important; }
	.proof-dot { color: var(--text-muted); font-size: 0.9rem; }

	/* ── ANIMATIONS ── */
	.anim-up { animation: fadeUp 0.6s ease both; }
	.d1 { animation-delay: 0.08s; }
	.d2 { animation-delay: 0.14s; }
	.d3 { animation-delay: 0.22s; }
	.d4 { animation-delay: 0.3s; }
	.d5 { animation-delay: 0.38s; }
	.d6 { animation-delay: 0.46s; }
	@keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }

	/* ── MARQUEE ── */
	.marquee-strip { overflow: hidden; border-top: 1px solid var(--bg-border); border-bottom: 1px solid var(--bg-border); background: var(--bg-card); padding: 0.85rem 0; }
	.marquee-track { display: flex; gap: 2.5rem; animation: scroll 45s linear infinite; width: max-content; will-change: transform; }
	.marquee-strip:hover .marquee-track { animation-play-state: paused; }
	.marquee-chip { display: flex; align-items: center; gap: 0.45rem; color: var(--text-muted); font-size: 0.85rem; font-weight: 500; white-space: nowrap; letter-spacing: 0.02em; padding: 0.35rem 0.75rem; border: 1px solid transparent; border-radius: 999px; transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1); }
	.marquee-strip:hover .marquee-chip { opacity: 0.4; }
	.marquee-strip:hover .marquee-chip:hover { opacity: 1; transform: scale(1.1) translateY(-2px); border-color: var(--accent); background: var(--accent-glow); color: var(--text-primary); box-shadow: 0 4px 24px var(--accent-glow); }
	:global(.marquee-icon) { color: var(--accent) !important; }
	@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-25%); } }

	/* ── FINDINGS ── */
	.findings { padding: var(--section-pad) 0; }
	.findings-list { display: flex; flex-direction: column; }

	.finding { position: relative; padding: clamp(3.5rem, 8vw, 6rem) 0; overflow: hidden; }
	.finding + .finding { border-top: 1px solid var(--bg-border); }

	.finding-watermark { position: absolute; font-family: var(--font-display); font-size: clamp(10rem, 28vw, 22rem); color: var(--accent); opacity: 0.05; line-height: 0.78; pointer-events: none; user-select: none; }
	.finding[data-index="0"] .finding-watermark { right: -4%; top: 50%; transform: translateY(-50%); }
	.finding[data-index="1"] .finding-watermark { left: -4%; top: 50%; transform: translateY(-50%); }
	.finding[data-index="2"] .finding-watermark { left: 50%; top: 50%; transform: translate(-50%, -50%); }

	.finding-body { position: relative; max-width: 520px; }
	.finding[data-index="0"] .finding-body { margin-right: auto; }
	.finding[data-index="1"] .finding-body { margin-left: auto; text-align: right; }
	.finding[data-index="2"] .finding-body { margin: 0 auto; text-align: center; }

	.finding-stat { display: block; font-family: var(--font-display); font-size: clamp(3rem, 7vw, 5rem); color: var(--accent); line-height: 1; margin-bottom: 1rem; letter-spacing: -0.01em; }
	.finding-unit { font-size: 0.4em; color: var(--text-muted); letter-spacing: 0.04em; vertical-align: baseline; }
	.finding-context { font-size: clamp(1.05rem, 2vw, 1.3rem); color: var(--text-primary); line-height: 1.6; margin: 0 0 0.75rem; font-weight: 300; }
	.finding-obs { font-size: clamp(0.92rem, 1.6vw, 1.05rem); color: var(--text-secondary); line-height: 1.6; margin: 0; font-style: italic; }

	/* ── WHAT WE DO ── */
	.possibilities { padding: var(--section-pad) 0; background: var(--bg-card); border-top: 1px solid var(--bg-border); border-bottom: 1px solid var(--bg-border); }

	.bento { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--bg-border); border: 1px solid var(--bg-border); border-radius: var(--radius-lg); overflow: hidden; }

	.bento-card { background: var(--bg); padding: clamp(1.5rem, 3.5vw, 2.25rem); display: flex; flex-direction: column; gap: 0.85rem; transition: background 0.2s, transform 0.2s; }
	.bento-card:hover { background: var(--bg-card-hover); }

	.bento-card[data-i="0"],
	.bento-card[data-i="4"] { grid-column: span 2; background: linear-gradient(135deg, var(--accent-glow), transparent 60%), var(--bg); }
	.bento-card[data-i="0"]:hover,
	.bento-card[data-i="4"]:hover { background: linear-gradient(135deg, var(--accent-glow-strong), transparent 60%), var(--bg-card-hover); }

	.bento-icon { color: var(--accent); }
	.bento-text { font-size: clamp(0.95rem, 1.8vw, 1.1rem); color: var(--text-primary); line-height: 1.5; margin: 0; font-weight: 300; }

	/* ── PROCESS ── */
	.process { position: relative; padding: var(--section-pad) 0; overflow: hidden; }
	.process-glow { position: absolute; inset: 0; background: radial-gradient(ellipse 60% 50% at 50% 50%, var(--accent-glow) 0%, transparent 70%); pointer-events: none; }

	.process-flow { display: flex; flex-direction: column; gap: 1rem; max-width: 680px; margin: 0 auto 3rem; }

	.process-card { position: relative; background: var(--bg-card); border: 1px solid var(--bg-border); border-left: 3px solid var(--accent); border-radius: var(--radius-lg); padding: clamp(1.75rem, 4vw, 2.5rem); overflow: hidden; transition: transform 0.22s, box-shadow 0.22s; }
	.process-card:hover { transform: translateX(6px); box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18); }

	.process-wm { position: absolute; right: 1.25rem; top: 50%; transform: translateY(-50%); font-family: var(--font-display); font-size: clamp(5rem, 12vw, 9rem); color: var(--accent); opacity: 0.06; line-height: 1; pointer-events: none; }

	.process-content { position: relative; }
	.process-title { font-family: var(--font-display); font-size: clamp(1.4rem, 3vw, 1.8rem); letter-spacing: 0.04em; color: var(--text-primary); margin: 0 0 0.6rem; }
	.process-body { font-size: 0.925rem; color: var(--text-secondary); line-height: 1.65; margin: 0; font-weight: 300; max-width: 480px; }

	.process-cta { display: flex; justify-content: center; }

	/* ── EARLY SIGNALS ── */
	.signals { padding: var(--section-pad) 0; background: var(--bg-card); border-top: 1px solid var(--bg-border); border-bottom: 1px solid var(--bg-border); }
	.signals-inner { max-width: 980px; margin: 0 auto; }

	.signals-label { display: flex; align-items: center; justify-content: center; gap: 0.4rem; font-size: 0.78rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; margin-bottom: 2.5rem; text-align: center; }

	.signals-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }

	.signal-card { position: relative; padding: clamp(1.5rem, 3vw, 2rem); border: 1px solid var(--bg-border); border-radius: var(--radius-lg); background: linear-gradient(135deg, var(--surface-soft), transparent 58%), var(--bg); box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1); }
	.signal-card::before { content: '\201C'; position: absolute; top: -0.4rem; right: 0.9rem; font-family: var(--font-display); font-size: clamp(4rem, 9vw, 6rem); line-height: 1; color: var(--accent); opacity: 0.1; pointer-events: none; }

	.signal-quote { position: relative; font-size: clamp(1rem, 1.6vw, 1.1rem); color: var(--text-primary); line-height: 1.6; font-style: italic; font-weight: 300; margin: 0 0 1.25rem; padding: 0; border: none; }
	.signal-role { font-size: 0.8rem; color: var(--text-muted); margin: 0; }

	/* ── CTA ── */
	.cta-section { position: relative; padding: var(--section-pad) 0; overflow: hidden; }
	.cta-glow { position: absolute; bottom: -10%; left: 50%; transform: translateX(-50%); width: min(800px, 120vw); height: 600px; background: radial-gradient(ellipse at center bottom, var(--accent-glow-strong) 0%, transparent 60%); pointer-events: none; }
	.cta-inner { position: relative; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; max-width: 660px; margin: 0 auto; }
	:global(.cta-badge) { border-color: var(--accent-glow-strong) !important; color: var(--accent) !important; background: var(--accent-glow) !important; display: flex !important; align-items: center !important; gap: 0.35rem !important; font-size: 0.78rem !important; }
	.cta-headline { font-family: var(--font-display); font-size: clamp(2.8rem, 7vw, 5.5rem); line-height: 0.96; letter-spacing: 0.02em; color: var(--text-primary); margin: 0; }
	.cta-sub { font-size: 1rem; color: var(--text-secondary); line-height: 1.65; margin: 0; font-weight: 300; max-width: 480px; }
	.cta-actions { display: flex; flex-direction: column; align-items: center; gap: 0.65rem; }
	.cta-buttons { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; justify-content: center; }
	.cta-note { font-size: 0.8rem; color: var(--text-muted); margin: 0; }
	.cta-checks { display: flex; flex-wrap: wrap; gap: 0.75rem 1.5rem; justify-content: center; }
	.cta-check { display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; color: var(--text-muted); }

	/* ── RESPONSIVE ── */
	@media (max-width: 900px) {
		.bento { grid-template-columns: repeat(2, 1fr); }
		.bento-card[data-i="0"], .bento-card[data-i="4"] { grid-column: span 2; }
		.signals-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; }
	}

	@media (max-width: 768px) {
		.finding-body { margin: 0 auto !important; text-align: center !important; }
		.finding-watermark { left: 50% !important; right: auto !important; transform: translate(-50%, -50%) !important; top: 50% !important; }
	}

	@media (max-width: 500px) {
		.bento { grid-template-columns: 1fr; }
		.bento-card[data-i="0"], .bento-card[data-i="4"] { grid-column: span 1; }

		.hero-number { font-size: clamp(5rem, 22vw, 8rem); }
		.hero-actions { flex-direction: column; width: 100%; }
		:global(.cta-primary), :global(.cta-secondary) { width: 100%; justify-content: center !important; }
	}
</style>