import { useTranslation } from 'react-i18next'
import { useTokenValues } from './tokens'

const CELL = 'px-[var(--medo-space-md)] py-[var(--medo-space-sm)] align-middle'
const HEAD = `${CELL} text-left [font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] [font-weight:var(--medo-weight-medium)] uppercase tracking-[var(--medo-tracking-wide)] text-[var(--medo-text-muted)] border-b border-[var(--medo-border-subtle)] whitespace-nowrap`
const MONO = '[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] whitespace-nowrap'

/* `tokens` holds token names only — every value in the table is read back from
   the loaded token chain, never written into the page. */
export function TokensTable({ tokens = [] }) {
  const { t } = useTranslation()
  const names = tokens.map((row) => row.token)
  const values = useTokenValues(names)

  const showRef = tokens.some((row) => row.ref)
  const showDescription = tokens.some((row) => row.description)

  return (
    <div className="border border-[var(--medo-border-subtle)] rounded-[var(--medo-radius-lg)] overflow-hidden overflow-x-auto [-webkit-overflow-scrolling:touch] mb-[var(--medo-space-lg)]">
      <table className="w-full border-collapse [font-family:var(--medo-font-sans)] [font-size:var(--medo-text-sm)]">
        <thead className="bg-[var(--medo-surface-container)]">
          <tr>
            <th className={HEAD}>{t('tokensTable.token')}</th>
            <th className={HEAD}>{t('tokensTable.value')}</th>
            {showRef && <th className={HEAD}>{t('tokensTable.reference')}</th>}
            {showDescription && <th className={HEAD}>{t('tokensTable.description')}</th>}
          </tr>
        </thead>
        <tbody className="[&>tr:not(:last-child)>td]:border-b [&>tr:not(:last-child)>td]:border-[var(--medo-border-subtle)]">
          {tokens.map((row) => (
            <tr key={row.token} className="hover:[&>td]:bg-[var(--medo-state-hover)]">
              <td className={CELL}>
                <code className={`${MONO} bg-[var(--medo-surface-container-high)] text-[var(--medo-text)] px-[var(--medo-space-2xs)] py-[var(--medo-space-3xs)] rounded-[var(--medo-radius-sm)]`}>
                  {row.token}
                </code>
              </td>
              <td className={CELL}>
                <div className="flex items-center gap-[var(--medo-space-xs)]">
                  {isColor(values[row.token]) && (
                    <span
                      className="w-[var(--medo-space-md)] h-[var(--medo-space-md)] rounded-[var(--medo-radius-sm)] border border-[var(--medo-border)] shrink-0"
                      style={{ background: `var(${row.token})` }}
                    />
                  )}
                  <code className={`${MONO} text-[var(--medo-text-muted)]`}>{values[row.token]}</code>
                </div>
              </td>
              {showRef && (
                <td className={CELL}>
                  <code className={`${MONO} text-[var(--medo-text-muted)]`}>{row.ref}</code>
                </td>
              )}
              {showDescription && (
                <td className={`${CELL} text-[var(--medo-text-muted)]`}>{row.description}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function isColor(value) {
  return /^(#|rgb|hsl|oklch|color\()/.test(value ?? '')
}
