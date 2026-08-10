window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · NumberInput
   Erfasst Zahlen mit Stepper. Zwei Varianten: Chevrons rechts (Standard) und
   Minus/Plus links und rechts (Touch). Grenzwerte, Schrittweite, Halten zum Wiederholen,
   Pfeiltasten und Mausrad. Baut auf dem Feld-Gerüst aus Field.jsx auf. */

const MEDO_NUM_CSS = `
/* Der Feldkasten setzt gap:9px — zwischen den Steppern entstünde dadurch ein Streifen,
   der die untere Schaltfläche breiter wirken lässt. Hier also kein gap. */
.medo-num .medo-field__box{ padding-right: 0; overflow: hidden; gap: 0; }
.medo-num--plusminus .medo-field__box{ padding-left: 0; }
.medo-num__input{ font-variant-numeric: tabular-nums; }
.medo-num__unit{ color: var(--medo-text-muted); flex: none; padding-left: 6px; padding-right: 10px; }
.medo-num__unit--prefix{ padding-left: 0; padding-right: 6px; }

.medo-num__step{
  box-sizing: border-box;
  border: none;
  background: transparent;
  border-left: var(--medo-border-thin) solid var(--medo-border-subtle);
  align-self: stretch;
  flex: none;
  display: flex; align-items: center; justify-content: center;
  color: var(--medo-icon);
  cursor: pointer;
  padding: 0;
  transition: background-color 120ms ease-out;
}
.medo-num__step:hover:not(:disabled){ background: var(--medo-state-hover); }
.medo-num__step:active:not(:disabled){ background: var(--medo-state-pressed); }
.medo-num__step:focus-visible{ outline: none; box-shadow: inset 0 0 0 2px var(--medo-input-border-focus); }
.medo-num__step:disabled{ color: var(--medo-icon-disabled); cursor: not-allowed; }
.medo-num__step--first{ border-left: none; border-right: var(--medo-border-thin) solid var(--medo-border-subtle); }

/* Eine Breite je Größe — unabhängig von der Variante. */
.medo-num__step--sm{ width: 32px; }
.medo-num__step--md{ width: 36px; }
.medo-num__step--lg{ width: 42px; }
`;

const NumberInput = ({
  label,
  id,
  value,
  defaultValue,
  min,
  max,
  step = 1,
  precision,
  variant = "chevrons",
  size = "md",
  prefix,
  suffix,
  align,
  required = false,
  optional = false,
  disabled = false,
  readOnly = false,
  hint,
  error,
  success,
  fullWidth = false,
  width,
  name,
  onChange,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-field-css", window.MedoUI.MEDO_FIELD_CSS);
  window.MedoUI.injectCss("medo-num-css", MEDO_NUM_CSS);

  const [focused, setFocused] = React.useState(false);
  const [internal, setInternal] = React.useState(
    defaultValue !== undefined ? String(defaultValue) : ""
  );
  const isControlled = value !== undefined;
  const current = isControlled ? String(value) : internal;

  const inputRef = React.useRef(null);
  const holdRef = React.useRef(null);

  const generatedId = React.useMemo(
    () => "medo-num-" + Math.random().toString(36).slice(2, 8),
    []
  );
  const fieldId = id || generatedId;

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const FieldCmp = window.MedoUI && window.MedoUI.Field;
  const glyph = size === "sm" ? 18 : size === "lg" ? 22 : 20;
  const isPlusMinus = variant === "plusminus";

  const num = parseFloat(String(current).replace(",", "."));
  const hasNum = !isNaN(num);
  const atMax = max !== undefined && hasNum && num >= max;
  const atMin = min !== undefined && hasNum && num <= min;
  const locked = disabled || readOnly;

  const decimals =
    precision !== undefined
      ? precision
      : (String(step).split(".")[1] || "").length;

  const commit = (raw) => {
    if (!isControlled) setInternal(raw);
    if (onChange) onChange({ target: { value: raw, name } });
  };

  const bump = (dir) => {
    if (locked) return;
    let next = (hasNum ? num : min !== undefined ? min - step : 0) + dir * step;
    if (min !== undefined && next < min) next = min;
    if (max !== undefined && next > max) next = max;
    commit(decimals ? next.toFixed(decimals) : String(next));
  };

  /* Gedrückt halten zählt fortlaufend weiter */
  const startHold = (dir) => {
    bump(dir);
    clearTimeout(holdRef.current);
    holdRef.current = setTimeout(function repeat() {
      bump(dir);
      holdRef.current = setTimeout(repeat, 80);
    }, 400);
  };
  const stopHold = () => clearTimeout(holdRef.current);
  React.useEffect(() => () => clearTimeout(holdRef.current), []);

  const onKeyDown = (e) => {
    if (e.key === "ArrowUp") { e.preventDefault(); bump(1); }
    else if (e.key === "ArrowDown") { e.preventDefault(); bump(-1); }
  };

  /* Mausrad nur bei Fokus, damit das Scrollen der Seite nicht gestört wird */
  React.useEffect(() => {
    const el = inputRef.current;
    if (!el || !focused || locked) return;
    const onWheel = (e) => { e.preventDefault(); bump(e.deltaY < 0 ? 1 : -1); };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [focused, locked, current, min, max, step]);

  const stepBtn = (dir, place) =>
    React.createElement(
      "button",
      {
        type: "button",
        className: [
          "medo-num__step",
          "medo-num__step--" + size,
          place === "first" ? "medo-num__step--first" : null,
        ]
          .filter(Boolean)
          .join(" "),
        "aria-label": dir > 0 ? "Erhöhen" : "Verringern",
        tabIndex: -1,
        disabled: locked || (dir > 0 ? atMax : atMin),
        onMouseDown: (e) => { e.preventDefault(); startHold(dir); },
        onMouseUp: stopHold,
        onMouseLeave: stopHold,
        onTouchStart: () => startHold(dir),
        onTouchEnd: stopHold,
      },
      IconCmp
        ? React.createElement(IconCmp, {
            name: isPlusMinus
              ? dir > 0 ? "add" : "remove"
              : dir > 0 ? "keyboard_arrow_up" : "keyboard_arrow_down",
            size: glyph,
          })
        : null
    );

  const boxClasses = [
    "medo-field__box",
    "medo-field__box--" + size,
    focused && !disabled ? "medo-field__box--focus" : null,
    error ? "medo-field__box--error" : null,
    success && !error ? "medo-field__box--success" : null,
    disabled ? "medo-field__box--disabled" : null,
    readOnly && !disabled ? "medo-field__box--readonly" : null,
  ]
    .filter(Boolean)
    .join(" ");

  const box = React.createElement(
    "div",
    { className: boxClasses },
    isPlusMinus ? stepBtn(-1, "first") : null,
    prefix
      ? React.createElement(
          "span",
          { className: "medo-num__unit medo-num__unit--prefix" },
          prefix
        )
      : null,
    React.createElement("input", {
      ref: inputRef,
      id: fieldId,
      name,
      type: "text",
      inputMode: "decimal",
      className: "medo-field__control medo-num__input",
      value: current,
      disabled,
      readOnly,
      required,
      role: "spinbutton",
      "aria-valuenow": hasNum ? num : undefined,
      "aria-valuemin": min,
      "aria-valuemax": max,
      "aria-invalid": error ? "true" : undefined,
      style: {
        textAlign: align || (isPlusMinus ? "center" : "left"),
        ...(isPlusMinus ? { padding: "0 8px" } : null),
      },
      onChange: (e) => commit(e.target.value),
      onKeyDown,
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
      ...rest,
    }),
    suffix ? React.createElement("span", { className: "medo-num__unit" }, suffix) : null,
    isPlusMinus ? stepBtn(1) : [stepBtn(-1), stepBtn(1)]
  );

  return React.createElement(
    FieldCmp,
    {
      label,
      htmlFor: fieldId,
      required,
      optional,
      hint,
      error,
      success,
      fullWidth,
      className: ["medo-num", isPlusMinus ? "medo-num--plusminus" : null, className]
        .filter(Boolean)
        .join(" "),
      style: width ? { width, ...style } : style,
    },
    box
  );
};

export { NumberInput };
window.MedoUI = window.MedoUI || {};
window.MedoUI.NumberInput = NumberInput;
