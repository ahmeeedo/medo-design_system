import { useState } from 'react'
import styles from './Accordion.module.css'

/**
 * Accordion — multiple independent items
 *
 * @param {Array<{id: string, title: string, content: ReactNode}>} items
 * @param {boolean} allowMultiple — allow multiple items open simultaneously
 */
export function Accordion({ items = [], allowMultiple = false }) {
  const [openItems, setOpenItems] = useState(new Set())

  const toggle = (id) => {
    setOpenItems((prev) => {
      const next = new Set(allowMultiple ? prev : [])
      if (prev.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className={styles.accordion}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          title={item.title}
          open={openItems.has(item.id)}
          onToggle={() => toggle(item.id)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  )
}

function AccordionItem({ title, open, onToggle, children }) {
  return (
    <div className={[styles.item, open ? styles.open : ''].join(' ')}>
      <button className={styles.trigger} onClick={onToggle} aria-expanded={open}>
        <span>{title}</span>
        <svg
          className={styles.icon}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className={styles.body}>
          {children}
        </div>
      )}
    </div>
  )
}
