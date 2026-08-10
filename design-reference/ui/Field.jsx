window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Field
   Gemeinsames Gerüst aller Formularfelder: Label, Feldrahmen, Hilfetext, Fehler- und Erfolgsmeldung.
   Wird von TextInput und Select benutzt und ist auch einzeln verwendbar, um eigene
   Eingabeelemente in dieselbe Hülle zu setzen. */

const MEDO_FIELD_CSS = `
.medo-field{ display: flex; flex-direction: column; gap: 7px; font-family: var(--medo-font-sans); }
.medo-field--fullWidth{ width: 100%; }

.medo-field__label{
  font-size: var(--medo-text-sm);
  font-weight: 500;
  color: var(--medo-text);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.medo-field__req{ color: var(--medo-error-solid); }
.medo-field__optional{ color: var(--medo-text-muted); font-weight: 400; }

.medo-field__box{
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 var(--medo-space-sm);
  background: var(--medo-input-bg);
  border: var(--medo-border-thin) solid var(--medo-input-border);
  border-radius: var(--medo-radius-md);
  color: var(--medo-input-text);
  transition: border-color 140ms ease-out, box-shadow 140ms ease-out;
}
.medo-field__box--sm{ height: 36px; font-size: var(--medo-text-sm); }
.medo-field__box--md{ height: 40px; font-size: var(--medo-text-base); }
.medo-field__box--lg{ height: 48px; font-size: var(--medo-text-base); }

.medo-field__box:hover:not(.medo-field__box--disabled):not(.medo-field__box--readonly){
  border-color: var(--medo-input-border-hover);
}
.medo-field__box--focus{
  border-color: var(--medo-input-border-focus);
  box-shadow: 0 0 0 3px var(--medo-focus-ring);
}
.medo-field__box--error{ border-color: var(--medo-input-border-error); }
.medo-field__box--error.medo-field__box--focus{ box-shadow: 0 0 0 3px var(--medo-focus-ring-danger); }
.medo-field__box--success{ border-color: var(--medo-success-solid); }
.medo-field__box--disabled{
  background: var(--medo-input-bg-disabled);
  border-color: var(--medo-input-border-disabled);
  color: var(--medo-text-disabled);
  cursor: not-allowed;
}
.medo-field__box--readonly{
  background: var(--medo-surface-container);
  border-color: var(--medo-border-subtle);
}

.medo-field__control{
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font: inherit;
  color: inherit;
  padding: 0;
}
.medo-field__control::placeholder{ color: var(--medo-input-placeholder); }
.medo-field__control:disabled{ cursor: not-allowed; }

.medo-field__affix{ color: var(--medo-text-muted); flex: none; }
.medo-field__counter{
  font-family: var(--medo-font-mono);
  font-size: var(--medo-text-xs);
  color: var(--medo-text-muted);
  flex: none;
}

/* Bedienbare Feld-Icons sehen wie kleine Schaltflächen aus — feste Systemregel. */
.medo-field__iconbtn{
  box-sizing: border-box;
  border: none;
  background: var(--medo-action-neutral);
  width: 28px; height: 28px;
  margin-right: -5px;
  border-radius: var(--medo-radius-sm);
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; flex: none;
  color: var(--medo-icon-muted);
  transition: background-color 140ms ease-out, color 140ms ease-out;
}
.medo-field__iconbtn:hover{ background: var(--medo-action-neutral-hover); color: var(--medo-text); }
.medo-field__iconbtn:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }

.medo-field__msg{
  display: flex; align-items: flex-start; gap: 6px;
  font-size: var(--medo-text-sm);
  line-height: var(--medo-text-sm-line);
  color: var(--medo-text-muted);
}
.medo-field__msg--error{ color: var(--medo-error-text); }
.medo-field__msg--success{ color: var(--medo-success-text); }
`;

const Field = ({
  label,
  htmlFor,
  required = false,
  optional = false,
  hint,
  error,
  success,
  fullWidth = false,
  children,
  className,
  style,
}) => {
  window.MedoUI.injectCss("medo-field-css", MEDO_FIELD_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const msgText = error || success || hint;
  const msgKind = error ? "error" : success ? "success" : null;
  const msgIcon = error ? "error" : success ? "check_circle" : null;

  return React.createElement(
    "div",
    {
      className: ["medo-field", fullWidth ? "medo-field--fullWidth" : null, className]
        .filter(Boolean)
        .join(" "),
      style,
    },
    label
      ? React.createElement(
          "label",
          { className: "medo-field__label", htmlFor },
          label,
          required
            ? React.createElement("span", { className: "medo-field__req", "aria-hidden": "true" }, "*")
            : null,
          optional && !required
            ? React.createElement("span", { className: "medo-field__optional" }, "(optional)")
            : null
        )
      : null,
    children,
    msgText
      ? React.createElement(
          "div",
          {
            className: ["medo-field__msg", msgKind ? "medo-field__msg--" + msgKind : null]
              .filter(Boolean)
              .join(" "),
            role: error ? "alert" : undefined,
          },
          msgIcon && IconCmp
            ? React.createElement(IconCmp, { name: msgIcon, size: 16, style: { marginTop: "1px" } })
            : null,
          React.createElement("span", null, msgText)
        )
      : null
  );
};

export { Field, MEDO_FIELD_CSS };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Field = Field;
window.MedoUI.MEDO_FIELD_CSS = MEDO_FIELD_CSS;
