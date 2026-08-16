// Client-only cache so a reload (or an accidental tab close) doesn't lose
// progress. Bump STORAGE_KEY's version suffix if the answer shape changes in
// a way that would make old cached data invalid.

const STORAGE_KEY = 'muscar-survey-v1';

export interface SurveyState {
	step: number;
	answers: Record<string, unknown>;
	otherValues: Record<string, string>;
	name: string;
	email: string;
	wantsReports: boolean;
	updatedAt: number;
}

export function loadSurveyState(): SurveyState | null {
	if (typeof window === 'undefined') return null;
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (typeof parsed?.step !== 'number' || typeof parsed?.answers !== 'object') return null;
		return {
			step: parsed.step,
			answers: parsed.answers ?? {},
			otherValues: parsed.otherValues ?? {},
			name: parsed.name ?? '',
			email: parsed.email ?? '',
			wantsReports: Boolean(parsed.wantsReports),
			updatedAt: parsed.updatedAt ?? Date.now()
		};
	} catch {
		return null;
	}
}

export function saveSurveyState(state: Omit<SurveyState, 'updatedAt'>) {
	if (typeof window === 'undefined') return;
	try {
		const toStore: SurveyState = { ...state, updatedAt: Date.now() };
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
	} catch {
		// Storage full, disabled, or private-mode — the survey still works for
		// this session, it just won't survive a reload. Fail silently.
	}
}

export function clearSurveyState() {
	if (typeof window === 'undefined') return;
	try {
		window.localStorage.removeItem(STORAGE_KEY);
	} catch {
		// ignore
	}
}
