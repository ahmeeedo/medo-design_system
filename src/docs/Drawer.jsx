import { Icon } from '@/components/Icon/Icon'
import { Overlay } from './Overlay'

/* Bottom drawer carrying the table of contents on small viewports. */
export function Drawer({ open, onClose, title, closeLabel, children }) {
  return (
    <Overlay
      open={open}
      onClose={onClose}
      label={title}
      className="absolute bottom-0 left-0 right-0 max-h-[60vh] overflow-y-auto p-[var(--medo-space-lg)] rounded-t-[var(--medo-radius-2xl)] bg-[var(--medo-overlay)] border-t border-[var(--medo-border)] shadow-[var(--medo-shadow-xl)] outline-none md:hidden"
    >
      <div className="flex items-center justify-between mb-[var(--medo-space-lg)]">
        <span className="[font-size:var(--medo-text-base)] [font-family:var(--medo-font-sans)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)]">
          {title}
        </span>
        <button
          onClick={onClose}
          aria-label={closeLabel}
          className="flex items-center justify-center w-[var(--docs-hit-target)] h-[var(--docs-hit-target)] -mr-[var(--medo-space-xs)] rounded-[var(--medo-radius-md)] text-[var(--medo-icon)] cursor-pointer bg-transparent border-0 transition-colors duration-150 ease-out hover:bg-[var(--medo-state-hover)] outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--medo-focus-ring)]"
        >
          <Icon name="close" size={24} />
        </button>
      </div>
      {children}
    </Overlay>
  )
}
