import type * as React from "react";

export interface PaginationProps {
  /** Aktuelle Seite, 1-basiert. Gesetzt = gesteuert. */
  page?: number;
  defaultPage?: number;
  /** Anzahl Seiten. Alternativ `totalItems` + `pageSize` angeben. */
  pageCount?: number;
  totalItems?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  /** Gesetzt, erscheint in der Leiste die Auswahl „Einträge pro Seite". */
  onPageSizeChange?: (size: number) => void;
  /** `numbers` = Nummern, `compact` = Zurück / Seite X von Y / Weiter, `bar` = volle Tabellenleiste. */
  variant?: "numbers" | "compact" | "bar";
  size?: "sm" | "md";
  /** Nachbarn links und rechts der aktuellen Seite. Standard 1. */
  siblings?: number;
  /** Zusätzliche Schaltflächen für erste und letzte Seite. */
  showFirstLast?: boolean;
  /** Eingabefeld „Gehe zu" (nur `variant="bar"`). */
  showJump?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Pagination: React.FC<PaginationProps>;
