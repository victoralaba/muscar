<script lang="ts">
	import type { Question } from '$lib/survey/schema';

	let {
		question,
		value = $bindable(),
		otherValue = $bindable()
	}: {
		question: Question;
		value: unknown;
		otherValue?: string;
	} = $props();

	function toggleMulti(optValue: string) {
		const current: string[] = Array.isArray(value) ? [...(value as string[])] : [];
		const idx = current.indexOf(optValue);
		if (idx >= 0) {
			current.splice(idx, 1);
		} else {
			if (question.maxSelect && current.length >= question.maxSelect) return;
			current.push(optValue);
		}
		value = current;
	}

	const scaleRange = $derived(
		Array.from(
			{ length: (question.scaleMax ?? 10) - (question.scaleMin ?? 1) + 1 },
			(_, i) => (question.scaleMin ?? 1) + i
		)
	);

	// ── Rank (drag-to-sort) ──────────────────────────────────────────────────

	// Local ordered list of item values. `rankOrder` is the source of truth for
	// the on-screen order; it's written to the value prop as {value: rank}.
	let rankOrder = $state<string[]>([]);

	// Adopt an external `value` (restored progress) only. The join-compare means
	// our own syncValue() writes come back and find nothing to change — without
	// it this effect and the handlers below would loop forever.
	$effect(() => {
		const items = question.rankItems ?? [];
		if (items.length === 0) return;

		const saved = value && typeof value === 'object' ? (value as Record<string, number>) : {};
		const next =
			Object.keys(saved).length > 0
				? [...items]
						.sort((a, b) => (saved[a.value] ?? 99) - (saved[b.value] ?? 99))
						.map((i) => i.value)
				: items.map((i) => i.value);

		if (next.join('|') !== rankOrder.join('|')) {
			rankOrder = next;
		}
	});

	// Push the current order out to the parent as {value: rank}
	function syncValue() {
		const map: Record<string, number> = {};
		rankOrder.forEach((v, i) => (map[v] = i + 1));
		value = map;
	}

	const rankItemMap = $derived(
		Object.fromEntries((question.rankItems ?? []).map((i) => [i.value, i.label]))
	);

	// Drag state
	let dragFrom = $state<number | null>(null);
	let dragOver = $state<number | null>(null);

	function onDragStart(idx: number) {
		dragFrom = idx;
	}

	function onDragEnter(idx: number) {
		if (dragFrom === null || dragFrom === idx) return;
		dragOver = idx;
	}

	function onDragEnd() {
		if (dragFrom !== null && dragOver !== null && dragFrom !== dragOver) {
			const next = [...rankOrder];
			const [moved] = next.splice(dragFrom, 1);
			next.splice(dragOver, 0, moved);
			rankOrder = next;
			syncValue();
		}
		dragFrom = null;
		dragOver = null;
	}

	function moveUp(idx: number) {
		if (idx === 0) return;
		const next = [...rankOrder];
		[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
		rankOrder = next;
		syncValue();
	}

	function moveDown(idx: number) {
		if (idx === rankOrder.length - 1) return;
		const next = [...rankOrder];
		[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
		rankOrder = next;
		syncValue();
	}
</script>

<div class="q-field">
	<span class="q-label" id={`${question.id}-label`}>
		{question.label}
		{#if question.required}<span class="q-req">*</span>{/if}
	</span>
	{#if question.helper}
		<p class="q-helper">{question.helper}</p>
	{/if}

	{#if question.type === 'single'}
		<div class="q-options" role="radiogroup" aria-labelledby={`${question.id}-label`}>
			{#each question.options ?? [] as opt (opt.value)}
				<label class="q-option" class:is-checked={value === opt.value}>
					<input
						type="radio"
						name={question.id}
						value={opt.value}
						checked={value === opt.value}
						onchange={() => (value = opt.value)}
					/>
					<span>{opt.label}</span>
				</label>
			{/each}
			{#if question.allowOther}
				<label class="q-option" class:is-checked={value === '__other__'}>
					<input
						type="radio"
						name={question.id}
						value="__other__"
						checked={value === '__other__'}
						onchange={() => (value = '__other__')}
					/>
					<span>{question.otherLabel ?? 'Other'}</span>
				</label>
				{#if value === '__other__'}
					<input
						type="text"
						class="q-other-input"
						placeholder="Tell us more"
						bind:value={otherValue}
					/>
				{/if}
			{/if}
		</div>
	{:else if question.type === 'multi'}
		<div class="q-options">
			{#each question.options ?? [] as opt (opt.value)}
				{@const checked = Array.isArray(value) && (value as string[]).includes(opt.value)}
				{@const disabled =
					!checked &&
					!!question.maxSelect &&
					Array.isArray(value) &&
					(value as string[]).length >= question.maxSelect}
				<label class="q-option" class:is-checked={checked} class:is-disabled={disabled}>
					<input type="checkbox" {checked} {disabled} onchange={() => toggleMulti(opt.value)} />
					<span>{opt.label}</span>
				</label>
			{/each}
			{#if question.allowOther}
				{@const otherChecked = Array.isArray(value) && (value as string[]).includes('__other__')}
				<label class="q-option" class:is-checked={otherChecked}>
					<input type="checkbox" checked={otherChecked} onchange={() => toggleMulti('__other__')} />
					<span>{question.otherLabel ?? 'Other'}</span>
				</label>
				{#if otherChecked}
					<input
						type="text"
						class="q-other-input"
						placeholder="Tell us more"
						bind:value={otherValue}
					/>
				{/if}
			{/if}
		</div>
		{#if question.maxSelect}
			<p class="q-hint">Pick up to {question.maxSelect}.</p>
		{/if}
	{:else if question.type === 'scale'}
		<div class="q-scale">
			<div class="q-scale-row" role="radiogroup" aria-labelledby={`${question.id}-label`}>
				{#each scaleRange as n (n)}
					<button
						type="button"
						class="q-scale-btn"
						class:is-checked={value === n}
						onclick={() => (value = n)}
						aria-pressed={value === n}
					>
						{n}
					</button>
				{/each}
			</div>
			{#if question.scaleMinLabel || question.scaleMaxLabel}
				<div class="q-scale-labels">
					<span>{question.scaleMinLabel ?? ''}</span>
					<span>{question.scaleMaxLabel ?? ''}</span>
				</div>
			{/if}
		</div>
	{:else if question.type === 'rank'}
		<div class="q-rank" role="listbox" aria-label={question.label}>
			<p class="q-rank-hint">Drag to reorder — #1 is your biggest time-suck.</p>
			{#each rankOrder as itemValue, idx (itemValue)}
				<div
					class="q-rank-row"
					class:is-dragging={dragFrom === idx}
					class:is-over={dragOver === idx}
					draggable="true"
					role="option"
					tabindex="0"
					aria-selected="false"
					aria-label={`${idx + 1}. ${rankItemMap[itemValue]}`}
					ondragstart={() => onDragStart(idx)}
					ondragenter={(e) => {
						e.preventDefault();
						onDragEnter(idx);
					}}
					ondragover={(e) => e.preventDefault()}
					ondragend={onDragEnd}
				>
					<span class="q-rank-badge" aria-hidden="true">{idx + 1}</span>
					<span class="q-rank-label">{rankItemMap[itemValue]}</span>
					<span class="q-rank-arrows" aria-hidden="true">
						<button
							type="button"
							class="q-rank-arrow"
							disabled={idx === 0}
							onclick={() => moveUp(idx)}
							aria-label={`Move ${rankItemMap[itemValue]} up`}>↑</button
						>
						<button
							type="button"
							class="q-rank-arrow"
							disabled={idx === rankOrder.length - 1}
							onclick={() => moveDown(idx)}
							aria-label={`Move ${rankItemMap[itemValue]} down`}>↓</button
						>
					</span>
					<span class="q-rank-handle" aria-hidden="true">⠿</span>
				</div>
			{/each}
		</div>
	{:else if question.type === 'text'}
		{#if question.multiline}
			<textarea
				class="q-textarea"
				rows="3"
				placeholder={question.placeholder}
				value={(value as string) ?? ''}
				oninput={(e) => (value = (e.currentTarget as HTMLTextAreaElement).value)}
			></textarea>
		{:else}
			<input
				type="text"
				class="q-text-input"
				placeholder={question.placeholder}
				value={(value as string) ?? ''}
				oninput={(e) => (value = (e.currentTarget as HTMLInputElement).value)}
			/>
		{/if}
	{/if}
</div>

<style>
	.q-field {
		margin-bottom: 2rem;
	}
	.q-label {
		display: block;
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.35rem;
	}
	.q-req {
		color: var(--accent);
		margin-left: 0.15rem;
	}
	.q-helper {
		font-size: 0.82rem;
		color: var(--text-muted);
		margin: 0 0 0.75rem;
	}
	.q-options {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.q-option {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		padding: 0.65rem 0.85rem;
		border: 1px solid var(--bg-border);
		border-radius: 10px;
		cursor: pointer;
		transition:
			border-color 0.15s,
			background 0.15s;
		font-size: 0.9rem;
		color: var(--text-primary);
		background: var(--bg);
	}
	.q-option:hover {
		border-color: var(--accent-dim);
	}
	.q-option.is-checked {
		border-color: var(--accent);
		background: var(--accent-glow);
	}
	.q-option.is-disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}
	.q-option input[type='radio'],
	.q-option input[type='checkbox'] {
		accent-color: var(--accent);
		width: 1.05rem;
		height: 1.05rem;
		flex-shrink: 0;
	}
	.q-other-input,
	.q-text-input,
	.q-textarea {
		width: 100%;
		margin-top: 0.5rem;
		border: 1px solid var(--bg-border);
		border-radius: 10px;
		background: var(--bg);
		color: var(--text-primary);
		padding: 0.6rem 0.75rem;
		font-size: 0.9rem;
		font-family: inherit;
	}
	.q-other-input:focus,
	.q-text-input:focus,
	.q-textarea:focus {
		outline: none;
		border-color: var(--accent);
	}
	.q-hint {
		font-size: 0.78rem;
		color: var(--text-muted);
		margin: 0.5rem 0 0;
	}
	.q-scale-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}
	.q-scale-btn {
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 8px;
		border: 1px solid var(--bg-border);
		background: var(--bg);
		color: var(--text-primary);
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			border-color 0.15s,
			background 0.15s;
	}
	.q-scale-btn:hover {
		border-color: var(--accent-dim);
	}
	.q-scale-btn.is-checked {
		border-color: var(--accent);
		background: var(--accent);
		color: var(--button-ink);
	}
	.q-scale-labels {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: var(--text-muted);
		margin-top: 0.4rem;
	}
	.q-rank {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}
	.q-rank-hint {
		font-size: 0.78rem;
		color: var(--text-muted);
		margin: 0 0 0.35rem;
	}
	.q-rank-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.6rem 0.75rem;
		border: 1px solid var(--bg-border);
		border-radius: 10px;
		background: var(--bg);
		cursor: grab;
		user-select: none;
		transition:
			border-color 0.15s,
			background 0.15s,
			box-shadow 0.15s,
			opacity 0.15s;
	}
	.q-rank-row:hover {
		border-color: var(--accent-dim);
	}
	.q-rank-row.is-dragging {
		opacity: 0.4;
		cursor: grabbing;
	}
	.q-rank-row.is-over {
		border-color: var(--accent);
		background: var(--accent-glow);
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 20%, transparent);
	}
	.q-rank-badge {
		min-width: 1.65rem;
		height: 1.65rem;
		border-radius: 50%;
		background: var(--accent-glow);
		border: 1.5px solid var(--accent-dim);
		color: var(--accent);
		font-size: 0.72rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		transition:
			background 0.15s,
			color 0.15s;
	}
	.q-rank-label {
		flex: 1;
		font-size: 0.88rem;
		color: var(--text-primary);
		line-height: 1.35;
	}
	.q-rank-arrows {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		flex-shrink: 0;
	}
	.q-rank-arrow {
		background: none;
		border: none;
		padding: 0.1rem 0.2rem;
		color: var(--text-muted);
		font-size: 0.7rem;
		line-height: 1;
		cursor: pointer;
		transition: color 0.1s;
	}
	.q-rank-arrow:hover:not(:disabled) {
		color: var(--accent);
	}
	.q-rank-arrow:disabled {
		opacity: 0.25;
		cursor: default;
	}
	.q-rank-handle {
		color: var(--text-muted);
		font-size: 1rem;
		line-height: 1;
		opacity: 0.45;
		flex-shrink: 0;
		cursor: grab;
	}
</style>
