import { useContext, useId, useRef, type PointerEvent, type ReactNode } from 'react';
import { Dialog, Heading, Modal, ModalOverlay, OverlayTriggerStateContext, Popover, type ModalOverlayProps } from 'react-aria-components';
import { ChevronLeft, X } from 'lucide-react';
import { IconButton } from '../icon-button/IconButton';
import { cx } from '../utils/cx';

export interface BottomSheetProps extends Omit<ModalOverlayProps, 'children' | 'className' | 'style'> {
  /** Required: names the dialog (for a Select sheet: the field label). */
  title: ReactNode;
  /** Content; scrolls when taller than the sheet. */
  children: ReactNode;
  /** Sticky footer, e.g. a full-width primary action. A function gets `close`. */
  footer?: ReactNode | ((close: () => void) => ReactNode);
  /** content: height of the content, max 90 % · full: fixed 90 % (with search, so it does not jump). */
  height?: 'content' | 'full';
  /** Accessible name of the close button. */
  closeLabel?: string;
  /** Shows a back button before the title (second view, e.g. a submenu). */
  onBack?: () => void;
  /** Accessible name of the back button. */
  backLabel?: string;
  className?: string;
}

/** Share of the sheet height (or a fast flick) that closes it when swiped down. */
const CLOSE_DISTANCE = 0.25;
const CLOSE_VELOCITY = 0.5; // px per ms

/**
 * Bottom Sheet – a modal layer from the bottom on small screens.
 * Built on React Aria ModalOverlay + Modal + Dialog: focus stays inside and returns to the trigger,
 * page scroll is locked, Esc and a tap on the scrim close it. Swipe down on the handle or header closes it,
 * the close button is the non-drag alternative (WCAG 2.5.7). Use inside a DialogTrigger or with isOpen.
 */
export function BottomSheet({
  title,
  children,
  footer,
  height = 'content',
  closeLabel = 'Close',
  onBack,
  backLabel = 'Back',
  isDismissable = true,
  className,
  ...props
}: BottomSheetProps) {
  return (
    <ModalOverlay {...props} isDismissable={isDismissable} className="medo-sheet-overlay">
      <Modal className={cx('medo-sheet', height === 'full' && 'medo-sheet--full', className)}>
        <Dialog className="medo-sheet__dialog">
          {({ close }) => (
            <>
              <SwipeArea onClose={close}>
                <span className="medo-sheet__handle" aria-hidden="true" />
                <div className="medo-sheet__header">
                  {onBack && (
                    <IconButton variant="ghost" size="lg" icon={<ChevronLeft />} aria-label={backLabel} tooltip={false} onPress={onBack} />
                  )}
                  <Heading slot="title" className="medo-sheet__title">
                    {title}
                  </Heading>
                  <IconButton variant="ghost" size="lg" icon={<X />} aria-label={closeLabel} tooltip={false} onPress={close} />
                </div>
              </SwipeArea>
              <div className="medo-sheet__content">{children}</div>
              {footer && <div className="medo-sheet__footer">{typeof footer === 'function' ? footer(close) : footer}</div>}
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

/** Handle and header: drag down to close (touch, pen or mouse). Buttons inside keep working. */
function SwipeArea({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const drag = useRef<{ y: number; t: number; sheet: HTMLElement } | null>(null);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    const sheet = e.currentTarget.closest<HTMLElement>('.medo-sheet');
    if (!sheet) return;
    drag.current = { y: e.clientY, t: e.timeStamp, sheet };
    e.currentTarget.setPointerCapture(e.pointerId);
    sheet.setAttribute('data-dragging', '');
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const dy = Math.max(0, e.clientY - drag.current.y);
    drag.current.sheet.style.transform = `translateY(${dy}px)`;
  };

  const end = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    const dy = Math.max(0, e.clientY - d.y);
    const velocity = dy / Math.max(1, e.timeStamp - d.t);
    d.sheet.removeAttribute('data-dragging');
    d.sheet.style.transform = '';
    if (dy > d.sheet.offsetHeight * CLOSE_DISTANCE || (velocity > CLOSE_VELOCITY && dy > 24)) onClose();
  };

  return (
    <div className="medo-sheet__grab" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={end} onPointerCancel={end}>
      {children}
    </div>
  );
}

/**
 * Bottom Sheet as the popover of a Select. React Aria builds the Select's list
 * from its Popover even while closed – a Modal would hide the options from it – so the sheet is a
 * full-screen popover here: same look, same closing (swipe, scrim, Esc, close button), focus stays inside.
 */
export function BottomSheetPopover({
  title,
  children,
  footer,
  height = 'content',
  closeLabel = 'Close',
}: Pick<BottomSheetProps, 'title' | 'children' | 'footer' | 'height' | 'closeLabel'>) {
  return (
    <Popover className="medo-sheet-overlay medo-sheet-overlay--popover" offset={0} containerPadding={0}>
      <SheetPopoverBody title={title} footer={footer} height={height} closeLabel={closeLabel}>
        {children}
      </SheetPopoverBody>
    </Popover>
  );
}

function SheetPopoverBody({ title, children, footer, height, closeLabel }: Omit<BottomSheetProps, 'isDismissable' | 'className'>) {
  const state = useContext(OverlayTriggerStateContext);
  const titleId = useId();
  const close = () => state?.close();
  return (
    // A tap on the scrim (outside the sheet) closes it.
    <div className="medo-sheet-scrim" onClick={(e) => e.target === e.currentTarget && close()}>
      <section className={cx('medo-sheet', height === 'full' && 'medo-sheet--full')} aria-labelledby={titleId}>
        <SwipeArea onClose={close}>
          <span className="medo-sheet__handle" aria-hidden="true" />
          <div className="medo-sheet__header">
            <h2 id={titleId} className="medo-sheet__title">
              {title}
            </h2>
            <IconButton slot={null} variant="ghost" size="lg" icon={<X />} aria-label={closeLabel ?? 'Close'} tooltip={false} onPress={close} />
          </div>
        </SwipeArea>
        <div className="medo-sheet__content">{children}</div>
        {footer && <div className="medo-sheet__footer">{typeof footer === 'function' ? footer(close) : footer}</div>}
      </section>
    </div>
  );
}
