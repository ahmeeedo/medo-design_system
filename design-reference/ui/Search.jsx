window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Search
   Sucht live während der Eingabe. Baut auf dem Feld-Gerüst aus Field.jsx auf:
   führende Lupe, Leeren-Schaltfläche, optionales Vorschlags-Panel mit letzten Suchen.
   Die Eingabe wird entprellt (debounce), damit nicht jeder Tastendruck eine Suche auslöst. */

const MEDO_SEARCH_CSS = `
.medo-search{ position: relative; }
/* Der Browser blendet bei type="search" eine eigene Leeren-Schaltfläche ein — die
   würde neben unserer stehen. */
.medo-search input[type="search"]{ appearance: none; -webkit-appearance: none; }
.medo-search input[type="search"]::-webkit-search-cancel-button,
.medo-search input[type="search"]::-webkit-search-decoration,
.medo-search input[type="search"]::-webkit-search-results-button,
.medo-search input[type="search"]::-webkit-search-results-decoration{ display: none; -webkit-appearance: none; }
.medo-search__spinner{
  width: 18px; height: 18px; flex: none;
  border-radius: var(--medo-radius-full);
  border: 2px solid var(--medo-action);
  border-top-color: transparent;
  animation: medo-spin 700ms linear infinite;
}
@keyframes medo-spin{ to{ transform: rotate(360deg); } }

.medo-search__box--compact{
  box-sizing: border-box;
  display: flex; align-items: center; gap: 8px;
  height: 34px; padding: 0 6px 0 11px;
  background: var(--medo-surface-container);
  border: var(--medo-border-thin) solid transparent;
  border-radius: var(--medo-radius-md);
  transition: background-color 140ms ease-out, border-color 140ms ease-out, box-shadow 140ms ease-out;
}
.medo-search__box--compact:hover{ background: var(--medo-surface-container-high); }
.medo-search__box--compact.medo-field__box--focus{
  background: var(--medo-surface);
  border-color: var(--medo-input-border-focus);
  box-shadow: 0 0 0 3px var(--medo-focus-ring);
}

.medo-search__panel{
  position: absolute;
  left: 0; right: 0;
  z-index: 50;
  margin-top: 6px;
  background: var(--medo-overlay);
  border: var(--medo-border-thin) solid var(--medo-border-subtle);
  border-radius: var(--medo-radius-lg);
  box-shadow: var(--medo-shadow-lg);
  padding: 6px;
  max-height: 300px;
  overflow-y: auto;
}
.medo-search__group{
  font-family: var(--medo-font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--medo-color-stone-500);
  padding: 8px 10px 4px;
}
.medo-search__opt{
  display: flex; align-items: center; gap: 11px;
  min-height: 38px; padding: 4px 10px;
  border-radius: var(--medo-radius-md);
  cursor: pointer;
  font-size: var(--medo-text-sm);
  color: var(--medo-text);
  user-select: none;
}
.medo-search__opt--active{ background: var(--medo-state-hover); }
.medo-search__opt-label{ flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.medo-search__opt-label strong{ font-weight: 600; }
.medo-search__drop{
  box-sizing: border-box;
  border: none; background: transparent;
  width: 24px; height: 24px; flex: none;
  border-radius: var(--medo-radius-sm);
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--medo-icon-muted);
}
.medo-search__drop:hover{ background: var(--medo-action-neutral-hover); color: var(--medo-text); }
.medo-search__empty{
  padding: 28px 20px; text-align: center;
}
.medo-search__empty-title{ font-size: var(--medo-text-sm); font-weight: 600; color: var(--medo-text); margin-top: 8px; }
.medo-search__empty-text{ font-size: var(--medo-text-xs); color: var(--medo-text-muted); margin-top: 3px; }
`;

const Search = ({
  label,
  id,
  value,
  defaultValue = "",
  placeholder = "Suchen …",
  size = "md",
  loading = false,
  disabled = false,
  compact = false,
  suggestions = [],
  recent = [],
  emptyText,
  showPanel = true,
  defaultOpen = false,
  debounce = 250,
  hint,
  error,
  fullWidth = false,
  name,
  onChange,
  onSearch,
  onSelect,
  onRemoveRecent,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-field-css", window.MedoUI.MEDO_FIELD_CSS);
  window.MedoUI.injectCss("medo-search-css", MEDO_SEARCH_CSS);

  const [focused, setFocused] = React.useState(false);
  const [open, setOpen] = React.useState(defaultOpen);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [internal, setInternal] = React.useState(defaultValue);

  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const wrapRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const timerRef = React.useRef(null);

  const generatedId = React.useMemo(
    () => "medo-search-" + Math.random().toString(36).slice(2, 8),
    []
  );
  const fieldId = id || generatedId;

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const FieldCmp = window.MedoUI && window.MedoUI.Field;
  const iconSize = size === "sm" ? 18 : size === "lg" ? 22 : 20;

  const norm = (list) =>
    (list || []).map((o) => (typeof o === "string" ? { label: o } : o));
  const recentItems = norm(recent);
  const suggestItems = norm(suggestions);

  const rows = [];
  if (recentItems.length && !current) {
    rows.push({ group: "Letzte Suchen" });
    recentItems.forEach((r) => rows.push({ ...r, kind: "recent" }));
  }
  if (suggestItems.length) {
    rows.push({ group: "Vorschläge" });
    suggestItems.forEach((s) => rows.push({ ...s, kind: "suggest" }));
  }
  const pickable = rows.filter((r) => !r.group);
  const isEmpty = !!current && suggestItems.length === 0;
  const panelVisible = showPanel && open && !disabled && (rows.length > 0 || isEmpty);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  const fire = (val) => {
    if (!onSearch) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch(val), debounce);
  };

  const setVal = (val) => {
    if (!isControlled) setInternal(val);
    if (onChange) onChange({ target: { value: val, name } });
  };

  const handleChange = (e) => {
    setVal(e.target.value);
    setActiveIndex(-1);
    setOpen(true);
    fire(e.target.value);
  };

  const choose = (item) => {
    setVal(item.label);
    setOpen(false);
    clearTimeout(timerRef.current);
    if (onSelect) onSelect(item);
    if (onSearch) onSearch(item.label);
  };

  const clear = () => {
    setVal("");
    setActiveIndex(-1);
    clearTimeout(timerRef.current);
    if (onSearch) onSearch("");
    if (inputRef.current) inputRef.current.focus();
  };

  const step = (dir) => {
    if (!pickable.length) return;
    let i = activeIndex + dir;
    if (i < 0) i = pickable.length - 1;
    if (i >= pickable.length) i = 0;
    setActiveIndex(i);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); step(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setOpen(true); step(-1); }
    else if (e.key === "Enter") {
      if (open && activeIndex >= 0 && pickable[activeIndex]) {
        e.preventDefault();
        choose(pickable[activeIndex]);
      } else {
        clearTimeout(timerRef.current);
        if (onSearch) onSearch(current);
        setOpen(false);
      }
    }
    else if (e.key === "Escape") { if (current) clear(); else setOpen(false); }
  };

  /* Treffer im Vorschlag hervorheben */
  const highlight = (text) => {
    const q = String(current || "");
    if (!q) return text;
    const i = String(text).toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return text;
    return [
      String(text).slice(0, i),
      React.createElement("strong", { key: "m" }, String(text).slice(i, i + q.length)),
      String(text).slice(i + q.length),
    ];
  };

  const boxClasses = compact
    ? ["medo-search__box--compact", focused ? "medo-field__box--focus" : null]
        .filter(Boolean)
        .join(" ")
    : [
        "medo-field__box",
        "medo-field__box--" + size,
        focused && !disabled ? "medo-field__box--focus" : null,
        error ? "medo-field__box--error" : null,
        disabled ? "medo-field__box--disabled" : null,
      ]
        .filter(Boolean)
        .join(" ");

  const box = React.createElement(
    "div",
    { className: boxClasses },
    loading
      ? React.createElement("span", { className: "medo-search__spinner", "aria-hidden": "true" })
      : IconCmp
      ? React.createElement(IconCmp, {
          name: "search",
          size: compact ? 18 : iconSize,
          color: "var(--medo-icon-muted)",
        })
      : null,
    React.createElement("input", {
      ref: inputRef,
      id: fieldId,
      name,
      type: "search",
      role: "combobox",
      className: "medo-field__control",
      value: current,
      placeholder,
      disabled,
      autoComplete: "off",
      "aria-expanded": panelVisible ? "true" : "false",
      "aria-controls": panelVisible ? fieldId + "-list" : undefined,
      "aria-autocomplete": "list",
      "aria-invalid": error ? "true" : undefined,
      style: compact ? { fontSize: "var(--medo-text-sm)" } : undefined,
      onChange: handleChange,
      onKeyDown,
      onFocus: () => { setFocused(true); setOpen(true); },
      onBlur: () => setFocused(false),
      ...rest,
    }),
    current && !disabled && IconCmp
      ? React.createElement(
          "button",
          {
            type: "button",
            className: compact ? "medo-search__drop" : "medo-field__iconbtn",
            "aria-label": "Suche leeren",
            onMouseDown: (e) => e.preventDefault(),
            onClick: clear,
          },
          React.createElement(IconCmp, { name: "close", size: compact ? 16 : 19 })
        )
      : null
  );

  const panel = panelVisible
    ? React.createElement(
        "div",
        { className: "medo-search__panel", id: fieldId + "-list", role: "listbox" },
        isEmpty
          ? React.createElement(
              "div",
              { className: "medo-search__empty" },
              IconCmp
                ? React.createElement(IconCmp, {
                    name: "search_off",
                    size: 32,
                    color: "var(--medo-icon-disabled)",
                  })
                : null,
              React.createElement("div", { className: "medo-search__empty-title" }, "Keine Treffer"),
              React.createElement(
                "div",
                { className: "medo-search__empty-text" },
                emptyText || "Für „" + current + "\u201c wurde nichts gefunden."
              )
            )
          : rows.map((r, i) => {
              if (r.group)
                return React.createElement(
                  "div",
                  { key: "g" + i, className: "medo-search__group" },
                  r.group
                );
              const pi = pickable.indexOf(r);
              return React.createElement(
                "div",
                {
                  key: r.kind + "-" + r.label,
                  role: "option",
                  "aria-selected": pi === activeIndex ? "true" : "false",
                  className:
                    "medo-search__opt" + (pi === activeIndex ? " medo-search__opt--active" : ""),
                  onMouseEnter: () => setActiveIndex(pi),
                  onMouseDown: (e) => e.preventDefault(),
                  onClick: () => choose(r),
                },
                IconCmp
                  ? React.createElement(IconCmp, {
                      name: r.icon || (r.kind === "recent" ? "history" : "search"),
                      size: 18,
                      color: "var(--medo-icon-muted)",
                    })
                  : null,
                React.createElement(
                  "span",
                  { className: "medo-search__opt-label" },
                  r.kind === "suggest" ? highlight(r.label) : r.label
                ),
                r.kind === "recent" && onRemoveRecent && IconCmp
                  ? React.createElement(
                      "button",
                      {
                        type: "button",
                        className: "medo-search__drop",
                        "aria-label": "Aus dem Verlauf entfernen",
                        onMouseDown: (e) => e.preventDefault(),
                        onClick: (e) => { e.stopPropagation(); onRemoveRecent(r); },
                      },
                      React.createElement(IconCmp, { name: "close", size: 16 })
                    )
                  : IconCmp
                  ? React.createElement(IconCmp, {
                      name: "north_west",
                      size: 17,
                      color: "var(--medo-icon-muted)",
                    })
                  : null
              );
            })
      )
    : null;

  const inner = React.createElement(
    "div",
    { className: "medo-search", ref: wrapRef, style: compact ? style : undefined },
    box,
    panel
  );

  if (compact && !label) return inner;

  return React.createElement(
    FieldCmp,
    { label, htmlFor: fieldId, hint, error, fullWidth, className, style },
    inner
  );
};

export { Search };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Search = Search;
