---
name: color-theme
description: Apply Muscar's brand color palette (coral accent FC946D + a dark neutral ramp from 100F11 to 9A9DA1) to any UI, mockup, webpage, or design work. Use this whenever you're asked to build, style, theme, or mock up a webpage, dashboard, landing page, component, or app screen, in both light and dark mode, even if we don't explicitly say "use my palette" — this is our default brand theme. Also use when we asks for a CSS variables file, a Tailwind config, or a design system built around this palette.
---

# Muscar color theme

A 7-color palette with one warm accent and a dark neutral ramp. Works as a dark-native theme (the ramp is already dark-to-light) and extends naturally to light mode by inverting the roles.

## Palette

| Color | Hex | Note |
|---|---|---|
| Coral | `#FC946D` | The single accent — CTAs, links, active/selected states, focus rings |
| Near-black | `#100F11` | Darkest neutral |
| Charcoal | `#191B20` | |
| Dark slate | `#2E333A` | |
| Slate | `#3D434A` | |
| Mid gray | `#60666D` | |
| Light gray | `#9A9DA1` | Lightest neutral |

There is only **one** accent color in this palette. Never invent a second accent (no blues, greens, etc.) unless Victor explicitly asks for a semantic color (success/warning/danger) — in that case, borrow sparingly from standard semantic hues (green/amber/red) and keep them rare, secondary to coral.

## Dark mode role mapping (default / native mode)

| Role | Color |
|---|---|
| Page background | `#100F11` |
| Card / surface background | `#191B20` |
| Elevated surface, input fields, hover states | `#2E333A` |
| Borders, dividers, active surface | `#3D434A` |
| Secondary text, icons | `#60666D` |
| Muted text, placeholders | `#9A9DA1` |
| Primary body text | near-white, e.g. `#F5F4F3` (not pure white — avoid `#FFFFFF`, too much contrast against `#100F11`) |
| Accent (buttons, links, focus, active) | `#FC946D` |
| Text on coral fill | dark, e.g. `#100F11` or `#4A1B0C` (never white on coral) |

## Light mode role mapping

The dark ramp becomes text/border weight instead of background weight. Two near-white surfaces are added since the palette itself contains no light neutrals — use these:
- Page background: `#F5F4F2` (off-white, not pure white)
- Card surface: `#FFFFFF`

| Role | Color |
|---|---|
| Page background | `#F5F4F2` |
| Card surface | `#FFFFFF` |
| Primary text | `#100F11` |
| Secondary text | `#3D434A` |
| Muted text / captions | `#60666D` |
| Borders, dividers | `#9A9DA1` |
| Accent (buttons, links, focus) | `#782A0D` |
| Text on accent fill | `#F5F4F2` |
| Active/selected tint background | light coral tint `#FDE4D9` with darker coral text `#8A3413` |

## Usage rules

- **One accent only.** Coral (`#FC946D`) is used sparingly — primary CTAs, active nav items, links, focus rings, key highlights. It should never fill large background areas.
- **Never pure black or pure white for text/backgrounds.** Use `#100F11`/`#F5F4F3` (dark mode) or `#100F11`/`#F5F4F2`+`#FFFFFF` (light mode) instead — softer, matches the palette's character.
- **Borders are always subtle** — 0.5–1px, using the ramp step just above the surface it sits on (e.g. `#2E333A` surface → `#3D434A` border in dark mode; `#FFFFFF` surface → `#9A9DA1` border in light mode).
- **Text on colored fills**: always use a dark/darkened variant of that fill's own hue for the text, never plain black or white. For coral fills, use `#100F11` or a darkened coral like `#4A1B0C`.
- **Active/selected states** get a tinted background rather than a full accent fill — a light coral wash (`#FDE4D9`-style) with darker coral text, so it doesn't compete visually with primary buttons.
- When building interactive mockups (via the Imagine/Visualizer tool), pass these hex values directly inline rather than trying to force them through the tool's default `c-*` semantic ramps, since this is a fixed brand palette, not the tool's generic categorical colors.

## Output formats

If you're asked for a reusable implementation rather than a one-off mockup, prefer a CSS custom-properties file with light/dark values toggled via `[data-theme="dark"]` (or `prefers-color-scheme`), e.g.:

```css
:root {
  --bg-page: #F5F4F2;
  --bg-surface: #FFFFFF;
  --border: #9A9DA1;
  --text-primary: #100F11;
  --text-secondary: #3D434A;
  --text-muted: #60666D;
  --accent: #782A0D;
  --accent-text-on: #F5F4F2;
}

[data-theme="dark"] {
  --bg-page: #100F11;
  --bg-surface: #191B20;
  --border: #3D434A;
  --text-primary: #F5F4F3;
  --text-secondary: #9A9DA1;
  --text-muted: #60666D;
  --accent: #FC946D;
  --accent-text-on: #100F11;
}
```

Adapt variable names to whatever the target codebase already uses (Tailwind config, SCSS, etc.) rather than forcing this exact naming.

Check ./references/*.html for examples.