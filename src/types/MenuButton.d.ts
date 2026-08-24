import type * as React from "react";
import type { MenuEntry } from "./Dropdown.jsx";

export interface MenuButtonProps {
  label: React.ReactNode;
  /** Ligaturname eines Material Symbols Rounded links im Label. */
  icon?: string;
  items: MenuEntry[];
  onSelect?: (value: string | undefined, item: MenuEntry) => void;
  variant?: "primary" | "neutral";
  /** Menü links (`start`) oder rechts (`end`) ausrichten. */
  align?: "start" | "end";
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface SplitButtonProps {
  /** Beschriftung der Hauptaktion — sie wird direkt ausgeführt. */
  label: React.ReactNode;
  icon?: string;
  onClick?: (e: React.MouseEvent) => void;
  /** Varianten der Hauptaktion. */
  items: MenuEntry[];
  onSelect?: (value: string | undefined, item: MenuEntry) => void;
  variant?: "primary" | "neutral";
  align?: "start" | "end";
  disabled?: boolean;
  /** `aria-label` der Menühälfte. Standard „Weitere Varianten". */
  menuLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface IconMenuButtonProps {
  icon?: string;
  items: MenuEntry[];
  onSelect?: (value: string | undefined, item: MenuEntry) => void;
  variant?: "primary" | "neutral";
  align?: "start" | "end";
  disabled?: boolean;
  /** Pflicht in der Wirkung: ohne Label ist die Schaltfläche unbenannt. */
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const MenuButton: React.FC<MenuButtonProps>;
export const SplitButton: React.FC<SplitButtonProps>;
export const IconMenuButton: React.FC<IconMenuButtonProps>;
