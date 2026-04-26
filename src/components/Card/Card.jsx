import styles from './Card.module.css'

/**
 * Card — composable via Card.Header, Card.Body, Card.Footer
 * @param {'flat'|'raised'} variant
 */
export function Card({ variant = 'flat', className = '', children, ...props }) {
  return (
    <div className={[styles.card, styles[variant], className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  )
}

Card.Header = function CardHeader({ title, subtitle, children, className = '' }) {
  return (
    <div className={[styles.header, className].filter(Boolean).join(' ')}>
      {(title || subtitle) ? (
        <>
          {title && <div className={styles.title}>{title}</div>}
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </>
      ) : children}
      {title && children}
    </div>
  )
}

Card.Body = function CardBody({ children, className = '' }) {
  return (
    <div className={[styles.body, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={[styles.footer, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}
