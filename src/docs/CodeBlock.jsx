import { useState } from 'react'
import { useTranslation } from 'react-i18next'

/* The dark code surface has no semantic token — the ported CodeSnippet sets
   warm dark values directly for the same surface, so the stone scale is the
   closest token-backed equivalent. */
export function CodeBlock({ children, language = 'jsx' }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(children.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border border-[var(--docs-code-border)] rounded-[var(--medo-radius-md)] overflow-hidden bg-[var(--medo-color-stone-1000)]">
      <div className="flex items-center justify-between px-[var(--medo-space-md)] py-[var(--medo-space-xs)] bg-[var(--docs-code-header)] border-b border-[var(--docs-code-border)]">
        <span className="[font-size:var(--medo-text-xs)] [font-family:var(--medo-font-mono)] text-[var(--medo-color-stone-500)] tracking-[var(--medo-tracking-wide)]">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="[font-size:var(--medo-text-xs)] [font-family:var(--medo-font-sans)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-color-stone-500)] bg-transparent border border-[var(--docs-code-line)] rounded-[var(--medo-radius-sm)] px-[var(--medo-space-xs)] py-[var(--medo-space-3xs)] cursor-pointer transition-colors duration-150 ease-out hover:text-[var(--medo-color-white)] hover:border-[var(--medo-color-stone-600)] outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--medo-focus-ring)]"
        >
          {copied ? t('codeblock.copied') : t('codeblock.copy')}
        </button>
      </div>
      <pre className="m-0 p-[var(--medo-space-md)] overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <code className="[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] [line-height:var(--medo-leading-relaxed)] text-[var(--medo-color-stone-300)] whitespace-pre">
          {children.trim()}
        </code>
      </pre>
    </div>
  )
}
