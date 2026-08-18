<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import logo from '$lib/assets/logo.svg';
	import { Button } from '$lib/components/ui/button/index.js';
	import { IconArrowRight, IconSun, IconMoonStars, IconMenu2, IconX } from '@tabler/icons-svelte';
	import { onMount, setContext } from 'svelte';
	import type { LayoutProps } from './$types';

	type Theme = 'dark' | 'light';

	const themeStorageKey = 'muscar-theme';

	function getDocumentTheme() {
		if (typeof document === 'undefined') {
			return 'dark';
		}

		return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
	}

	class ThemeController {
		theme = $state<Theme>(getDocumentTheme());

		setTheme(theme: Theme, persist = false) {
			this.theme = theme;

			if (typeof document !== 'undefined') {
				document.documentElement.dataset.theme = theme;
				document.documentElement.style.colorScheme = theme;
			}

			if (persist && typeof window !== 'undefined') {
				try {
					window.localStorage.setItem(themeStorageKey, theme);
				} catch (error) {
					void error;
				}
			}
		}

		toggleTheme = () => {
			this.setTheme(this.theme === 'dark' ? 'light' : 'dark', true);
		};
	}

	const themeController = new ThemeController();

	setContext('muscar-theme', themeController);

	let mobileMenuOpen = $state(false);

	function toggleMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	let { children, data }: LayoutProps = $props();

	onMount(() => {
		let savedTheme;

		try {
			savedTheme = window.localStorage.getItem(themeStorageKey);
		} catch {
			savedTheme = null;
		}

		const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

		themeController.setTheme(
			savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : prefersLight ? 'light' : 'dark'
		);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link
		href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
		rel="stylesheet"
	/>
	{#if data.umami.scriptUrl && data.umami.websiteId}
		<script defer src={data.umami.scriptUrl} data-website-id={data.umami.websiteId}></script>
	{/if}
</svelte:head>

<div class="muscar-root" data-theme={themeController.theme}>
	<!-- NAV -->
	<header class="nav-bar">
		<div class="nav-inner container">
			<a href="/" class="nav-logo" aria-label="Muscar home">
				<img src={logo} alt="Muscar" class="site-logo" draggable="false" />
			</a>

			<nav class="nav-links" aria-label="Primary navigation">
				<a href="/about" class="nav-link">About</a>
				<a href="/newsletter" class="nav-link">Newsletter</a>
				<a href="/contact" class="nav-link">Contact</a>
			</nav>

			<div class="nav-cta">
				<Button href="/survey" variant="default" class="cta-btn-nav">
					Take the Survey
					<IconArrowRight size={15} />
				</Button>
			</div>

			<button
				type="button"
				class="theme-toggle"
				onclick={themeController.toggleTheme}
				aria-label={themeController.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
				title={themeController.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
			>
				<span class="theme-toggle-icon" aria-hidden="true">
					{#if themeController.theme === 'dark'}
						<IconSun size={16} />
					{:else}
						<IconMoonStars size={16} />
					{/if}
				</span>
				<span class="theme-toggle-text">{themeController.theme === 'dark' ? 'Light' : 'Dark'}</span>
			</button>

			<button
				type="button"
				class="mobile-menu-btn"
				onclick={toggleMenu}
				aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={mobileMenuOpen}
			>
				{#if mobileMenuOpen}
					<IconX size={22} />
				{:else}
					<IconMenu2 size={22} />
				{/if}
			</button>
		</div>

		{#if mobileMenuOpen}
			<div class="mobile-menu" role="dialog" aria-label="Mobile navigation">
				<nav class="mobile-nav-links">
					<a href="/about" class="mobile-nav-link" onclick={toggleMenu}>About</a>
					<a href="/newsletter" class="mobile-nav-link" onclick={toggleMenu}>Newsletter</a>
					<a href="/contact" class="mobile-nav-link" onclick={toggleMenu}>Contact</a>
				</nav>
				<Button href="/survey" variant="default" class="cta-btn-mobile" onclick={toggleMenu}>
					Take the Survey
					<IconArrowRight size={15} />
				</Button>
			</div>
		{/if}
	</header>

	<main>
		{@render children()}
	</main>

	<!-- FOOTER -->
	<footer class="site-footer">
		<div class="footer-inner container">
			<div class="footer-brand">
				<a href="/" class="nav-logo" aria-label="Muscar home">
					<img src={logo} alt="Muscar" class="site-logo" draggable="false" />
				</a>
				<p class="footer-tag">Cutting through the AI noise for the trades.</p>
			</div>
			<nav class="footer-links" aria-label="Footer navigation">
				<a href="/about" class="footer-link">About</a>
				<a href="/survey" class="footer-link">Survey</a>
				<a href="/newsletter" class="footer-link">Newsletter</a>
				<a href="/contact" class="footer-link">Contact</a>
				<a href="/unsubscribe" class="footer-link">Unsubscribe</a>
			</nav>
			<p class="footer-copy">&copy; 2026 Muscar. All rights reserved.</p>
		</div>
	</footer>
</div>

<style>
	/* ── TOKENS ── */
	.container { max-width: var(--max-w); margin: 0 auto; padding: 0 clamp(1.25rem, 5vw, 2.5rem); }

	.site-logo {
		height: 1.8rem;
		width: auto;
		transition: filter 0.25s ease;
		user-select: none;
		-webkit-user-drag: none;
		pointer-events: none;
	}
	.muscar-root[data-theme='dark'] .site-logo {
		filter: invert(1);
	}

	.muscar-root {
		--font-display: 'Bebas Neue', sans-serif;
		--font-body: 'DM Sans', sans-serif;
		--radius-sm: 6px;
		--radius-md: 10px;
		--radius-lg: 16px;
		--max-w: 1160px;
		--section-pad: clamp(5rem, 10vw, 8rem);

		background: var(--bg);
		color: var(--text-primary);
		font-family: var(--font-body);
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		overflow-x: hidden;
		transition:
			background 0.25s ease,
			color 0.25s ease;
	}

	/* ── NAV ── */
	.nav-bar { position: sticky; top: 0; z-index: 100; background: var(--nav-bg); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid var(--bg-border); animation: nav-shadow linear both; animation-timeline: scroll(); }
	@keyframes nav-shadow { 0% { box-shadow: 0 0 0 rgba(0,0,0,0); border-bottom-color: transparent; } 5% { box-shadow: 0 10px 30px rgba(0,0,0,0.08); border-bottom-color: var(--bg-border); } 100% { box-shadow: 0 10px 30px rgba(0,0,0,0.08); border-bottom-color: var(--bg-border); } }
	.nav-inner { display: flex; align-items: center; height: 60px; gap: 2rem; }
	.nav-logo { display: flex; align-items: baseline; gap: 1px; text-decoration: none; flex-shrink: 0; transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
	.nav-logo:hover { transform: scale(1.05); }
	.nav-links { display: flex; gap: 0.25rem; margin-left: auto; }
	.nav-link { position: relative; font-size: 0.875rem; font-weight: 400; color: var(--text-secondary); text-decoration: none; padding: 0.4rem 0.75rem; border-radius: var(--radius-sm); transition: color 0.25s ease; }
	.nav-link::after { content: ''; position: absolute; bottom: 0.2rem; left: 50%; transform: translateX(-50%); width: 0; height: 2px; background: var(--accent); transition: width 0.3s cubic-bezier(0.23, 1, 0.32, 1); border-radius: 99px; }
	.nav-link:hover { color: var(--text-primary); }
	.nav-link:hover::after { width: 50%; }
	.nav-cta { flex-shrink: 0; }
	:global(.cta-btn-nav) { background: var(--accent) !important; color: var(--button-ink) !important; border-color: var(--accent) !important; font-weight: 600 !important; font-size: 0.82rem !important; display: flex !important; align-items: center !important; gap: 0.35rem !important; border-radius: var(--radius-sm) !important; }
	:global(.cta-btn-nav:hover) { background: var(--accent-dim) !important; border-color: var(--accent-dim) !important; }

	.theme-toggle { display: inline-flex; align-items: center; gap: 0.45rem; min-height: 2.25rem; border: 1px solid var(--bg-border-strong); border-radius: 999px; background: var(--surface-soft); color: var(--text-secondary); font-family: var(--font-body); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.02em; padding: 0.25rem 0.75rem 0.25rem 0.35rem; cursor: pointer; transition: border-color 0.18s, background 0.18s, color 0.18s, transform 0.15s; }
	.theme-toggle:hover { border-color: var(--accent); background: var(--accent-glow); color: var(--text-primary); transform: translateY(-1px); }
	.theme-toggle:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
	.theme-toggle-icon { display: grid; place-items: center; width: 1.55rem; height: 1.55rem; border-radius: 999px; background: var(--accent); color: var(--button-ink); box-shadow: 0 0 24px var(--accent-glow-strong); transition: transform 0.22s; }
	.theme-toggle:hover .theme-toggle-icon { transform: rotate(-12deg) scale(1.03); }

	.mobile-menu-btn { display: none; background: none; border: none; color: var(--text-primary); cursor: pointer; padding: 0.25rem; align-items: center; justify-content: center; }
	.mobile-menu { background: var(--bg-card); border-top: 1px solid var(--bg-border); padding: 1.25rem clamp(1.25rem, 5vw, 2.5rem) 1.5rem; }
	.mobile-nav-links { display: flex; flex-direction: column; gap: 0.1rem; margin-bottom: 1.25rem; }
	.mobile-nav-link { font-size: 1rem; font-weight: 400; color: var(--text-secondary); text-decoration: none; padding: 0.65rem 0.75rem; border-radius: var(--radius-sm); transition: color 0.18s, background 0.18s; }
	.mobile-nav-link:hover { color: var(--text-primary); background: var(--surface-hover); }
	:global(.cta-btn-mobile) { background: var(--accent) !important; color: var(--button-ink) !important; border-color: var(--accent) !important; font-weight: 600 !important; width: 100% !important; justify-content: center !important; }

	/* ── FOOTER ── */
	.site-footer { border-top: 1px solid var(--bg-border); padding: 2.5rem 0; margin-top: auto; }
	.footer-inner { display: flex; align-items: center; gap: 2rem; flex-wrap: wrap; }
	.footer-brand { display: flex; flex-direction: column; gap: 0.25rem; margin-right: auto; }
	.footer-tag { font-size: 0.78rem; color: var(--text-muted); margin: 0; }
	.footer-links { display: flex; gap: 0.25rem; flex-wrap: wrap; }
	.footer-link { font-size: 0.82rem; color: var(--text-muted); text-decoration: none; padding: 0.3rem 0.6rem; border-radius: var(--radius-sm); transition: color 0.18s; }
	.footer-link:hover { color: var(--text-primary); }
	.footer-copy { font-size: 0.78rem; color: var(--text-muted); margin: 0; }

	@media (max-width: 768px) {
		.nav-links, .nav-cta { display: none; }
		.theme-toggle { margin-left: auto; }
		.mobile-menu-btn { display: flex; }

		.footer-inner { flex-direction: column; align-items: flex-start; gap: 1.25rem; }
		.footer-brand { margin-right: 0; }
		.footer-copy { width: 100%; border-top: 1px solid var(--bg-border); padding-top: 1rem; }
	}

	@media (max-width: 500px) {
		.theme-toggle-text { display: none; }
		.theme-toggle { padding-right: 0.35rem; }
	}
</style>
