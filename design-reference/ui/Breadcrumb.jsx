window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Breadcrumb
   Zeigt den Weg zur aktuellen Seite und führt zurück. Trenner ist ein Schrägstrich.
   Die letzte Stufe ist die aktuelle Seite: kein Link, aria-current="page".
   Bei zu vielen Stufen kollabiert die Mitte in ein …-Menü. */

const MEDO_BC_CSS = `
.medo-bc{ font-family: var(--medo-font-sans); }
.medo-bc__list{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--medo-text-sm);
}
.medo-bc--md .medo-bc__list{ font-size: var(--medo-text-base); }
.medo-bc__li{ display: inline-flex; align-items: center; gap: 8px; min-width: 0; }
.medo-bc__sep{ color: var(--medo-color-stone-400); user-select: none; }
.medo-bc__link{
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--medo-text-link);
  text-decoration: none;
  border-radius: var(--medo-radius-sm);
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.medo-bc__link:hover{ color: var(--medo-text-link-hover); }
.medo-bc__link:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-bc__current{
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--medo-text-muted);
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.medo-bc__more{ position: relative; display: inline-flex; }
.medo-bc__dots{
  appearance: none;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  color: var(--medo-text-link);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: var(--medo-radius-sm);
  line-height: 1;
}
.medo-bc__dots:hover{ background: var(--medo-state-hover); color: var(--medo-text-link-hover); }
.medo-bc__dots:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-bc__menu{
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 60;
  min-width: 200px;
  padding: 6px;
  background: var(--medo-surface);
  border: var(--medo-border-thin) solid var(--medo-border);
  border-radius: var(--medo-radius-md);
  box-shadow: var(--medo-shadow-md);
  display: flex;
  flex-direction: column;
}
.medo-bc__mitem{
  appearance: none;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: var(--medo-text-sm);
  color: var(--medo-text);
  text-align: left;
  text-decoration: none;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}
.medo-bc__mitem:hover{ background: var(--medo-state-hover); }
.medo-bc__mitem:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
`;

const Breadcrumb = ({
  items = [],
  size = "sm",
  maxItems = 0,
  homeIcon = false,
  ariaLabel = "Brotkrumen",
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-breadcrumb-css", MEDO_BC_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const [open, setOpen] = React.useState(false);
  const moreRef = React.useRef(null);
  const glyph = size === "md" ? 20 : 18;

  React.useEffect(() => {
    if (!open) return;
    const away = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setOpen(false);
    };
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const sep = () =>
    React.createElement("span", { className: "medo-bc__sep", "aria-hidden": "true" }, "/");

  const linkFor = (it, i) =>
    React.createElement(
      it.href ? "a" : "button",
      {
        className: "medo-bc__link",
        href: it.href,
        type: it.href ? undefined : "button",
        onClick: it.onClick,
      },
      i === 0 && homeIcon && IconCmp
        ? React.createElement(IconCmp, { name: "home", size: glyph })
        : it.icon && IconCmp
        ? React.createElement(IconCmp, { name: it.icon, size: glyph })
        : null,
      React.createElement("span", null, it.label)
    );

  /* Kollabieren: erste Stufe, …-Menü mit der Mitte, letzte zwei Stufen. */
  let head = items;
  let hidden = [];
  if (maxItems > 0 && items.length > maxItems && items.length > 3) {
    head = [items[0]];
    hidden = items.slice(1, items.length - 2);
    head = head.concat(items.slice(items.length - 2));
  }

  const nodes = [];
  head.forEach((it, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === head.length - 1;
    if (idx > 0) nodes.push(React.createElement("li", { key: "s" + idx, className: "medo-bc__li", "aria-hidden": "true" }, sep()));

    if (isFirst && hidden.length) {
      nodes.push(
        React.createElement("li", { key: "first", className: "medo-bc__li" }, linkFor(it, 0))
      );
      nodes.push(
        React.createElement("li", { key: "sm", className: "medo-bc__li", "aria-hidden": "true" }, sep())
      );
      nodes.push(
        React.createElement(
          "li",
          { key: "more", className: "medo-bc__li" },
          React.createElement(
            "span",
            { className: "medo-bc__more", ref: moreRef },
            React.createElement(
              "button",
              {
                type: "button",
                className: "medo-bc__dots",
                "aria-label": "Weitere Ebenen anzeigen",
                "aria-expanded": open ? "true" : "false",
                onClick: () => setOpen(!open),
              },
              "…"
            ),
            open
              ? React.createElement(
                  "div",
                  { className: "medo-bc__menu", role: "menu" },
                  hidden.map((hit, hi) =>
                    React.createElement(
                      hit.href ? "a" : "button",
                      {
                        key: hi,
                        role: "menuitem",
                        className: "medo-bc__mitem",
                        href: hit.href,
                        type: hit.href ? undefined : "button",
                        onClick: (e) => {
                          setOpen(false);
                          if (hit.onClick) hit.onClick(e);
                        },
                      },
                      hit.label
                    )
                  )
                )
              : null
          )
        )
      );
      return;
    }

    nodes.push(
      React.createElement(
        "li",
        { key: idx, className: "medo-bc__li" },
        isLast
          ? React.createElement(
              "span",
              { className: "medo-bc__current", "aria-current": "page" },
              it.icon && IconCmp ? React.createElement(IconCmp, { name: it.icon, size: glyph }) : null,
              it.label
            )
          : linkFor(it, idx)
      )
    );
  });

  return React.createElement(
    "nav",
    {
      "aria-label": ariaLabel,
      className: ["medo-bc", "medo-bc--" + size, className].filter(Boolean).join(" "),
      style,
      ...rest,
    },
    React.createElement("ol", { className: "medo-bc__list" }, nodes)
  );
};

export { Breadcrumb };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Breadcrumb = Breadcrumb;
