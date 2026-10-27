import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx';
import '../utils/utilities.css';
import './badge.css';

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Meaning: success, warning, danger, info. Brand for “New”, neutral for everything else. */
  tone?: BadgeTone;
  /** sm 20 px · md 24 px. */
  size?: 'sm' | 'md';
  /** Leading dot in the text colour, so the status does not rely on colour alone. */
  dot?: boolean;
  /** Leading icon (12 px, decorative). Ignored when `dot` is set. */
  icon?: ReactNode;
  /** 1–2 words, sentence case. */
  children: ReactNode;
}

/**
 * Badge – short, non-interactive status label.
 * Plain text: never clickable. For a badge that changes live, pass role="status".
 */
export function Badge({ tone = 'neutral', size = 'md', dot, icon, className, children, ...props }: BadgeProps) {
  return (
    <span {...props} className={cx('medo-badge', `medo-badge--${tone}`, `medo-badge--${size}`, className)}>
      {dot ? (
        <span className="medo-badge__dot" aria-hidden="true" />
      ) : (
        icon && (
          <span className="medo-badge__icon" aria-hidden="true">
            {icon}
          </span>
        )
      )}
      {children}
    </span>
  );
}

export interface BadgeCountProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  count: number;
  /** Above this number the badge shows “99+”. */
  max?: number;
  tone?: 'danger' | 'brand' | 'neutral';
  /** sm 16 px · md 20 px. */
  size?: 'sm' | 'md';
  /**
   * Text for screen readers, e.g. “3 unread messages”.
   * Without it the number is hidden: then the parent names it (“Notifications, 3 unread”).
   */
  label?: string;
}

/** Count for notifications. Hidden at 0. */
export function BadgeCount({ count, max = 99, tone = 'danger', size = 'md', label, className, ...props }: BadgeCountProps) {
  if (count <= 0) return null;
  const text = count > max ? `${max}+` : String(count);
  return (
    <span
      {...props}
      aria-hidden={label ? undefined : true}
      className={cx('medo-badge-count', `medo-badge-count--${tone}`, `medo-badge-count--${size}`, className)}
    >
      <span aria-hidden={label ? true : undefined}>{text}</span>
      {label && <span className="medo-visually-hidden">{label}</span>}
    </span>
  );
}

export interface BadgeDotProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  tone?: BadgeTone;
  /** Text for screen readers (“Unread”, “Online”). Without it the dot is decorative. */
  label?: string;
}

/** Dot for unread or presence. Always pair it with text or a label. */
export function BadgeDot({ tone = 'neutral', label, className, ...props }: BadgeDotProps) {
  return (
    <span
      {...props}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cx('medo-badge-dot', `medo-badge-dot--${tone}`, className)}
    />
  );
}
