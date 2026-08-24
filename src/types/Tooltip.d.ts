import type * as React from "react";

export interface TooltipProps {
  /** Genau ein Element, das den Tooltip auslöst. Muss eine `ref` annehmen können. */
  children: React.ReactElement;
  /** Der Erklärungstext. */
  content?: React.ReactNode;
  /** Gesetzt, entsteht die zweizeilige Variante mit fetter erster Zeile. */
  title?: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  /** Verzögerung beim Öffnen per Maus, in ms. Standard 400. Bei Fokus immer sofort. */
  delay?: number;
  /** Abstand zwischen Auslöser und Tooltip in px. Standard 10. */
  offset?: number;
  disabled?: boolean;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps>;
