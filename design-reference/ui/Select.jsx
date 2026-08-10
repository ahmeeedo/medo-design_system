window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Select
   Auswahl aus einer bekannten, geschlossenen Liste.

   Zwei Betriebsarten:
   - Standard: eigene Liste, damit das Aufklappmenü im medo-Stil erscheint (Panel wie Dropdown:
     Radius lg, Rahmen border-subtle, shadow-lg, Auswahl in primary-50). Vollständig per Tastatur
     bedienbar, mit role="listbox" und aria-activedescendant.
   - `native`: das Betriebssystem-Auswahlrad. Richtig für sehr lange Listen und für Formulare,
     die ohne JavaScript funktionieren müssen. Das Aufklappmenü ist dann nicht gestaltbar. */

const MEDO_SELECT_CSS = `
.medo-select{ position: relative; }
.medo-select__trigger{
  width: 100%;
  appearance: none;
  border: none;
  background: transparent;
  font: inherit;
  color: inherit;
  padding: 0;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
}
.medo-select__value{ flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.medo-select__value--placeholder{ color: var(--medo-input-placeholder); }
.medo-select__chips{ display: flex; align-items: center; gap: 7px; flex-wrap: wrap; flex: 1; min-width: 0; }

/* Mehrfachauswahl bleibt immer einzeilig: was nicht mehr passt, zählt der "+N"-Zähler. */
.medo-select__chips--single{ flex-wrap: nowrap; overflow: hidden; position: relative; }
.medo-select__chips--single .medo-select__chip{ flex: 0 0 auto; }
.medo-select__chips--single .medo-select__chip--clip{ min-width: 0; flex: 0 1 auto; }
.medo-select__chips--single .medo-select__chip--clip .medo-select__chiplabel{ overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.medo-select__more{
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: var(--medo-radius-full);
  background: var(--medo-action-neutral);
  color: var(--medo-text-subtle);
  font-size: var(--medo-text-sm);
  white-space: nowrap;
}
.medo-select__mirror{
  position: absolute;
  left: 0; top: 0;
  visibility: hidden;
  pointer-events: none;
  white-space: nowrap;
  display: flex;
  gap: 7px;
}
.medo-select__chip{
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 6px 0 11px;
  background: var(--medo-primary-50);
  border: var(--medo-border-thin) solid var(--medo-primary-200);
  border-radius: var(--medo-radius-full);
  font-size: var(--medo-text-sm);
  color: var(--medo-primary-800);
  white-space: nowrap;
}
.medo-select__chipx{ flex: 0 0 auto; display: inline-flex; color: var(--medo-action); cursor: pointer; border-radius: var(--medo-radius-full); }
.medo-select__chipx:hover{ background: var(--medo-primary-200); }
.medo-select__chevron{ transition: transform 160ms ease-out; }
.medo-select__chevron--open{ transform: rotate(180deg); }

.medo-select__panel{
  box-sizing: border-box;
  position: absolute;
  left: 0; right: 0;
  z-index: 50;
  margin-top: 6px;
  background: var(--medo-overlay);
  border: var(--medo-border-thin) solid var(--medo-border-subtle);
  border-radius: var(--medo-radius-lg);
  box-shadow: var(--medo-shadow-lg);
  padding: 6px;
  max-height: 264px;
  overflow-y: auto;
}
.medo-select__panel--up{ bottom: 100%; margin-top: 0; margin-bottom: 6px; }

.medo-select__group{
  font-family: var(--medo-font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--medo-color-stone-500);
  padding: 8px 10px 4px;
}

.medo-select__opt{
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  padding: 5px 10px;
  border-radius: var(--medo-radius-md);
  cursor: pointer;
  font-size: var(--medo-text-sm);
  color: var(--medo-text);
  user-select: none;
}
.medo-select__opt--active{ background: var(--medo-state-hover); }
.medo-select__opt--selected{ background: var(--medo-state-selected); color: var(--medo-text); font-weight: 500; }
.medo-select__opt--selected.medo-select__opt--active{ background: var(--medo-color-teal-200); }
.medo-select__opt--disabled{ color: var(--medo-text-disabled); cursor: not-allowed; }
.medo-select__opt-label{ flex: 1; min-width: 0; }
.medo-select__empty{ padding: 12px 10px; font-size: var(--medo-text-sm); color: var(--medo-text-muted); }

.medo-select__nativectl{
  appearance: none;
  -webkit-appearance: none;
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font: inherit;
  color: inherit;
  padding: 0;
  cursor: pointer;
}
.medo-select__nativectl:disabled{ cursor: not-allowed; }
.medo-select__nativectl--placeholder{ color: var(--medo-input-placeholder); }
`;

function medoFlattenOptions(options) {
  const flat = [];
  (options || []).forEach((o) => {
    if (o.options) {
      flat.push({ group: o.label });
      o.options.forEach((c) => flat.push(c));
    } else {
      flat.push(o);
    }
  });
  return flat;
}

const Select = ({
  label,
  id,
  value,
  defaultValue,
  placeholder = "Bitte wählen",
  options = [],
  size = "md",
  required = false,
  optional = false,
  disabled = false,
  hint,
  error,
  success,
  icon,
  onChange,
  fullWidth = false,
  name,
  native = false,
  multiple = false,
  multipleDisplay = "chips",
  maxChips = 0,
  defaultOpen = false,
  className,
  style,
  children,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-field-css", window.MedoUI.MEDO_FIELD_CSS);
  window.MedoUI.injectCss("medo-select-css", MEDO_SELECT_CSS);

  const [open, setOpen] = React.useState(defaultOpen);
  const [focused, setFocused] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [dropUp, setDropUp] = React.useState(false);
  const [internal, setInternal] = React.useState(
    defaultValue !== undefined ? defaultValue : multiple ? [] : ""
  );

  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const wrapRef = React.useRef(null);
  const panelRef = React.useRef(null);

  const generatedId = React.useMemo(
    () => "medo-select-" + Math.random().toString(36).slice(2, 8),
    []
  );
  const fieldId = id || generatedId;

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const FieldCmp = window.MedoUI && window.MedoUI.Field;
  const iconSize = size === "sm" ? 18 : size === "lg" ? 22 : 20;

  const flat = React.useMemo(() => medoFlattenOptions(options), [options]);
  const selectable = flat.filter((o) => !o.group && !o.disabled);
  const selected = flat.find((o) => !o.group && o.value === current);
  const many = multiple ? (Array.isArray(current) ? current : []) : [];
  const isOn = (v) => (multiple ? many.indexOf(v) !== -1 : v === current);
  const chosen = multiple ? flat.filter((o) => !o.group && isOn(o.value)) : [];

  /* Einzeilige Chips: messen, wie viele in eine Zeile passen. Der Spiegel-Container hält alle
     Chips in voller Breite (unsichtbar), damit die Breiten auch dann bekannt bleiben, wenn im
     sichtbaren Feld schon gekürzt wird. */
  const chipsRef = React.useRef(null);
  const mirrorRef = React.useRef(null);
  const [visibleChips, setVisibleChips] = React.useState(chosen.length);
  const chipKey = chosen.map((o) => o.value).join("\u0000");

  React.useLayoutEffect(() => {
    if (!multiple || multipleDisplay === "count") return;
    const cont = chipsRef.current;
    const mirror = mirrorRef.current;
    if (!cont || !mirror) return;
    const GAP = 7;
    const measure = () => {
      const kids = Array.prototype.slice.call(mirror.children);
      const badge = kids.pop();
      const widths = kids.map((k) => k.getBoundingClientRect().width);
      const badgeW = badge ? badge.getBoundingClientRect().width : 34;
      const avail = cont.clientWidth;
      const cap = maxChips > 0 ? Math.min(maxChips, widths.length) : widths.length;
      let used = 0;
      let n = 0;
      for (let i = 0; i < cap; i++) {
        const need = used + (i ? GAP : 0) + widths[i];
        if (need > avail) break;
        used = need;
        n++;
      }
      /* Platz für den Zähler freiräumen, falls etwas übrig bleibt */
      while (n < widths.length && n > 1 && used + GAP + badgeW > avail) {
        used -= widths[n - 1] + GAP;
        n--;
      }
      setVisibleChips(Math.max(widths.length ? 1 : 0, n));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(cont);
    return () => ro.disconnect();
  }, [multiple, multipleDisplay, maxChips, chipKey, size]);

  const toggle = (val) => {
    const next = many.indexOf(val) === -1 ? many.concat([val]) : many.filter((v) => v !== val);
    if (!isControlled) setInternal(next);
    if (onChange) onChange({ target: { value: next, name } });
  };

  const commit = (val) => {
    if (!isControlled) setInternal(val);
    if (onChange) onChange({ target: { value: val, name } });
  };

  /* Klick außerhalb schließt */
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  /* Nach unten oder oben aufklappen, je nach Platz */
  React.useEffect(() => {
    if (!open || !wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    setDropUp(window.innerHeight - r.bottom < 280 && r.top > 280);
  }, [open]);

  /* Aktiven Eintrag in Sicht halten */
  React.useEffect(() => {
    if (!open || !panelRef.current || activeIndex < 0) return;
    const el = panelRef.current.querySelector('[data-idx="' + activeIndex + '"]');
    if (!el) return;
    const p = panelRef.current;
    if (el.offsetTop < p.scrollTop) p.scrollTop = el.offsetTop - 6;
    else if (el.offsetTop + el.offsetHeight > p.scrollTop + p.clientHeight)
      p.scrollTop = el.offsetTop + el.offsetHeight - p.clientHeight + 6;
  }, [open, activeIndex]);

  const openPanel = () => {
    const i = selected ? flat.indexOf(selected) : flat.findIndex((o) => !o.group && !o.disabled);
    setActiveIndex(i);
    setOpen(true);
  };

  const step = (dir) => {
    let i = activeIndex;
    for (let n = 0; n < flat.length; n++) {
      i += dir;
      if (i < 0) i = flat.length - 1;
      if (i >= flat.length) i = 0;
      const o = flat[i];
      if (o && !o.group && !o.disabled) break;
    }
    setActiveIndex(i);
  };

  const onKeyDown = (e) => {
    if (disabled) return;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openPanel();
      }
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); step(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); step(-1); }
    else if (e.key === "Home") { e.preventDefault(); setActiveIndex(flat.findIndex((o) => !o.group && !o.disabled)); }
    else if (e.key === "End") {
      e.preventDefault();
      for (let i = flat.length - 1; i >= 0; i--) if (!flat[i].group && !flat[i].disabled) { setActiveIndex(i); break; }
    }
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const o = flat[activeIndex];
      if (o && !o.group && !o.disabled) {
        if (multiple) toggle(o.value);
        else { commit(o.value); setOpen(false); }
      }
    }
    else if (e.key === "Escape" || e.key === "Tab") setOpen(false);
    else if (e.key.length === 1) {
      const q = e.key.toLowerCase();
      const hit = selectable.find((o) => String(o.label).toLowerCase().startsWith(q));
      if (hit) setActiveIndex(flat.indexOf(hit));
    }
  };

  const renderChip = (o, clip) =>
    React.createElement(
      "span",
      { key: o.value, className: "medo-select__chip" + (clip ? " medo-select__chip--clip" : "") },
      React.createElement("span", { className: "medo-select__chiplabel" }, o.label),
      React.createElement(
        "span",
        {
          className: "medo-select__chipx",
          role: "button",
          "aria-label": "Auswahl entfernen: " + o.label,
          onMouseDown: (e) => e.preventDefault(),
          onClick: (e) => { e.stopPropagation(); toggle(o.value); },
        },
        IconCmp ? React.createElement(IconCmp, { name: "close", size: 16 }) : null
      )
    );

  const boxClasses = [
    "medo-field__box",
    "medo-field__box--" + size,
    (focused || open) && !disabled ? "medo-field__box--focus" : null,
    error ? "medo-field__box--error" : null,
    success && !error ? "medo-field__box--success" : null,
    disabled ? "medo-field__box--disabled" : null,
    multiple ? "medo-select__box--multi" : null,
  ]
    .filter(Boolean)
    .join(" ");

  const leadIcon =
    icon && IconCmp
      ? React.createElement(IconCmp, { name: icon, size: iconSize, color: "var(--medo-icon-muted)" })
      : null;

  /* ---------- native Betriebsart ---------- */
  if (native) {
    const renderedOptions = children
      ? children
      : (options || []).map((o, i) =>
          o.options
            ? React.createElement(
                "optgroup",
                { key: o.label || i, label: o.label },
                o.options.map((c, j) =>
                  React.createElement(
                    "option",
                    { key: c.value != null ? c.value : j, value: c.value, disabled: c.disabled },
                    c.label
                  )
                )
              )
            : React.createElement(
                "option",
                { key: o.value != null ? o.value : i, value: o.value, disabled: o.disabled },
                o.label
              )
        );

    return React.createElement(
      FieldCmp,
      { label, htmlFor: fieldId, required, optional, hint, error, success, fullWidth, className, style },
      React.createElement(
        "div",
        { className: boxClasses },
        leadIcon,
        React.createElement(
          "select",
          {
            id: fieldId,
            name,
            className:
              "medo-select__nativectl" + (!current ? " medo-select__nativectl--placeholder" : ""),
            value: current,
            disabled,
            required,
            "aria-invalid": error ? "true" : undefined,
            onChange: (e) => commit(e.target.value),
            onFocus: () => setFocused(true),
            onBlur: () => setFocused(false),
            ...rest,
          },
          placeholder ? React.createElement("option", { value: "" }, placeholder) : null,
          renderedOptions
        ),
        IconCmp
          ? React.createElement(IconCmp, {
              name: "expand_more",
              size: iconSize,
              color: disabled ? "var(--medo-icon-disabled)" : "var(--medo-icon-muted)",
            })
          : null
      )
    );
  }

  /* ---------- gestaltete Betriebsart ---------- */
  const panel = open
    ? React.createElement(
        "div",
        {
          ref: panelRef,
          className: "medo-select__panel" + (dropUp ? " medo-select__panel--up" : ""),
          role: "listbox",
          id: fieldId + "-list",
          "aria-labelledby": fieldId,
        },
        flat.length === 0
          ? React.createElement("div", { className: "medo-select__empty" }, "Keine Einträge")
          : flat.map((o, i) =>
              o.group
                ? React.createElement("div", { key: "g" + i, className: "medo-select__group" }, o.group)
                : React.createElement(
                    "div",
                    {
                      key: o.value != null ? o.value : i,
                      "data-idx": i,
                      id: fieldId + "-opt-" + i,
                      role: "option",
                      "aria-selected": isOn(o.value) ? "true" : "false",
                      "aria-disabled": o.disabled ? "true" : undefined,
                      className: [
                        "medo-select__opt",
                        i === activeIndex ? "medo-select__opt--active" : null,
                        isOn(o.value) ? "medo-select__opt--selected" : null,
                        o.disabled ? "medo-select__opt--disabled" : null,
                      ]
                        .filter(Boolean)
                        .join(" "),
                      onMouseEnter: () => !o.disabled && setActiveIndex(i),
                      onMouseDown: (e) => e.preventDefault(),
                      onClick: () => {
                        if (o.disabled) return;
                        if (multiple) { toggle(o.value); return; }
                        commit(o.value);
                        setOpen(false);
                      },
                    },
                    o.icon && IconCmp
                      ? React.createElement(IconCmp, { name: o.icon, size: 18, color: "var(--medo-icon-muted)" })
                      : null,
                    React.createElement("span", { className: "medo-select__opt-label" }, o.label),
                    isOn(o.value) && IconCmp
                      ? React.createElement(IconCmp, { name: "check", size: 18, color: "var(--medo-action)" })
                      : null
                  )
            )
      )
    : null;

  return React.createElement(
    FieldCmp,
    { label, htmlFor: fieldId, required, optional, hint, error, success, fullWidth, className, style },
    React.createElement(
      "div",
      { className: "medo-select", ref: wrapRef },
      React.createElement(
        "div",
        { className: boxClasses },
        leadIcon,
        React.createElement(
          multiple ? "div" : "button",
          {
            id: fieldId,
            type: multiple ? undefined : "button",
            tabIndex: multiple ? (disabled ? -1 : 0) : undefined,
            className: "medo-select__trigger",
            disabled: multiple ? undefined : disabled,
            "aria-disabled": multiple && disabled ? "true" : undefined,
            role: "combobox",
            "aria-expanded": open ? "true" : "false",
            "aria-haspopup": "listbox",
            "aria-multiselectable": multiple ? "true" : undefined,
            "aria-controls": open ? fieldId + "-list" : undefined,
            "aria-activedescendant":
              open && activeIndex >= 0 ? fieldId + "-opt-" + activeIndex : undefined,
            "aria-invalid": error ? "true" : undefined,
            "aria-required": required ? "true" : undefined,
            onClick: () => (disabled ? null : open ? setOpen(false) : openPanel()),
            onKeyDown,
            onFocus: () => setFocused(true),
            onBlur: () => setFocused(false),
            ...rest,
          },
          multiple
            ? chosen.length
              ? multipleDisplay === "count"
                ? React.createElement("span", { className: "medo-select__value" }, chosen.length + " ausgewählt")
                : React.createElement(
                    "span",
                    { className: "medo-select__chips medo-select__chips--single", ref: chipsRef },
                    chosen.slice(0, visibleChips).map((o, i) =>
                      renderChip(o, i === visibleChips - 1 && visibleChips === 1)
                    ),
                    chosen.length > visibleChips
                      ? React.createElement(
                          "span",
                          { className: "medo-select__more", title: chosen.slice(visibleChips).map((o) => o.label).join(", ") },
                          "+" + (chosen.length - visibleChips)
                        )
                      : null,
                    React.createElement(
                      "span",
                      { className: "medo-select__mirror", "aria-hidden": "true", ref: mirrorRef },
                      chosen.map((o) =>
                        React.createElement(
                          "span",
                          { key: "m-" + o.value, className: "medo-select__chip" },
                          React.createElement("span", { className: "medo-select__chiplabel" }, o.label),
                          React.createElement(
                            "span",
                            { className: "medo-select__chipx" },
                            IconCmp ? React.createElement(IconCmp, { name: "close", size: 16 }) : null
                          )
                        )
                      ),
                      React.createElement("span", { className: "medo-select__more" }, "+" + chosen.length)
                    )
                  )
              : React.createElement(
                  "span",
                  { className: "medo-select__value medo-select__value--placeholder" },
                  placeholder
                )
            : React.createElement(
                "span",
                {
                  className:
                    "medo-select__value" + (selected ? "" : " medo-select__value--placeholder"),
                },
                selected ? selected.label : placeholder
              ),
          IconCmp
            ? React.createElement(IconCmp, {
                name: "expand_more",
                size: iconSize,
                className: "medo-select__chevron" + (open ? " medo-select__chevron--open" : ""),
                color: disabled ? "var(--medo-icon-disabled)" : "var(--medo-icon-muted)",
              })
            : null
        ),
        name
          ? React.createElement("input", { type: "hidden", name, value: current || "" })
          : null
      ),
      panel
    )
  );
};

export { Select };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Select = Select;
