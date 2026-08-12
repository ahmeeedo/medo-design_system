import { useEffect, useRef, useState } from 'react'
import { Icon } from '../Icon/Icon'
import './CodeSnippet.css'

/* medo Design System · CodeSnippet
   Vier Formen: inline (hell, im Fließtext), single (eine Zeile), block (Kopfleiste mit
   Sprach-Label, Zeilennummern, Ausklappen ab 8 Zeilen) und terminal ($-Prompt, drei Punkte).
   Block und Terminal stehen auf dunklem Grund #211f1c — die einzige dunkle Fläche im System. */

const MEDO_KEYWORDS =
  /^(import|from|export|default|const|let|var|function|return|if|else|for|while|new|class|extends|await|async|type|interface|npm|npx|yarn|pnpm|cd|git|sudo|medo)$/

/* Einfacher Tokenizer: Kommentare, Zeichenketten, Zahlen, Schlüsselwörter, Aufrufe. */
function medoTokenize(line, key) {
  const out = []
  const re = /(\/\/.*$|#(?!\w*\s*\{).*$)|(`[^`]*`|"[^"]*"|'[^']*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g
  let last = 0
  let m
  let i = 0
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index))
    const t = m[0]
    if (m[1]) out.push(<span key={key + '-' + i++} className="tk-com">{t}</span>)
    else if (m[2]) out.push(<span key={key + '-' + i++} className="tk-str">{t}</span>)
    else if (m[3]) out.push(<span key={key + '-' + i++} className="tk-num">{t}</span>)
    else if (MEDO_KEYWORDS.test(t)) out.push(<span key={key + '-' + i++} className="tk-key">{t}</span>)
    else if (line[re.lastIndex] === '(') out.push(<span key={key + '-' + i++} className="tk-fn">{t}</span>)
    else out.push(t)
    last = re.lastIndex
  }
  if (last < line.length) out.push(line.slice(last))
  return out.length ? out : '\u00a0'
}

function medoTerminalLine(line, key) {
  if (/^\s*\$\s/.test(line)) {
    const cut = line.indexOf('$') + 1
    return [
      <span key={key + '-p'} className="tk-prompt">{line.slice(0, cut) + ' '}</span>,
      ...medoTokenize(line.slice(cut + 1), key),
    ]
  }
  return medoTokenize(line, key)
}

export function CodeSnippet({
  code = '',
  children,
  variant = 'block',
  language,
  showLineNumbers = true,
  highlight = true,
  collapseAfter = 8,
  copyLabel = 'Kopieren',
  copiedLabel = 'Kopiert!',
  onCopy,
  className,
  style,
  ...rest
}) {
  const text = typeof children === 'string' ? children : code
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  if (variant === 'inline')
    return (
      <code className={['medo-cds-inline', className].filter(Boolean).join(' ')} style={style} {...rest}>
        {text}
      </code>
    )

  const copy = () => {
    const done = () => {
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1500)
      if (onCopy) onCopy(text)
    }
    if (navigator.clipboard && navigator.clipboard.writeText)
      navigator.clipboard.writeText(text).then(done, done)
    else done()
  }

  const copyBtn = (
    <button
      type="button"
      className={['medo-cds__copy', copied ? 'medo-cds__copy--done' : null].filter(Boolean).join(' ')}
      onClick={copy}
    >
      <Icon name={copied ? 'check' : 'content_copy'} size={16} />
      {copied ? copiedLabel : copyLabel}
    </button>
  )

  const live = (
    <span className="medo-cds__live" role="status" aria-live="polite">
      {copied ? copiedLabel : ''}
    </span>
  )

  if (variant === 'single')
    return (
      <div className={['medo-cds', className].filter(Boolean).join(' ')} style={style} {...rest}>
        <div className="medo-cds__single">
          <code className="medo-cds__sline">{highlight ? medoTokenize(text, 's') : text}</code>
          {copyBtn}
        </div>
        {live}
      </div>
    )

  const lines = text.split('\n')
  const overflow = lines.length > collapseAfter
  const collapsed = overflow && !open
  const terminal = variant === 'terminal'
  const render = terminal ? medoTerminalLine : medoTokenize

  return (
    <div
      className={['medo-cds', terminal ? 'medo-cds--terminal' : null, className]
        .filter(Boolean)
        .join(' ')}
      style={style}
      {...rest}
    >
      <div className="medo-cds__bar">
        {terminal ? (
          <div className="medo-cds__dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        ) : (
          <span className="medo-cds__lang">{language || ''}</span>
        )}
        {copyBtn}
      </div>
      {terminal ? (
        <div className="medo-cds__code">
          {lines.map((l, i) => (
            <div key={i}>{highlight ? render(l, 't' + i) : l}</div>
          ))}
        </div>
      ) : (
        <div
          className="medo-cds__body"
          style={{ maxHeight: collapsed ? collapseAfter * 21.45 + 32 + 'px' : '1600px' }}
        >
          {showLineNumbers ? (
            <div className="medo-cds__code medo-cds__gutter" aria-hidden="true">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          ) : null}
          <pre className="medo-cds__code" style={{ flex: 1, margin: 0 }}>
            <code>
              {highlight
                ? lines.map((l, i) => <div key={i}>{render(l, 'b' + i)}</div>)
                : text}
            </code>
          </pre>
        </div>
      )}
      {overflow && !terminal ? (
        <button type="button" className="medo-cds__more" onClick={() => setOpen(!open)}>
          <Icon name={open ? 'expand_less' : 'expand_more'} size={17} />
          {open ? 'Weniger anzeigen' : 'Alle ' + lines.length + ' Zeilen anzeigen'}
        </button>
      ) : null}
      {live}
    </div>
  )
}
