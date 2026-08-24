import type * as React from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "type"> {
  /** Beschriftung. Verb im Infinitiv, deutsch: „Termin anlegen". */
  children?: React.ReactNode;
  /** Wichtigkeit der Aktion. Pro Ansicht nur ein `primary`. */
  variant?: ButtonVariant;
  /** `md` ist der Normalfall. `lg` für Formularabschlüsse, `sm` in Tabellen und Werkzeugleisten.
   *  Schriftgrößen folgen der Skala: sm = text-xs 12, md = text-sm 14, lg = text-base 16. */
  size?: ButtonSize;
  /** Ligaturname eines Material Symbols Rounded Glyphs, z. B. "add". */
  icon?: string;
  /** Position des Icons relativ zur Beschriftung. */
  iconPosition?: "leading" | "trailing";
  /** Nur Icon, keine Beschriftung. `aria-label` ist dann Pflicht. */
  iconOnly?: boolean;
  /** Zeigt den Spinner und sperrt die Schaltfläche. */
  loading?: boolean;
  disabled?: boolean;
  /** Über die volle Breite des Containers. */
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  /** Gesetzt, wird ein `<a role="button">` gerendert. */
  href?: string;
}

export const Button: React.FC<ButtonProps>;
