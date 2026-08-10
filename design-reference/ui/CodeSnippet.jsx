window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · CodeSnippet
   Nachbau von components/Code-snippet.dc.html.
   Vier Formen: inline (hell, im Fließtext), single (eine Zeile), block (Kopfleiste mit
   Sprach-Label, Zeilennummern, Ausklappen ab 8 Zeilen) und terminal ($-Prompt, drei Punkte).
   Block und Terminal stehen auf dunklem Grund #211f1c — die einzige dunkle Fläche im System. */

const MEDO_CODE_CSS = `
.medo-cs-inline{
  font-family: var(--medo-font-mono);
  font-size: 0.9em;
  background: #ececeb;
  color: #8a3f36;
  padding: 2px 6px;
  border-radius: 5px;
  border: var(--medo-border-thin) solid #e0ddd8;
}
.medo-cs{
  background: #211f1c;
  border: var(--medo-border-thin) solid #322f2b;
  border-radius: var(--medo-radius-lg);
  overflow: hidden;
  font-family: var(--medo-font-mono);
}
.medo-cs__bar{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px 9px 16px;
  border-bottom: var(--medo-border-thin) solid #322f2b;
}
.medo-cs__lang{
  font-family: var(--medo-font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #8f887e;
}
.medo-cs__dots{ display: flex; gap: 7px; align-items: center; }
.medo-cs__dots span{ width: 11px; height: 11px; border-radius: var(--medo-radius-full); background: #4a4642; }
.medo-cs__copy{
  appearance: none;
  border: var(--medo-border-thin) solid #3a3733;
  background: #2a2724;
  color: #cfcabf;
  font-family: var(--medo-font-sans);
  font-weight: 600;
  font-size: var(--medo-text-xs);
  height: 30px;
  padding: 0 11px;
  border-radius: 7px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.medo-cs__copy:hover{ background: #332f2b; }
.medo-cs__copy:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }
.medo-cs__copy--done{ border-color: #0e6f63; color: #5fd0be; }
.medo-cs__code{
  margin: 0;
  padding: 16px 18px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.65;
  color: #e4e0d8;
}
.medo-cs--terminal .medo-cs__code{ line-height: 1.9; }
.medo-cs__gutter{
  color: #5c574f;
  user-select: none;
  text-align: right;
  padding-right: 16px;
  white-space: nowrap;
}
.medo-cs__body{ display: flex; align-items: flex-start; overflow: hidden; transition: max-height 250ms ease; }
.medo-cs__single{
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 12px 12px 16px;
}
.medo-cs__sline{
  flex: 1;
  font-size: 13px;
  color: #e4e0d8;
  overflow-x: auto;
  white-space: nowrap;
}
.medo-cs__more{
  width: 100%;
  appearance: none;
  border: none;
  border-top: var(--medo-border-thin) solid #322f2b;
  background: #26231f;
  color: #b7b1a6;
  font-family: var(--medo-font-sans);
  font-weight: 400;
  font-size: var(--medo-text-xs);
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.medo-cs__more:hover{ color: #e4e0d8; }
.medo-cs__more:focus-visible{ outline: none; box-shadow: inset 0 0 0 3px var(--medo-focus-ring); }
.medo-cs__live{ position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.tk-key{ color: #57b7c9; }
.tk-str{ color: #c99a5b; }
.tk-num{ color: #7fb682; }
.tk-com{ color: #6f6960; font-style: italic; }
.tk-fn{ color: #8ec7be; }
.tk-prompt{ color: #5fae7d; user-select: none; }
`;

const MEDO_KEYWORDS =
  /^(import|from|export|default|const|let|var|function|return|if|else|for|while|new|class|extends|await|async|type|interface|npm|npx|yarn|pnpm|cd|git|sudo|medo)$/;

/* Einfacher Tokenizer: Kommentare, Zeichenketten, Zahlen, Schlüsselwörter, Aufrufe. */
const medoTokenize = (line, key) => {
  const out = [];
  const re = /(\/\/.*$|#(?!\w*\s*\{).*$)|(`[^`]*`|"[^"]*"|'[^']*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g;
  let last = 0, m, i = 0;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const t = m[0];
    if (m[1]) out.push(React.createElement("span", { key: key + "-" + i++, className: "tk-com" }, t));
    else if (m[2]) out.push(React.createElement("span", { key: key + "-" + i++, className: "tk-str" }, t));
    else if (m[3]) out.push(React.createElement("span", { key: key + "-" + i++, className: "tk-num" }, t));
    else if (MEDO_KEYWORDS.test(t))
      out.push(React.createElement("span", { key: key + "-" + i++, className: "tk-key" }, t));
    else if (line[re.lastIndex] === "(")
      out.push(React.createElement("span", { key: key + "-" + i++, className: "tk-fn" }, t));
    else out.push(t);
    last = re.lastIndex;
  }
  if (last < line.length) out.push(line.slice(last));
  return out.length ? out : "\u00a0";
};

const medoTerminalLine = (line, key) => {
  if (/^\s*\$\s/.test(line)) {
    const cut = line.indexOf("$") + 1;
    return [
      React.createElement("span", { key: key + "-p", className: "tk-prompt" }, line.slice(0, cut) + " "),
      ...medoTokenize(line.slice(cut + 1), key),
    ];
  }
  return medoTokenize(line, key);
};

const CodeSnippet = ({
  code = "",
  children,
  variant = "block",
  language,
  showLineNumbers = true,
  highlight = true,
  collapseAfter = 8,
  copyLabel = "Kopieren",
  copiedLabel = "Kopiert!",
  onCopy,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-code-snippet-css", MEDO_CODE_CSS);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const text = typeof children === "string" ? children : code;
  const [copied, setCopied] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef(null);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  if (variant === "inline")
    return React.createElement(
      "code",
      { className: ["medo-cs-inline", className].filter(Boolean).join(" "), style, ...rest },
      text
    );

  const copy = () => {
    const done = () => {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
      if (onCopy) onCopy(text);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
    else done();
  };

  const copyBtn = React.createElement(
    "button",
    {
      type: "button",
      className: ["medo-cs__copy", copied ? "medo-cs__copy--done" : null].filter(Boolean).join(" "),
      onClick: copy,
    },
    IconCmp ? React.createElement(IconCmp, { name: copied ? "check" : "content_copy", size: 16 }) : null,
    copied ? copiedLabel : copyLabel
  );

  const live = React.createElement(
    "span",
    { className: "medo-cs__live", role: "status", "aria-live": "polite" },
    copied ? copiedLabel : ""
  );

  if (variant === "single")
    return React.createElement(
      "div",
      { className: ["medo-cs", className].filter(Boolean).join(" "), style, ...rest },
      React.createElement(
        "div",
        { className: "medo-cs__single" },
        React.createElement(
          "code",
          { className: "medo-cs__sline" },
          highlight ? medoTokenize(text, "s") : text
        ),
        copyBtn
      ),
      live
    );

  const lines = text.split("\n");
  const overflow = lines.length > collapseAfter;
  const collapsed = overflow && !open;
  const terminal = variant === "terminal";
  const render = terminal ? medoTerminalLine : medoTokenize;

  return React.createElement(
    "div",
    {
      className: ["medo-cs", terminal ? "medo-cs--terminal" : null, className].filter(Boolean).join(" "),
      style,
      ...rest,
    },
    React.createElement(
      "div",
      { className: "medo-cs__bar" },
      terminal
        ? React.createElement(
            "div",
            { className: "medo-cs__dots", "aria-hidden": "true" },
            React.createElement("span"),
            React.createElement("span"),
            React.createElement("span")
          )
        : React.createElement("span", { className: "medo-cs__lang" }, language || ""),
      copyBtn
    ),
    terminal
      ? React.createElement(
          "div",
          { className: "medo-cs__code" },
          lines.map((l, i) => React.createElement("div", { key: i }, highlight ? render(l, "t" + i) : l))
        )
      : React.createElement(
          "div",
          {
            className: "medo-cs__body",
            style: { maxHeight: collapsed ? collapseAfter * 21.45 + 32 + "px" : "1600px" },
          },
          showLineNumbers
            ? React.createElement(
                "div",
                { className: "medo-cs__code medo-cs__gutter", "aria-hidden": "true" },
                lines.map((_, i) => React.createElement("div", { key: i }, i + 1))
              )
            : null,
          React.createElement(
            "pre",
            { className: "medo-cs__code", style: { flex: 1, margin: 0 } },
            React.createElement(
              "code",
              null,
              highlight
                ? lines.map((l, i) =>
                    React.createElement("div", { key: i }, render(l, "b" + i))
                  )
                : text
            )
          )
        ),
    overflow && !terminal
      ? React.createElement(
          "button",
          { type: "button", className: "medo-cs__more", onClick: () => setOpen(!open) },
          IconCmp
            ? React.createElement(IconCmp, { name: open ? "expand_less" : "expand_more", size: 17 })
            : null,
          open ? "Weniger anzeigen" : "Alle " + lines.length + " Zeilen anzeigen"
        )
      : null,
    live
  );
};

export { CodeSnippet };
window.MedoUI = window.MedoUI || {};
window.MedoUI.CodeSnippet = CodeSnippet;
