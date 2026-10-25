import type { ReactNode } from 'react';
import { Input as AriaInput, NumberField as AriaNumberField, type NumberFieldProps as AriaNumberFieldProps } from 'react-aria-components';
import { FieldFooter, FieldLabel } from '../field/Field';
import type { InputSize } from '../text-field/TextField';
import { cx } from '../utils/cx';
import '../text-field/input.css';

export interface NumberFieldProps extends Omit<AriaNumberFieldProps, 'children' | 'className' | 'style'> {
  /** Visible label. Without it set `aria-label` – only where the context names the field (e.g. next to a Slider). */
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
  placeholder?: string;
  /** sm 32 · md 40 · lg 48 px. lg on mobile and touch. */
  size?: InputSize;
  className?: string;
}

/**
 * Number field – a number with format and limits (the Input look of Figma: C03 Input). Built on React Aria
 * NumberField: formats with Intl (`formatOptions`: currency, percent, unit), clamps to min/max and rounds to the
 * step when the field is left, ↑ ↓ change by one step. Tabular figures.
 */
export function NumberField({ label, description, errorMessage, placeholder, size = 'md', className, ...props }: NumberFieldProps) {
  return (
    <AriaNumberField {...props} className={cx('medo-field', 'medo-number-field', className)}>
      {label && <FieldLabel isRequired={props.isRequired}>{label}</FieldLabel>}
      <div className={cx('medo-input', `medo-input--${size}`)}>
        <AriaInput className="medo-input__control medo-number-field__control" placeholder={placeholder} />
      </div>
      {(description || errorMessage) && <FieldFooter description={description} errorMessage={errorMessage} />}
    </AriaNumberField>
  );
}
