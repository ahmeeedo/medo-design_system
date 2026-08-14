import { useMemo, useState } from 'react'
import { Icon } from '../Icon/Icon'
import './DataTable.css'

/* medo Design System · DataTable
   Tabelle mit Spaltenausrichtung, Sortierung, Auswahl, haftendem Kopf und Leerzustand.
   Zahlen stehen rechts und in DM Mono mit Tabellenziffern. Zeilen sind wahlweise anklickbar. */

function cellClass(col) {
  return (
    [
      col.align === 'right' || col.numeric ? 'medo-dt__cell--num' : null,
      col.align === 'center' ? 'medo-dt__cell--center' : null,
      col.muted ? 'medo-dt__cell--muted' : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined
  )
}

function SelectBox({ on, label, onClick }) {
  return (
    <button
      type="button"
      className="medo-dt__checkbtn"
      aria-label={label}
      aria-pressed={on ? 'true' : 'false'}
      onClick={onClick}
    >
      <span className={['medo-dt__check', on ? 'medo-dt__check--on' : null].filter(Boolean).join(' ')}>
        {on ? <Icon name="check" size={15} /> : null}
      </span>
    </button>
  )
}

export function DataTable({
  columns = [],
  rows = [],
  rowKey = 'id',
  size = 'md',
  title,
  toolbar,
  sort,
  defaultSort,
  onSortChange,
  selectable = false,
  selected,
  onSelectionChange,
  onRowClick,
  loading = false,
  loadingRows = 5,
  bulkActions,
  emptyText = 'Keine Einträge.',
  maxHeight,
  footer,
  ariaLabel,
  className,
  style,
  ...rest
}) {
  const sortControlled = sort !== undefined
  const [innerSort, setInnerSort] = useState(defaultSort || null)
  const activeSort = sortControlled ? sort : innerSort

  const selControlled = selected !== undefined
  const [innerSel, setInnerSel] = useState([])
  const sel = selControlled ? selected || [] : innerSel

  const keyOf = (r, i) => (typeof rowKey === 'function' ? rowKey(r, i) : r[rowKey] !== undefined ? r[rowKey] : i)

  const setSel = (next) => {
    if (!selControlled) setInnerSel(next)
    if (onSelectionChange) onSelectionChange(next)
  }

  const toggleSort = (col) => {
    const dir = activeSort && activeSort.key === col.key && activeSort.direction === 'asc' ? 'desc' : 'asc'
    const next = { key: col.key, direction: dir }
    if (!sortControlled) setInnerSort(next)
    if (onSortChange) onSortChange(next)
  }

  /* Ohne onSortChange sortiert die Komponente selbst — Zahlen numerisch, Text nach Locale. */
  const view = useMemo(() => {
    if (!activeSort || onSortChange) return rows
    const col = columns.find((c) => c.key === activeSort.key)
    if (!col) return rows
    const f = activeSort.direction === 'asc' ? 1 : -1
    return rows.slice().sort((a, b) => {
      const x = a[col.key]
      const y = b[col.key]
      if (typeof x === 'number' && typeof y === 'number') return (x - y) * f
      return String(x == null ? '' : x).localeCompare(String(y == null ? '' : y), 'de') * f
    })
  }, [rows, activeSort, columns, onSortChange])

  const allKeys = view.map(keyOf)
  const allOn = allKeys.length > 0 && allKeys.every((k) => sel.indexOf(k) !== -1)

  return (
    <div className={['medo-dt__wrap', className].filter(Boolean).join(' ')} style={style} {...rest}>
      {title || toolbar || sel.length ? (
        <div className={['medo-dt__bar', sel.length ? 'medo-dt__bar--bulk' : null].filter(Boolean).join(' ')}>
          {sel.length ? (
            <span className="medo-dt__sel">{sel.length + ' ausgewählt'}</span>
          ) : title ? (
            <span className="medo-dt__title">{title}</span>
          ) : null}
          <span className="medo-dt__spacer" />
          {sel.length ? bulkActions || null : toolbar || null}
        </div>
      ) : null}

      <div className="medo-dt__scroll" style={maxHeight ? { maxHeight, overflowY: 'auto' } : undefined}>
        <table
          className={['medo-dt', 'medo-dt--' + size, onRowClick ? 'medo-dt--clickable' : null]
            .filter(Boolean)
            .join(' ')}
          aria-label={ariaLabel || (typeof title === 'string' ? title : undefined)}
        >
          <thead>
            <tr>
              {selectable ? (
                <th className="medo-dt__colcheck" scope="col">
                  <SelectBox
                    on={allOn}
                    label={allOn ? 'Auswahl aufheben' : 'Alle auswählen'}
                    onClick={() => setSel(allOn ? [] : allKeys)}
                  />
                </th>
              ) : null}
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cellClass(col)}
                  style={col.width ? { width: col.width } : undefined}
                  aria-sort={
                    activeSort && activeSort.key === col.key
                      ? activeSort.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : col.sortable
                        ? 'none'
                        : undefined
                  }
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      className={[
                        'medo-dt__sort',
                        activeSort && activeSort.key === col.key ? 'medo-dt__sort--on' : null,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => toggleSort(col)}
                    >
                      {col.label}
                      <Icon
                        name={
                          activeSort && activeSort.key === col.key && activeSort.direction === 'desc'
                            ? 'arrow_downward'
                            : 'arrow_upward'
                        }
                        size={16}
                        className="medo-dt__arrow"
                      />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading
              ? Array.from({ length: loadingRows }).map((_, i) => (
                  <tr key={'sk' + i}>
                    {selectable ? (
                      <td className="medo-dt__colcheck">
                        <div className="medo-dt__sk" style={{ width: '18px' }} />
                      </td>
                    ) : null}
                    {columns.map((col, ci) => (
                      <td key={col.key}>
                        <div className="medo-dt__sk" style={{ width: ci === 0 ? '60%' : ci % 2 ? '75%' : '45%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              : view.length
                ? view.map((r, i) => {
                    const k = keyOf(r, i)
                    const on = sel.indexOf(k) !== -1
                    return (
                      <tr
                        key={k}
                        aria-selected={selectable ? (on ? 'true' : 'false') : undefined}
                        onClick={onRowClick ? () => onRowClick(r, i) : undefined}
                      >
                        {selectable ? (
                          <td className="medo-dt__colcheck" onClick={(e) => e.stopPropagation()}>
                            <SelectBox
                              on={on}
                              label={on ? 'Auswahl aufheben' : 'Zeile auswählen'}
                              onClick={() => setSel(on ? sel.filter((x) => x !== k) : sel.concat([k]))}
                            />
                          </td>
                        ) : null}
                        {columns.map((col) => (
                          <td key={col.key} className={cellClass(col)}>
                            {col.render ? col.render(r[col.key], r, i) : r[col.key]}
                          </td>
                        ))}
                      </tr>
                    )
                  })
                : (
                    <tr>
                      <td colSpan={columns.length + (selectable ? 1 : 0)} className="medo-dt__empty">
                        {emptyText}
                      </td>
                    </tr>
                  )}
          </tbody>
        </table>
      </div>

      {footer ? <div className="medo-dt__foot">{footer}</div> : null}
    </div>
  )
}
