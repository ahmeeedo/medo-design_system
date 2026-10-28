import { useId, type CSSProperties, type ReactNode } from 'react';
import { Label, ProgressBar as AriaProgressBar, type ProgressBarProps as AriaProgressBarProps } from 'react-aria-components';
import { cx } from '../utils/cx';
import { useMessages } from '../i18n/I18n';

/* ---------- Spinner ---------- */

export interface SpinnerProps {
  /** sm 16 · md 20 · lg 24 · xl 40 px. */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** current = text colour of the parent (default, fits every button) · brand · neutral · on-brand. */
  tone?: 'current' | 'brand' | 'neutral' | 'on-brand';
  /** Name for screen readers. */
  'aria-label'?: string;
  /** Inside a control that already says what happens (“Saving…”): hide the spinner from screen readers. */
  decorative?: boolean;
  className?: string;
  style?: CSSProperties;
}

const SpinnerGraphic = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle className="medo-spinner__track" cx="12" cy="12" r="10" />
    <circle className="medo-spinner__arc" cx="12" cy="12" r="10" pathLength={100} />
  </svg>
);

/** Spinner – short wait of unknown length. */
export function Spinner({ size = 'md', tone = 'current', decorative, className, style, ...props }: SpinnerProps) {
  const m = useMessages();
  const classes = cx('medo-spinner', `medo-spinner--${size}`, tone !== 'current' && `medo-spinner--${tone}`, className);
  if (decorative) {
    return (
      <span className={classes} style={style} aria-hidden="true">
        <SpinnerGraphic />
      </span>
    );
  }
  return (
    <AriaProgressBar isIndeterminate aria-label={props['aria-label'] ?? m.common.loading} className={classes} style={style}>
      <SpinnerGraphic />
    </AriaProgressBar>
  );
}

/* ---------- Progress bar ---------- */

export interface ProgressBarProps extends Omit<AriaProgressBarProps, 'children' | 'className' | 'style'> {
  /** Visible label (“Uploading 3 files”). Without it, set aria-label. */
  label?: ReactNode;
  /** Helper below the bar: files, time left, or what to do after an error. */
  description?: ReactNode;
  /** md 8 px in content · sm 4 px in dense rows (file list). */
  size?: 'sm' | 'md';
  /** success when done, error when it failed. Announced politely. */
  status?: 'default' | 'success' | 'error';
  /** Show the value (“64 %”) next to the label. Hidden when indeterminate. */
  showValue?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Progress bar – measurable or long work. Built on React Aria ProgressBar:
 * role progressbar with value and value text. Use `valueLabel` for words (“64 %, 2 of 3 files”).
 */
export function ProgressBar({
  label,
  description,
  size = 'md',
  status = 'default',
  showValue = true,
  className,
  style,
  ...props
}: ProgressBarProps) {
  const descriptionId = useId();
  return (
    <AriaProgressBar
      {...props}
      aria-describedby={description ? descriptionId : undefined}
      className={cx(
        'medo-progress',
        `medo-progress--${size}`,
        status !== 'default' && `medo-progress--${status}`,
        props.isIndeterminate && 'medo-progress--indeterminate',
        className,
      )}
      style={style}
    >
      {({ percentage, valueText, isIndeterminate }) => (
        <>
          {(label || (showValue && !isIndeterminate)) && (
            <div className="medo-progress__header">
              {label && <Label className="medo-progress__label">{label}</Label>}
              {showValue && !isIndeterminate && <span className="medo-progress__value">{valueText}</span>}
            </div>
          )}
          <div className="medo-progress__track">
            <div className="medo-progress__fill" style={isIndeterminate ? undefined : { inlineSize: `${percentage}%` }} />
          </div>
          {description && (
            // Live only for the final state, so regular updates (“12 s left”) do not chatter.
            <span id={descriptionId} className="medo-progress__description" aria-live={status === 'default' ? undefined : 'polite'}>
              {description}
            </span>
          )}
        </>
      )}
    </AriaProgressBar>
  );
}

/* ---------- Skeleton ---------- */

export interface SkeletonProps {
  /** text: 12 px line · circle: avatar · rect: image or card. */
  shape?: 'text' | 'circle' | 'rect';
  /** Number of text lines; the last one is shorter. */
  lines?: number;
  /** Any CSS length, e.g. "60%", 160. Match the real content. */
  width?: CSSProperties['inlineSize'];
  height?: CSSProperties['blockSize'];
  className?: string;
}

/**
 * Skeleton – placeholder in the shape of the content.
 * Hidden from screen readers; mark the loading region with aria-busy="true".
 */
export function Skeleton({ shape = 'text', lines = 1, width, height, className }: SkeletonProps) {
  const style: CSSProperties = { inlineSize: width, blockSize: height };
  const one = (key?: number) => (
    <span key={key} className={cx('medo-skeleton', `medo-skeleton--${shape}`, className)} style={style} aria-hidden="true" />
  );
  if (shape !== 'text' || lines <= 1) return one();
  return (
    <span className="medo-skeleton-lines" aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => one(i))}
    </span>
  );
}
