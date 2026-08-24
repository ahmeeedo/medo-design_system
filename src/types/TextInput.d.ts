import type * as React from "react";

export type FieldSize = "sm" | "md" | "lg";

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Immer sichtbares Label. Ein Platzhalter ersetzt es nicht. */
  label?: string;
  /** Label liegt im Feld und schwebt bei Fokus oder Inhalt nach oben. Feld wird 52px hoch. */
  floatingLabel?: boolean;
  /** `sm` 36px in Tabellen, `md` 40px im Normalfall, `lg` 48px auf Mobilgeräten. */
  size?: FieldSize;
  /** Setzt den roten Stern hinter das Label. */
  required?: boolean;
  /** Setzt „(optional)" hinter das Label. Nie zusammen mit `required`. */
  optional?: boolean;
  readOnly?: boolean;
  /** Erklärender Text unter dem Feld. Wird von `error` und `success` verdrängt. */
  hint?: string;
  /** Fehlermeldung. Setzt `aria-invalid` und `role="alert"`. Nennt Ursache und nächsten Schritt. */
  error?: string;
  /** Bestätigung unter dem Feld. */
  success?: string;
  /** Führendes Material-Symbols-Glyph, dekorativ. */
  icon?: string;
  /** Feste Textsegmente vor bzw. nach der Eingabe, z. B. „https://" und „.de". */
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  /** Zeigt „24/100" im Feld. Braucht `maxLength`. */
  showCounter?: boolean;
  /** Fügt eine Leeren-Schaltfläche hinzu, sobald ein Wert vorhanden ist. */
  clearable?: boolean;
  onClear?: () => void;
  fullWidth?: boolean;
}

export const TextInput: React.FC<TextInputProps>;
