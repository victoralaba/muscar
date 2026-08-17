alter table newsletter_subscribers
	add column if not exists utm_source text,
	add column if not exists utm_medium text,
	add column if not exists utm_campaign text,
	add column if not exists utm_content text,
	add column if not exists utm_term text;

create index if not exists newsletter_subscribers_utm_campaign_idx
	on newsletter_subscribers (utm_campaign);
