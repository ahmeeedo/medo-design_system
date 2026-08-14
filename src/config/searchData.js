import { sectionData } from './sectionData'

function entries(slug, route, pageTitle, tabs) {
  return tabs.flatMap(({ id, section }) => [
    { id: `${slug}-${id}`, lang: 'de', type: 'tab', pageTitle, section, route, anchor: id, tab: id },
    { id: `${slug}-${id}`, lang: 'en', type: 'tab', pageTitle, section, route, anchor: id, tab: id },
  ])
}

const T = { overview: 'Overview', usage: 'Usage', tokens: 'Tokens', code: 'Code', accessibility: 'Accessibility' }

const FOUNDATION_TABS = [
  { id: 'overview',      section: T.overview },
  { id: 'usage',         section: T.usage },
  { id: 'tokens',        section: T.tokens },
  { id: 'accessibility', section: T.accessibility },
]

const COMPONENT_TABS = [
  { id: 'overview',      section: T.overview },
  { id: 'usage',         section: T.usage },
  { id: 'code',          section: T.code },
  { id: 'accessibility', section: T.accessibility },
]

export const searchData = [
  ...entries('brand',          '/brand',           'Marke',                   FOUNDATION_TABS),
  ...entries('brand-colors',   '/brand-colors',    'Farben · Ebene 1 Brand',  FOUNDATION_TABS),
  ...entries('alias-colors',   '/alias-colors',    'Farben · Ebene 2 Alias',  FOUNDATION_TABS),
  ...entries('semantic-colors','/semantic-colors', 'Farben · Ebene 3 Semantic', FOUNDATION_TABS),
  ...entries('typography',     '/typography',      'Typografie',              FOUNDATION_TABS),
  ...entries('foundations',    '/foundations',     'Grundlagen',              FOUNDATION_TABS),

  ...entries('buttons',    '/buttons',    'Buttons',                 COMPONENT_TABS),
  ...entries('inputs',     '/inputs',     'Inputs',                  COMPONENT_TABS),
  ...entries('select',     '/select',     'Select',                  COMPONENT_TABS),
  ...entries('toggle',     '/toggle',     'Toggle, Checkbox & Radio',COMPONENT_TABS),
  ...entries('badges',     '/badges',     'Badges & Tags',           COMPONENT_TABS),
  ...entries('alerts',     '/alerts',     'Alerts',                  COMPONENT_TABS),
  ...entries('data-table', '/data-table', 'DataTable',               COMPONENT_TABS),
  ...entries('tabs',       '/tabs',       'Tabs',                    COMPONENT_TABS),
  ...entries('navigation', '/navigation', 'Navigation',              COMPONENT_TABS),
  ...entries('overlays',   '/overlays',   'Modal',                   COMPONENT_TABS),
  ...entries('accordion',  '/accordion',  'Accordion',               COMPONENT_TABS),
  ...entries('menus',      '/menus',      'Menus',                   COMPONENT_TABS),
  ...entries('lists',      '/lists',      'Lists',                   COMPONENT_TABS),
  ...entries('stats',      '/stats',      'Stats / KPI',             COMPONENT_TABS),
  ...entries('feedback',   '/feedback',   'Feedback / Progress',     COMPONENT_TABS),
  ...entries('skeleton',   '/skeleton',   'Skeleton',                COMPONENT_TABS),
  ...sectionData,
]
