import { useContext, type ReactNode } from 'react';
import { RadioButton, RadioField, RadioGroup as AriaRadioGroup, Text, type RadioFieldProps, type RadioGroupProps as AriaRadioGroupProps } from 'react-aria-components';
import { FieldFooter, FieldLabel } from '../field/Field';
import { ChoiceSizeContext, type ChoiceSize } from '../checkbox/Checkbox';
import { cx } from '../utils/cx';
import '../checkbox/choice.css';

export interface RadioProps extends Omit<RadioFieldProps, 'children' | 'className' | 'style'> {
  children?: ReactNode;
  description?: ReactNode;
  size?: ChoiceSize;
  className?: string;
}

/** One option of a RadioGroup. */
export function Radio({ children, description, size, className, ...props }: RadioProps) {
  const groupSize = useContext(ChoiceSizeContext);
  return (
    <RadioField {...props} className={cx('medo-choice', 'medo-radio', `medo-choice--${size ?? groupSize}`, className)}>
      <RadioButton className="medo-choice__button">
        <span className="medo-choice__control" aria-hidden="true" />
        {children && <span className="medo-choice__label">{children}</span>}
      </RadioButton>
      {description && (
        <Text slot="description" className="medo-choice__description">
          {description}
        </Text>
      )}
    </RadioField>
  );
}

export interface RadioGroupProps extends Omit<AriaRadioGroupProps, 'children' | 'className' | 'style'> {
  /** Group label (rendered like a legend). Without it set `aria-label` – only where the context names the group (e.g. an Accordion title). */
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
  size?: ChoiceSize;
  children: ReactNode;
  className?: string;
}

/**
 * Pick exactly one of 2–4 visible options (5 or more: use a Select).
 * Arrow keys move and select; a choice cannot be removed again.
 */
export function RadioGroup({ label, description, errorMessage, size = 'md', children, className, ...props }: RadioGroupProps) {
  return (
    <AriaRadioGroup {...props} className={cx('medo-field', 'medo-field--group', className)}>
      {label && <FieldLabel isRequired={props.isRequired}>{label}</FieldLabel>}
      <ChoiceSizeContext.Provider value={size}>
        <div className="medo-field__options">{children}</div>
      </ChoiceSizeContext.Provider>
      <FieldFooter description={description} errorMessage={errorMessage} />
    </AriaRadioGroup>
  );
}
