import type * as React from "react";

export interface ModalProps {
  open: boolean;
  /** Esc, Kreuz und Abbrechen rufen das auf. Der Scrim absichtlich nicht. */
  onClose: () => void;
  title: React.ReactNode;
  /** Zweite Zeile unter dem Titel — erklärt die Folge. */
  subtitle?: React.ReactNode;
  /** Inhalt. Scrollt, wenn er zu hoch wird. */
  children?: React.ReactNode;
  /** sm = Bestätigung (420px), md = Standard (560px), lg = viel Inhalt (760px). */
  size?: "sm" | "md" | "lg";
  /** Färbt das Kopf-Icon und macht die Bestätigung rot. */
  tone?: "neutral" | "danger" | "warning" | "success";
  /** Ligaturname eines Material Symbols Rounded im Kopf. */
  icon?: string;
  /** Beschriftung der bestätigenden Aktion — Verb im Infinitiv, benennt das Objekt. */
  confirmLabel?: React.ReactNode;
  onConfirm?: () => void;
  cancelLabel?: React.ReactNode;
  /** Zusätzliche Aktion, die links im Fuß steht (z. B. „Hilfe"). */
  secondary?: React.ReactNode;
  /** Ersetzt den Standard-Fuß vollständig. `null` lässt den Fuß weg. */
  footer?: React.ReactNode | null;
  closeLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Modal: React.FC<ModalProps>;
