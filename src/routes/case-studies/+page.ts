import { listCases } from '$lib/case-study/manifest';

export function load() {
	return { cases: listCases() };
}
