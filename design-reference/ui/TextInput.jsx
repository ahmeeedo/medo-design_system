window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · TextInput
   Einzeiliges Eingabefeld. Nutzt das gemeinsame Feld-Gerüst aus Field.jsx.
   Zustände: Ruhe, Hover, Fokus, ausgefüllt, gesperrt, schreibgeschützt, Fehler, Erfolg. */

const MEDO_TI_FLOAT_CSS = `
.medo-ti-float{ position: relative; }
.medo-ti-float .medo-field__box{ height: 52px; align-items: flex-end; padding-bottom: 7px; }
.medo-ti-float .medo-field__control{ font-size: var(--medo-text-base); }
.medo-ti-float__label{
  position: absolute;
  left: 12px;
  top: 16px;
  font-family: var(--medo-font-sans);
  font-size: var(--medo-text-base);
  color: var(--medo-text-muted);
  pointer-events: none;
  transition: top 140ms ease-out, font-size 140ms ease-out, color 140ms ease-out;
}
.medo-ti-float--up .medo-ti-float__label{
  top: -8px;
  padding: 0 5px;
  background: var(--medo-input-bg);
  font-size: var(--medo-text-xs);
  font-weight: 500;
  color: var(--medo-text-muted);
}
.medo-ti-float--focus .medo-ti-float__label{ color: var(--medo-action); }
.medo-ti-float--error .medo-ti-float__label{ color: var(--medo-error-solid); }
.medo-ti-float--disabled .medo-ti-float__label{ color: var(--medo-text-disabled); background: var(--medo-input-bg-disabled); }
.medo-ti-float__req{ color: var(--medo-error-solid); margin-left: 2px; }
`;

const TextInput = ({
  label,
  floatingLabel = false,
  id,
  value,
  defaultValue,
  placeholder,
  type = "text",
  size = "md",
  required = false,
  optional = false,
  disabled = false,
  readOnly = false,
  hint,
  error,
  success,
  icon,
  prefix,
  suffix,
  maxLength,
  showCounter = false,
  clearable = false,
  onChange,
  onClear,
  fullWidth = false,
  inputMode,
  autoComplete,
  name,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-field-css", window.MedoUI.MEDO_FIELD_CSS);

  const [focused, setFocused] = React.useState(false);
  const [internal, setInternal] = React.useState(defaultValue || "");
  const [revealed, setRevealed] = React.useState(false);

  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const fieldId = id || React.useMemo(() => "medo-input-" + Math.random().toString(36).slice(2, 8), []);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const FieldCmp = window.MedoUI && window.MedoUI.Field;
  const iconSize = size === "sm" ? 18 : size === "lg" ? 21 : 19;

  const handleChange = (e) => {
    if (!isControlled) setInternal(e.target.value);
    if (onChange) onChange(e);
  };

  const handleClear = () => {
    if (!isControlled) setInternal("");
    if (onClear) onClear();
  };

  const isPassword = type === "password";
  const effectiveType = isPassword && revealed ? "text" : type;

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
    prefix ? React.createElement("span", { className: "medo-field__affix" }, prefix) : null,
    icon && IconCmp
      ? React.createElement(IconCmp, {
          name: icon,
          size: iconSize,
          color: "var(--medo-icon-muted)",
        })
      : null,
    React.createElement("input", {
      id: fieldId,
      className: "medo-field__control",
      type: effectiveType,
      value: current,
      placeholder,
      disabled,
      readOnly,
      required,
      maxLength,
      inputMode,
      autoComplete,
      name,
      "aria-invalid": error ? "true" : undefined,
      "aria-describedby": error || success || hint ? fieldId + "-msg" : undefined,
      onChange: handleChange,
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
      ...rest,
    }),
    suffix ? React.createElement("span", { className: "medo-field__affix" }, suffix) : null,
    showCounter && maxLength
      ? React.createElement(
          "span",
          { className: "medo-field__counter" },
          String(current || "").length + "/" + maxLength
        )
      : null,
    readOnly && !disabled && IconCmp
      ? React.createElement(IconCmp, { name: "lock", size: iconSize, color: "var(--medo-icon-muted)" })
      : null,
    isPassword && !disabled && !readOnly && IconCmp
      ? React.createElement(
          "button",
          {
            type: "button",
            className: "medo-field__iconbtn",
            "aria-label": revealed ? "Passwort verbergen" : "Passwort anzeigen",
            onClick: () => setRevealed((v) => !v),
          },
          React.createElement(IconCmp, { name: revealed ? "visibility_off" : "visibility", size: 19 })
        )
      : null,
    clearable && current && !disabled && !readOnly && IconCmp
      ? React.createElement(
          "button",
          {
            type: "button",
            className: "medo-field__iconbtn",
            "aria-label": "Feld leeren",
            onClick: handleClear,
          },
          React.createElement(IconCmp, { name: "cancel", size: 19 })
        )
      : null,
    error && IconCmp && !clearable && !isPassword
      ? React.createElement(IconCmp, { name: "error", size: iconSize, color: "var(--medo-error-solid)" })
      : null,
    success && !error && IconCmp && !clearable && !isPassword
      ? React.createElement(IconCmp, {
          name: "check_circle",
          size: iconSize,
          color: "var(--medo-success-solid)",
        })
      : null
  );

  if (floatingLabel) {
    window.MedoUI.injectCss("medo-textinput-float-css", MEDO_TI_FLOAT_CSS);
    const up = focused || String(current || "").length > 0 || !!placeholder;
    return React.createElement(
      FieldCmp,
      { htmlFor: fieldId, hint, error, success, fullWidth, className, style },
      React.createElement(
        "div",
        {
          className: [
            "medo-ti-float",
            up ? "medo-ti-float--up" : null,
            focused ? "medo-ti-float--focus" : null,
            error ? "medo-ti-float--error" : null,
            disabled ? "medo-ti-float--disabled" : null,
          ]
            .filter(Boolean)
            .join(" "),
        },
        box,
        React.createElement(
          "label",
          { className: "medo-ti-float__label", htmlFor: fieldId },
          label,
          required ? React.createElement("span", { className: "medo-ti-float__req" }, "*") : null
        )
      )
    );
  }

  return React.createElement(
    FieldCmp,
    { label, htmlFor: fieldId, required, optional, hint, error, success, fullWidth, className, style },
    box
  );
};

export { TextInput };
window.MedoUI = window.MedoUI || {};
window.MedoUI.TextInput = TextInput;
