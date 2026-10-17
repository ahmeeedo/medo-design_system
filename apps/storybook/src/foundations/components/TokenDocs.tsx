/**
 * Documentation blocks that read the generated token lists.
 * Everything updates automatically when the tokens are rebuilt from Figma.
 */
import type { CSSProperties, ReactNode } from 'react';
import light from '@medo/design-tokens/docs/tokens.light.json';
import dark from '@medo/design-tokens/docs/tokens.dark.json';
import tablet from '@medo/design-tokens/src/layout/tablet.json';
import desktop from '@medo/design-tokens/src/layout/desktop.json';

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

const s = {
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14, lineHeight: 1.45 } as CSSProperties,
  th: { textAlign: 'left', fontWeight: 600, padding: '10px 16px', borderBottom: '1px solid #d0d7de', whiteSpace: 'nowrap' } as CSSProperties,
  td: { padding: '12px 16px', borderBottom: '1px solid #eaeef2', verticalAlign: 'top' } as CSSProperties,
  code: { fontFamily: 'var(--medo-font-family-mono)', fontSize: 12, wordBreak: 'break-all' } as CSSProperties,
  muted: { color: '#59636e', fontSize: 13 } as CSSProperties,
};

const Code = ({ children }: { children: ReactNode }) => <code style={s.code}>{children}</code>;

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
    <table style={s.table}>
      <thead>
        <tr>
          <th style={s.th}>Light</th>
          <th style={s.th}>Dark</th>
          <th style={s.th}>Token</th>
          <th style={s.th}>Light → Dark</th>
          <th style={s.th}>Usage</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((t) => {
          const d = darkByVar.get(t.cssVar)!;
          return (
            <tr key={t.cssVar}>
              <td style={s.td}><Swatch cssVar={t.cssVar} theme="light" /></td>
              <td style={s.td}><Swatch cssVar={t.cssVar} theme="dark" /></td>
              <td style={s.td}>
                <strong>{t.name}</strong>
                <br />
                <Code>{t.cssVar}</Code>
                <br />
                <Code>{tailwindHint(t)}</Code>
              </td>
              <td style={{ ...s.td, ...s.muted, whiteSpace: 'nowrap' }}>
                {t.ref ?? t.value}
                <br />
                {d.ref ?? d.value}
              </td>
              <td style={{ ...s.td, ...s.muted }}>{t.description}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const PRIMITIVE_GROUPS = ['brand', 'slate', 'red', 'amber', 'green', 'sky', 'violet', 'pink'];

export function Palette() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
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
                  <div style={{ ...s.code, fontSize: 10, color: '#59636e' }}>{String(t.value)}</div>
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
    <table style={s.table}>
      <thead>
        <tr>
          <th style={s.th}>Sample</th>
          <th style={s.th}>Style</th>
        </tr>
      </thead>
      <tbody>
        {styles.map((t) => {
          const name = t.path.slice(1).join('-');
          return (
            <tr key={t.cssVar}>
              <td style={{ ...s.td, width: '60%' }}>
                {/* sb-unstyled: keeps Storybook's docs styles away from the sample. */}
                <div className="sb-unstyled">
                  <span className={`medo-text-${name}`}>Design for everyone</span>
                </div>
              </td>
              <td style={s.td}>
                <strong>{t.name.replace('typography/', '')}</strong>
                <br />
                <Code>.medo-text-{name}</Code>
                <br />
                <Code>text-{name}</Code>
                <br />
                <span style={s.muted}>{String(t.value)}</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* ---------- Spacing, radius, sizes ---------- */

const byGroup = (...path: string[]) => L.filter((t) => path.every((p, i) => t.path[i] === p));

export function SpacingScale() {
  return (
    <table style={s.table}>
      <thead>
        <tr>
          <th style={s.th}>Token</th>
          <th style={s.th}>Value</th>
          <th style={s.th}>Tailwind</th>
          <th style={s.th} />
        </tr>
      </thead>
      <tbody>
        {byGroup('space').map((t) => (
          <tr key={t.cssVar}>
            <td style={s.td}><strong>{t.name}</strong><br /><Code>{t.cssVar}</Code></td>
            <td style={{ ...s.td, ...s.muted }}>{String(t.value)}</td>
            <td style={s.td}><Code>p-{t.path[1].replace('-', '.')}</Code></td>
            <td style={{ ...s.td, width: '40%' }}>
              <div style={{ height: 16, width: `var(${t.cssVar})`, background: 'var(--medo-color-action-primary)', borderRadius: 2 }} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Radii() {
  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      {byGroup('radius').map((t) => (
        <div key={t.cssVar} style={{ textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, background: 'var(--medo-color-surface-brand-muted)', border: '2px solid var(--medo-color-action-primary)', borderRadius: `var(${t.cssVar})` }} />
          <div style={{ fontSize: 13, marginTop: 6, fontWeight: 600 }}>{t.name}</div>
          <div style={{ ...s.code }}>rounded-{t.path[1]}</div>
          <div style={s.muted}>{String(t.value)}</div>
        </div>
      ))}
    </div>
  );
}

export function SimpleTable({ path }: { path: string[] }) {
  return (
    <table style={s.table}>
      <thead>
        <tr>
          <th style={s.th}>Token</th>
          <th style={s.th}>CSS variable</th>
          <th style={s.th}>Value</th>
        </tr>
      </thead>
      <tbody>
        {byGroup(...path).map((t) => (
          <tr key={t.cssVar}>
            <td style={s.td}><strong>{t.name}</strong>{t.description ? <div style={s.muted}>{t.description}</div> : null}</td>
            <td style={s.td}><Code>{t.cssVar}</Code></td>
            <td style={{ ...s.td, ...s.muted }}>{String(t.value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

type LayoutFile = Record<string, Record<string, { $value: number | { value: number; unit: string } }>>;
const lv = (f: LayoutFile, k: string) => {
  const v = f.layout[k].$value;
  return typeof v === 'number' ? String(v) : `${v.value}${v.unit}`;
};

export function LayoutTable() {
  const keys = ['columns', 'gutter', 'margin', 'section'];
  const mobile = Object.fromEntries(byGroup('layout').map((t) => [t.path[1], String(t.value)]));
  return (
    <table style={s.table}>
      <thead>
        <tr>
          <th style={s.th}>Token</th>
          <th style={s.th}>Mobile (&lt; 640)</th>
          <th style={s.th}>Tablet (≥ 640)</th>
          <th style={s.th}>Desktop (≥ 1024)</th>
        </tr>
      </thead>
      <tbody>
        {keys.map((k) => (
          <tr key={k}>
            <td style={s.td}><strong>layout/{k}</strong><br /><Code>--medo-layout-{k}</Code></td>
            <td style={{ ...s.td, ...s.muted }}>{mobile[k]}</td>
            <td style={{ ...s.td, ...s.muted }}>{lv(tablet as LayoutFile, k)}</td>
            <td style={{ ...s.td, ...s.muted }}>{lv(desktop as LayoutFile, k)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ---------- Elevation & motion ---------- */

export function Elevation() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: 12, overflow: 'hidden' }}>
      {(['light', 'dark'] as const).map((theme) => (
        <div key={theme} data-theme={theme} style={{ display: 'flex', gap: 24, flexWrap: 'wrap', padding: 32, background: 'var(--medo-color-surface-canvas)' }}>
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
              <div style={{ ...s.code, color: 'var(--medo-color-text-secondary)' }}>shadow-{t.path.slice(1).join('-')}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function Motion() {
  return (
    <>
      <SimpleTable path={['motion', 'duration']} />
      <div style={{ height: 16 }} />
      <SimpleTable path={['motion', 'easing']} />
    </>
  );
}
