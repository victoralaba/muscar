import type { Component } from 'svelte';

/** Frontmatter every case study .svx file must expose. */
export interface CaseMetadata {
	slug: string;
	title: string;
	trade: string;
	teamSize: string;
	region: string;
	engagementLength: string;
	headlineResult: string;
	summary: string;
	publishedAt: string;
	/** When true the page renders an "illustrative case" pill and disclaimer. */
	illustrative?: boolean;
}

/** Shape of a case module resolved from `import.meta.glob`. */
export interface CaseModule {
	metadata: CaseMetadata;
	default: Component;
}
