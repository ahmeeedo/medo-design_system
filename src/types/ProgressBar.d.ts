import type * as React from "react";

export interface ProgressBarProps {
  /** 0–`max`. Weggelassen = indeterminiert (unbekannte Dauer). */
  value?: number | null;
  max?: number;
  /** Beschriftung über der Bahn — benennt den Vorgang. */
  label?: React.ReactNode;
  /** Zusatz neben dem Label, z. B. „2 von 6 Dateien". */
  helper?: React.ReactNode;
  /** Prozentwert rechts über der Bahn, in DM Mono. */
  showValue?: boolean;
  status?: "normal" | "success" | "warning" | "error";
  /** `standard` 8px, `thin` 4px (z. B. am Kopf einer Karte). */
  size?: "standard" | "thin";
  /** Satz unter der Bahn, bei success/error mit Statusicon. */
  statusText?: React.ReactNode;
  /** Nötig, wenn kein Text-`label` gesetzt ist. */
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ProgressBar: React.FC<ProgressBarProps>;
