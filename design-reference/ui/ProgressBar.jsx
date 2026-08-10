window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · ProgressBar
   Fortschritt eines Vorgangs. Determiniert (value 0–100) oder indeterminiert (unbekannte Dauer).
   Zwei Höhen: thin 4px, standard 8px. Status färbt die Füllung (Erfolg grün, Fehler rot). */

const MEDO_PB_CSS = `
.medo-pb{ font-family: var(--medo-font-sans); width: 100%; }
.medo-pb__top{
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--medo-space-sm);
  margin-bottom: 8px;
}
.medo-pb__label{ font-size: var(--medo-text-sm); color: var(--medo-text); }
.medo-pb__helper{ font-size: var(--medo-text-sm); color: var(--medo-text-muted); }
.medo-pb__val{
  font-family: var(--medo-font-mono);
  font-size: var(--medo-text-xs);
  color: var(--medo-text-muted);
  font-variant-numeric: tabular-nums;
  flex: none;
}
.medo-pb__track{
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 8px;
  border-radius: var(--medo-radius-full);
  background: var(--medo-surface-sunken);
}
.medo-pb--thin .medo-pb__track{ height: 4px; }
.medo-pb__fill{
  height: 100%;
  border-radius: var(--medo-radius-full);
  background: var(--medo-action);
  transition: width 240ms ease-out, background-color 160ms ease-out;
}
.medo-pb--success .medo-pb__fill{ background: var(--medo-success-solid); }
.medo-pb--error .medo-pb__fill{ background: var(--medo-error-solid); }
.medo-pb--warning .medo-pb__fill{ background: var(--medo-warning-solid); }
.medo-pb__fill--indeterminate{
  position: absolute;
  width: 38%;
  left: 0;
  animation: medo-pb-run 1.25s ease-in-out infinite;
}
@keyframes medo-pb-run{
  0%{ transform: translateX(-100%); }
  100%{ transform: translateX(265%); }
}
.medo-pb__status{
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: var(--medo-text-sm);
  color: var(--medo-text-muted);
}
.medo-pb--success .medo-pb__status{ color: var(--medo-success-text); }
.medo-pb--error .medo-pb__status{ color: var(--medo-error-text); }
`;

const ProgressBar = ({
  value,
  max = 100,
  label,
  helper,
  showValue = false,
  status = "normal",
  size = "standard",
  statusText,
  ariaLabel,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-progress-bar-css", MEDO_PB_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const indeterminate = value === undefined || value === null;
  const pct = indeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  return React.createElement(
    "div",
    {
      className: ["medo-pb", "medo-pb--" + size, "medo-pb--" + status, className]
        .filter(Boolean)
        .join(" "),
      style,
      ...rest,
    },
    label || showValue || helper
      ? React.createElement(
          "div",
          { className: "medo-pb__top" },
          React.createElement(
            "div",
            null,
            label ? React.createElement("span", { className: "medo-pb__label" }, label) : null,
            helper
              ? React.createElement("span", { className: "medo-pb__helper", style: { marginLeft: "8px" } }, helper)
              : null
          ),
          showValue && !indeterminate
            ? React.createElement("span", { className: "medo-pb__val" }, Math.round(pct) + " %")
            : null
        )
      : null,
    React.createElement(
      "div",
      {
        className: "medo-pb__track",
        role: "progressbar",
        "aria-label": ariaLabel || (typeof label === "string" ? label : undefined),
        "aria-valuemin": indeterminate ? undefined : 0,
        "aria-valuemax": indeterminate ? undefined : max,
        "aria-valuenow": indeterminate ? undefined : Math.round(value),
      },
      React.createElement("div", {
        className: ["medo-pb__fill", indeterminate ? "medo-pb__fill--indeterminate" : null]
          .filter(Boolean)
          .join(" "),
        style: indeterminate ? undefined : { width: pct + "%" },
      })
    ),
    statusText
      ? React.createElement(
          "div",
          { className: "medo-pb__status" },
          (status === "success" || status === "error") && IconCmp
            ? React.createElement(IconCmp, {
                name: status === "success" ? "check_circle" : "error",
                size: 18,
              })
            : null,
          React.createElement("span", null, statusText)
        )
      : null
  );
};

export { ProgressBar };
window.MedoUI = window.MedoUI || {};
window.MedoUI.ProgressBar = ProgressBar;
