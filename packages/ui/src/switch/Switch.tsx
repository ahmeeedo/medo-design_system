import type { ReactNode } from 'react';
import { SwitchButton, SwitchField, Text, type SwitchFieldProps } from 'react-aria-components';
import { Check, LoaderCircle, X } from 'lucide-react';
import { cx } from '../utils/cx';
import './switch.css';

export interface SwitchProps extends Omit<SwitchFieldProps, 'children' | 'className' | 'style'> {
  /** Label. Describes the setting, never the state („Notifications“, not „On“). */
  children: ReactNode;
  description?: ReactNode;
  /** md (36 × 20) · lg (44 × 24, mobile). */
  size?: 'md' | 'lg';
  /** start: label first, switch at the end (settings lists). end: switch first (forms). */
  labelPosition?: 'start' | 'end';
  /** While the change is being saved. The switch cannot be toggled meanwhile. */
  isLoading?: boolean;
  className?: string;
}

/** Switch – on / off with immediate effect (Figma: C12 Switch). */
export function Switch({
  children,
  description,
  size = 'md',
  labelPosition = 'end',
  isLoading,
  isReadOnly,
  className,
  ...props
}: SwitchProps) {
  return (
    <SwitchField
      {...props}
      isReadOnly={isReadOnly || isLoading}
      aria-busy={isLoading || undefined}
      className={cx('medo-switch', `medo-switch--${size}`, `medo-switch--label-${labelPosition}`, className)}
    >
      <SwitchButton className="medo-switch__button">
        {({ isSelected }) => (
          <>
            <span className="medo-switch__track" aria-hidden="true">
              <span className="medo-switch__thumb">
                {isLoading ? <LoaderCircle className="medo-switch__spinner" /> : isSelected ? <Check /> : <X />}
              </span>
            </span>
            <span className="medo-switch__label">{children}</span>
          </>
        )}
      </SwitchButton>
      {description && (
        <Text slot="description" className="medo-switch__description">
          {description}
        </Text>
      )}
    </SwitchField>
  );
}
