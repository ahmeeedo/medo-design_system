/* ENTWURF — noch nicht in Betrieb.
 *
 * Vertragsentwurf für die Komponente Textarea, abgeleitet aus dem bestehenden
 * Port in src/components/Textarea/. Diese Datei liegt bewusst unter docs/ und
 * NICHT unter src/types/: dort abgelegt würde sie sofort wirksam, und die
 * Umsetzung ist eine eigene Aufgabe.
 *
 * Anders als die übrigen Dateien in src/types/ ist dies keine wortgetreue Kopie
 * aus dem Design-Projekt — die Komponente hat dort keine Quelle. Der Vertrag
 * folgt hier ausnahmsweise dem ausgelieferten Code, nicht umgekehrt.
 *
 * Begleitende Abweichungsliste: docs/textarea-vertrag-entwurf.md
 */

import type * as React from "react";

/* React.TextareaHTMLAttributes deklariert - anders als InputHTMLAttributes -
   kein `size`. Ein Omit wie in TextInput.d.ts ist deshalb nicht nötig; geprüft
   gegen @types/react 18 und 19. */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Immer sichtbares Label über dem Feld. Ein Platzhalter ersetzt es nicht. */
  label?: string;
  /** Wirkt nur auf die Schriftgröße: `sm` 14px, `md` und `lg` je 16px.
   *  Die Höhe des Feldes kommt von `rows`, nicht von der Größe. */
  size?: "sm" | "md" | "lg";
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
  /** Sichtbare Zeilen und damit die Höhe des Feldes. Standard 3. */
  rows?: number;
  /** Zeigt „24/100" am unteren Rand des Feldes. Ohne `maxLength` wirkungslos. */
  showCounter?: boolean;
  /** Ob der Anwender das Feld ziehen darf. Standard `vertical`. */
  resize?: "vertical" | "none" | "both";
  /** Feld nimmt die volle Breite des Elternelements ein. */
  fullWidth?: boolean;
  /** Liegt auf der äußeren Hülle des Feldes, nicht auf dem Eingabeelement. */
  className?: string;
  /** Liegt auf der äußeren Hülle des Feldes, nicht auf dem Eingabeelement. */
  style?: React.CSSProperties;
}

export const Textarea: React.FC<TextareaProps>;
