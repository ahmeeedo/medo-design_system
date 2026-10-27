import type { HTMLAttributes, ReactNode } from 'react';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import { IconButton } from '../icon-button/IconButton';
import { cx } from '../utils/cx';
import './alert.css';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

const ICONS: Record<AlertTone, typeof Info> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** danger: failed or blocks · warning: risk ahead · success: done · info: good to know. */
  tone?: AlertTone;
  /** inline: in the content · banner: full width above the header, for app-wide states. */
  variant?: 'inline' | 'banner';
  /** Required. Says what happened („Your trial ends in 3 days“). */
  title: ReactNode;
  /** What to do next. */
  children?: ReactNode;
  /** Max two text buttons (Button variant="text" size="sm"), the main one first. */
  actions?: ReactNode;
  /** Shows the close button. Only when it is safe to hide the message. */
  onDismiss?: () => void;
  dismissLabel?: string;
  /**
   * Set when the alert appears after the page has loaded: danger and warning are announced
   * immediately (role="alert"), info and success politely (role="status").
   */
  announce?: boolean;
}

/** Alert – persistent message inside the page. Plain markup, no library needed. */
export function Alert({
  tone = 'info',
  variant = 'inline',
  title,
  children,
  actions,
  onDismiss,
  dismissLabel = 'Dismiss',
  announce,
  className,
  ...props
}: AlertProps) {
  const Icon = ICONS[tone];
  const role = announce ? (tone === 'danger' || tone === 'warning' ? 'alert' : 'status') : undefined;
  return (
    <div {...props} role={role ?? props.role} className={cx('medo-alert', `medo-alert--${tone}`, variant === 'banner' && 'medo-alert--banner', className)}>
      <Icon className="medo-alert__icon" aria-hidden="true" />
      <div className="medo-alert__content">
        <p className="medo-alert__title">{title}</p>
        {children && <div className="medo-alert__description">{children}</div>}
        {actions && <div className="medo-alert__actions">{actions}</div>}
      </div>
      {onDismiss && (
        <IconButton className="medo-alert__close" variant="ghost" size="sm" icon={<X />} aria-label={dismissLabel} onPress={onDismiss} />
      )}
    </div>
  );
}
