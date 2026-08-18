alter table newsletter_subscribers
	add column if not exists unsubscribe_token text;

-- Backfill existing rows with an opaque token so unsubscribe links never
-- have to carry a raw email address. gen_random_uuid() has been built into
-- core Postgres since v13, no extension required.
update newsletter_subscribers
set unsubscribe_token = gen_random_uuid()::text
where unsubscribe_token is null;

alter table newsletter_subscribers
	alter column unsubscribe_token set not null;

create unique index if not exists newsletter_subscribers_unsubscribe_token_idx
	on newsletter_subscribers (unsubscribe_token);
