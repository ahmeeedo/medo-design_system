window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Loading (+ Skeleton)
   Teilring-Spinner (conic-gradient mit mask, 270°) — die einzige Dauerbewegung im System.
   Dazu die Overlay- und Vollseiten-Form und Skeletons für Inhalte, deren Form schon bekannt ist. */

const MEDO_LOADING_CSS = `
.medo-spin{
  box-sizing: border-box;
  flex: none;
  border-radius: var(--medo-radius-full);
  background: conic-gradient(from 0deg, transparent 0deg, currentColor 270deg, currentColor 360deg);
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - var(--medo-spin-w)), #000 calc(100% - var(--medo-spin-w)));
  mask: radial-gradient(farthest-side, transparent calc(100% - var(--medo-spin-w)), #000 calc(100% - var(--medo-spin-w)));
  animation: medo-spin-rot 0.8s linear infinite;
}
@keyframes medo-spin-rot{ to{ transform: rotate(360deg); } }
.medo-load{
  font-family: var(--medo-font-sans);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: var(--medo-space-sm);
  color: var(--medo-action);
}
.medo-load__txt{ font-size: var(--medo-text-sm); color: var(--medo-text-muted); }
.medo-load__overlay{
  position: absolute;
  inset: 0;
  z-index: 30;
  background: rgba(255,255,255,0.78);
  display: flex;
  align-items: center;
  justify-content: center;
}
.medo-load__full{
  position: fixed;
  inset: 0;
  z-index: 1300;
  background: var(--medo-surface);
  display: flex;
  align-items: center;
  justify-content: center;
}

.medo-sk{ display: flex; flex-direction: column; gap: 10px; }
.medo-sk__b{
  border-radius: var(--medo-radius-sm);
  background: var(--medo-color-stone-100);
  background-image: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.85) 50%, transparent 100%);
  background-size: 180px 100%;
  background-repeat: no-repeat;
  animation: medo-sk-shimmer 1.4s ease-in-out infinite;
}
@keyframes medo-sk-shimmer{ from{ background-position: -180px 0; } to{ background-position: calc(100% + 180px) 0; } }
.medo-sk__row{ display: flex; align-items: center; gap: 14px; }
.medo-sk__card{
  border: var(--medo-border-thin) solid var(--medo-border);
  border-radius: var(--medo-radius-lg);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
`;

const MEDO_SPIN_SIZES = { sm: [20, 2], md: [32, 3], lg: [48, 4] };

const Loading = ({
  size = "md",
  label,
  variant = "inline",
  color,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-loading-css", MEDO_LOADING_CSS);

  const [px, w] = MEDO_SPIN_SIZES[size] || MEDO_SPIN_SIZES.md;
  const spinner = React.createElement("span", {
    className: "medo-spin",
    style: { width: px + "px", height: px + "px", "--medo-spin-w": w + "px" },
  });

  const block = React.createElement(
    "div",
    {
      className: ["medo-load", className].filter(Boolean).join(" "),
      role: "status",
      "aria-busy": "true",
      "aria-label": label ? undefined : "Wird geladen",
      style: color ? { color: color, ...style } : style,
      ...rest,
    },
    spinner,
    label ? React.createElement("span", { className: "medo-load__txt" }, label) : null
  );

  if (variant === "overlay")
    return React.createElement("div", { className: "medo-load__overlay" }, block);
  if (variant === "fullpage")
    return React.createElement("div", { className: "medo-load__full" }, block);
  return block;
};

const Skeleton = ({
  variant = "lines",
  lines = 3,
  rows = 4,
  height,
  width,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-loading-css", MEDO_LOADING_CSS);

  const bar = (key, h, w) =>
    React.createElement("div", {
      key,
      className: "medo-sk__b",
      style: { height: h, width: w },
    });

  if (variant === "block")
    return React.createElement("div", {
      className: ["medo-sk__b", className].filter(Boolean).join(" "),
      style: { height: height || "120px", width: width || "100%", ...style },
      "aria-hidden": "true",
      ...rest,
    });

  if (variant === "card")
    return React.createElement(
      "div",
      { className: ["medo-sk__card", className].filter(Boolean).join(" "), style, "aria-hidden": "true", ...rest },
      React.createElement(
        "div",
        { className: "medo-sk__row" },
        React.createElement("div", {
          className: "medo-sk__b",
          style: { width: "38px", height: "38px", borderRadius: "9999px", flex: "none" },
        }),
        React.createElement(
          "div",
          { style: { flex: 1, display: "flex", flexDirection: "column", gap: "7px" } },
          bar("t", "13px", "55%"),
          bar("s", "11px", "35%")
        )
      ),
      bar("l1", "12px", "100%"),
      bar("l2", "12px", "88%")
    );

  if (variant === "table")
    return React.createElement(
      "div",
      { className: ["medo-sk", className].filter(Boolean).join(" "), style, "aria-hidden": "true", ...rest },
      Array.from({ length: rows }).map((_, i) =>
        React.createElement(
          "div",
          { key: i, className: "medo-sk__row", style: { gap: "16px" } },
          bar("a", "12px", "22%"),
          bar("b", "12px", "34%"),
          bar("c", "12px", "16%"),
          bar("d", "12px", "12%")
        )
      )
    );

  return React.createElement(
    "div",
    { className: ["medo-sk", className].filter(Boolean).join(" "), style, "aria-hidden": "true", ...rest },
    Array.from({ length: lines }).map((_, i) =>
      bar(i, height || "12px", i === lines - 1 ? "62%" : "100%")
    )
  );
};

export { Loading, Skeleton };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Loading = Loading;
window.MedoUI.Skeleton = Skeleton;
