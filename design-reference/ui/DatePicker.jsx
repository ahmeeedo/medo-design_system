window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · DatePicker (+ TimeSlots)
   Nachbau von components/Date-picker.dc.html.
   Feld mit Kalender-Popover oder inline. Einzeldatum und Bereich, Monats-/Jahreswahl,
   Schnellauswahl, Zusammenfassung. Woche ab Montag, deutsche Monatsnamen.
   Klick wählt direkt — kein Bestätigen. Beim Bereich: erster Klick Start, zweiter Ende. */

const MEDO_DP_CSS = `
.medo-dp{ font-family: var(--medo-font-sans); position: relative; display: inline-block; }
.medo-dp--full{ display: block; width: 100%; }
.medo-dp__label{ display: block; font-size: var(--medo-text-sm); color: var(--medo-text); margin-bottom: 6px; }
.medo-dp__req{ color: var(--medo-error-solid); margin-left: 2px; }
.medo-dp__field{
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  min-width: 230px;
  width: 100%;
  padding: 0 14px;
  border: var(--medo-border-thin) solid var(--medo-input-border);
  border-radius: var(--medo-radius-md);
  background: var(--medo-input-bg);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--medo-text-sm);
  color: var(--medo-input-text);
  text-align: left;
}
.medo-dp__field:hover:not(:disabled){ border-color: var(--medo-input-border-hover); }
.medo-dp__field--on{ border-color: var(--medo-input-border-focus); box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-dp__field:focus-visible{ outline: none; border-color: var(--medo-input-border-focus); box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-dp--error .medo-dp__field{ border-color: var(--medo-input-border-error); }
.medo-dp--error .medo-dp__field:focus-visible{ box-shadow: 0 0 0 3px var(--medo-focus-ring-danger); }
.medo-dp__field:disabled{ background: var(--medo-input-bg-disabled); border-color: var(--medo-border-disabled); color: var(--medo-text-disabled); cursor: not-allowed; }
.medo-dp__value{ flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.medo-dp__value--empty{ color: var(--medo-input-placeholder); }
.medo-dp__clear{ border-radius: 6px; padding: 1px; cursor: pointer; color: var(--medo-icon-muted); display: inline-flex; }
.medo-dp__clear:hover{ background: var(--medo-state-hover); }
.medo-dp__helper{ font-size: var(--medo-text-xs); color: var(--medo-text-muted); margin-top: 6px; }
.medo-dp__err{ display: flex; align-items: center; gap: 5px; font-size: var(--medo-text-xs); color: var(--medo-error-text); margin-top: 6px; }

.medo-dp__cal{
  box-sizing: border-box;
  width: 300px;
  padding: 16px;
  background: var(--medo-surface);
  border: var(--medo-border-thin) solid var(--medo-border-subtle);
  border-radius: var(--medo-radius-lg);
  box-shadow: var(--medo-shadow-xl);
}
.medo-dp__cal--inline{ box-shadow: none; }
.medo-dp__cal--pop{ position: absolute; top: calc(100% + 8px); left: 0; z-index: 60; }
.medo-dp__head{ display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.medo-dp__nav{
  box-sizing: border-box;
  width: 34px; height: 34px;
  border-radius: var(--medo-radius-md);
  border: none;
  background: transparent;
  cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--medo-icon);
}
.medo-dp__nav:hover{ background: var(--medo-state-hover); }
.medo-dp__nav:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-dp__monthbtn{
  display: inline-flex; align-items: center; gap: 4px;
  border: none; background: transparent;
  font-family: inherit; font-size: var(--medo-text-sm); font-weight: 400;
  color: var(--medo-text);
  cursor: pointer;
  padding: 5px 8px;
  border-radius: var(--medo-radius-md);
}
.medo-dp__monthbtn:hover{ background: var(--medo-state-hover); }
.medo-dp__monthbtn:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-dp__year{ font-size: var(--medo-text-sm); font-weight: 700; font-family: var(--medo-font-mono); }
.medo-dp__months{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.medo-dp__mo{
  height: 38px;
  border: none;
  background: transparent;
  border-radius: var(--medo-radius-md);
  font-family: inherit;
  font-size: var(--medo-text-xs);
  font-weight: 500;
  color: var(--medo-text);
  cursor: pointer;
}
.medo-dp__mo:hover:not(.medo-dp__mo--on){ background: var(--medo-state-hover); }
.medo-dp__mo--on{ background: var(--medo-action); color: var(--medo-action-text); }
.medo-dp__mo:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-dp__grid{ display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.medo-dp__dow{
  text-align: center;
  font-family: var(--medo-font-mono);
  font-size: 11px;
  color: var(--medo-text-muted);
  padding: 6px 0;
}
.medo-dp__day{
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: var(--medo-text-sm);
  color: var(--medo-text);
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: var(--medo-radius-md);
}
.medo-dp__day:hover:not(:disabled):not(.medo-dp__day--sel){ background: var(--medo-state-hover); }
.medo-dp__day:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); z-index: 2; }
.medo-dp__day:disabled{ color: var(--medo-text-disabled); cursor: not-allowed; }
.medo-dp__day--out{ color: var(--medo-color-stone-400); }
.medo-dp__day--today{ font-weight: 700; box-shadow: inset 0 0 0 var(--medo-border-thin) #b7d8d3; }
.medo-dp__day--sel{ background: var(--medo-action); color: var(--medo-action-text); font-weight: 600; }
.medo-dp__day--inrange{ background: #e2efed; border-radius: 0; }
.medo-dp__day--rstart{ background: var(--medo-action); color: var(--medo-action-text); font-weight: 600; border-radius: 8px 0 0 8px; }
.medo-dp__day--rend{ background: var(--medo-action); color: var(--medo-action-text); font-weight: 600; border-radius: 0 8px 8px 0; }

.medo-dp__side{ display: flex; flex-direction: column; gap: 10px; min-width: 150px; }
.medo-dp__sidelbl{
  font-family: var(--medo-font-mono);
  font-size: 11px;
  color: var(--medo-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 2px;
}
.medo-dp__chip{
  height: 30px;
  padding: 0 12px;
  border-radius: var(--medo-radius-full);
  border: var(--medo-border-thin) solid var(--medo-border);
  background: var(--medo-surface);
  font-family: inherit;
  font-size: var(--medo-text-xs);
  font-weight: 400;
  color: var(--medo-text-subtle);
  cursor: pointer;
  text-align: left;
}
.medo-dp__chip:hover{ background: #f2f9f8; border-color: #9fd0c8; }
.medo-dp__chip:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-dp__reset{
  height: 30px;
  padding: 0 12px;
  border-radius: var(--medo-radius-full);
  border: var(--medo-border-thin) solid #e3c4bf;
  background: var(--medo-surface);
  font-family: inherit;
  font-size: var(--medo-text-xs);
  font-weight: 400;
  color: var(--medo-error-solid);
  cursor: pointer;
  text-align: left;
}
.medo-dp__reset:hover{ background: #fbecea; border-color: #d9a9a2; }
.medo-dp__sum{
  padding: 12px 14px;
  border-radius: 10px;
  background: var(--medo-surface-container);
  border: var(--medo-border-thin) solid var(--medo-border-subtle);
}
.medo-dp__sumval{ font-size: var(--medo-text-base); font-weight: 700; line-height: 1.35; }
.medo-dp__sumsub{ font-size: var(--medo-text-xs); color: var(--medo-text-muted); margin-top: 3px; }

.medo-dp__slots{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.medo-dp__slot{
  height: 36px;
  border-radius: var(--medo-radius-md);
  border: var(--medo-border-thin) solid var(--medo-border-strong);
  background: var(--medo-surface);
  color: var(--medo-text);
  font-family: var(--medo-font-mono);
  font-size: var(--medo-text-xs);
  cursor: pointer;
}
.medo-dp__slot:hover:not(:disabled){ background: #f2f9f8; border-color: #9fd0c8; }
.medo-dp__slot:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); z-index: 2; }
.medo-dp__slot:disabled{
  color: var(--medo-text-disabled);
  background: var(--medo-surface-container);
  border-color: var(--medo-border-subtle);
  cursor: not-allowed;
  text-decoration: line-through;
}
.medo-dp__slot--on{ background: var(--medo-action); border-color: var(--medo-action); color: var(--medo-action-text); font-weight: 600; }
.medo-dp__slot--on:hover:not(:disabled){ background: var(--medo-action-hover); border-color: var(--medo-action-hover); }
`;

const MEDO_MONTHS = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const MEDO_MONTHS_SHORT = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
const MEDO_WEEKDAYS = ["Mo","Di","Mi","Do","Fr","Sa","So"];

const medoFmt = (d) =>
  d ? String(d.getDate()).padStart(2, "0") + "." + String(d.getMonth() + 1).padStart(2, "0") + "." + d.getFullYear() : "";
const medoSameDay = (a, b) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const medoStart = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const medoDays = (a, b) => Math.round((medoStart(b) - medoStart(a)) / 86400000) + 1;

const DatePicker = ({
  mode = "single",
  value,
  defaultValue,
  onChange,
  label,
  helper,
  error,
  placeholder = "Datum wählen",
  min,
  max,
  presets,
  inline = false,
  clearable = true,
  required = false,
  disabled = false,
  fullWidth = false,
  summaryLabel = "Ausgewählt",
  id,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-date-picker-css", MEDO_DP_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const range = mode === "range";
  const uid = React.useMemo(() => id || "medo-dp-" + Math.random().toString(36).slice(2, 8), [id]);
  const controlled = value !== undefined;
  const empty = range ? { start: null, end: null } : null;
  const [inner, setInner] = React.useState(defaultValue !== undefined ? defaultValue : empty);
  const sel = controlled ? value : inner;

  const anchor = range ? (sel && sel.start) || new Date() : sel || new Date();
  const [view, setView] = React.useState(anchor);
  const [open, setOpen] = React.useState(false);
  const [pick, setPick] = React.useState(false);
  const [pickYear, setPickYear] = React.useState(anchor.getFullYear());
  const rootRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const away = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, [open]);

  const emit = (next) => {
    if (!controlled) setInner(next);
    if (onChange) onChange(next);
  };

  const blocked = (d) => (min && medoStart(d) < medoStart(min)) || (max && medoStart(d) > medoStart(max));

  const choose = (d) => {
    if (!range) { emit(new Date(d)); setOpen(false); return; }
    const cur = sel || empty;
    if (!cur.start || (cur.start && cur.end)) emit({ start: new Date(d), end: null });
    else if (d < cur.start) emit({ start: new Date(d), end: cur.start });
    else emit({ start: cur.start, end: new Date(d) });
  };

  const today = new Date();
  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const gridStart = new Date(first);
  gridStart.setDate(1 - ((first.getDay() + 6) % 7));
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });

  const onDayKey = (e) => {
    const map = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (map[e.key] === undefined) return;
    e.preventDefault();
    const btns = Array.prototype.slice.call(e.currentTarget.parentNode.querySelectorAll("button"));
    const i = btns.indexOf(e.currentTarget);
    const next = btns[i + map[e.key]];
    if (next) next.focus();
  };

  const dayClass = (d) => {
    const out = d.getMonth() !== view.getMonth();
    const list = ["medo-dp__day"];
    if (out) list.push("medo-dp__day--out");
    if (range) {
      const s = sel && sel.start, e2 = sel && sel.end;
      if (medoSameDay(d, s) && e2) list.push("medo-dp__day--rstart");
      else if (medoSameDay(d, e2)) list.push("medo-dp__day--rend");
      else if (medoSameDay(d, s)) list.push("medo-dp__day--sel");
      else if (s && e2 && d > s && d < e2) list.push("medo-dp__day--inrange");
      else if (medoSameDay(d, today)) list.push("medo-dp__day--today");
    } else {
      if (medoSameDay(d, sel)) list.push("medo-dp__day--sel");
      else if (medoSameDay(d, today)) list.push("medo-dp__day--today");
    }
    return list.join(" ");
  };

  const calendar = React.createElement(
    "div",
    {
      className: ["medo-dp__cal", inline ? "medo-dp__cal--inline" : "medo-dp__cal--pop"].join(" "),
      role: inline ? undefined : "dialog",
      "aria-label": "Kalender",
    },
    React.createElement(
      "div",
      { className: "medo-dp__head" },
      React.createElement(
        "button",
        { type: "button", className: "medo-dp__nav", "aria-label": "Vorheriger Monat",
          onClick: () => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1)) },
        IconCmp ? React.createElement(IconCmp, { name: "chevron_left", size: 20 }) : null
      ),
      React.createElement(
        "button",
        {
          type: "button", className: "medo-dp__monthbtn", "aria-label": "Monat und Jahr wählen",
          "aria-expanded": pick ? "true" : "false",
          onClick: () => { setPickYear(view.getFullYear()); setPick(!pick); },
        },
        MEDO_MONTHS[view.getMonth()] + " " + view.getFullYear(),
        IconCmp ? React.createElement(IconCmp, { name: pick ? "expand_less" : "expand_more", size: 18 }) : null
      ),
      React.createElement(
        "button",
        { type: "button", className: "medo-dp__nav", "aria-label": "Nächster Monat",
          onClick: () => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1)) },
        IconCmp ? React.createElement(IconCmp, { name: "chevron_right", size: 20 }) : null
      )
    ),
    pick
      ? React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            { style: { display: "flex", alignItems: "center", justifyContent: "space-between", margin: "2px 0 10px" } },
            React.createElement(
              "button",
              { type: "button", className: "medo-dp__nav", "aria-label": "Vorheriges Jahr", onClick: () => setPickYear(pickYear - 1) },
              IconCmp ? React.createElement(IconCmp, { name: "chevron_left", size: 20 }) : null
            ),
            React.createElement("div", { className: "medo-dp__year" }, pickYear),
            React.createElement(
              "button",
              { type: "button", className: "medo-dp__nav", "aria-label": "Nächstes Jahr", onClick: () => setPickYear(pickYear + 1) },
              IconCmp ? React.createElement(IconCmp, { name: "chevron_right", size: 20 }) : null
            )
          ),
          React.createElement(
            "div",
            { className: "medo-dp__months" },
            MEDO_MONTHS_SHORT.map((m, i) =>
              React.createElement(
                "button",
                {
                  key: m,
                  type: "button",
                  className: [
                    "medo-dp__mo",
                    i === view.getMonth() && pickYear === view.getFullYear() ? "medo-dp__mo--on" : null,
                  ].filter(Boolean).join(" "),
                  onClick: () => { setView(new Date(pickYear, i, 1)); setPick(false); },
                },
                m
              )
            )
          )
        )
      : React.createElement(
          "div",
          { className: "medo-dp__grid" },
          MEDO_WEEKDAYS.map((w) =>
            React.createElement("div", { key: w, className: "medo-dp__dow", "aria-hidden": "true" }, w)
          ),
          cells.map((d, i) =>
            React.createElement(
              "button",
              {
                key: i,
                type: "button",
                className: dayClass(d),
                disabled: blocked(d),
                "aria-label": d.getDate() + ". " + MEDO_MONTHS[d.getMonth()] + " " + d.getFullYear(),
                "aria-pressed": range
                  ? medoSameDay(d, sel && sel.start) || medoSameDay(d, sel && sel.end) ? "true" : "false"
                  : medoSameDay(d, sel) ? "true" : "false",
                "aria-current": medoSameDay(d, today) ? "date" : undefined,
                onClick: () => choose(d),
                onKeyDown: onDayKey,
              },
              d.getDate()
            )
          )
        )
  );

  const hasSel = range ? !!(sel && sel.start) : !!sel;
  const fieldText = range
    ? sel && sel.start
      ? medoFmt(sel.start) + " – " + (sel.end ? medoFmt(sel.end) : "…")
      : placeholder
    : sel
    ? medoFmt(sel)
    : placeholder;

  const side =
    presets || range
      ? React.createElement(
          "div",
          { className: "medo-dp__side" },
          presets && presets.length
            ? [
                React.createElement("div", { key: "l", className: "medo-dp__sidelbl" }, "Schnellauswahl"),
                ...presets.map((p, i) =>
                  React.createElement(
                    "button",
                    { key: i, type: "button", className: "medo-dp__chip", onClick: () => emit(p.value()) },
                    p.label
                  )
                ),
              ]
            : null,
          hasSel && clearable
            ? React.createElement(
                "button",
                { type: "button", className: "medo-dp__reset", onClick: () => emit(empty) },
                "Zurücksetzen"
              )
            : null,
          range
            ? React.createElement(
                "div",
                { style: { marginTop: "16px" } },
                React.createElement("div", { className: "medo-dp__sidelbl" }, summaryLabel),
                React.createElement(
                  "div",
                  { className: "medo-dp__sum" },
                  React.createElement(
                    "div",
                    {
                      className: "medo-dp__sumval",
                      style: { color: hasSel ? "var(--medo-text)" : "var(--medo-text-muted)" },
                    },
                    sel && sel.start
                      ? medoFmt(sel.start) + (sel.end ? " – " + medoFmt(sel.end) : " – …")
                      : "Kein Zeitraum"
                  ),
                  sel && sel.start && sel.end
                    ? React.createElement(
                        "div",
                        { className: "medo-dp__sumsub" },
                        medoDays(sel.start, sel.end) + " Tage"
                      )
                    : null
                )
              )
            : null
        )
      : null;

  if (inline)
    return React.createElement(
      "div",
      {
        className: ["medo-dp", className].filter(Boolean).join(" "),
        style: { display: "flex", gap: "28px", flexWrap: "wrap", alignItems: "flex-start", ...style },
        ...rest,
      },
      calendar,
      side
    );

  return React.createElement(
    "div",
    {
      ref: rootRef,
      className: [
        "medo-dp",
        fullWidth ? "medo-dp--full" : null,
        error ? "medo-dp--error" : null,
        className,
      ].filter(Boolean).join(" "),
      style,
      ...rest,
    },
    label
      ? React.createElement(
          "label",
          { className: "medo-dp__label", htmlFor: uid },
          label,
          required ? React.createElement("span", { className: "medo-dp__req" }, "*") : null
        )
      : null,
    React.createElement(
      "button",
      {
        id: uid,
        type: "button",
        className: ["medo-dp__field", open ? "medo-dp__field--on" : null].filter(Boolean).join(" "),
        "aria-haspopup": "dialog",
        "aria-expanded": open ? "true" : "false",
        "aria-invalid": error ? "true" : undefined,
        "aria-describedby": error ? uid + "-err" : helper ? uid + "-help" : undefined,
        disabled,
        onClick: () => setOpen(!open),
      },
      IconCmp
        ? React.createElement(IconCmp, { name: "calendar_month", size: 19, color: "var(--medo-icon-muted)" })
        : null,
      React.createElement(
        "span",
        { className: ["medo-dp__value", hasSel ? null : "medo-dp__value--empty"].filter(Boolean).join(" ") },
        fieldText
      ),
      hasSel && clearable && !disabled
        ? React.createElement(
            "span",
            {
              className: "medo-dp__clear",
              role: "button",
              tabIndex: -1,
              "aria-label": "Datum zurücksetzen",
              onClick: (e) => { e.stopPropagation(); emit(empty); },
            },
            IconCmp ? React.createElement(IconCmp, { name: "close", size: 18 }) : null
          )
        : IconCmp
        ? React.createElement(IconCmp, { name: "expand_more", size: 19, color: "var(--medo-icon-muted)" })
        : null
    ),
    error
      ? React.createElement(
          "div",
          { className: "medo-dp__err", id: uid + "-err" },
          IconCmp ? React.createElement(IconCmp, { name: "error", size: 15 }) : null,
          React.createElement("span", null, error)
        )
      : helper
      ? React.createElement("div", { className: "medo-dp__helper", id: uid + "-help" }, helper)
      : null,
    open ? calendar : null
  );
};

/* Zeitfenster neben dem Kalender — Termin-Buchung. */
const TimeSlots = ({ slots = [], value, onChange, columns = 3, ariaLabel = "Uhrzeit", className, style, ...rest }) => {
  window.MedoUI.injectCss("medo-date-picker-css", MEDO_DP_CSS);
  return React.createElement(
    "div",
    {
      role: "group",
      "aria-label": ariaLabel,
      className: ["medo-dp__slots", className].filter(Boolean).join(" "),
      style: { gridTemplateColumns: "repeat(" + columns + ", 1fr)", ...style },
      ...rest,
    },
    slots.map((s) => {
      const item = typeof s === "string" ? { time: s } : s;
      return React.createElement(
        "button",
        {
          key: item.time,
          type: "button",
          className: ["medo-dp__slot", item.time === value ? "medo-dp__slot--on" : null].filter(Boolean).join(" "),
          "aria-pressed": item.time === value ? "true" : "false",
          disabled: !!item.disabled,
          onClick: () => onChange && onChange(item.time),
        },
        item.time
      );
    })
  );
};

export { DatePicker, TimeSlots };
window.MedoUI = window.MedoUI || {};
window.MedoUI.DatePicker = DatePicker;
window.MedoUI.TimeSlots = TimeSlots;
