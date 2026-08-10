window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Button
   Löst eine Aktion aus. Vier Varianten, drei Größen, alle Zustände aus Semantic-Tokens.
   Hover, Aktiv und Fokus laufen über eine einmalig injizierte Stylesheet-Regel,
   weil Inline-Styles keine Pseudoklassen abbilden können. */
const MEDO_BUTTON_CSS = `
.medo-btn{
  box-sizing: border-box;
  font-family: var(--medo-font-sans);
  font-weight: 400;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--medo-space-xs);
  white-space: nowrap;
  border-radius: var(--medo-radius-md);
  border: var(--medo-border-thin) solid transparent;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 140ms ease-out, border-color 140ms ease-out, color 140ms ease-out;
  -webkit-font-smoothing: antialiased;
}
.medo-btn:focus-visible{
  outline: none;
  box-shadow: 0 0 0 3px var(--medo-focus-ring);
}
.medo-btn[aria-disabled="true"]{ cursor: not-allowed; }

.medo-btn--sm{ height: 32px; padding: 0 12px; font-size: var(--medo-text-xs); }
.medo-btn--md{ height: 40px; padding: 0 16px; font-size: var(--medo-text-sm); }
.medo-btn--lg{ height: 48px; padding: 0 22px; font-size: var(--medo-text-base); }

.medo-btn--iconOnly.medo-btn--sm{ width: 32px; padding: 0; }
.medo-btn--iconOnly.medo-btn--md{ width: 40px; padding: 0; }
.medo-btn--iconOnly.medo-btn--lg{ width: 48px; padding: 0; }

.medo-btn--fullWidth{ width: 100%; }

/* primary */
.medo-btn--primary{ background: var(--medo-action); color: var(--medo-action-text); }
.medo-btn--primary:hover:not([aria-disabled="true"]){ background: var(--medo-action-hover); }
.medo-btn--primary:active:not([aria-disabled="true"]){ background: var(--medo-action-active); }

/* secondary */
.medo-btn--secondary{
  background: var(--medo-action-neutral);
  color: var(--medo-action-neutral-text);
  border-color: var(--medo-border);
}
.medo-btn--secondary:hover:not([aria-disabled="true"]){ background: var(--medo-action-neutral-hover); }
.medo-btn--secondary:active:not([aria-disabled="true"]){ background: var(--medo-action-neutral-active); }

/* ghost */
.medo-btn--ghost{ background: transparent; color: var(--medo-action-neutral-text); }
.medo-btn--ghost:hover:not([aria-disabled="true"]){ background: var(--medo-state-hover); }
.medo-btn--ghost:active:not([aria-disabled="true"]){ background: var(--medo-state-pressed); }

/* danger */
.medo-btn--danger{ background: var(--medo-error-solid); color: var(--medo-error-on-solid); }
.medo-btn--danger:hover:not([aria-disabled="true"]){ background: var(--medo-error-solid-hover); }
.medo-btn--danger:active:not([aria-disabled="true"]){ background: var(--medo-error-solid-active); }
.medo-btn--danger:focus-visible{ box-shadow: 0 0 0 3px var(--medo-focus-ring-danger); }

/* deaktiviert — je Variante, wie in components/Button.dc.html festgelegt */
.medo-btn--primary[aria-disabled="true"],
.medo-btn--danger[aria-disabled="true"]{
  background: var(--medo-action-disabled);
  color: var(--medo-action-text-disabled);
  border-color: transparent;
}
.medo-btn--secondary[aria-disabled="true"]{
  background: var(--medo-color-stone-100);
  color: var(--medo-color-stone-400);
  border-color: var(--medo-color-stone-200);
}
.medo-btn--ghost[aria-disabled="true"]{
  background: transparent;
  color: var(--medo-color-stone-400);
  border-color: transparent;
}

/* Laden — behält die Variantenfarbe, nur der Spinner kommt hinzu.
   Steht nach den Disabled-Regeln, damit es sie überschreibt. */
.medo-btn--primary[aria-busy="true"]{ background: var(--medo-action); color: var(--medo-action-text); }
.medo-btn--secondary[aria-busy="true"]{
  background: var(--medo-action-neutral);
  color: var(--medo-action-neutral-text);
  border-color: var(--medo-border);
}
.medo-btn--ghost[aria-busy="true"]{ background: transparent; color: var(--medo-action-neutral-text); }
.medo-btn--danger[aria-busy="true"]{ background: var(--medo-error-solid); color: var(--medo-error-on-solid); }

@keyframes medo-spin{ to{ transform: rotate(360deg); } }
.medo-btn__spinner{
  width: 1em; height: 1em;
  border-radius: var(--medo-radius-full);
  border: 2px solid currentColor;
  border-top-color: transparent;
  animation: medo-spin 700ms linear infinite;
  flex: none;
}
`;

function medoInjectCss(id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}

const ICON_SIZE_FOR = { sm: 16, md: 18, lg: 20 };

const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "leading",
  iconOnly = false,
  loading = false,
  disabled = false,
  fullWidth = false,
  type = "button",
  href,
  onClick,
  className,
  style,
  ...rest
}) => {
  medoInjectCss("medo-button-css", MEDO_BUTTON_CSS);

  const isDisabled = disabled || loading;
  const iconSize = ICON_SIZE_FOR[size] || 18;  const IconCmp = (window.MedoUI && window.MedoUI.Icon) || null;

  const glyph =
    icon && IconCmp
      ? React.createElement(IconCmp, { name: icon, size: iconOnly ? iconSize + 2 : iconSize })
      : null;

  const spinner = loading
    ? React.createElement("span", { className: "medo-btn__spinner" })
    : null;

  const content = iconOnly
    ? [spinner || glyph]
    : [
        spinner,
        iconPosition === "leading" ? glyph : null,
        children != null ? React.createElement("span", { key: "label" }, children) : null,
        iconPosition === "trailing" ? glyph : null,
      ];

  const classes = [
    "medo-btn",
    "medo-btn--" + variant,
    "medo-btn--" + size,
    iconOnly ? "medo-btn--iconOnly" : null,
    fullWidth ? "medo-btn--fullWidth" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const shared = {
    className: classes,
    style: style,
    "aria-disabled": isDisabled ? "true" : undefined,
    "aria-busy": loading ? "true" : undefined,
    onClick: isDisabled
      ? (e) => {
          e.preventDefault();
          e.stopPropagation();
        }
      : onClick,
    ...rest,
  };

  if (href) {
    return React.createElement(
      "a",
      { ...shared, href: isDisabled ? undefined : href, role: "button", tabIndex: isDisabled ? -1 : 0 },
      content.filter(Boolean)
    );
  }

  return React.createElement(
    "button",
    { ...shared, type, disabled: isDisabled },
    content.filter(Boolean)
  );
};

export { Button };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Button = Button;
