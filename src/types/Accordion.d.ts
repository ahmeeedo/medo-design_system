import type * as React from "react";

export interface AccordionItem {
  value: string;
  title: React.ReactNode;
  /** Zweite Zeile in der Kopfzeile — kurz, erklärend. */
  subtitle?: React.ReactNode;
  /** Kurzangabe rechts vor dem Zeichen, z. B. "3 Angaben". */
  meta?: React.ReactNode;
  /** Ligaturname eines Material Symbols Rounded links in der Kopfzeile. */
  icon?: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Mehrere Abschnitte gleichzeitig offen. Standard true. */
  multiple?: boolean;
  /** Offene Abschnitte. Array bei `multiple`, sonst ein Wert. Gesetzt = gesteuert. */
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onChange?: (value: string | string[] | null) => void;
  /** `card` = eine Karte mit Trennlinien, `separated` = einzelne Karten, `plain` = nur Linien. */
  variant?: "card" | "separated" | "plain";
  size?: "sm" | "md";
  /** Zeichen rechts: Plus/Minus oder drehender Chevron. */
  marker?: "plusminus" | "chevron";
  /** Zeigt „Alle aufklappen / Alle zuklappen" über der Liste. Nur bei `multiple`. */
  showToggleAll?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Accordion: React.FC<AccordionProps>;
