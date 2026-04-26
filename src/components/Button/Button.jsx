import styles from './Button.module.css'

/**
 * Button
 *
 * @param {'primary'|'accent'|'secondary'|'ghost'|'danger'|'link'} variant
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} size
 * @param {boolean} disabled
 * @param {React.ReactNode} children
 */
export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[styles.btn, styles[variant], styles[size], className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
