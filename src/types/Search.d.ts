import type * as React from "react";

export interface SearchItem {
  label: string;
  /** Ligaturname eines Material Symbols Rounded Glyphs. Standard: `history` bzw. `search`. */
  icon?: string;
}

export interface SearchProps {
  label?: string;
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  /** Zeigt den Spinner anstelle der Lupe, während die Suche läuft. */
  loading?: boolean;
  disabled?: boolean;
  /** Flache Variante ohne Rahmen für Werkzeugleisten, 34px hoch. */
  compact?: boolean;
  /** Vorschläge zur aktuellen Eingabe. Der Treffer wird hervorgehoben. */
  suggestions?: Array<string | SearchItem>;
  /** Letzte Suchen. Erscheinen nur, solange das Feld leer ist. */
  recent?: Array<string | SearchItem>;
  /** Eigener Text im Leerzustand. Standard nennt die Suchanfrage. */
  emptyText?: string;
  /** Panel ganz abschalten — für reine Filterfelder ohne Vorschläge. */
  showPanel?: boolean;
  /** Startet mit offenem Panel. Nur für Dokumentation und Tests. */
  defaultOpen?: boolean;
  /** Verzögerung in ms, bevor `onSearch` feuert. Standard 250. */
  debounce?: number;
  hint?: string;
  error?: string;
  fullWidth?: boolean;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  /** Entprellt. Feuert zusätzlich sofort bei Enter und bei Auswahl eines Vorschlags. */
  onSearch?: (query: string) => void;
  onSelect?: (item: SearchItem) => void;
  /** Gesetzt, bekommen Verlaufseinträge eine Entfernen-Schaltfläche. */
  onRemoveRecent?: (item: SearchItem) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Search: React.FC<SearchProps>;
