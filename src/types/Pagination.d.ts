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
  /** `aria-label` je Seitenschaltfläche. Standard `Seite ${page}`. */
  pageLabel?: (page: number) => string;
  /** `aria-label` der Schaltfläche „erste Seite" (`showFirstLast`). Standard „Erste Seite". */
  firstLabel?: string;
  /** `aria-label` der Schaltfläche „vorherige Seite". Standard „Vorherige Seite". */
  previousLabel?: string;
  /** `aria-label` der Schaltfläche „nächste Seite". Standard „Nächste Seite". */
  nextLabel?: string;
  /** `aria-label` der Schaltfläche „letzte Seite" (`showFirstLast`). Standard „Letzte Seite". */
  lastLabel?: string;
  /** Sichtbare Beschriftung der Zurück-Schaltfläche (`variant="compact"`). Standard „Zurück". */
  backLabel?: React.ReactNode;
  /** Sichtbare Beschriftung der Weiter-Schaltfläche (`variant="compact"`). Standard „Weiter". */
  forwardLabel?: React.ReactNode;
  /** Seitenanzeige (`variant="compact"`). Standard `Seite <b>${page}</b> von ${pageCount}`. */
  pageOfLabel?: (page: number, pageCount: number) => React.ReactNode;
  /** Beschriftung der Auswahl „Einträge pro Seite" (`variant="bar"`). Steht sichtbar
   *  daneben und zugleich als `aria-label` am Auswahlfeld, deshalb reiner Text.
   *  Standard „Einträge pro Seite". */
  pageSizeLabel?: string;
  /** Bereichsanzeige (`variant="bar"`, braucht `totalItems`).
   *  Standard `${from}–${to} von ${totalItems}`. */
  rangeLabel?: (from: number, to: number, totalItems: number) => React.ReactNode;
  /** Sichtbare Beschriftung des Direktsprungfelds (`showJump`). Standard „Gehe zu". */
  jumpLabel?: React.ReactNode;
  /** `aria-label` des Direktsprungfelds (`showJump`). Standard „Zu Seite springen". */
  jumpAriaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Pagination: React.FC<PaginationProps>;
