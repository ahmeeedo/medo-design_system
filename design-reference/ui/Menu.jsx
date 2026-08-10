window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Menu (Kontextmenü)
   Öffnet auf Rechtsklick an der Cursorposition und kippt an den Rändern nach innen.
   Benutzt die gemeinsame Menüfläche MenuList aus ui/Dropdown.jsx.
   Esc, Klick außerhalb und Auswahl schließen; Pfeile/Enter/Home/End und Tippen wie im Dropdown. */

const MEDO_CTX_CSS = `
.medo-ctx{ display: block; }
.medo-ctx__layer{ position: fixed; inset: 0; z-index: 999; }
.medo-ctx__pop{ position: fixed; z-index: 1000; }
`;

const Menu = ({
  items = [],
  onSelect,
  children,
  ariaLabel = "Kontextmenü",
  disabled = false,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-context-menu-css", MEDO_CTX_CSS);

  const MenuListCmp = window.MedoUI && window.MedoUI.MenuList;
  const [pos, setPos] = React.useState(null);
  const popRef = React.useRef(null);

  const close = () => setPos(null);

  React.useEffect(() => {
    if (!pos) return;
    const scroll = () => close();
    window.addEventListener("scroll", scroll, true);
    window.addEventListener("resize", scroll);
    return () => {
      window.removeEventListener("scroll", scroll, true);
      window.removeEventListener("resize", scroll);
    };
  }, [pos]);

  /* Nach dem Einhängen messen und bei Platzmangel nach innen kippen. */
  React.useLayoutEffect(() => {
    if (!pos || pos.fixed || !popRef.current) return;
    const r = popRef.current.getBoundingClientRect();
    const pad = 8;
    let x = pos.x;
    let y = pos.y;
    if (x + r.width > window.innerWidth - pad) x = Math.max(pad, x - r.width);
    if (y + r.height > window.innerHeight - pad) y = Math.max(pad, y - r.height);
    setPos({ x, y, fixed: true });
  }, [pos]);

  const onContextMenu = (e) => {
    if (disabled) return;
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
  };

  return React.createElement(
    "div",
    {
      className: ["medo-ctx", className].filter(Boolean).join(" "),
      onContextMenu,
      style,
      ...rest,
    },
    children,
    pos
      ? React.createElement(
          React.Fragment,
          null,
          React.createElement("div", { className: "medo-ctx__layer", onMouseDown: close }),
          React.createElement(
            "div",
            {
              ref: popRef,
              className: "medo-ctx__pop",
              style: { top: pos.y + "px", left: pos.x + "px" },
            },
            MenuListCmp
              ? React.createElement(MenuListCmp, {
                  items,
                  ariaLabel,
                  onSelect,
                  onClose: close,
                })
              : null
          )
        )
      : null
  );
};

export { Menu };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Menu = Menu;
