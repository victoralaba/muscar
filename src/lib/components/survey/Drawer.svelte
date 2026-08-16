<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { IconX } from '@tabler/icons-svelte';
	import type { Snippet } from 'svelte';

	let {
		open = $bindable(false),
		title,
		description,
		onClose,
		children,
		footer,
		dismissible = true
	}: {
		open?: boolean;
		title: string;
		description?: string;
		onClose?: () => void;
		children: Snippet;
		footer?: Snippet;
		/** Set false while submitting so an accidental Esc/overlay click can't drop the answers. */
		dismissible?: boolean;
	} = $props();

	function handleOpenChange(next: boolean) {
		if (!next && !dismissible) return;
		open = next;
		if (!next) onClose?.();
	}
</script>

<Dialog.Root open={open} onOpenChange={handleOpenChange}>
	<Dialog.Portal>
		<Dialog.Overlay class="survey-drawer-overlay" />
		<Dialog.Content class="survey-drawer-content">
			<div class="survey-drawer-handle" aria-hidden="true"></div>
			<div class="survey-drawer-header">
				<div class="survey-drawer-heading">
					<Dialog.Title class="survey-drawer-title">{title}</Dialog.Title>
					{#if description}
						<Dialog.Description class="survey-drawer-desc">{description}</Dialog.Description>
					{/if}
				</div>
				{#if dismissible}
					<Dialog.Close class="survey-drawer-close" aria-label="Close survey">
						<IconX size={18} />
					</Dialog.Close>
				{/if}
			</div>

			<div class="survey-drawer-body">
				{@render children()}
			</div>

			{#if footer}
				<div class="survey-drawer-footer">
					{@render footer()}
				</div>
			{/if}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
	:global(.survey-drawer-overlay) {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.55);
		backdrop-filter: blur(2px);
		z-index: 200;
		animation: survey-drawer-fade 0.2s ease;
	}

	:global(.survey-drawer-content) {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 201;
		width: 100%;
		max-width: 640px;
		margin: 0 auto;
		max-height: min(88vh, 820px);
		display: flex;
		flex-direction: column;
		background: var(--bg-card);
		border: 1px solid var(--bg-border);
		border-bottom: none;
		border-radius: 20px 20px 0 0;
		box-shadow: 0 -20px 60px rgba(0, 0, 0, 0.35);
		animation: survey-drawer-up-mobile 0.28s cubic-bezier(0.32, 0.72, 0, 1);
		outline: none;
	}

	@media (min-width: 640px) {
		:global(.survey-drawer-content) {
			left: 50%;
			right: auto;
			bottom: 2rem;
			transform: translateX(-50%);
			border-radius: 20px;
			border-bottom: 1px solid var(--bg-border);
			max-height: min(84vh, 760px);
			animation-name: survey-drawer-up-desktop;
		}
	}

	.survey-drawer-handle {
		width: 36px;
		height: 4px;
		border-radius: 999px;
		background: var(--bg-border-strong);
		margin: 0.75rem auto 0;
		flex-shrink: 0;
	}
	@media (min-width: 640px) {
		.survey-drawer-handle {
			display: none;
		}
	}

	.survey-drawer-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.5rem 1rem;
		flex-shrink: 0;
		border-bottom: 1px solid var(--bg-border);
	}
	.survey-drawer-heading {
		min-width: 0;
	}
	:global(.survey-drawer-title) {
		display: block;
		font-family: var(--font-display);
		font-size: 1.35rem;
		letter-spacing: 0.03em;
		color: var(--text-primary);
		margin: 0 0 0.15rem;
	}
	:global(.survey-drawer-desc) {
		display: block;
		font-size: 0.82rem;
		color: var(--text-secondary);
		margin: 0;
	}
	:global(.survey-drawer-close) {
		flex-shrink: 0;
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
		background: var(--surface-soft);
		color: var(--text-secondary);
		border: none;
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s;
	}
	:global(.survey-drawer-close:hover) {
		background: var(--surface-hover);
		color: var(--text-primary);
	}

	.survey-drawer-body {
		flex: 1;
		overflow-y: auto;
		padding: 1.5rem;
	}

	.survey-drawer-footer {
		flex-shrink: 0;
		border-top: 1px solid var(--bg-border);
		padding: 1rem 1.5rem;
		background: var(--bg-card);
	}

	@keyframes survey-drawer-up-mobile {
		from {
			transform: translateY(100%);
		}
		to {
			transform: translateY(0);
		}
	}
	@keyframes survey-drawer-up-desktop {
		from {
			transform: translate(-50%, 40px);
			opacity: 0;
		}
		to {
			transform: translate(-50%, 0);
			opacity: 1;
		}
	}
	@keyframes survey-drawer-fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
