window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Tabs
   Wechsel zwischen gleichrangigen Ansichten desselben Objekts.
   Zwei Stile: underline (Indikator, ohne Grundlinie) und contained (Fläche auf stone-100-Leiste).
   Tastatur: Pfeile wechseln direkt, Home/End springen an den Rand; deaktivierte Tabs werden
   übersprungen. Kinder werden — falls vorhanden — als Panel des aktiven Tabs gerendert. */

const MEDO_TABS_CSS = `
.medo-tabs{ font-family: var(--medo-font-sans); }
.medo-tabs--vertical{ display: flex; gap: var(--medo-space-lg); align-items: flex-start; }
.medo-tabs__list{ display: flex; }
.medo-tabs__list--scroll{
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.medo-tabs__list--scroll::-webkit-scrollbar{ display: none; width: 0; height: 0; }
.medo-tabs__tab{
  box-sizing: border-box;
  position: relative;
  appearance: none;
  border: none;
  background: none;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  color: var(--medo-text-muted);
  font-weight: 500;
  cursor: pointer;
  transition: color 120ms ease-out, background-color 120ms ease-out;
}
.medo-tabs__tab:disabled{ color: var(--medo-text-disabled); opacity: 0.6; cursor: not-allowed; }
.medo-tabs__tab:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); border-radius: 6px; }

/* Underline */
.medo-tabs__list--underline{ gap: 28px; }
.medo-tabs__list--underline.medo-tabs__list--sm{ gap: 20px; }
.medo-tabs__tab--underline{ padding: 12px 2px 14px; font-size: var(--medo-text-base); }
.medo-tabs__list--sm .medo-tabs__tab--underline{ padding: 8px 2px 10px; font-size: var(--medo-text-sm); }
.medo-tabs__tab--underline:hover:not(:disabled){ color: var(--medo-text); }
.medo-tabs__tab--underline[aria-selected="true"]{ color: var(--medo-text); font-weight: 600; }
.medo-tabs__ind{
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: var(--medo-border-thick);
  border-radius: 2px 2px 0 0;
  background: transparent;
}
.medo-tabs__tab--underline[aria-selected="true"] .medo-tabs__ind{ background: var(--medo-action); }

/* Underline vertikal — Indikator links */
.medo-tabs__list--vertical{ flex-direction: column; gap: 2px; min-width: 190px; }
.medo-tabs__tab--vertical{
  justify-content: flex-start;
  text-align: left;
  padding: 10px 14px;
  border-radius: var(--medo-radius-md);
  font-size: var(--medo-text-sm);
}
.medo-tabs__tab--vertical:hover:not(:disabled){ background: var(--medo-state-hover); }
.medo-tabs__tab--vertical[aria-selected="true"]{ background: var(--medo-state-selected); color: var(--medo-primary-1000); }
.medo-tabs__tab--vertical .medo-tabs__ind{ left: 0; right: auto; top: 8px; bottom: 8px; width: var(--medo-border-thick); height: auto; border-radius: 0 2px 2px 0; }
.medo-tabs__tab--vertical[aria-selected="true"] .medo-tabs__ind{ background: var(--medo-action); }

/* Contained */
.medo-tabs__list--contained{
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  background: var(--medo-surface-sunken);
  border-radius: var(--medo-radius-lg);
}
.medo-tabs__list--contained.medo-tabs__list--sm{ gap: 3px; padding: 3px; border-radius: 9px; }
.medo-tabs__tab--contained{
  padding: 8px 16px;
  border-radius: var(--medo-radius-md);
  font-size: var(--medo-text-sm);
}
.medo-tabs__list--sm .medo-tabs__tab--contained{ padding: 6px 12px; font-size: var(--medo-text-xs); border-radius: 6px; }
.medo-tabs__tab--contained:hover:not(:disabled):not([aria-selected="true"]){ color: var(--medo-text); }
.medo-tabs__tab--contained[aria-selected="true"]{
  background: var(--medo-surface);
  box-shadow: var(--medo-shadow-sm);
  color: var(--medo-text);
  font-weight: 600;
}

.medo-tabs__tab--full{ flex: 1 1 0; }
.medo-tabs__inner{ display: inline-flex; align-items: center; gap: 8px; }
.medo-tabs__list--sm .medo-tabs__inner{ gap: 7px; }
.medo-tabs__badge{
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 18px; height: 18px; padding: 0 5px;
  border-radius: var(--medo-radius-full);
  font-family: var(--medo-font-mono);
  font-size: 11px; font-weight: 500;
  background: var(--medo-surface-sunken);
  color: var(--medo-text-subtle);
}
.medo-tabs__tab[aria-selected="true"] .medo-tabs__badge{ background: var(--medo-primary-100); color: var(--medo-primary-1000); }
.medo-tabs__panel{ flex: 1; min-width: 0; }
.medo-tabs__panel:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); border-radius: var(--medo-radius-md); }
`;

const Tabs = ({
  items = [],
  value,
  defaultValue,
  onChange,
  variant = "underline",
  size = "md",
  orientation = "horizontal",
  fullWidth = false,
  scrollable = false,
  ariaLabel,
  children,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-tabs-css", MEDO_TABS_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const uid = React.useMemo(() => "medo-tabs-" + Math.random().toString(36).slice(2, 8), []);
  const controlled = value !== undefined;
  const first = items.find((t) => !t.disabled) || items[0] || {};
  const [inner, setInner] = React.useState(defaultValue !== undefined ? defaultValue : first.value);
  const active = controlled ? value : inner;
  const listRef = React.useRef(null);
  const vertical = orientation === "vertical";

  const select = (v) => {
    if (!controlled) setInner(v);
    if (onChange) onChange(v);
  };

  /* Pfeiltasten: nächster bedienbarer Tab, Auswahl folgt dem Fokus. */
  const onKeyDown = (e) => {
    const keys = vertical
      ? { prev: "ArrowUp", next: "ArrowDown" }
      : { prev: "ArrowLeft", next: "ArrowRight" };
    if (![keys.prev, keys.next, "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const usable = items.filter((t) => !t.disabled);
    if (!usable.length) return;
    let target;
    if (e.key === "Home") target = usable[0];
    else if (e.key === "End") target = usable[usable.length - 1];
    else {
      const i = usable.findIndex((t) => t.value === active);
      const step = e.key === keys.next ? 1 : -1;
      target = usable[(i + step + usable.length) % usable.length];
    }
    select(target.value);
    const el = listRef.current && listRef.current.querySelector('[data-val="' + target.value + '"]');
    if (el) el.focus();
  };

  const list = React.createElement(
    "div",
    {
      ref: listRef,
      role: "tablist",
      "aria-label": ariaLabel,
      "aria-orientation": vertical ? "vertical" : "horizontal",
      onKeyDown,
      className: [
        "medo-tabs__list",
        "medo-tabs__list--" + (vertical ? "vertical" : variant),
        "medo-tabs__list--" + size,
        scrollable && !vertical ? "medo-tabs__list--scroll" : null,
      ]
        .filter(Boolean)
        .join(" "),
      style: fullWidth && !vertical ? { display: "flex" } : undefined,
    },
    items.map((t) => {
      const selected = t.value === active;
      const glyph = size === "sm" ? (variant === "contained" ? 17 : 17) : variant === "contained" ? 18 : 19;
      return React.createElement(
        "button",
        {
          key: t.value,
          type: "button",
          role: "tab",
          id: uid + "-tab-" + t.value,
          "data-val": t.value,
          "aria-selected": selected ? "true" : "false",
          "aria-controls": children ? uid + "-panel" : undefined,
          tabIndex: selected ? 0 : -1,
          disabled: !!t.disabled,
          onClick: () => !t.disabled && select(t.value),
          className: [
            "medo-tabs__tab",
            "medo-tabs__tab--" + (vertical ? "vertical" : variant),
            fullWidth && !vertical ? "medo-tabs__tab--full" : null,
          ]
            .filter(Boolean)
            .join(" "),
        },
        React.createElement(
          "span",
          { className: "medo-tabs__inner" },
          t.icon && IconCmp ? React.createElement(IconCmp, { name: t.icon, size: glyph }) : null,
          React.createElement("span", null, t.label),
          t.badge !== undefined && t.badge !== null
            ? React.createElement("span", { className: "medo-tabs__badge" }, t.badge)
            : null
        ),
        variant === "underline" || vertical
          ? React.createElement("span", { className: "medo-tabs__ind", "aria-hidden": "true" })
          : null
      );
    })
  );

  const panel = children
    ? React.createElement(
        "div",
        {
          role: "tabpanel",
          id: uid + "-panel",
          "aria-labelledby": uid + "-tab-" + active,
          tabIndex: 0,
          className: "medo-tabs__panel",
        },
        children
      )
    : null;

  return React.createElement(
    "div",
    {
      className: ["medo-tabs", vertical ? "medo-tabs--vertical" : null, className]
        .filter(Boolean)
        .join(" "),
      style,
      ...rest,
    },
    list,
    panel
  );
};

export { Tabs };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Tabs = Tabs;
