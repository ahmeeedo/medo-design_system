import { TooltipProvider, Tooltip as TooltipPrimitive, TooltipTrigger, TooltipContent } from '../ui/tooltip'

export function LegacyTooltip({ content, side = 'top', delay = 300, children }) {
  return (
    <TooltipProvider delayDuration={delay}>
      <TooltipPrimitive>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>{content}</TooltipContent>
      </TooltipPrimitive>
    </TooltipProvider>
  )
}
