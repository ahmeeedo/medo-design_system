window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Dropdown (+ MenuList)
   Auslöser mit Menü: Schaltfläche mit Chevron oder Kebab-Icon.
   `MenuList` ist die gemeinsame Menüfläche des Systems — Menu, MenuButtons und Select-artige
   Auslöser benutzen sie mit; deshalb liegt sie hier und registriert sich unter window.MedoUI.
   Tastatur: Pfeile bewegen, Enter wählt, Esc schließt, Home/End an die Ränder, Tippen springt. */

const MEDO_MENU_CSS = `
.medo-menu{
  box-sizing: border-box;
  min-width: 200px;
  padding: 6px;
  background: var(--medo-surface);
  border: var(--medo-border-thin) solid var(--medo-border);
  border-radius: var(--medo-radius-md);
  box-shadow: var(--medo-shadow-md);
  font-family: var(--medo-font-sans);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}
.medo-menu:focus{ outline: none; }
.medo-menu__item{
  box-sizing: border-box;
  appearance: none;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: var(--medo-text-sm);
  color: var(--medo-text);
  text-align: left;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}
.medo-menu__item:hover:not(:disabled),
.medo-menu__item[data-active="true"]{ background: var(--medo-state-hover); }
.medo-menu__item:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-menu__item:disabled{ color: var(--medo-text-disabled); cursor: not-allowed; }
.medo-menu__item--danger{ color: var(--medo-error-solid); }
.medo-menu__item--danger:hover:not(:disabled),
.medo-menu__item--danger[data-active="true"]{ background: var(--medo-error-surface); }
.medo-menu__ic{ flex: none; color: var(--medo-icon-muted); }
.medo-menu__item--danger .medo-menu__ic{ color: var(--medo-error-solid); }
.medo-menu__item:disabled .medo-menu__ic{ color: var(--medo-icon-disabled); }
.medo-menu__lbl{ flex: 1; min-width: 0; }
.medo-menu__sc{
  flex: none;
  font-family: var(--medo-font-mono);
  font-size: var(--medo-text-xs);
  color: var(--medo-text-muted);
}
.medo-menu__heading{
  font-family: var(--medo-font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--medo-text-muted);
  padding: 10px 10px 6px;
}
.medo-menu__div{
  height: var(--medo-border-thin);
  background: var(--medo-divider);
  margin: 5px 6px;
}
.medo-menu__sub{ position: relative; display: flex; }
.medo-menu__subwrap{ position: absolute; top: -6px; left: 100%; margin-left: 4px; }

.medo-dd{ position: relative; display: inline-flex; }
.medo-dd__pop{ position: absolute; z-index: 1000; }
.medo-dd__btn{
  box-sizing: border-box;
  appearance: none;
  font-family: var(--medo-font-sans);
  font-size: var(--medo-text-sm);
  font-weight: 400;
  height: 40px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: var(--medo-border-thin) solid var(--medo-border-strong);
  border-radius: var(--medo-radius-md);
  background: var(--medo-surface);
  color: var(--medo-text);
  cursor: pointer;
  transition: background-color 120ms ease-out;
}
.medo-dd__btn:hover:not(:disabled){ background: var(--medo-state-hover); }
.medo-dd__btn:active:not(:disabled){ background: var(--medo-state-pressed); }
.medo-dd__btn:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-dd__btn:disabled{ color: var(--medo-text-disabled); border-color: var(--medo-border-disabled); cursor: not-allowed; }
.medo-dd__btn--sm{ height: 32px; padding: 0 12px; font-size: var(--medo-text-xs); }
.medo-dd__btn--kebab{
  width: 40px; height: 40px; padding: 0;
  justify-content: center;
  border-color: transparent;
  background: transparent;
  color: var(--medo-icon);
}
.medo-dd__btn--kebab.medo-dd__btn--sm{ width: 32px; height: 32px; }
.medo-dd__chev{ flex: none; transition: transform 160ms ease-out; }
.medo-dd__btn[aria-expanded="true"] .medo-dd__chev{ transform: rotate(180deg); }
`;

/* Gemeinsame Menüfläche. Items: {value,label,icon,shortcut,danger,disabled,checked,items}
   sowie {type:"divider"} und {type:"heading",label}. */
const MenuList = ({
  items = [],
  onSelect,
  onClose,
  autoFocus = true,
  ariaLabel,
  minWidth,
  selectionMode,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-menu-css", MEDO_MENU_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const ref = React.useRef(null);
  const [openSub, setOpenSub] = React.useState(null);
  const typed = React.useRef({ text: "", t: 0 });

  const rows = () =>
    Array.prototype.slice.call(ref.current.querySelectorAll(":scope > .medo-menu__item:not(:disabled), :scope > .medo-menu__sub > .medo-menu__item:not(:disabled)"));

  React.useEffect(() => {
    if (!autoFocus || !ref.current) return;
    const r = rows();
    if (r.length) r[0].focus();
    else ref.current.focus();
  }, []);

  const move = (dir) => {
    const r = rows();
    if (!r.length) return;
    const i = r.indexOf(document.activeElement);
    const next = dir === "first" ? r[0] : dir === "last" ? r[r.length - 1] : r[(i + dir + r.length) % r.length];
    next.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Home") { e.preventDefault(); move("first"); }
    else if (e.key === "End") { e.preventDefault(); move("last"); }
    else if (e.key === "Escape") { e.preventDefault(); if (onClose) onClose(); }
    else if (e.key.length === 1 && /\S/.test(e.key)) {
      /* Tippen springt zum passenden Eintrag. */
      const now = Date.now();
      typed.current.text = now - typed.current.t < 800 ? typed.current.text + e.key : e.key;
      typed.current.t = now;
      const q = typed.current.text.toLowerCase();
      /* Nur der Labeltext zählt — Icon-Ligatur und Kürzel bleiben außen vor. */
      const hit = rows().find((el) => {
        const lbl = el.querySelector(".medo-menu__lbl") || el;
        return (lbl.textContent || "").trim().toLowerCase().indexOf(q) === 0;
      });
      if (hit) hit.focus();
    }
  };

  const pick = (it) => {
    if (it.disabled) return;
    if (onSelect) onSelect(it.value, it);
    if (onClose && !it.keepOpen) onClose();
  };

  const renderItem = (it, i) => {
    if (it.type === "divider")
      return React.createElement("div", { key: "d" + i, className: "medo-menu__div", role: "separator" });
    if (it.type === "heading")
      return React.createElement("div", { key: "h" + i, className: "medo-menu__heading", role: "presentation" }, it.label);

    const hasSub = it.items && it.items.length;
    const checkable = selectionMode === "single" || selectionMode === "multiple" || it.checked !== undefined;

    const button = React.createElement(
      it.href ? "a" : "button",
      {
        key: i,
        type: it.href ? undefined : "button",
        href: it.href,
        role: hasSub
          ? "menuitem"
          : selectionMode === "single"
          ? "menuitemradio"
          : selectionMode === "multiple"
          ? "menuitemcheckbox"
          : "menuitem",
        "aria-checked": checkable ? (it.checked ? "true" : "false") : undefined,
        "aria-haspopup": hasSub ? "menu" : undefined,
        "aria-expanded": hasSub ? (openSub === i ? "true" : "false") : undefined,
        tabIndex: -1,
        disabled: it.disabled ? true : undefined,
        className: ["medo-menu__item", it.danger ? "medo-menu__item--danger" : null]
          .filter(Boolean)
          .join(" "),
        onClick: (e) => {
          if (hasSub) { e.preventDefault(); setOpenSub(openSub === i ? null : i); return; }
          pick(it);
        },
        onMouseEnter: () => hasSub && setOpenSub(i),
        onKeyDown: (e) => {
          if (hasSub && e.key === "ArrowRight") { e.preventDefault(); setOpenSub(i); }
          else if (!hasSub && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); pick(it); }
          else if (e.key === "ArrowLeft" && onClose) { e.preventDefault(); onClose(); }
        },
      },
      checkable
        ? React.createElement(
            "span",
            { className: "medo-menu__ic", style: { width: "20px", display: "inline-flex" }, "aria-hidden": "true" },
            it.checked && IconCmp ? React.createElement(IconCmp, { name: "check", size: 20 }) : null
          )
        : it.icon && IconCmp
        ? React.createElement(IconCmp, { name: it.icon, size: 20, className: "medo-menu__ic" })
        : null,
      React.createElement("span", { className: "medo-menu__lbl" }, it.label),
      it.shortcut ? React.createElement("span", { className: "medo-menu__sc" }, it.shortcut) : null,
      hasSub && IconCmp
        ? React.createElement(IconCmp, { name: "chevron_right", size: 20, className: "medo-menu__ic" })
        : null
    );

    if (!hasSub) return button;

    return React.createElement(
      "div",
      { key: i, className: "medo-menu__sub", onMouseLeave: () => setOpenSub(null) },
      button,
      openSub === i
        ? React.createElement(
            "div",
            { className: "medo-menu__subwrap" },
            React.createElement(MenuList, {
              items: it.items,
              onSelect,
              onClose,
              autoFocus: false,
            })
          )
        : null
    );
  };

  return React.createElement(
    "div",
    {
      ref,
      role: "menu",
      "aria-label": ariaLabel,
      tabIndex: -1,
      onKeyDown,
      className: ["medo-menu", className].filter(Boolean).join(" "),
      style: minWidth ? { minWidth: minWidth, ...style } : style,
      ...rest,
    },
    items.map(renderItem)
  );
};

const Dropdown = ({
  label,
  icon,
  trigger = "button",
  items = [],
  onSelect,
  size = "md",
  align = "start",
  selectionMode,
  disabled = false,
  menuMinWidth,
  ariaLabel,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-menu-css", MEDO_MENU_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef(null);
  const btnRef = React.useRef(null);
  const kebab = trigger === "kebab";

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

  return React.createElement(
    "div",
    { ref: wrapRef, className: ["medo-dd", className].filter(Boolean).join(" "), style, ...rest },
    React.createElement(
      "button",
      {
        ref: btnRef,
        type: "button",
        className: [
          "medo-dd__btn",
          size === "sm" ? "medo-dd__btn--sm" : null,
          kebab ? "medo-dd__btn--kebab" : null,
        ]
          .filter(Boolean)
          .join(" "),
        "aria-haspopup": "menu",
        "aria-expanded": open ? "true" : "false",
        "aria-label": kebab ? ariaLabel || "Weitere Aktionen" : undefined,
        disabled,
        onClick: () => setOpen(!open),
        onKeyDown: (e) => {
          if (e.key === "ArrowDown" || (e.key === "Enter" && !open)) {
            e.preventDefault();
            setOpen(true);
          }
        },
      },
      kebab
        ? IconCmp
          ? React.createElement(IconCmp, { name: icon || "more_vert", size: size === "sm" ? 20 : 22 })
          : null
        : [
            icon && IconCmp
              ? React.createElement(IconCmp, { key: "i", name: icon, size: size === "sm" ? 18 : 20 })
              : null,
            React.createElement("span", { key: "l" }, label),
            IconCmp
              ? React.createElement(IconCmp, {
                  key: "c",
                  name: "expand_more",
                  size: size === "sm" ? 18 : 20,
                  className: "medo-dd__chev",
                })
              : null,
          ]
    ),
    open
      ? React.createElement(
          "div",
          {
            className: "medo-dd__pop",
            style: {
              top: "calc(100% + 6px)",
              left: align === "start" ? 0 : "auto",
              right: align === "end" ? 0 : "auto",
            },
          },
          React.createElement(MenuList, {
            items,
            onSelect,
            onClose: close,
            selectionMode,
            minWidth: menuMinWidth,
            ariaLabel: ariaLabel || label,
          })
        )
      : null
  );
};

export { Dropdown, MenuList };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Dropdown = Dropdown;
window.MedoUI.MenuList = MenuList;
