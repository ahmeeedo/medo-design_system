import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  Button as AriaButton,
  Input as AriaInput,
  TextArea as AriaTextArea,
  TextField as AriaTextField,
  type ButtonProps as AriaButtonProps,
  type TextFieldProps as AriaTextFieldProps,
} from 'react-aria-components';
import { FieldFooter, FieldLabel } from '../field/Field';
import { cx } from '../utils/cx';
import './input.css';

export type InputSize = 'sm' | 'md' | 'lg';

export interface TextFieldProps extends Omit<AriaTextFieldProps, 'children' | 'className' | 'style'> {
  /** Visible label. Always set one – a placeholder is no label. */
  label: ReactNode;
  /** Helper text below the field. Replaced by the error message when invalid. */
  description?: ReactNode;
  /** Error text shown when the field is invalid (isInvalid or failed validation). */
  errorMessage?: ReactNode;
  placeholder?: string;
  /** sm 32 · md 40 · lg 48 px. Use lg on mobile and touch. Textareas: md or lg. */
  size?: InputSize;
  /** Decorative icon before the text (hidden from screen readers). */
  leadingIcon?: ReactNode;
  /** Trailing action, e.g. `<InputAction aria-label="Show password" />`. */
  trailing?: ReactNode;
  /** Multi-line text (Textarea): min 3 rows, grows up to 8 rows. */
  multiline?: boolean;
  /** Soft limit: typing beyond is allowed, the counter turns red. Validate on submit. */
  characterLimit?: number;
  className?: string;
}

/** Text input with label, helper and error text (Figma: Field + Input / Textarea). */
export function TextField({
  label,
  description,
  errorMessage,
  placeholder,
  size = 'md',
  leadingIcon,
  trailing,
  multiline,
  characterLimit,
  className,
  onChange,
  ...props
}: TextFieldProps) {
  const [length, setLength] = useState((props.value ?? props.defaultValue ?? '').length);
  const count = props.value !== undefined ? props.value.length : length;

  return (
    <AriaTextField
      {...props}
      className={cx('medo-field', className)}
      onChange={(value) => {
        setLength(value.length);
        onChange?.(value);
      }}
    >
      <FieldLabel isRequired={props.isRequired}>{label}</FieldLabel>
      {multiline ? (
        <AriaTextArea className={cx('medo-textarea', `medo-textarea--${size === 'lg' ? 'lg' : 'md'}`)} placeholder={placeholder} onInput={clearErrorWhenValid} />
      ) : (
        <div className={cx('medo-input', `medo-input--${size}`)}>
          {leadingIcon && (
            <span className="medo-input__icon" aria-hidden="true">
              {leadingIcon}
            </span>
          )}
          <AriaInput className="medo-input__control" placeholder={placeholder} onInput={clearErrorWhenValid} />
          {trailing}
        </div>
      )}
      <FieldFooter description={description} errorMessage={errorMessage}>
        {characterLimit !== undefined && <CharacterCount count={count} limit={characterLimit} />}
      </FieldFooter>
    </AriaTextField>
  );
}

/**
 * „Reward early, punish late“: an error disappears as soon as the input is valid while typing –
 * new errors still only appear on blur or submit. React Aria commits validation on the native
 * change event (blur), so a valid input dispatches it early. Without this the error text vanished
 * on the next mousedown, the layout shifted and the click on e.g. „Save“ missed its target.
 * Checked after the render, when React Aria has updated custom validity (validate functions).
 */
function clearErrorWhenValid(e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
  const el = e.currentTarget;
  requestAnimationFrame(() => {
    if (el.validity.valid && el.closest('[data-invalid]')) el.dispatchEvent(new Event('change'));
  });
}

/** Visible counter plus a calm, delayed announcement for screen readers (pattern of GOV.UK). */
function CharacterCount({ count, limit }: { count: number; limit: number }) {
  const over = count - limit;
  const text = over > 0 ? `${over} too many` : `${count} / ${limit}`;
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const id = setTimeout(
      () => setAnnouncement(over > 0 ? `${over} characters too many` : `${limit - count} characters left`),
      1000,
    );
    return () => clearTimeout(id);
  }, [count, limit, over]);

  return (
    <>
      <span className="medo-field__counter" data-over={over > 0 || undefined} aria-hidden="true">
        {text}
      </span>
      <span className="medo-visually-hidden" aria-live="polite">
        {announcement}
      </span>
    </>
  );
}

export interface InputActionProps extends Omit<AriaButtonProps, 'className' | 'children'> {
  /** Required: icon-only buttons need an accessible name. */
  'aria-label': string;
  icon: ReactNode;
}

/** Icon button inside an input, e.g. clear or show password (Figma: _Input action). */
export function InputAction({ icon, ...props }: InputActionProps) {
  return (
    <AriaButton {...props} className="medo-input__action">
      {icon}
    </AriaButton>
  );
}
