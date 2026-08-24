import type * as React from "react";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: React.ReactNode;
  /** Zweite Zeile unter dem Label, kleiner und gedämpft. */
  hint?: string;
  /** Unbestimmter Zwischenzustand für „einige ausgewählt". */
  indeterminate?: boolean;
  error?: boolean;
  size?: "sm" | "md";
}

export interface CheckboxGroupProps {
  /** Überschrift der Gruppe. Wird als `<legend>` gerendert. */
  legend?: string;
  direction?: "vertical" | "horizontal";
  children?: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps>;
export const CheckboxGroup: React.FC<CheckboxGroupProps>;
