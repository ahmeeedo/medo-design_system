import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@/components/Icon/Icon'
import { ICON_BTN } from './chromeStyles'

const STORAGE_KEY = 'medo-theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

/* A remembered choice sets data-theme on <html>. Without one the attribute
   stays absent and CSS follows the system, so the effective theme is not
   readable from the DOM — the button tracks the media query itself to keep
   its label and pressed state honest. */
function storedChoice() {
  const value = localStorage.getItem(STORAGE_KEY)
  return value === 'light' || value === 'dark' ? value : null
}

function systemTheme() {
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

export function ThemeSwitcher() {
  const { t } = useTranslation()
  const [choice, setChoice] = useState(storedChoice)
  const [system, setSystem] = useState(systemTheme)

  useEffect(() => {
    const query = window.matchMedia(DARK_QUERY)
    const onChange = (event) => setSystem(event.matches ? 'dark' : 'light')
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const dark = (choice ?? system) === 'dark'

  /* Written straight to the DOM rather than from an effect so the switch lands
     in the same frame as the click. */
  const toggle = () => {
    const next = dark ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    localStorage.setItem(STORAGE_KEY, next)
    setChoice(next)
  }

  return (
    <button
      className={ICON_BTN}
      onClick={toggle}
      aria-pressed={dark}
      aria-label={t('app.themeToggle')}
    >
      <Icon name={dark ? 'dark_mode' : 'light_mode'} size={24} />
    </button>
  )
}
