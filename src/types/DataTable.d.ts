import type * as React from "react";

export interface DataTableColumn {
  key: string;
  label: React.ReactNode;
  /** Rechtsbündig und in DM Mono mit Tabellenziffern — für Zahlen, Beträge, IDs. */
  numeric?: boolean;
  align?: "left" | "right" | "center";
  /** Spalte in `text-muted` (Nebenangaben). */
  muted?: boolean;
  sortable?: boolean;
  width?: number | string;
  /** Eigene Darstellung der Zelle, z. B. ein `Tag`. */
  render?: (value: any, row: any, index: number) => React.ReactNode;
}

export interface DataTableSort {
  key: string;
  direction: "asc" | "desc";
}

export interface DataTableProps {
  columns: DataTableColumn[];
  rows: any[];
  /** Feldname oder Funktion für den Zeilenschlüssel. Standard `"id"`. */
  rowKey?: string | ((row: any, index: number) => string);
  size?: "sm" | "md";
  title?: React.ReactNode;
  /** Rechts in der Kopfleiste — Suche, Filter, Aktionen. */
  toolbar?: React.ReactNode;
  /** Gesetzt = gesteuerte Sortierung; dann sortiert der Aufrufer (z. B. serverseitig). */
  sort?: DataTableSort | null;
  defaultSort?: DataTableSort;
  onSortChange?: (sort: DataTableSort) => void;
  selectable?: boolean;
  selected?: Array<string | number>;
  onSelectionChange?: (keys: Array<string | number>) => void;
  onRowClick?: (row: any, index: number) => void;
  /** Zeigt Skeleton-Zeilen statt der Daten. */
  loading?: boolean;
  /** Anzahl Skeleton-Zeilen. Standard 5. */
  loadingRows?: number;
  /** Ersetzt `toolbar`, sobald etwas ausgewählt ist — die Bulk-Leiste. */
  bulkActions?: React.ReactNode;
  emptyText?: React.ReactNode;
  /** Höhe begrenzen; der Kopf bleibt beim Scrollen stehen. */
  maxHeight?: number | string;
  /** Fußbereich, üblicherweise eine `Pagination` mit `variant="bar"`. */
  footer?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const DataTable: React.FC<DataTableProps>;
