/* medo Design System · injectCss
   Fügt das Stylesheet einer Komponente genau einmal in den Kopf ein.
   Nötig, weil Inline-Styles keine Pseudoklassen (:hover, :focus-visible) abbilden können. */

window.MedoUI = window.MedoUI || {};

window.MedoUI.injectCss = function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
};

if (typeof module !== "undefined") module.exports = { injectCss: window.MedoUI.injectCss };
