/* medo Design System · Icon
   Material Symbols Rounded, Weight 300, FILL 0. Die einzige Icon-Quelle im System.
   Erwartet den Ligaturnamen als `name` (z. B. "search", "arrow_forward"). */

export function Icon({ name, size = 20, color, className, style, ...rest }) {
  return (
    <span
      aria-hidden="true"
      className={['medo-icon', className].filter(Boolean).join(' ')}
      style={{
        fontFamily: '"Material Symbols Rounded"',
        fontWeight: 300,
        fontVariationSettings: '"FILL" 0, "GRAD" 0',
        fontSize: size + 'px',
        lineHeight: 1,
        flex: 'none',
        userSelect: 'none',
        // Only set inline when asked: the reference's `color || "inherit"` is the
        // same thing for a span, but an inline value would beat a caller's
        // className colour.
        ...(color ? { color } : null),
        ...style,
      }}
      {...rest}
    >
      {name}
    </span>
  )
}
