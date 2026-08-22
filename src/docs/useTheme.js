import { useEffect, useState } from 'react'

const DARK_QUERY = '(prefers-color-scheme: dark)'

/* Which theme is actually painting. ThemeSwitcher owns the choice and writes
   data-theme; without that attribute the system query decides, so neither
   source alone is the answer. */
export function resolveTheme() {
  const forced = document.documentElement.dataset.theme
  if (forced === 'light' || forced === 'dark') return forced
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

/* Anything that reads token values back out of the DOM has to re-run on a
   theme change — computed values are read once and would otherwise keep
   showing the values of the theme that was active on mount. */
export function useTheme() {
  const [theme, setTheme] = useState(resolveTheme)

  useEffect(() => {
    const sync = () => setTheme(resolveTheme())
    const query = window.matchMedia(DARK_QUERY)
    const observer = new MutationObserver(sync)

    query.addEventListener('change', sync)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    sync()

    return () => {
      query.removeEventListener('change', sync)
      observer.disconnect()
    }
  }, [])

  return theme
}
