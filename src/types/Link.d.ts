import type * as React from "react";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Der Linktext. Benennt das Ziel — nie „hier klicken". */
  children?: React.ReactNode;
  /** `standalone` steht für sich (ohne Unterstreichung im Ruhezustand),
   *  `inline` steht im Fließtext und ist immer unterstrichen. */
  variant?: "standalone" | "inline";
  size?: "sm" | "md" | "lg";
  /** Ligaturname eines Material Symbols Rounded Glyphs. */
  icon?: string;
  iconPosition?: "leading" | "trailing";
  /** Setzt `open_in_new`, `target="_blank"` und `rel="noopener noreferrer"`. */
  external?: boolean;
  disabled?: boolean;
}

export const Link: React.FC<LinkProps>;
