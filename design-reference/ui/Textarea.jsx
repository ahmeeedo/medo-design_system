window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Textarea
   Mehrzeiliges Eingabefeld auf dem gemeinsamen Feld-Gerüst aus Field.jsx.
   Zustände: Ruhe, Hover, Fokus, gesperrt, schreibgeschützt, Fehler, Erfolg. */

const MEDO_TEXTAREA_CSS = `
/* Die einzeilige Feldhülle legt eine feste Höhe fest und zentriert ihren Inhalt.
   Beides muss hier weichen: die Höhe kommt von der Zeilenzahl.

   Die Textarea hat genau EINE Größe — deshalb steht keine Größenklasse auf der
   Hülle, und die Schriftgröße kommt von hier statt von .medo-field__box--md.
   text-base ist der Wert, den die Systemregel für md und lg ohnehin vorschreibt. */
.medo-ta__box{
  height: auto;
  align-items: flex-start;
  font-size: var(--medo-text-base);
  padding-top: var(--medo-space-xs);
  padding-bottom: var(--medo-space-xs);
}

.medo-ta__control{
  line-height: var(--medo-leading-normal);
  font-family: var(--medo-font-sans);
  /* Feste Systemregel: der Anwender zieht das Feld höher, nie breiter.
     Die Breite gehört dem Layout — würde sie ziehbar, bräche die Maske. */
  resize: vertical;
}

.medo-ta__counter{ align-self: flex-end; }
`;

const Textarea = ({
  label,
  id,
  value,
  defaultValue,
  placeholder,
  rows = 3,
  required = false,
  optional = false,
  disabled = false,
  readOnly = false,
  hint,
  error,
  success,
  maxLength,
  showCounter = false,
  onChange,
  onFocus,
  onBlur,
  fullWidth = false,
  name,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-textarea-css", MEDO_TEXTAREA_CSS);

  const FieldCmp = window.MedoUI && window.MedoUI.Field;

  /* Eine Vorbelegung mit der Zahl 0 ist ein gültiger Wert. `defaultValue || ""`
     verschluckte sie, weil 0 falsy ist. */
  const [internal, setInternal] = React.useState(
    defaultValue != null ? String(defaultValue) : ""
  );
  const [focused, setFocused] = React.useState(false);

  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const autoId = React.useId();
  const fieldId = id || autoId;

  const handleChange = (e) => {
    if (!isControlled) setInternal(e.target.value);
    if (onChange) onChange(e);
  };
  /* Die eigene Reaktion des Aufrufers verdrängt die eingebaute nicht — sonst
     verschwände der Fokusrahmen still, sobald jemand onFocus mitgibt. */
  const handleFocus = (e) => {
    setFocused(true);
    if (onFocus) onFocus(e);
  };
  const handleBlur = (e) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };

  const msgId = error || success || hint ? fieldId + "-msg" : null;
  /* Eine eigene Verknüpfung des Aufrufers tritt neben die zur Meldung, statt sie
     zu ersetzen. aria-describedby verträgt mehrere durch Leerzeichen getrennte
     Verweise; das ist genau der vorgesehene Weg. */
  const describedBy = [rest["aria-describedby"], msgId].filter(Boolean).join(" ") || undefined;
  /* Die eingebaute Fehlerkennzeichnung bleibt bestehen: ein Feld, unter dem eine
     rote Meldung steht, ist fehlerhaft — auch wenn der Aufrufer etwas anderes
     mitgibt. Ohne Fehler entscheidet weiterhin der Aufrufer. */
  const invalid = error ? "true" : rest["aria-invalid"];

  const boxClasses = [
    "medo-field__box",
    "medo-ta__box",
    focused && !disabled ? "medo-field__box--focus" : null,
    error ? "medo-field__box--error" : null,
    success && !error ? "medo-field__box--success" : null,
    disabled ? "medo-field__box--disabled" : null,
    readOnly && !disabled ? "medo-field__box--readonly" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return React.createElement(
    FieldCmp,
    {
      label: label,
      htmlFor: fieldId,
      required: required,
      optional: optional,
      hint: hint,
      error: error,
      success: success,
      fullWidth: fullWidth,
      className: className,
      style: style,
    },
    React.createElement(
      "div",
      { className: boxClasses },
      React.createElement(
        "textarea",
        Object.assign({}, rest, {
          id: fieldId,
          className: "medo-field__control medo-ta__control",
          rows: rows,
          value: current,
          placeholder: placeholder,
          disabled: disabled,
          readOnly: readOnly,
          required: required,
          maxLength: maxLength,
          name: name,
          "aria-invalid": invalid,
          "aria-describedby": describedBy,
          onChange: handleChange,
          onFocus: handleFocus,
          onBlur: handleBlur,
        })
      ),
      showCounter && maxLength
        ? React.createElement(
            "span",
            { className: "medo-field__counter medo-ta__counter" },
            String(current || "").length + "/" + maxLength
          )
        : null
    )
  );
};

export { Textarea };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Textarea = Textarea;
