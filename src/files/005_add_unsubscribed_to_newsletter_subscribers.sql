alter table newsletter_subscribers
	add column if not exists unsubscribed_at timestamptz;

create index if not exists newsletter_subscribers_unsubscribed_at_idx
	on newsletter_subscribers (unsubscribed_at);
