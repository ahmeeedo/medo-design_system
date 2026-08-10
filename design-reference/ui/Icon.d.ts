import type * as React from "react";

export interface IconProps {
  /** Ligaturname eines Material Symbols Rounded Glyphs, z. B. "search", "arrow_forward". */
  name: string;
  /** 18 neben `text-sm`, 20 neben `text-base`, 24 alleinstehend. */
  size?: number;
  /** Standard ist `currentColor`. Eigene Farbe nur aus `--medo-icon`, `--medo-icon-muted` oder einer Statusfarbe. */
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Die einzige Icon-Quelle im System: Material Symbols Rounded, Weight 300, FILL 0, GRAD 0. */
export const Icon: React.FC<IconProps>;
