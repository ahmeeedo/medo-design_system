import type * as React from "react";

export interface MenuEntry {
  value?: string;
  label?: React.ReactNode;
  /** Ligaturname eines Material Symbols Rounded. */
  icon?: string;
  /** Tastenkürzel rechts, in DM Mono — nur anzeigen, wenn es wirklich greift. */
  shortcut?: string;
  /** Zerstörende Aktion: Text und Icon in error-600. Immer der letzte Eintrag. */
  danger?: boolean;
  disabled?: boolean;
  /** Häkchen links. Setzt zusammen mit `selectionMode` die Rolle menuitemradio/checkbox. */
  checked?: boolean;
  /** Untermenü. Eine Ebene, mehr nicht. */
  items?: MenuEntry[];
  /** Als Link rendern. */
  href?: string;
  /** Menü nach dem Klick offen lassen (z. B. Mehrfachauswahl). */
  keepOpen?: boolean;
  /** Struktur statt Aktion. */
  type?: "divider" | "heading";
}

export interface MenuListProps {
  items: MenuEntry[];
  onSelect?: (value: string | undefined, item: MenuEntry) => void;
  onClose?: () => void;
  /** Ersten Eintrag beim Einhängen fokussieren. Standard true. */
  autoFocus?: boolean;
  ariaLabel?: string;
  minWidth?: number | string;
  /** Häkchen-Spalte für alle Einträge, mit passender ARIA-Rolle. */
  selectionMode?: "single" | "multiple";
  className?: string;
  style?: React.CSSProperties;
}

export interface DropdownProps {
  /** Beschriftung des Auslösers. Bei `trigger="kebab"` nicht nötig. */
  label?: React.ReactNode;
  icon?: string;
  /** `button` = Schaltfläche mit Chevron, `kebab` = flaches Icon ohne Rahmen. */
  trigger?: "button" | "kebab";
  items: MenuEntry[];
  onSelect?: (value: string | undefined, item: MenuEntry) => void;
  size?: "sm" | "md";
  /** Menü links (`start`) oder rechts (`end`) am Auslöser ausrichten. */
  align?: "start" | "end";
  selectionMode?: "single" | "multiple";
  disabled?: boolean;
  menuMinWidth?: number | string;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Dropdown: React.FC<DropdownProps>;
export const MenuList: React.FC<MenuListProps>;
