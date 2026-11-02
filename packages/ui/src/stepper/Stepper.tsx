import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Link as AriaLink, type LinkProps as AriaLinkProps } from 'react-aria-components';
import { Check } from 'lucide-react';
import { cx } from '../utils/cx';
import { MOBILE_QUERY, useMediaQuery } from '../utils/useMediaQuery';
import { useMessages } from '../i18n/I18n';

export interface StepProps {
  /** Name of the step – the same words as the heading of that step (“Address”). */
  children: ReactNode;
  /** Optional second line: what the step is about (“Where we deliver”). */
  description?: ReactNode;
  /** Done steps are links back: a URL (works with RouterProvider) … */
  href?: AriaLinkProps['href'];
  /** … or a handler, for steps on one page. */
  onPress?: AriaLinkProps['onPress'];
}

/** One step of a Stepper. Its state comes from the Stepper (`current`), not from the step. */
export function Step(_props: StepProps): ReactElement | null {
  return null;
}

export interface StepperProps {
  /** The steps in their order. */
  children: ReactNode;
  /** Index of the current step, from 0. Steps before it are done, steps after it upcoming. */
  current: number;
  /** auto: all steps from 640 px, below “Step 2 of 4” with one bar segment per step · horizontal · compact. */
  layout?: 'auto' | 'horizontal' | 'compact';
  /** Name of the navigation region, e.g. the task (“Checkout”). Default: built-in text. */
  'aria-label'?: string;
  className?: string;
}

/**
 * Stepper – where someone is in a task of several steps (checkout, sign-up).
 * A navigation region with an ordered list: done steps are links back, the current step has aria-current="step",
 * upcoming steps are plain text – no skipping ahead. Below 640 px: “Step 2 of 4”, the current step and one bar
 * segment per step, because four labels side by side are not readable on a phone.
 * Not for independent pages (use Tabs) and not for more than about 5 steps (split the task).
 */
export function Stepper({ children, current, layout = 'auto', 'aria-label': ariaLabel, className }: StepperProps) {
  const m = useMessages();
  const mobile = useMediaQuery(MOBILE_QUERY);
  const steps = Children.toArray(children).filter((child): child is ReactElement<StepProps> => isValidElement(child) && child.type === Step).map((child) => child.props);
  const total = steps.length;
  const index = Math.min(Math.max(current, 0), Math.max(total - 1, 0));
  const compact = layout === 'compact' || (layout === 'auto' && mobile);
  const label = ariaLabel ?? m.stepper.label;

  if (compact) {
    const step = steps[index];
    return (
      <nav aria-label={label} className={cx('medo-stepper', 'medo-stepper--compact', className)}>
        {/* One sentence for screen readers: “Step 2 of 4: Address”. The bar repeats it visually. */}
        <p className="medo-stepper__counter">{m.stepper.count(index + 1, total)}</p>
        <p className="medo-stepper__title" aria-current="step">
          <span className="medo-visually-hidden">: </span>
          {step?.children}
        </p>
        {step?.description && <p className="medo-stepper__description">{step.description}</p>}
        <div className="medo-stepper__segments" aria-hidden="true">
          {steps.map((_, i) => (
            <span key={i} className="medo-stepper__segment" data-done={i <= index || undefined} />
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav aria-label={label} className={cx('medo-stepper', className)}>
      <ol className="medo-stepper__list">
        {steps.map((step, i) => {
          const state = i < index ? 'complete' : i === index ? 'current' : 'upcoming';
          const content = (
            <>
              <span className="medo-stepper__marker" aria-hidden="true">
                {state === 'complete' ? <Check /> : i + 1}
              </span>
              <span className="medo-stepper__text">
                <span className="medo-stepper__label">
                  {step.children}
                  {state === 'complete' && <span className="medo-visually-hidden">{`, ${m.stepper.completed}`}</span>}
                </span>
                {step.description && <span className="medo-stepper__description">{step.description}</span>}
              </span>
            </>
          );
          return (
            <li key={i} className="medo-stepper__item" data-state={state}>
              {state === 'complete' && (step.href !== undefined || step.onPress) ? (
                <AriaLink href={step.href} onPress={step.onPress} className="medo-stepper__step">
                  {content}
                </AriaLink>
              ) : (
                <span className="medo-stepper__step" aria-current={state === 'current' ? 'step' : undefined}>
                  {content}
                </span>
              )}
              {i < total - 1 && <span className="medo-stepper__connector" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
