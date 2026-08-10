window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · List
   Statische Anzeige-Liste: aufgezählt, nummeriert, verschachtelt, als Inhalts-Zeilen
   oder als Schlüssel-Wert-Paare. Nichts hier ist anklickbar — dafür ContainedList. */

const MEDO_LIST_CSS = `
.medo-list{
  font-family: var(--medo-font-sans);
  color: var(--medo-text);
  margin: 0;
  padding-left: 22px;
  font-size: var(--medo-text-base);
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.medo-list--sm{ font-size: var(--medo-text-sm); line-height: 1.45; gap: 5px; padding-left: 20px; }
.medo-list li::marker{ color: var(--medo-color-stone-500); }
.medo-list--ordered{ list-style: decimal; }
.medo-list--ordered > li::marker{ font-family: var(--medo-font-mono); font-size: 0.9em; }
.medo-list--unordered{ list-style: disc; }
.medo-list .medo-list{ margin-top: 6px; }
.medo-list__nested{ list-style: circle; }

/* Inhalts-Zeilen — Icon, Titel, Erklärung, ohne Aufzählungszeichen */
.medo-list--content{ list-style: none; padding-left: 0; gap: 0; }
.medo-list__row{
  display: flex;
  gap: var(--medo-space-sm);
  padding: 12px 0;
  border-top: var(--medo-border-thin) solid var(--medo-divider);
}
.medo-list__row:first-child{ border-top: none; }
.medo-list--flush .medo-list__row{ border-top: none; padding: 6px 0; }
.medo-list__ic{ color: var(--medo-icon-muted); flex: none; margin-top: 2px; }
.medo-list__t{ font-size: var(--medo-text-base); font-weight: 500; line-height: 1.5; }
.medo-list--sm .medo-list__t{ font-size: var(--medo-text-sm); }
.medo-list__d{ font-size: var(--medo-text-sm); line-height: 1.5; color: var(--medo-text-muted); margin-top: 2px; }
.medo-list__empty{
  font-family: var(--medo-font-sans);
  font-size: var(--medo-text-sm);
  color: var(--medo-text-muted);
  padding: 14px 0;
}

/* Schlüssel-Wert */
.medo-kv{ font-family: var(--medo-font-sans); margin: 0; }
.medo-kv__row{
  display: grid;
  grid-template-columns: minmax(120px, 34%) 1fr;
  gap: var(--medo-space-md);
  padding: 10px 0;
  border-top: var(--medo-border-thin) solid var(--medo-divider);
}
.medo-kv__row:first-child{ border-top: none; }
.medo-kv--stacked .medo-kv__row{ grid-template-columns: 1fr; gap: 2px; }
.medo-kv__k{
  font-size: var(--medo-text-sm);
  color: var(--medo-text-muted);
  margin: 0;
}
.medo-kv__v{
  font-size: var(--medo-text-sm);
  color: var(--medo-text);
  margin: 0;
  min-width: 0;
  overflow-wrap: anywhere;
}
.medo-kv__v--mono{ font-family: var(--medo-font-mono); font-variant-numeric: tabular-nums; }
`;

const List = ({
  items = [],
  variant = "unordered",
  size = "md",
  flush = false,
  emptyText,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-list-css", MEDO_LIST_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const glyph = size === "sm" ? 18 : 20;

  if (!items.length && emptyText) {
    return React.createElement("p", { className: "medo-list__empty", style }, emptyText);
  }

  const cls = [
    "medo-list",
    "medo-list--" + variant,
    "medo-list--" + size,
    flush ? "medo-list--flush" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const Tag = variant === "ordered" ? "ol" : "ul";

  return React.createElement(
    Tag,
    { className: cls, style, ...rest },
    items.map((it, i) => {
      const item = typeof it === "string" ? { text: it } : it;

      if (variant === "content") {
        return React.createElement(
          "li",
          { key: i, className: "medo-list__row" },
          item.icon && IconCmp
            ? React.createElement(IconCmp, { name: item.icon, size: glyph, className: "medo-list__ic" })
            : null,
          React.createElement(
            "div",
            { style: { minWidth: 0 } },
            React.createElement("div", { className: "medo-list__t" }, item.title || item.text),
            item.description
              ? React.createElement("div", { className: "medo-list__d" }, item.description)
              : null
          )
        );
      }

      return React.createElement(
        "li",
        { key: i },
        item.text || item.title,
        item.items && item.items.length
          ? React.createElement(
              "ul",
              {
                className: [
                  "medo-list",
                  "medo-list--" + size,
                  "medo-list__nested",
                ].join(" "),
              },
              item.items.map((sub, si) =>
                React.createElement("li", { key: si }, typeof sub === "string" ? sub : sub.text)
              )
            )
          : null
      );
    })
  );
};

const KeyValueList = ({ items = [], layout = "columns", monoValues = true, className, style, ...rest }) => {
  window.MedoUI.injectCss("medo-list-css", MEDO_LIST_CSS);

  return React.createElement(
    "dl",
    {
      className: ["medo-kv", layout === "stacked" ? "medo-kv--stacked" : null, className]
        .filter(Boolean)
        .join(" "),
      style,
      ...rest,
    },
    items.map((it, i) =>
      React.createElement(
        "div",
        { key: i, className: "medo-kv__row" },
        React.createElement("dt", { className: "medo-kv__k" }, it.key),
        React.createElement(
          "dd",
          {
            className: [
              "medo-kv__v",
              (it.mono !== undefined ? it.mono : monoValues && it.numeric) ? "medo-kv__v--mono" : null,
            ]
              .filter(Boolean)
              .join(" "),
          },
          it.value
        )
      )
    )
  );
};

export { List, KeyValueList };
window.MedoUI = window.MedoUI || {};
window.MedoUI.List = List;
window.MedoUI.KeyValueList = KeyValueList;
