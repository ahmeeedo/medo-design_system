import { useContext, useRef, type ReactNode } from 'react';
import {
  Dialog as AriaDialog,
  DialogTrigger,
  Heading,
  OverlayTriggerStateContext,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
} from 'react-aria-components';
import { Info, X } from 'lucide-react';
import { BottomSheet } from '../bottom-sheet/BottomSheet';
import { Button, ButtonGroup } from '../button/Button';
import { ActionButton, useInitialFocus, type DialogAction } from '../dialog/Dialog';
import { IconButton } from '../icon-button/IconButton';
import { Link } from '../link/Link';
import { cx } from '../utils/cx';
import { MOBILE_QUERY, useMediaQuery } from '../utils/useMediaQuery';

/** Opens a Popover from a trigger on click (React Aria DialogTrigger). The trigger is pressed and aria-expanded while open. */
export const PopoverTrigger = DialogTrigger;

export interface PopoverProps {
  /** Header with title and close button. Use it when the content needs a title or holds a form. */
  title?: ReactNode;
  /** Required without a title: names the popover. */
  'aria-label'?: string;
  /** Interactive content. A function gets `close`. */
  children: ReactNode | ((close: () => void) => ReactNode);
  /** sm 240 · md 320 · lg 400 · auto: hugs content without padding (e.g. a calendar). */
  size?: 'sm' | 'md' | 'lg' | 'auto';
  /** Footer, only when changes must be confirmed – otherwise apply them live. Cancel + main action (Button sm). */
  primaryAction?: DialogAction;
  cancelLabel?: string;
  /** Accessible name of the close button. */
  closeLabel?: string;
  /** auto: popover on desktop, Bottom Sheet below 640 px · popover · sheet. */
  overlay?: 'auto' | 'popover' | 'sheet';
  /** Default bottom start; flips when there is no space. */
  placement?: AriaPopoverProps['placement'];
  className?: string;
}

/**
 * Popover – a small floating panel with interactive content, anchored to its trigger.
 * Opens on click, never on hover. Non-modal: the page stays usable; focus moves in, Esc or a click
 * outside closes it and focus returns to the trigger. One topic per popover, one popover at a time.
 */
export function Popover({
  title,
  'aria-label': ariaLabel,
  children,
  size = 'md',
  primaryAction,
  cancelLabel = 'Cancel',
  closeLabel = 'Close',
  overlay = 'auto',
  placement = 'bottom start',
  className,
}: PopoverProps) {
  const mobile = useMediaQuery(MOBILE_QUERY);
  const content = (close: () => void) => (typeof children === 'function' ? children(close) : children);

  // Mobile: forms and rich content as Bottom Sheet – thumb reach and room for the keyboard.
  if (overlay === 'sheet' || (overlay === 'auto' && mobile)) {
    return (
      <BottomSheet
        title={title ?? ariaLabel}
        closeLabel={closeLabel}
        className={className}
        footer={
          primaryAction &&
          ((close) => (
            <ButtonGroup>
              <Button variant="secondary" size="lg" onPress={close}>
                {cancelLabel}
              </Button>
              <ActionButton action={primaryAction} close={close} size="lg" variant="primary" />
            </ButtonGroup>
          ))
        }
      >
        <SheetBody>{content}</SheetBody>
      </BottomSheet>
    );
  }

  return (
    <AriaPopover placement={placement} offset={8} containerPadding={16} className={cx('medo-popover', `medo-popover--${size}`, className)}>
      <PopoverDialog aria-label={title ? undefined : ariaLabel}>
        {({ close }) => (
          <>
            {title && (
              <div className="medo-popover__header">
                <Heading slot="title" className="medo-popover__title">
                  {title}
                </Heading>
                <IconButton variant="ghost" size="sm" icon={<X />} aria-label={closeLabel} tooltip={false} onPress={close} />
              </div>
            )}
            <div className="medo-popover__body">{content(close)}</div>
            {primaryAction && (
              <div className="medo-popover__footer">
                <ButtonGroup>
                  <Button variant="secondary" size="sm" onPress={close}>
                    {cancelLabel}
                  </Button>
                  <ActionButton action={primaryAction} close={close} size="sm" variant="primary" />
                </ButtonGroup>
              </div>
            )}
          </>
        )}
      </PopoverDialog>
    </AriaPopover>
  );
}

/** Focus starts in the first field (like Dialog), so a form popover is ready to type. */
function PopoverDialog({ children, ...props }: { 'aria-label'?: string; children: (opts: { close: () => void }) => ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useInitialFocus(ref);
  return (
    <AriaDialog {...props} ref={ref} className="medo-popover__dialog">
      {children}
    </AriaDialog>
  );
}

/** Content of the mobile sheet with the sheet's padding. */
function SheetBody({ children }: { children: (close: () => void) => ReactNode }) {
  const state = useContext(OverlayTriggerStateContext);
  return <div className="medo-popover__sheet-body">{children(() => state?.close())}</div>;
}

export interface ToggletipProps {
  /** Required. Names the info button and the toggletip after the topic (“About billing email”). */
  'aria-label': string;
  /** One or two short sentences. Text only. */
  children: ReactNode;
  /** Optional link to more help. */
  link?: { label: string; href: string; external?: boolean };
  className?: string;
}

/**
 * Toggletip – a short explanation behind an info button, next to a label or value.
 * Opens on click, so it works with touch, keyboard and screen readers – unlike a tooltip.
 * Esc or a click outside closes it. Stays a popover on mobile (full width minus 16 px).
 */
export function Toggletip({ 'aria-label': label, children, link, className }: ToggletipProps) {
  return (
    <DialogTrigger>
      <IconButton variant="ghost" size="sm" icon={<Info />} aria-label={label} tooltip={false} />
      <AriaPopover placement="bottom start" offset={8} containerPadding={16} className={cx('medo-popover', 'medo-toggletip', className)}>
        <AriaDialog aria-label={label} className="medo-popover__dialog medo-toggletip__dialog">
          <div className="medo-toggletip__text">{children}</div>
          {link && (
            <Link variant="standalone" size="md" href={link.href} external={link.external} target={link.external ? '_blank' : undefined}>
              {link.label}
            </Link>
          )}
        </AriaDialog>
      </AriaPopover>
    </DialogTrigger>
  );
}
