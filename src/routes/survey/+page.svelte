<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Drawer from '$lib/components/survey/Drawer.svelte';
	import QuestionField from '$lib/components/survey/QuestionField.svelte';
	import { surveySections, TOTAL_STEPS } from '$lib/survey/schema';
	import { loadSurveyState, saveSurveyState, clearSurveyState } from '$lib/survey/storage';
	import {
		IconArrowRight,
		IconArrowLeft,
		IconClipboardCheck,
		IconMailCheck,
		IconLock
	} from '@tabler/icons-svelte';

	const CONTACT_STEP = surveySections.length; // last step, 0-indexed

	let hydrated = $state(false);
	let hasSavedProgress = $state(false);

	let drawerOpen = $state(false);
	let step = $state(0);

	let answers = $state<Record<string, unknown>>({});
	let otherValues = $state<Record<string, string>>({});

	let name = $state('');
	let email = $state('');
	let wantsReports = $state(false);

	let submitting = $state(false);
	let submitted = $state(false);
	let contactError = $state('');
	let serverError = $state('');

	let formEl: HTMLFormElement;

	onMount(() => {
		const cached = loadSurveyState();
		if (cached) {
			step = cached.step;
			answers = cached.answers;
			otherValues = cached.otherValues;
			name = cached.name;
			email = cached.email;
			wantsReports = cached.wantsReports;
			hasSavedProgress = true;
		}
		hydrated = true;
	});

	// Debounced autosave — fires on any change to progress, skipped until the
	// initial cache read above has happened so we don't immediately overwrite
	// a saved session with empty defaults.
	let saveTimer: ReturnType<typeof setTimeout>;
	$effect(() => {
		// touch every persisted field so the effect re-runs on change
		const snapshot = { step, answers, otherValues, name, email, wantsReports };
		if (!hydrated || submitted) return;
		clearTimeout(saveTimer);
		saveTimer = setTimeout(() => saveSurveyState(snapshot), 300);
	});

	const currentSection = $derived(step < CONTACT_STEP ? surveySections[step] : null);
	const progressPct = $derived(Math.round(((step + 1) / TOTAL_STEPS) * 100));

	function startSurvey(fromScratch = false) {
		if (fromScratch) {
			step = 0;
			answers = {};
			otherValues = {};
			name = '';
			email = '';
			wantsReports = false;
			clearSurveyState();
			hasSavedProgress = false;
		}
		serverError = '';
		drawerOpen = true;
	}

	function goBack() {
		if (step > 0) step -= 1;
	}

	function goNext() {
		if (step < CONTACT_STEP) {
			step += 1;
		}
	}

	function isValidEmail(v: string) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
	}

	function attemptSubmit() {
		contactError = '';
		serverError = '';
		if (!name.trim()) {
			contactError = 'Please tell us your name.';
			return;
		}
		if (!isValidEmail(email)) {
			contactError = 'Please enter a valid, active email address — that\u2019s where findings go.';
			return;
		}
		submitting = true;
		formEl.requestSubmit();
	}

	function handleSubmit() {
		return async ({ result, update }: { result: ActionResult; update: (opts?: { reset?: boolean }) => Promise<void> }) => {
			submitting = false;
			if (result.type === 'success') {
				submitted = true;
				clearSurveyState();
			} else if (result.type === 'failure') {
				serverError =
					(result.data?.error as string) ??
					"Something went wrong on our end — your answers are still here, try again in a moment.";
			} else if (result.type === 'error') {
				serverError = 'Network hiccup — your answers are still here, try again in a moment.';
			}
			await update({ reset: false });
		};
	}

	function closeAfterSubmit() {
		drawerOpen = false;
		submitted = false;
		step = 0;
		answers = {};
		otherValues = {};
		name = '';
		email = '';
		wantsReports = false;
	}

	const payloadJson = $derived(
		JSON.stringify({
			name,
			email,
			wantsReports,
			answers,
			otherValues
		})
	);
</script>

<svelte:head>
	<title>Take the Survey — Muscar</title>
	<meta
		name="description"
		content="Five minutes on where you actually stand on AI in the trades. No wrong answers."
	/>
</svelte:head>

<section class="survey-landing" aria-labelledby="survey-hl">
	<div class="survey-landing-inner container">
		<span class="survey-eyebrow">
			<IconClipboardCheck size={14} />
			Takes about 5 minutes
		</span>
		<h1 id="survey-hl" class="survey-headline">
			Where Do You Actually<br /><span class="accent">Stand on AI?</span>
		</h1>
		<p class="survey-sub">
			No wrong answers — we're just trying to figure out who's out here. Answer honestly, tell us
			where to send what we find, and that's it.
		</p>

		<div class="survey-actions">
			{#if hasSavedProgress && !submitted}
				<Button variant="default" class="cta-primary" onclick={() => startSurvey(false)}>
					Continue where you left off
					<IconArrowRight size={16} />
				</Button>
				<button type="button" class="survey-restart" onclick={() => startSurvey(true)}>
					Start over instead
				</button>
			{:else}
				<Button variant="default" class="cta-primary" onclick={() => startSurvey(true)}>
					Start the survey
					<IconArrowRight size={16} />
				</Button>
			{/if}
		</div>

		<p class="survey-privacy">
			<IconLock size={13} />
			Your answers save on this device as you go, so a closed tab won't lose your progress.
		</p>
	</div>
</section>

<!-- Hidden form: state lives in component memory, this just ships the final
     payload to the server action without a full page reload. -->
<form
	method="POST"
	action="?/submit"
	bind:this={formEl}
	use:enhance={handleSubmit}
	class="visually-hidden-form"
>
	<input type="hidden" name="payload" value={payloadJson} />
</form>

<Drawer
	bind:open={drawerOpen}
	dismissible={!submitting}
	title={submitted ? "You're in." : (currentSection?.title ?? 'Almost done — Your Info')}
	description={submitted
		? undefined
		: `Step ${step + 1} of ${TOTAL_STEPS}${currentSection?.description ? ' — ' + currentSection.description : ''}`}
>

		{#if submitted}
			<div class="survey-thanks">
				<IconMailCheck size={40} class="survey-thanks-icon" />
				<p class="survey-thanks-title">Thanks — that's genuinely useful.</p>
				<p class="survey-thanks-body">
					{#if wantsReports}
						We'll send the findings to <strong>{email}</strong> once the report's ready.
					{:else}
						We've got your answers. If you change your mind about the report, the newsletter's
						always open.
					{/if}
				</p>
			</div>
		{:else if currentSection}
			<div class="survey-progress-track" aria-hidden="true">
				<div class="survey-progress-fill" style={`width: ${progressPct}%`}></div>
			</div>

			{#each currentSection.questions as q (q.id)}
				<QuestionField
					question={q}
					bind:value={answers[q.id]}
					bind:otherValue={otherValues[q.id]}
				/>
			{/each}
		{:else}
			<div class="survey-progress-track" aria-hidden="true">
				<div class="survey-progress-fill" style={`width: ${progressPct}%`}></div>
			</div>

			<div class="contact-step">
				<div class="q-field">
					<label class="q-label" for="survey-name">Your name <span class="q-req">*</span></label>
					<input
						id="survey-name"
						type="text"
						class="q-text-input"
						placeholder="Jane Okafor"
						bind:value={name}
						autocomplete="name"
					/>
				</div>
				<div class="q-field">
					<label class="q-label" for="survey-email">Active email <span class="q-req">*</span></label>
					<p class="q-helper">Make sure your email is active — this is where the findings go.</p>
					<input
						id="survey-email"
						type="email"
						class="q-text-input"
						placeholder="jane@yourbusiness.com"
						bind:value={email}
						autocomplete="email"
						inputmode="email"
					/>
				</div>
				<label class="consent-row">
					<input type="checkbox" bind:checked={wantsReports} />
					<span>Send me the report when the survey findings are ready.</span>
				</label>

				{#if contactError}
					<p class="survey-error">{contactError}</p>
				{/if}
				{#if serverError}
					<p class="survey-error">{serverError}</p>
				{/if}
			</div>
		{/if}


	{#snippet footer()}
		{#if submitted}
			<div class="drawer-footer-row single">
				<Button variant="default" class="cta-primary" onclick={closeAfterSubmit}>Done</Button>
			</div>
		{:else}
			<div class="drawer-footer-row">
				<Button variant="outline" class="cta-secondary" onclick={goBack} disabled={step === 0}>
					<IconArrowLeft size={15} />
					Back
				</Button>

				{#if step < CONTACT_STEP}
					<Button variant="default" class="cta-primary" onclick={goNext}>
						Next
						<IconArrowRight size={15} />
					</Button>
				{:else}
					<Button variant="default" class="cta-primary" onclick={attemptSubmit} disabled={submitting}>
						{submitting ? 'Submitting…' : 'Submit'}
						{#if !submitting}<IconArrowRight size={15} />{/if}
					</Button>
				{/if}
			</div>
		{/if}
	{/snippet}
</Drawer>

<style>
	.container {
		max-width: var(--max-w);
		margin: 0 auto;
		padding: 0 clamp(1.25rem, 5vw, 2.5rem);
	}

	.survey-landing {
		padding: clamp(4.5rem, 12vw, 8rem) 0;
		text-align: center;
	}
	.survey-landing-inner {
		max-width: 620px;
		margin: 0 auto;
	}
	.survey-eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent);
		background: var(--accent-glow);
		border: 1px solid var(--accent-glow-strong);
		border-radius: 999px;
		padding: 0.4rem 0.85rem;
		margin-bottom: 1.5rem;
	}
	.survey-headline {
		font-family: var(--font-display);
		font-size: clamp(2.4rem, 6vw, 4rem);
		line-height: 1.02;
		letter-spacing: 0.02em;
		color: var(--text-primary);
		margin: 0 0 1.25rem;
	}
	.survey-headline .accent {
		color: var(--accent);
	}
	.survey-sub {
		font-size: clamp(1rem, 2vw, 1.1rem);
		color: var(--text-secondary);
		line-height: 1.65;
		font-weight: 300;
		margin: 0 auto 2rem;
		max-width: 480px;
	}
	.survey-actions {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}
	:global(.cta-primary) {
		background: var(--accent) !important;
		color: var(--button-ink) !important;
		border-color: var(--accent) !important;
		font-weight: 600 !important;
		display: flex !important;
		align-items: center !important;
		gap: 0.4rem !important;
		border-radius: var(--radius-md) !important;
	}
	:global(.cta-primary:hover) {
		background: var(--accent-dim) !important;
		border-color: var(--accent-dim) !important;
	}
	:global(.cta-secondary) {
		background: transparent !important;
		color: var(--text-primary) !important;
		border-color: var(--bg-border-strong) !important;
		font-weight: 600 !important;
		display: flex !important;
		align-items: center !important;
		gap: 0.35rem !important;
		border-radius: var(--radius-md) !important;
	}
	.survey-restart {
		background: none;
		border: none;
		color: var(--text-muted);
		font-size: 0.82rem;
		text-decoration: underline;
		text-underline-offset: 2px;
		cursor: pointer;
	}
	.survey-restart:hover {
		color: var(--text-primary);
	}
	.survey-privacy {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		font-size: 0.78rem;
		color: var(--text-muted);
		margin: 1.5rem 0 0;
	}

	.visually-hidden-form {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}

	.survey-progress-track {
		height: 4px;
		border-radius: 999px;
		background: var(--bg-border);
		overflow: hidden;
		margin-bottom: 1.75rem;
	}
	.survey-progress-fill {
		height: 100%;
		background: var(--accent);
		border-radius: 999px;
		transition: width 0.25s ease;
	}

	.contact-step .q-field {
		margin-bottom: 1.25rem;
	}
	.q-label {
		display: block;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.35rem;
	}
	.q-req {
		color: var(--accent);
	}
	.q-helper {
		font-size: 0.8rem;
		color: var(--text-muted);
		margin: 0 0 0.5rem;
	}
	.q-text-input {
		width: 100%;
		border: 1px solid var(--bg-border);
		border-radius: 10px;
		background: var(--bg);
		color: var(--text-primary);
		padding: 0.65rem 0.85rem;
		font-size: 0.92rem;
		font-family: inherit;
	}
	.q-text-input:focus {
		outline: none;
		border-color: var(--accent);
	}
	.consent-row {
		display: flex;
		align-items: flex-start;
		gap: 0.6rem;
		font-size: 0.88rem;
		color: var(--text-secondary);
		cursor: pointer;
		padding: 0.65rem 0.1rem;
	}
	.consent-row input {
		accent-color: var(--accent);
		width: 1.05rem;
		height: 1.05rem;
		margin-top: 0.15rem;
		flex-shrink: 0;
	}
	.survey-error {
		font-size: 0.85rem;
		color: var(--accent-dim);
		margin: 0.75rem 0 0;
	}

	.drawer-footer-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}
	.drawer-footer-row.single {
		justify-content: center;
	}

	.survey-thanks {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.75rem;
		padding: 1.5rem 0.5rem 1rem;
	}
	:global(.survey-thanks-icon) {
		color: var(--accent) !important;
	}
	.survey-thanks-title {
		font-family: var(--font-display);
		font-size: 1.5rem;
		letter-spacing: 0.02em;
		color: var(--text-primary);
		margin: 0;
	}
	.survey-thanks-body {
		font-size: 0.92rem;
		color: var(--text-secondary);
		line-height: 1.6;
		margin: 0;
		max-width: 400px;
	}
</style>
