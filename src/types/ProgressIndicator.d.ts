import type * as React from "react";

export interface ProgressStep {
  title: React.ReactNode;
  /** Zweite Zeile — was in diesem Schritt passiert oder was fehlt. */
  subtitle?: React.ReactNode;
  /** Setzt den Zustand fest, statt ihn aus `current` abzuleiten (für Fehler nötig). */
  status?: "done" | "active" | "pending" | "error";
  /** Kennzeichnet den Schritt als übersprungbar. */
  optional?: boolean;
}

export interface ProgressIndicatorProps {
  steps: ProgressStep[];
  /** Index des aktiven Schritts, 0-basiert. Alles davor gilt als erledigt. */
  current?: number;
  orientation?: "horizontal" | "vertical";
  /** Gesetzt, werden erledigte Schritte anklickbar. */
  onStepClick?: (index: number, step: ProgressStep) => void;
  /** Erledigte Schritte anklickbar machen. Standard true (wirkt nur mit `onStepClick`). */
  clickableDone?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps>;
