window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Tag
   Kennzeichnet, kategorisiert oder filtert. Drei Typen — anzeigend, entfernbar, auswählbar —
   in sechs Farbrollen und zwei Stilen. Immer vollrund (feste Systemregel). */

const MEDO_TAG_CSS = `
.medo-tag{
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--medo-font-sans);
  font-weight: 500;
  border-radius: var(--medo-radius-full);
  border: var(--medo-border-thin) solid transparent;
  white-space: nowrap;
  max-width: 100%;
}
.medo-tag__label{ overflow: hidden; text-overflow: ellipsis; }
.medo-tag--sm{ height: 22px; padding: 0 10px; font-size: var(--medo-text-xs); }
.medo-tag--md{ height: 28px; padding: 0 12px; font-size: var(--medo-text-sm); }
.medo-tag--sm.medo-tag--removable{ padding-right: 3px; }
.medo-tag--md.medo-tag--removable{ padding-right: 5px; }

.medo-tag__dot{ flex: none; border-radius: var(--medo-radius-full); }
.medo-tag--sm .medo-tag__dot{ width: 6px; height: 6px; }
.medo-tag--md .medo-tag__dot{ width: 7px; height: 7px; }

.medo-tag__x{
  box-sizing: border-box;
  border: none; background: transparent;
  width: 20px; height: 20px; flex: none;
  border-radius: var(--medo-radius-full);
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; color: inherit;
  transition: background-color 120ms ease-out;
}
.medo-tag--sm .medo-tag__x{ width: 18px; height: 18px; }
.medo-tag__x:hover{ background: rgba(31,29,26,0.10); }
.medo-tag__x:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }

/* Auswählbar — als Schaltfläche gerendert */
.medo-tag--selectable{
  background: var(--medo-surface);
  color: var(--medo-text);
  border-color: var(--medo-border);
  cursor: pointer;
  transition: background-color 120ms ease-out, border-color 120ms ease-out, color 120ms ease-out;
}
.medo-tag--selectable:hover:not(:disabled){
  background: var(--medo-state-hover);
  border-color: var(--medo-border-strong);
}
.medo-tag--selectable:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-tag--selected{
  background: var(--medo-action);
  color: var(--medo-action-text);
  border-color: var(--medo-action);
}
.medo-tag--selected:hover:not(:disabled){
  background: var(--medo-action-hover);
  border-color: var(--medo-action-hover);
}
.medo-tag--selectable:disabled{
  background: var(--medo-surface-container);
  color: var(--medo-text-disabled);
  border-color: var(--medo-border-subtle);
  cursor: not-allowed;
}
`;

/* Farbrollen: soft = Fläche 50 mit Text 1000, solid = Fläche 600 mit Text auf Volltonfarbe */
const MEDO_TAG_COLORS = {
  neutral: { soft: ["--medo-color-stone-100", "--medo-color-stone-1000"], solid: ["--medo-color-stone-700", "--medo-color-white"], dot: "--medo-color-stone-600" },
  primary: { soft: ["--medo-primary-50", "--medo-primary-1000"], solid: ["--medo-primary-600", "--medo-color-white"], dot: "--medo-primary-600" },
  success: { soft: ["--medo-success-surface", "--medo-success-text"], solid: ["--medo-success-solid", "--medo-success-on-solid"], dot: "--medo-success-solid" },
  warning: { soft: ["--medo-warning-surface", "--medo-warning-text"], solid: ["--medo-warning-solid", "--medo-warning-on-solid"], dot: "--medo-warning-solid" },
  error:   { soft: ["--medo-error-surface", "--medo-error-text"], solid: ["--medo-error-solid", "--medo-error-on-solid"], dot: "--medo-error-solid" },
  info:    { soft: ["--medo-info-surface", "--medo-info-text"], solid: ["--medo-info-solid", "--medo-info-on-solid"], dot: "--medo-info-solid" },
};

const Tag = ({
  children,
  color = "neutral",
  emphasis = "soft",
  size = "md",
  dot = false,
  icon,
  onRemove,
  removeLabel,
  selectable = false,
  selected = false,
  disabled = false,
  onClick,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-tag-css", MEDO_TAG_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const glyphSize = size === "sm" ? 14 : 16;
  const role = MEDO_TAG_COLORS[color] || MEDO_TAG_COLORS.neutral;
  const pair = emphasis === "solid" ? role.solid : role.soft;

  const label = React.createElement("span", { className: "medo-tag__label" }, children);

  /* Auswählbar: eigene Farbgebung über die Zustandsklassen, kein Farbrollen-Style */
  if (selectable) {
    return React.createElement(
      "button",
      {
        type: "button",
        className: [
          "medo-tag",
          "medo-tag--" + size,
          "medo-tag--selectable",
          selected ? "medo-tag--selected" : null,
          className,
        ]
          .filter(Boolean)
          .join(" "),
        "aria-pressed": selected ? "true" : "false",
        disabled,
        onClick,
        style,
        ...rest,
      },
      selected && IconCmp
        ? React.createElement(IconCmp, { name: "check", size: glyphSize })
        : icon && IconCmp
        ? React.createElement(IconCmp, { name: icon, size: glyphSize })
        : null,
      label
    );
  }

  return React.createElement(
    "span",
    {
      className: [
        "medo-tag",
        "medo-tag--" + size,
        onRemove ? "medo-tag--removable" : null,
        className,
      ]
        .filter(Boolean)
        .join(" "),
      style: { background: "var(" + pair[0] + ")", color: "var(" + pair[1] + ")", ...style },
      ...rest,
    },
    dot
      ? React.createElement("span", {
          className: "medo-tag__dot",
          style: {
            background:
              emphasis === "solid" ? "currentColor" : "var(" + role.dot + ")",
          },
        })
      : null,
    icon && IconCmp ? React.createElement(IconCmp, { name: icon, size: glyphSize }) : null,
    label,
    onRemove
      ? React.createElement(
          "button",
          {
            type: "button",
            className: "medo-tag__x",
            "aria-label": removeLabel || "Entfernen",
            onClick: onRemove,
          },
          IconCmp ? React.createElement(IconCmp, { name: "close", size: glyphSize }) : null
        )
      : null
  );
};

export { Tag };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Tag = Tag;
