import type * as React from "react";

export interface ListItem {
  /** Zeilentext bei `unordered`/`ordered`. */
  text?: React.ReactNode;
  /** Titel bei `variant="content"`. */
  title?: React.ReactNode;
  /** Zweite Zeile bei `variant="content"`. */
  description?: React.ReactNode;
  /** Ligaturname eines Material Symbols Rounded, nur bei `variant="content"`. */
  icon?: string;
  /** Eine Ebene Verschachtelung. Tiefer wird nicht unterstützt. */
  items?: Array<string | { text: React.ReactNode }>;
}

export interface ListProps {
  items: Array<string | ListItem>;
  variant?: "unordered" | "ordered" | "content";
  size?: "sm" | "md";
  /** Trennlinien weglassen (nur `variant="content"`). */
  flush?: boolean;
  /** Text, wenn `items` leer ist. Erklärt, was hier entstehen wird. */
  emptyText?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface KeyValueItem {
  key: React.ReactNode;
  value: React.ReactNode;
  /** Zahl, Betrag, ID oder Datum — wird in DM Mono mit Tabellenziffern gesetzt. */
  numeric?: boolean;
  /** Überschreibt die Mono-Entscheidung für diese Zeile. */
  mono?: boolean;
}

export interface KeyValueListProps {
  items: KeyValueItem[];
  /** `columns` = Label links, Wert rechts. `stacked` für schmale Spalten. */
  layout?: "columns" | "stacked";
  /** Numerische Werte in DM Mono setzen. Standard true. */
  monoValues?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const List: React.FC<ListProps>;
export const KeyValueList: React.FC<KeyValueListProps>;
