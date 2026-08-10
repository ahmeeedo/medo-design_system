import type * as React from "react";

export interface LoadingProps {
  size?: "sm" | "md" | "lg";
  /** Text unter dem Spinner. Ohne Text steht `aria-label="Wird geladen"`. */
  label?: React.ReactNode;
  /** `inline` im Fluss, `overlay` über dem nächsten positionierten Vorfahren, `fullpage` über allem. */
  variant?: "inline" | "overlay" | "fullpage";
  /** Eigene Farbe; Standard ist primary-600 (der Spinner erbt `currentColor`). */
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface SkeletonProps {
  /** `lines` Textzeilen, `block` eine Fläche, `card` Avatar + Titel + Zeilen, `table` Zeilenraster. */
  variant?: "lines" | "block" | "card" | "table";
  /** Anzahl Zeilen bei `lines`. */
  lines?: number;
  /** Anzahl Zeilen bei `table`. */
  rows?: number;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const Loading: React.FC<LoadingProps>;
export const Skeleton: React.FC<SkeletonProps>;
