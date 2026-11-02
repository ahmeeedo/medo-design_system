import { useEffect, type ReactNode } from 'react';
import { FieldError, Label, Text, type ValidationResult } from 'react-aria-components';
import { CircleAlert } from 'lucide-react';

// Bundlers replace process.env.NODE_ENV at build time; without one, process may not exist.
declare const process: { env: { NODE_ENV?: string } } | undefined;

/** Label with the visual required marker. The field itself is announced as required. */
export function FieldLabel({ children, isRequired }: { children: ReactNode; isRequired?: boolean }) {
  return (
    <Label className="medo-field__label">
      {children}
      {isRequired && (
        <span className="medo-field__required" aria-hidden="true">
          *
        </span>
      )}
    </Label>
  );
}

/** Helper text and error message. The error replaces the helper text when the field is invalid. */
export function FieldFooter({
  description,
  errorMessage,
  children,
}: {
  description?: ReactNode;
  /** A function gets the validation details (rangeUnderflow, badInput …) to name the rule. */
  errorMessage?: ReactNode | ((validation: ValidationResult) => ReactNode);
  children?: ReactNode;
}) {
  return (
    <div className="medo-field__footer">
      {description && (
        <Text slot="description" className="medo-field__description">
          {description}
        </Text>
      )}
      <FieldErrorText errorMessage={errorMessage} />
      {children}
    </div>
  );
}

/**
 * The error message with its icon, inside a field. Without any text (no errorMessage and no message from native
 * validation) nothing is shown and the helper text stays – an icon alone explains nothing.
 */
export function FieldErrorText({ errorMessage }: { errorMessage?: ReactNode | ((validation: ValidationResult) => ReactNode) }) {
  return (
    <FieldError className="medo-field__error">
      {(validation) => {
        // Messages from `validate` or the server (Form validationErrors) are specific – they win over the general
        // errorMessage, which describes the field's own rules (required, type, min/max).
        const specific = validation.validationDetails.customError ? validation.validationErrors.join(' ') : '';
        const text = specific || (typeof errorMessage === 'function' ? errorMessage(validation) : errorMessage) || validation.validationErrors.join(' ');
        return text ? (
          <>
            <CircleAlert aria-hidden="true" />
            <span>{text}</span>
          </>
        ) : (
          <MissingErrorWarning />
        );
      }}
    </FieldError>
  );
}

/** Development only: an invalid field needs a message that says what is wrong and how to fix it. */
function MissingErrorWarning() {
  useEffect(() => {
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') return;
    console.warn('@med-o/ui: a field is invalid without an error message. Pass errorMessage, e.g. “Enter a valid email address.”');
  }, []);
  return null;
}
