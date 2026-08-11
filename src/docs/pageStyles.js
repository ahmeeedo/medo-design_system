/* Shared type and layout classes for the foundation pages. All values come from
   --medo-* tokens; nothing here is a raw pixel value. */

export const PROSE = 'text-[var(--medo-text-muted)] [font-family:var(--medo-font-sans)] [font-size:var(--medo-text-base)] [line-height:var(--medo-leading-relaxed)]'

export const LIST = `${PROSE} list-disc pl-[var(--medo-space-lg)] space-y-[var(--medo-space-3xs)]`

export const CAPTION = '[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] text-[var(--medo-text-muted)]'

export const EYEBROW = `${CAPTION} uppercase tracking-[var(--medo-tracking-wide)] mb-[var(--medo-space-sm)]`

export const SUBHEAD = '[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-lg)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mt-[var(--medo-space-lg)] mb-[var(--medo-space-sm)]'

export const CARD = 'bg-[var(--medo-surface)] border border-[var(--medo-border-subtle)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]'

export const ROW = 'flex flex-wrap items-center gap-[var(--medo-space-lg)]'

export const MONO_VALUE = '[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-sm)] text-[var(--medo-text)]'
