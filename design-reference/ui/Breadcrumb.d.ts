import type * as React from "react";

export interface BreadcrumbItem {
  label: React.ReactNode;
  /** Ziel der Stufe. Ohne `href` wird ein Button gerendert und `onClick` erwartet. */
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  /** Ligaturname eines Material Symbols Rounded. */
  icon?: string;
}

export interface BreadcrumbProps {
  /** Von der Wurzel bis zur aktuellen Seite. Der letzte Eintrag ist die aktuelle Seite. */
  items: BreadcrumbItem[];
  size?: "sm" | "md";
  /** Ab dieser Anzahl kollabiert die Mitte in ein …-Menü. 0 = nie kollabieren. */
  maxItems?: number;
  /** Erste Stufe als Haus-Icon statt Text-Icon. */
  homeIcon?: boolean;
  /** Beschriftung der Navigation. Standard "Brotkrumen". */
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Breadcrumb: React.FC<BreadcrumbProps>;
