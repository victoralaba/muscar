// Typed content model for the Muscar survey. Keeping the copy here (instead of
// hardcoded in the page) means the wizard, the localStorage cache shape, and
// the server-side payload all key off the same `id`s.

export type QuestionType = 'single' | 'multi' | 'scale' | 'rank' | 'text';

export interface Option {
	value: string;
	label: string;
}

export interface Question {
	id: string;
	type: QuestionType;
	label: string;
	helper?: string;
	/** Only enforced for the contact step today — survey questions are all skippable. */
	required?: boolean;
	options?: Option[];
	allowOther?: boolean;
	otherLabel?: string;
	/** 'multi' only — caps how many boxes can be checked. */
	maxSelect?: number;
	/** 'scale' only */
	scaleMin?: number;
	scaleMax?: number;
	scaleMinLabel?: string;
	scaleMaxLabel?: string;
	/** 'rank' only */
	rankItems?: Option[];
	/** 'text' only — textarea vs single-line input */
	multiline?: boolean;
	placeholder?: string;
}

export interface Section {
	id: string;
	title: string;
	description?: string;
	questions: Question[];
}

export const surveySections: Section[] = [
	{
		id: 'who-you-are',
		title: 'Who You Are',
		description: "So we don't lump you in with the wrong crowd.",
		questions: [
			{
				id: 'trade',
				type: 'single',
				label: "What's your trade?",
				allowOther: true,
				options: [
					{ value: 'plumbing', label: 'Plumbing' },
					{ value: 'electrical', label: 'Electrical' },
					{ value: 'hvac', label: 'HVAC' },
					{ value: 'general_contracting', label: 'General contracting / construction' },
					{ value: 'auto_repair', label: 'Auto repair' },
					{ value: 'landscaping', label: 'Landscaping' }
				]
			},
			{
				id: 'team_size',
				type: 'single',
				label: 'How many people work in your business, including you?',
				options: [
					{ value: 'just_me', label: 'Just me' },
					{ value: '2_5', label: '2–5' },
					{ value: '6_15', label: '6–15' },
					{ value: '16_plus', label: '16+' }
				]
			},
			{
				id: 'years_running',
				type: 'single',
				label: 'How long have you been running this business?',
				options: [
					{ value: 'under_2', label: 'Less than 2 years' },
					{ value: '2_5', label: '2–5 years' },
					{ value: '6_15', label: '6–15 years' },
					{
						value: '15_plus',
						label: '15+ years — I was doing this before "AI" meant anything but Skynet'
					}
				]
			}
		]
	},
	{
		id: 'ai-relationship',
		title: 'Your Actual Relationship With AI Right Now',
		questions: [
			{
				id: 'ai_status',
				type: 'single',
				label: 'Be honest — where are you with AI tools today?',
				options: [
					{ value: 'never', label: 'Never touched one' },
					{ value: 'tried_once', label: 'Tried ChatGPT once, closed the tab' },
					{ value: 'occasional', label: 'Use something occasionally (texts, quotes, googling)' },
					{ value: 'regular', label: 'Use it regularly for real tasks' },
					{ value: 'the_guy', label: "I'm the guy other owners ask about this stuff" }
				]
			},
			{
				id: 'trust_score',
				type: 'scale',
				label: 'How much do you trust "AI" claims from software companies?',
				scaleMin: 1,
				scaleMax: 10,
				scaleMinLabel: '1 — total scam artists',
				scaleMaxLabel: '10 — sure, why not'
			},
			{
				id: 'gut_reaction',
				type: 'single',
				label: 'What\'s your gut reaction when a salesperson says "AI-powered"?',
				options: [
					{ value: 'suspicion', label: 'Immediate suspicion' },
					{ value: 'curious_skeptical', label: 'Curious but skeptical' },
					{ value: 'interested', label: 'Interested' },
					{ value: 'tune_out', label: 'I tune out completely' },
					{ value: 'price_went_up', label: 'I assume it means the price just went up' }
				]
			},
			{
				id: 'paid_for_ai_name',
				type: 'single',
				label: 'Have you ever paid for a tool because it had "AI" in the name, then barely used it?',
				options: [
					{ value: 'yes_mad', label: "Yes, and I'm still a little mad about it" },
					{ value: 'no', label: "No, I don't fall for that" },
					{ value: 'not_sure', label: "Honestly not sure — I have a subscription graveyard I haven't audited" }
				]
			}
		]
	},
	{
		id: 'time-and-money',
		title: 'Where the Time and Money Actually Go',
		questions: [
			{
				id: 'time_suck_rank',
				type: 'rank',
				label: 'Rank these from biggest time-suck to smallest',
				rankItems: [
					{ value: 'calls_booking', label: 'Answering calls / booking jobs' },
					{ value: 'quotes_invoices', label: 'Writing quotes and invoices' },
					{ value: 'scheduling', label: 'Scheduling and dispatching' },
					{ value: 'chasing_payments', label: 'Chasing payments' },
					{ value: 'inventory', label: 'Ordering parts / managing inventory' },
					{ value: 'marketing', label: 'Marketing / finding new customers' }
				]
			},
			{
				id: 'would_pay_for',
				type: 'multi',
				label: 'Which of these would you pay real money to make easier?',
				maxSelect: 3,
				allowOther: true,
				options: [
					{ value: 'never_miss_call', label: 'Never missing a customer call again' },
					{ value: 'same_day_quotes', label: 'Quotes and invoices done same-day, not at 10pm' },
					{ value: 'know_margin', label: 'Knowing my real profit margin before I start a job' },
					{ value: 'find_keep_employees', label: 'Finding and keeping good employees' },
					{ value: 'easy_marketing', label: "Marketing that doesn't feel like a second job" }
				]
			},
			{
				id: 'admin_time',
				type: 'scale',
				label: 'How much of your week is spent on paperwork/admin instead of actual work?',
				scaleMin: 1,
				scaleMax: 10,
				scaleMinLabel: '1 — barely any',
				scaleMaxLabel: "10 — I'm basically a part-time secretary"
			}
		]
	},
	{
		id: 'money-question',
		title: 'The Money Question',
		questions: [
			{
				id: 'willing_to_pay',
				type: 'single',
				label: 'What would you realistically pay per month for a tool that saved you 5+ hours a week?',
				options: [
					{ value: 'zero', label: "$0 — if it's not free, it's not for me" },
					{ value: 'under_20', label: 'Under $20' },
					{ value: '20_50', label: '$20–50' },
					{ value: '50_150', label: '$50–150' },
					{ value: '150_plus', label: '$150+ if it actually works' },
					{ value: 'depends', label: 'Depends entirely on what it does — convince me first' }
				]
			},
			{
				id: 'cancelled_subscription',
				type: 'single',
				label: 'Have you ever cancelled a software subscription because you forgot to use it?',
				helper: "No judgment. We've all been there.",
				options: [
					{ value: 'yes_multiple', label: 'Yes, more than once' },
					{ value: 'once', label: 'Once' },
					{ value: 'never', label: 'Never' },
					{ value: 'dont_check', label: "I don't check my bank statement closely enough to know" }
				]
			}
		]
	},
	{
		id: 'what-would-help',
		title: 'What Would Actually Help',
		questions: [
			{
				id: 'genie_wish',
				type: 'text',
				multiline: true,
				label: 'If a genie gave you ONE piece of your business back on autopilot, what would it be?'
			},
			{
				id: 'dumbest_pitch',
				type: 'text',
				multiline: true,
				label: 'What\'s the dumbest "AI will change your business" pitch you\'ve ever heard?',
				helper: "We want the good ones, screenshot-worthy if you've got 'em."
			},
			{
				id: 'blockers',
				type: 'multi',
				label: "What's stopped you from trying an AI tool before, if anything?",
				allowOther: true,
				options: [
					{ value: 'no_time', label: "Don't have time to learn something new" },
					{ value: 'dont_trust', label: "Don't trust it with customer info" },
					{ value: 'didnt_work', label: "Tried something before and it didn't work" },
					{ value: 'not_explained', label: 'Nobody explained it in plain English' },
					{ value: 'never_crossed_mind', label: 'Genuinely never crossed my mind' }
				]
			}
		]
	},
	{
		id: 'wrap-up',
		title: 'Wrap-Up',
		questions: [
			{
				id: 'learning_preference',
				type: 'multi',
				label: 'How do you want to learn about this stuff, if at all?',
				options: [
					{ value: 'short_newsletter', label: 'Short newsletter, straight to the point' },
					{ value: 'case_studies', label: 'Real examples/case studies from people like me' },
					{ value: 'how_to_guides', label: 'Step-by-step "how to set this up" guides' },
					{ value: 'occasional', label: "Occasional — don't email me too much" },
					{ value: 'what_not_to_buy', label: "Just tell me what NOT to waste money on, that's enough" }
				]
			},
			{
				id: 'honest_opinion',
				type: 'text',
				multiline: true,
				label: "Last one — one sentence: what's your honest opinion of AI right now?",
				helper: 'Say whatever you actually think.'
			}
		]
	}
];

export const TOTAL_STEPS = surveySections.length + 1; // +1 for the contact step
