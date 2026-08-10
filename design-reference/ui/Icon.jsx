window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Icon
   Material Symbols Rounded, Weight 300, FILL 0. Die einzige Icon-Quelle im System.
   Erwartet den Ligaturnamen als `name` (z. B. "search", "arrow_forward"). */

const Icon = ({ name, size = 20, color, className, style, ...rest }) => {
  return React.createElement(
    "span",
    {
      "aria-hidden": "true",
      className: ["medo-icon", className].filter(Boolean).join(" "),
      style: {
        fontFamily: '"Material Symbols Rounded"',
        fontWeight: 300,
        fontVariationSettings: '"FILL" 0, "GRAD" 0',
        fontSize: size + "px",
        lineHeight: 1,
        flex: "none",
        userSelect: "none",
        color: color || "inherit",
        ...style,
      },
      ...rest,
    },
    name
  );
};

export { Icon };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Icon = Icon;
