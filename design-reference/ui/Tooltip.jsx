window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Tooltip
   Kurze Erklärung bei Hover oder Fokus. Rein informativ, nicht interaktiv.
   Dunkler Stil mit Pfeil, vier Positionen, kippt bei Platzmangel auf die Gegenseite.
   Wird über ReactDOM.createPortal an <body> gehängt, damit kein Container ihn abschneidet. */

const MEDO_TOOLTIP_CSS = `
.medo-tt{
  box-sizing: border-box;
  position: fixed;
  z-index: 1100;
  background: var(--medo-color-stone-1000);
  color: var(--medo-color-white);
  font-family: var(--medo-font-sans);
  font-size: 13px;
  line-height: 1.45;
  padding: 7px 11px;
  border-radius: 7px;
  max-width: 260px;
  pointer-events: none;
  box-shadow: var(--medo-shadow-md);
  animation: medo-tt-in 120ms ease-out;
}
@keyframes medo-tt-in{ from{ opacity: 0; } to{ opacity: 1; } }
.medo-tt--rich{ padding: 11px 13px; }
.medo-tt__title{ font-size: 13px; font-weight: 600; margin-bottom: 3px; }
.medo-tt__text{ font-size: var(--medo-text-xs); line-height: 1.5; color: rgba(255,255,255,0.80); }
.medo-tt__arrow{
  position: absolute;
  width: 8px; height: 8px;
  background: var(--medo-color-stone-1000);
  border-radius: 1px;
  transform: rotate(45deg);
}
.medo-tt__trigger{ display: inline-flex; }
`;

const Tooltip = ({
  children,
  content,
  title,
  placement = "top",
  delay = 400,
  offset = 10,
  disabled = false,
  className,
}) => {
  window.MedoUI.injectCss("medo-tooltip-css", MEDO_TOOLTIP_CSS);

  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState(null);
  const triggerRef = React.useRef(null);
  const tipRef = React.useRef(null);
  const timerRef = React.useRef(null);

  const generatedId = React.useMemo(
    () => "medo-tt-" + Math.random().toString(36).slice(2, 8),
    []
  );

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  const show = (immediate) => {
    if (disabled || (!content && !title)) return;
    clearTimeout(timerRef.current);
    if (immediate) setOpen(true);
    else timerRef.current = setTimeout(() => setOpen(true), delay);
  };
  /* Öffnen verzögert, Schließen sofort. */
  const hide = () => {
    clearTimeout(timerRef.current);
    setOpen(false);
  };

  /* Position nach dem Einhängen messen, damit die echte Größe bekannt ist. */
  React.useLayoutEffect(() => {
    if (!open || !triggerRef.current || !tipRef.current) return;
    const t = triggerRef.current.getBoundingClientRect();
    const p = tipRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pad = 8;

    let side = placement;
    /* Auto-Flip: reicht der Platz auf der gewünschten Seite nicht, auf die Gegenseite kippen. */
    if (side === "top" && t.top - p.height - offset < pad) side = "bottom";
    else if (side === "bottom" && t.bottom + p.height + offset > vh - pad) side = "top";
    else if (side === "left" && t.left - p.width - offset < pad) side = "right";
    else if (side === "right" && t.right + p.width + offset > vw - pad) side = "left";

    let top, left;
    if (side === "top") { top = t.top - p.height - offset; left = t.left + t.width / 2 - p.width / 2; }
    else if (side === "bottom") { top = t.bottom + offset; left = t.left + t.width / 2 - p.width / 2; }
    else if (side === "left") { top = t.top + t.height / 2 - p.height / 2; left = t.left - p.width - offset; }
    else { top = t.top + t.height / 2 - p.height / 2; left = t.right + offset; }

    /* Innerhalb des Sichtfensters halten */
    left = Math.min(Math.max(pad, left), vw - p.width - pad);
    top = Math.min(Math.max(pad, top), vh - p.height - pad);

    /* Pfeil auf die Mitte des Auslösers ausrichten, nicht auf die Mitte des Tooltips */
    const arrow = {};
    if (side === "top" || side === "bottom") {
      const cx = t.left + t.width / 2 - left;
      arrow.left = Math.min(Math.max(10, cx - 4), p.width - 18) + "px";
      arrow[side === "top" ? "bottom" : "top"] = "-4px";
    } else {
      const cy = t.top + t.height / 2 - top;
      arrow.top = Math.min(Math.max(10, cy - 4), p.height - 18) + "px";
      arrow[side === "left" ? "right" : "left"] = "-4px";
    }
    setPos({ top, left, arrow });
  }, [open, placement, offset, content, title]);

  const child = React.Children.only(children);
  const trigger = React.cloneElement(child, {
    ref: triggerRef,
    "aria-describedby": open ? generatedId : undefined,
    onMouseEnter: (e) => { show(false); if (child.props.onMouseEnter) child.props.onMouseEnter(e); },
    onMouseLeave: (e) => { hide(); if (child.props.onMouseLeave) child.props.onMouseLeave(e); },
    /* Bei Tastaturfokus sofort, ohne Verzögerung. */
    onFocus: (e) => { show(true); if (child.props.onFocus) child.props.onFocus(e); },
    onBlur: (e) => { hide(); if (child.props.onBlur) child.props.onBlur(e); },
  });

  const tip =
    open && typeof document !== "undefined"
      ? ReactDOM.createPortal(
          React.createElement(
            "div",
            {
              ref: tipRef,
              id: generatedId,
              role: "tooltip",
              className: ["medo-tt", title ? "medo-tt--rich" : null, className]
                .filter(Boolean)
                .join(" "),
              style: pos
                ? { top: pos.top + "px", left: pos.left + "px" }
                : { top: 0, left: 0, visibility: "hidden" },
            },
            title ? React.createElement("div", { className: "medo-tt__title" }, title) : null,
            content
              ? React.createElement(
                  title ? "div" : React.Fragment,
                  title ? { className: "medo-tt__text" } : null,
                  content
                )
              : null,
            React.createElement("span", {
              className: "medo-tt__arrow",
              style: pos ? pos.arrow : { display: "none" },
            })
          ),
          document.body
        )
      : null;

  return React.createElement(React.Fragment, null, trigger, tip);
};

export { Tooltip };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Tooltip = Tooltip;
