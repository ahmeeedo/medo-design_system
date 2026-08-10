window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Slider
   Nachbau von components/Slider.dc.html.
   Wert stufenlos oder in Schritten. Weißer Griff mit Rahmen, Wert-Bubble beim Ziehen und bei
   Fokus, sichtbare Ticks im diskreten Modus. Ziehen (Pointer) und Tastatur. */

const MEDO_SL_CSS = `
.medo-sl{ font-family: var(--medo-font-sans); }
.medo-sl__top{
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--medo-space-sm);
  margin-bottom: 10px;
}
.medo-sl__label{ font-size: var(--medo-text-sm); color: var(--medo-text); }
.medo-sl__num{
  font-family: var(--medo-font-mono);
  font-size: var(--medo-text-xs);
  color: var(--medo-text-muted);
  font-variant-numeric: tabular-nums;
}
.medo-sl__row{ display: flex; align-items: center; gap: 16px; }
.medo-sl__ic{ flex: none; color: var(--medo-icon); }
.medo-sl__area{ touch-action: none; cursor: pointer; position: relative; flex: 1; padding: 16px 0; }
.medo-sl--sm .medo-sl__area{ padding: 14px 0; }
.medo-sl__track{
  position: relative;
  height: 6px;
  border-radius: var(--medo-radius-full);
  background: var(--medo-color-stone-200);
}
.medo-sl--sm .medo-sl__track{ height: 4px; }
.medo-sl__fill{
  position: absolute;
  left: 0; top: 0; bottom: 0;
  background: var(--medo-action);
  border-radius: var(--medo-radius-full);
}
.medo-sl__tick{
  position: absolute;
  top: 50%;
  width: 4px; height: 4px;
  transform: translate(-50%, -50%);
  border-radius: var(--medo-radius-full);
}
.medo-sl__handle{
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  width: 20px; height: 20px;
  transform: translate(-50%, -50%);
  background: var(--medo-color-white);
  border: var(--medo-border-thin) solid var(--medo-color-stone-400);
  border-radius: var(--medo-radius-full);
  box-shadow: 0 1px 2px rgba(31,29,26,0.14), 0 1px 3px rgba(31,29,26,0.10);
  cursor: grab;
  outline: none;
}
.medo-sl--sm .medo-sl__handle{ width: 16px; height: 16px; }
.medo-sl__handle:hover{
  border-color: var(--medo-color-stone-600);
  box-shadow: 0 2px 4px rgba(31,29,26,0.16), 0 1px 3px rgba(31,29,26,0.10);
}
.medo-sl__handle:active{ cursor: grabbing; }
.medo-sl__handle:focus-visible{ box-shadow: 0 0 0 3px var(--medo-focus-ring), 0 1px 2px rgba(31,29,26,0.12); }
.medo-sl--disabled .medo-sl__area{ cursor: not-allowed; }
.medo-sl--disabled .medo-sl__fill{ background: var(--medo-color-stone-400); }
.medo-sl--disabled .medo-sl__handle{ background: var(--medo-color-stone-50); border-color: var(--medo-border-disabled); box-shadow: none; cursor: not-allowed; }
.medo-sl--disabled .medo-sl__ic{ color: var(--medo-icon-disabled); }
.medo-sl__bubble{
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--medo-color-stone-1000);
  color: var(--medo-color-white);
  font-family: var(--medo-font-mono);
  font-size: var(--medo-text-xs);
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 120ms ease;
  pointer-events: none;
}
.medo-sl--sm .medo-sl__bubble{ bottom: calc(100% + 9px); font-size: 11px; padding: 3px 7px; }
.medo-sl__bubble--on{ opacity: 1; }
.medo-sl__bubble::after{
  content: '';
  position: absolute;
  bottom: -3px; left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 7px; height: 7px;
  background: var(--medo-color-stone-1000);
  border-radius: 1px;
}
.medo-sl__ends{
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-family: var(--medo-font-mono);
  font-size: 11px;
  color: var(--medo-text-muted);
}
.medo-sl__steps{
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-family: var(--medo-font-mono);
  font-size: 11px;
}

/* Vertikal */
.medo-sl--vertical{ display: inline-flex; flex-direction: column; align-items: center; gap: 14px; }
.medo-sl--vertical .medo-sl__area{ flex: none; padding: 0 16px; }
.medo-sl--vertical .medo-sl__track{ width: 6px; height: 180px; }
.medo-sl--vertical .medo-sl__fill{ left: 0; right: 0; top: auto; bottom: 0; }
.medo-sl--vertical .medo-sl__handle{ left: 50%; top: auto; transform: translate(-50%, 50%); }
.medo-sl--vertical .medo-sl__bubble{
  bottom: auto; left: calc(100% + 10px); top: 50%;
  transform: translateY(-50%);
}
.medo-sl--vertical .medo-sl__bubble::after{
  bottom: auto; left: -3px; top: 50%;
  transform: translateY(-50%) rotate(45deg);
}
`;

const Slider = ({
  value,
  defaultValue = 0,
  onChange,
  onChangeEnd,
  min = 0,
  max = 100,
  step = 1,
  size = "md",
  orientation = "horizontal",
  label,
  showValue = false,
  showMinMax = false,
  showTicks = false,
  stepLabels,
  formatValue,
  startIcon,
  endIcon,
  disabled = false,
  ariaLabel,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-slider-css", MEDO_SL_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const vertical = orientation === "vertical";
  const controlled = value !== undefined;
  const [inner, setInner] = React.useState(defaultValue);
  const val = controlled ? value : inner;
  const [active, setActive] = React.useState(false);
  const areaRef = React.useRef(null);
  /* Der Drag-Handler lebt über mehrere Renders — der aktuelle Wert muss über ein Ref kommen. */
  const latest = React.useRef(val);
  latest.current = val;

  const clamp = (v) => {
    const snapped = Math.round((v - min) / step) * step + min;
    return Math.min(max, Math.max(min, Number(snapped.toFixed(6))));
  };
  const pct = ((val - min) / (max - min)) * 100;
  const text = formatValue ? formatValue(val) : stepLabels ? stepLabels[Math.round((val - min) / step)] : val;

  const emit = (v) => {
    const next = clamp(v);
    if (next === val) return;
    latest.current = next;
    if (!controlled) setInner(next);
    if (onChange) onChange(next);
  };

  const fromPoint = (e) => {
    const track = areaRef.current && areaRef.current.querySelector("[data-track]");
    if (!track) return;
    const r = track.getBoundingClientRect();
    const ratio = vertical
      ? (r.bottom - e.clientY) / r.height
      : (e.clientX - r.left) / r.width;
    emit(min + ratio * (max - min));
  };

  const onDown = (e) => {
    if (disabled) return;
    e.preventDefault();
    setActive(true);
    fromPoint(e);
    const move = (ev) => fromPoint(ev);
    const up = () => {
      setActive(false);
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
      if (onChangeEnd) onChangeEnd(latest.current);
    };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
    const handle = areaRef.current.querySelector("[role=slider]");
    if (handle) handle.focus();
  };

  const onKey = (e) => {
    if (disabled) return;
    const big = Math.max(step, (max - min) / 10);
    const map = {
      ArrowRight: step, ArrowUp: step,
      ArrowLeft: -step, ArrowDown: -step,
      PageUp: big, PageDown: -big,
    };
    if (e.key === "Home") { e.preventDefault(); return emit(min); }
    if (e.key === "End") { e.preventDefault(); return emit(max); }
    if (map[e.key] === undefined) return;
    e.preventDefault();
    emit(val + map[e.key]);
  };

  const ticks = showTicks
    ? Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => min + i * step)
    : [];

  const area = React.createElement(
    "div",
    { ref: areaRef, className: "medo-sl__area", onPointerDown: onDown },
    React.createElement(
      "div",
      { "data-track": "true", className: "medo-sl__track" },
      React.createElement("div", {
        className: "medo-sl__fill",
        style: vertical ? { height: pct + "%" } : { width: pct + "%" },
      }),
      ticks.map((t) => {
        const p = ((t - min) / (max - min)) * 100;
        return React.createElement("div", {
          key: t,
          className: "medo-sl__tick",
          style: vertical
            ? { bottom: p + "%", left: "50%", top: "auto", transform: "translate(-50%, 50%)",
                background: t <= val ? "rgba(255,255,255,0.75)" : "var(--medo-color-stone-400)" }
            : { left: p + "%", background: t <= val ? "rgba(255,255,255,0.75)" : "var(--medo-color-stone-400)" },
        });
      }),
      React.createElement(
        "div",
        {
          role: "slider",
          tabIndex: disabled ? -1 : 0,
          "aria-label": ariaLabel || (typeof label === "string" ? label : undefined),
          "aria-orientation": vertical ? "vertical" : undefined,
          "aria-valuemin": min,
          "aria-valuemax": max,
          "aria-valuenow": val,
          "aria-valuetext": stepLabels || formatValue ? String(text) : undefined,
          "aria-disabled": disabled ? "true" : undefined,
          className: "medo-sl__handle",
          style: vertical ? { bottom: pct + "%" } : { left: pct + "%" },
          onKeyDown: onKey,
          onFocus: () => setActive(true),
          onBlur: () => setActive(false),
        },
        React.createElement(
          "div",
          {
            className: ["medo-sl__bubble", active && !disabled ? "medo-sl__bubble--on" : null]
              .filter(Boolean)
              .join(" "),
          },
          text
        )
      )
    )
  );

  return React.createElement(
    "div",
    {
      className: [
        "medo-sl",
        "medo-sl--" + size,
        vertical ? "medo-sl--vertical" : null,
        disabled ? "medo-sl--disabled" : null,
        className,
      ]
        .filter(Boolean)
        .join(" "),
      style,
      ...rest,
    },
    label || showValue
      ? React.createElement(
          "div",
          { className: "medo-sl__top" },
          label ? React.createElement("span", { className: "medo-sl__label" }, label) : null,
          showValue ? React.createElement("span", { className: "medo-sl__num" }, text) : null
        )
      : null,
    startIcon && IconCmp && vertical
      ? React.createElement(IconCmp, { name: startIcon, size: 22, className: "medo-sl__ic" })
      : null,
    vertical
      ? area
      : React.createElement(
          "div",
          { className: "medo-sl__row" },
          startIcon && IconCmp
            ? React.createElement(IconCmp, { name: startIcon, size: 22, className: "medo-sl__ic" })
            : null,
          area,
          endIcon && IconCmp
            ? React.createElement(IconCmp, { name: endIcon, size: 22, className: "medo-sl__ic" })
            : null
        ),
    endIcon && IconCmp && vertical
      ? React.createElement(IconCmp, { name: endIcon, size: 20, className: "medo-sl__ic" })
      : null,
    showMinMax && !vertical
      ? React.createElement(
          "div",
          { className: "medo-sl__ends", style: { padding: startIcon || endIcon ? "0 38px" : 0 } },
          React.createElement("span", null, min),
          React.createElement("span", null, max)
        )
      : null,
    stepLabels && !vertical
      ? React.createElement(
          "div",
          { className: "medo-sl__steps" },
          stepLabels.map((l, i) =>
            React.createElement(
              "span",
              {
                key: i,
                style: {
                  color:
                    i === Math.round((val - min) / step)
                      ? "var(--medo-text)"
                      : "var(--medo-text-muted)",
                },
              },
              l
            )
          )
        )
      : null
  );
};

export { Slider };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Slider = Slider;
