import { cn } from '@/lib/utils'
import {
  DropdownMenu as DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

const defaultTrigger = (
  <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-sm text-[var(--color-text-secondary)] hover:bg-[var(--surface_200)] border border-border transition-colors">
    ···
  </button>
)

export function Menu({ children, className = '', trigger }) {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger asChild>
        {trigger ?? defaultTrigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn('min-w-[200px] w-auto', className)}>
        {children}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  )
}

Menu.Item = function MenuItem({ children, icon, shortcut, danger = false, onClick, disabled = false }) {
  return (
    <DropdownMenuItem
      variant={danger ? 'destructive' : 'default'}
      onClick={onClick}
      disabled={disabled}
      className="gap-3 px-3 py-2 cursor-pointer"
    >
      {icon && <span className="shrink-0 text-sm">{icon}</span>}
      <span className="flex-1 text-sm">{children}</span>
      {shortcut && (
        <span className="ml-auto text-xs font-mono text-[var(--color-text-secondary)]">{shortcut}</span>
      )}
    </DropdownMenuItem>
  )
}

Menu.Label = function MenuLabel({ children }) {
  return (
    <DropdownMenuLabel className="text-xs font-semibold [letter-spacing:var(--tracking-wide)] uppercase text-[var(--color-text-secondary)] px-3 pt-2 pb-1">
      {children}
    </DropdownMenuLabel>
  )
}

Menu.Separator = function MenuSeparator() {
  return <DropdownMenuSeparator />
}
