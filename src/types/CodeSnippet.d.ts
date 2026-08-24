import type * as React from "react";

export interface CodeSnippetProps {
  /** Der Code. Alternativ als String-Kind übergeben. */
  code?: string;
  children?: string;
  /** `inline` hell im Fließtext, `single` eine Zeile, `block` mit Kopfleiste, `terminal` mit $-Prompt. */
  variant?: "inline" | "single" | "block" | "terminal";
  /** Sprach-Label links in der Kopfleiste, z. B. "tsx". Nur `block`. */
  language?: string;
  /** Zeilennummern links. Standard true, nur `block`. */
  showLineNumbers?: boolean;
  /** Syntaxfarben (Schlüsselwörter, Zeichenketten, Zahlen, Kommentare). Standard true. */
  highlight?: boolean;
  /** Ab dieser Zeilenzahl klappt der Block ein. Standard 8. */
  collapseAfter?: number;
  copyLabel?: string;
  copiedLabel?: string;
  onCopy?: (code: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const CodeSnippet: React.FC<CodeSnippetProps>;
