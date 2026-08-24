import type * as React from "react";

export interface TabItem {
  /** Eindeutiger Wert, wird als Auswahl zurückgegeben. */
  value: string;
  label: React.ReactNode;
  /** Ligaturname eines Material Symbols Rounded, z. B. "person". */
  icon?: string;
  /** Zähler rechts am Label. Nur Anzahl, kein Statuswort. */
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  /** Gesetzt = gesteuert. Ohne diese Prop verwaltet die Komponente die Auswahl selbst. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: "underline" | "contained";
  size?: "sm" | "md";
  /** `vertical` erzwingt die Listenform links neben dem Panel (immer underline-Logik). */
  orientation?: "horizontal" | "vertical";
  /** Tabs teilen die Breite gleichmäßig. Nur horizontal. */
  fullWidth?: boolean;
  /** Waagerecht scrollbar statt Umbruch, ohne sichtbare Scrollbar. */
  scrollable?: boolean;
  /** Beschriftung der Tabliste für Screenreader. */
  ariaLabel?: string;
  /** Inhalt des aktiven Tabs. Wird als `role="tabpanel"` gerendert und selbst gestylt. */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Tabs: React.FC<TabsProps>;
