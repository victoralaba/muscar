<script lang="ts">
	// A small stateful workflow board used as the sticky visual in the Scrolly.
	// Each of the shop's five workflow areas moves through four states as the
	// engagement advances:
	//   0 = manual (before touching anything)
	//   1 = digitalized
	//   2 = automated
	//   3 = AI-assisted (only where AI actually earned its place)
	//
	// The `step` prop drives the whole board; the mapping below encodes the
	// order the engagement changes each area. That mapping is content, not
	// framework, so the illustrative case can tell its own truthful arc.

	interface Props {
		step: number;
	}

	let { step }: Props = $props();

	const areas = [
		{ id: 'calls', label: 'Incoming calls', icon: '☎' },
		{ id: 'schedule', label: 'Scheduling', icon: '▦' },
		{ id: 'quotes', label: 'Quoting', icon: '✎' },
		{ id: 'invoice', label: 'Invoicing', icon: '$' },
		{ id: 'follow_up', label: 'Follow-ups', icon: '↺' }
	];

	// Rows are steps, columns are areas. Values match the state enum above.
	const stateByStep: Record<string, number>[] = [
		{ calls: 0, schedule: 0, quotes: 0, invoice: 0, follow_up: 0 },
		{ calls: 0, schedule: 1, quotes: 1, invoice: 1, follow_up: 0 },
		{ calls: 2, schedule: 1, quotes: 1, invoice: 2, follow_up: 2 },
		{ calls: 3, schedule: 1, quotes: 3, invoice: 2, follow_up: 2 },
		{ calls: 3, schedule: 1, quotes: 3, invoice: 2, follow_up: 2 }
	];

	const stateLabels = ['On paper', 'Digitalized', 'Automated', 'AI-assisted'];

	function stateAt(areaId: string, s: number): number {
		const clamped = Math.max(0, Math.min(stateByStep.length - 1, s));
		return stateByStep[clamped][areaId] ?? 0;
	}
</script>

<div class="shop-map">
	<div class="shop-map-head">
		<span class="shop-map-title">Halden HVAC · workflow board</span>
		<span class="shop-map-step"
			>Step {Math.min(step + 1, stateByStep.length)} / {stateByStep.length}</span
		>
	</div>

	<ul class="shop-map-list">
		{#each areas as area (area.id)}
			{@const s = stateAt(area.id, step)}
			<li class="shop-map-row" data-state={s}>
				<span class="shop-map-icon" aria-hidden="true">{area.icon}</span>
				<span class="shop-map-label">{area.label}</span>
				<span class="shop-map-state">
					<span class="shop-map-dot" data-state={s} aria-hidden="true"></span>
					{stateLabels[s]}
				</span>
			</li>
		{/each}
	</ul>

	<div class="shop-map-legend" aria-hidden="true">
		{#each stateLabels as label, i (label)}
			<span class="shop-map-legend-item">
				<span class="shop-map-dot" data-state={i}></span>
				{label}
			</span>
		{/each}
	</div>
</div>

<style>
	.shop-map {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.shop-map-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--bg-border);
	}
	.shop-map-title {
		font-size: 0.78rem;
		color: var(--accent);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-weight: 700;
	}
	.shop-map-step {
		font-size: 0.75rem;
		color: var(--text-muted);
		letter-spacing: 0.04em;
	}
	.shop-map-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		flex: 1;
		justify-content: center;
	}
	.shop-map-row {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 0.85rem;
		padding: 0.65rem 0.85rem;
		border-radius: var(--radius-sm);
		border: 1px solid var(--bg-border);
		background: var(--surface-soft);
		transition:
			background 0.4s ease,
			border-color 0.4s ease;
	}
	.shop-map-row[data-state='0'] {
		border-color: var(--bg-border);
		background: transparent;
	}
	.shop-map-row[data-state='1'],
	.shop-map-row[data-state='2'],
	.shop-map-row[data-state='3'] {
		background: linear-gradient(90deg, var(--accent-glow), transparent 60%), var(--surface-soft);
		border-color: color-mix(in srgb, var(--accent) 40%, var(--bg-border));
	}
	.shop-map-icon {
		font-size: 1.05rem;
		color: var(--accent);
		width: 1.35rem;
		text-align: center;
	}
	.shop-map-label {
		font-size: 0.92rem;
		color: var(--text-primary);
		font-weight: 500;
	}
	.shop-map-state {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.78rem;
		color: var(--text-muted);
		letter-spacing: 0.02em;
	}
	.shop-map-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		display: inline-block;
	}
	.shop-map-dot[data-state='0'] {
		background: var(--bg-border-strong);
	}
	.shop-map-dot[data-state='1'] {
		background: color-mix(in srgb, var(--accent) 55%, transparent);
	}
	.shop-map-dot[data-state='2'] {
		background: var(--accent);
	}
	.shop-map-dot[data-state='3'] {
		background: var(--accent);
		box-shadow: 0 0 0 3px var(--accent-glow-strong);
	}
	.shop-map-legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--bg-border);
	}
	.shop-map-legend-item {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.72rem;
		color: var(--text-muted);
	}
</style>
