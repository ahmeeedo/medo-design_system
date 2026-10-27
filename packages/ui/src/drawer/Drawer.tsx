import { useEffect, useRef, type ReactNode } from 'react';
import { Dialog as AriaDialog, Heading, Modal, ModalOverlay } from 'react-aria-components';
import { X } from 'lucide-react';
import { useDirtyGuard, type DirtyGuardProps } from '../dialog/Dialog';
import { IconButton } from '../icon-button/IconButton';
import { cx } from '../utils/cx';
import './drawer.css';

export interface DrawerProps extends DirtyGuardProps {
  /** Says what it is („Account“, „Filter“, „Invoice #1042“). Can be a logo for a navigation drawer – then set aria-label. */
  title: ReactNode;
  /** Name of the drawer when the title is not text (e.g. a logo). */
  'aria-label'?: string;
  /** Content; scrolls between header and footer. A function gets `close`: closes without asking – call it after saving. */
  children: ReactNode | ((close: () => void) => ReactNode);
  /**
   * Only for decisions (Apply, Save) – usually a ButtonGroup. Links and switches act immediately.
   * A function gets `close` (after applying or saving, never asks) and `cancel` (asks „Discard changes?“ when isDirty).
   */
  footer?: ReactNode | ((close: () => void, cancel: () => void) => ReactNode);
  /** right: account, filters, details (default) · left: navigation only. */
  side?: 'left' | 'right';
  /** sm 320 (links) · md 400 (filters) · lg 560 (details, forms). */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible name of the close button. */
  closeLabel?: string;
  className?: string;
}

/**
 * Drawer – a modal panel that slides in from the side. Same building blocks and behaviour
 * as the Dialog (React Aria ModalOverlay + Modal + Dialog): scrim, focus trap, no page scroll, Esc and the close
 * button close it, focus returns to the trigger; `isDirty` asks „Discard changes?“. Below 640 px it keeps its side,
 * viewport − 56 px wide; a swipe towards the edge closes it. Use inside a DialogTrigger or with isOpen.
 */
export function Drawer({
  title,
  'aria-label': ariaLabel,
  children,
  footer,
  side = 'right',
  size = 'sm',
  closeLabel = 'Close',
  isDirty = false,
  discardText,
  className,
  ...openProps
}: DrawerProps) {
  const { open, onOpenChange, confirmDiscard, forceClose } = useDirtyGuard({ isDirty, discardText, ...openProps });
  return (
    <ModalOverlay isOpen={open} onOpenChange={onOpenChange} isDismissable={!isDirty} className={cx('medo-drawer-overlay', `medo-drawer-overlay--${side}`)}>
      <Modal className={cx('medo-drawer', `medo-drawer--${side}`, `medo-drawer--${size}`, className)}>
        <DrawerDialog aria-label={ariaLabel} side={side}>
          {(close) => (
            <>
              <div className="medo-drawer__header">
                {ariaLabel ? (
                  <div className="medo-drawer__title">{title}</div>
                ) : (
                  <Heading slot="title" className="medo-drawer__title">
                    {title}
                  </Heading>
                )}
                <IconButton variant="ghost" size="md" icon={<X />} aria-label={closeLabel} tooltip={false} onPress={close} />
              </div>
              <div className="medo-drawer__body">{typeof children === 'function' ? children(forceClose) : children}</div>
              {footer && <div className="medo-drawer__footer">{typeof footer === 'function' ? footer(forceClose, close) : footer}</div>}
              {confirmDiscard}
            </>
          )}
        </DrawerDialog>
      </Modal>
    </ModalOverlay>
  );
}

/**
 * The dialog section with swipe to close. Focus starts on the drawer itself (React Aria default):
 * screen readers announce the title, Tab then reaches the close button and the content in order –
 * drawers mostly hold links and settings, not a form to type into right away.
 */
function DrawerDialog({ children, side, ...props }: { 'aria-label'?: string; side: 'left' | 'right'; children: (close: () => void) => ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  return (
    <AriaDialog {...props} ref={ref} className="medo-drawer__dialog">
      {({ close }) => (
        <>
          <SwipeToClose target={ref} side={side} onClose={close} />
          {children(close)}
        </>
      )}
    </AriaDialog>
  );
}

/** Share of the width (or a fast flick) that closes the drawer when swiped towards its edge. */
const CLOSE_DISTANCE = 0.25;
const CLOSE_VELOCITY = 0.5; // px per ms
const START = 10; // px before a horizontal drag starts – vertical scrolling stays native

/**
 * Touch and pen: drag the drawer towards its edge to close it.
 * An addition only – Esc, the close button and the scrim always work (WCAG 2.5.7).
 */
function SwipeToClose({ target, side, onClose }: { target: React.RefObject<HTMLElement | null>; side: 'left' | 'right'; onClose: () => void }) {
  useEffect(() => {
    const el = target.current;
    const drawer = el?.parentElement;
    if (!el || !drawer) return;
    const dir = side === 'right' ? 1 : -1;
    let start: { x: number; y: number; t: number; id: number } | null = null;
    let dragging = false;

    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      start = { x: e.clientX, y: e.clientY, t: e.timeStamp, id: e.pointerId };
      dragging = false;
    };
    const move = (e: PointerEvent) => {
      if (!start || e.pointerId !== start.id) return;
      const dx = (e.clientX - start.x) * dir;
      const dy = e.clientY - start.y;
      if (!dragging) {
        if (Math.abs(dx) < START || Math.abs(dx) < Math.abs(dy)) return;
        if (dx < 0) return void (start = null); // towards the content: not a close gesture
        dragging = true;
        el.setPointerCapture(e.pointerId);
        drawer.setAttribute('data-dragging', '');
      }
      drawer.style.transform = `translateX(${Math.max(0, dx) * dir}px)`;
    };
    const up = (e: PointerEvent) => {
      if (!start || e.pointerId !== start.id) return;
      const dx = Math.max(0, (e.clientX - start.x) * dir);
      const velocity = dx / Math.max(1, e.timeStamp - start.t);
      const wasDragging = dragging;
      start = null;
      dragging = false;
      if (!wasDragging) return;
      drawer.removeAttribute('data-dragging');
      drawer.style.transform = '';
      if (dx > drawer.offsetWidth * CLOSE_DISTANCE || (velocity > CLOSE_VELOCITY && dx > 24)) onClose();
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  }, [target, side, onClose]);
  return null;
}
