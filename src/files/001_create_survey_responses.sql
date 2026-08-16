create table if not exists survey_responses (
	id bigint generated always as identity primary key,
	name text not null,
	email text not null,
	wants_reports boolean not null default false,
	answers jsonb not null default '{}'::jsonb,
	other_values jsonb not null default '{}'::jsonb,
	submitted_ip text,
	created_at timestamptz not null default now()
);

create index if not exists survey_responses_email_idx on survey_responses (email);
create index if not exists survey_responses_created_at_idx on survey_responses (created_at);
