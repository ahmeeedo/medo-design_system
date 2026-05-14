import { useTranslation } from 'react-i18next'

export function TokensTable({ tokens = [] }) {
  const { t } = useTranslation()

  return (
    <div className="border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden overflow-x-auto [-webkit-overflow-scrolling:touch] mb-[var(--space-8)]">
      <table className="w-full border-collapse text-[var(--text-sm)] min-w-[480px]">
        <thead className="bg-[var(--surface_200)]">
          <tr>
            <th className="text-left px-[var(--space-4)] py-[var(--space-3)] text-[var(--text-xs)] [font-weight:var(--weight-semibold)] text-[var(--color-text-secondary)] tracking-[var(--tracking-wide)] uppercase border-b border-[var(--border-subtle-100)] whitespace-nowrap">
              {t('tokensTable.token')}
            </th>
            <th className="text-left px-[var(--space-4)] py-[var(--space-3)] text-[var(--text-xs)] [font-weight:var(--weight-semibold)] text-[var(--color-text-secondary)] tracking-[var(--tracking-wide)] uppercase border-b border-[var(--border-subtle-100)] whitespace-nowrap">
              {t('tokensTable.value')}
            </th>
            <th className="text-left px-[var(--space-4)] py-[var(--space-3)] text-[var(--text-xs)] [font-weight:var(--weight-semibold)] text-[var(--color-text-secondary)] tracking-[var(--tracking-wide)] uppercase border-b border-[var(--border-subtle-100)] whitespace-nowrap">
              {t('tokensTable.description')}
            </th>
          </tr>
        </thead>
        <tbody className="[&>tr:not(:last-child)>td]:border-b [&>tr:not(:last-child)>td]:border-[var(--border-subtle-100)]">
          {tokens.map((row) => (
            <tr key={row.token} className="hover:[&>td]:bg-[var(--surface_200)]">
              <td className="px-[var(--space-4)] py-[var(--space-3)] align-middle">
                <code className="[font-family:var(--font-mono)] text-[var(--text-xs)] bg-[var(--color-neutral-100)] text-[var(--color-neutral-800)] px-[6px] py-[2px] rounded-[var(--radius-sm)] whitespace-nowrap">
                  {row.token}
                </code>
              </td>
              <td className="px-[var(--space-4)] py-[var(--space-3)] align-middle">
                <div className="flex items-center gap-[var(--space-2)]">
                  {isColor(row.value) && (
                    <div
                      className="w-[14px] h-[14px] rounded-[var(--radius-sm)] border border-black/10 shrink-0"
                      style={{ background: row.value }}
                    />
                  )}
                  <code className="[font-family:var(--font-mono)] text-[var(--text-xs)] text-[var(--color-neutral-600)] whitespace-nowrap uppercase">
                    {row.value}
                  </code>
                </div>
              </td>
              <td className="px-[var(--space-4)] py-[var(--space-3)] align-middle">
                <span className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">{row.description}</span>
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
