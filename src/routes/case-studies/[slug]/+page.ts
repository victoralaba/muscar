import { error } from '@sveltejs/kit';
import { findCase } from '$lib/case-study/manifest';

export function load({ params }) {
	const entry = findCase(params.slug);
	if (!entry) throw error(404, 'Case study not found');
	return {
		slug: params.slug,
		metadata: entry.metadata
	};
}
