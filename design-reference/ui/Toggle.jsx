window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Toggle
   Schaltet eine Einstellung sofort um — kein Speichern-Schritt. Als role="switch" gerendert.
   Aus = Bahn stone-300, An = Bahn primary-600. Griff immer weiß, Icon im Griff. */

const MEDO_TOGGLE_CSS = `
.medo-tg{
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: var(--medo-space-sm);
  appearance: none;
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  font-family: var(--medo-font-sans);
  color: var(--medo-text);
  text-align: left;
  cursor: pointer;
}
.medo-tg--block{ display: flex; width: 100%; justify-content: space-between; }
.medo-tg:disabled{ cursor: not-allowed; }
.medo-tg__track{
  box-sizing: border-box;
  flex: none;
  display: inline-flex;
  align-items: center;
  padding: 2px;
  border-radius: var(--medo-radius-full);
  background: var(--medo-color-stone-300);
  transition: background-color 140ms ease-out, justify-content 0ms;
}
.medo-tg:hover:not(:disabled) .medo-tg__track{ background: var(--medo-color-stone-400); }
.medo-tg--on .medo-tg__track{ background: var(--medo-action); }
.medo-tg--on:hover:not(:disabled) .medo-tg__track{ background: var(--medo-action-hover); }
.medo-tg--on:active:not(:disabled) .medo-tg__track{ background: var(--medo-action-active); }
.medo-tg:focus-visible{ outline: none; }
.medo-tg:focus-visible .medo-tg__track{ box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-tg:disabled .medo-tg__track{ background: var(--medo-color-stone-200); }
.medo-tg--on:disabled .medo-tg__track{ background: var(--medo-color-stone-300); }
.medo-tg__thumb{
  box-sizing: border-box;
  flex: none;
  border-radius: var(--medo-radius-full);
  background: var(--medo-color-white);
  box-shadow: 0 1px 2px rgba(31,29,26,0.28);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 140ms ease-out;
}
.medo-tg:disabled:not(.medo-tg--on) .medo-tg__thumb{ background: var(--medo-color-stone-50); }
.medo-tg__spin{
  border-radius: var(--medo-radius-full);
  border-style: solid;
  border-top-color: transparent !important;
  animation: medo-tg-spin 0.7s linear infinite;
}
@keyframes medo-tg-spin{ to{ transform: rotate(360deg); } }
.medo-tg__text{ display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.medo-tg__label{ font-size: var(--medo-text-sm); line-height: 1.45; }
.medo-tg--lg .medo-tg__label{ font-size: var(--medo-text-base); }
.medo-tg__desc{ font-size: var(--medo-text-sm); line-height: 1.45; color: var(--medo-text-muted); }
.medo-tg:disabled .medo-tg__label,
.medo-tg:disabled .medo-tg__desc{ color: var(--medo-text-disabled); }
/* Ladezustand ist gesperrt, sieht aber nicht deaktiviert aus. */
.medo-tg--loading:disabled .medo-tg__track{ background: var(--medo-color-stone-300); }
.medo-tg--on.medo-tg--loading:disabled .medo-tg__track{ background: var(--medo-action); }
.medo-tg--loading:disabled:not(.medo-tg--on) .medo-tg__thumb{ background: var(--medo-color-white); }
.medo-tg--loading:disabled .medo-tg__label{ color: var(--medo-text); }
.medo-tg--loading:disabled .medo-tg__desc{ color: var(--medo-text-muted); }
`;

const MEDO_TOGGLE_SIZES = {
  sm: { w: 36, h: 20, thumb: 16, icon: 12, spin: 10 },
  md: { w: 44, h: 24, thumb: 20, icon: 14, spin: 12 },
  lg: { w: 52, h: 30, thumb: 26, icon: 16, spin: 14 },
};

const Toggle = ({
  checked,
  defaultChecked = false,
  onChange,
  label,
  description,
  size = "md",
  labelPosition = "right",
  icons = true,
  loading = false,
  disabled = false,
  id,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-toggle-css", MEDO_TOGGLE_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const controlled = checked !== undefined;
  const [inner, setInner] = React.useState(defaultChecked);
  const on = controlled ? checked : inner;
  const s = MEDO_TOGGLE_SIZES[size] || MEDO_TOGGLE_SIZES.md;
  const blocked = disabled || loading;

  const toggle = () => {
    if (blocked) return;
    if (!controlled) setInner(!on);
    if (onChange) onChange(!on);
  };

  const iconColor = on ? "var(--medo-action)" : "var(--medo-color-stone-600)";

  const control = React.createElement(
    "span",
    {
      className: "medo-tg__track",
      style: { width: s.w + "px", height: s.h + "px", justifyContent: on ? "flex-end" : "flex-start" },
    },
    React.createElement(
      "span",
      { className: "medo-tg__thumb", style: { width: s.thumb + "px", height: s.thumb + "px" } },
      loading
        ? React.createElement("span", {
            className: "medo-tg__spin",
            style: {
              width: s.spin + "px",
              height: s.spin + "px",
              borderWidth: "2px",
              borderColor: disabled ? "var(--medo-color-stone-400)" : iconColor,
            },
          })
        : icons && IconCmp
        ? React.createElement(IconCmp, {
            name: on ? "check" : "close",
            size: s.icon,
            color: disabled ? "var(--medo-color-stone-400)" : iconColor,
          })
        : null
    )
  );

  const text =
    label || description
      ? React.createElement(
          "span",
          { className: "medo-tg__text" },
          label ? React.createElement("span", { className: "medo-tg__label" }, label) : null,
          description
            ? React.createElement("span", { className: "medo-tg__desc" }, description)
            : null
        )
      : null;

  return React.createElement(
    "button",
    {
      type: "button",
      role: "switch",
      id,
      "aria-checked": on ? "true" : "false",
      "aria-busy": loading ? "true" : undefined,
      disabled: blocked,
      onClick: toggle,
      className: [
        "medo-tg",
        "medo-tg--" + size,
        on ? "medo-tg--on" : null,
        loading ? "medo-tg--loading" : null,
        labelPosition === "left" ? "medo-tg--block" : null,
        className,
      ]
        .filter(Boolean)
        .join(" "),
      style,
      ...rest,
    },
    labelPosition === "left" ? text : control,
    labelPosition === "left" ? control : text
  );
};

export { Toggle };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Toggle = Toggle;
