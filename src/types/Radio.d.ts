import type * as React from "react";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: React.ReactNode;
  hint?: string;
  error?: boolean;
  size?: "sm" | "md";
}

export interface RadioGroupOption {
  value: string;
  label: React.ReactNode;
  hint?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  legend?: string;
  /** Wird automatisch erzeugt, wenn nicht gesetzt. */
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  direction?: "vertical" | "horizontal";
  /** `card` rendert die Optionen als Auswahlkarten (Titel, Beschreibung, Punkt rechts oben). Braucht `options`. */
  variant?: "list" | "card";
  disabled?: boolean;
  size?: "sm" | "md";
  /** Kurzform statt einzelner `<Radio>`-Kinder. */
  options?: RadioGroupOption[];
  children?: React.ReactNode;
}

export const Radio: React.FC<RadioProps>;
export const RadioGroup: React.FC<RadioGroupProps>;
