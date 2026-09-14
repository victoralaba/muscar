<script lang="ts">
	interface Phase {
		label: string;
		weeks?: string;
		title: string;
		body: string;
		items?: string[];
	}

	interface Props {
		phases: Phase[];
	}

	let { phases }: Props = $props();
</script>

<ol class="timeline">
	{#each phases as phase, i (phase.title)}
		<li class="timeline-item">
			<div class="timeline-marker" aria-hidden="true">
				<span class="timeline-dot"></span>
				{#if i < phases.length - 1}
					<span class="timeline-line"></span>
				{/if}
			</div>
			<div class="timeline-content">
				<div class="timeline-head">
					<span class="timeline-tag">{phase.label}</span>
					{#if phase.weeks}
						<span class="timeline-weeks">{phase.weeks}</span>
					{/if}
				</div>
				<h4 class="timeline-title">{phase.title}</h4>
				<p class="timeline-body">{phase.body}</p>
				{#if phase.items}
					<ul class="timeline-items">
						{#each phase.items as it (it)}
							<li>{it}</li>
						{/each}
					</ul>
				{/if}
			</div>
		</li>
	{/each}
</ol>

<style>
	.timeline {
		list-style: none;
		padding: 0;
		margin: clamp(1.5rem, 4vw, 2.5rem) 0;
		display: flex;
		flex-direction: column;
	}
	.timeline-item {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1.25rem;
		padding-bottom: clamp(1.75rem, 4vw, 2.5rem);
	}
	.timeline-marker {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding-top: 0.35rem;
	}
	.timeline-dot {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 0 4px var(--accent-glow);
		flex-shrink: 0;
	}
	.timeline-line {
		flex: 1;
		width: 1px;
		background: var(--bg-border);
		min-height: 2rem;
	}
	.timeline-content {
		padding-bottom: 0.25rem;
	}
	.timeline-head {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.35rem;
	}
	.timeline-tag {
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--accent);
		font-weight: 700;
	}
	.timeline-weeks {
		font-size: 0.72rem;
		color: var(--text-muted);
		letter-spacing: 0.06em;
	}
	.timeline-title {
		font-family: var(--font-display);
		font-size: clamp(1.3rem, 2.4vw, 1.65rem);
		letter-spacing: 0.03em;
		color: var(--text-primary);
		margin: 0 0 0.5rem;
	}
	.timeline-body {
		font-size: 0.95rem;
		color: var(--text-secondary);
		line-height: 1.65;
		margin: 0;
		font-weight: 300;
	}
	.timeline-items {
		list-style: none;
		padding: 0;
		margin: 0.85rem 0 0;
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}
	.timeline-items li {
		font-size: 0.9rem;
		color: var(--text-secondary);
		line-height: 1.55;
		padding-left: 1.1rem;
		position: relative;
		font-weight: 300;
	}
	.timeline-items li::before {
		content: '';
		position: absolute;
		top: 0.55rem;
		left: 0;
		width: 6px;
		height: 1px;
		background: var(--accent);
	}
</style>
