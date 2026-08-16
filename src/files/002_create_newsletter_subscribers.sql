create table if not exists newsletter_subscribers (
	id bigint generated always as identity primary key,
	name text,
	email text not null,
	niche text,
	submitted_ip text,
	created_at timestamptz not null default now()
);

create unique index if not exists newsletter_subscribers_email_idx on newsletter_subscribers (email);
create index if not exists newsletter_subscribers_created_at_idx on newsletter_subscribers (created_at);
