import type { CSSProperties, ReactNode } from 'react';

/** Layout helpers for stories only. */
export const row: CSSProperties = { display: 'flex', gap: 'var(--medo-space-4)', alignItems: 'center', flexWrap: 'wrap' };
export const stack: CSSProperties = { display: 'grid', gap: 'var(--medo-space-6)', maxInlineSize: '24rem' };

/** Renders the same content in Light and Dark side by side (data-theme islands). */
export function LightDark({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {(['light', 'dark'] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          style={{ display: 'grid', gap: 'var(--medo-space-6)', padding: 'var(--medo-space-8)', background: 'var(--medo-color-surface-default)', color: 'var(--medo-color-text-primary)' }}
        >
          <span className="medo-text-overline" style={{ color: 'var(--medo-color-text-secondary)' }}>
            {theme}
          </span>
          {children}
        </div>
      ))}
    </div>
  );
}
