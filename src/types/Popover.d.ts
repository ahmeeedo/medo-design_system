import type * as React from "react";

export interface PopoverProps {
  /** Genau ein Element als Auslöser. Muss eine `ref` annehmen können und fokussierbar sein. */
  children: React.ReactElement;
  /** Inhalt. Als Funktion aufgerufen mit `{ close }`, damit Aktionen darin schließen können. */
  content: React.ReactNode | ((api: { close: () => void }) => React.ReactNode);
  /** Titelzeile mit Schließen-Kreuz. Ohne Titel gibt es kein Kreuz. */
  title?: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  /** Abstand zum Auslöser in px. Standard 10. */
  offset?: number;
  /** Breite; Standard 300px. */
  width?: number | string;
  /** Gesetzt = gesteuert. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** `aria-label` des Schließen-Kreuzes. */
  closeLabel?: string;
  className?: string;
}

export const Popover: React.FC<PopoverProps>;
