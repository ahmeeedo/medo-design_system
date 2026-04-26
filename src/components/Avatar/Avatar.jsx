import styles from './Avatar.module.css'

/**
 * Avatar
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} size
 * @param {string} initials
 * @param {string} src — image URL
 * @param {string} color — background color (CSS value)
 * @param {string} textColor
 */
export function Avatar({ size = 'md', initials, src, color, textColor, alt = '' }) {
  return (
    <div
      className={[styles.avatar, styles[size]].join(' ')}
      style={{ background: color, color: textColor }}
    >
      {src
        ? <img src={src} alt={alt} className={styles.img} />
        : initials}
    </div>
  )
}

/**
 * AvatarGroup — overlapping avatars
 */
export function AvatarGroup({ avatars = [], max = 4, size = 'md' }) {
  const visible = avatars.slice(0, max)
  const overflow = avatars.length - max

  return (
    <div className={styles.group}>
      {visible.map((a, i) => (
        <Avatar key={i} size={size} {...a} />
      ))}
      {overflow > 0 && (
        <div className={[styles.avatar, styles[size], styles.overflow].join(' ')}>
          +{overflow}
        </div>
      )}
    </div>
  )
}
