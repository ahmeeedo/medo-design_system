window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · ProgressIndicator (Stepper)
   Zeigt die Schritte eines Vorgangs und wo man darin steht. Waagerecht oder senkrecht.
   Zustände: erledigt (Häkchen), aktiv (Ring), ausstehend, Fehler. Erledigte Schritte
   dürfen anklickbar sein; ausstehende nie. Die Linie füllt sich bis zum erreichten Schritt. */

const MEDO_PI_CSS = `
.medo-pi{ font-family: var(--medo-font-sans); display: flex; }
.medo-pi--horizontal{ align-items: flex-start; }
.medo-pi--vertical{ flex-direction: column; }
.medo-pi__li{ display: contents; }
.medo-pi__step{
  position: relative;
  display: flex;
  gap: 12px;
  min-width: 0;
  appearance: none;
  border: none;
  background: transparent;
  font-family: inherit;
  text-align: left;
  padding: 0;
  color: inherit;
}
.medo-pi--horizontal .medo-pi__step{ flex: 1; flex-direction: column; align-items: flex-start; gap: 10px; padding-right: 16px; }
.medo-pi--horizontal .medo-pi__li:last-child .medo-pi__step{ flex: 0 0 auto; padding-right: 0; }
.medo-pi--vertical .medo-pi__step{
  display: grid;
  grid-template-columns: 28px 1fr;
  column-gap: 12px;
  padding-bottom: 24px;
}
.medo-pi--vertical .medo-pi__li:last-child .medo-pi__step{ padding-bottom: 0; }
.medo-pi__step--clickable{ cursor: pointer; }
.medo-pi__step:focus-visible{ outline: none; }
.medo-pi__step:focus-visible .medo-pi__dot{ box-shadow: 0 0 0 3px var(--medo-focus-ring); }

.medo-pi__head{ display: flex; align-items: center; gap: 12px; width: 100%; }
.medo-pi--vertical .medo-pi__head{ display: block; width: 28px; align-items: stretch; }
.medo-pi__dot{
  box-sizing: border-box;
  flex: none;
  width: 28px; height: 28px;
  border-radius: var(--medo-radius-full);
  border: var(--medo-border-thin) solid var(--medo-border);
  background: var(--medo-surface);
  color: var(--medo-text-muted);
  display: inline-flex; align-items: center; justify-content: center;
  font-family: var(--medo-font-mono);
  font-size: var(--medo-text-xs);
  transition: background-color 140ms ease-out, border-color 140ms ease-out, color 140ms ease-out;
}
.medo-pi__step--done .medo-pi__dot{
  background: var(--medo-action);
  border-color: var(--medo-action);
  color: var(--medo-action-text);
}
.medo-pi__step--active .medo-pi__dot{
  border-color: var(--medo-action);
  border-width: var(--medo-border-thick);
  color: var(--medo-action);
  font-weight: 500;
}
.medo-pi__step--error .medo-pi__dot{
  background: var(--medo-error-solid);
  border-color: var(--medo-error-solid);
  color: var(--medo-error-on-solid);
}
.medo-pi__line{
  flex: 1;
  height: var(--medo-border-thin);
  background: var(--medo-divider);
  min-width: 16px;
}
.medo-pi__line--filled{ background: var(--medo-action); }
.medo-pi--vertical .medo-pi__line{
  position: absolute;
  left: 13px;
  top: 34px;
  bottom: 4px;
  width: var(--medo-border-thin);
  height: auto;
  min-width: 0;
  flex: none;
}
.medo-pi__body{ min-width: 0; }
.medo-pi--vertical .medo-pi__body{ padding-left: 0; margin-top: 3px; }
.medo-pi__title{ font-size: var(--medo-text-sm); font-weight: 500; color: var(--medo-text); }
.medo-pi__step--pending .medo-pi__title{ color: var(--medo-text-muted); font-weight: 400; }
.medo-pi__step--active .medo-pi__title{ font-weight: 600; }
.medo-pi__step--error .medo-pi__title{ color: var(--medo-error-text); }
.medo-pi__sub{ font-size: var(--medo-text-sm); color: var(--medo-text-muted); margin-top: 2px; }
.medo-pi__opt{
  font-family: var(--medo-font-mono);
  font-size: 11px;
  color: var(--medo-text-muted);
  margin-left: 6px;
}
`;

const ProgressIndicator = ({
  steps = [],
  current = 0,
  orientation = "horizontal",
  onStepClick,
  clickableDone = true,
  ariaLabel = "Fortschritt",
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-progress-indicator-css", MEDO_PI_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const vertical = orientation === "vertical";

  return React.createElement(
    "div",
    {
      role: "list",
      "aria-label": ariaLabel,
      className: ["medo-pi", "medo-pi--" + orientation, className].filter(Boolean).join(" "),
      style,
      ...rest,
    },
    steps.map((s, i) => {
      const state = s.status || (i < current ? "done" : i === current ? "active" : "pending");
      const done = state === "done";
      const clickable = !!onStepClick && done && clickableDone;
      const lineFilled = i < current;

      return React.createElement(
        "div",
        { key: i, role: "listitem", className: "medo-pi__li" },
        React.createElement(
          clickable ? "button" : "div",
          {
            type: clickable ? "button" : undefined,
            "aria-current": state === "active" ? "step" : undefined,
            onClick: clickable ? () => onStepClick(i, s) : undefined,
            className: [
              "medo-pi__step",
              "medo-pi__step--" + state,
              clickable ? "medo-pi__step--clickable" : null,
            ]
              .filter(Boolean)
              .join(" "),
          },
        React.createElement(
          "div",
          { className: "medo-pi__head" },
          React.createElement(
            "span",
            { className: "medo-pi__dot" },
            state === "done" && IconCmp
              ? React.createElement(IconCmp, { name: "check", size: 18 })
              : state === "error" && IconCmp
              ? React.createElement(IconCmp, { name: "close", size: 18 })
              : i + 1
          ),
          i < steps.length - 1
            ? React.createElement("span", {
                className: ["medo-pi__line", lineFilled ? "medo-pi__line--filled" : null]
                  .filter(Boolean)
                  .join(" "),
                "aria-hidden": "true",
              })
            : null
        ),
        React.createElement(
          "div",
          { className: "medo-pi__body" },
          React.createElement(
            "div",
            { className: "medo-pi__title" },
            s.title,
            s.optional
              ? React.createElement("span", { className: "medo-pi__opt" }, "optional")
              : null
          ),
          s.subtitle ? React.createElement("div", { className: "medo-pi__sub" }, s.subtitle) : null
        )
        )
      );
    })
  );
};

export { ProgressIndicator };
window.MedoUI = window.MedoUI || {};
window.MedoUI.ProgressIndicator = ProgressIndicator;
