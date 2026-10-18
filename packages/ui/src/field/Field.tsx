import type { ReactNode } from 'react';
import { FieldError, Label, Text } from 'react-aria-components';
import { CircleAlert } from 'lucide-react';
import '../utils/utilities.css';
import './field.css';

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
  errorMessage?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="medo-field__footer">
      {description && (
        <Text slot="description" className="medo-field__description">
          {description}
        </Text>
      )}
      <FieldError className="medo-field__error">
        {(validation) => (
          <>
            <CircleAlert aria-hidden="true" />
            <span>{errorMessage ?? validation.validationErrors.join(' ')}</span>
          </>
        )}
      </FieldError>
      {children}
    </div>
  );
}
