window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Link
   Führt zu einem anderen Ort. Zwei Muster: standalone (eigenständig, ohne Unterstreichung im
   Ruhezustand) und inline (im Fließtext, immer unterstrichen). */

const MEDO_LINK_CSS = `
.medo-link{
  font-family: var(--medo-font-sans);
  font-weight: 500;
  color: var(--medo-text-link);
  cursor: pointer;
  border-radius: var(--medo-radius-sm);
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
  transition: color 120ms ease-out;
  background: none;
  border: none;
  padding: 0;
}
.medo-link--sm{ font-size: var(--medo-text-sm); }
.medo-link--md{ font-size: var(--medo-text-base); }
.medo-link--lg{ font-size: var(--medo-text-lg); }

.medo-link--standalone{ text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
.medo-link--inline{ text-decoration: underline; }

.medo-link:hover{ color: var(--medo-text-link-hover); }
.medo-link:active{ color: var(--medo-text-link-hover); }
.medo-link:focus-visible{
  outline: none;
  box-shadow: 0 0 0 3px var(--medo-focus-ring);
}
.medo-link[aria-disabled="true"]{
  color: var(--medo-text-disabled);
  text-decoration: none;
  cursor: not-allowed;
  pointer-events: none;
}
`;

const LINK_ICON_SIZE = { sm: 16, md: 18, lg: 20 };

const Link = ({
  children,
  href,
  variant = "standalone",
  size = "md",
  icon,
  iconPosition = "trailing",
  external = false,
  disabled = false,
  onClick,
  target,
  rel,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-link-css", MEDO_LINK_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const glyphName = icon || (external ? "open_in_new" : null);
  const glyph =
    glyphName && IconCmp
      ? React.createElement(IconCmp, { name: glyphName, size: LINK_ICON_SIZE[size] || 18 })
      : null;

  const classes = [
    "medo-link",
    "medo-link--" + variant,
    "medo-link--" + size,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return React.createElement(
    "a",
    {
      className: classes,
      href: disabled ? undefined : href,
      target: external ? target || "_blank" : target,
      rel: external ? rel || "noopener noreferrer" : rel,
      "aria-disabled": disabled ? "true" : undefined,
      tabIndex: disabled ? -1 : undefined,
      onClick: disabled ? (e) => e.preventDefault() : onClick,
      style,
      ...rest,
    },
    iconPosition === "leading" ? glyph : null,
    children,
    iconPosition === "trailing" ? glyph : null
  );
};

export { Link };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Link = Link;
