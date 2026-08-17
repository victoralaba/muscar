<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import Turnstile from '$lib/components/Turnstile.svelte';
	import { IconMessage2, IconSend, IconCheck } from '@tabler/icons-svelte';

	let name = $state('');
	let email = $state('');
	let message = $state('');
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
		if (!message.trim()) {
			errorMsg = 'Please enter a message.';
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
	<title>Contact — Muscar</title>
	<meta name="description" content="Get in touch with Muscar." />
</svelte:head>

<section class="ct-hero" aria-labelledby="ct-hl">
	<div class="ct-bg-grid" aria-hidden="true"></div>
	<div class="ct-glow" aria-hidden="true"></div>

	<div class="ct-inner container">
		<div class="ct-badge-wrap">
			<Badge variant="outline" class="ct-badge">
				<IconMessage2 size={12} />
				Get in touch
			</Badge>
		</div>

		<h1 id="ct-hl" class="ct-headline">
			Say <span class="accent">something.</span>
		</h1>

		<p class="ct-sub">
			Question, correction, a tool we should look at, or just want to tell us we got something
			wrong? Send it over.
		</p>

		<div class="ct-card">
			{#if submitted}
				<div class="ct-success" role="status">
					<span class="ct-success-icon"><IconCheck size={22} /></span>
					<p class="ct-success-title">Sent.</p>
					<p class="ct-success-body">
						We read every message. We'll get back to you if it needs a reply.
					</p>
				</div>
			{:else}
				<form method="POST" action="?/send" use:enhance={handleSubmit} class="ct-form">
					<div class="ct-field">
						<label class="ct-label" for="ct-name"
							>Name <span class="ct-optional">(optional)</span></label
						>
						<input
							id="ct-name"
							name="name"
							type="text"
							class="ct-input"
							placeholder="Jane"
							bind:value={name}
							autocomplete="name"
						/>
					</div>
					<div class="ct-field">
						<label class="ct-label" for="ct-email">Email <span class="ct-req">*</span></label>
						<input
							id="ct-email"
							name="email"
							type="email"
							class="ct-input"
							placeholder="jane@yourbusiness.com"
							bind:value={email}
							autocomplete="email"
							inputmode="email"
							required
						/>
					</div>
					<div class="ct-field">
						<label class="ct-label" for="ct-message">Message <span class="ct-req">*</span></label>
						<textarea
							id="ct-message"
							name="message"
							class="ct-input ct-textarea"
							placeholder="What's on your mind?"
							bind:value={message}
							rows="5"
							required
						></textarea>
					</div>

					<div class="ct-turnstile">
						<Turnstile
							onVerify={(token) => (turnstileToken = token)}
							onExpire={() => (turnstileToken = '')}
						/>
					</div>

					{#if errorMsg}
						<p class="ct-error">{errorMsg}</p>
					{/if}

					<Button type="submit" size="lg" class="cta-primary ct-submit" disabled={submitting}>
						{submitting ? 'Sending…' : 'Send Message'}
						<IconSend size={15} />
					</Button>
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

	/* ── HERO ── */
	.ct-hero {
		position: relative;
		overflow: hidden;
	}
	.ct-bg-grid {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(var(--grid-line) 1px, transparent 1px),
			linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
		background-size: 60px 60px;
		mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
	}
	.ct-glow {
		position: absolute;
		top: -10%;
		left: 50%;
		transform: translateX(-50%);
		width: min(700px, 100vw);
		height: 500px;
		background: radial-gradient(ellipse at center top, var(--accent-glow) 0%, transparent 65%);
		pointer-events: none;
	}

	.ct-inner {
		position: relative;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: clamp(4.5rem, 10vw, 7rem) 0 clamp(3.5rem, 7vw, 5rem);
	}

	:global(.ct-badge) {
		border-color: var(--bg-border-strong) !important;
		color: var(--text-secondary) !important;
		background: var(--surface-soft) !important;
		display: flex !important;
		align-items: center !important;
		gap: 0.35rem !important;
		font-size: 0.78rem !important;
		letter-spacing: 0.02em !important;
	}
	.ct-badge-wrap {
		margin-bottom: 1.5rem;
	}

	.ct-headline {
		font-family: var(--font-display);
		font-size: clamp(2.4rem, 6vw, 4rem);
		line-height: 1;
		letter-spacing: 0.02em;
		color: var(--text-primary);
		margin: 0;
	}
	.ct-sub {
		font-size: clamp(1rem, 2vw, 1.1rem);
		color: var(--text-secondary);
		line-height: 1.65;
		max-width: 480px;
		margin: 1.1rem 0 0;
		font-weight: 300;
	}

	/* ── FORM CARD ── */
	.ct-card {
		margin-top: 2.5rem;
		width: 100%;
		max-width: 460px;
		background: var(--bg-card);
		border: 1px solid var(--bg-border);
		border-radius: var(--radius-lg);
		padding: clamp(1.5rem, 4vw, 2rem);
		text-align: left;
	}
	.ct-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.ct-field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.ct-label {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text-primary);
	}
	.ct-optional {
		font-weight: 400;
		color: var(--text-muted);
	}
	.ct-req {
		color: var(--accent);
	}
	.ct-input {
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
	.ct-input:focus {
		outline: none;
		border-color: var(--accent);
		background: var(--accent-glow);
	}
	.ct-input::placeholder {
		color: var(--text-muted);
	}
	.ct-textarea {
		resize: vertical;
		min-height: 6rem;
		font-family: var(--font-body);
	}

	.ct-turnstile {
		margin-top: 0.1rem;
	}

	.ct-error {
		font-size: 0.85rem;
		color: var(--accent);
		margin: 0;
	}

	:global(.ct-submit) {
		width: 100% !important;
		justify-content: center !important;
		margin-top: 0.25rem;
	}

	.ct-success {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.5rem;
		padding: 0.5rem 0;
	}
	.ct-success-icon {
		display: grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 999px;
		background: var(--accent);
		color: var(--button-ink);
		margin-bottom: 0.25rem;
	}
	.ct-success-title {
		font-family: var(--font-display);
		font-size: 1.5rem;
		letter-spacing: 0.02em;
		color: var(--text-primary);
		margin: 0;
	}
	.ct-success-body {
		font-size: 0.9rem;
		color: var(--text-secondary);
		margin: 0;
	}
</style>
