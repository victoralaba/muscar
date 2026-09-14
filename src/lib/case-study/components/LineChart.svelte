<script lang="ts">
	import { Area, Axis, Chart, Highlight, Svg } from 'layerchart';
	import { scaleLinear, scaleTime } from 'd3-scale';
	import { curveMonotoneX } from 'd3-shape';

	interface Point {
		x: Date | number;
		y: number;
	}

	interface Marker {
		x: Date | number;
		label: string;
	}

	interface Props {
		data: Point[];
		yLabel?: string;
		xLabel?: string;
		yUnit?: string;
		useTimeScale?: boolean;
		markers?: Marker[];
		caption?: string;
	}

	let { data, yLabel, xLabel, yUnit, useTimeScale = true, markers = [], caption }: Props = $props();

	const xScale = $derived(useTimeScale ? scaleTime() : scaleLinear());
</script>

<figure class="chart-figure">
	<div class="chart-head">
		{#if yLabel}<p class="chart-y-label">
				{yLabel}{#if yUnit}<span class="chart-y-unit"> ({yUnit})</span>{/if}
			</p>{/if}
	</div>

	<div class="chart-wrap">
		<Chart
			{data}
			x="x"
			y="y"
			{xScale}
			yScale={scaleLinear()}
			yDomain={[0, undefined]}
			padding={{ top: 12, right: 16, bottom: 32, left: 40 }}
		>
			<Svg>
				<Axis
					placement="bottom"
					grid={{ style: 'stroke-dasharray: 2 4;' }}
					rule
					tickLabelProps={{ class: 'chart-tick' }}
				/>
				<Axis
					placement="left"
					grid={{ style: 'stroke-dasharray: 2 4;' }}
					rule
					tickLabelProps={{ class: 'chart-tick' }}
				/>
				<Area
					line={{ class: 'chart-line', 'stroke-width': 2, curve: curveMonotoneX }}
					curve={curveMonotoneX}
					class="chart-area"
				/>
				<Highlight
					points={{ r: 4, class: 'chart-highlight' }}
					lines={{ class: 'chart-highlight-line' }}
				/>
			</Svg>
		</Chart>
	</div>

	<div class="chart-markers">
		{#each markers as m (m.label)}
			<span class="chart-marker">
				<span class="chart-marker-dot" aria-hidden="true"></span>
				{m.label}
			</span>
		{/each}
	</div>

	{#if xLabel || caption}
		<figcaption class="chart-caption">
			{#if xLabel}<span class="chart-x-label">{xLabel}</span>{/if}
			{#if caption}<span class="chart-note">{caption}</span>{/if}
		</figcaption>
	{/if}
</figure>

<style>
	.chart-figure {
		margin: clamp(1.75rem, 4vw, 2.5rem) 0;
		padding: clamp(1.25rem, 3vw, 2rem);
		background: var(--bg-card);
		border: 1px solid var(--bg-border);
		border-radius: var(--radius-lg);
	}
	.chart-head {
		margin-bottom: 0.85rem;
	}
	.chart-y-label {
		font-size: 0.82rem;
		color: var(--text-primary);
		font-weight: 600;
		margin: 0;
		letter-spacing: 0.01em;
	}
	.chart-y-unit {
		color: var(--text-muted);
		font-weight: 400;
	}
	.chart-wrap {
		height: clamp(220px, 40vw, 320px);
		width: 100%;
	}
	.chart-figure :global(.chart-line) {
		stroke: var(--accent);
		fill: none;
	}
	.chart-figure :global(.chart-area) {
		fill: var(--accent-glow);
		opacity: 0.4;
	}
	.chart-figure :global(.chart-point) {
		fill: var(--accent);
		stroke: var(--bg-card);
		stroke-width: 1.5;
	}
	.chart-figure :global(.chart-highlight) {
		fill: var(--accent);
		stroke: var(--bg-card);
		stroke-width: 2;
	}
	.chart-figure :global(.chart-highlight-line) {
		stroke: var(--accent);
		stroke-dasharray: 2 4;
		opacity: 0.5;
	}
	.chart-figure :global(.chart-tick) {
		fill: var(--text-muted);
		font-size: 11px;
		font-family: var(--font-body);
	}
	.chart-figure :global(.tick line),
	.chart-figure :global(.rule) {
		stroke: var(--bg-border);
	}
	.chart-markers {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1.25rem;
		margin-top: 0.85rem;
	}
	.chart-marker {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.78rem;
		color: var(--text-muted);
	}
	.chart-marker-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent);
	}
	.chart-caption {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
		margin-top: 0.85rem;
		font-size: 0.78rem;
		color: var(--text-muted);
	}
	.chart-x-label {
		font-weight: 500;
	}
	.chart-note {
		font-style: italic;
	}
</style>
