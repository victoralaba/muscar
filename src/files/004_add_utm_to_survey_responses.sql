alter table survey_responses
	add column if not exists utm_source text,
	add column if not exists utm_medium text,
	add column if not exists utm_campaign text,
	add column if not exists utm_content text,
	add column if not exists utm_term text;

create index if not exists survey_responses_utm_campaign_idx
	on survey_responses (utm_campaign);
