import type * as React from "react";
import type { MenuEntry } from "./Dropdown.jsx";

export interface MenuProps {
  /** Einträge wie im Dropdown — inklusive `divider`, `heading`, `danger`, Untermenü. */
  items: MenuEntry[];
  onSelect?: (value: string | undefined, item: MenuEntry) => void;
  /** Der Bereich, auf dem der Rechtsklick gilt. */
  children: React.ReactNode;
  ariaLabel?: string;
  /** Kein Kontextmenü — das Browser-Menü bleibt aktiv. */
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Menu: React.FC<MenuProps>;
