import { createContext, useContext, type ReactNode } from 'react';
import {
  CheckboxButton,
  CheckboxField,
  CheckboxGroup as AriaCheckboxGroup,
  Text,
  type CheckboxFieldProps,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
} from 'react-aria-components';
import { Check, Minus } from 'lucide-react';
import { FieldErrorText, FieldFooter, FieldLabel } from '../field/Field';
import { cx } from '../utils/cx';

export type ChoiceSize = 'md' | 'lg';
export const ChoiceSizeContext = createContext<ChoiceSize>('md');

export interface CheckboxProps extends Omit<CheckboxFieldProps, 'children' | 'className' | 'style'> {
  /** Label. Clicking it toggles the checkbox. */
  children?: ReactNode;
  /** Second line below the label. */
  description?: ReactNode;
  /** A single checkbox only (e.g. “Accept the terms”): shown when it is invalid. In a CheckboxGroup the group has the message. */
  errorMessage?: ReactNode;
  /** md (16 px box, 14 px text) · lg (20 px box, 16 px text, mobile). Inherits from a group. */
  size?: ChoiceSize;
  className?: string;
}

/** Checkbox – on its own or inside a CheckboxGroup. */
export function Checkbox({ children, description, errorMessage, size, className, ...props }: CheckboxProps) {
  const groupSize = useContext(ChoiceSizeContext);
  return (
    <CheckboxField {...props} className={cx('medo-choice', 'medo-checkbox', `medo-choice--${size ?? groupSize}`, className)}>
      <CheckboxButton className="medo-choice__button">
        {({ isSelected, isIndeterminate }) => (
          <>
            <span className="medo-choice__control" aria-hidden="true">
              {isIndeterminate ? <Minus /> : isSelected ? <Check /> : null}
            </span>
            {children && <span className="medo-choice__label">{children}</span>}
          </>
        )}
      </CheckboxButton>
      {description && (
        <Text slot="description" className="medo-choice__description">
          {description}
        </Text>
      )}
      {/* In a CheckboxGroup React Aria gives no validation here: nothing renders, the group shows its message. */}
      <FieldErrorText errorMessage={errorMessage} />
    </CheckboxField>
  );
}

export interface CheckboxGroupProps extends Omit<AriaCheckboxGroupProps, 'children' | 'className' | 'style'> {
  /** Group label (rendered like a legend). Without it set `aria-label` – only where the context names the group (e.g. an Accordion title). */
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
  size?: ChoiceSize;
  /** vertical (default) or horizontal for 2–3 short options. */
  orientation?: 'vertical' | 'horizontal';
  children: ReactNode;
  className?: string;
}

/** Several checkboxes with one label, helper and error text. */
export function CheckboxGroup({ label, description, errorMessage, size = 'md', orientation = 'vertical', children, className, ...props }: CheckboxGroupProps) {
  return (
    <AriaCheckboxGroup {...props} className={cx('medo-field', 'medo-field--group', className)} data-orientation={orientation}>
      {label && <FieldLabel isRequired={props.isRequired}>{label}</FieldLabel>}
      <ChoiceSizeContext.Provider value={size}>
        <div className="medo-field__options">{children}</div>
      </ChoiceSizeContext.Provider>
      <FieldFooter description={description} errorMessage={errorMessage} />
    </AriaCheckboxGroup>
  );
}
