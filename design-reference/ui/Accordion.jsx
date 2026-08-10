window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Accordion
   Faltet Abschnitte auf und zu. Kopfzeile ist eine Schaltfläche, der Inhalt wächst über
   grid-template-rows 0fr → 1fr (weich, ohne feste Höhe).
   Tastatur: Enter/Leertaste schaltet, Pfeile wechseln zwischen Kopfzeilen, Home/End an die Ränder. */

const MEDO_ACC_CSS = `
.medo-acc{ font-family: var(--medo-font-sans); }
.medo-acc--card{
  background: var(--medo-surface);
  border: var(--medo-border-thin) solid var(--medo-border);
  border-radius: var(--medo-radius-lg);
  overflow: hidden;
}
.medo-acc--separated{ display: flex; flex-direction: column; gap: var(--medo-space-sm); }
.medo-acc__item{ background: var(--medo-surface); }
.medo-acc--card .medo-acc__item + .medo-acc__item{ border-top: var(--medo-border-thin) solid var(--medo-border-subtle); }
.medo-acc--separated .medo-acc__item{
  border: var(--medo-border-thin) solid var(--medo-border);
  border-radius: var(--medo-radius-lg);
  overflow: hidden;
}
.medo-acc--plain .medo-acc__item + .medo-acc__item{ border-top: var(--medo-border-thin) solid var(--medo-divider); }

.medo-acc__head{
  box-sizing: border-box;
  width: 100%;
  appearance: none;
  border: none;
  background: transparent;
  font-family: inherit;
  text-align: left;
  display: flex;
  align-items: center;
  gap: var(--medo-space-sm);
  padding: 16px 18px;
  cursor: pointer;
  color: var(--medo-text);
  transition: background-color 120ms ease-out;
}
.medo-acc--sm .medo-acc__head{ padding: 12px 14px; gap: 10px; }
.medo-acc--plain .medo-acc__head{ padding-left: 0; padding-right: 0; }
.medo-acc__head:hover:not(:disabled){ background: var(--medo-state-hover); }
.medo-acc__head:focus-visible{ outline: none; box-shadow: inset 0 0 0 3px var(--medo-focus-ring); }
.medo-acc__head:disabled{ cursor: not-allowed; color: var(--medo-text-disabled); }
.medo-acc__head:disabled .medo-acc__sub{ color: var(--medo-text-disabled); }
.medo-acc__head:disabled .medo-acc__mark,
.medo-acc__head:disabled .medo-acc__lead{ color: var(--medo-icon-disabled); }

.medo-acc__lead{ flex: none; color: var(--medo-icon-muted); display: inline-flex; }
.medo-acc__body{ flex: 1; min-width: 0; }
.medo-acc__title{ font-size: var(--medo-text-base); font-weight: 600; line-height: 1.4; }
.medo-acc--sm .medo-acc__title{ font-size: var(--medo-text-sm); }
.medo-acc__sub{ font-size: var(--medo-text-sm); color: var(--medo-text-muted); margin-top: 2px; }
.medo-acc__mark{ flex: none; color: var(--medo-icon); display: inline-flex; transition: transform 160ms ease-out; }
.medo-acc__head[aria-expanded="true"] .medo-acc__mark--chevron{ transform: rotate(180deg); }

.medo-acc__panel{
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 180ms ease-out;
}
.medo-acc__panel--open{ grid-template-rows: 1fr; }
.medo-acc__clip{ overflow: hidden; }
.medo-acc__content{
  padding: 0 18px 18px;
  font-size: var(--medo-text-sm);
  line-height: 1.6;
  color: var(--medo-text-subtle);
}
.medo-acc--sm .medo-acc__content{ padding: 0 14px 14px; }
.medo-acc--plain .medo-acc__content{ padding-left: 0; padding-right: 0; }
.medo-acc__bar{
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--medo-space-xs);
}
.medo-acc__all{
  appearance: none;
  border: none;
  background: transparent;
  font-family: var(--medo-font-sans);
  font-size: var(--medo-text-sm);
  color: var(--medo-text-link);
  cursor: pointer;
  padding: 4px 6px;
  border-radius: var(--medo-radius-sm);
}
.medo-acc__all:hover{ color: var(--medo-text-link-hover); background: var(--medo-state-hover); }
.medo-acc__all:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
`;

const Accordion = ({
  items = [],
  multiple = true,
  value,
  defaultValue,
  onChange,
  variant = "card",
  size = "md",
  marker = "plusminus",
  showToggleAll = false,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-accordion-css", MEDO_ACC_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const uid = React.useMemo(() => "medo-acc-" + Math.random().toString(36).slice(2, 8), []);
  const controlled = value !== undefined;
  const norm = (v) => (v === undefined || v === null ? [] : Array.isArray(v) ? v : [v]);
  const [inner, setInner] = React.useState(norm(defaultValue));
  const open = controlled ? norm(value) : inner;
  const rootRef = React.useRef(null);
  const glyph = size === "sm" ? 20 : 22;

  const emit = (next) => {
    if (!controlled) setInner(next);
    if (onChange) onChange(multiple ? next : next[0] || null);
  };

  const toggle = (v) => {
    const isOpen = open.indexOf(v) !== -1;
    if (!multiple) return emit(isOpen ? [] : [v]);
    const next = open.slice();
    if (isOpen) next.splice(next.indexOf(v), 1);
    else next.push(v);
    emit(next);
  };

  const allOpen = items.length > 0 && items.every((it) => it.disabled || open.indexOf(it.value) !== -1);

  const onKeyDown = (e) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const heads = Array.prototype.slice.call(
      rootRef.current.querySelectorAll(".medo-acc__head:not(:disabled)")
    );
    if (!heads.length) return;
    const i = heads.indexOf(document.activeElement);
    let next;
    if (e.key === "Home") next = heads[0];
    else if (e.key === "End") next = heads[heads.length - 1];
    else if (i === -1) next = heads[0];
    else next = heads[(i + (e.key === "ArrowDown" ? 1 : -1) + heads.length) % heads.length];
    next.focus();
  };

  return React.createElement(
    "div",
    { style, ...rest },
    showToggleAll && multiple
      ? React.createElement(
          "div",
          { className: "medo-acc__bar" },
          React.createElement(
            "button",
            {
              type: "button",
              className: "medo-acc__all",
              onClick: () => emit(allOpen ? [] : items.filter((it) => !it.disabled).map((it) => it.value)),
            },
            allOpen ? "Alle zuklappen" : "Alle aufklappen"
          )
        )
      : null,
    React.createElement(
      "div",
      {
        ref: rootRef,
        onKeyDown,
        className: ["medo-acc", "medo-acc--" + variant, "medo-acc--" + size, className]
          .filter(Boolean)
          .join(" "),
      },
      items.map((it) => {
        const isOpen = open.indexOf(it.value) !== -1 && !it.disabled;
        return React.createElement(
          "div",
          { key: it.value, className: "medo-acc__item" },
          React.createElement(
            "button",
            {
              type: "button",
              id: uid + "-h-" + it.value,
              className: "medo-acc__head",
              "aria-expanded": isOpen ? "true" : "false",
              "aria-controls": uid + "-p-" + it.value,
              disabled: !!it.disabled,
              onClick: () => toggle(it.value),
            },
            it.icon && IconCmp
              ? React.createElement(
                  "span",
                  { className: "medo-acc__lead" },
                  React.createElement(IconCmp, { name: it.icon, size: glyph - 2 })
                )
              : null,
            React.createElement(
              "span",
              { className: "medo-acc__body" },
              React.createElement("span", { className: "medo-acc__title", style: { display: "block" } }, it.title),
              it.subtitle
                ? React.createElement("span", { className: "medo-acc__sub", style: { display: "block" } }, it.subtitle)
                : null
            ),
            it.meta ? React.createElement("span", { className: "medo-acc__sub" }, it.meta) : null,
            IconCmp
              ? React.createElement(
                  "span",
                  {
                    className: [
                      "medo-acc__mark",
                      marker === "chevron" ? "medo-acc__mark--chevron" : null,
                    ]
                      .filter(Boolean)
                      .join(" "),
                    "aria-hidden": "true",
                  },
                  React.createElement(IconCmp, {
                    name: marker === "chevron" ? "expand_more" : isOpen ? "remove" : "add",
                    size: glyph,
                  })
                )
              : null
          ),
          React.createElement(
            "div",
            {
              id: uid + "-p-" + it.value,
              role: "region",
              "aria-labelledby": uid + "-h-" + it.value,
              className: ["medo-acc__panel", isOpen ? "medo-acc__panel--open" : null]
                .filter(Boolean)
                .join(" "),
            },
            React.createElement(
              "div",
              { className: "medo-acc__clip" },
              React.createElement("div", { className: "medo-acc__content" }, it.content)
            )
          )
        );
      })
    )
  );
};

export { Accordion };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Accordion = Accordion;
