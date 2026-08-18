<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { IconShieldLock } from '@tabler/icons-svelte';

	const lastUpdated = 'August 18, 2026';
</script>

<svelte:head>
	<title>Privacy Policy — Muscar</title>
	<meta
		name="description"
		content="What Muscar collects through the survey, newsletter, and contact form, and how it's used."
	/>
</svelte:head>

<section class="lg-hero" aria-labelledby="lg-hl">
	<div class="lg-bg-grid" aria-hidden="true"></div>
	<div class="lg-inner container">
		<Badge variant="outline" class="lg-badge">
			<IconShieldLock size={12} />
			Legal
		</Badge>
		<h1 id="lg-hl" class="lg-headline">Privacy Policy</h1>
		<p class="lg-updated">Last updated: {lastUpdated}</p>
	</div>
</section>

<section class="lg-body" aria-labelledby="lg-hl">
	<div class="lg-content container">
		<p>
			This Privacy Policy explains what information Muscar collects through this website, the
			survey, and the newsletter, why we collect it, and what your options are. We keep this
			short on purpose — we're not interested in collecting more than we need to run the survey
			and send the newsletter.
		</p>

		<h2>What we collect</h2>
		<p><strong>Survey (<code>/survey</code>)</strong></p>
		<ul>
			<li>Your name and email, if you choose to provide them;</li>
			<li>Your answers to the survey questions, including any free-text ("other") answers;</li>
			<li>Whether you opted in to receive report findings by email;</li>
			<li>Your IP address at the time of submission, used for spam/abuse prevention; and</li>
			<li>
				Campaign attribution data (UTM parameters, e.g. which link or ad brought you here), if
				present.
			</li>
		</ul>
		<p><strong>Newsletter (<code>/newsletter</code>)</strong></p>
		<ul>
			<li>Your name (optional), email, and trade/industry, if you provide it;</li>
			<li>Your IP address at the time of signup, used for spam/abuse prevention; and</li>
			<li>Campaign attribution data (UTM parameters), if present.</li>
		</ul>
		<p><strong>Contact form (<code>/contact</code>)</strong></p>
		<ul>
			<li>
				Your name, email, and message. This is sent to us as an email and is not stored in our
				database.
			</li>
		</ul>
		<p><strong>Unsubscribing (<code>/unsubscribe</code>)</strong></p>
		<ul>
			<li>The email address you enter, used only to process the unsubscribe request.</li>
		</ul>
		<p><strong>Site analytics</strong></p>
		<ul>
			<li>
				We use a self-hosted analytics tool (Umami) to see aggregate traffic and which campaigns
				drive signups. It doesn't use third-party ad-tracking cookies and doesn't sell or share
				data with ad networks. A first-party cookie may be set to remember campaign attribution
				(e.g. which link you first arrived from) for up to 30 days.
			</li>
		</ul>
		<p>
			We don't use third-party advertising trackers, and we don't sell your personal information
			to anyone.
		</p>

		<h2>How we use it</h2>
		<ul>
			<li>To identify and publish patterns in AI adoption across the trades (survey data);</li>
			<li>To send the newsletter and respond to messages you send us;</li>
			<li>To understand which channels and campaigns bring people to the site; and</li>
			<li>To detect and prevent spam, bots, and abuse of our forms.</li>
		</ul>
		<p>
			If you gave us your email through the survey and opted in to reports, or signed up for the
			newsletter directly, we'll add you to our mailing list for that purpose. Survey findings we
			publish are aggregated or anonymized — we don't publish your name or answers tied to your
			identity without your separate, explicit consent.
		</p>

		<h2>Who we share it with</h2>
		<p>We use a small number of service providers to run Muscar, each only for its stated job:</p>
		<ul>
			<li>
				<strong>Brevo</strong> — our email and contact-management provider. Newsletter and
				opted-in survey emails, plus contact-form messages, are processed through Brevo.
			</li>
			<li>
				<strong>Cloudflare</strong> — hosts the site (Cloudflare Pages) and provides bot
				protection (Turnstile) on our forms. Turnstile may set its own cookies as part of that
				check; see Cloudflare's privacy policy for details on how it handles that data.
			</li>
		</ul>
		<p>
			We don't sell, rent, or otherwise share your personal information with third parties for
			their own marketing purposes.
		</p>

		<h2>How long we keep it</h2>
		<p>
			Survey and newsletter data is kept as long as it's useful for the purposes above, or until
			you ask us to delete it. If you unsubscribe from the newsletter, we mark your record as
			unsubscribed and stop emailing you; we may retain a minimal record (e.g. that the address
			unsubscribed) to honor that choice and avoid re-adding you by mistake.
		</p>

		<h2>Your choices</h2>
		<ul>
			<li>
				<strong>Unsubscribe</strong> from the newsletter any time via the link in any email or at
				<a href="/unsubscribe">/unsubscribe</a>.
			</li>
			<li>
				<strong>Access, correct, or delete</strong> your data by emailing
				<a href="mailto:policy@muscar.app">policy@muscar.app</a>. We'll respond and act on
				verifiable requests within a reasonable time.
			</li>
		</ul>

		<h2>Children's privacy</h2>
		<p>
			Muscar is intended for business owners and professionals, not children. We don't knowingly
			collect information from anyone under 18.
		</p>

		<h2>Changes to this policy</h2>
		<p>
			We may update this policy as the site or our tools change. Material changes will be
			reflected by updating the "Last updated" date above.
		</p>

		<h2>Contact</h2>
		<p>
			Questions about this policy, or a request about your data? Email
			<a href="mailto:policy@muscar.app">policy@muscar.app</a>.
		</p>
	</div>
</section>

<style>
	.container {
		max-width: var(--max-w);
		margin: 0 auto;
		padding: 0 clamp(1.25rem, 5vw, 2.5rem);
	}

	/* ── HERO ── */
	.lg-hero {
		position: relative;
		overflow: hidden;
	}
	.lg-bg-grid {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(var(--grid-line) 1px, transparent 1px),
			linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
		background-size: 60px 60px;
		mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
	}
	.lg-inner {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: clamp(3.5rem, 8vw, 5.5rem) 0 clamp(2rem, 4vw, 2.5rem);
	}
	:global(.lg-badge) {
		border-color: var(--bg-border-strong) !important;
		color: var(--text-secondary) !important;
		background: var(--surface-soft) !important;
		display: flex !important;
		align-items: center !important;
		gap: 0.35rem !important;
		font-size: 0.78rem !important;
		letter-spacing: 0.02em !important;
		margin-bottom: 1.25rem !important;
	}
	.lg-headline {
		font-family: var(--font-display);
		font-size: clamp(2.1rem, 5vw, 3rem);
		letter-spacing: 0.02em;
		color: var(--text-primary);
		margin: 0;
	}
	.lg-updated {
		font-size: 0.85rem;
		color: var(--text-muted);
		margin: 0.75rem 0 0;
	}

	/* ── BODY ── */
	.lg-body {
		padding: 0 0 var(--section-pad);
	}
	.lg-content {
		max-width: 720px;
		font-size: 0.98rem;
		line-height: 1.75;
		color: var(--text-secondary);
		font-weight: 300;
	}
	.lg-content p {
		margin: 0 0 1.1rem;
	}
	.lg-content ul {
		margin: 0 0 1.1rem;
		padding-left: 1.4rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.lg-content li {
		margin: 0;
	}
	.lg-content h2 {
		font-family: var(--font-display);
		font-size: 1.35rem;
		letter-spacing: 0.02em;
		color: var(--text-primary);
		font-weight: 400;
		margin: 2.25rem 0 0.9rem;
	}
	.lg-content h2:first-of-type {
		margin-top: 2rem;
	}
	.lg-content a {
		color: var(--accent);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.lg-content code {
		font-family: var(--font-body);
		background: var(--surface-soft);
		border: 1px solid var(--bg-border);
		border-radius: var(--radius-sm);
		padding: 0.1rem 0.35rem;
		font-size: 0.9em;
	}
</style>
