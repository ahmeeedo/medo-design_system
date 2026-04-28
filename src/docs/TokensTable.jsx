import styles from './TokensTable.module.css'

/**
 * TokensTable
 * @param {Array<{token: string, value: string, description: string}>} tokens
 */
export function TokensTable({ tokens = [] }) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Token</th>
            <th className={styles.th}>Value</th>
            <th className={styles.th}>Description</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr key={t.token} className={styles.tr}>
              <td className={styles.td}>
                <code className={styles.token}>{t.token}</code>
              </td>
              <td className={styles.td}>
                <div className={styles.valueCell}>
                  {isColor(t.value) && (
                    <div className={styles.colorDot} style={{ background: t.value }} />
                  )}
                  <code className={styles.value}>{t.value}</code>
                </div>
              </td>
              <td className={styles.td}>
                <span className={styles.desc}>{t.description}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function isColor(value) {
  return value?.startsWith('#') || value?.startsWith('rgb') || value?.startsWith('hsl')
}