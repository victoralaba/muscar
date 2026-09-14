<script lang="ts">
	import { findCase } from '$lib/case-study/manifest';
	import CaseHeader from '$lib/case-study/components/CaseHeader.svelte';
	import CaseBody from '$lib/case-study/components/CaseBody.svelte';
	import CaseCTA from '$lib/case-study/components/CaseCTA.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// The manifest is imported eagerly at build time; looking the case up
	// here is the same lookup +page.ts did, so Vite dedupes it and Svelte
	// can render the component directly (Components cannot travel through
	// `load` return values).
	const entry = $derived(findCase(data.slug));
	const Content = $derived(entry?.Component);
</script>

<svelte:head>
	<title>{data.metadata.title} — Case Study — Muscar</title>
	<meta name="description" content={data.metadata.summary} />
</svelte:head>

{#if Content}
	<CaseHeader metadata={data.metadata} />
	<CaseBody>
		<Content />
	</CaseBody>
	<CaseCTA />
{/if}
