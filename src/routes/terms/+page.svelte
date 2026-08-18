<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { IconFileText } from '@tabler/icons-svelte';

	const lastUpdated = 'August 18, 2026';
</script>

<svelte:head>
	<title>Terms of Service — Muscar</title>
	<meta name="description" content="The terms that govern using the Muscar website, survey, and newsletter." />
</svelte:head>

<section class="lg-hero" aria-labelledby="lg-hl">
	<div class="lg-bg-grid" aria-hidden="true"></div>
	<div class="lg-inner container">
		<Badge variant="outline" class="lg-badge">
			<IconFileText size={12} />
			Legal
		</Badge>
		<h1 id="lg-hl" class="lg-headline">Terms of Service</h1>
		<p class="lg-updated">Last updated: {lastUpdated}</p>
	</div>
</section>

<section class="lg-body" aria-labelledby="lg-hl">
	<div class="lg-content container">
		<p>
			These Terms of Service ("Terms") govern your use of the Muscar website, survey, and
			newsletter (together, the "Service"), operated by Muscar ("Muscar," "we," "us"). By using
			the Service — visiting the site, submitting the survey, or subscribing to the newsletter —
			you agree to these Terms. If you don't agree, please don't use the Service.
		</p>

		<h2>What the Service is</h2>
		<p>
			Muscar runs a survey of trade business owners (HVAC, plumbing, electrical, roofing, and
			similar trades) about how they've actually used AI tools, and publishes the findings —
			along with general commentary and education on AI adoption — through a newsletter and this
			website. Muscar may also offer paid consulting or tools; when it does, that's disclosed
			separately from the free content.
		</p>

		<h2>Not professional advice</h2>
		<p>
			Content on this site and in the newsletter — including survey findings, commentary, and
			any product or tool recommendations — is provided for general informational purposes only.
			It is not legal, financial, tax, or professional business advice, and it isn't a substitute
			for advice from a licensed professional familiar with your specific situation. You're
			responsible for your own business decisions, including any decision to adopt, purchase, or
			stop using a tool or vendor mentioned here.
		</p>

		<h2>Eligibility</h2>
		<p>
			The Service is intended for business owners and professionals aged 18 or older. By using
			the Service, you confirm you meet that requirement.
		</p>

		<h2>The survey</h2>
		<p>
			The survey is voluntary. Your answers help Muscar identify real patterns in AI adoption
			across the trades and may be published in aggregate or paraphrased form — never in a way
			that identifies you personally unless you separately and explicitly agree to that. See our
			<a href="/privacy">Privacy Policy</a> for how we handle submitted data.
		</p>

		<h2>The newsletter</h2>
		<p>
			Subscribing is opt-in and you can unsubscribe at any time via the link in any newsletter
			email or at <a href="/unsubscribe">/unsubscribe</a>. We don't sell your email address, and
			we don't bury a sales pitch in every issue.
		</p>

		<h2>Acceptable use</h2>
		<p>You agree not to, in connection with the Service:</p>
		<ul>
			<li>Submit false, misleading, or fraudulent survey responses, or automate submissions;</li>
			<li>Attempt to bypass bot protection or scrape the site in a way that degrades it for others;</li>
			<li>Use the contact form or survey to send spam, malware, or unlawful content;</li>
			<li>Impersonate another person or misrepresent your affiliation with a business; or</li>
			<li>Interfere with the normal operation of the site or its underlying infrastructure.</li>
		</ul>

		<h2>Intellectual property</h2>
		<p>
			The Muscar name, logo, site design, and original written content (including newsletter
			issues and published survey findings) belong to Muscar unless otherwise noted. You may
			share and quote our content with attribution and a link back; you may not republish it
			wholesale or present it as your own.
		</p>

		<h2>Third-party links and tools</h2>
		<p>
			The site and newsletter may reference or link to third-party tools, vendors, or services.
			Mentioning a tool isn't an endorsement or guarantee of results, and we aren't responsible
			for the content, accuracy, or practices of third-party sites.
		</p>

		<h2>No warranty</h2>
		<p>
			The Service is provided "as is" and "as available," without warranties of any kind, express
			or implied, including — to the extent permitted by law — implied warranties of
			merchantability, fitness for a particular purpose, and non-infringement. We don't guarantee
			the Service will be uninterrupted, error-free, or that any AI tool or approach mentioned
			will work for your business.
		</p>

		<h2>Limitation of liability</h2>
		<p>
			To the fullest extent permitted by law, Muscar won't be liable for any indirect,
			incidental, special, consequential, or punitive damages, or any loss of profits or
			revenue, arising from your use of — or inability to use — the Service, even if advised of
			the possibility of such damages.
		</p>

		<h2>Termination</h2>
		<p>
			We may suspend or restrict access to the Service for anyone who violates these Terms. You
			can stop using the Service, and unsubscribe from the newsletter, at any time.
		</p>

		<h2>Changes to these Terms</h2>
		<p>
			We may update these Terms from time to time. Material changes will be reflected by updating
			the "Last updated" date above. Continuing to use the Service after changes take effect
			means you accept the updated Terms.
		</p>

		<h2>Governing law</h2>
		<p>
			These Terms are governed by the laws of the jurisdiction in which Muscar operates, without
			regard to conflict-of-law principles, except where local consumer-protection law provides
			otherwise.
		</p>

		<h2>Contact</h2>
		<p>
			Questions about these Terms? Email <a href="mailto:policy@muscar.app">policy@muscar.app</a>.
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
</style>
