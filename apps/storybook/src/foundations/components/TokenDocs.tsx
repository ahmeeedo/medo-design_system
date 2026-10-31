/**
 * Documentation blocks that read the generated token lists.
 * Everything updates automatically when the tokens are rebuilt.
 */
import { useState, type ReactNode } from 'react';
import { Button, StaticTable } from '@med-o/ui';
import light from '@med-o/design-tokens/docs/tokens.light.json';
import dark from '@med-o/design-tokens/docs/tokens.dark.json';
import tablet from '@med-o/design-tokens/src/layout/tablet.json';
import desktop from '@med-o/design-tokens/src/layout/desktop.json';

type Token = {
  name: string;
  path: string[];
  type: string;
  cssVar: string;
  value: string | number;
  ref?: string;
  description?: string;
};

const L = light as Token[];
const D = dark as Token[];
const darkByVar = new Map(D.map((t) => [t.cssVar, t]));

/* ---------- small building blocks ---------- */

const Code = ({ children }: { children: ReactNode }) => <code className="doc-mono">{children}</code>;
/** Token lists use the library table (StaticTable). */
const Table = ({ children }: { children: ReactNode }) => <StaticTable>{children}</StaticTable>;

function Swatch({ cssVar, theme, size = 40 }: { cssVar: string; theme: 'light' | 'dark'; size?: number }) {
  // A data-theme island: shows the token exactly as it renders in that theme.
  return (
    <div
      data-theme={theme}
      title={`${theme}`}
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        padding: 4,
        background: theme === 'dark' ? 'var(--medo-color-surface-default)' : 'var(--medo-color-surface-default)',
        boxShadow: 'inset 0 0 0 1px rgba(127,127,127,.35)',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ width: '100%', height: '100%', borderRadius: 5, background: `var(${cssVar})` }} />
    </div>
  );
}

const tailwindHint = (t: Token) => {
  const name = t.path.slice(1).join('-');
  const g = t.path[1];
  if (g === 'text') return `text-${name}`;
  if (g === 'border' || g === 'focus') return `border-${name}`;
  if (g === 'shadow') return `(used by shadow-*)`;
  return `bg-${name}`;
};

/* ---------- Colors ---------- */

export function SemanticColors({ groups }: { groups: string[] }) {
  const tokens = L.filter((t) => t.type === 'color' && groups.includes(t.path[1]) && darkByVar.has(t.cssVar));
  return (
    <Table>
      <thead>
        <tr>
          <th>Light</th>
          <th>Dark</th>
          <th>Token</th>
          <th>Light → Dark</th>
          <th>Usage</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((t) => {
          const d = darkByVar.get(t.cssVar)!;
          return (
            <tr key={t.cssVar}>
              <td><Swatch cssVar={t.cssVar} theme="light" /></td>
              <td><Swatch cssVar={t.cssVar} theme="dark" /></td>
              <td>
                <strong>{t.name}</strong>
                <br />
                <Code>{t.cssVar}</Code>
                <br />
                <Code>{tailwindHint(t)}</Code>
              </td>
              <td className="doc-cell-muted" style={{ whiteSpace: 'nowrap' }}>
                {t.ref ?? t.value}
                <br />
                {d.ref ?? d.value}
              </td>
              <td className="doc-cell-muted">{t.description}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

const PRIMITIVE_GROUPS = ['brand', 'slate', 'red', 'amber', 'green', 'sky', 'violet', 'pink'];

export function Palette() {
  return (
    <div style={{ display: 'grid', gap: 'var(--medo-layout-gap-content)' }}>
      {PRIMITIVE_GROUPS.map((g) => {
        const tokens = L.filter((t) => t.path[0] === 'color' && t.path[1] === g);
        return (
          <div key={g}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{g}</div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${tokens.length}, 1fr)`, gap: 4 }}>
              {tokens.map((t) => (
                <div key={t.cssVar}>
                  <div style={{ height: 40, borderRadius: 6, background: `var(${t.cssVar})`, boxShadow: 'inset 0 0 0 1px rgba(127,127,127,.25)' }} />
                  <div style={{ fontSize: 11, marginTop: 4 }}>{t.path[2]}</div>
                  <div className="doc-mono" style={{ fontSize: 10 }}>{String(t.value)}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Typography ---------- */

export function TypeScale() {
  const styles = L.filter((t) => t.type === 'typography' && !t.path.includes('avatar'));
  return (
    <Table>
      <thead>
        <tr>
          <th>Sample</th>
          <th>Style</th>
        </tr>
      </thead>
      <tbody>
        {styles.map((t) => {
          const name = t.path.slice(1).join('-');
          return (
            <tr key={t.cssVar}>
              <td style={{ width: '60%' }}>
                {/* sb-unstyled: keeps Storybook's docs styles away from the sample. */}
                <div className="sb-unstyled">
                  <span className={`medo-text-${name}`}>Design for everyone</span>
                </div>
              </td>
              <td>
                <strong>{t.name.replace('typography/', '')}</strong>
                <br />
                <Code>.medo-text-{name}</Code>
                <br />
                <Code>text-{name}</Code>
                <br />
                <span className="doc-cell-muted">{String(t.value)}</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

/* ---------- Spacing, radius, sizes ---------- */

const byGroup = (...path: string[]) => L.filter((t) => path.every((p, i) => t.path[i] === p));

export function SpacingScale() {
  return (
    <Table>
      <thead>
        <tr>
          <th>Token</th>
          <th>Value</th>
          <th>Tailwind</th>
          <th><span className="medo-visually-hidden">Preview</span></th>
        </tr>
      </thead>
      <tbody>
        {byGroup('space').map((t) => (
          <tr key={t.cssVar}>
            <td><strong>{t.name}</strong><br /><Code>{t.cssVar}</Code></td>
            <td className="doc-cell-muted">{String(t.value)}</td>
            <td><Code>p-{t.path[1].replace('-', '.')}</Code></td>
            <td style={{ width: '40%' }}>
              <div style={{ height: 16, width: `var(${t.cssVar})`, background: 'var(--medo-color-action-primary)', borderRadius: 2 }} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export function Radii() {
  return (
    <div style={{ display: 'flex', gap: 'var(--medo-layout-gap-items)', flexWrap: 'wrap' }}>
      {byGroup('radius').map((t) => (
        <div key={t.cssVar} style={{ textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, background: 'var(--medo-color-surface-brand-muted)', border: '2px solid var(--medo-color-action-primary)', borderRadius: `var(${t.cssVar})` }} />
          <div style={{ fontSize: 13, marginTop: 6, fontWeight: 600 }}>{t.name}</div>
          <div className="doc-mono">rounded-{t.path[1]}</div>
          <div className="medo-text-caption doc-muted">{String(t.value)}</div>
        </div>
      ))}
    </div>
  );
}

export function SimpleTable({ path, format = (t) => String(t.value) }: { path: string[]; format?: (t: Token) => string }) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Token</th>
          <th>CSS variable</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {byGroup(...path).map((t) => (
          <tr key={t.cssVar}>
            <td><strong>{t.name}</strong>{t.description ? <div className="doc-cell-muted" style={{ fontWeight: 400 }}>{t.description}</div> : null}</td>
            <td><Code>{t.cssVar}</Code></td>
            <td className="doc-cell-muted">{format(t)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

type LayoutValue = number | string | { value: number; unit: string };
type LayoutFile = { layout: Record<string, { $value: LayoutValue } | Record<string, { $value: LayoutValue }>> };
const tabletLayout = tablet as unknown as LayoutFile;
const desktopLayout = desktop as unknown as LayoutFile;
const remToPx = (v: string) => (v.endsWith('rem') ? `${parseFloat(v) * 16}px` : v === '0' ? '0px' : v);

/** A layout value of one mode in px. Aliases ({space.6}, {layout.gutter}) are resolved. */
function layoutPx(f: LayoutFile, path: string[]): string {
  const node = path.reduce<unknown>((n, k) => (n as Record<string, unknown>)?.[k], f) as { $value: LayoutValue };
  const v = node.$value;
  if (typeof v === 'number') return String(v);
  if (typeof v === 'object') return `${v.value}${v.unit}`;
  const ref = v.slice(1, -1).split('.');
  if (ref[0] === 'layout') return layoutPx(f, ref);
  const t = L.find((x) => x.path.join('.') === ref.join('.'));
  return t ? remToPx(String(t.value)) : v;
}

export function LayoutTable() {
  const keys = ['columns', 'gutter', 'margin', 'section'];
  const mobile = Object.fromEntries(byGroup('layout').map((t) => [t.path[1], String(t.value)]));
  return (
    <Table>
      <thead>
        <tr>
          <th>Token</th>
          <th>Mobile (&lt; 640)</th>
          <th>Tablet (≥ 640)</th>
          <th>Desktop (≥ 1024)</th>
        </tr>
      </thead>
      <tbody>
        {keys.map((k) => (
          <tr key={k}>
            <td><strong>layout/{k}</strong><br /><Code>--medo-layout-{k}</Code></td>
            <td className="doc-cell-muted">{k === 'columns' ? mobile[k] : remToPx(mobile[k])}</td>
            <td className="doc-cell-muted">{layoutPx(tabletLayout, ['layout', k])}</td>
            <td className="doc-cell-muted">{layoutPx(desktopLayout, ['layout', k])}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

const rules: [string, string, string][] = [
  ['inline', 'Side by side in one group', 'Buttons, tags, filters, icon + label groups'],
  ['content', 'Inside one block', 'Heading → text → actions, paragraphs, a card’s content'],
  ['fields', 'Form fields below each other', 'Text fields, selects, checkbox groups in a form'],
  ['items', 'Cards and tiles in a grid or list', 'Card grids, tile lists – equals the layout gutter'],
  ['group', 'Groups inside a section', 'Sub-sections, fieldsets, a block of cards under its heading'],
  ['section', 'Sections of a page', 'Hero, features, FAQ … – equals layout/section'],
];

/** The six spacing rules with their values per layout mode and a bar at the current width. */
export function SpacingRules() {
  return (
    <Table>
      <thead>
        <tr>
          <th>Rule</th>
          <th>Use for</th>
          <th>Mobile</th>
          <th>Tablet</th>
          <th>Desktop</th>
          <th>Now</th>
        </tr>
      </thead>
      <tbody>
        {rules.map(([k, title, examples]) => (
          <tr key={k}>
            <td>
              <strong>{k}</strong>
              <br />
              <Code>{`gap="${k}"`}</Code>
              <br />
              <Code>{`gap-${k}`}</Code>
            </td>
            <td>
              {title}
              <br />
              <span className="doc-cell-muted">{examples}</span>
            </td>
            <td className="doc-cell-muted">{remToPx(String(byGroup('layout', 'gap', k)[0]?.value))}</td>
            <td className="doc-cell-muted">{layoutPx(tabletLayout, ['layout', 'gap', k])}</td>
            <td className="doc-cell-muted">{layoutPx(desktopLayout, ['layout', 'gap', k])}</td>
            <td>
              <span
                aria-hidden="true"
                style={{ display: 'block', inlineSize: `var(--medo-layout-gap-${k})`, blockSize: 'var(--medo-space-3)', background: 'var(--medo-color-action-primary)', borderRadius: 'var(--medo-radius-sm)' }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

/* ---------- Elevation & motion ---------- */

export function Elevation() {
  return (
    <div className="doc-stages" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))' }}>
      {(['light', 'dark'] as const).map((theme) => (
        <div key={theme} data-theme={theme} className="doc-stage" style={{ background: 'var(--medo-color-surface-canvas)' }}>
          <span className="doc-stage-label medo-text-code-sm">{theme}</span>
          <div style={{ display: 'flex', gap: 'var(--medo-layout-gap-items)', flexWrap: 'wrap' }}>
            {byGroup('shadow').map((t) => (
              <div
                key={t.cssVar}
                style={{
                  width: 120,
                  height: 88,
                  padding: 12,
                  boxSizing: 'border-box',
                  borderRadius: 12,
                  background: 'var(--medo-color-surface-raised)',
                  color: 'var(--medo-color-text-primary)',
                  boxShadow: `var(${t.cssVar})`,
                  fontSize: 13,
                }}
              >
                <strong>{t.path.slice(1).join('/')}</strong>
                <div style={{ fontFamily: 'var(--medo-font-family-mono)', fontSize: 11, color: 'var(--medo-color-text-secondary)' }}>shadow-{t.path.slice(1).join('-')}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Springs: the linear() curve is long – show its size, the CSS variable holds the full curve. */
const springValue = (t: Token) => (String(t.value).startsWith('linear(') ? `linear() · ${String(t.value).split(',').length} points` : String(t.value));

const curves = [
  { name: 'easing/standard', timing: 'var(--medo-motion-duration-slow) var(--medo-motion-easing-standard)' },
  { name: 'easing/enter', timing: 'var(--medo-motion-duration-slow) var(--medo-motion-easing-enter)' },
  { name: 'easing/exit', timing: 'var(--medo-motion-duration-slow) var(--medo-motion-easing-exit)' },
  { name: 'spring/smooth', timing: 'var(--medo-motion-spring-smooth-duration) var(--medo-motion-spring-smooth)' },
  { name: 'spring/snappy', timing: 'var(--medo-motion-spring-snappy-duration) var(--medo-motion-spring-snappy)' },
];

/** Live comparison: every curve moves the same distance; easings run motion/duration/slow, springs their settle time. */
function MotionPlayground() {
  const [on, setOn] = useState(false);
  return (
    <div className="doc-stage" style={{ display: 'grid', gap: 'var(--medo-layout-gap-content)' }}>
      <div>
        <Button size="sm" variant="secondary" onPress={() => setOn((v) => !v)}>
          {on ? 'Play back' : 'Play'}
        </Button>
      </div>
      {curves.map((c) => (
        <div key={c.name} style={{ display: 'grid', gridTemplateColumns: '9rem 1fr', alignItems: 'center', gap: 16 }}>
          <code className="doc-mono">{c.name}</code>
          <div style={{ position: 'relative', height: 24, borderRadius: 12, background: 'var(--medo-color-surface-subtle)' }}>
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                insetBlock: 2,
                insetInlineStart: on ? 'calc(100% - 22px)' : 2,
                width: 20,
                borderRadius: 10,
                background: 'var(--medo-color-action-primary)',
                transition: `inset-inline-start ${c.timing}`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Motion() {
  return (
    <>
      <MotionPlayground />
      <div style={{ height: 16 }} />
      <SimpleTable path={['motion', 'duration']} />
      <div style={{ height: 16 }} />
      <SimpleTable path={['motion', 'easing']} />
      <div style={{ height: 16 }} />
      <SimpleTable path={['motion', 'spring']} format={springValue} />
    </>
  );
}
