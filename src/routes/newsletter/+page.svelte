<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import Turnstile from '$lib/components/Turnstile.svelte';
	import {
		IconMail,
		IconSend,
		IconCheck,
		IconClipboardList,
		IconChartBar,
		IconBolt,
		IconShieldCheck
	} from '@tabler/icons-svelte';

	const niches = [
		'HVAC',
		'Plumbing',
		'Electrical',
		'Roofing',
		'Landscaping',
		'Painting',
		'Cleaning',
		'General Contracting',
		'Other'
	];

	const whatYouGet = [
		{
			text: 'One email when there\u2019s something real to report \u2014 not a weekly filler newsletter.',
			icon: IconClipboardList
		},
		{
			text: 'Plain-language findings from the survey data, sorted by trade.',
			icon: IconChartBar
		},
		{
			text: 'What to actually try, and what to skip \u2014 no vague \u201cleverage AI\u201d advice.',
			icon: IconBolt
		},
		{
			text: 'No pitch buried in the issue. Unsubscribe anytime.',
			icon: IconShieldCheck
		}
	];

	let name = $state('');
	let email = $state('');
	let niche = $state('');
	let turnstileToken = $state('');
	let submitting = $state(false);
	let submitted = $state(false);
	let errorMsg = $state('');

	function isValidEmail(v: string) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
	}

	function handleSubmit() {
		errorMsg = '';
		if (!isValidEmail(email)) {
			errorMsg = 'Please enter a valid email address.';
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
	<title>Newsletter — Muscar</title>
	<meta
		name="description"
		content="Plain-language findings on AI adoption in the trades, straight to your inbox. No pitch, no hype."
	/>
</svelte:head>

<section class="nl-hero" aria-labelledby="nl-hl">
	<div class="nl-bg-grid" aria-hidden="true"></div>
	<div class="nl-glow" aria-hidden="true"></div>

	<div class="nl-inner container">
		<div class="nl-badge-wrap">
			<Badge variant="outline" class="nl-badge">
				<IconMail size={12} />
				Straight to your inbox
			</Badge>
		</div>

		<h1 id="nl-hl" class="nl-headline">
			The <span class="accent">plain-language</span> version.
		</h1>

		<p class="nl-sub">
			We're surveying trade business owners on what's real about AI and what's noise. This is where
			the findings land — no pitch buried in the issue, no name required to keep reading.
		</p>

		<div class="nl-card">
			{#if submitted}
				<div class="nl-success" role="status">
					<span class="nl-success-icon"><IconCheck size={22} /></span>
					<p class="nl-success-title">You're on the list.</p>
					<p class="nl-success-body">
						We'll email you when there's something worth reading. That's it.
					</p>
				</div>
			{:else}
				<form method="POST" action="?/subscribe" use:enhance={handleSubmit} class="nl-form">
					<div class="nl-field">
						<label class="nl-label" for="nl-name"
							>Name <span class="nl-optional">(optional)</span></label
						>
						<input
							id="nl-name"
							name="name"
							type="text"
							class="nl-input"
							placeholder="Jane"
							bind:value={name}
							autocomplete="name"
						/>
					</div>
					<div class="nl-field">
						<label class="nl-label" for="nl-email">Email <span class="nl-req">*</span></label>
						<input
							id="nl-email"
							name="email"
							type="email"
							class="nl-input"
							placeholder="jane@yourbusiness.com"
							bind:value={email}
							autocomplete="email"
							inputmode="email"
							required
						/>
					</div>
					<div class="nl-field">
						<label class="nl-label" for="nl-niche"
							>Trade <span class="nl-optional">(optional)</span></label
						>
						<select id="nl-niche" name="niche" class="nl-input" bind:value={niche}>
							<option value="">Prefer not to say</option>
							{#each niches as n (n)}
								<option value={n}>{n}</option>
							{/each}
						</select>
					</div>

					<div class="nl-turnstile">
						<Turnstile
							onVerify={(token) => (turnstileToken = token)}
							onExpire={() => (turnstileToken = '')}
						/>
					</div>

					{#if errorMsg}
						<p class="nl-error">{errorMsg}</p>
					{/if}

					<Button type="submit" size="lg" class="cta-primary nl-submit" disabled={submitting}>
						{submitting ? 'Subscribing\u2026' : 'Get the Newsletter'}
						<IconSend size={15} />
					</Button>
					<p class="nl-fineprint">No spam. Unsubscribe anytime.</p>
				</form>
			{/if}
		</div>
	</div>
</section>

<section class="nl-what" aria-labelledby="nl-what-hl">
	<div class="container">
		<h2 id="nl-what-hl" class="nl-what-hl">What you'll get</h2>
		<ul class="nl-what-list">
			{#each whatYouGet as item, i (i)}
				<li class="nl-what-item">
					<span class="nl-what-icon"><item.icon size={18} /></span>
					<span>{item.text}</span>
				</li>
			{/each}
		</ul>
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
	.nl-hero {
		position: relative;
		overflow: hidden;
	}
	.nl-bg-grid {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(var(--grid-line) 1px, transparent 1px),
			linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
		background-size: 60px 60px;
		mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
	}
	.nl-glow {
		position: absolute;
		top: -10%;
		left: 50%;
		transform: translateX(-50%);
		width: min(700px, 100vw);
		height: 500px;
		background: radial-gradient(ellipse at center top, var(--accent-glow) 0%, transparent 65%);
		pointer-events: none;
	}

	.nl-inner {
		position: relative;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: clamp(4.5rem, 10vw, 7rem) 0 clamp(3.5rem, 7vw, 5rem);
	}

	:global(.nl-badge) {
		border-color: var(--bg-border-strong) !important;
		color: var(--text-secondary) !important;
		background: var(--surface-soft) !important;
		display: flex !important;
		align-items: center !important;
		gap: 0.35rem !important;
		font-size: 0.78rem !important;
		letter-spacing: 0.02em !important;
	}
	.nl-badge-wrap {
		margin-bottom: 1.5rem;
	}

	.nl-headline {
		font-family: var(--font-display);
		font-size: clamp(2.4rem, 6vw, 4rem);
		line-height: 1;
		letter-spacing: 0.02em;
		color: var(--text-primary);
		margin: 0;
	}
	.nl-sub {
		font-size: clamp(1rem, 2vw, 1.1rem);
		color: var(--text-secondary);
		line-height: 1.65;
		max-width: 480px;
		margin: 1.1rem 0 0;
		font-weight: 300;
	}

	/* ── FORM CARD ── */
	.nl-card {
		margin-top: 2.5rem;
		width: 100%;
		max-width: 420px;
		background: var(--bg-card);
		border: 1px solid var(--bg-border);
		border-radius: var(--radius-lg);
		padding: clamp(1.5rem, 4vw, 2rem);
		text-align: left;
	}
	.nl-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.nl-field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.nl-label {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text-primary);
	}
	.nl-optional {
		font-weight: 400;
		color: var(--text-muted);
	}
	.nl-req {
		color: var(--accent);
	}
	.nl-input {
		width: 100%;
		background: var(--surface-soft);
		border: 1px solid var(--bg-border-strong);
		border-radius: var(--radius-sm);
		padding: 0.65rem 0.8rem;
		font-size: 0.95rem;
		color: var(--text-primary);
		font-family: var(--font-body);
		transition:
			border-color 0.18s,
			background 0.18s;
	}
	.nl-input:focus {
		outline: none;
		border-color: var(--accent);
		background: var(--accent-glow);
	}
	.nl-input::placeholder {
		color: var(--text-muted);
	}

	select.nl-input {
		cursor: pointer;
	}

	.nl-turnstile {
		margin-top: 0.1rem;
	}

	.nl-error {
		font-size: 0.85rem;
		color: var(--accent);
		margin: 0;
	}

	:global(.nl-submit) {
		width: 100% !important;
		justify-content: center !important;
		margin-top: 0.25rem;
	}
	.nl-fineprint {
		font-size: 0.78rem;
		color: var(--text-muted);
		text-align: center;
		margin: 0;
	}

	.nl-success {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.5rem;
		padding: 0.5rem 0;
	}
	.nl-success-icon {
		display: grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 999px;
		background: var(--accent);
		color: var(--button-ink);
		margin-bottom: 0.25rem;
	}
	.nl-success-title {
		font-family: var(--font-display);
		font-size: 1.5rem;
		letter-spacing: 0.02em;
		color: var(--text-primary);
		margin: 0;
	}
	.nl-success-body {
		font-size: 0.9rem;
		color: var(--text-secondary);
		margin: 0;
	}

	/* ── WHAT YOU GET ── */
	.nl-what {
		padding: var(--section-pad) 0;
		background: var(--bg-card);
		border-top: 1px solid var(--bg-border);
		border-bottom: 1px solid var(--bg-border);
	}
	.nl-what-hl {
		font-family: var(--font-display);
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		letter-spacing: 0.02em;
		color: var(--text-primary);
		text-align: center;
		margin: 0 0 2.5rem;
	}
	.nl-what-list {
		list-style: none;
		margin: 0 auto;
		padding: 0;
		max-width: 560px;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}
	.nl-what-item {
		display: flex;
		align-items: flex-start;
		gap: 0.85rem;
		font-size: 1rem;
		color: var(--text-primary);
		line-height: 1.55;
		font-weight: 300;
	}
	.nl-what-icon {
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
</style>
