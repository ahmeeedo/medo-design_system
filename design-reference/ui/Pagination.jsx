window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Pagination
   Seitenweises Blättern. Drei Formen: Nummern, kompakt (Seite X von Y) und die volle Leiste
   mit Einträgen pro Seite, Bereichsangabe und Direktsprung.
   Aktive Seite ist primary-600 gefüllt und trägt aria-current="page". */

const MEDO_PAG_CSS = `
.medo-pag{
  font-family: var(--medo-font-sans);
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.medo-pag--sm{ gap: 4px; }
.medo-pag__btn{
  box-sizing: border-box;
  appearance: none;
  background: var(--medo-surface);
  border: var(--medo-border-thin) solid transparent;
  border-radius: var(--medo-radius-md);
  font-family: inherit;
  font-size: var(--medo-text-base);
  font-weight: 500;
  color: var(--medo-text);
  min-width: 40px;
  height: 40px;
  padding: 0 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  font-variant-numeric: tabular-nums;
  transition: background-color 120ms ease-out, color 120ms ease-out;
}
.medo-pag--sm .medo-pag__btn{ min-width: 32px; height: 32px; padding: 0 5px; font-size: var(--medo-text-xs); }
.medo-pag__btn:hover:not(:disabled){ background: var(--medo-state-hover); }
.medo-pag__btn:active:not(:disabled){ background: var(--medo-state-pressed); }
.medo-pag__btn:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-pag__btn:disabled{ color: var(--medo-color-stone-400); cursor: not-allowed; }
.medo-pag__btn--icon{ width: 40px; min-width: 40px; padding: 0; }
.medo-pag--sm .medo-pag__btn--icon{ width: 32px; min-width: 32px; }
.medo-pag__btn--active{
  background: var(--medo-action);
  color: var(--medo-action-text);
  font-weight: 600;
}
.medo-pag__btn--active:hover:not(:disabled){ background: var(--medo-action-hover); }
.medo-pag__btn--wide{ width: auto; min-width: 0; padding: 0 14px; font-size: var(--medo-text-sm); border-color: var(--medo-border); }
.medo-pag__ell{
  min-width: 40px; height: 40px;
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--medo-color-stone-500);
  user-select: none;
}
.medo-pag--sm .medo-pag__ell{ min-width: 32px; height: 32px; }
.medo-pag__info{
  font-size: var(--medo-text-sm);
  color: var(--medo-text-muted);
  font-variant-numeric: tabular-nums;
}
.medo-pag__info b{ color: var(--medo-text); font-weight: 600; }
.medo-pag__bar{
  font-family: var(--medo-font-sans);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--medo-space-lg);
  flex-wrap: wrap;
}
.medo-pag__side{ display: flex; align-items: center; gap: var(--medo-space-xs); }
.medo-pag__label{ font-size: var(--medo-text-sm); color: var(--medo-text-muted); }
.medo-pag__select{
  box-sizing: border-box;
  appearance: none;
  height: 40px;
  padding: 0 34px 0 12px;
  border: var(--medo-border-thin) solid var(--medo-input-border, var(--medo-color-stone-400));
  border-radius: var(--medo-radius-md);
  background: var(--medo-input-bg, #fff) no-repeat right 12px center;
  background-image: linear-gradient(45deg, transparent 50%, var(--medo-icon) 50%), linear-gradient(135deg, var(--medo-icon) 50%, transparent 50%);
  background-size: 5px 5px, 5px 5px;
  background-position: right 16px center, right 11px center;
  font-family: var(--medo-font-sans);
  font-size: var(--medo-text-sm);
  color: var(--medo-input-text, var(--medo-text));
  cursor: pointer;
}
.medo-pag__select:focus-visible{ outline: none; border-color: var(--medo-action); box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-pag__jump{
  box-sizing: border-box;
  width: 56px;
  height: 40px;
  padding: 0 10px;
  border: var(--medo-border-thin) solid var(--medo-input-border, var(--medo-color-stone-400));
  border-radius: var(--medo-radius-md);
  background: var(--medo-input-bg, #fff);
  font-family: var(--medo-font-mono);
  font-size: var(--medo-text-sm);
  color: var(--medo-input-text, var(--medo-text));
  text-align: center;
}
.medo-pag__jump:focus-visible{ outline: none; border-color: var(--medo-action); box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-pag__bar--sm .medo-pag__select{ height: 32px; font-size: var(--medo-text-xs); padding-right: 30px; }
.medo-pag__bar--sm .medo-pag__jump{ height: 32px; width: 48px; font-size: var(--medo-text-xs); }
.medo-pag__bar--sm .medo-pag__label,
.medo-pag__bar--sm .medo-pag__info{ font-size: var(--medo-text-xs); }
`;

/* Fensterlogik: erste und letzte Seite immer, um die aktuelle je `siblings` Nachbarn, dazwischen … */
const medoPageWindow = (page, count, siblings) => {
  if (count <= 5 + siblings * 2) {
    const all = [];
    for (let i = 1; i <= count; i++) all.push(i);
    return all;
  }
  const out = [1];
  const from = Math.max(2, page - siblings);
  const to = Math.min(count - 1, page + siblings);
  if (from > 2) out.push("start-ell");
  for (let i = from; i <= to; i++) out.push(i);
  if (to < count - 1) out.push("end-ell");
  out.push(count);
  return out;
};

const Pagination = ({
  page,
  defaultPage = 1,
  pageCount,
  totalItems,
  pageSize = 20,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
  variant = "numbers",
  size = "md",
  siblings = 1,
  showFirstLast = false,
  showJump = false,
  ariaLabel = "Seitennummerierung",
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-pagination-css", MEDO_PAG_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const controlled = page !== undefined;
  const [inner, setInner] = React.useState(defaultPage);
  const current = controlled ? page : inner;
  const count = pageCount || Math.max(1, Math.ceil((totalItems || 0) / pageSize));
  const [jump, setJump] = React.useState("");
  const glyph = size === "sm" ? 19 : 22;

  const go = (p) => {
    const next = Math.min(Math.max(1, p), count);
    if (next === current) return;
    if (!controlled) setInner(next);
    if (onPageChange) onPageChange(next);
  };

  const atStart = current <= 1;
  const atEnd = current >= count;

  const iconBtn = (glyphName, label, disabled, onClick) =>
    React.createElement(
      "button",
      {
        key: label,
        type: "button",
        className: "medo-pag__btn medo-pag__btn--icon",
        "aria-label": label,
        disabled,
        onClick,
      },
      IconCmp ? React.createElement(IconCmp, { name: glyphName, size: glyph }) : null
    );

  const numbers = medoPageWindow(current, count, siblings).map((p, i) =>
    typeof p === "string"
      ? React.createElement("span", { key: p + i, className: "medo-pag__ell", "aria-hidden": "true" }, "…")
      : React.createElement(
          "button",
          {
            key: p,
            type: "button",
            className: ["medo-pag__btn", p === current ? "medo-pag__btn--active" : null]
              .filter(Boolean)
              .join(" "),
            "aria-label": "Seite " + p,
            "aria-current": p === current ? "page" : undefined,
            onClick: () => go(p),
          },
          p
        )
  );

  const nav = (extra) =>
    React.createElement(
      "nav",
      {
        "aria-label": ariaLabel,
        className: ["medo-pag", "medo-pag--" + size, className].filter(Boolean).join(" "),
        style: extra ? undefined : style,
        ...(extra ? {} : rest),
      },
      showFirstLast ? iconBtn("first_page", "Erste Seite", atStart, () => go(1)) : null,
      iconBtn("chevron_left", "Vorherige Seite", atStart, () => go(current - 1)),
      numbers,
      iconBtn("chevron_right", "Nächste Seite", atEnd, () => go(current + 1)),
      showFirstLast ? iconBtn("last_page", "Letzte Seite", atEnd, () => go(count)) : null
    );

  if (variant === "compact") {
    return React.createElement(
      "nav",
      {
        "aria-label": ariaLabel,
        className: ["medo-pag", "medo-pag--" + size, className].filter(Boolean).join(" "),
        style: { gap: "14px", ...style },
        ...rest,
      },
      React.createElement(
        "button",
        {
          type: "button",
          className: "medo-pag__btn medo-pag__btn--wide",
          disabled: atStart,
          onClick: () => go(current - 1),
        },
        IconCmp ? React.createElement(IconCmp, { name: "chevron_left", size: 20 }) : null,
        "Zurück"
      ),
      React.createElement(
        "span",
        { className: "medo-pag__info" },
        "Seite ",
        React.createElement("b", null, current),
        " von ",
        count
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: "medo-pag__btn medo-pag__btn--wide",
          disabled: atEnd,
          onClick: () => go(current + 1),
        },
        "Weiter",
        IconCmp ? React.createElement(IconCmp, { name: "chevron_right", size: 20 }) : null
      )
    );
  }

  if (variant === "bar") {
    const from = totalItems ? (current - 1) * pageSize + 1 : null;
    const to = totalItems ? Math.min(current * pageSize, totalItems) : null;
    return React.createElement(
      "div",
      { className: ["medo-pag__bar", "medo-pag__bar--" + size, className].filter(Boolean).join(" "), style, ...rest },
      React.createElement(
        "div",
        { className: "medo-pag__side" },
        onPageSizeChange
          ? [
              React.createElement("span", { key: "l", className: "medo-pag__label" }, "Einträge pro Seite"),
              React.createElement(
                "select",
                {
                  key: "s",
                  className: "medo-pag__select",
                  value: pageSize,
                  "aria-label": "Einträge pro Seite",
                  onChange: (e) => onPageSizeChange(Number(e.target.value)),
                },
                pageSizeOptions.map((o) => React.createElement("option", { key: o, value: o }, o))
              ),
            ]
          : null,
        totalItems
          ? React.createElement(
              "span",
              { className: "medo-pag__info", style: { marginLeft: onPageSizeChange ? "8px" : 0 } },
              from + "–" + to + " von " + totalItems
            )
          : null
      ),
      React.createElement(
        "div",
        { className: "medo-pag__side" },
        nav(true),
        showJump
          ? React.createElement(
              "div",
              { className: "medo-pag__side", style: { marginLeft: "8px" } },
              React.createElement("span", { className: "medo-pag__label" }, "Gehe zu"),
              React.createElement("input", {
                className: "medo-pag__jump",
                type: "text",
                inputMode: "numeric",
                "aria-label": "Zu Seite springen",
                value: jump,
                onChange: (e) => setJump(e.target.value.replace(/[^0-9]/g, "")),
                onKeyDown: (e) => {
                  if (e.key !== "Enter" || !jump) return;
                  go(Number(jump));
                  setJump("");
                },
              })
            )
          : null
      )
    );
  }

  return nav(false);
};

export { Pagination };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Pagination = Pagination;
