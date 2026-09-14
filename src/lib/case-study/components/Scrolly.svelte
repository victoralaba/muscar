<script lang="ts">
	import { onMount, onDestroy, type Snippet } from 'svelte';
	import scrollama from 'scrollama';

	type DecimalType = 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;

	interface Beat {
		title?: string;
		body: string;
	}

	interface Props {
		beats: Beat[];
		visual: Snippet<[{ index: number }]>;
		offset?: DecimalType;
	}

	let { beats, visual, offset = 0.5 }: Props = $props();

	let container: HTMLDivElement | null = $state(null);
	let currentIndex = $state(0);
	let scroller: ReturnType<typeof scrollama> | null = null;
	let reducedMotion = $state(false);

	onMount(() => {
		if (typeof window === 'undefined') return;

		reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		scroller = scrollama();
		scroller
			.setup({
				step: '[data-scrolly-step]',
				offset,
				debug: false
			})
			.onStepEnter(({ index }: { index: number }) => {
				currentIndex = index;
			});

		const handleResize = () => scroller?.resize();
		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	});

	onDestroy(() => {
		scroller?.destroy();
	});
</script>

<div class="scrolly" bind:this={container}>
	<div class="scrolly-sticky" aria-hidden={reducedMotion ? undefined : 'true'}>
		<div class="scrolly-visual">
			{@render visual({ index: currentIndex })}
		</div>
	</div>

	<div class="scrolly-steps">
		{#each beats as beat, i (i)}
			<div class="scrolly-step" class:active={i === currentIndex} data-scrolly-step data-index={i}>
				{#if beat.title}
					<p class="scrolly-step-title">{beat.title}</p>
				{/if}
				<p class="scrolly-step-body">{beat.body}</p>
			</div>
		{/each}
	</div>
</div>

<style>
	/*
	 * Editorial break-out: the Scrolly is typically embedded in a narrow
	 * prose column, but the two-column pinned pattern needs more room.
	 * These rules widen the block to a viewport-relative width and center
	 * it against the viewport, so we can keep prose narrow while the
	 * scrollytelling gets space to breathe.
	 */
	.scrolly {
		position: relative;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(1.5rem, 4vw, 3rem);
		margin-block: clamp(2rem, 5vw, 3.5rem);
		width: min(1080px, calc(100vw - 2rem));
		margin-inline: auto;
		margin-left: 50%;
		transform: translateX(-50%);
	}
	.scrolly-sticky {
		position: sticky;
		top: 5rem;
		align-self: start;
		height: min(70vh, 480px);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.scrolly-visual {
		width: 100%;
		height: 100%;
		background: var(--bg-card);
		border: 1px solid var(--bg-border);
		border-radius: var(--radius-lg);
		padding: clamp(1rem, 2.5vw, 1.75rem);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
	.scrolly-steps {
		display: flex;
		flex-direction: column;
		gap: clamp(6rem, 12vw, 10rem);
		padding: 3rem 0 6rem;
	}
	.scrolly-step {
		padding: clamp(1rem, 2.5vw, 1.5rem);
		border-left: 2px solid var(--bg-border);
		opacity: 0.45;
		transition:
			opacity 0.35s ease,
			border-color 0.35s ease;
	}
	.scrolly-step.active {
		opacity: 1;
		border-left-color: var(--accent);
	}
	.scrolly-step-title {
		font-family: var(--font-display);
		font-size: clamp(1.15rem, 2vw, 1.4rem);
		letter-spacing: 0.04em;
		color: var(--accent);
		margin: 0 0 0.5rem;
	}
	.scrolly-step-body {
		font-size: 0.98rem;
		color: var(--text-primary);
		line-height: 1.65;
		margin: 0;
		font-weight: 300;
	}

	@media (max-width: 800px) {
		.scrolly {
			grid-template-columns: 1fr;
			width: min(720px, calc(100vw - 2rem));
		}
		.scrolly-sticky {
			/* On mobile the sticky still sticks (as a pinned band above the
			 * beats) so viewers see the visual change as they scroll each
			 * step, rather than losing it above the fold. */
			top: 4.5rem;
			height: clamp(240px, 45vh, 320px);
		}
		.scrolly-steps {
			gap: 2rem;
			padding: 1rem 0 2rem;
		}
	}
</style>
