import { createContext, useContext, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Dialog as AriaDialog, DialogContext, FormValidationContext, Heading, Modal, ModalOverlay, OverlayTriggerStateContext, Provider } from 'react-aria-components';
import { CircleAlert, Info, TriangleAlert, X } from 'lucide-react';
import { BottomSheet } from '../bottom-sheet/BottomSheet';
import { Button, ButtonGroup, type ButtonSize } from '../button/Button';
import { IconButton } from '../icon-button/IconButton';
import { cx } from '../utils/cx';
import { MOBILE_QUERY, useMediaQuery } from '../utils/useMediaQuery';
import { useMessages } from '../i18n/I18n';
import { toast } from '../toast/Toast';
import { Alert } from '../alert/Alert';
import { FieldErrors, focusField } from '../form/Form';

/** Opens a Dialog or Alert dialog from a trigger (React Aria DialogTrigger). Focus returns to the trigger. */
export { DialogTrigger } from 'react-aria-components';

/* ---------- Shared ---------- */

export interface DialogAction {
  /** Verb that says what happens (“Send invite”, “Delete”). Never “OK”, “Yes” or “Confirm”. */
  label: string;
  /**
   * Runs on press, then the dialog closes. Return a promise to show the pending state until it resolves; when it
   * rejects, the dialog stays open (show the error inside the dialog).
   * The dialog can be closed while the promise runs (Esc, Cancel, ×) – it never asks “Discard changes?” then, the
   * saving goes on and `backgroundToast` reports the result. A result that arrives late never closes a dialog that
   * was opened again in the meantime.
   * Reject with `FieldErrors` when the server finds a problem in the input: open, the messages show at the fields;
   * closed, the error Toast offers “Open again” instead of Retry – the dialog opens with the messages at the fields.
   * For that the app must keep the values (controlled fields), the dialog content is new on every opening.
   */
  onAction?: () => void | Promise<unknown>;
  /**
   * Shown as a Toast when the promise settles after the dialog was closed – name the object, e.g.
   * `{ success: 'Invite sent to anna@example.com', error: 'Invite to anna@example.com not sent' }`. The error toast
   * stays until closed and offers Retry, which runs `onAction` again. Needs a ToastRegion in the app.
   * While something saves in the background, the app can warn before the page is left (a `beforeunload` listener
   * while its requests run) – the dialog does not know the app's other requests.
   */
  backgroundToast?: { success: string; error: string };
  /**
   * Dialog only: the dialog cannot be closed while the action runs (Cancel and × are disabled, Esc and the scrim do
   * nothing). For actions whose result people must see before they go on: a payment, a deletion of many records.
   */
  blocking?: boolean;
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

/**
 * Between a dialog and its main action: the action reports while it saves (closing then never asks “Discard
 * changes?”), the dialog tells which opening is current – a result of an earlier opening must not close this one.
 */
interface ActionRun {
  setSaving: (saving: boolean) => void;
  /** Counts the openings; -1 while closed. */
  opening: { current: number };
  /** Opens the dialog again with the server's messages at the fields (Dialog only). */
  reopen?: (errors: FieldErrors) => void;
}
const ActionRunContext = createContext<ActionRun | null>(null);

/** Provides the ActionRun of a dialog; returns its value and whether its action is saving. */
function useActionRun(open: boolean, reopen?: (errors: FieldErrors) => void) {
  const [saving, setSaving] = useState(false);
  const count = useRef(0);
  const opening = useRef(open ? 0 : -1);
  useEffect(() => {
    opening.current = open ? ++count.current : -1;
  }, [open]);
  const run = useRef<ActionRun>({ setSaving, opening }).current;
  run.reopen = reopen;
  return { run, saving };
}

interface BackgroundLabels {
  retry: string;
  reopen: string;
}

/**
 * Reports a result that arrives after the dialog was closed as a Toast. A failure offers Retry (runs `onAction`
 * again, reported the same way); a FieldErrors failure offers “Open again” – retrying the same input would only fail
 * again.
 */
function settleInBackground(promise: Promise<unknown>, action: DialogAction, labels: BackgroundLabels, reopen?: (errors: FieldErrors) => void) {
  const messages = action.backgroundToast;
  promise.then(
    () => messages && toast(messages.success),
    (error: unknown) => {
      if (!messages) return;
      const onAction = action.onAction;
      const fix = error instanceof FieldErrors && reopen ? { label: labels.reopen, onAction: () => reopen(error) } : undefined;
      const retry = onAction && {
        label: labels.retry,
        onAction: () => {
          const again = onAction();
          if (again instanceof Promise) settleInBackground(again, action, labels, reopen);
          else toast(messages.success);
        },
      };
      toast(messages.error, { persistent: true, action: fix ?? retry });
    },
  );
}

/**
 * Main action button: runs the action and closes; a promise shows the pending state. Shared with Popover (internal,
 * not exported from the package). Contract for a promise:
 * - resolves while open → the dialog closes;
 * - rejects while open → the dialog stays open, the app shows the error inside (no unhandled rejection);
 * - the dialog was closed meanwhile → nothing closes (also not a dialog opened again), `backgroundToast` reports;
 * - a second press while pending → ignored (React Aria Button with isPending).
 */
export function ActionButton({ action, close, size, variant }: { action: DialogAction; close: () => void; size: ButtonSize; variant: 'primary' | 'danger' }) {
  const m = useMessages();
  const [pending, setPending] = useState(false);
  const context = useContext(ActionRunContext);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    context?.setSaving(pending);
  }, [pending, context]);

  const run = async () => {
    const result = action.onAction?.();
    if (!(result instanceof Promise)) return close();
    const opening = context?.opening.current;
    // Still the same opening of the dialog (without a dialog around it: still on screen)?
    const stillOpen = () => (context ? context.opening.current === opening : mounted.current);
    setPending(true);
    // “Retry” is the same word as on a failed upload.
    const labels = { retry: m.upload.retryShort, reopen: m.dialog.reopen };
    try {
      await result;
      if (stillOpen()) close();
      else settleInBackground(Promise.resolve(), action, labels);
    } catch (error) {
      // Open: FieldErrors go to the fields, anything else the app shows in the dialog. Closed: the error Toast
      // reports it and offers Retry – or “Open again” for FieldErrors.
      if (stillOpen()) {
        if (error instanceof FieldErrors) context?.reopen?.(error);
      } else settleInBackground(Promise.reject(error), action, labels, context?.reopen);
    } finally {
      if (mounted.current) setPending(false);
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
 * Open state with the “Discard changes?” guard (protects unsaved input). Every way of closing
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
  const m = useMessages();
  const discard: DialogDiscardText = {
    title: m.dialog.discardTitle,
    description: m.dialog.discardDescription,
    actionLabel: m.dialog.discardAction,
    cancelLabel: m.dialog.discardCancel,
    ...discardText,
  };
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
  /** Required. Names the task (“Invite member”). Screen readers announce it when the dialog opens. */
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
   * first ask “Discard changes?” (Alert dialog).
   */
  isDirty?: boolean;
  /** Text of the “Discard changes?” Alert dialog. */
  discardText?: Partial<DialogDiscardText>;
  /** auto: dialog on desktop, `mobile` below 640 px · dialog · fullscreen · sheet. */
  overlay?: 'auto' | 'dialog' | 'fullscreen' | 'sheet';
  /** Pattern below 640 px: fullscreen for forms (keyboard needs space), sheet for short content. */
  mobile?: 'fullscreen' | 'sheet';
  className?: string;
}

/**
 * Dialog – a modal window for a focused task. Built on React Aria ModalOverlay,
 * Modal and Dialog: role dialog with aria-modal, the title names it, focus starts in the first field,
 * stays inside and returns to the trigger; the page behind does not scroll. Use inside a DialogTrigger or with isOpen.
 */
export function Dialog({
  title,
  description,
  children,
  size = 'md',
  primaryAction,
  cancelLabel: cancelLabelProp,
  closeLabel: closeLabelProp,
  showClose = true,
  isDirty = false,
  discardText,
  overlay = 'auto',
  mobile = 'fullscreen',
  className,
  ...openProps
}: DialogProps) {
  const m = useMessages();
  const cancelLabel = cancelLabelProp ?? m.common.cancel;
  const closeLabel = closeLabelProp ?? m.common.close;
  const [openState, setOpenState] = useOpenState(openProps);
  // The server's messages for this opening (FieldErrors from the main action); gone when the dialog closes.
  const [serverErrors, setServerErrors] = useState<FieldErrors | null>(null);
  const { run, saving } = useActionRun(openState, (errors) => {
    setServerErrors(errors);
    setOpenState(true);
  });
  useEffect(() => {
    if (!openState) setServerErrors(null);
  }, [openState]);
  const busy = saving || !!primaryAction?.isPending;
  const blocked = busy && !!primaryAction?.blocking;
  // While the main action saves, closing does not ask: the changes are being saved, not discarded.
  const guard = useDirtyGuard({ isDirty: isDirty && !busy, discardText, ...openProps });
  const { open, confirmDiscard, forceClose } = guard;
  // Blocking action: no way to close until it is done.
  const onOpenChange = (next: boolean) => (blocked && !next ? undefined : guard.onOpenChange(next));
  const content = (close: () => void) => <ServerErrorsScope errors={serverErrors}>{typeof children === 'function' ? children(close) : children}</ServerErrorsScope>;
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const layout = overlay === 'auto' ? (isMobile ? mobile : 'dialog') : overlay;

  if (layout === 'sheet') {
    return (
      <ActionRunContext.Provider value={run}>
        <BottomSheet
          title={title}
          closeLabel={closeLabel}
          isOpen={open}
          onOpenChange={onOpenChange}
          isDismissable={!isDirty && !blocked}
          isKeyboardDismissDisabled={blocked}
          className={className}
          footer={
            primaryAction &&
            ((close) => (
              <ButtonGroup>
                <Button variant="secondary" size="lg" isDisabled={blocked} onPress={close}>
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
      </ActionRunContext.Provider>
    );
  }

  const fullscreen = layout === 'fullscreen';
  return (
    <ActionRunContext.Provider value={run}>
      <ModalOverlay
        isOpen={open}
        onOpenChange={onOpenChange}
        isDismissable={!isDirty && !blocked}
        isKeyboardDismissDisabled={blocked}
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
            blocked={blocked}
          >
            {content}
          </DialogFrame>
        </Modal>
      </ModalOverlay>
    </ActionRunContext.Provider>
  );
}

interface FrameProps extends Pick<DialogProps, 'title' | 'description' | 'primaryAction' | 'showClose'> {
  fullscreen: boolean;
  cancelLabel: string;
  closeLabel: string;
  /** Rendered inside the dialog (focus scope): the “Discard changes?” Alert dialog. */
  nested: ReactNode;
  /** Closes without asking: the main action and the content's `close` (after saving). */
  forceClose: () => void;
  /** A blocking main action runs: Cancel and × are disabled. */
  blocked: boolean;
  children: (close: () => void) => ReactNode;
}

/** Header, scrolling body and footer of the centered and the fullscreen dialog. */
function DialogFrame({ title, description, fullscreen, primaryAction, cancelLabel, closeLabel, showClose, nested, forceClose, blocked, children }: FrameProps) {
  const descriptionId = useId();
  const ref = useRef<HTMLElement>(null);
  const [scrolls, setScrolls] = useState(false);
  useInitialFocus(ref);

  return (
    <AriaDialog ref={ref} className="medo-dialog__dialog" aria-describedby={description ? descriptionId : undefined} data-scrolled={scrolls || undefined}>
      {({ close }) => (
        // One structure for both layouts: the body (and the form in it) keeps its place, so typed input survives
        // when the window crosses 640 px – only header and footer change.
        <>
          {fullscreen ? (
            /* Mobile: Cancel left, title centered, main action right – always visible above the keyboard. */
            <div className="medo-dialog__bar">
              <Button variant="ghost" size="md" isDisabled={blocked} onPress={close}>
                {primaryAction ? cancelLabel : closeLabel}
              </Button>
              <Heading slot="title" className="medo-dialog__bar-title">
                {title}
              </Heading>
              {primaryAction ? <ActionButton action={primaryAction} close={forceClose} size="md" variant="primary" /> : <span />}
            </div>
          ) : (
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
              {showClose && <IconButton variant="ghost" size="sm" icon={<X />} aria-label={closeLabel} tooltip={false} isDisabled={blocked} onPress={close} />}
            </div>
          )}
          <DialogBody onScrollsChange={setScrolls}>
            {fullscreen && description && (
              <p id={descriptionId} className="medo-dialog__description">
                {description}
              </p>
            )}
            {children(forceClose)}
          </DialogBody>
          {!fullscreen && primaryAction && (
            <div className="medo-dialog__footer">
              <ButtonGroup>
                <Button variant="secondary" isDisabled={blocked} onPress={close}>
                  {cancelLabel}
                </Button>
                <ActionButton action={primaryAction} close={forceClose} size="md" variant="primary" />
              </ButtonGroup>
            </div>
          )}
          {nested}
        </>
      )}
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

const NO_ERRORS = {};

/**
 * The server's messages of the main action (FieldErrors): at the fields (React Aria FormValidationContext, also read
 * by Form), a problem of the whole form as an Alert on top. The focus goes to the first field with a message, else
 * to the Alert.
 */
function ServerErrorsScope({ errors, children }: { errors: FieldErrors | null; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!errors) return;
    // After the dialog's own initial focus.
    const frame = requestAnimationFrame(() => {
      if (!ref.current || !focusField(ref.current, Object.keys(errors.fields))) alertRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [errors]);
  return (
    <FormValidationContext.Provider value={errors?.fields ?? NO_ERRORS}>
      <div ref={ref} className="medo-dialog__content">
        {errors?.formError && (
          <div ref={alertRef} tabIndex={-1} className="medo-form__error">
            <Alert tone="danger" title={errors.formError} />
          </div>
        )}
        {children}
      </div>
    </FormValidationContext.Provider>
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

/** Focus starts in the first field, else on the first button. */
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

/** Same icons as the Alert: danger = circle-alert, warning = triangle-alert, info = info. */
const TONE_ICONS: Record<AlertDialogTone, typeof Info> = {
  danger: CircleAlert,
  warning: TriangleAlert,
  info: Info,
};

export interface AlertDialogProps extends OpenProps {
  /** danger: irreversible or destructive · warning: risk of data loss · info: must be acknowledged. */
  tone?: AlertDialogTone;
  /** Required. A question (“Delete Q3-Report.pdf?”). */
  title: ReactNode;
  /** The consequence (“This cannot be undone.”). */
  children?: ReactNode;
  /** Verb of the action (“Delete”). Danger tone: danger button, else primary. */
  actionLabel: string;
  /** Runs, then the dialog closes. A promise shows the pending state until it resolves. */
  onAction?: () => void | Promise<unknown>;
  cancelLabel?: string;
  className?: string;
}

/**
 * Alert dialog – a decision that needs an answer before the user can go on.
 * role alertdialog, no X, a click on the scrim never closes, Esc = Cancel. Focus starts on Cancel,
 * so an accidental Enter never deletes. Below 640 px: icon on top, buttons stacked (lg).
 */
export function AlertDialog({ tone = 'danger', title, children, actionLabel, onAction, cancelLabel: cancelLabelProp, className, ...openProps }: AlertDialogProps) {
  const m = useMessages();
  const cancelLabel = cancelLabelProp ?? m.common.cancel;
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
