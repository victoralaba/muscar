<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { trackEvent } from '$lib/client/analytics';
	import { Button } from '$lib/components/ui/button/index.js';
	import Turnstile from '$lib/components/Turnstile.svelte';
	import { IconMailOff, IconCheck, IconArrowLeft } from '@tabler/icons-svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	function isValidEmail(v: string) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
	}

	let email = $state(data.email);
	let token = data.token;
	// If we arrived with a valid ?token= param that resolved to a real
	// subscriber, skip straight to the confirmation step instead of making
	// the person retype their email.
	let stage: 'form' | 'confirm' | 'success' = $state(data.token ? 'confirm' : 'form');
	let submitting = $state(false);
	let errorMsg = $state('');
	// Only the manual (no-token) path needs this — someone arriving via a
	// real unsubscribe link already carries proof of identity in the token.
	let turnstileToken = $state('');

	function goToConfirm() {
		errorMsg = '';
		if (!isValidEmail(email)) {
			errorMsg = 'Please enter a valid email address.';
			return;
		}
		if (!turnstileToken) {
			errorMsg = 'Please complete the verification check below.';
			return;
		}
		stage = 'confirm';
	}

	function handleSubmit() {
		errorMsg = '';
		submitting = true;
		return async ({ result }: { result: ActionResult }) => {
			submitting = false;
			if (result.type === 'success') {
				stage = 'success';
				trackEvent('newsletter_unsubscribe', {});
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
	<title>Unsubscribe — Muscar</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="un-hero" aria-labelledby="un-hl">
	<div class="un-bg-grid" aria-hidden="true"></div>

	<div class="un-inner container">
		<h1 id="un-hl" class="un-headline">Unsubscribe</h1>
		<p class="un-sub">No hard feelings. One click and you're off the list.</p>

		<div class="un-card">
			{#if stage === 'success'}
				<div class="un-success" role="status">
					<span class="un-success-icon"><IconCheck size={22} /></span>
					<p class="un-success-title">You're unsubscribed.</p>
					<p class="un-success-body">
						{email} won't get any more email from us. This can take a few minutes to fully
						process on our end.
					</p>
					<Button href="/" variant="outline" class="un-home">
						<IconArrowLeft size={15} />
						Back to homepage
					</Button>
				</div>
			{:else if stage === 'confirm'}
				<div class="un-confirm">
					<span class="un-confirm-icon"><IconMailOff size={20} /></span>
					<p class="un-confirm-title">Unsubscribe this address?</p>
					<p class="un-confirm-email">{email}</p>
					<p class="un-confirm-body">You'll stop getting the newsletter and any updates from us.</p>

					<form
						method="POST"
						action="?/unsubscribe"
						use:enhance={handleSubmit}
						class="un-confirm-actions"
					>
						<input type="hidden" name="token" value={token} />
						<input type="hidden" name="email" value={email} />
						<input type="hidden" name="cf-turnstile-response" value={turnstileToken} />
						{#if errorMsg}
							<p class="un-error">{errorMsg}</p>
						{/if}
						<Button type="submit" size="lg" class="cta-primary un-yes" disabled={submitting}>
							{submitting ? 'Unsubscribing…' : 'Yes, unsubscribe me'}
						</Button>
						<Button
							type="button"
							variant="outline"
							size="lg"
							class="un-no"
							disabled={submitting}
							href="/"
						>
							No, keep me on the list
						</Button>
					</form>
				</div>
			{:else}
				<form
					class="un-form"
					onsubmit={(e) => {
						e.preventDefault();
						goToConfirm();
					}}
				>
					<div class="un-field">
						<label class="un-label" for="un-email">Email</label>
						<input
							id="un-email"
							name="email"
							type="email"
							class="un-input"
							placeholder="jane@yourbusiness.com"
							bind:value={email}
							autocomplete="email"
							inputmode="email"
							required
						/>
					</div>
					<div class="un-turnstile">
						<Turnstile
							onVerify={(t) => (turnstileToken = t)}
							onExpire={() => (turnstileToken = '')}
						/>
					</div>
					{#if errorMsg}
						<p class="un-error">{errorMsg}</p>
					{/if}
					<Button type="submit" size="lg" class="cta-primary un-submit">Unsubscribe</Button>
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

	.un-hero {
		position: relative;
		overflow: hidden;
	}
	.un-bg-grid {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(var(--grid-line) 1px, transparent 1px),
			linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
		background-size: 60px 60px;
		mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
	}

	.un-inner {
		position: relative;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: clamp(4.5rem, 10vw, 7rem) 0 clamp(3.5rem, 7vw, 5rem);
	}

	.un-headline {
		font-family: var(--font-display);
		font-size: clamp(2.2rem, 5vw, 3.2rem);
		line-height: 1;
		letter-spacing: 0.02em;
		color: var(--text-primary);
		margin: 0;
	}
	.un-sub {
		font-size: clamp(0.95rem, 2vw, 1.05rem);
		color: var(--text-secondary);
		line-height: 1.6;
		max-width: 420px;
		margin: 1rem 0 0;
		font-weight: 300;
	}

	.un-card {
		margin-top: 2.5rem;
		width: 100%;
		max-width: 420px;
		background: var(--bg-card);
		border: 1px solid var(--bg-border);
		border-radius: var(--radius-lg);
		padding: clamp(1.5rem, 4vw, 2rem);
		text-align: left;
	}

	/* ── EMAIL FORM ── */
	.un-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.un-field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.un-label {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text-primary);
	}
	.un-input {
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
	.un-input:focus {
		outline: none;
		border-color: var(--accent);
		background: var(--accent-glow);
	}
	.un-input::placeholder {
		color: var(--text-muted);
	}
	:global(.un-submit) {
		width: 100% !important;
		justify-content: center !important;
	}

	.un-turnstile {
		margin-top: 0.1rem;
	}

	.un-error {
		font-size: 0.85rem;
		color: var(--accent);
		margin: 0;
	}

	/* ── CONFIRM STEP ── */
	.un-confirm {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.35rem;
	}
	.un-confirm-icon {
		display: grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 999px;
		background: var(--surface-soft);
		color: var(--accent);
		margin-bottom: 0.5rem;
	}
	.un-confirm-title {
		font-family: var(--font-display);
		font-size: 1.3rem;
		letter-spacing: 0.02em;
		color: var(--text-primary);
		margin: 0;
	}
	.un-confirm-email {
		font-size: 0.92rem;
		font-weight: 600;
		color: var(--accent);
		word-break: break-all;
		margin: 0.15rem 0 0;
	}
	.un-confirm-body {
		font-size: 0.88rem;
		color: var(--text-secondary);
		margin: 0.4rem 0 0;
	}
	.un-confirm-actions {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		width: 100%;
		margin-top: 1.5rem;
	}
	:global(.un-yes) {
		width: 100% !important;
		justify-content: center !important;
	}
	:global(.un-no) {
		width: 100% !important;
		justify-content: center !important;
	}

	/* ── SUCCESS ── */
	.un-success {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.5rem;
		padding: 0.5rem 0;
	}
	.un-success-icon {
		display: grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 999px;
		background: var(--accent);
		color: var(--button-ink);
		margin-bottom: 0.25rem;
	}
	.un-success-title {
		font-family: var(--font-display);
		font-size: 1.5rem;
		letter-spacing: 0.02em;
		color: var(--text-primary);
		margin: 0;
	}
	.un-success-body {
		font-size: 0.9rem;
		color: var(--text-secondary);
		margin: 0;
	}
	:global(.un-home) {
		margin-top: 1rem !important;
	}
</style>
