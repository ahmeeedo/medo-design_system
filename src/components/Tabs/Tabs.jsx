import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from '../Icon/Icon'
import './Tabs.css'

/* medo Design System · Tabs
   Wechsel zwischen gleichrangigen Ansichten desselben Objekts.
   Zwei Stile: underline (Indikator, ohne Grundlinie) und contained (Fläche auf stone-100-Leiste).
   Tastatur: Pfeile wechseln direkt, Home/End springen an den Rand; deaktivierte Tabs werden
   übersprungen. Kinder werden — falls vorhanden — als Panel des aktiven Tabs gerendert. */

export function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  variant = 'underline',
  size = 'md',
  orientation = 'horizontal',
  fullWidth = false,
  scrollable = false,
  ariaLabel,
  children,
  className,
  style,
  ...rest
}) {
  const uid = useId()
  const controlled = value !== undefined
  const first = items.find((t) => !t.disabled) || items[0] || {}
  const [inner, setInner] = useState(defaultValue !== undefined ? defaultValue : first.value)
  const active = controlled ? value : inner
  const listRef = useRef(null)
  const scrollerRef = useRef(null)
  const vertical = orientation === 'vertical'

  const select = (v) => {
    if (!controlled) setInner(v)
    if (onChange) onChange(v)
  }

  /* Pfeiltasten: nächster bedienbarer Tab, Auswahl folgt dem Fokus. */
  const onKeyDown = (e) => {
    const keys = vertical
      ? { prev: 'ArrowUp', next: 'ArrowDown' }
      : { prev: 'ArrowLeft', next: 'ArrowRight' }
    if (![keys.prev, keys.next, 'Home', 'End'].includes(e.key)) return
    e.preventDefault()
    const usable = items.filter((t) => !t.disabled)
    if (!usable.length) return
    let target
    if (e.key === 'Home') target = usable[0]
    else if (e.key === 'End') target = usable[usable.length - 1]
    else {
      const i = usable.findIndex((t) => t.value === active)
      const step = e.key === keys.next ? 1 : -1
      target = usable[(i + step + usable.length) % usable.length]
    }
    select(target.value)
    const el = listRef.current && listRef.current.querySelector('[data-val="' + target.value + '"]')
    if (el) el.focus()
  }

  /* Der gewählte Tab wird ins Bild geholt — und darüber hinaus so weit, dass der
     benachbarte Tab hereinlugt. Ohne diesen Nachlauf ist der Leiste nicht anzusehen,
     dass sie weitergeht; mit ihm bewegt sie sich schon beim Tab davor.
     Der Nachlauf ist nach beiden Seiten begrenzt, damit der gewählte Tab dabei nie
     aus seinem Randabstand rutscht.
     Gerollt wird die Hülle unmittelbar statt über scrollIntoView: das würde jeden
     rollenden Vorfahren mitbewegen und in einer Seite mit haftendem Kopf den Inhalt
     darunter wegziehen.
     Beide Anteile werden gerechnet und in EINEM Ruck gerollt, damit die Bewegung weich
     laufen kann; nachgemessen landet das auf demselben Wert wie zwei getrennte Rucke.

     Abhängigkeiten: `active`, `fullWidth` und `vertical` — vollständig. Die beiden letzteren
     entscheiden, OB die Hülle gerendert wird. Wird sie dabei neu eingehängt, steht sie auf
     Rollposition 0, und der gewählte Tab kann außerhalb des Bildes liegen; ohne die beiden
     Angaben liefe der Effekt dann nicht und die Leiste bliebe stehen. Gemessen, siehe
     Tabs.test.jsx. Ein Lauf in die andere Richtung — die Hülle verschwindet — bricht an
     `scrollerRef.current === null` folgenlos ab. Das Ref selbst gehört nicht in die Liste:
     seine Identität ist stabil. */
  useEffect(() => {
    const box = scrollerRef.current
    if (!box || active == null) return
    const btn = box.querySelector('[data-val="' + active + '"]')
    if (!btn) return

    const pad = parseFloat(getComputedStyle(box).scrollPaddingInlineStart) || 0
    const rahmen = box.getBoundingClientRect()
    const fehlt = (links, rechts) => {
      const kurz = links - (rahmen.left + pad)
      const drueber = rechts - (rahmen.right - pad)
      return kurz < 0 ? kurz : drueber > 0 ? drueber : 0
    }

    const roh = btn.getBoundingClientRect()
    const ersterAnteil = fehlt(roh.left, roh.right)

    /* Nach dem ersten Anteil liegen alle Kanten um genau diesen Betrag weiter links. */
    const b = { left: roh.left - ersterAnteil, right: roh.right - ersterAnteil }
    const davor = btn.previousElementSibling
    const danach = btn.nextElementSibling
    const links = davor
      ? Math.max(davor.getBoundingClientRect().left - ersterAnteil, b.left - pad)
      : b.left
    const rechts = danach
      ? Math.min(danach.getBoundingClientRect().right - ersterAnteil, b.right + pad)
      : b.right
    const tiefst = b.right - (rahmen.right - pad)
    const hoechst = b.left - (rahmen.left + pad)
    const zweiterAnteil = Math.min(Math.max(fehlt(links, rechts), tiefst), hoechst)

    const delta = ersterAnteil + zweiterAnteil
    if (delta) box.scrollBy({ left: delta, behavior: 'smooth' })
  }, [active, fullWidth, vertical])

  const list = (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
      onKeyDown={onKeyDown}
      className={[
        'medo-tabs__list',
        'medo-tabs__list--' + (vertical ? 'vertical' : variant),
        'medo-tabs__list--' + size,
      ]
        .filter(Boolean)
        .join(' ')}
      style={fullWidth && !vertical ? { display: 'flex' } : undefined}
    >
      {items.map((t) => {
        const selected = t.value === active
        const glyph = size === 'sm' ? 17 : variant === 'contained' ? 18 : 19
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            id={uid + '-tab-' + t.value}
            data-val={t.value}
            aria-selected={selected ? 'true' : 'false'}
            aria-controls={children ? uid + '-panel' : undefined}
            tabIndex={selected ? 0 : -1}
            disabled={!!t.disabled}
            onClick={() => !t.disabled && select(t.value)}
            className={[
              'medo-tabs__tab',
              'medo-tabs__tab--' + (vertical ? 'vertical' : variant),
              fullWidth && !vertical ? 'medo-tabs__tab--full' : null,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className="medo-tabs__inner">
              {t.icon ? <Icon name={t.icon} size={glyph} /> : null}
              <span>{t.label}</span>
              {t.badge !== undefined && t.badge !== null ? (
                <span className="medo-tabs__badge">{t.badge}</span>
              ) : null}
            </span>
            {variant === 'underline' || vertical ? (
              <span className="medo-tabs__ind" aria-hidden="true" />
            ) : null}
          </button>
        )
      })}
    </div>
  )

  /* Jede waagerechte Leiste bekommt die Hülle — ausgenommen fullWidth, wo die Tabs sich
     die Breite teilen und deshalb nichts überhängen kann. Ohne diese Weitung schiebt eine
     Leiste, deren Tabs nicht nebeneinanderpassen, die ganze Seite auf. */
  const listOrScroller =
    !vertical && !fullWidth ? (
      <div className="medo-tabs__scroller" ref={scrollerRef}>
        {list}
      </div>
    ) : (
      list
    )

  return (
    <div
      className={['medo-tabs', vertical ? 'medo-tabs--vertical' : null, className]
        .filter(Boolean)
        .join(' ')}
      style={style}
      {...rest}
    >
      {listOrScroller}
      {children ? (
        <div
          role="tabpanel"
          id={uid + '-panel'}
          aria-labelledby={uid + '-tab-' + active}
          tabIndex={0}
          className="medo-tabs__panel"
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}
