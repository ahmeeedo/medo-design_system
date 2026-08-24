import type * as React from "react";

export interface ToggleProps {
  /** Gesetzt = gesteuert. Ohne diese Prop verwaltet die Komponente ihren Zustand selbst. */
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (next: boolean) => void;
  /** Beschriftung neben dem Schalter. Fehlt sie, braucht der Schalter ein `aria-label`. */
  label?: React.ReactNode;
  /** Zweite Zeile unter dem Label — erklärt die Folge, nicht die Funktion. */
  description?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  /** `left` = Label links, Schalter rechts am Zeilenende (Einstellungsliste). */
  labelPosition?: "left" | "right";
  /** Häkchen bzw. Kreuz im Griff. Standard true. */
  icons?: boolean;
  /** Zeigt einen Spinner im Griff und sperrt die Bedienung, solange gespeichert wird. */
  loading?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Toggle: React.FC<ToggleProps>;
