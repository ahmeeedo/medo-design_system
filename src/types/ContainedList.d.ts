import type * as React from "react";

export interface ContainedListItem {
  value: string;
  label: React.ReactNode;
  /** Zweite Zeile — erklärt die Zeile, wiederholt sie nicht. */
  description?: React.ReactNode;
  /** Rechts am Zeilenende, in DM Mono: Datum, Anzahl, Betrag. */
  meta?: React.ReactNode;
  /** Ligaturname eines Material Symbols Rounded in getönter Fläche. */
  icon?: string;
  /** Kürzel für den Avatar-Kreis, z. B. "MH". Schlägt `icon`. */
  avatar?: React.ReactNode;
  /** Icon einer Zeilenaktion (z. B. "more_vert"). Ersetzt das Chevron. */
  action?: string;
  actionLabel?: string;
  /** Chevron am Zeilenende ausschalten (nur `mode="navigation"`). */
  chevron?: boolean;
  disabled?: boolean;
}

export interface ContainedListGroup {
  label: React.ReactNode;
  items: ContainedListItem[];
}

export interface ContainedListProps {
  items?: ContainedListItem[];
  /** Alternative zu `items`: Zeilen mit haftenden Gruppen-Überschriften. */
  groups?: ContainedListGroup[];
  /** `navigation` führt weiter, `single`/`multiple` wählen aus. */
  mode?: "navigation" | "single" | "multiple";
  /** Auswahl. String bei `single`, String-Array bei `multiple`. Gesetzt = gesteuert. */
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onChange?: (value: string | string[]) => void;
  /** Nur bei `mode="navigation"`: Zeile wurde geöffnet. */
  onSelect?: (value: string, item: ContainedListItem) => void;
  /** Klick auf die Zeilenaktion. */
  onAction?: (value: string, item: ContainedListItem) => void;
  size?: "sm" | "md";
  /** Kopfzeile der Karte. */
  title?: React.ReactNode;
  /** Anzahl rechts in der Kopfzeile, in DM Mono. */
  count?: React.ReactNode;
  /** Text, wenn die Liste leer ist. */
  emptyText?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ContainedList: React.FC<ContainedListProps>;
