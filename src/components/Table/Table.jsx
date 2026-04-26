import styles from './Table.module.css'

/**
 * Table
 *
 * @param {Array<{key: string, label: string, render?: (row) => ReactNode}>} columns
 * @param {Array<object>} rows
 * @param {string} rowKey — key to use as row id
 */
export function Table({ columns = [], rows = [], rowKey = 'id' }) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={styles.th}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[rowKey]} className={styles.tr}>
              {columns.map((col) => (
                <td key={col.key} className={styles.td}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
