import { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Fuse from 'fuse.js'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { Icon } from '@/components/Icon/Icon'
import { searchData } from '@/config/searchData'

const TAB_LABELS = {
  overview: 'Overview', usage: 'Usage', tokens: 'Tokens',
  code: 'Code', accessibility: 'Accessibility',
}

export function DocsSearch({ isOpen, onClose }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef(null)
  const resultRefs = useRef([])

  const fuse = useMemo(() => {
    const filtered = searchData.filter((e) => e.lang === i18n.language)
    return new Fuse(filtered, { keys: ['pageTitle', 'section'], threshold: 0.3 })
  }, [i18n.language])

  const results = useMemo(() => {
    if (!query.trim()) return []
    return fuse.search(query).map((r) => r.item)
  }, [fuse, query])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setActiveIndex(-1)
    }
  }, [isOpen])

  useEffect(() => {
    if (activeIndex >= 0) {
      resultRefs.current[activeIndex]?.focus()
    } else {
      inputRef.current?.focus()
    }
  }, [activeIndex])

  const handleSelect = (result) => {
    navigate(`${result.route}?tab=${result.tab}`)
    setTimeout(() => document.getElementById(result.anchor)?.scrollIntoView({ behavior: 'smooth' }), 100)
    onClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => Math.max(prev - 1, -1))
    } else if (e.key === 'Tab') {
      e.preventDefault()
      if (!e.shiftKey) {
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
      } else {
        setActiveIndex((prev) => Math.max(prev - 1, -1))
      }
    }
  }

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[var(--medo-scrim)]" />
        <DialogPrimitive.Content
          aria-label={t('search.open')}
          onKeyDown={handleKeyDown}
          className="fixed top-[10%] left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-xl z-50 bg-[var(--medo-overlay)] border border-[var(--medo-border)] rounded-[var(--medo-radius-lg)] shadow-[var(--medo-shadow-xl)] overflow-hidden outline-none [font-family:var(--medo-font-sans)]"
        >
          <div className="flex items-center gap-[var(--medo-space-xs)] px-[var(--medo-space-sm)] border-b border-[var(--medo-border-subtle)]">
            <Icon name="search" size={20} color="var(--medo-icon-muted)" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setActiveIndex(-1) }}
              placeholder={t('search.placeholder')}
              className="flex-1 h-[var(--medo-space-2xl)] bg-transparent border-0 outline-none [font-size:var(--medo-text-base)] text-[var(--medo-input-text)] placeholder:text-[var(--medo-input-placeholder)] [font-family:var(--medo-font-sans)]"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label={t('search.clear')}
                className="flex items-center justify-center w-[calc(var(--medo-space-lg)+var(--medo-space-2xs))] h-[calc(var(--medo-space-lg)+var(--medo-space-2xs))] shrink-0 rounded-[var(--medo-radius-sm)] bg-[var(--medo-action-neutral)] text-[var(--medo-icon-muted)] cursor-pointer border-0 transition-colors duration-150 ease-out hover:bg-[var(--medo-action-neutral-hover)] hover:text-[var(--medo-text)] outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--medo-focus-ring)]"
                tabIndex={-1}
              >
                <Icon name="close" size={18} />
              </button>
            )}
          </div>

          {query && (
            <div className="max-h-[400px] overflow-y-auto py-[var(--medo-space-2xs)]">
              {results.length === 0 ? (
                <p className="px-[var(--medo-space-md)] py-[var(--medo-space-sm)] text-sm text-[var(--medo-text-muted)]">
                  {t('search.noResults')}
                </p>
              ) : (
                results.map((result, index) => (
                  <button
                    key={result.id}
                    ref={(el) => { resultRefs.current[index] = el }}
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`w-full text-left flex items-center gap-[var(--medo-space-sm)] px-[var(--medo-space-md)] py-[var(--medo-space-xs)] cursor-pointer border-0 outline-none transition-colors duration-150 ease-out focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--medo-focus-ring)] ${activeIndex === index ? 'bg-[var(--medo-state-hover)]' : 'bg-transparent hover:bg-[var(--medo-state-hover)]'}`}
                  >
                    <Icon
                      name={result.type === 'section' ? 'format_h2' : 'web_asset'}
                      size={20}
                      color="var(--medo-icon-muted)"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[var(--medo-text)] [font-weight:var(--medo-weight-medium)] truncate">
                        {result.section}
                      </div>
                      <div className="flex items-center gap-[var(--medo-space-3xs)] mt-px">
                        <span className="[font-size:var(--medo-text-xs)] text-[var(--medo-text-muted)]">{result.pageTitle}</span>
                        {result.type === 'section' && (
                          <>
                            <Icon name="chevron_right" size={18} color="var(--medo-icon-muted)" />
                            <span className="[font-size:var(--medo-text-xs)] text-[var(--medo-text-muted)]">{TAB_LABELS[result.tab] ?? result.tab}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
