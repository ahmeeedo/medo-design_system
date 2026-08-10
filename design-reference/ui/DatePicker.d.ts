import type * as React from "react";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DatePickerPreset {
  label: React.ReactNode;
  /** Liefert den neuen Wert — `Date` bei `single`, `DateRange` bei `range`. */
  value: () => Date | DateRange | null;
}

export interface DatePickerProps {
  /** `single` ein Datum, `range` ein Zeitraum (erster Klick Start, zweiter Ende). */
  mode?: "single" | "range";
  /** Gesetzt = gesteuert. `Date | null` bei `single`, `DateRange` bei `range`. */
  value?: Date | DateRange | null;
  defaultValue?: Date | DateRange | null;
  onChange?: (value: any) => void;
  label?: React.ReactNode;
  helper?: React.ReactNode;
  /** Fehlermeldung — ersetzt den Hinweis und schaltet den Danger-Fokusring. */
  error?: React.ReactNode;
  /** Text im leeren Feld. */
  placeholder?: string;
  min?: Date;
  max?: Date;
  /** Schnellauswahl neben dem Kalender. */
  presets?: DatePickerPreset[];
  /** Kalender fest anzeigen statt im Popover. */
  inline?: boolean;
  /** Zurücksetzen erlauben (Kreuz im Feld, „Zurücksetzen" in der Seitenspalte). */
  clearable?: boolean;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  /** Überschrift der Zusammenfassung bei `range`. */
  summaryLabel?: string;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface TimeSlot {
  time: string;
  disabled?: boolean;
}

export interface TimeSlotsProps {
  slots: Array<string | TimeSlot>;
  value?: string;
  onChange?: (time: string) => void;
  columns?: number;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const DatePicker: React.FC<DatePickerProps>;
export const TimeSlots: React.FC<TimeSlotsProps>;
