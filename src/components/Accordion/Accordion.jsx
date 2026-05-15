import {
  Accordion as AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

export function Accordion({ items = [], allowMultiple = false }) {
  return (
    <AccordionRoot
      type={allowMultiple ? 'multiple' : 'single'}
      collapsible={!allowMultiple}
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </AccordionRoot>
  )
}
