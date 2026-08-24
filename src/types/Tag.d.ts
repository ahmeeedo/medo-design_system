import type * as React from "react";

export type TagColor = "neutral" | "primary" | "success" | "warning" | "error" | "info";

export interface TagProps {
  children?: React.ReactNode;
  /** Farbrolle. Eine Farbe steht im ganzen Produkt für dieselbe Bedeutung. */
  color?: TagColor;
  /** `soft` (Fläche 50, Standard) oder `solid` (Volltonfarbe 600). */
  emphasis?: "soft" | "solid";
  size?: "sm" | "md";
  /** Statuspunkt vor dem Text — hilft beim schnellen Überfliegen. */
  dot?: boolean;
  /** Ligaturname eines Material Symbols Rounded Glyphs. */
  icon?: string;
  /** Gesetzt, erscheint eine Entfernen-Schaltfläche (Typ „entfernbar"). */
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Beschriftung der Entfernen-Schaltfläche, z. B. „Design entfernen". */
  removeLabel?: string;
  /** Rendert eine Schaltfläche mit `aria-pressed` (Typ „auswählbar"). */
  selectable?: boolean;
  selected?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Tag: React.FC<TagProps>;
