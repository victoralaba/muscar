<script lang="ts">
	import { Area, Axis, Chart, Points, Spline, Svg } from 'layerchart';
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

	const yMax = $derived(Math.max(...data.map((d) => d.y), 0));
</script>

<figure class="chart-figure">
	<div class="chart-head">
		{#if yLabel}
			<p class="chart-y-label">
				{yLabel}{#if yUnit}<span class="chart-y-unit"> ({yUnit})</span>{/if}
			</p>
		{/if}
	</div>

	<div class="chart-wrap">
		<Chart
			{data}
			x="x"
			y="y"
			{xScale}
			yScale={scaleLinear()}
			yDomain={[0, yMax * 1.15]}
			padding={{ top: 12, right: 16, bottom: 32, left: 44 }}
		>
			<Svg>
				<Axis
					placement="bottom"
					rule={{ style: 'stroke: var(--bg-border); stroke-width: 1;' }}
					tickLabelProps={{
						style: 'fill: var(--text-muted); font-size: 11px; font-family: var(--font-body);'
					}}
				/>
				<Axis
					placement="left"
					grid={{ style: 'stroke: var(--bg-border); stroke-dasharray: 2 4;' }}
					rule={{ style: 'stroke: var(--bg-border); stroke-width: 1;' }}
					tickLabelProps={{
						style: 'fill: var(--text-muted); font-size: 11px; font-family: var(--font-body);'
					}}
				/>
				<Area curve={curveMonotoneX} fill="var(--accent)" opacity={0.14} stroke="none" />
				<Spline curve={curveMonotoneX} stroke="var(--accent)" strokeWidth={2} fill="none" />
				<Points fill="var(--accent)" stroke="var(--bg-card)" strokeWidth={1.5} r={3.5} />
			</Svg>
		</Chart>
	</div>

	{#if markers.length > 0}
		<div class="chart-markers">
			{#each markers as m (m.label)}
				<span class="chart-marker">
					<span class="chart-marker-dot" aria-hidden="true"></span>
					{m.label}
				</span>
			{/each}
		</div>
	{/if}

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
