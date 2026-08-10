window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · ContentSwitcher
   Wechselt die Darstellung desselben Inhalts — Liste, Raster, Kanban; Monat, Jahr.
   Zwei Stile: neutral (Leiste stone-100, aktives Segment weiß) und outline (gemeinsamer Rahmen,
   aktives Segment gefüllt). Segmente sind gleich breit, damit die Leiste beim Wechsel stillsteht. */

const MEDO_CS_CSS = `
.medo-cs{
  box-sizing: border-box;
  font-family: var(--medo-font-sans);
  display: inline-flex;
}
.medo-cs--neutral{
  gap: 4px;
  padding: 4px;
  background: var(--medo-surface-sunken);
  border-radius: var(--medo-radius-lg);
}
.medo-cs--neutral.medo-cs--sm{ gap: 3px; padding: 3px; border-radius: 9px; }
.medo-cs--outline{
  border: var(--medo-border-thin) solid var(--medo-border-strong);
  border-radius: var(--medo-radius-md);
}
.medo-cs--outline .medo-cs__seg:first-child{ border-radius: 7px 0 0 7px; }
.medo-cs--outline .medo-cs__seg:last-child{ border-radius: 0 7px 7px 0; }
.medo-cs--outline.medo-cs--sm{ border-radius: 6px; }
.medo-cs--outline.medo-cs--sm .medo-cs__seg:first-child{ border-radius: 5px 0 0 5px; }
.medo-cs--outline.medo-cs--sm .medo-cs__seg:last-child{ border-radius: 0 5px 5px 0; }
.medo-cs--full{ display: flex; width: 100%; }

.medo-cs__seg{
  box-sizing: border-box;
  position: relative;
  appearance: none;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: var(--medo-text-sm);
  font-weight: 500;
  color: var(--medo-text-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 120ms ease-out, color 120ms ease-out;
}
.medo-cs--sm .medo-cs__seg{ height: 32px; padding: 0 12px; font-size: var(--medo-text-xs); gap: 6px; }
.medo-cs__seg--equal{ flex: 1 1 0; }
.medo-cs__seg--iconOnly{ min-width: 44px; padding: 0 10px; }
.medo-cs--sm .medo-cs__seg--iconOnly{ min-width: 36px; padding: 0 8px; }
.medo-cs__seg:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); z-index: 2; }
.medo-cs__seg:disabled{ color: var(--medo-text-disabled); cursor: not-allowed; }

/* Neutral */
.medo-cs--neutral .medo-cs__seg{ border-radius: var(--medo-radius-md); }
.medo-cs--neutral.medo-cs--sm .medo-cs__seg{ border-radius: 6px; }
.medo-cs--neutral .medo-cs__seg:hover:not(:disabled):not([aria-selected="true"]){
  background: var(--medo-state-hover);
  color: var(--medo-text);
}
.medo-cs--neutral .medo-cs__seg[aria-selected="true"]{
  background: var(--medo-surface);
  box-shadow: var(--medo-shadow-sm);
  color: var(--medo-text);
  font-weight: 600;
}

/* Outline */
.medo-cs--outline .medo-cs__seg + .medo-cs__seg{
  border-left: var(--medo-border-thin) solid var(--medo-border-strong);
}
.medo-cs--outline .medo-cs__seg:hover:not(:disabled):not([aria-selected="true"]){
  background: var(--medo-state-hover);
  color: var(--medo-text);
}
.medo-cs--outline .medo-cs__seg[aria-selected="true"]{
  background: var(--medo-action);
  color: var(--medo-action-text);
  font-weight: 600;
}
.medo-cs--outline .medo-cs__seg[aria-selected="true"] + .medo-cs__seg{ border-left-color: var(--medo-action); }
.medo-cs--outline .medo-cs__seg:disabled{ background: var(--medo-surface-container); }

/* Icon-only: das Label erscheint als dunkler Hinweis über dem Segment. */
.medo-cs__tip{
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--medo-color-stone-1000);
  color: var(--medo-color-white);
  font-family: var(--medo-font-sans);
  font-size: var(--medo-text-xs);
  font-weight: 400;
  line-height: 1.45;
  padding: 6px 9px;
  border-radius: 7px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 120ms ease-out;
  box-shadow: var(--medo-shadow-md);
  z-index: 5;
}
.medo-cs__seg:hover .medo-cs__tip,
.medo-cs__seg:focus-visible .medo-cs__tip{ opacity: 1; }
`;

const ContentSwitcher = ({
  items = [],
  value,
  defaultValue,
  onChange,
  variant = "neutral",
  size = "md",
  iconOnly = false,
  equalWidth = true,
  fullWidth = false,
  ariaLabel,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-content-switcher-css", MEDO_CS_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const controlled = value !== undefined;
  const first = items.find((s) => !s.disabled) || items[0] || {};
  const [inner, setInner] = React.useState(defaultValue !== undefined ? defaultValue : first.value);
  const active = controlled ? value : inner;
  const ref = React.useRef(null);
  const glyph = size === "sm" ? 19 : 21;

  const select = (v) => {
    if (!controlled) setInner(v);
    if (onChange) onChange(v);
  };

  /* Pfeiltasten wechseln direkt, Home/End an den Rand; deaktivierte Segmente überspringen. */
  const onKeyDown = (e) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const usable = items.filter((s) => !s.disabled);
    if (!usable.length) return;
    let target;
    if (e.key === "Home") target = usable[0];
    else if (e.key === "End") target = usable[usable.length - 1];
    else {
      const i = usable.findIndex((s) => s.value === active);
      const step = e.key === "ArrowRight" ? 1 : -1;
      target = usable[(i + step + usable.length) % usable.length];
    }
    select(target.value);
    const el = ref.current && ref.current.querySelector('[data-val="' + target.value + '"]');
    if (el) el.focus();
  };

  return React.createElement(
    "div",
    {
      ref,
      role: "tablist",
      "aria-label": ariaLabel,
      "aria-orientation": "horizontal",
      onKeyDown,
      className: [
        "medo-cs",
        "medo-cs--" + variant,
        "medo-cs--" + size,
        fullWidth ? "medo-cs--full" : null,
        className,
      ]
        .filter(Boolean)
        .join(" "),
      style,
      ...rest,
    },
    items.map((s) => {
      const selected = s.value === active;
      return React.createElement(
        "button",
        {
          key: s.value,
          type: "button",
          role: "tab",
          "data-val": s.value,
          "aria-selected": selected ? "true" : "false",
          "aria-label": iconOnly ? s.label : undefined,
          tabIndex: selected ? 0 : -1,
          disabled: !!s.disabled,
          onClick: () => !s.disabled && select(s.value),
          className: [
            "medo-cs__seg",
            equalWidth || fullWidth ? "medo-cs__seg--equal" : null,
            iconOnly ? "medo-cs__seg--iconOnly" : null,
          ]
            .filter(Boolean)
            .join(" "),
        },
        s.icon && IconCmp
          ? React.createElement(IconCmp, { name: s.icon, size: iconOnly ? glyph : glyph - 3 })
          : null,
        iconOnly ? null : React.createElement("span", null, s.label),
        iconOnly
          ? React.createElement("span", { className: "medo-cs__tip", "aria-hidden": "true" }, s.label)
          : null
      );
    })
  );
};

export { ContentSwitcher };
window.MedoUI = window.MedoUI || {};
window.MedoUI.ContentSwitcher = ContentSwitcher;
