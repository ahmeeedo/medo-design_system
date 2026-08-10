window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Checkbox
   Mehrfachauswahl. Eigene Grafik statt Systemhäkchen, damit Farbe, Radius und Fokusring
   aus den Tokens kommen. Unterstützt den unbestimmten Zwischenzustand. */

const MEDO_CHECKBOX_CSS = `
.medo-cb{
  display: inline-flex;
  align-items: flex-start;
  gap: 10px;
  font-family: var(--medo-font-sans);
  font-size: var(--medo-text-sm);
  line-height: var(--medo-text-sm-line);
  color: var(--medo-text);
  cursor: pointer;
  position: relative;
}
.medo-cb--disabled{ cursor: not-allowed; color: var(--medo-text-disabled); }

.medo-cb__native{
  position: absolute;
  opacity: 0;
  width: 0; height: 0;
  margin: 0;
  pointer-events: none;
}

.medo-cb__box{
  box-sizing: border-box;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--medo-input-bg);
  border: var(--medo-border-thin) solid var(--medo-input-border);
  border-radius: var(--medo-radius-sm);
  color: transparent;
  transition: background-color 140ms ease-out, border-color 140ms ease-out, box-shadow 140ms ease-out;
}
.medo-cb__box--sm{ width: 18px; height: 18px; }
.medo-cb__box--md{ width: 20px; height: 20px; }

.medo-cb:hover:not(.medo-cb--disabled) .medo-cb__box{ border-color: var(--medo-input-border-hover); }

.medo-cb__native:focus-visible + .medo-cb__box{
  box-shadow: 0 0 0 3px var(--medo-focus-ring);
  border-color: var(--medo-input-border-focus);
}

.medo-cb__native:checked + .medo-cb__box,
.medo-cb__native:indeterminate + .medo-cb__box{
  background: var(--medo-action);
  border-color: var(--medo-action);
  color: var(--medo-action-text);
}

.medo-cb--error .medo-cb__box{ border-color: var(--medo-input-border-error); }

.medo-cb--disabled .medo-cb__box{
  background: var(--medo-input-bg-disabled);
  border-color: var(--medo-input-border-disabled);
}
.medo-cb--disabled .medo-cb__native:checked + .medo-cb__box,
.medo-cb--disabled .medo-cb__native:indeterminate + .medo-cb__box{
  background: var(--medo-action-disabled);
  border-color: var(--medo-action-disabled);
  color: var(--medo-action-text-disabled);
}

.medo-cb__text{ display: flex; flex-direction: column; gap: 2px; padding-top: 1px; }
.medo-cb__hint{ font-size: var(--medo-text-xs); color: var(--medo-text-muted); }

.medo-cb-group{ display: flex; flex-direction: column; gap: var(--medo-space-sm); }
.medo-cb-group--horizontal{ flex-direction: row; flex-wrap: wrap; gap: var(--medo-space-lg); }
`;

const Checkbox = ({
  label,
  hint,
  checked,
  defaultChecked,
  indeterminate = false,
  disabled = false,
  error = false,
  size = "md",
  name,
  value,
  onChange,
  id,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-checkbox-css", MEDO_CHECKBOX_CSS);

  const ref = React.useRef(null);
  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const glyphSize = size === "sm" ? 15 : 16;

  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return React.createElement(
    "label",
    {
      className: [
        "medo-cb",
        disabled ? "medo-cb--disabled" : null,
        error ? "medo-cb--error" : null,
        className,
      ]
        .filter(Boolean)
        .join(" "),
      style,
    },
    React.createElement("input", {
      ref,
      id,
      type: "checkbox",
      className: "medo-cb__native",
      checked,
      defaultChecked,
      disabled,
      name,
      value,
      onChange,
      "aria-invalid": error ? "true" : undefined,
      ...rest,
    }),
    React.createElement(
      "span",
      { className: "medo-cb__box medo-cb__box--" + size, "aria-hidden": "true" },
      IconCmp
        ? React.createElement(IconCmp, { name: indeterminate ? "remove" : "check", size: glyphSize })
        : null
    ),
    label || hint
      ? React.createElement(
          "span",
          { className: "medo-cb__text" },
          label ? React.createElement("span", null, label) : null,
          hint ? React.createElement("span", { className: "medo-cb__hint" }, hint) : null
        )
      : null
  );
};

const CheckboxGroup = ({ legend, direction = "vertical", children, className, style }) => {
  window.MedoUI.injectCss("medo-checkbox-css", MEDO_CHECKBOX_CSS);
  return React.createElement(
    "fieldset",
    {
      style: { border: "none", margin: 0, padding: 0, ...style },
      className,
    },
    legend
      ? React.createElement(
          "legend",
          {
            style: {
              fontFamily: "var(--medo-font-sans)",
              fontSize: "var(--medo-text-sm)",
              fontWeight: 500,
              color: "var(--medo-text)",
              padding: 0,
              marginBottom: "10px",
            },
          },
          legend
        )
      : null,
    React.createElement(
      "div",
      {
        className:
          "medo-cb-group" + (direction === "horizontal" ? " medo-cb-group--horizontal" : ""),
      },
      children
    )
  );
};

export { Checkbox, CheckboxGroup };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Checkbox = Checkbox;
window.MedoUI.CheckboxGroup = CheckboxGroup;
