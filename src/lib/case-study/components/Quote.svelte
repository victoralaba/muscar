<script lang="ts">
	interface Props {
		attribution: string;
		illustrative?: boolean;
		children?: import('svelte').Snippet;
		body?: string;
	}

	let { attribution, illustrative = false, children, body }: Props = $props();
</script>

<figure class="quote">
	<blockquote class="quote-body">
		{#if children}
			{@render children()}
		{:else if body}
			{body}
		{/if}
	</blockquote>
	<figcaption class="quote-attr">
		<span>{attribution}</span>
		{#if illustrative}
			<span class="quote-illustrative">Illustrative</span>
		{/if}
	</figcaption>
</figure>

<style>
	.quote {
		position: relative;
		margin: clamp(2rem, 5vw, 3rem) 0;
		padding: clamp(1.5rem, 4vw, 2.5rem);
		border-left: 3px solid var(--accent);
		background: linear-gradient(135deg, var(--surface-soft), transparent 60%), var(--bg-card);
		border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
	}
	.quote-body {
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 3vw, 2rem);
		line-height: 1.25;
		letter-spacing: 0.01em;
		color: var(--text-primary);
		margin: 0;
		font-style: normal;
	}
	.quote-attr {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-top: 1.2rem;
		font-size: 0.85rem;
		color: var(--text-muted);
	}
	.quote-illustrative {
		display: inline-flex;
		align-items: center;
		padding: 0.15rem 0.55rem;
		border: 1px solid var(--accent);
		border-radius: 999px;
		color: var(--accent);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-weight: 600;
	}
</style>
