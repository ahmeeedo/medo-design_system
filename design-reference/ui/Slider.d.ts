import type * as React from "react";

export interface SliderProps {
  /** Gesetzt = gesteuert. */
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  /** Beim Loslassen der Maus — für teure Aktualisierungen. */
  onChangeEnd?: (value: number) => void;
  min?: number;
  max?: number;
  /** Schrittweite. Zusammen mit `stepLabels` oder `showTicks` ergibt das den diskreten Modus. */
  step?: number;
  size?: "sm" | "md";
  orientation?: "horizontal" | "vertical";
  label?: React.ReactNode;
  /** Aktuellen Wert rechts über der Bahn zeigen. */
  showValue?: boolean;
  /** Minimum und Maximum unter den Enden der Bahn. */
  showMinMax?: boolean;
  /** Punkte auf der Bahn an jeder Stufe. */
  showTicks?: boolean;
  /** Beschriftung je Stufe (diskret) — ersetzt die Zahl in Bubble und `aria-valuetext`. */
  stepLabels?: string[];
  /** Eigene Darstellung des Werts, z. B. (v) => v + " %". */
  formatValue?: (value: number) => React.ReactNode;
  /** Ligaturnamen von Material Symbols Rounded an den Enden. */
  startIcon?: string;
  endIcon?: string;
  disabled?: boolean;
  /** Nötig, wenn kein Text-`label` gesetzt ist. */
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Slider: React.FC<SliderProps>;
