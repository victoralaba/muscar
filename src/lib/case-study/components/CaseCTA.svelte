<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { IconArrowRight } from '@tabler/icons-svelte';
</script>

<section class="cs-cta">
	<div class="cs-cta-inner">
		<h2 class="cs-cta-title">
			Different shop.<br /><span class="accent">Same method.</span>
		</h2>
		<p class="cs-cta-body">
			Every engagement starts with the same first move: mapping how your business actually runs
			today. If that sounds like the conversation you want, tell us about your shop.
		</p>
		<div class="cs-cta-actions">
			<Button href="/service#get-started" size="lg" class="cta-primary">
				Tell Us About Your Shop
				<IconArrowRight size={16} />
			</Button>
			<Button href="/case-studies" size="lg" variant="outline" class="cta-secondary">
				More Case Studies
			</Button>
		</div>
	</div>
</section>

<style>
	.cs-cta {
		padding: clamp(3.5rem, 7vw, 5.5rem) 0;
		background: var(--bg-card);
		border-top: 1px solid var(--bg-border);
	}
	.cs-cta-inner {
		max-width: 720px;
		margin: 0 auto;
		padding: 0 clamp(1.25rem, 5vw, 2.5rem);
		text-align: center;
	}
	.cs-cta-title {
		font-family: var(--font-display);
		font-size: clamp(2.2rem, 5vw, 3.6rem);
		line-height: 1;
		letter-spacing: 0.02em;
		color: var(--text-primary);
		margin: 0 0 1.25rem;
	}
	.accent {
		color: var(--accent);
	}
	.cs-cta-body {
		font-size: clamp(1rem, 1.8vw, 1.1rem);
		color: var(--text-secondary);
		line-height: 1.65;
		margin: 0 auto 2rem;
		font-weight: 300;
		max-width: 520px;
	}
	.cs-cta-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	@media (max-width: 500px) {
		.cs-cta-actions {
			flex-direction: column;
			align-items: stretch;
		}
		:global(.cs-cta .cta-primary),
		:global(.cs-cta .cta-secondary) {
			width: 100%;
			justify-content: center !important;
		}
	}
</style>
