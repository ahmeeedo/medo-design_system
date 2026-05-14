import {
  Tabs as TabsPrimitive,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'

export function Tabs({
  variant = 'underline',
  tabs = [],
  defaultTab,
  activeTab,
  onTabChange,
}) {
  return (
    <TabsPrimitive
      defaultValue={defaultTab ?? tabs[0]?.id}
      value={activeTab}
      onValueChange={onTabChange}
    >
      <TabsList variant={variant === 'underline' ? 'line' : 'default'}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) =>
        tab.content ? (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.content}
          </TabsContent>
        ) : null
      )}
    </TabsPrimitive>
  )
}
