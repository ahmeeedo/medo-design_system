window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Popover
   Klick-ausgelöste Fläche mit interaktivem Inhalt: Erklärung, kleines Formular, Kennzahlen.
   Anders als der Tooltip nimmt er die Maus an und bleibt offen, bis man ihn schließt.
   Wird per Portal an <body> gehängt, misst sich selbst und kippt bei Platzmangel. */

const MEDO_POP_CSS = `
.medo-pop{
  box-sizing: border-box;
  position: fixed;
  z-index: 1050;
  background: var(--medo-surface);
  border: var(--medo-border-thin) solid var(--medo-border);
  border-radius: var(--medo-radius-lg);
  box-shadow: var(--medo-shadow-lg);
  font-family: var(--medo-font-sans);
  color: var(--medo-text);
  width: 300px;
  max-width: calc(100vw - 24px);
  animation: medo-pop-in 140ms ease-out;
}
@keyframes medo-pop-in{ from{ opacity: 0; transform: translateY(-2px); } to{ opacity: 1; transform: none; } }
.medo-pop__head{
  display: flex;
  align-items: flex-start;
  gap: var(--medo-space-xs);
  padding: 14px 14px 0 16px;
}
.medo-pop__title{ flex: 1; font-size: var(--medo-text-sm); font-weight: 600; line-height: 1.4; }
.medo-pop__x{
  box-sizing: border-box;
  flex: none;
  appearance: none;
  border: none;
  width: 28px; height: 28px;
  margin: -4px -4px 0 0;
  border-radius: var(--medo-radius-md);
  background: transparent;
  color: var(--medo-icon);
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.medo-pop__x:hover{ background: var(--medo-state-hover); }
.medo-pop__x:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-pop__body{
  padding: 10px 16px 16px;
  font-size: var(--medo-text-sm);
  line-height: 1.6;
  color: var(--medo-text-subtle);
}
.medo-pop__head + .medo-pop__body{ padding-top: 6px; }
.medo-pop__arrow{
  position: absolute;
  width: 10px; height: 10px;
  background: var(--medo-surface);
  border-left: var(--medo-border-thin) solid var(--medo-border);
  border-top: var(--medo-border-thin) solid var(--medo-border);
  transform: rotate(45deg);
}
.medo-pop__trigger{ display: inline-flex; }
`;

const Popover = ({
  children,
  content,
  title,
  placement = "bottom",
  offset = 10,
  width,
  open: openProp,
  onOpenChange,
  closeLabel = "Schließen",
  className,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-popover-css", MEDO_POP_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const controlled = openProp !== undefined;
  const [inner, setInner] = React.useState(false);
  const open = controlled ? openProp : inner;
  const [pos, setPos] = React.useState(null);
  const triggerRef = React.useRef(null);
  const popRef = React.useRef(null);
  const uid = React.useMemo(() => "medo-pop-" + Math.random().toString(36).slice(2, 8), []);

  const set = (next) => {
    if (!controlled) setInner(next);
    if (onOpenChange) onOpenChange(next);
  };
  const close = () => {
    set(false);
    if (triggerRef.current && triggerRef.current.focus) triggerRef.current.focus();
  };

  React.useEffect(() => {
    if (!open) return;
    const away = (e) => {
      if (
        popRef.current && !popRef.current.contains(e.target) &&
        triggerRef.current && !triggerRef.current.contains(e.target)
      ) set(false);
    };
    const esc = (e) => e.key === "Escape" && close();
    const reflow = () => setPos(null);
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    window.addEventListener("scroll", reflow, true);
    window.addEventListener("resize", reflow);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", esc);
      window.removeEventListener("scroll", reflow, true);
      window.removeEventListener("resize", reflow);
    };
  }, [open]);

  /* Position nach dem Einhängen messen; reicht der Platz nicht, auf die Gegenseite kippen. */
  React.useLayoutEffect(() => {
    if (!open || !triggerRef.current || !popRef.current) return;
    const t = triggerRef.current.getBoundingClientRect();
    const p = popRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pad = 10;

    let side = placement;
    if (side === "bottom" && t.bottom + p.height + offset > vh - pad) side = "top";
    else if (side === "top" && t.top - p.height - offset < pad) side = "bottom";
    else if (side === "right" && t.right + p.width + offset > vw - pad) side = "left";
    else if (side === "left" && t.left - p.width - offset < pad) side = "right";

    let top;
    let left;
    if (side === "bottom") { top = t.bottom + offset; left = t.left + t.width / 2 - p.width / 2; }
    else if (side === "top") { top = t.top - p.height - offset; left = t.left + t.width / 2 - p.width / 2; }
    else if (side === "right") { top = t.top + t.height / 2 - p.height / 2; left = t.right + offset; }
    else { top = t.top + t.height / 2 - p.height / 2; left = t.left - p.width - offset; }

    left = Math.min(Math.max(pad, left), vw - p.width - pad);
    top = Math.min(Math.max(pad, top), vh - p.height - pad);

    const arrow = { transform: "rotate(45deg)" };
    if (side === "bottom" || side === "top") {
      const cx = t.left + t.width / 2 - left;
      arrow.left = Math.min(Math.max(14, cx - 5), p.width - 24) + "px";
      if (side === "bottom") { arrow.top = "-6px"; }
      else { arrow.bottom = "-6px"; arrow.transform = "rotate(225deg)"; }
    } else {
      const cy = t.top + t.height / 2 - top;
      arrow.top = Math.min(Math.max(14, cy - 5), p.height - 24) + "px";
      if (side === "right") { arrow.left = "-6px"; arrow.transform = "rotate(315deg)"; }
      else { arrow.right = "-6px"; arrow.transform = "rotate(135deg)"; }
    }
    setPos({ top, left, arrow });
  }, [open, placement, offset, title, content, width]);

  const child = React.Children.only(children);
  const trigger = React.cloneElement(child, {
    ref: triggerRef,
    "aria-haspopup": "dialog",
    "aria-expanded": open ? "true" : "false",
    "aria-controls": open ? uid : undefined,
    onClick: (e) => {
      set(!open);
      if (child.props.onClick) child.props.onClick(e);
    },
  });

  const pop =
    open && typeof document !== "undefined"
      ? ReactDOM.createPortal(
          React.createElement(
            "div",
            {
              ref: popRef,
              id: uid,
              role: "dialog",
              "aria-label": typeof title === "string" ? title : undefined,
              className: ["medo-pop", className].filter(Boolean).join(" "),
              style: Object.assign(
                { width: width ? (typeof width === "number" ? width + "px" : width) : undefined },
                pos ? { top: pos.top + "px", left: pos.left + "px" } : { top: 0, left: 0, visibility: "hidden" }
              ),
              ...rest,
            },
            title
              ? React.createElement(
                  "div",
                  { className: "medo-pop__head" },
                  React.createElement("div", { className: "medo-pop__title" }, title),
                  React.createElement(
                    "button",
                    { type: "button", className: "medo-pop__x", "aria-label": closeLabel, onClick: close },
                    IconCmp ? React.createElement(IconCmp, { name: "close", size: 20 }) : null
                  )
                )
              : null,
            React.createElement(
              "div",
              { className: "medo-pop__body" },
              typeof content === "function" ? content({ close }) : content
            ),
            React.createElement("span", {
              className: "medo-pop__arrow",
              "aria-hidden": "true",
              style: pos ? pos.arrow : { display: "none" },
            })
          ),
          document.body
        )
      : null;

  return React.createElement(React.Fragment, null, trigger, pop);
};

export { Popover };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Popover = Popover;
