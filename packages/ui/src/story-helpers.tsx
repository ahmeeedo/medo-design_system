import type { CSSProperties, ReactNode } from 'react';
import { expect, waitFor } from 'storybook/test';

/** Layout helpers for stories only. */
export const row: CSSProperties = { display: 'flex', gap: 'var(--medo-layout-gap-inline)', alignItems: 'center', flexWrap: 'wrap' };
export const stack: CSSProperties = { display: 'grid', gap: 'var(--medo-layout-gap-fields)', maxInlineSize: '24rem' };

/** Small mono caption above an example (“md”, “collapsed · sm”). */
export const caption: CSSProperties = { font: 'var(--medo-typography-code-sm)', color: 'var(--medo-color-text-secondary)' };

/**
 * Several examples under each other, rule `group` apart. Give each a caption with Example. The theme comes from the
 * toolbar switch (Light / Dark).
 */
export function Examples({ children }: { children: ReactNode }) {
  return <div style={{ display: 'grid', gap: 'var(--medo-layout-gap-group)' }}>{children}</div>;
}

/** One example with its caption: the caption sits with its example (rule `content`), not between two. */
export function Example({ label, children, style }: { label: ReactNode; children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--medo-layout-gap-content)', ...style }}>
      <span style={caption}>{label}</span>
      {children}
    </div>
  );
}

/** The state attributes of the CSS contract (React Aria sets them; other frameworks set the same). */
export const STATE_ATTRIBUTES = {
  Default: {},
  Hover: { 'data-hovered': '' },
  Pressed: { 'data-pressed': '' },
  Focus: { 'data-focus-visible': '' },
} as const;

/**
 * Every state of a component as a picture: one row per state, the variants next to each other. Rendered as plain
 * HTML with the state attributes – the CSS works without React. Inert: keyboard and screen readers skip it, the
 * Playground is the one to try.
 */
export function StateGrid({ states }: { states: [label: string, content: ReactNode][] }) {
  return (
    <div inert>
      <Examples>
        {states.map(([label, content]) => (
          <Example key={label} label={label}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--medo-layout-gap-items)' }}>{content}</div>
          </Example>
        ))}
      </Examples>
    </div>
  );
}

/* ---------- Playground controls (rule: a control must change what you see) ---------- */

/**
 * Props without a visual effect (heading level, screen-reader text, ARIA): listed in the
 * props table in their own group, but without a control.
 */
export const semantic = { control: false, table: { category: 'Semantics (no visual change)' } } as const;

/**
 * Slot prop (media, icons, actions …) as a select with sample content.
 * Storybook maps the chosen key to the element. Put 'none' first.
 */
export const slot = (mapping: Record<string, unknown>) => ({ control: 'select', options: Object.keys(mapping), mapping }) as const;

/* ---------- Sample media (inline SVG, no network) ---------- */

const scenes = [
  { sky: '#4d7387', hill: '#2c4450', sun: '#f3e3b0' },
  { sky: '#3b4f5c', hill: '#24343c', sun: '#d9c38e' },
  { sky: '#6f8f9c', hill: '#3d5560', sun: '#fbe7c0' },
];

/** A landscape “photo” as data URI (sample image). `tiny` gives a ≈ 20 px blur-up preview. */
export function samplePhoto(variant = 0, { width = 1600, height = 900, tiny = false } = {}) {
  const { sky, hill, sun } = scenes[variant % scenes.length];
  const w = tiny ? 20 : width;
  const h = tiny ? Math.round((20 * height) / width) : height;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky}"/><stop offset="1" stop-color="#0f1a1f"/></linearGradient><radialGradient id="s"><stop offset="0" stop-color="${sun}" stop-opacity=".55"/><stop offset="1" stop-color="${sun}" stop-opacity="0"/></radialGradient></defs><rect width="160" height="90" fill="url(#g)"/><circle cx="112" cy="38" r="26" fill="url(#s)"/><circle cx="112" cy="38" r="8" fill="${sun}"/><path d="M0 58 L30 50 L52 55 L80 46 L110 54 L160 50 V90 H0Z" fill="${hill}"/><path d="M0 72 L44 64 L90 70 L160 63 V90 H0Z" fill="#0b1316"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** A “screenshot” (UI with text lines) – shows why screenshots use fit contain. */
export function sampleScreenshot() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 120 120"><rect width="120" height="120" rx="4" fill="#ffffff"/><rect width="120" height="14" fill="#e9eef3"/><circle cx="8" cy="7" r="2.5" fill="#d96b6b"/><circle cx="15" cy="7" r="2.5" fill="#e7c06a"/><circle cx="22" cy="7" r="2.5" fill="#6bbf8a"/><rect x="10" y="24" width="60" height="6" rx="2" fill="#1d2b33"/><rect x="10" y="36" width="100" height="4" rx="2" fill="#9aa7b2"/><rect x="10" y="44" width="92" height="4" rx="2" fill="#9aa7b2"/><rect x="10" y="58" width="46" height="40" rx="3" fill="#0f5b4f"/><rect x="62" y="58" width="48" height="40" rx="3" fill="#e9eef3"/><rect x="10" y="106" width="100" height="6" rx="3" fill="#0f5b4f"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/* ---------- Interaction tests ---------- */

/**
 * A story with a play function that checks the core behaviour. Runs in Vitest (npm test, CI) and shows its steps in
 * the Interactions panel; it is not part of the docs page.
 */
export const interactionTest: { name: string; tags: string[] } = { name: 'Interaction test', tags: ['!autodocs'] };

/**
 * Changes the size of the browser window during a test (Vitest only; in Storybook nothing happens – resize the
 * window by hand there). Resolves after the browser has laid out the new size.
 */
export async function resizeViewport(width: number, height = 900) {
  const test = (globalThis as { __medoTest?: { resize: (width: number, height: number) => Promise<void> } }).__medoTest;
  if (!test) return false;
  await test.resize(width, height);
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  return true;
}

/** True when the page scrolls sideways – content wider than the window. */
export const overflowsHorizontally = () => document.documentElement.scrollWidth > document.documentElement.clientWidth;

/**
 * Waits until no overlay is still animating in (React Aria sets data-entering). Press keys or click in a dialog, sheet or
 * popover only after that: WebKit on a busy runner dropped an Esc or a click sent during the opening animation.
 */
export const overlaysSettled = () => waitFor(() => expect(document.querySelector('[data-entering]')).toBeNull());
