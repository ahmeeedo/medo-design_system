import type * as React from "react";

export interface InlineLoadingProps {
  /** `loading` pulsierende Punkte, `success` Häkchen, `error` Kreuz, `inactive` ruhend. */
  status?: "loading" | "success" | "error" | "inactive";
  /** Text daneben — beschreibt den Vorgang, nicht den Zustand („Wird gespeichert …"). */
  label?: React.ReactNode;
  size?: "sm" | "md";
  /** Farbe der Umgebung übernehmen — Pflicht in gefüllten Schaltflächen. */
  inherit?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const InlineLoading: React.FC<InlineLoadingProps>;
