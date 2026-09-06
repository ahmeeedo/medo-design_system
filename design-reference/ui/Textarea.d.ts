import type * as React from "react";

/* React.TextareaHTMLAttributes deklariert — anders als InputHTMLAttributes —
   kein `size`. Ein Omit wie in TextInput.d.ts ist deshalb nicht nötig. */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Immer sichtbares Label über dem Feld. Ein Platzhalter ersetzt es nicht. */
  label?: string;
  /** Setzt den roten Stern hinter das Label und zugleich das native `required`. */
  required?: boolean;
  /** Setzt „(optional)" hinter das Label. Zusammen mit `required` wirkungslos. */
  optional?: boolean;
  /** Erklärender Text unter dem Feld. Wird von `error` und `success` verdrängt. */
  hint?: string;
  /** Fehlermeldung unter dem Feld. Setzt `aria-invalid` und `role="alert"`.
   *  Nennt Ursache und nächsten Schritt, nicht nur den Zustand. */
  error?: string;
  /** Bestätigung unter dem Feld. Wird von `error` verdrängt. */
  success?: string;
  /** Sichtbare Zeilen und damit die Anfangshöhe des Feldes. Standard 3.
   *  Der Anwender kann die Höhe danach selbst ziehend ändern. */
  rows?: number;
  /** Zeigt „24/100" am unteren Rand des Feldes. Ohne `maxLength` wirkungslos. */
  showCounter?: boolean;
  /** Feld nimmt die volle Breite des Elternelements ein. */
  fullWidth?: boolean;
  /** Liegt auf der äußeren Hülle des Feldes, nicht auf dem Eingabeelement. */
  className?: string;
  /** Liegt auf der äußeren Hülle des Feldes, nicht auf dem Eingabeelement. */
  style?: React.CSSProperties;
}

export const Textarea: React.FC<TextareaProps>;
