import { cn } from '@/lib/utils'

export function Table({ columns = [], rows = [], rowKey = 'id' }) {
  return (
    <div className="border border-border-subtle rounded-lg overflow-x-auto">
      <table className="w-full border-collapse text-sm min-w-[500px]">
        <thead className="bg-surface-alt">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left py-3 px-4 text-xs font-semibold text-content-secondary tracking-[var(--tracking-wide)] uppercase border-b border-border-subtle whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row[rowKey]} className="group">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    'p-4 border-b border-border-subtle text-content-primary align-middle group-hover:bg-surface-alt',
                    i === rows.length - 1 && 'border-b-0'
                  )}
                >
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
