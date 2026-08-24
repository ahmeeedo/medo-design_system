import type * as React from "react";

export type NotificationKind = "info" | "success" | "warning" | "error" | "neutral";

export interface NotificationAction {
  label: string;
  onClick: () => void;
}

export interface NotificationProps {
  kind?: NotificationKind;
  /** `soft` getönt (Standard) oder `solid` gefüllt für dringende Meldungen. */
  emphasis?: "soft" | "solid";
  /** Erste Zeile. Ohne `children` wird daraus die einzeilige Variante. */
  title?: React.ReactNode;
  /** Beschreibungstext. */
  children?: React.ReactNode;
  /** Überschreibt das Standard-Glyph der Statusart. */
  icon?: string;
  action?: NotificationAction;
  /** Gesetzt, erscheint die Schließen-Schaltfläche. */
  onClose?: () => void;
  closeLabel?: string;
  /** Standard: `alert` bei `error`, sonst `status`. */
  role?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface ToastOptions {
  kind?: NotificationKind;
  title?: string;
  description?: string;
  icon?: string;
  /** Anzeigedauer in ms, Standard 5000. Fehler blenden nie automatisch aus. */
  duration?: number;
}

export const Notification: React.FC<NotificationProps>;
/** Einmal pro Anwendung einhängen — nimmt den Toast-Stapel auf. */
export const ToastHost: React.FC<{ label?: string }>;
/** Zeigt einen Toast, gibt dessen id zurück. `toast.dismiss(id)` schließt ihn vorzeitig. */
export function toast(opts: ToastOptions | string): number;
export namespace toast {
  function dismiss(id: number): void;
}
