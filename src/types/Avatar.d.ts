import type * as React from "react";

/** Die fünfzehn Farbschemata des Systems. Das Schema gehört zur Person: es wird
 *  bei der Registrierung vergeben und ist von ihr änderbar. Nie berechnen. */
export type AvatarColor =
  | "red" | "crimson" | "rose" | "orange" | "amber" | "yellow" | "green"
  | "teal" | "cyan" | "blue" | "indigo" | "violet" | "purple" | "grey" | "stone";

export interface AvatarProps {
  /** Name oder Benutzername. Daraus entstehen die zwei Buchstaben. */
  name?: string;
  /** Buchstaben unmittelbar vorgeben und die Ableitung aus `name` übergehen. */
  initials?: string;
  /** Bildadresse. Lädt das Bild nicht, erscheinen die Buchstaben. */
  src?: string;
  /** Farbschema der Person. Der Aufrufer übergibt den gespeicherten Wert.
   *  Standard `teal`, bis die Anwendung ihn liefert. */
  color?: AvatarColor;
  /** `sm` 30px in Tabellenzeilen, `md` 38px in Listenzeilen, `lg` 64px im Profil. */
  size?: "sm" | "md" | "lg";
  /** Leerer grauer Kreis, solange die Daten unterwegs sind. */
  loading?: boolean;
  /** Beschriftung für Vorleseprogramme. Nur setzen, wenn der Avatar allein steht —
   *  steht der Name daneben, bleibt der Kreis stumm. */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Avatar: React.FC<AvatarProps>;

/** Die Ableitung der zwei Buchstaben, einzeln nutzbar. */
export function medoAvatarInitials(name?: string): string;
