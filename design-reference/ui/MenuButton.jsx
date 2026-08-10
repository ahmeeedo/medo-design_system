window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · MenuButtons
   Drei Formen: MenuButton (eine Schaltfläche, die ein Menü öffnet), SplitButton (Hauptaktion
   links, Menü rechts hinter einer Trennlinie) und IconMenuButton (40px, nur Icon).
   Menüfläche ist MenuList aus ui/Dropdown.jsx. Nur eine Größe: md, 40px hoch. */

const MEDO_MB_CSS = `
.medo-mb{ position: relative; display: inline-flex; font-family: var(--medo-font-sans); }
.medo-mb__pop{ position: absolute; top: calc(100% + 6px); z-index: 1000; }
.medo-mb__btn{
  box-sizing: border-box;
  appearance: none;
  font-family: inherit;
  font-size: var(--medo-text-sm);
  font-weight: 400;
  height: 40px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: var(--medo-border-thin) solid transparent;
  border-radius: var(--medo-radius-md);
  cursor: pointer;
  transition: background-color 120ms ease-out;
}
.medo-mb__btn:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); z-index: 2; }
.medo-mb__btn--primary{ background: var(--medo-action); color: var(--medo-action-text); }
.medo-mb__btn--primary:hover:not(:disabled){ background: var(--medo-action-hover); }
.medo-mb__btn--primary:active:not(:disabled){ background: var(--medo-action-active); }
.medo-mb__btn--neutral{
  background: var(--medo-surface);
  color: var(--medo-text);
  border-color: var(--medo-border-strong);
}
.medo-mb__btn--neutral:hover:not(:disabled){ background: var(--medo-state-hover); }
.medo-mb__btn--neutral:active:not(:disabled){ background: var(--medo-state-pressed); }
.medo-mb__btn:disabled{
  background: var(--medo-action-disabled);
  color: var(--medo-action-text-disabled);
  border-color: transparent;
  cursor: not-allowed;
}
.medo-mb__btn--icon{ width: 40px; padding: 0; justify-content: center; }
.medo-mb__chev{ flex: none; transition: transform 160ms ease-out; }
.medo-mb__btn[aria-expanded="true"] .medo-mb__chev{ transform: rotate(180deg); }

/* Split: zwei Flächen, eine Fuge */
.medo-mb__split{ display: inline-flex; }
.medo-mb__split .medo-mb__btn:first-child{ border-top-right-radius: 0; border-bottom-right-radius: 0; }
.medo-mb__split .medo-mb__btn:last-child{
  border-top-left-radius: 0; border-bottom-left-radius: 0;
  width: 40px; padding: 0; justify-content: center;
}
.medo-mb__split--primary .medo-mb__btn:last-child{ box-shadow: inset 1px 0 0 rgba(255,255,255,0.28); }
.medo-mb__split--neutral .medo-mb__btn:last-child{ margin-left: -1px; }
`;

const medoMbUseMenu = () => {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef(null);
  const btnRef = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const away = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [open]);
  const close = () => {
    setOpen(false);
    if (btnRef.current) btnRef.current.focus();
  };
  return { open, setOpen, close, wrapRef, btnRef };
};

const medoMbPop = (items, onSelect, close, align, ariaLabel) => {
  const MenuListCmp = window.MedoUI && window.MedoUI.MenuList;
  return React.createElement(
    "div",
    {
      className: "medo-mb__pop",
      style: { left: align === "start" ? 0 : "auto", right: align === "end" ? 0 : "auto" },
    },
    MenuListCmp
      ? React.createElement(MenuListCmp, { items, onSelect, onClose: close, ariaLabel })
      : null
  );
};

const MenuButton = ({
  label,
  icon,
  items = [],
  onSelect,
  variant = "primary",
  align = "start",
  disabled = false,
  ariaLabel,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-menubuttons-css", MEDO_MB_CSS);
  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const m = medoMbUseMenu();

  return React.createElement(
    "div",
    { ref: m.wrapRef, className: ["medo-mb", className].filter(Boolean).join(" "), style, ...rest },
    React.createElement(
      "button",
      {
        ref: m.btnRef,
        type: "button",
        className: ["medo-mb__btn", "medo-mb__btn--" + variant].join(" "),
        "aria-haspopup": "menu",
        "aria-expanded": m.open ? "true" : "false",
        disabled,
        onClick: () => m.setOpen(!m.open),
        onKeyDown: (e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); m.setOpen(true); }
        },
      },
      icon && IconCmp ? React.createElement(IconCmp, { name: icon, size: 20 }) : null,
      React.createElement("span", null, label),
      IconCmp
        ? React.createElement(IconCmp, { name: "expand_more", size: 20, className: "medo-mb__chev" })
        : null
    ),
    m.open ? medoMbPop(items, onSelect, m.close, align, ariaLabel || label) : null
  );
};

const SplitButton = ({
  label,
  icon,
  onClick,
  items = [],
  onSelect,
  variant = "primary",
  align = "end",
  disabled = false,
  menuLabel = "Weitere Varianten",
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-menubuttons-css", MEDO_MB_CSS);
  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const m = medoMbUseMenu();

  return React.createElement(
    "div",
    { ref: m.wrapRef, className: ["medo-mb", className].filter(Boolean).join(" "), style, ...rest },
    React.createElement(
      "div",
      { className: ["medo-mb__split", "medo-mb__split--" + variant].join(" ") },
      React.createElement(
        "button",
        {
          type: "button",
          className: ["medo-mb__btn", "medo-mb__btn--" + variant].join(" "),
          disabled,
          onClick,
        },
        icon && IconCmp ? React.createElement(IconCmp, { name: icon, size: 20 }) : null,
        React.createElement("span", null, label)
      ),
      React.createElement(
        "button",
        {
          ref: m.btnRef,
          type: "button",
          className: ["medo-mb__btn", "medo-mb__btn--" + variant].join(" "),
          "aria-haspopup": "menu",
          "aria-expanded": m.open ? "true" : "false",
          "aria-label": menuLabel,
          disabled,
          onClick: () => m.setOpen(!m.open),
          onKeyDown: (e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); m.setOpen(true); }
          },
        },
        IconCmp
          ? React.createElement(IconCmp, { name: "expand_more", size: 20, className: "medo-mb__chev" })
          : null
      )
    ),
    m.open ? medoMbPop(items, onSelect, m.close, align, menuLabel) : null
  );
};

const IconMenuButton = ({
  icon = "more_vert",
  items = [],
  onSelect,
  variant = "neutral",
  align = "end",
  disabled = false,
  ariaLabel = "Weitere Aktionen",
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-menubuttons-css", MEDO_MB_CSS);
  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const m = medoMbUseMenu();

  return React.createElement(
    "div",
    { ref: m.wrapRef, className: ["medo-mb", className].filter(Boolean).join(" "), style, ...rest },
    React.createElement(
      "button",
      {
        ref: m.btnRef,
        type: "button",
        className: ["medo-mb__btn", "medo-mb__btn--" + variant, "medo-mb__btn--icon"].join(" "),
        "aria-haspopup": "menu",
        "aria-expanded": m.open ? "true" : "false",
        "aria-label": ariaLabel,
        disabled,
        onClick: () => m.setOpen(!m.open),
        onKeyDown: (e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); m.setOpen(true); }
        },
      },
      IconCmp ? React.createElement(IconCmp, { name: icon, size: 22 }) : null
    ),
    m.open ? medoMbPop(items, onSelect, m.close, align, ariaLabel) : null
  );
};

export { MenuButton, SplitButton, IconMenuButton };
window.MedoUI = window.MedoUI || {};
window.MedoUI.MenuButton = MenuButton;
window.MedoUI.SplitButton = SplitButton;
window.MedoUI.IconMenuButton = IconMenuButton;
