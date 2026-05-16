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

export function Search({ isOpen, onClose }) {
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
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 [z-index:var(--z-overlay)]" />
        <DialogPrimitive.Content
          aria-label={t('search.open')}
          onKeyDown={handleKeyDown}
          className="fixed top-[10%] left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-xl [z-index:var(--z-modal)] bg-[var(--surface_100)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xl)] overflow-hidden outline-none"
        >
          <div className="flex items-center gap-[var(--space-2)] px-[var(--space-3)] border-b border-[var(--color-border)]">
            <Icon name="search" className="text-[var(--color-text-secondary)] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setActiveIndex(-1) }}
              placeholder={t('search.placeholder')}
              className="flex-1 h-12 bg-transparent border-0 outline-none text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] [font-family:var(--font-sans)]"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer bg-transparent border-0 outline-none"
                tabIndex={-1}
              >
                <Icon name="close" />
              </button>
            )}
          </div>

          {query && (
            <div className="max-h-[400px] overflow-y-auto py-[var(--space-1)]">
              {results.length === 0 ? (
                <p className="px-[var(--space-4)] py-[var(--space-3)] text-sm text-[var(--color-text-secondary)]">
                  {t('search.noResults')}
                </p>
              ) : (
                results.map((result, index) => (
                  <button
                    key={result.id}
                    ref={(el) => { resultRefs.current[index] = el }}
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`w-full text-left flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-2)] cursor-pointer border-0 outline-none transition-colors duration-[var(--duration-fast)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-focus-500)] ${activeIndex === index ? 'bg-[var(--surface_200)]' : 'bg-transparent hover:bg-[var(--surface_200)]'}`}
                  >
                    <Icon
                      name={result.type === 'section' ? 'format_h2' : 'web_asset'}
                      className="text-[var(--color-text-secondary)] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[var(--color-text-primary)] [font-weight:var(--weight-medium)] truncate">
                        {result.section}
                      </div>
                      <div className="flex items-center gap-[var(--space-1)] mt-px">
                        <span className="text-xs text-[var(--color-text-secondary)]">{result.pageTitle}</span>
                        {result.type === 'section' && (
                          <>
                            <Icon name="chevron_right" className="text-[var(--color-text-secondary)] [font-size:0.75rem]" />
                            <span className="text-xs text-[var(--color-text-secondary)]">{TAB_LABELS[result.tab] ?? result.tab}</span>
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
