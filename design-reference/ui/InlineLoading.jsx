window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · InlineLoading
   Kleiner Wartezustand im Textfluss: drei pulsierende Punkte, danach Häkchen oder Kreuz.
   Für Schaltflächen, Zeilen und neben Feldern — nie für ganze Seitenbereiche. */

const MEDO_IL_CSS = `
.medo-il{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--medo-font-sans);
  font-size: var(--medo-text-sm);
  color: var(--medo-text-muted);
  vertical-align: middle;
}
.medo-il--sm{ font-size: var(--medo-text-xs); gap: 7px; }
.medo-il__dots{ display: inline-flex; align-items: center; gap: 3px; flex: none; }
.medo-il__dot{
  border-radius: var(--medo-radius-full);
  background: currentColor;
  animation: medo-il-pulse 1.05s ease-in-out infinite;
}
.medo-il__dot:nth-child(2){ animation-delay: 0.15s; }
.medo-il__dot:nth-child(3){ animation-delay: 0.3s; }
@keyframes medo-il-pulse{
  0%, 100%{ opacity: 0.28; transform: scale(0.82); }
  45%{ opacity: 1; transform: scale(1); }
}
.medo-il--loading{ color: var(--medo-action); }
.medo-il--success{ color: var(--medo-success-solid); }
.medo-il--error{ color: var(--medo-error-solid); }
.medo-il--inactive{ color: var(--medo-text-muted); }
/* In gefüllten Schaltflächen: Farbe der Umgebung übernehmen, sonst teal auf teal. */
.medo-il--inherit,
.medo-il--inherit .medo-il__txt{ color: inherit; }
.medo-il__txt{ color: var(--medo-text-muted); }
.medo-il--success .medo-il__txt,
.medo-il--error .medo-il__txt{ color: currentColor; }
`;

const InlineLoading = ({
  status = "loading",
  label,
  size = "md",
  inherit = false,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-inline-loading-css", MEDO_IL_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const glyph = size === "sm" ? 16 : 20;
  const dot = size === "sm" ? 5 : 6;

  const mark =
    status === "loading"
      ? React.createElement(
          "span",
          { className: "medo-il__dots", "aria-hidden": "true" },
          [0, 1, 2].map((i) =>
            React.createElement("span", {
              key: i,
              className: "medo-il__dot",
              style: { width: dot + "px", height: dot + "px" },
            })
          )
        )
      : status === "success" && IconCmp
      ? React.createElement(IconCmp, { name: "check_circle", size: glyph })
      : status === "error" && IconCmp
      ? React.createElement(IconCmp, { name: "error", size: glyph })
      : null;

  return React.createElement(
    "span",
    {
      className: [
        "medo-il",
        "medo-il--" + status,
        "medo-il--" + size,
        inherit ? "medo-il--inherit" : null,
        className,
      ]
        .filter(Boolean)
        .join(" "),
      role: "status",
      "aria-live": "polite",
      "aria-busy": status === "loading" ? "true" : undefined,
      style,
      ...rest,
    },
    mark,
    label ? React.createElement("span", { className: "medo-il__txt" }, label) : null
  );
};

export { InlineLoading };
window.MedoUI = window.MedoUI || {};
window.MedoUI.InlineLoading = InlineLoading;
