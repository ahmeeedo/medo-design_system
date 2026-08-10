window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · FileUploader
   Dateien wählen oder in die Ablagefläche ziehen. Zeigt je Datei Name, Größe und Status.
   Prüft Typ und Größe vor dem Übernehmen; abgelehnte Dateien erscheinen mit Grund. */

const MEDO_FU_CSS = `
.medo-fu{ font-family: var(--medo-font-sans); }
.medo-fu__label{ display: block; font-size: var(--medo-text-sm); color: var(--medo-text); margin-bottom: 4px; }
.medo-fu__helper{ font-size: var(--medo-text-xs); color: var(--medo-text-muted); margin-bottom: 10px; }
.medo-fu__zone{
  box-sizing: border-box;
  display: block;
  width: 100%;
  padding: 36px 24px;
  border: var(--medo-border-thin) dashed #c6c2ba;
  border-radius: var(--medo-radius-lg);
  background: var(--medo-surface-container);
  color: var(--medo-text-muted);
  font-family: inherit;
  font-size: var(--medo-text-sm);
  text-align: center;
  cursor: pointer;
  transition: border-color 150ms ease-out, background-color 150ms ease-out;
}
.medo-fu__zone:hover:not(:disabled){ border-color: #9a948a; background: #f5f3f0; }
.medo-fu__zone:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-fu__zone--over{ border-color: var(--medo-action); border-style: solid; background: #f2f9f8; color: var(--medo-primary-800); }
.medo-fu__zone:disabled{ cursor: not-allowed; opacity: 0.55; background: #f3f1ee; }
.medo-fu__inner{ display: flex; flex-direction: column; align-items: center; gap: 12px; }
.medo-fu__btn{
  box-sizing: border-box;
  height: 40px;
  padding: 0 16px;
  border-radius: var(--medo-radius-md);
  border: var(--medo-border-thin) solid var(--medo-border-strong);
  background: var(--medo-surface);
  color: var(--medo-text);
  font-family: var(--medo-font-sans);
  font-weight: 400;
  font-size: var(--medo-text-sm);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}
.medo-fu__zone:hover:not(:disabled) .medo-fu__btn{ background: #f7f7f6; }
.medo-fu__ic{ color: var(--medo-icon-muted); }
.medo-fu__zone--over .medo-fu__ic{ color: var(--medo-action); }
.medo-fu__strong{ color: var(--medo-text-link); }
.medo-fu__hint{ font-size: var(--medo-text-xs); }

.medo-fu__list{ list-style: none; margin: 14px 0 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.medo-fu__item{
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 12px 14px;
  border: var(--medo-border-thin) solid var(--medo-border-subtle);
  border-radius: 11px;
  background: var(--medo-surface);
}
.medo-fu__item--error{ border-color: #e0b8b2; background: #fdf6f5; }
.medo-fu__thumb{
  width: 40px; height: 40px;
  border-radius: var(--medo-radius-md);
  flex: none;
  display: inline-flex; align-items: center; justify-content: center;
  overflow: hidden;
  background: var(--medo-surface-sunken);
  color: var(--medo-icon-muted);
}
.medo-fu__thumb img{ width: 100%; height: 100%; object-fit: cover; }
.medo-fu__item--error .medo-fu__thumb{ background: var(--medo-error-surface); color: var(--medo-error-solid); }
.medo-fu__body{ flex: 1; min-width: 0; }
.medo-fu__name{
  font-size: var(--medo-text-sm);
  color: var(--medo-text);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.medo-fu__meta{
  font-family: var(--medo-font-mono);
  font-size: 11px;
  color: var(--medo-text-muted);
  margin-top: 2px;
}
.medo-fu__item--error .medo-fu__meta{ font-family: var(--medo-font-sans); font-size: var(--medo-text-xs); color: var(--medo-error-text); }
.medo-fu__bar{ height: 5px; border-radius: 9999px; background: var(--medo-surface-sunken); margin-top: 6px; overflow: hidden; }
.medo-fu__fill{ height: 100%; background: var(--medo-action); border-radius: 9999px; transition: width 200ms ease-out; }
.medo-fu__ok{ color: var(--medo-success-solid); flex: none; }
.medo-fu__x{
  box-sizing: border-box;
  flex: none;
  width: 30px; height: 30px;
  appearance: none; border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--medo-icon);
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.medo-fu__x:hover{ background: var(--medo-state-hover); }
.medo-fu__x:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-fu__sr{ position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
`;

const medoBytes = (n) => {
  if (n === undefined || n === null) return "";
  if (n < 1024) return n + " B";
  if (n < 1024 * 1024) return (n / 1024).toFixed(0) + " KB";
  return (n / 1024 / 1024).toFixed(1).replace(".", ",") + " MB";
};

const FileUploader = ({
  files = [],
  onFilesAdded,
  onRemove,
  label,
  helper,
  accept,
  multiple = true,
  maxSize,
  disabled = false,
  buttonText = "Datei auswählen",
  dropText = "oder hierher ziehen",
  compact = false,
  removeLabel = "Entfernen",
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-file-uploader-css", MEDO_FU_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const inputRef = React.useRef(null);
  const [over, setOver] = React.useState(false);

  const check = (f) => {
    if (maxSize && f.size > maxSize) return "Datei ist größer als " + medoBytes(maxSize) + ".";
    if (accept) {
      const ok = accept.split(",").map((s) => s.trim().toLowerCase()).some((a) => {
        if (a.endsWith("/*")) return (f.type || "").startsWith(a.slice(0, -1));
        if (a.startsWith(".")) return f.name.toLowerCase().endsWith(a);
        return (f.type || "").toLowerCase() === a;
      });
      if (!ok) return "Dateityp wird nicht akzeptiert.";
    }
    return null;
  };

  const take = (list) => {
    const arr = Array.prototype.slice.call(list || []);
    if (!arr.length || !onFilesAdded) return;
    onFilesAdded(
      arr.map((f) => {
        const err = check(f);
        return {
          name: f.name,
          size: f.size,
          file: f,
          status: err ? "error" : "done",
          error: err || undefined,
        };
      })
    );
  };

  return React.createElement(
    "div",
    { className: ["medo-fu", className].filter(Boolean).join(" "), style, ...rest },
    label ? React.createElement("span", { className: "medo-fu__label" }, label) : null,
    helper ? React.createElement("div", { className: "medo-fu__helper" }, helper) : null,
    React.createElement("input", {
      ref: inputRef,
      "aria-hidden": "true",
      tabIndex: -1,
      type: "file",
      className: "medo-fu__sr",
      accept,
      multiple,
      disabled,
      onChange: (e) => { take(e.target.files); e.target.value = ""; },
    }),
    compact
      ? React.createElement(
          "div",
          {
            style: { display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" },
            onDragOver: (e) => { e.preventDefault(); if (!disabled) setOver(true); },
            onDragLeave: () => setOver(false),
            onDrop: (e) => { e.preventDefault(); setOver(false); if (!disabled) take(e.dataTransfer.files); },
          },
          React.createElement(
            "button",
            {
              type: "button",
              className: "medo-fu__btn",
              style: { pointerEvents: "auto", cursor: disabled ? "not-allowed" : "pointer" },
              disabled,
              onClick: () => inputRef.current && inputRef.current.click(),
            },
            IconCmp ? React.createElement(IconCmp, { name: "attach_file", size: 18 }) : null,
            buttonText
          ),
          React.createElement(
            "span",
            { className: "medo-fu__hint", style: { color: "var(--medo-text-muted)" } },
            [
              accept ? accept.toUpperCase().replace(/\./g, "").replace(/,/g, ", ") : null,
              maxSize ? "bis " + medoBytes(maxSize) : null,
            ]
              .filter(Boolean)
              .join(" · ")
          )
        )
      : React.createElement(
      "button",
      {
        type: "button",
        className: ["medo-fu__zone", over ? "medo-fu__zone--over" : null].filter(Boolean).join(" "),
        disabled,
        onClick: () => inputRef.current && inputRef.current.click(),
        onDragOver: (e) => { e.preventDefault(); if (!disabled) setOver(true); },
        onDragLeave: () => setOver(false),
        onDrop: (e) => { e.preventDefault(); setOver(false); if (!disabled) take(e.dataTransfer.files); },
      },
      React.createElement(
        "div",
        { className: "medo-fu__inner" },
        IconCmp
          ? React.createElement(IconCmp, { name: "cloud_upload", size: 30, className: "medo-fu__ic" })
          : null,
        React.createElement(
          "span",
          { className: "medo-fu__btn" },
          IconCmp ? React.createElement(IconCmp, { name: "attach_file", size: 18 }) : null,
          buttonText
        ),
        React.createElement("span", null, dropText),
        accept || maxSize
          ? React.createElement(
              "span",
              { className: "medo-fu__hint" },
              [
                accept ? accept.toUpperCase().replace(/\./g, "").replace(/,/g, ", ") : null,
                maxSize ? "bis " + medoBytes(maxSize) : null,
              ]
                .filter(Boolean)
                .join(" · ")
            )
          : null
      )
    ),
    files.length
      ? React.createElement(
          "ul",
          { className: "medo-fu__list" },
          files.map((f, i) =>
            React.createElement(
              "li",
              {
                key: f.id !== undefined ? f.id : i,
                className: ["medo-fu__item", f.status === "error" ? "medo-fu__item--error" : null]
                  .filter(Boolean)
                  .join(" "),
              },
              IconCmp
                ? React.createElement(
                    "span",
                    { className: "medo-fu__thumb" },
                    f.preview
                      ? React.createElement("img", { src: f.preview, alt: "" })
                      : React.createElement(IconCmp, {
                          name: f.status === "error" ? "error" : "description",
                          size: 22,
                        })
                  )
                : null,
              React.createElement(
                "div",
                { className: "medo-fu__body" },
                React.createElement("div", { className: "medo-fu__name" }, f.name),
                React.createElement(
                  "div",
                  { className: "medo-fu__meta" },
                  f.status === "error" ? f.error : medoBytes(f.size)
                ),
                f.status === "uploading"
                  ? React.createElement(
                      "div",
                      { className: "medo-fu__bar" },
                      React.createElement("div", {
                        className: "medo-fu__fill",
                        style: { width: (f.progress || 0) + "%" },
                      })
                    )
                  : null
              ),
              f.status === "done" && IconCmp
                ? React.createElement(IconCmp, { name: "check_circle", size: 20, className: "medo-fu__ok" })
                : null,
              onRemove
                ? React.createElement(
                    "button",
                    {
                      type: "button",
                      className: "medo-fu__x",
                      "aria-label": removeLabel + " — " + f.name,
                      onClick: () => onRemove(f, i),
                    },
                    IconCmp ? React.createElement(IconCmp, { name: "close", size: 19 }) : null
                  )
                : null
            )
          )
        )
      : null
  );
};

export { FileUploader };
window.MedoUI = window.MedoUI || {};
window.MedoUI.FileUploader = FileUploader;
