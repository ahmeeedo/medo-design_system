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
  /** Tabs teilen die Breite gleichmäßig. Nur horizontal. Passt eine Beschriftung nicht,
   *  bricht sie auf eine zweite Zeile um und wird erst danach gekürzt; die Leiste wird
   *  dabei höher. Gleich breite Tabs rollen nie — dafür ist `scrollable` da, das zusammen
   *  mit `fullWidth` gewinnt. */
  fullWidth?: boolean;
  /** Ohne Wirkung. Passen die Tabs nicht nebeneinander, läuft die Leiste ohnehin mit der
   *  Auswahl mit — das gilt für jede Leiste außer `fullWidth` und `orientation="vertical"`.
   *  Die Angabe bleibt für bestehende Einbindungen erhalten. */
  scrollable?: boolean;
  /** Beschriftung der Tabliste für Screenreader. */
  ariaLabel?: string;
  /** Inhalt des aktiven Tabs. Wird als `role="tabpanel"` gerendert und selbst gestylt. */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Tabs: React.FC<TabsProps>;
