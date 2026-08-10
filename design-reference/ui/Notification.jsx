window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Notification
   Rückmeldungen an die Person. Zwei Formen:
   - Notification: eingebettetes Inline-Banner, bleibt stehen.
   - ToastHost + toast(): schwebender Stapel oben rechts, blendet nach ~5 s aus.
   Fünf Statustypen, zwei Betonungsstufen. */

const MEDO_NOTIFICATION_CSS = `
.medo-nt{
  box-sizing: border-box;
  display: flex;
  gap: 13px;
  align-items: flex-start;
  font-family: var(--medo-font-sans);
  border: var(--medo-border-thin) solid transparent;
  border-radius: var(--medo-radius-lg);
  padding: 14px 16px;
}
.medo-nt--singleline{ align-items: center; }
.medo-nt__icon{ flex: none; margin-top: 1px; }
.medo-nt--singleline .medo-nt__icon{ margin-top: 0; }
.medo-nt__body{ flex: 1; min-width: 0; }
.medo-nt__title{ font-size: var(--medo-text-sm); font-weight: 600; }
.medo-nt__text{ font-size: var(--medo-text-sm); line-height: var(--medo-text-sm-line); margin-top: 2px; }
.medo-nt__actions{ display: flex; gap: 6px; margin-top: 10px; margin-left: -6px; }

.medo-nt__action{
  box-sizing: border-box;
  appearance: none; border: none; background: transparent;
  font-family: inherit; font-weight: 400; font-size: var(--medo-text-sm);
  cursor: pointer; padding: 4px 6px;
  border-radius: var(--medo-radius-sm);
  color: inherit;
}
.medo-nt__action:hover{ background: rgba(31,29,26,0.06); }
.medo-nt__action:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-nt--solid .medo-nt__action:hover{ background: rgba(255,255,255,0.15); }
.medo-nt--solid .medo-nt__action:focus-visible{ box-shadow: 0 0 0 3px rgba(255,255,255,0.45); }

.medo-nt__x{
  box-sizing: border-box;
  appearance: none; border: none; background: transparent;
  cursor: pointer; width: 32px; height: 32px; flex: none;
  border-radius: var(--medo-radius-md);
  display: inline-flex; align-items: center; justify-content: center;
  color: inherit;
}
.medo-nt__x:hover{ background: rgba(31,29,26,0.08); }
.medo-nt__x:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-nt--solid .medo-nt__x:hover{ background: rgba(255,255,255,0.18); }
.medo-nt--solid .medo-nt__x:focus-visible{ box-shadow: 0 0 0 3px rgba(255,255,255,0.45); }

/* Toast */
.medo-toast-host{
  position: fixed;
  top: 20px; right: 20px;
  z-index: 1000;
  width: 340px;
  display: flex; flex-direction: column; gap: 10px;
  pointer-events: none;
}
.medo-toast{
  box-sizing: border-box;
  pointer-events: auto;
  display: flex; gap: 12px; align-items: flex-start;
  background: var(--medo-overlay);
  border: var(--medo-border-thin) solid var(--medo-border-subtle);
  border-left: 4px solid var(--medo-action);
  border-radius: var(--medo-radius-lg);
  padding: 13px 14px;
  box-shadow: var(--medo-shadow-xl);
  font-family: var(--medo-font-sans);
  animation: medo-toast-in 220ms ease-out;
}
@keyframes medo-toast-in{ from{ opacity: 0; transform: translateX(16px); } to{ opacity: 1; transform: none; } }
.medo-toast__title{ font-size: var(--medo-text-sm); font-weight: 600; color: var(--medo-text); }
.medo-toast__text{ font-size: var(--medo-text-xs); line-height: 1.5; color: var(--medo-text-muted); margin-top: 2px; }
`;

/* Farbrollen. neutral nutzt die warme Neutralskala, die vier übrigen ihre Statustokens. */
const MEDO_NT_KINDS = {
  info:    { icon: "info",          surface: "--medo-info-surface",    border: "--medo-info-border",    text: "--medo-info-text",    accent: "--medo-info-solid-hover",    solid: "--medo-info-solid",    onSolid: "--medo-info-on-solid" },
  success: { icon: "check_circle",  surface: "--medo-success-surface", border: "--medo-success-border", text: "--medo-success-text", accent: "--medo-success-solid-hover", solid: "--medo-success-solid", onSolid: "--medo-success-on-solid" },
  warning: { icon: "warning",       surface: "--medo-warning-surface", border: "--medo-warning-border", text: "--medo-warning-text", accent: "--medo-warning-solid-hover", solid: "--medo-warning-solid", onSolid: "--medo-warning-on-solid" },
  error:   { icon: "error",         surface: "--medo-error-surface",   border: "--medo-error-border",   text: "--medo-error-text",   accent: "--medo-error-solid-hover",   solid: "--medo-error-solid",   onSolid: "--medo-error-on-solid" },
  neutral: { icon: "notifications", surface: "--medo-surface-container", border: "--medo-border", text: "--medo-text", accent: "--medo-color-stone-700", solid: "--medo-color-stone-700", onSolid: "--medo-color-white" },
};

const Notification = ({
  kind = "info",
  emphasis = "soft",
  title,
  children,
  icon,
  action,
  onClose,
  closeLabel = "Schließen",
  role,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-notification-css", MEDO_NOTIFICATION_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const set = MEDO_NT_KINDS[kind] || MEDO_NT_KINDS.info;
  const solid = emphasis === "solid";
  const singleLine = !children;

  const skin = solid
    ? { background: "var(" + set.solid + ")", color: "var(" + set.onSolid + ")" }
    : {
        background: "var(" + set.surface + ")",
        borderColor: "var(" + set.border + ")",
        color: "var(" + set.text + ")",
      };

  return React.createElement(
    "div",
    {
      className: [
        "medo-nt",
        solid ? "medo-nt--solid" : null,
        singleLine ? "medo-nt--singleline" : null,
        className,
      ]
        .filter(Boolean)
        .join(" "),
      role: role || (kind === "error" ? "alert" : "status"),
      style: { ...skin, ...style },
      ...rest,
    },
    IconCmp
      ? React.createElement(IconCmp, {
          name: icon || set.icon,
          size: 22,
          className: "medo-nt__icon",
          color: solid ? "currentColor" : "var(" + set.accent + ")",
        })
      : null,
    React.createElement(
      "div",
      { className: "medo-nt__body" },
      title
        ? React.createElement(
            "div",
            { className: singleLine && !solid ? "medo-nt__text" : "medo-nt__title" },
            title
          )
        : null,
      children ? React.createElement("div", { className: "medo-nt__text" }, children) : null,
      action && !singleLine
        ? React.createElement(
            "div",
            { className: "medo-nt__actions" },
            React.createElement(
              "button",
              {
                type: "button",
                className: "medo-nt__action",
                style: solid ? null : { color: "var(" + set.accent + ")" },
                onClick: action.onClick,
              },
              action.label
            )
          )
        : null
    ),
    action && singleLine
      ? React.createElement(
          "button",
          {
            type: "button",
            className: "medo-nt__action",
            style: solid ? null : { color: "var(" + set.accent + ")" },
            onClick: action.onClick,
          },
          action.label
        )
      : null,
    onClose
      ? React.createElement(
          "button",
          { type: "button", className: "medo-nt__x", "aria-label": closeLabel, onClick: onClose },
          IconCmp ? React.createElement(IconCmp, { name: "close", size: 19 }) : null
        )
      : null
  );
};

/* ---------- Toast ---------- */

const medoToastBus = { listeners: [], seq: 0 };

/** Zeigt einen Toast. Gibt die id zurück, mit der er vorzeitig geschlossen werden kann. */
function toast(opts) {
  const o = typeof opts === "string" ? { title: opts } : opts || {};
  const id = ++medoToastBus.seq;
  medoToastBus.listeners.forEach((fn) => fn({ type: "add", item: { id, duration: 5000, kind: "info", ...o } }));
  return id;
}
toast.dismiss = function (id) {
  medoToastBus.listeners.forEach((fn) => fn({ type: "remove", id }));
};

const ToastHost = ({ label = "Benachrichtigungen" }) => {
  window.MedoUI.injectCss("medo-notification-css", MEDO_NOTIFICATION_CSS);

  const [items, setItems] = React.useState([]);
  const timers = React.useRef({});
  const IconCmp = window.MedoUI && window.MedoUI.Icon;

  const remove = React.useCallback((id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setItems((list) => list.filter((t) => t.id !== id));
  }, []);

  React.useEffect(() => {
    const onEvent = (e) => {
      if (e.type === "remove") return remove(e.id);
      const item = e.item;
      setItems((list) => list.concat(item));
      /* Fehler bleiben stehen, bis sie gelöst sind — sie blenden nicht aus. */
      if (item.duration && item.kind !== "error") {
        timers.current[item.id] = setTimeout(() => remove(item.id), item.duration);
      }
    };
    medoToastBus.listeners.push(onEvent);
    return () => {
      medoToastBus.listeners = medoToastBus.listeners.filter((f) => f !== onEvent);
      Object.values(timers.current).forEach(clearTimeout);
    };
  }, [remove]);

  return React.createElement(
    "div",
    { className: "medo-toast-host", role: "region", "aria-label": label, "aria-live": "polite" },
    items.map((t) => {
      const set = MEDO_NT_KINDS[t.kind] || MEDO_NT_KINDS.info;
      return React.createElement(
        "div",
        {
          key: t.id,
          className: "medo-toast",
          role: t.kind === "error" ? "alert" : "status",
          style: { borderLeftColor: "var(" + set.accent + ")" },
        },
        IconCmp
          ? React.createElement(IconCmp, {
              name: t.icon || set.icon,
              size: 21,
              className: "medo-nt__icon",
              color: "var(" + set.accent + ")",
            })
          : null,
        React.createElement(
          "div",
          { className: "medo-nt__body" },
          t.title ? React.createElement("div", { className: "medo-toast__title" }, t.title) : null,
          t.description
            ? React.createElement("div", { className: "medo-toast__text" }, t.description)
            : null
        ),
        React.createElement(
          "button",
          {
            type: "button",
            className: "medo-nt__x",
            "aria-label": "Schließen",
            style: { color: "var(--medo-icon-muted)" },
            onClick: () => remove(t.id),
          },
          IconCmp ? React.createElement(IconCmp, { name: "close", size: 18 }) : null
        )
      );
    })
  );
};

export { Notification, ToastHost, toast };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Notification = Notification;
window.MedoUI.ToastHost = ToastHost;
window.MedoUI.toast = toast;
