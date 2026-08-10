# medo Design System — Locked Decisions

Design System für medo, schrittweise mit dem Inhaber gebaut. Jede Entscheidung wurde einzeln bestätigt. Oberflächensprache Deutsch.

## Principles (6, warm tone) — LOCKED
1. Klarheit vor Dekoration
2. Für alle gemacht (WCAG 2.2 AA baseline)
3. Einmal entschieden, überall verlässlich (tokens)
4. Freundlich und menschlich
5. Ein System, viele Produkte
6. Der Inhalt führt

## Color — LOCKED. Prefix `medo`. OKLCH source + HEX fallback. Light mode only (built to allow dark later).
3-tier token architecture:
- **Brand (Ebene 1)** — raw scales, 12 steps each: 50,100,200,300,400,500,600,700,800,900,1000,1100. 600 = main/solid color.
  Colors: red crimson rose orange amber yellow green teal cyan blue indigo violet purple + `grey` (pure neutral) + `stone` (warm neutral). Plus absolute `white` #fff, `black` #000.
- **Alias (Ebene 2)** — role → brand: primary→teal, neutral→grey, neutral-alt→stone, error→red, warning→amber, success→green, info→blue. No secondary.
- **Semantic (Ebene 3)** — Material-style names. Base neutral = `stone` (warm). Base surface = white.

### Color generation (the exact algorithm — reuse in every component file)
chromaIntensity ci = 1.25. Scale hues & chroma peaks:
- stone: hue 70, c 0.013 ; primary(teal): hue 185, c 0.115 ; error(red): hue 27, c 0.15 ; success(green): hue 150, c 0.14 ; info(blue): hue 250, c 0.15
- warning(amber): hue 55, c 0.128, CUSTOM ramps: lRamp=[0.978,0.952,0.914,0.872,0.818,0.746,0.665,0.592,0.505,0.418,0.342,0.280], cmRamp=[0.12,0.24,0.40,0.58,0.76,0.90,1.00,0.98,0.90,0.75,0.58,0.45]
- default lRamp=[0.976,0.942,0.888,0.822,0.748,0.655,0.470,0.405,0.348,0.300,0.252,0.198]
- default cmRamp=[0.05,0.10,0.16,0.24,0.34,0.45,1.00,0.95,0.80,0.62,0.45,0.30]
Peak chroma passed to makeScale = c * ci.
Yellow/orange/amber use lighter custom ramps to avoid brown (yellow anchor #d48d09 at 600).

### Key semantic tokens (Ebene 3)
- surface=white, surface-container=stone-50, surface-container-high=stone-100, surface-sunken=stone-100, surface-hover=stone-100, surface-selected=primary-100, overlay=white
- text=stone-1000, text-muted=stone-1000 @68% (transparent!), text-subtle=stone-800, text-on-primary=white, text-disabled=stone-500, text-link=primary-600, text-link-hover=primary-800
- icon=stone-900, icon-muted=stone-1000 @55% (transparent!), icon-on-primary=white, icon-disabled=stone-500
- border=stone-300, border-strong=stone-500, border-subtle=stone-200, border-disabled=stone-200
- input-bg=white, input-bg-disabled=stone-100, input-text=stone-1000, input-placeholder=stone-600, input-border=stone-400 (user chose light on purpose), input-border-hover=stone-600, input-border-focus=primary-600, input-border-error=error-600, input-border-disabled=stone-200
- action=primary-600, action-hover=primary-700, action-active=primary-800, action-disabled=stone-200, action-text=white, action-text-disabled=stone-500
- action-neutral=stone-100, action-neutral-hover=stone-200, action-neutral-active=stone-300, action-neutral-text=stone-1000
- focus-ring=primary-600 (rendered as 3px ring at ~35% alpha, hex+59), state-hover=stone-100, state-pressed=stone-200, state-selected=primary-100, selection=primary-200
- Status sets (success/warning/error/info): -surface=50, -text=1000, -border=300, -solid=600, -solid-hover=700, -solid-active=800, -on-solid: white EXCEPT warning-on-solid=stone-1000 (amber too light for white text)
- divider=stone-200, scrim=rgba(23,21,19,0.5)

## Typography — LOCKED
- Fonts: DM Sans (sans, body/UI/headings) + DM Mono (mono, code/data/labels). Max 2 families.
- Scale ratio 1.25, base 16px, T-shirt names:
  text-xs 12/1.5, text-sm 14/1.45, text-base 16/1.6, text-lg 20/1.5, text-xl 25/1.35, text-2xl 31/1.25, text-3xl 39/1.15, text-4xl 49/1.1
- Weights: regular 400, medium 500, semibold 600, bold 700
- Leading: tight 1.1, snug 1.3, normal 1.5, relaxed 1.6
- Tracking: tight -0.02em, normal 0, wide 0.04em. Headings ≥25px use -0.02em.

## Foundations — LOCKED
- Spacing base 4px, T-shirt: space-none 0, 3xs 2, 2xs 4, xs 8, sm 12, md 16, lg 24, xl 32, 2xl 48, 3xl 64, 4xl 96
- Radii: none 0, sm 4, md 8, lg 12, xl 18, 2xl 24, full 9999
- Elevation (warm soft shadows, base rgba(31,29,26,...)):
  shadow-sm: 0 1px 2px rgba(31,29,26,0.06), 0 1px 3px rgba(31,29,26,0.04)
  shadow-md: 0 2px 4px rgba(31,29,26,0.06), 0 6px 16px rgba(31,29,26,0.07)
  shadow-lg: 0 4px 8px rgba(31,29,26,0.06), 0 14px 32px rgba(31,29,26,0.10)
  shadow-xl: 0 8px 18px rgba(31,29,26,0.08), 0 28px 60px rgba(31,29,26,0.16)
- Borders: thin 1px, thick 2px. Grid 12-col, gutter 24, container max 1200. Breakpoints sm 640, md 768, lg 1024, xl 1280, 2xl 1536.

## Icons — LOCKED
ONLY Material Symbols Rounded, weight 300, FILL 0. Never inline SVG icons.
`<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,300,0,0" rel="stylesheet">`
Usage: `<span style="font-family:'Material Symbols Rounded';font-weight:300;font-size:18px;line-height:1">icon_name</span>`
In React: `<Icon name="search" size={18} />` aus `ui/Icon.jsx`.

## Build conventions
- Hit targets ≥44px where relevant. All combos WCAG AA checked.
- Rule: interactive field-icons (Clear/Password/Copy) = icon-button look (resting stone-100, hover stone-200, aria-label). Decorative icons flat.
- Rule: Chips/Tags always radius-full (9999px).
- Rule: Link hover/active changes COLOR only (text-link → text-link-hover). Underline presence never changes on hover (standalone stays without, inline stays with), and underline thickness stays 1px in every state.
- Rule: Button labels are font-weight 400 (Regular) — all variants and sizes. Applies to every button-shaped control.
- Rule: Button sizes stay on the type scale — sm = text-xs 12, md = text-sm 14, lg = text-base 16. No in-between values like 13px anywhere in the system.
- Rule: focus-ring is primary-600 everywhere, EXCEPT the danger/destructive variant, which uses error-600 at the same 35% alpha (token `--medo-focus-ring-danger`). Approved exception. Error-state fields use the same danger ring on focus.
- Rule: field borders are ALWAYS border-thin 1px — resting and focus alike, so nothing shifts; focus is carried by the 3px ring, not by a thicker border. Applies to TextInput, Select, Checkbox, Radio, Search, NumberInput, list checkboxes. 1.5px is gone project-wide. border-thick 2px stays reserved for selected/active indicators (tab underline, stepper rail).
- Rule: field horizontal padding is space-sm 12px, field text sm=14 / md=16 / lg=16.
- Rule: Checkbox uses radius-sm 4px. Checkbox/Radio box 18px (sm) / 20px (md), Radio dot 9px / 10px. Labels text-sm 14. No half-pixel type sizes anywhere; mono micro-labels sit at 11px or 12px.

## Repo conventions in diesem Projekt
- `ui/<Name>.jsx` schreibt in `React.createElement` (kein JSX-Syntax), exportiert per `export { Name }` und registriert sich zusätzlich unter `window.MedoUI`.
- Jede Komponente hat `<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md`, `<Name>.card.html`.
- Karten laden `styles.css`, React UMD und `_ds_bundle.js` — niemals `.jsx` direkt.
