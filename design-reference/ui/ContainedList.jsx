window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · ContainedList
   Interaktive Zeilen in einer umrandeten Karte — navigieren, einfach oder mehrfach auswählen.
   Zeile: Auswahlfeld, Avatar oder Icon, Titel, Erklärung, Meta rechts, Chevron oder Aktion.
   Tastatur: Pfeile bewegen den Fokus, Enter/Leertaste löst aus, Home/End an die Ränder. */

const MEDO_CLIST_CSS = `
.medo-clist{
  box-sizing: border-box;
  font-family: var(--medo-font-sans);
  background: var(--medo-surface);
  border: var(--medo-border-thin) solid var(--medo-border);
  border-radius: var(--medo-radius-lg);
  overflow: hidden;
}
.medo-clist__head{
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--medo-space-sm);
  padding: 14px 16px 12px;
  border-bottom: var(--medo-border-thin) solid var(--medo-border-subtle);
}
.medo-clist__title{ font-size: var(--medo-text-sm); font-weight: 600; }
.medo-clist__count{
  font-family: var(--medo-font-mono);
  font-size: var(--medo-text-xs);
  color: var(--medo-text-muted);
}
.medo-clist__group{
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--medo-surface);
  padding: 8px 16px;
  font-family: var(--medo-font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--medo-text-muted);
  border-bottom: var(--medo-border-thin) solid var(--medo-border-subtle);
}
.medo-clist__row{
  box-sizing: border-box;
  width: 100%;
  appearance: none;
  border: none;
  background: var(--medo-surface);
  font-family: inherit;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  cursor: pointer;
  border-top: var(--medo-border-thin) solid var(--medo-border-subtle);
  transition: background-color 120ms ease-out;
}
.medo-clist__row:first-of-type{ border-top: none; }
.medo-clist__head + .medo-clist__row{ border-top: none; }
.medo-clist--sm .medo-clist__row{ padding: 10px 14px; gap: 12px; }
.medo-clist__row:hover:not(:disabled){ background: var(--medo-state-hover); }
.medo-clist__row:active:not(:disabled){ background: var(--medo-state-pressed); }
.medo-clist__row:focus-visible{ outline: none; box-shadow: inset 0 0 0 3px var(--medo-focus-ring); }
.medo-clist__row[aria-selected="true"]{ background: var(--medo-state-selected); }
.medo-clist__row[aria-selected="true"]:hover{ background: var(--medo-primary-200); }
.medo-clist__row:disabled{ cursor: not-allowed; }
.medo-clist__row:disabled .medo-clist__t,
.medo-clist__row:disabled .medo-clist__d,
.medo-clist__row:disabled .medo-clist__meta{ color: var(--medo-text-disabled); }

.medo-clist__box{
  box-sizing: border-box;
  flex: none;
  width: 20px; height: 20px;
  border: var(--medo-border-thin) solid var(--medo-input-border, var(--medo-color-stone-400));
  border-radius: var(--medo-radius-sm);
  background: var(--medo-input-bg, var(--medo-color-white));
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--medo-color-white);
}
.medo-clist__box--radio{ border-radius: var(--medo-radius-full); }
.medo-clist__row[aria-selected="true"] .medo-clist__box{
  background: var(--medo-action);
  border-color: var(--medo-action);
}
.medo-clist__row[aria-selected="true"] .medo-clist__box--radio{ background: var(--medo-input-bg, #fff); }
.medo-clist__dot{ width: 10px; height: 10px; border-radius: var(--medo-radius-full); background: var(--medo-action); }
.medo-clist__avatar{
  flex: none;
  width: 38px; height: 38px;
  border-radius: var(--medo-radius-full);
  background: var(--medo-primary-100);
  color: var(--medo-primary-800);
  display: inline-flex; align-items: center; justify-content: center;
  font-size: var(--medo-text-xs);
  font-weight: 600;
  letter-spacing: 0.02em;
}
.medo-clist__iconbox{
  flex: none;
  width: 40px; height: 40px;
  border-radius: 9px;
  background: var(--medo-surface-sunken);
  color: var(--medo-icon);
  display: inline-flex; align-items: center; justify-content: center;
}
.medo-clist--sm .medo-clist__iconbox{ width: 34px; height: 34px; }
.medo-clist__body{ flex: 1; min-width: 0; }
.medo-clist__t{ font-size: var(--medo-text-base); font-weight: 600; color: var(--medo-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.medo-clist--sm .medo-clist__t{ font-size: var(--medo-text-sm); }
.medo-clist__d{ font-size: var(--medo-text-sm); color: var(--medo-text-muted); margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.medo-clist__meta{
  flex: none;
  font-family: var(--medo-font-mono);
  font-size: var(--medo-text-xs);
  color: var(--medo-text-muted);
}
.medo-clist__chev{ flex: none; color: var(--medo-color-stone-500); }
.medo-clist__act{
  box-sizing: border-box;
  flex: none;
  width: 32px; height: 32px;
  appearance: none; border: none;
  border-radius: 7px;
  background: var(--medo-surface-sunken);
  color: var(--medo-icon);
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.medo-clist__act:hover{ background: var(--medo-action-neutral-hover, var(--medo-color-stone-200)); }
.medo-clist__act:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-clist__empty{
  padding: 26px 18px;
  text-align: center;
  font-size: var(--medo-text-sm);
  color: var(--medo-text-muted);
  line-height: 1.6;
}
`;

const ContainedList = ({
  items = [],
  groups,
  mode = "navigation",
  value,
  defaultValue,
  onChange,
  onSelect,
  onAction,
  size = "md",
  title,
  count,
  emptyText,
  ariaLabel,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-contained-list-css", MEDO_CLIST_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const multiple = mode === "multiple";
  const selectable = multiple || mode === "single";
  const controlled = value !== undefined;
  const fallback = defaultValue !== undefined ? defaultValue : multiple ? [] : null;
  const [inner, setInner] = React.useState(fallback);
  const current = controlled ? value : inner;
  const rootRef = React.useRef(null);
  const glyph = size === "sm" ? 20 : 22;

  const isSelected = (v) => (multiple ? (current || []).indexOf(v) !== -1 : current === v);

  const activate = (it) => {
    if (it.disabled) return;
    if (!selectable) {
      if (onSelect) onSelect(it.value, it);
      return;
    }
    let next;
    if (multiple) {
      const list = (current || []).slice();
      const i = list.indexOf(it.value);
      if (i === -1) list.push(it.value);
      else list.splice(i, 1);
      next = list;
    } else {
      next = it.value;
    }
    if (!controlled) setInner(next);
    if (onChange) onChange(next);
  };

  /* Pfeile bewegen nur den Fokus — ausgewählt wird erst mit Enter oder Leertaste. */
  const onKeyDown = (e) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const rows = Array.prototype.slice.call(
      rootRef.current.querySelectorAll(".medo-clist__row:not(:disabled)")
    );
    if (!rows.length) return;
    const i = rows.indexOf(document.activeElement);
    let next;
    if (e.key === "Home") next = rows[0];
    else if (e.key === "End") next = rows[rows.length - 1];
    else if (i === -1) next = rows[0];
    else next = rows[(i + (e.key === "ArrowDown" ? 1 : -1) + rows.length) % rows.length];
    next.focus();
  };

  const renderRow = (it, key) => {
    const selected = selectable ? isSelected(it.value) : undefined;
    return React.createElement(
      "button",
      {
        key,
        type: "button",
        role: selectable ? "option" : undefined,
        "aria-selected": selectable ? (selected ? "true" : "false") : undefined,
        disabled: !!it.disabled,
        onClick: () => activate(it),
        className: "medo-clist__row",
      },
      selectable
        ? React.createElement(
            "span",
            {
              className: ["medo-clist__box", multiple ? null : "medo-clist__box--radio"]
                .filter(Boolean)
                .join(" "),
              "aria-hidden": "true",
            },
            selected && multiple && IconCmp
              ? React.createElement(IconCmp, { name: "check", size: 16 })
              : selected && !multiple
              ? React.createElement("span", { className: "medo-clist__dot" })
              : null
          )
        : null,
      it.avatar
        ? React.createElement("span", { className: "medo-clist__avatar", "aria-hidden": "true" }, it.avatar)
        : it.icon && IconCmp
        ? React.createElement(
            "span",
            { className: "medo-clist__iconbox", "aria-hidden": "true" },
            React.createElement(IconCmp, { name: it.icon, size: size === "sm" ? 19 : 21 })
          )
        : null,
      React.createElement(
        "span",
        { className: "medo-clist__body" },
        React.createElement("span", { className: "medo-clist__t", style: { display: "block" } }, it.label),
        it.description
          ? React.createElement("span", { className: "medo-clist__d", style: { display: "block" } }, it.description)
          : null
      ),
      it.meta ? React.createElement("span", { className: "medo-clist__meta" }, it.meta) : null,
      it.action && IconCmp
        ? React.createElement(
            "span",
            {
              className: "medo-clist__act",
              role: "button",
              tabIndex: -1,
              "aria-label": it.actionLabel || "Weitere Aktionen",
              onClick: (e) => {
                e.stopPropagation();
                if (onAction) onAction(it.value, it);
              },
            },
            React.createElement(IconCmp, { name: it.action, size: 20 })
          )
        : !selectable && it.chevron !== false && IconCmp
        ? React.createElement(IconCmp, {
            name: "chevron_right",
            size: glyph,
            className: "medo-clist__chev",
          })
        : null
    );
  };

  const empty = !items.length && (!groups || !groups.length);

  return React.createElement(
    "div",
    {
      ref: rootRef,
      className: ["medo-clist", "medo-clist--" + size, className].filter(Boolean).join(" "),
      style,
      ...rest,
    },
    title || count !== undefined
      ? React.createElement(
          "div",
          { className: "medo-clist__head" },
          React.createElement("span", { className: "medo-clist__title" }, title),
          count !== undefined
            ? React.createElement("span", { className: "medo-clist__count" }, count)
            : null
        )
      : null,
    React.createElement(
      "div",
      {
        role: selectable ? "listbox" : "list",
        "aria-multiselectable": multiple ? "true" : undefined,
        "aria-label": ariaLabel,
        onKeyDown,
      },
      empty
        ? React.createElement("div", { className: "medo-clist__empty" }, emptyText)
        : groups && groups.length
        ? groups.map((g, gi) => [
            React.createElement("div", { key: "g" + gi, className: "medo-clist__group" }, g.label),
            (g.items || []).map((it, ii) => renderRow(it, "g" + gi + "-" + ii)),
          ])
        : items.map((it, i) => renderRow(it, i))
    )
  );
};

export { ContainedList };
window.MedoUI = window.MedoUI || {};
window.MedoUI.ContainedList = ContainedList;
