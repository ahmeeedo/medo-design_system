window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · DataTable
   Tabelle mit Spaltenausrichtung, Sortierung, Auswahl, haftendem Kopf und Leerzustand.
   Zahlen stehen rechts und in DM Mono mit Tabellenziffern. Zeilen sind wahlweise anklickbar. */

const MEDO_DT_CSS = `
.medo-dt__wrap{
  box-sizing: border-box;
  font-family: var(--medo-font-sans);
  background: var(--medo-surface);
  border: var(--medo-border-thin) solid var(--medo-border);
  border-radius: var(--medo-radius-lg);
  overflow: hidden;
}
.medo-dt__bar{
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-bottom: var(--medo-border-thin) solid var(--medo-border-subtle);
}
.medo-dt__bar--bulk{ background: var(--medo-state-selected); }
.medo-dt__spacer{ flex: 1; }
.medo-dt__title{ font-size: var(--medo-text-sm); font-weight: 600; }
.medo-dt__sel{
  font-size: var(--medo-text-sm);
  color: var(--medo-primary-800);
}
.medo-dt__scroll{ overflow-x: auto; }
.medo-dt{
  width: 100%;
  border-collapse: collapse;
  font-size: var(--medo-text-sm);
}
.medo-dt th, .medo-dt td{
  text-align: left;
  padding: 12px 16px;
  border-bottom: var(--medo-border-thin) solid var(--medo-border-subtle);
  white-space: nowrap;
  vertical-align: middle;
}
.medo-dt thead th{ padding: 11px 16px; }
.medo-dt__sk{
  height: 13px;
  border-radius: 5px;
  background: var(--medo-surface-sunken);
  background-image: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.75) 50%, transparent 100%);
  background-size: 160px 100%;
  background-repeat: no-repeat;
  animation: medo-dt-sk 1.5s ease-in-out infinite;
}
@keyframes medo-dt-sk{ from{ background-position: -160px 0; } to{ background-position: calc(100% + 160px) 0; } }
.medo-dt--sm th, .medo-dt--sm td{ padding: 8px 14px; font-size: var(--medo-text-xs); }
.medo-dt thead th{
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--medo-surface-container);
  font-weight: 600;
  color: var(--medo-text-subtle);
  font-size: var(--medo-text-xs);
  letter-spacing: 0.01em;
}
.medo-dt tbody tr:last-child td{ border-bottom: none; }
.medo-dt tbody tr:hover{ background: var(--medo-state-hover); }
.medo-dt tbody tr[aria-selected="true"]{ background: var(--medo-state-selected); }
.medo-dt--clickable tbody tr{ cursor: pointer; }
.medo-dt td.medo-dt__cell--num, .medo-dt th.medo-dt__cell--num{ text-align: right; font-family: var(--medo-font-mono); font-variant-numeric: tabular-nums; }
.medo-dt td.medo-dt__cell--center, .medo-dt th.medo-dt__cell--center{ text-align: center; }
.medo-dt td.medo-dt__cell--muted{ color: var(--medo-text-muted); }
.medo-dt__sort{
  appearance: none;
  border: none;
  background: transparent;
  font: inherit;
  color: inherit;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  cursor: pointer;
  border-radius: var(--medo-radius-sm);
}
.medo-dt__sort:hover{ color: var(--medo-text); }
.medo-dt__sort:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-dt__sort .medo-dt__arrow{ opacity: 0; transition: opacity 120ms ease-out; }
.medo-dt__sort:hover .medo-dt__arrow{ opacity: 0.45; }
.medo-dt__sort--on{ color: var(--medo-text); }
.medo-dt__sort--on .medo-dt__arrow{ opacity: 1; color: var(--medo-action); }
.medo-dt__check{
  box-sizing: border-box;
  width: 18px; height: 18px;
  border: var(--medo-border-thin) solid var(--medo-input-border);
  border-radius: var(--medo-radius-sm);
  background: var(--medo-input-bg);
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--medo-color-white);
  cursor: pointer;
  flex: none;
}
.medo-dt__check--on{ background: var(--medo-action); border-color: var(--medo-action); }
.medo-dt__checkbtn{
  appearance: none; border: none; background: transparent; padding: 0;
  display: inline-flex; cursor: pointer; border-radius: var(--medo-radius-sm);
}
.medo-dt__checkbtn:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-dt__colcheck{ width: 44px; }
.medo-dt td.medo-dt__empty{
  padding: 32px 18px;
  text-align: center;
  font-size: var(--medo-text-sm);
  color: var(--medo-text-muted);
  line-height: 1.6;
  white-space: normal;
}
.medo-dt__foot{ padding: 10px 14px; border-top: var(--medo-border-thin) solid var(--medo-border-subtle); }
`;

const DataTable = ({
  columns = [],
  rows = [],
  rowKey = "id",
  size = "md",
  title,
  toolbar,
  sort,
  defaultSort,
  onSortChange,
  selectable = false,
  selected,
  onSelectionChange,
  onRowClick,
  loading = false,
  loadingRows = 5,
  bulkActions,
  emptyText = "Keine Einträge.",
  maxHeight,
  footer,
  ariaLabel,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-data-table-css", MEDO_DT_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const sortControlled = sort !== undefined;
  const [innerSort, setInnerSort] = React.useState(defaultSort || null);
  const activeSort = sortControlled ? sort : innerSort;

  const selControlled = selected !== undefined;
  const [innerSel, setInnerSel] = React.useState([]);
  const sel = selControlled ? selected || [] : innerSel;

  const keyOf = (r, i) => (typeof rowKey === "function" ? rowKey(r, i) : r[rowKey] !== undefined ? r[rowKey] : i);

  const setSel = (next) => {
    if (!selControlled) setInnerSel(next);
    if (onSelectionChange) onSelectionChange(next);
  };

  const toggleSort = (col) => {
    const dir = activeSort && activeSort.key === col.key && activeSort.direction === "asc" ? "desc" : "asc";
    const next = { key: col.key, direction: dir };
    if (!sortControlled) setInnerSort(next);
    if (onSortChange) onSortChange(next);
  };

  /* Ohne onSortChange sortiert die Komponente selbst — Zahlen numerisch, Text nach Locale. */
  const view = React.useMemo(() => {
    if (!activeSort || onSortChange) return rows;
    const col = columns.find((c) => c.key === activeSort.key);
    if (!col) return rows;
    const f = activeSort.direction === "asc" ? 1 : -1;
    return rows.slice().sort((a, b) => {
      const x = a[col.key], y = b[col.key];
      if (typeof x === "number" && typeof y === "number") return (x - y) * f;
      return String(x == null ? "" : x).localeCompare(String(y == null ? "" : y), "de") * f;
    });
  }, [rows, activeSort, columns, onSortChange]);

  const allKeys = view.map(keyOf);
  const allOn = allKeys.length > 0 && allKeys.every((k) => sel.indexOf(k) !== -1);

  const checkbox = (on, label, onClick) =>
    React.createElement(
      "button",
      { type: "button", className: "medo-dt__checkbtn", "aria-label": label, "aria-pressed": on ? "true" : "false", onClick },
      React.createElement(
        "span",
        { className: ["medo-dt__check", on ? "medo-dt__check--on" : null].filter(Boolean).join(" ") },
        on && IconCmp ? React.createElement(IconCmp, { name: "check", size: 15 }) : null
      )
    );

  const cellClass = (col) =>
    [
      col.align === "right" || col.numeric ? "medo-dt__cell--num" : null,
      col.align === "center" ? "medo-dt__cell--center" : null,
      col.muted ? "medo-dt__cell--muted" : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return React.createElement(
    "div",
    { className: ["medo-dt__wrap", className].filter(Boolean).join(" "), style, ...rest },
    title || toolbar || sel.length
      ? React.createElement(
          "div",
          {
            className: ["medo-dt__bar", sel.length ? "medo-dt__bar--bulk" : null]
              .filter(Boolean)
              .join(" "),
          },
          sel.length
            ? React.createElement("span", { className: "medo-dt__sel" }, sel.length + " ausgewählt")
            : title
            ? React.createElement("span", { className: "medo-dt__title" }, title)
            : null,
          React.createElement("span", { className: "medo-dt__spacer" }),
          sel.length ? bulkActions || null : toolbar || null
        )
      : null,
    React.createElement(
      "div",
      { className: "medo-dt__scroll", style: maxHeight ? { maxHeight, overflowY: "auto" } : undefined },
      React.createElement(
        "table",
        {
          className: ["medo-dt", "medo-dt--" + size, onRowClick ? "medo-dt--clickable" : null]
            .filter(Boolean)
            .join(" "),
          "aria-label": ariaLabel || (typeof title === "string" ? title : undefined),
        },
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            selectable
              ? React.createElement(
                  "th",
                  { className: "medo-dt__colcheck", scope: "col" },
                  checkbox(allOn, allOn ? "Auswahl aufheben" : "Alle auswählen", () =>
                    setSel(allOn ? [] : allKeys)
                  )
                )
              : null,
            columns.map((col) =>
              React.createElement(
                "th",
                {
                  key: col.key,
                  scope: "col",
                  className: cellClass(col),
                  style: col.width ? { width: col.width } : undefined,
                  "aria-sort":
                    activeSort && activeSort.key === col.key
                      ? activeSort.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : col.sortable
                      ? "none"
                      : undefined,
                },
                col.sortable
                  ? React.createElement(
                      "button",
                      {
                        type: "button",
                        className: [
                          "medo-dt__sort",
                          activeSort && activeSort.key === col.key ? "medo-dt__sort--on" : null,
                        ]
                          .filter(Boolean)
                          .join(" "),
                        onClick: () => toggleSort(col),
                      },
                      col.label,
                      IconCmp
                        ? React.createElement(IconCmp, {
                            name:
                              activeSort && activeSort.key === col.key && activeSort.direction === "desc"
                                ? "arrow_downward"
                                : "arrow_upward",
                            size: 16,
                            className: "medo-dt__arrow",
                          })
                        : null
                    )
                  : col.label
              )
            )
          )
        ),
        React.createElement(
          "tbody",
          null,
          loading
            ? Array.from({ length: loadingRows }).map((_, i) =>
                React.createElement(
                  "tr",
                  { key: "sk" + i },
                  selectable
                    ? React.createElement(
                        "td",
                        { className: "medo-dt__colcheck" },
                        React.createElement("div", { className: "medo-dt__sk", style: { width: "18px" } })
                      )
                    : null,
                  columns.map((col, ci) =>
                    React.createElement(
                      "td",
                      { key: col.key },
                      React.createElement("div", {
                        className: "medo-dt__sk",
                        style: { width: ci === 0 ? "60%" : ci % 2 ? "75%" : "45%" },
                      })
                    )
                  )
                )
              )
            : view.length
            ? view.map((r, i) => {
                const k = keyOf(r, i);
                const on = sel.indexOf(k) !== -1;
                return React.createElement(
                  "tr",
                  {
                    key: k,
                    "aria-selected": selectable ? (on ? "true" : "false") : undefined,
                    onClick: onRowClick ? () => onRowClick(r, i) : undefined,
                  },
                  selectable
                    ? React.createElement(
                        "td",
                        { className: "medo-dt__colcheck", onClick: (e) => e.stopPropagation() },
                        checkbox(on, on ? "Auswahl aufheben" : "Zeile auswählen", () =>
                          setSel(on ? sel.filter((x) => x !== k) : sel.concat([k]))
                        )
                      )
                    : null,
                  columns.map((col) =>
                    React.createElement(
                      "td",
                      { key: col.key, className: cellClass(col) },
                      col.render ? col.render(r[col.key], r, i) : r[col.key]
                    )
                  )
                );
              })
            : React.createElement(
                "tr",
                null,
                React.createElement(
                  "td",
                  { colSpan: columns.length + (selectable ? 1 : 0), className: "medo-dt__empty" },
                  emptyText
                )
              )
        )
      )
    ),
    footer ? React.createElement("div", { className: "medo-dt__foot" }, footer) : null
  );
};

export { DataTable };
window.MedoUI = window.MedoUI || {};
window.MedoUI.DataTable = DataTable;
