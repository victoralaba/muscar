import type { CaseMetadata, CaseModule } from './types';

// Eager glob so both the index and the detail route can render synchronously.
// mdsvex compiles each .svx to a Svelte component at build time; content stays
// small so paying full-eager cost is fine.
const modules = import.meta.glob<CaseModule>('/src/content/cases/*.svx', { eager: true });

function slugFromPath(path: string): string {
	const filename = path.split('/').pop() ?? '';
	// Strip an optional NN- ordering prefix and the .svx extension.
	return filename.replace(/^\d+-/, '').replace(/\.svx$/, '');
}

interface CaseEntry {
	slug: string;
	path: string;
	metadata: CaseMetadata;
	Component: CaseModule['default'];
}

const entries: CaseEntry[] = Object.entries(modules)
	.map(([path, mod]) => {
		const slug = mod.metadata?.slug ?? slugFromPath(path);
		return {
			slug,
			path,
			metadata: { ...mod.metadata, slug },
			Component: mod.default
		};
	})
	.sort((a, b) => (a.metadata.publishedAt < b.metadata.publishedAt ? 1 : -1));

const bySlug = new Map(entries.map((e) => [e.slug, e]));

export function listCases(): CaseMetadata[] {
	return entries.map((e) => e.metadata);
}

export function findCase(slug: string): CaseEntry | undefined {
	return bySlug.get(slug);
}

export function listSlugs(): string[] {
	return entries.map((e) => e.slug);
}
