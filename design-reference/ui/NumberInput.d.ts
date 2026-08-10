import type * as React from "react";

export interface NumberInputProps {
  label?: string;
  id?: string;
  name?: string;
  value?: number | string;
  defaultValue?: number | string;
  min?: number;
  max?: number;
  /** Schrittweite der Stepper und der Pfeiltasten. Standard 1. */
  step?: number;
  /** Nachkommastellen. Wird sonst aus `step` abgeleitet. */
  precision?: number;
  /** `chevrons` rechts (Standard) oder `plusminus` links und rechts (Touch). */
  variant?: "chevrons" | "plusminus";
  size?: "sm" | "md" | "lg";
  /** Feste Einheit vor dem Wert, z. B. „€". */
  prefix?: React.ReactNode;
  /** Feste Einheit nach dem Wert, z. B. „kg" oder „%". */
  suffix?: React.ReactNode;
  /** Überschreibt die Ausrichtung (Standard links, bei `plusminus` mittig). */
  align?: "left" | "center" | "right";
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  hint?: string;
  error?: string;
  success?: string;
  fullWidth?: boolean;
  /** Feste Feldbreite. Zahlenfelder sollen nicht über die ganze Spalte laufen. */
  width?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const NumberInput: React.FC<NumberInputProps>;
