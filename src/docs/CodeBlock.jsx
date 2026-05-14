import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function CodeBlock({ children, language = 'jsx' }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(children.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border border-[var(--color-neutral-800)] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-neutral-900)]">
      <div className="flex items-center justify-between px-[var(--space-4)] py-[var(--space-2)] bg-[var(--color-neutral-800)] border-b border-[var(--color-neutral-700)]">
        <span className="text-xs [font-family:var(--font-mono)] text-[var(--color-neutral-400)] tracking-[var(--tracking-wide)]">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs [font-family:var(--font-sans)] [font-weight:var(--weight-medium)] text-[var(--color-neutral-400)] bg-transparent border border-[var(--color-neutral-700)] rounded-[var(--radius-sm)] px-[var(--space-2)] py-[2px] cursor-pointer transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:text-[var(--color-neutral-0)] hover:border-[var(--color-neutral-500)]"
        >
          {copied ? t('codeblock.copied') : t('codeblock.copy')}
        </button>
      </div>
      <pre className="m-0 p-[var(--space-5)] overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <code className="[font-family:var(--font-mono)] text-xs leading-[var(--leading-relaxed)] text-[var(--color-neutral-200)] whitespace-pre">
          {children.trim()}
        </code>
      </pre>
    </div>
  )
}
