export function DocSection({ id, title, description, children }) {
  return (
    <section id={id} className="mb-[var(--space-24)] pt-[var(--space-8)] max-md:mb-[var(--space-16)] max-md:pt-[var(--space-6)]">
      <h2 className="text-2xl [font-weight:var(--weight-semibold)] tracking-[var(--tracking-snug)] leading-[var(--leading-snug)] text-[var(--color-text-primary)] mb-[var(--space-2)] max-md:text-xl">{title}</h2>
      {description && <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-8)] max-w-[56ch] max-md:text-sm max-md:mb-[var(--space-6)]">{description}</p>}
      <div>{children}</div>
    </section>
  )
}

export function SubSection({ title, children }) {
  return (
    <div className="mb-[var(--space-10)] max-md:mb-[var(--space-7)]">
      <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-4)] pb-[var(--space-2)] border-b border-[var(--color-border)]">{title}</div>
      {children}
    </div>
  )
}

export function Row({ children, wrap = true, align = 'flex-start', gap = 'var(--space-3)' }) {
  return (
    <div className="flex mb-[var(--space-4)]" style={{ flexWrap: wrap ? 'wrap' : 'nowrap', alignItems: align, gap }}>
      {children}
    </div>
  )
}

export function Grid2({ children }) {
  return (
    <div className="grid grid-cols-2 gap-[var(--space-6)] max-[640px]:grid-cols-1 max-[640px]:gap-[var(--space-5)]">
      {children}
    </div>
  )
}

export function TokenChip({ children }) {
  return (
    <code className="[font-family:var(--font-mono)] text-xs bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] px-[6px] py-[2px] rounded-[var(--radius-sm)] whitespace-nowrap">
      {children}
    </code>
  )
}
