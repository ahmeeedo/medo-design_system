import type * as React from "react";

export interface SelectOption {
  value: string;
  label: string;
  /** Ligaturname eines Material Symbols Rounded Glyphs, links im Eintrag. */
  icon?: string;
  disabled?: boolean;
}
export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectProps {
  label?: string;
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  /** Text der leeren Vorauswahl. */
  placeholder?: string;
  options?: Array<SelectOption | SelectOptionGroup>;
  size?: "sm" | "md" | "lg";
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  hint?: string;
  error?: string;
  success?: string;
  /** Führendes Glyph im Feld, dekorativ. */
  icon?: string;
  /** Liefert \`{ target: { value, name } }\` — wie ein natives change-Ereignis. */
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  fullWidth?: boolean;
  /** Betriebssystem-Auswahlrad statt der gestalteten Liste.
   *  Für sehr lange Listen und Formulare ohne JavaScript. Panel nicht gestaltbar. */
  native?: boolean;
  /** Mehrfachauswahl. `value`/`defaultValue` sind dann ein Array, `onChange` liefert ein Array. */
  multiple?: boolean;
  /** `chips` zeigt die Auswahl als Chips im Feld, `count` als „N ausgewählt". */
  multipleDisplay?: "chips" | "count";
  /** Harte Obergrenze sichtbarer Chips. Standard 0 = automatisch: es werden so viele Chips
   *  gezeigt, wie in eine Zeile passen, der Rest erscheint als „+N". */
  maxChips?: number;
  /** Startet mit offenem Panel. Nur für Dokumentation und Tests — nicht in Produktion. */
  defaultOpen?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Select: React.FC<SelectProps>;
