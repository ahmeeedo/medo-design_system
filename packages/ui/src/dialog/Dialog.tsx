import { useContext, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Dialog as AriaDialog, DialogContext, Heading, Modal, ModalOverlay, OverlayTriggerStateContext, Provider } from 'react-aria-components';
import { CircleAlert, Info, TriangleAlert, X } from 'lucide-react';
import { BottomSheet } from '../bottom-sheet/BottomSheet';
import { Button, ButtonGroup, type ButtonSize } from '../button/Button';
import { IconButton } from '../icon-button/IconButton';
import { cx } from '../utils/cx';
import { MOBILE_QUERY, useMediaQuery } from '../utils/useMediaQuery';
import './dialog.css';

/** Opens a Dialog or Alert dialog from a trigger (React Aria DialogTrigger). Focus returns to the trigger. */
export { DialogTrigger } from 'react-aria-components';

/* ---------- Shared ---------- */

export interface DialogAction {
  /** Verb that says what happens („Send invite“, „Delete“). Never „OK“, „Yes“ or „Confirm“. */
  label: string;
  /**
   * Runs on press, then the dialog closes. Return a promise to show the pending state until it
   * resolves; when it rejects, the dialog stays open (show the error inside the dialog).
   */
  onAction?: () => void | Promise<unknown>;
  /** Id of a form in the dialog: the button submits it. The form's onSubmit saves and calls `close`. */
  form?: string;
  /** Dialog only: danger for a destructive main action. */
  variant?: 'primary' | 'danger';
  isDisabled?: boolean;
  /** Controlled pending state (e.g. while a submitted form saves). */
  isPending?: boolean;
}

interface OpenProps {
  /** Controlled open state. Inside a DialogTrigger the trigger controls it. */
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

/** Open state from props, else from the surrounding DialogTrigger. */
function useOpenState({ isOpen, onOpenChange }: OpenProps) {
  const trigger = useContext(OverlayTriggerStateContext);
  const open = isOpen ?? trigger?.isOpen ?? false;
  const setOpen = (next: boolean) => {
    onOpenChange?.(next);
    if (isOpen === undefined) trigger?.setOpen(next);
  };
  return [open, setOpen] as const;
}

/** Main action button: runs the action and closes; a promise shows the pending state. Shared with Popover (internal, not exported from the package). */
export function ActionButton({ action, close, size, variant }: { action: DialogAction; close: () => void; size: ButtonSize; variant: 'primary' | 'danger' }) {
  const [pending, setPending] = useState(false);
  const run = async () => {
    const result = action.onAction?.();
    if (!(result instanceof Promise)) return close();
    setPending(true);
    try {
      await result;
      close();
    } finally {
      setPending(false);
    }
  };
  return (
    <Button
      variant={action.variant ?? variant}
      size={size}
      type={action.form ? 'submit' : 'button'}
      form={action.form}
      isDisabled={action.isDisabled}
      isPending={action.isPending || pending}
      onPress={action.form ? undefined : run}
    >
      {action.label}
    </Button>
  );
}

/** A nested modal must not inherit the outer dialog's trigger, ids or state. */
function Nested({ children }: { children: ReactNode }) {
  return (
    <Provider
      values={[
        [DialogContext, null],
        [OverlayTriggerStateContext, null],
      ]}
    >
      {children}
    </Provider>
  );
}

/* ---------- Dialog ---------- */

export interface DirtyGuardProps extends OpenProps {
  isDirty?: boolean;
  discardText?: Partial<DialogDiscardText>;
}

/**
 * Open state with the „Discard changes?“ guard (Figma: protect input). Every way of closing
 * (X, Cancel, Esc, swipe) goes through onOpenChange; with unsaved input it asks first.
 * Render `confirmDiscard` inside the dialog. Shared with Drawer (internal).
 */
export function useDirtyGuard({ isDirty = false, discardText, ...openProps }: DirtyGuardProps) {
  const [open, setOpen] = useOpenState(openProps);
  const [confirm, setConfirm] = useState(false);
  const onOpenChange = (next: boolean) => {
    if (next || !isDirty) setOpen(next);
    else setConfirm(true);
  };
  const discard = { ...DISCARD, ...discardText };
  const confirmDiscard = (
    <Nested>
      <AlertDialog
        tone="warning"
        isOpen={confirm}
        onOpenChange={setConfirm}
        title={discard.title}
        actionLabel={discard.actionLabel}
        cancelLabel={discard.cancelLabel}
        onAction={() => setOpen(false)}
      >
        {discard.description}
      </AlertDialog>
    </Nested>
  );
  /** Deliberate close after saving – does not ask. */
  const forceClose = () => setOpen(false);
  return { open, onOpenChange, confirmDiscard, forceClose };
}

export interface DialogDiscardText {
  title: string;
  description: string;
  actionLabel: string;
  cancelLabel: string;
}

export interface DialogProps extends OpenProps {
  /** Required. Names the task („Invite member“). Screen readers announce it when the dialog opens. */
  title: ReactNode;
  /** One or two sentences under the title. */
  description?: ReactNode;
  /** Content or form. A function gets `close`: closes without asking – call it after saving (X, Cancel and Esc still ask when isDirty). */
  children?: ReactNode | ((close: () => void) => ReactNode);
  /** sm 400 (one or two fields) · md 560 · lg 720 (tables, two-column forms). */
  size?: 'sm' | 'md' | 'lg';
  /** Main action at the end of the footer, next to Cancel. On mobile fullscreen it moves to the header. Without it, no footer. */
  primaryAction?: DialogAction;
  cancelLabel?: string;
  /** Accessible name of the X (and the label of the mobile close button without a main action). */
  closeLabel?: string;
  /** Shows the X in the header. */
  showClose?: boolean;
  /**
   * Unsaved input. While true, a click on the scrim no longer closes, and X, Esc and Cancel
   * first ask „Discard changes?“ (Alert dialog).
   */
  isDirty?: boolean;
  /** Text of the „Discard changes?“ Alert dialog. */
  discardText?: Partial<DialogDiscardText>;
  /** auto: dialog on desktop, `mobile` below 640 px · dialog · fullscreen · sheet. */
  overlay?: 'auto' | 'dialog' | 'fullscreen' | 'sheet';
  /** Pattern below 640 px: fullscreen for forms (keyboard needs space), sheet for short content. */
  mobile?: 'fullscreen' | 'sheet';
  className?: string;
}

const DISCARD: DialogDiscardText = {
  title: 'Discard changes?',
  description: 'Your changes will be lost.',
  actionLabel: 'Discard',
  cancelLabel: 'Keep editing',
};

/**
 * Dialog – a modal window for a focused task (Figma: C19 Dialog). Built on React Aria ModalOverlay,
 * Modal and Dialog: role dialog with aria-modal, the title names it, focus starts in the first field,
 * stays inside and returns to the trigger; the page behind does not scroll. Use inside a DialogTrigger or with isOpen.
 */
export function Dialog({
  title,
  description,
  children,
  size = 'md',
  primaryAction,
  cancelLabel = 'Cancel',
  closeLabel = 'Close',
  showClose = true,
  isDirty = false,
  discardText,
  overlay = 'auto',
  mobile = 'fullscreen',
  className,
  ...openProps
}: DialogProps) {
  const { open, onOpenChange, confirmDiscard, forceClose } = useDirtyGuard({ isDirty, discardText, ...openProps });
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const layout = overlay === 'auto' ? (isMobile ? mobile : 'dialog') : overlay;
  const content = (close: () => void) => (typeof children === 'function' ? children(close) : children);

  if (layout === 'sheet') {
    return (
      <BottomSheet
        title={title}
        closeLabel={closeLabel}
        isOpen={open}
        onOpenChange={onOpenChange}
        isDismissable={!isDirty}
        className={className}
        footer={
          primaryAction &&
          ((close) => (
            <ButtonGroup>
              <Button variant="secondary" size="lg" onPress={close}>
                {cancelLabel}
              </Button>
              <ActionButton action={primaryAction} close={forceClose} size="lg" variant="primary" />
            </ButtonGroup>
          ))
        }
      >
        <SheetContent description={description}>{content(forceClose)}</SheetContent>
        {confirmDiscard}
      </BottomSheet>
    );
  }

  const fullscreen = layout === 'fullscreen';
  return (
    <ModalOverlay
      isOpen={open}
      onOpenChange={onOpenChange}
      isDismissable={!isDirty}
      className={cx('medo-dialog-overlay', fullscreen && 'medo-dialog-overlay--fullscreen')}
    >
      <Modal className={cx('medo-dialog', fullscreen ? 'medo-dialog--fullscreen' : `medo-dialog--${size}`, className)}>
        <DialogFrame
          title={title}
          description={description}
          fullscreen={fullscreen}
          primaryAction={primaryAction}
          cancelLabel={cancelLabel}
          closeLabel={closeLabel}
          showClose={showClose}
          nested={confirmDiscard}
          forceClose={forceClose}
        >
          {content}
        </DialogFrame>
      </Modal>
    </ModalOverlay>
  );
}

interface FrameProps extends Pick<DialogProps, 'title' | 'description' | 'primaryAction' | 'showClose'> {
  fullscreen: boolean;
  cancelLabel: string;
  closeLabel: string;
  /** Rendered inside the dialog (focus scope): the „Discard changes?“ Alert dialog. */
  nested: ReactNode;
  /** Closes without asking: the main action and the content's `close` (after saving). */
  forceClose: () => void;
  children: (close: () => void) => ReactNode;
}

/** Header, scrolling body and footer of the centered and the fullscreen dialog. */
function DialogFrame({ title, description, fullscreen, primaryAction, cancelLabel, closeLabel, showClose, nested, forceClose, children }: FrameProps) {
  const descriptionId = useId();
  const ref = useRef<HTMLElement>(null);
  const [scrolls, setScrolls] = useState(false);
  useInitialFocus(ref);

  return (
    <AriaDialog ref={ref} className="medo-dialog__dialog" aria-describedby={description ? descriptionId : undefined} data-scrolled={scrolls || undefined}>
      {({ close }) =>
        fullscreen ? (
          <>
            {/* Mobile: Cancel left, title centered, main action right – always visible above the keyboard. */}
            <div className="medo-dialog__bar">
              <Button variant="ghost" size="md" onPress={close}>
                {primaryAction ? cancelLabel : closeLabel}
              </Button>
              <Heading slot="title" className="medo-dialog__bar-title">
                {title}
              </Heading>
              {primaryAction ? <ActionButton action={primaryAction} close={forceClose} size="md" variant="primary" /> : <span />}
            </div>
            <DialogBody onScrollsChange={setScrolls}>
              {description && (
                <p id={descriptionId} className="medo-dialog__description">
                  {description}
                </p>
              )}
              {children(forceClose)}
            </DialogBody>
            {nested}
          </>
        ) : (
          <>
            <div className="medo-dialog__header">
              <div className="medo-dialog__heading">
                <Heading slot="title" className="medo-dialog__title">
                  {title}
                </Heading>
                {description && (
                  <p id={descriptionId} className="medo-dialog__description">
                    {description}
                  </p>
                )}
              </div>
              {showClose && <IconButton variant="ghost" size="sm" icon={<X />} aria-label={closeLabel} tooltip={false} onPress={close} />}
            </div>
            <DialogBody onScrollsChange={setScrolls}>{children(forceClose)}</DialogBody>
            {primaryAction && (
              <div className="medo-dialog__footer">
                <ButtonGroup>
                  <Button variant="secondary" onPress={close}>
                    {cancelLabel}
                  </Button>
                  <ActionButton action={primaryAction} close={forceClose} size="md" variant="primary" />
                </ButtonGroup>
              </div>
            )}
            {nested}
          </>
        )
      }
    </AriaDialog>
  );
}

/** Only the body scrolls. While it does, it is focusable (keyboard scrolling) and header and footer get dividers. */
function DialogBody({ children, onScrollsChange }: { children: ReactNode; onScrollsChange: (scrolls: boolean) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrolls, setScrolls] = useState(false);
  useLayoutEffect(() => {
    const body = ref.current;
    if (!body) return;
    const check = () => setScrolls(body.scrollHeight > body.clientHeight + 1);
    const observer = new ResizeObserver(check);
    observer.observe(body);
    if (body.firstElementChild) observer.observe(body.firstElementChild);
    check();
    return () => observer.disconnect();
  }, []);
  useEffect(() => onScrollsChange(scrolls), [scrolls, onScrollsChange]);
  return (
    <div ref={ref} className="medo-dialog__body" tabIndex={scrolls ? 0 : undefined}>
      <div className="medo-dialog__body-inner">{children}</div>
    </div>
  );
}

/** Bottom Sheet content: description and the dialog content with the sheet's padding. */
function SheetContent({ description, children }: { description: ReactNode; children: ReactNode }) {
  return (
    <div className="medo-dialog__sheet-body">
      {description && <p className="medo-dialog__description">{description}</p>}
      {children}
    </div>
  );
}

/** Figma: focus starts in the first field, else on the first button. */
const FIELDS = 'input, textarea, select, [role="combobox"], button[aria-haspopup="listbox"]';
export function useInitialFocus(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const usable = (el: HTMLElement) => el.tabIndex >= 0 && !el.closest('[aria-hidden="true"], [inert]') && !el.matches(':disabled');
    const field = [...root.querySelectorAll<HTMLElement>(FIELDS)].find(usable);
    (field ?? [...root.querySelectorAll<HTMLElement>('button')].find(usable))?.focus();
  }, [ref]);
}

/* ---------- Alert dialog ---------- */

export type AlertDialogTone = 'danger' | 'warning' | 'info';

/** Same icons as the Alert (C20): danger = circle-alert, warning = triangle-alert, info = info. */
const TONE_ICONS: Record<AlertDialogTone, typeof Info> = {
  danger: CircleAlert,
  warning: TriangleAlert,
  info: Info,
};

export interface AlertDialogProps extends OpenProps {
  /** danger: irreversible or destructive · warning: risk of data loss · info: must be acknowledged. */
  tone?: AlertDialogTone;
  /** Required. A question („Delete Q3-Report.pdf?“). */
  title: ReactNode;
  /** The consequence („This cannot be undone.“). */
  children?: ReactNode;
  /** Verb of the action („Delete“). Danger tone: danger button, else primary. */
  actionLabel: string;
  /** Runs, then the dialog closes. A promise shows the pending state until it resolves. */
  onAction?: () => void | Promise<unknown>;
  cancelLabel?: string;
  className?: string;
}

/**
 * Alert dialog – a decision that needs an answer before the user can go on (Figma: C19 Alert dialog).
 * role alertdialog, no X, a click on the scrim never closes, Esc = Cancel. Focus starts on Cancel,
 * so an accidental Enter never deletes. Below 640 px: icon on top, buttons stacked (lg).
 */
export function AlertDialog({ tone = 'danger', title, children, actionLabel, onAction, cancelLabel = 'Cancel', className, ...openProps }: AlertDialogProps) {
  const [open, setOpen] = useOpenState(openProps);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const descriptionId = useId();
  const Icon = TONE_ICONS[tone];
  const size: ButtonSize = isMobile ? 'lg' : 'md';
  return (
    <ModalOverlay isOpen={open} onOpenChange={setOpen} isDismissable={false} className="medo-dialog-overlay">
      <Modal className={cx('medo-dialog', 'medo-alert-dialog', `medo-alert-dialog--${tone}`, className)}>
        <AriaDialog role="alertdialog" aria-describedby={children ? descriptionId : undefined} className="medo-dialog__dialog">
          {({ close }) => (
            <>
              <div className="medo-alert-dialog__content">
                <span className="medo-alert-dialog__icon" aria-hidden="true">
                  <Icon />
                </span>
                <div className="medo-alert-dialog__text">
                  <Heading slot="title" className="medo-alert-dialog__title">
                    {title}
                  </Heading>
                  {children && (
                    <div id={descriptionId} className="medo-alert-dialog__description">
                      {children}
                    </div>
                  )}
                </div>
              </div>
              <ButtonGroup>
                <Button variant="secondary" size={size} autoFocus onPress={close}>
                  {cancelLabel}
                </Button>
                <ActionButton action={{ label: actionLabel, onAction }} close={close} size={size} variant={tone === 'danger' ? 'danger' : 'primary'} />
              </ButtonGroup>
            </>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}
