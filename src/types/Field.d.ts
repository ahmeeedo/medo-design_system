import type * as React from "react";

export interface FieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  success?: string;
  fullWidth?: boolean;
  children?: React.ReactNode;
  /** Liegt auf der äußeren Hülle des Feldes. */
  className?: string;
  /** Liegt auf der äußeren Hülle des Feldes. */
  style?: React.CSSProperties;
}

/** Hülle für eigene Eingabeelemente: Label, Rahmen, Meldung. */
export const Field: React.FC<FieldProps>;
