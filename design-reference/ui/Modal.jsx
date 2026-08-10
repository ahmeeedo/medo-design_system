window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Modal
   Sperrt die Seite für eine Entscheidung. Drei Formen über `size`: md (Standard mit Formular),
   sm (Bestätigung) und sm + tone="danger" (zerstörend).
   Scrim rgba(23,21,19,0.5), Fokusfalle, Esc und Kreuz schließen — der Scrim NICHT. */

const MEDO_MODAL_CSS = `
.medo-mod__scrim{
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: var(--medo-scrim);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: medo-mod-fade 180ms ease-out;
}
@keyframes medo-mod-fade{ from{ opacity: 0; } to{ opacity: 1; } }
.medo-mod{
  box-sizing: border-box;
  background: var(--medo-surface);
  border-radius: var(--medo-radius-xl);
  box-shadow: var(--medo-shadow-xl);
  font-family: var(--medo-font-sans);
  color: var(--medo-text);
  width: 100%;
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  animation: medo-mod-pop 200ms ease-out;
}
@keyframes medo-mod-pop{ from{ opacity: 0; transform: translateY(8px) scale(0.99); } to{ opacity: 1; transform: none; } }
.medo-mod--sm{ max-width: 420px; }
.medo-mod--md{ max-width: 560px; }
.medo-mod--lg{ max-width: 760px; }
.medo-mod__head{
  display: flex;
  align-items: flex-start;
  gap: var(--medo-space-sm);
  padding: 24px 24px 0;
}
.medo-mod__ic{
  flex: none;
  width: 40px; height: 40px;
  border-radius: var(--medo-radius-full);
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--medo-surface-sunken);
  color: var(--medo-icon);
}
.medo-mod__ic--danger{ background: var(--medo-error-surface); color: var(--medo-error-solid); }
.medo-mod__ic--warning{ background: var(--medo-warning-surface); color: var(--medo-warning-solid); }
.medo-mod__ic--success{ background: var(--medo-success-surface); color: var(--medo-success-solid); }
.medo-mod__htext{ flex: 1; min-width: 0; }
.medo-mod__title{ font-size: var(--medo-text-lg); font-weight: 600; letter-spacing: -0.01em; line-height: 1.35; }
.medo-mod--sm .medo-mod__title{ font-size: var(--medo-text-base); }
.medo-mod__sub{ font-size: var(--medo-text-sm); color: var(--medo-text-muted); margin-top: 4px; line-height: 1.5; }
.medo-mod__x{
  box-sizing: border-box;
  flex: none;
  appearance: none; border: none;
  width: 36px; height: 36px;
  margin: -6px -6px 0 0;
  border-radius: var(--medo-radius-md);
  background: transparent;
  color: var(--medo-icon);
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.medo-mod__x:hover{ background: var(--medo-state-hover); }
.medo-mod__x:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-mod__body{
  padding: 16px 24px 0;
  overflow-y: auto;
  font-size: var(--medo-text-sm);
  line-height: 1.6;
  color: var(--medo-text-subtle);
}
.medo-mod__foot{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--medo-space-sm);
  padding: 24px;
}
.medo-mod__foot--between{ justify-content: space-between; }
.medo-mod__btn{
  box-sizing: border-box;
  appearance: none;
  font-family: inherit;
  font-size: var(--medo-text-sm);
  font-weight: 400;
  height: 40px;
  padding: 0 16px;
  border-radius: var(--medo-radius-md);
  border: var(--medo-border-thin) solid transparent;
  cursor: pointer;
  transition: background-color 120ms ease-out;
}
.medo-mod__btn:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-mod__btn--ghost{ background: transparent; color: var(--medo-text); }
.medo-mod__btn--ghost:hover{ background: var(--medo-state-hover); }
.medo-mod__btn--primary{ background: var(--medo-action); color: var(--medo-action-text); }
.medo-mod__btn--primary:hover{ background: var(--medo-action-hover); }
.medo-mod__btn--danger{ background: var(--medo-error-solid); color: var(--medo-error-on-solid); }
.medo-mod__btn--danger:hover{ background: var(--medo-error-solid-hover); }
.medo-mod__btn--danger:focus-visible{ box-shadow: 0 0 0 3px var(--medo-focus-ring-danger, var(--medo-focus-ring)); }
`;

const Modal = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  size = "md",
  tone = "neutral",
  icon,
  confirmLabel,
  onConfirm,
  cancelLabel = "Abbrechen",
  secondary,
  footer,
  closeLabel = "Schließen",
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-modal-css", MEDO_MODAL_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const boxRef = React.useRef(null);
  const returnRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    returnRef.current = document.activeElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (onClose) onClose();
        return;
      }
      /* Fokusfalle: Tab bleibt im Dialog. */
      if (e.key !== "Tab" || !boxRef.current) return;
      const f = boxRef.current.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);

    const t = setTimeout(() => {
      if (!boxRef.current) return;
      const target = boxRef.current.querySelector("[data-autofocus]") ||
        boxRef.current.querySelector('input:not(:disabled), button:not(:disabled)');
      if (target) target.focus();
    }, 40);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
      if (returnRef.current && returnRef.current.focus) returnRef.current.focus();
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  const uid = "medo-mod-title";

  return ReactDOM.createPortal(
    React.createElement(
      "div",
      { className: "medo-mod__scrim" },
      React.createElement(
        "div",
        {
          ref: boxRef,
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": uid,
          className: ["medo-mod", "medo-mod--" + size, className].filter(Boolean).join(" "),
          style,
          ...rest,
        },
        React.createElement(
          "div",
          { className: "medo-mod__head" },
          icon && IconCmp
            ? React.createElement(
                "span",
                {
                  className: ["medo-mod__ic", tone !== "neutral" ? "medo-mod__ic--" + tone : null]
                    .filter(Boolean)
                    .join(" "),
                  "aria-hidden": "true",
                },
                React.createElement(IconCmp, { name: icon, size: 22 })
              )
            : null,
          React.createElement(
            "div",
            { className: "medo-mod__htext" },
            React.createElement("div", { id: uid, className: "medo-mod__title" }, title),
            subtitle ? React.createElement("div", { className: "medo-mod__sub" }, subtitle) : null
          ),
          React.createElement(
            "button",
            { type: "button", className: "medo-mod__x", "aria-label": closeLabel, onClick: onClose },
            IconCmp ? React.createElement(IconCmp, { name: "close", size: 22 }) : null
          )
        ),
        children ? React.createElement("div", { className: "medo-mod__body" }, children) : null,
        footer !== undefined
          ? footer
            ? React.createElement("div", { className: "medo-mod__foot" }, footer)
            : null
          : React.createElement(
              "div",
              {
                className: ["medo-mod__foot", secondary ? "medo-mod__foot--between" : null]
                  .filter(Boolean)
                  .join(" "),
              },
              secondary || null,
              React.createElement(
                "div",
                { style: { display: "flex", gap: "12px", alignItems: "center" } },
                React.createElement(
                  "button",
                  { type: "button", className: "medo-mod__btn medo-mod__btn--ghost", onClick: onClose },
                  cancelLabel
                ),
                confirmLabel
                  ? React.createElement(
                      "button",
                      {
                        type: "button",
                        "data-autofocus": tone === "danger" ? undefined : "true",
                        className:
                          "medo-mod__btn " +
                          (tone === "danger" ? "medo-mod__btn--danger" : "medo-mod__btn--primary"),
                        onClick: onConfirm,
                      },
                      confirmLabel
                    )
                  : null
              )
            )
      )
    ),
    document.body
  );
};

export { Modal };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Modal = Modal;
