import { useEffect, useState } from 'react'
import { Icon } from '../Icon/Icon'
import './Avatar.css'

/* medo Design System · Avatar
   Zeigt, um welche Person es geht: ein Bild, sonst zwei Buchstaben, sonst ein
   Personen-Symbol. Immer rund — rund ist im System eine Person, eckig eine Sache.

   Die Farbe gehört zur Person: sie wird bei der Registrierung vergeben und ist
   von ihr änderbar. Sie wird nie berechnet, nie aus dem Namen abgeleitet und nie
   aus der Position in einer Liste bestimmt. Zwei Personen dürfen dieselbe Farbe
   haben; die Farbe trägt keine Bedeutung und ist kein Ordnungsmerkmal. */

const AVATAR_COLORS = [
  'red', 'crimson', 'rose', 'orange', 'amber', 'yellow', 'green', 'teal',
  'cyan', 'blue', 'indigo', 'violet', 'purple', 'grey', 'stone',
]

/* Symbol size at a 1:2 ratio to the circle — the same ratio the contained list
   uses in its empty state (52px circle, 26px symbol). */
const AVATAR_GLYPH = { sm: 15, md: 19, lg: 32 }

/* Two letters from a name or user name.

   Separator precedence: a space beats a full stop, a full stop beats a hyphen
   and an underscore. Only when none occurs does inner capitalisation split;
   failing that, the first two characters count. The precedence keeps double
   first names together: "Anna-Lena Schmidt" yields AS, not AL. For an e-mail
   address only the part before the @ counts.

   Andreas Müller -> AM · PeterZeider -> PZ · renatosanches -> RE
   Dr. Marie Hoffmann -> DM · anna.mueller -> AM · anna@medo.de -> AN
   Müller -> MÜ */
export function medoAvatarInitials(name) {
  if (!name) return ''
  const local = String(name).split('@')[0].trim()
  if (!local) return ''
  let parts = [local]
  const separators = [/\s+/, /\./, /[-_]/]
  for (let i = 0; i < separators.length && parts.length === 1; i++) {
    const attempt = local.split(separators[i]).filter(Boolean)
    if (attempt.length > 1) parts = attempt
  }
  if (parts.length === 1) {
    const camel = parts[0].split(/(?=\p{Lu})/u).filter(Boolean)
    if (camel.length > 1) parts = camel
  }
  const letters =
    parts.length > 1 ? parts[0].charAt(0) + parts[1].charAt(0) : parts[0].slice(0, 2)
  return letters.toLocaleUpperCase('de-DE')
}

export function Avatar({
  name,
  initials,
  src,
  color = 'teal',
  size = 'md',
  loading = false,
  label,
  className,
  style,
  ...rest
}) {
  /* Both hooks stand unconditionally at the top — never behind a condition. */
  const [imgFailed, setImgFailed] = useState(false)
  useEffect(() => {
    setImgFailed(false)
  }, [src])

  const letters = initials != null && initials !== '' ? initials : medoAvatarInitials(name)
  const scheme = AVATAR_COLORS.indexOf(color) >= 0 ? color : 'teal'

  /* The fallback in the approved order. That an image fails to load is not a
     hypothetical safeguard but happens regularly in operation — stale address,
     server not answering, network gone. */
  const showImage = !loading && !!src && !imgFailed
  const showLetters = !loading && !showImage && !!letters
  const showSymbol = !loading && !showImage && !showLetters

  const modifier = loading
    ? 'medo-av--loading'
    : showSymbol
      ? 'medo-av--symbol'
      : showImage
        ? null
        : 'medo-av--' + scheme

  /* With the name alongside, the circle is redundant for screen readers —
     hearing "AM" read out helps nobody. Standing alone, the caller supplies a
     label. */
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': 'true' }

  return (
    <span
      className={['medo-av', 'medo-av--' + size, modifier, className].filter(Boolean).join(' ')}
      style={style}
      {...a11y}
      {...rest}
    >
      {showImage ? (
        <img className="medo-av__img" src={src} alt="" onError={() => setImgFailed(true)} />
      ) : showLetters ? (
        letters
      ) : showSymbol ? (
        <Icon name="person" size={AVATAR_GLYPH[size] || 19} />
      ) : null}
    </span>
  )
}
