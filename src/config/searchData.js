import { sectionData } from './sectionData'

function entries(slug, route, pageTitle, tabs) {
  return tabs.flatMap(({ id, section }) => [
    { id: `${slug}-${id}`, lang: 'de', type: 'tab', pageTitle, section, route, anchor: id, tab: id },
    { id: `${slug}-${id}`, lang: 'en', type: 'tab', pageTitle, section, route, anchor: id, tab: id },
  ])
}

const T = { overview: 'Overview', usage: 'Usage', tokens: 'Tokens', code: 'Code', accessibility: 'Accessibility' }

const FOUNDATION_TABS = [
  { id: 'overview', section: T.overview },
  { id: 'usage',    section: T.usage },
  { id: 'tokens',   section: T.tokens },
  { id: 'code',     section: T.code },
]

const COMPONENT_TABS = [
  { id: 'overview',      section: T.overview },
  { id: 'usage',         section: T.usage },
  { id: 'code',          section: T.code },
  { id: 'accessibility', section: T.accessibility },
]

export const searchData = [
  ...entries('colors',     '/colors',     'Colors',                  FOUNDATION_TABS),
  ...entries('typography', '/typography', 'Typography',              FOUNDATION_TABS),
  ...entries('spacing',    '/spacing',    'Spacing',                 FOUNDATION_TABS),
  ...entries('radius',     '/radius',     'Border Radius',           FOUNDATION_TABS),
  ...entries('shadows',    '/shadows',    'Shadows',                 FOUNDATION_TABS),
  ...entries('motion',     '/motion',     'Motion',                  FOUNDATION_TABS),

  ...entries('buttons',    '/buttons',    'Buttons',                 COMPONENT_TABS),
  ...entries('inputs',     '/inputs',     'Inputs',                  COMPONENT_TABS),
  ...entries('select',     '/select',     'Select',                  COMPONENT_TABS),
  ...entries('toggle',     '/toggle',     'Toggle, Checkbox & Radio',COMPONENT_TABS),
  ...entries('badges',     '/badges',     'Badges & Tags',           COMPONENT_TABS),
  ...entries('alerts',     '/alerts',     'Alerts',                  COMPONENT_TABS),
  ...entries('cards',      '/cards',      'Cards',                   COMPONENT_TABS),
  ...entries('tables',     '/tables',     'Tables',                  COMPONENT_TABS),
  ...entries('tabs',       '/tabs',       'Tabs',                    COMPONENT_TABS),
  ...entries('navigation', '/navigation', 'Navigation',              COMPONENT_TABS),
  ...entries('overlays',   '/overlays',   'Modal',                   COMPONENT_TABS),
  ...entries('accordion',  '/accordion',  'Accordion',               COMPONENT_TABS),
  ...entries('menus',      '/menus',      'Menus',                   COMPONENT_TABS),
  ...entries('lists',      '/lists',      'Lists',                   COMPONENT_TABS),
  ...entries('stats',      '/stats',      'Stats / KPI',             COMPONENT_TABS),
  ...entries('feedback',   '/feedback',   'Feedback / Progress',     COMPONENT_TABS),
  ...entries('avatar',     '/avatar',     'Avatar',                  COMPONENT_TABS),
  ...entries('skeleton',   '/skeleton',   'Skeleton',                COMPONENT_TABS),
  ...sectionData,
]
