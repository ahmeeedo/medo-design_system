import { useContext, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Form as AriaForm, FormValidationContext, type FormProps as AriaFormProps } from 'react-aria-components';
import { Alert } from '../alert/Alert';
import { cx } from '../utils/cx';
import { useMessages } from '../i18n/I18n';

/**
 * Errors the server found in the input – reject `onSave` (or a Dialog's `onAction`) with it.
 * `fields`: message per field name, shown at the field. `formError`: a problem of the whole form (no field), shown
 * above the fields. Everything else a promise rejects with counts as “could not save” (network, server down).
 *
 *   throw new FieldErrors({ email: 'This email address is already registered. Sign in instead.' });
 */
export class FieldErrors extends Error {
  readonly fields: Record<string, string | string[]>;
  readonly formError?: string;
  constructor(fields: Record<string, string | string[]>, formError?: string) {
    super(formError ?? Object.values(fields).flat().join(' '));
    this.name = 'FieldErrors';
    this.fields = fields;
    this.formError = formError;
  }
}

/**
 * Focuses the first field (in DOM order) whose name is in `names`. Hidden native inputs (Select, Combobox) hand the
 * focus to the visible control of their field. Internal: Form and Dialog.
 */
export function focusField(root: HTMLElement, names: string[]) {
  const named = [...root.querySelectorAll<HTMLInputElement>('[name]')].find((el) => names.includes(el.name));
  if (!named) return false;
  const hidden = named.type === 'hidden' || named.closest('[aria-hidden="true"]') || named.tabIndex < 0;
  const target = hidden ? named.closest('.medo-field')?.querySelector<HTMLElement>('input:not([type="hidden"]), textarea, button, [tabindex="0"]') : named;
  target?.focus();
  return !!target;
}

export interface FormProps extends Omit<AriaFormProps, 'children' | 'className'> {
  /** The fields. A function gets `{ isPending }` while `onSave` runs – for the submit button. */
  children: ReactNode | ((state: { isPending: boolean }) => ReactNode);
  /**
   * Saves the input (gets the FormData). Runs only when every field is valid. Return a promise: while it runs the form
   * is pending; reject with FieldErrors to show the server's messages at the fields; any other rejection shows
   * “could not save” above the fields. The input always stays.
   */
  onSave?: (data: FormData) => Promise<unknown> | void;
  /** A problem of the whole form that belongs to no field (“The offer has expired”). Shown above the fields, focused. */
  formError?: ReactNode;
  /** Text when `onSave` fails for another reason than FieldErrors. Default: built-in text. */
  saveErrorMessage?: string;
  className?: string;
}

/**
 * Form – React Aria Form with the error rules of the system:
 * - Errors appear at the field (client checks and server messages alike); on submit the focus goes to the first one.
 * - Screen readers also hear how many fields need attention (“2 fields need attention”), the overview a glance gives.
 * - An error of the whole form (no field) is an Alert above the fields and takes the focus.
 * - What was typed always stays. A server message disappears once its field was changed and left (React Aria).
 */
export function Form({ children, onSave, onSubmit, formError: formErrorProp, saveErrorMessage, validationErrors, className, ...props }: FormProps) {
  const m = useMessages();
  const ref = useRef<HTMLFormElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string | string[]>>({});
  const [ownFormError, setOwnFormError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const invalid = useRef(0);
  const formError = formErrorProp ?? ownFormError;
  // A stable object: React Aria shows server messages again whenever it gets a new one, also after the field changed.
  // Messages from outside (a Dialog opened again after a background save failed) count too.
  const outer = useContext(FormValidationContext);
  const errors = useMemo(() => ({ ...outer, ...validationErrors, ...serverErrors }), [outer, validationErrors, serverErrors]);
  const focusFirst = (names: string[]) => ref.current && focusField(ref.current, names);

  // The same count again must be announced again: alternate a trailing no-break space.
  const announce = (count: number) => setAnnouncement((before) => m.form.errorCount(count) + (before.endsWith(' ') ? '' : ' '));

  // The browser fires “invalid” once per invalid field on submit, then nothing else: count them, announce once.
  const announceRef = useRef(announce);
  announceRef.current = announce;
  useEffect(() => {
    const form = ref.current;
    if (!form) return;
    const onInvalid = () => {
      if (invalid.current++ === 0) {
        setTimeout(() => {
          announceRef.current(invalid.current);
          invalid.current = 0;
        });
      }
    };
    form.addEventListener('invalid', onInvalid, true);
    return () => form.removeEventListener('invalid', onInvalid, true);
  }, []);

  // Messages from outside (validationErrors, e.g. a server action's result, or a Dialog) are treated like the own:
  // count announced, focus on the first. Compared by content – an inline object must not move the focus each render.
  const externalKey = JSON.stringify({ ...outer, ...validationErrors });
  useEffect(() => {
    const external: Record<string, string | string[]> = JSON.parse(externalKey);
    const names = Object.keys(external).filter((name) => [external[name]].flat().some(Boolean));
    if (!names.length) return;
    announceRef.current(names.length);
    const frame = requestAnimationFrame(() => ref.current && focusField(ref.current, names));
    return () => cancelAnimationFrame(frame);
  }, [externalKey]);

  useEffect(() => {
    if (formError) alertRef.current?.focus();
  }, [formError]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    onSubmit?.(e);
    if (!onSave || e.defaultPrevented) return;
    e.preventDefault();
    if (pending) return;
    setOwnFormError(null);
    setServerErrors({});
    setPending(true);
    try {
      await onSave(new FormData(e.currentTarget));
    } catch (error) {
      if (error instanceof FieldErrors) {
        setServerErrors(error.fields);
        const names = Object.keys(error.fields);
        if (names.length) {
          announce(names.length);
          requestAnimationFrame(() => focusFirst(names));
        }
        if (error.formError) setOwnFormError(error.formError);
      } else {
        setOwnFormError(saveErrorMessage ?? m.form.saveFailed);
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <AriaForm {...props} ref={ref} validationErrors={errors} onSubmit={submit} className={cx('medo-form', className)} data-pending={pending || undefined}>
      {formError && (
        <div ref={alertRef} tabIndex={-1} className="medo-form__error">
          <Alert tone="danger" title={formError} />
        </div>
      )}
      {typeof children === 'function' ? children({ isPending: pending }) : children}
      <span className="medo-visually-hidden" aria-live="polite">
        {announcement}
      </span>
    </AriaForm>
  );
}
