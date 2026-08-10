import type * as React from "react";

export interface ContentSwitcherItem {
  value: string;
  /** Sichtbares Label — bei `iconOnly` wird es zum `aria-label`. */
  label: string;
  /** Ligaturname eines Material Symbols Rounded, z. B. "view_list". */
  icon?: string;
  disabled?: boolean;
}

export interface ContentSwitcherProps {
  items: ContentSwitcherItem[];
  /** Gesetzt = gesteuert. Ohne diese Prop verwaltet die Komponente die Auswahl selbst. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** `neutral` = Leiste stone-100 mit weißem Segment, `outline` = Rahmen mit gefülltem Segment. */
  variant?: "neutral" | "outline";
  size?: "sm" | "md";
  /** Nur Icons. Dann gehört jedes Segment in einen `Tooltip`. */
  iconOnly?: boolean;
  /** Segmente gleich breit. Standard true — verhindert Sprünge beim Wechsel. */
  equalWidth?: boolean;
  /** Leiste füllt die verfügbare Breite. */
  fullWidth?: boolean;
  /** Beschriftung der Gruppe für Screenreader, z. B. "Ansicht". */
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ContentSwitcher: React.FC<ContentSwitcherProps>;
