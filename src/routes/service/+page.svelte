<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { page } from '$app/state';
	import { trackEvent, utmEventData } from '$lib/client/analytics';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import Turnstile from '$lib/components/Turnstile.svelte';
	import {
		IconArrowRight,
		IconTools,
		IconClipboardList,
		IconSettingsBolt,
		IconCircuitDiode,
		IconSchool,
		IconSend,
		IconCheck,
		IconQuote
	} from '@tabler/icons-svelte';

	const modes = [
		{
			label: 'Audit + Roadmap',
			icon: IconClipboardList,
			body: 'We walk the shop, look at every tool you already pay for, and write the sequence: what to fix first, what to leave alone, what would actually justify the AI headline. You end with the plan, not a slide deck.'
		},
		{
			label: 'Build',
			icon: IconSettingsBolt,
			body: "Hands-on installation. CRM, dispatch, quoting, invoicing, the pieces that talk to each other. We wire them together the way your shop actually runs, not the way a vendor's demo pretends it does."
		},
		{
			label: 'Run',
			icon: IconCircuitDiode,
			body: 'We operate the automation and AI stack on retainer. You keep working. We keep it working — the weekly maintenance, the quiet fixes, the bit that broke because someone updated something.'
		},
		{
			label: 'Train',
			icon: IconSchool,
			body: "Your team learns what changed. Real sessions, not a Loom link buried in an email. Whoever runs the shop when you're not there needs to run the new pieces too, or none of this holds."
		}
	];

	const method = [
		{
			num: '01',
			title: 'Digitalize',
			body: 'Get the pricing, the schedule, the customer history, and the invoices out of a notebook — and out of your head — and into one place your team can actually see.'
		},
		{
			num: '02',
			title: 'Automate',
			body: 'Once the work lives somewhere a machine can read, the machine can do the boring parts. The reminder. The follow-up. The Tuesday email you always forget to send.'
		},
		{
			num: '03',
			title: 'AI, if it fits',
			body: "Most of what people call “AI” is a workflow with better marketing. When something genuinely earns its place — call answering, quote drafting, customer sorting — it goes in. When it doesn't, we don't pretend it does."
		}
	];

	// Real, unedited responses from the running survey. Placed as concrete pieces,
	// not testimonials. Swap for stronger specifics as more responses come in.
	const responses = [
		{
			quote: 'Everyone is selling AI. Nobody is explaining it.',
			role: 'Roofing business owner, survey response'
		},
		{
			quote: 'I just want to know what to actually do on Monday morning.',
			role: 'HVAC business owner, survey response'
		},
		{
			quote: "I don't know what's hype and what's actually going to help me.",
			role: 'Plumbing business owner, survey response'
		}
	];

	const trades = [
		{ value: 'hvac', label: 'HVAC' },
		{ value: 'plumbing', label: 'Plumbing' },
		{ value: 'electrical', label: 'Electrical' },
		{ value: 'roofing', label: 'Roofing' },
		{ value: 'general_contracting', label: 'General contracting / construction' },
		{ value: 'landscaping', label: 'Landscaping' },
		{ value: 'auto_repair', label: 'Auto repair' },
		{ value: 'painting', label: 'Painting' },
		{ value: 'cleaning', label: 'Cleaning' },
		{ value: 'other', label: 'Other' }
	];

	const teamSizes = [
		{ value: 'just_me', label: 'Just me' },
		{ value: '2_5', label: '2–5' },
		{ value: '6_15', label: '6–15' },
		{ value: '16_plus', label: '16+' }
	];

	const urgencies = [
		{ value: 'not_urgent', label: 'Not urgent', note: 'Planning ahead.' },
		{
			value: 'somewhat_non_urgent',
			label: 'Somewhat non-urgent',
			note: 'Sometime this quarter.'
		},
		{ value: 'somewhat_urgent', label: 'Somewhat urgent', note: 'This month, if possible.' },
		{ value: 'quite_urgent', label: 'Quite urgent', note: 'I need traction in a few weeks.' }
	];

	let name = $state('');
	let email = $state('');
	let businessName = $state('');
	let trade = $state('');
	let tradeOther = $state('');
	let teamSize = $state('');
	let urgency = $state('');
	let notes = $state('');
	let turnstileToken = $state('');
	let submitting = $state(false);
	let submitted = $state(false);
	let errorMsg = $state('');

	function isValidEmail(v: string) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
	}

	function handleSubmit() {
		errorMsg = '';
		if (!name.trim()) {
			errorMsg = 'Please tell us your name.';
			return () => {};
		}
		if (!isValidEmail(email)) {
			errorMsg = 'Please enter a valid email address.';
			return () => {};
		}
		if (!businessName.trim()) {
			errorMsg = 'Please tell us your business name.';
			return () => {};
		}
		if (!trade) {
			errorMsg = 'Please pick your trade.';
			return () => {};
		}
		if (trade === 'other' && !tradeOther.trim()) {
			errorMsg = 'Please tell us your trade.';
			return () => {};
		}
		if (!teamSize) {
			errorMsg = 'Please pick your team size.';
			return () => {};
		}
		if (!urgency) {
			errorMsg = 'Please pick a timeline.';
			return () => {};
		}
		if (!turnstileToken) {
			errorMsg = 'Please complete the verification check below.';
			return () => {};
		}
		submitting = true;
		return async ({ result }: { result: ActionResult }) => {
			submitting = false;
			if (result.type === 'success') {
				submitted = true;
				trackEvent('service_submit', utmEventData(page.data.utm));
			} else if (result.type === 'failure') {
				errorMsg =
					(result.data as { error?: string } | undefined)?.error ??
					'Something went wrong. Try again.';
				turnstileToken = '';
			} else if (result.type === 'error') {
				errorMsg = 'Something went wrong. Try again.';
				turnstileToken = '';
			}
		};
	}
</script>

<svelte:head>
	<title>Service — Muscar</title>
	<meta
		name="description"
		content="Muscar helps trade shops become AI-ready — starting with the business process, not the buzzword. Digitalize, automate, then AI where it earns its place."
	/>
</svelte:head>

<!-- HERO -->
<section class="sv-hero" aria-labelledby="sv-hl">
	<div class="sv-bg-grid" aria-hidden="true"></div>
	<div class="sv-glow" aria-hidden="true"></div>

	<div class="sv-hero-inner container">
		<div class="sv-badge-wrap">
			<Badge variant="outline" class="sv-badge">
				<IconTools size={12} />
				The other side of Muscar
			</Badge>
		</div>

		<h1 id="sv-hl" class="sv-headline">
			Your shop doesn't need<br />
			<span class="accent">more AI.</span>
		</h1>

		<p class="sv-sub">
			It needs a business that runs whether AI shows up or not. We start at the process, not the
			tool. Digitalize what still lives on paper. Automate what a machine can do without help. Then,
			only if it earns its place, bring AI in.
		</p>

		<p class="sv-kicker">Most of what people call "AI" is a workflow with better marketing.</p>

		<div class="sv-hero-actions">
			<Button href="#get-started" size="lg" class="cta-primary">
				Tell Us About Your Shop
				<IconArrowRight size={16} />
			</Button>
			<Button href="#method" size="lg" variant="outline" class="cta-secondary">
				See How We Work
			</Button>
		</div>
	</div>
</section>

<!-- METHOD: Digitalize → Automate → AI, if it fits -->
<section class="sv-method" id="method" aria-labelledby="sv-method-hl">
	<div class="container">
		<div class="section-head">
			<p class="eyebrow">The order matters</p>
			<h2 id="sv-method-hl" class="section-title">
				Digitalize. Automate.<br /><span class="accent">Then AI, if it fits.</span>
			</h2>
			<p class="section-note">
				This isn't a template. Every engagement is scoped to your process, your people, and what
				you're actually trying to become. The order below is the part that never changes.
			</p>
		</div>

		<div class="sv-method-flow">
			{#each method as step (step.num)}
				<div class="sv-method-card">
					<span class="sv-method-wm" aria-hidden="true">{step.num}</span>
					<div class="sv-method-content">
						<h3 class="sv-method-title">{step.title}</h3>
						<p class="sv-method-body">{step.body}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- FOUR MODES -->
<section class="sv-modes" id="what-we-do" aria-labelledby="sv-modes-hl">
	<div class="container">
		<div class="section-head">
			<p class="eyebrow">What we actually build</p>
			<h2 id="sv-modes-hl" class="section-title">
				Four ways in.<br /><span class="accent">All shaped to your shop.</span>
			</h2>
			<p class="section-note">
				No packages. No tiers. Most engagements start with the first one and grow into the others as
				the picture gets clearer.
			</p>
		</div>

		<div class="sv-modes-grid">
			{#each modes as mode, i (mode.label)}
				{@const Icon = mode.icon}
				<div class="sv-mode-card" data-i={i}>
					<div class="sv-mode-icon" aria-hidden="true">
						<Icon size={22} />
					</div>
					<h3 class="sv-mode-label">{mode.label}</h3>
					<p class="sv-mode-body">{mode.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- FIT: not everyone -->
<section class="sv-fit" aria-labelledby="sv-fit-hl">
	<div class="sv-fit-inner container">
		<div class="sv-fit-head">
			<p class="eyebrow">
				<IconQuote size={12} aria-hidden="true" />
				Read the room first
			</p>
			<h2 id="sv-fit-hl" class="section-title">
				This isn't a<br /><span class="accent">Monday-morning fix.</span>
			</h2>
		</div>

		<div class="sv-responses-grid">
			{#each responses as r (r.quote)}
				<div class="sv-response-card">
					<blockquote class="sv-response-quote">"{r.quote}"</blockquote>
					<p class="sv-response-role">{r.role}</p>
				</div>
			{/each}
		</div>

		<div class="sv-fit-body">
			<p>
				Due diligence is part of the method. We map how your business actually runs before we touch
				anything, because a fix laid over a process nobody has looked at is how the last three
				subscriptions ended up in the graveyard.
			</p>
			<p>
				If something has to work by Friday, this isn't it — the newsletter and the survey serve you
				better while we take our time. If you're tired of buying tools and nothing changes, that's
				the conversation.
			</p>
		</div>
	</div>
</section>

<!-- GET STARTED FORM -->
<section class="sv-form-section" id="get-started" aria-labelledby="sv-form-hl">
	<div class="sv-form-glow" aria-hidden="true"></div>
	<div class="container">
		<div class="section-head">
			<p class="eyebrow">Start here</p>
			<h2 id="sv-form-hl" class="section-title">
				Tell us about<br /><span class="accent">your shop.</span>
			</h2>
			<p class="section-note">
				A few minutes. We read every one. If there's a fit, we come back to you within a few days
				with a first read on scope. No sales call, no sequence.
			</p>
		</div>

		<div class="sv-form-card">
			{#if submitted}
				<div class="sv-success" role="status">
					<span class="sv-success-icon"><IconCheck size={22} /></span>
					<p class="sv-success-title">Received.</p>
					<p class="sv-success-body">
						We'll read it in the next couple of days. If there's a fit, you'll hear from a real
						person — not a drip sequence.
					</p>
				</div>
			{:else}
				<form method="POST" action="?/apply" use:enhance={handleSubmit} class="sv-form">
					<div class="sv-form-row">
						<div class="sv-field">
							<label class="sv-label" for="sv-name">Name <span class="sv-req">*</span></label>
							<input
								id="sv-name"
								name="name"
								type="text"
								class="sv-input"
								placeholder="Jane Doe"
								bind:value={name}
								autocomplete="name"
								required
							/>
						</div>
						<div class="sv-field">
							<label class="sv-label" for="sv-email">Email <span class="sv-req">*</span></label>
							<input
								id="sv-email"
								name="email"
								type="email"
								class="sv-input"
								placeholder="jane@yourbusiness.com"
								bind:value={email}
								autocomplete="email"
								inputmode="email"
								required
							/>
						</div>
					</div>

					<div class="sv-field">
						<label class="sv-label" for="sv-business"
							>Business name <span class="sv-req">*</span></label
						>
						<input
							id="sv-business"
							name="business_name"
							type="text"
							class="sv-input"
							placeholder="Doe & Sons HVAC"
							bind:value={businessName}
							autocomplete="organization"
							required
						/>
					</div>

					<div class="sv-form-row">
						<div class="sv-field">
							<label class="sv-label" for="sv-trade">Trade <span class="sv-req">*</span></label>
							<select
								id="sv-trade"
								name="trade"
								class="sv-input sv-select"
								bind:value={trade}
								required
							>
								<option value="" disabled>Pick your trade</option>
								{#each trades as t (t.value)}
									<option value={t.value}>{t.label}</option>
								{/each}
							</select>
						</div>
						<div class="sv-field">
							<label class="sv-label" for="sv-team">Team size <span class="sv-req">*</span></label>
							<select
								id="sv-team"
								name="team_size"
								class="sv-input sv-select"
								bind:value={teamSize}
								required
							>
								<option value="" disabled>Pick a range</option>
								{#each teamSizes as s (s.value)}
									<option value={s.value}>{s.label}</option>
								{/each}
							</select>
						</div>
					</div>

					{#if trade === 'other'}
						<div class="sv-field">
							<label class="sv-label" for="sv-trade-other"
								>Which trade? <span class="sv-req">*</span></label
							>
							<input
								id="sv-trade-other"
								name="trade_other"
								type="text"
								class="sv-input"
								placeholder="Tell us"
								bind:value={tradeOther}
							/>
						</div>
					{/if}

					<div class="sv-field">
						<span class="sv-label">Timeline <span class="sv-req">*</span></span>
						<div class="sv-urgency-grid">
							{#each urgencies as u (u.value)}
								<label class="sv-urgency-option" class:selected={urgency === u.value}>
									<input
										type="radio"
										name="urgency"
										value={u.value}
										bind:group={urgency}
										required
									/>
									<span class="sv-urgency-label">{u.label}</span>
									<span class="sv-urgency-note">{u.note}</span>
								</label>
							{/each}
						</div>
						<p class="sv-urgency-warning">
							We don't take on very-urgent projects. Due diligence is part of the method — we can't
							skip it and still do the work right.
						</p>
					</div>

					<div class="sv-field">
						<label class="sv-label" for="sv-notes"
							>Anything else <span class="sv-optional">(optional)</span></label
						>
						<textarea
							id="sv-notes"
							name="notes"
							class="sv-input sv-textarea"
							placeholder="What's eating your time right now? What have you tried? Anything you want us to know before the first read."
							bind:value={notes}
							rows="4"
						></textarea>
					</div>

					<div class="sv-turnstile">
						<Turnstile
							onVerify={(token) => (turnstileToken = token)}
							onExpire={() => (turnstileToken = '')}
						/>
					</div>

					{#if errorMsg}
						<p class="sv-error">{errorMsg}</p>
					{/if}

					<Button type="submit" size="lg" class="cta-primary sv-submit" disabled={submitting}>
						{submitting ? 'Sending…' : 'Send'}
						<IconSend size={15} />
					</Button>

					<p class="sv-footnote">
						Not ready to talk?
						<a class="sv-footnote-link" href="/newsletter">Get the newsletter</a> instead — we publish
						what we learn.
					</p>
				</form>
			{/if}
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
	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.78rem;
		color: var(--accent);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-weight: 600;
		margin: 0 0 0.75rem;
	}
	.section-head {
		text-align: center;
		max-width: 640px;
		margin: 0 auto clamp(3rem, 6vw, 4.5rem);
	}
	.section-title {
		font-family: var(--font-display);
		font-size: clamp(2.4rem, 6vw, 4.2rem);
		line-height: 0.98;
		letter-spacing: 0.03em;
		color: var(--text-primary);
		margin: 0 0 1rem;
	}
	.section-note {
		font-size: 0.9rem;
		color: var(--text-muted);
		line-height: 1.65;
		margin: 0.75rem auto 0;
		max-width: 520px;
	}

	/* ── HERO ── */
	.sv-hero {
		position: relative;
		min-height: 88vh;
		min-height: 88dvh;
		display: flex;
		align-items: center;
		overflow: hidden;
	}
	.sv-bg-grid {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(var(--grid-line) 1px, transparent 1px),
			linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
		background-size: 60px 60px;
		mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
	}
	.sv-glow {
		position: absolute;
		top: -10%;
		left: 50%;
		transform: translateX(-50%);
		width: min(760px, 100vw);
		height: 520px;
		background: radial-gradient(ellipse at center top, var(--accent-glow) 0%, transparent 65%);
		pointer-events: none;
	}
	.sv-hero-inner {
		position: relative;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: clamp(5rem, 12vw, 8rem) 0 clamp(3.5rem, 8vw, 5rem);
	}
	:global(.sv-badge) {
		border-color: var(--bg-border-strong) !important;
		color: var(--text-secondary) !important;
		background: var(--surface-soft) !important;
		display: flex !important;
		align-items: center !important;
		gap: 0.35rem !important;
		font-size: 0.78rem !important;
		letter-spacing: 0.02em !important;
	}
	.sv-badge-wrap {
		margin-bottom: 1.5rem;
	}
	.sv-headline {
		font-family: var(--font-display);
		font-size: clamp(2.6rem, 7vw, 5rem);
		line-height: 1;
		letter-spacing: 0.02em;
		color: var(--text-primary);
		margin: 0;
	}
	.sv-sub {
		font-size: clamp(1rem, 2vw, 1.15rem);
		color: var(--text-secondary);
		line-height: 1.65;
		max-width: 560px;
		margin: 1.5rem 0 0;
		font-weight: 300;
	}
	.sv-kicker {
		font-size: clamp(0.95rem, 1.7vw, 1.05rem);
		color: var(--text-primary);
		line-height: 1.5;
		max-width: 520px;
		margin: 1.25rem 0 0;
		font-style: italic;
		font-weight: 400;
		border-left: 2px solid var(--accent);
		padding: 0.15rem 0 0.15rem 1rem;
		text-align: left;
	}
	.sv-hero-actions {
		margin-top: 2rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	/* ── METHOD ── */
	.sv-method {
		padding: var(--section-pad) 0;
		background: var(--bg-card);
		border-top: 1px solid var(--bg-border);
		border-bottom: 1px solid var(--bg-border);
	}
	.sv-method-flow {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 720px;
		margin: 0 auto;
	}
	.sv-method-card {
		position: relative;
		background: var(--bg);
		border: 1px solid var(--bg-border);
		border-left: 3px solid var(--accent);
		border-radius: var(--radius-lg);
		padding: clamp(1.75rem, 4vw, 2.5rem);
		overflow: hidden;
		transition:
			transform 0.22s,
			box-shadow 0.22s;
	}
	.sv-method-card:hover {
		transform: translateX(6px);
		box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18);
	}
	.sv-method-wm {
		position: absolute;
		right: 1.25rem;
		top: 50%;
		transform: translateY(-50%);
		font-family: var(--font-display);
		font-size: clamp(5rem, 12vw, 9rem);
		color: var(--accent);
		opacity: 0.06;
		line-height: 1;
		pointer-events: none;
	}
	.sv-method-content {
		position: relative;
	}
	.sv-method-title {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 3vw, 2rem);
		letter-spacing: 0.04em;
		color: var(--text-primary);
		margin: 0 0 0.6rem;
	}
	.sv-method-body {
		font-size: 0.95rem;
		color: var(--text-secondary);
		line-height: 1.65;
		margin: 0;
		font-weight: 300;
		max-width: 520px;
	}

	/* ── MODES ── */
	.sv-modes {
		padding: var(--section-pad) 0;
	}
	.sv-modes-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1px;
		background: var(--bg-border);
		border: 1px solid var(--bg-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}
	.sv-mode-card {
		background: var(--bg-card);
		padding: clamp(1.75rem, 3.5vw, 2.5rem);
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		transition:
			background 0.2s,
			transform 0.2s;
	}
	.sv-mode-card:hover {
		background: var(--bg-card-hover);
	}
	.sv-mode-card[data-i='0'],
	.sv-mode-card[data-i='3'] {
		background: linear-gradient(135deg, var(--accent-glow), transparent 60%), var(--bg-card);
	}
	.sv-mode-card[data-i='0']:hover,
	.sv-mode-card[data-i='3']:hover {
		background:
			linear-gradient(135deg, var(--accent-glow-strong), transparent 60%), var(--bg-card-hover);
	}
	.sv-mode-icon {
		color: var(--accent);
	}
	.sv-mode-label {
		font-family: var(--font-display);
		font-size: clamp(1.3rem, 2.4vw, 1.6rem);
		letter-spacing: 0.04em;
		color: var(--text-primary);
		margin: 0;
	}
	.sv-mode-body {
		font-size: 0.95rem;
		color: var(--text-secondary);
		line-height: 1.65;
		margin: 0;
		font-weight: 300;
	}

	/* ── FIT ── */
	.sv-fit {
		padding: var(--section-pad) 0;
		background: var(--bg-card);
		border-top: 1px solid var(--bg-border);
		border-bottom: 1px solid var(--bg-border);
	}
	.sv-fit-inner {
		max-width: 980px;
	}
	.sv-fit-head {
		text-align: center;
		margin-bottom: clamp(2.5rem, 5vw, 3.5rem);
	}
	.sv-responses-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.25rem;
		margin-bottom: clamp(2.5rem, 5vw, 3.5rem);
	}
	.sv-response-card {
		position: relative;
		padding: clamp(1.5rem, 3vw, 2rem);
		border: 1px solid var(--bg-border);
		border-radius: var(--radius-lg);
		background: linear-gradient(135deg, var(--surface-soft), transparent 58%), var(--bg);
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
	}
	.sv-response-card::before {
		content: '\201C';
		position: absolute;
		top: -0.4rem;
		right: 0.9rem;
		font-family: var(--font-display);
		font-size: clamp(4rem, 9vw, 6rem);
		line-height: 1;
		color: var(--accent);
		opacity: 0.1;
		pointer-events: none;
	}
	.sv-response-quote {
		position: relative;
		font-size: clamp(0.98rem, 1.5vw, 1.05rem);
		color: var(--text-primary);
		line-height: 1.6;
		font-style: italic;
		font-weight: 300;
		margin: 0 0 1rem;
		border: none;
	}
	.sv-response-role {
		font-size: 0.78rem;
		color: var(--text-muted);
		margin: 0;
	}
	.sv-fit-body {
		max-width: 620px;
		margin: 0 auto;
		text-align: left;
	}
	.sv-fit-body p {
		font-size: clamp(1rem, 1.6vw, 1.05rem);
		color: var(--text-secondary);
		line-height: 1.7;
		margin: 0 0 1rem;
		font-weight: 300;
	}
	.sv-fit-body p:last-child {
		margin-bottom: 0;
	}

	/* ── FORM ── */
	.sv-form-section {
		position: relative;
		padding: var(--section-pad) 0;
		overflow: hidden;
	}
	.sv-form-glow {
		position: absolute;
		bottom: -10%;
		left: 50%;
		transform: translateX(-50%);
		width: min(800px, 120vw);
		height: 560px;
		background: radial-gradient(ellipse at center bottom, var(--accent-glow) 0%, transparent 60%);
		pointer-events: none;
	}
	.sv-form-card {
		position: relative;
		max-width: 640px;
		margin: 0 auto;
		background: var(--bg-card);
		border: 1px solid var(--bg-border);
		border-radius: var(--radius-lg);
		padding: clamp(1.75rem, 4vw, 2.5rem);
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
	}
	.sv-form {
		display: flex;
		flex-direction: column;
		gap: 1.15rem;
	}
	.sv-form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
	.sv-field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.sv-label {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text-primary);
	}
	.sv-req {
		color: var(--accent);
	}
	.sv-optional {
		font-weight: 400;
		color: var(--text-muted);
	}
	.sv-input {
		width: 100%;
		background: var(--surface-soft);
		border: 1px solid var(--bg-border-strong);
		border-radius: var(--radius-sm);
		padding: 0.7rem 0.85rem;
		font-size: 0.95rem;
		color: var(--text-primary);
		font-family: var(--font-body);
		transition:
			border-color 0.18s,
			background 0.18s;
	}
	.sv-input:focus {
		outline: none;
		border-color: var(--accent);
		background: var(--accent-glow);
	}
	.sv-input::placeholder {
		color: var(--text-muted);
	}
	.sv-select {
		appearance: none;
		-webkit-appearance: none;
		background-image:
			linear-gradient(45deg, transparent 50%, var(--text-muted) 50%),
			linear-gradient(135deg, var(--text-muted) 50%, transparent 50%);
		background-position:
			calc(100% - 18px) 55%,
			calc(100% - 13px) 55%;
		background-size:
			5px 5px,
			5px 5px;
		background-repeat: no-repeat;
		padding-right: 2rem;
	}
	.sv-textarea {
		resize: vertical;
		min-height: 6.5rem;
		font-family: var(--font-body);
	}
	.sv-urgency-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.6rem;
		margin-top: 0.15rem;
	}
	.sv-urgency-option {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		padding: 0.75rem 0.9rem;
		background: var(--surface-soft);
		border: 1px solid var(--bg-border-strong);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition:
			border-color 0.18s,
			background 0.18s;
	}
	.sv-urgency-option input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}
	.sv-urgency-option:hover {
		border-color: var(--accent);
	}
	.sv-urgency-option.selected {
		border-color: var(--accent);
		background: var(--accent-glow);
	}
	.sv-urgency-label {
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--text-primary);
	}
	.sv-urgency-note {
		font-size: 0.78rem;
		color: var(--text-muted);
	}
	.sv-urgency-warning {
		font-size: 0.8rem;
		color: var(--text-muted);
		line-height: 1.55;
		margin: 0.7rem 0 0;
		border-left: 2px solid var(--accent);
		padding-left: 0.7rem;
	}
	.sv-turnstile {
		margin-top: 0.1rem;
	}
	.sv-error {
		font-size: 0.85rem;
		color: var(--accent);
		margin: 0;
	}
	:global(.sv-submit) {
		width: 100% !important;
		justify-content: center !important;
		margin-top: 0.25rem;
	}
	.sv-footnote {
		font-size: 0.82rem;
		color: var(--text-muted);
		margin: 0.4rem 0 0;
		text-align: center;
	}
	.sv-footnote-link {
		color: var(--accent);
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: border-color 0.2s;
	}
	.sv-footnote-link:hover {
		border-bottom-color: var(--accent);
	}

	.sv-success {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.5rem;
		padding: 1rem 0;
	}
	.sv-success-icon {
		display: grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 999px;
		background: var(--accent);
		color: var(--button-ink);
		margin-bottom: 0.25rem;
	}
	.sv-success-title {
		font-family: var(--font-display);
		font-size: 1.75rem;
		letter-spacing: 0.02em;
		color: var(--text-primary);
		margin: 0;
	}
	.sv-success-body {
		font-size: 0.92rem;
		color: var(--text-secondary);
		margin: 0;
		max-width: 380px;
		line-height: 1.6;
	}

	/* ── RESPONSIVE ── */
	@media (max-width: 900px) {
		.sv-modes-grid {
			grid-template-columns: 1fr;
		}
		.sv-responses-grid {
			grid-template-columns: 1fr;
			max-width: 480px;
			margin-left: auto;
			margin-right: auto;
		}
	}

	@media (max-width: 600px) {
		.sv-form-row {
			grid-template-columns: 1fr;
		}
		.sv-urgency-grid {
			grid-template-columns: 1fr;
		}
		.sv-hero-actions {
			flex-direction: column;
			width: 100%;
		}
		:global(.cta-primary),
		:global(.cta-secondary) {
			width: 100%;
			justify-content: center !important;
		}
		.sv-kicker {
			text-align: left;
		}
	}
</style>
