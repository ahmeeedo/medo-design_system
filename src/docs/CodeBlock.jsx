import { useState } from 'react'
import styles from './CodeBlock.module.css'

export function CodeBlock({ children, language = 'jsx' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(children.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.lang}>{language}</span>
        <button className={styles.copy} onClick={handleCopy}>
          {copied ? '✓ Kopiert' : 'Kopieren'}
        </button>
      </div>
      <pre className={styles.pre}>
        <code className={styles.code}>{children.trim()}</code>
      </pre>
    </div>
  )
}