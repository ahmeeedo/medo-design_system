/**
 * Storybook UI (sidebar, toolbar): med.o theme, switches with the Light / Dark toolbar button.
 */
import { addons } from 'storybook/manager-api';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { modeFromGlobals, themes, token, type Mode } from './theme';

addons.setConfig({
  theme: themes.light,
  // A documentation site: one entry per page. The examples live on the docs pages; the stories stay
  // reachable by URL and run as tests, but do not fill the sidebar.
  sidebar: { filters: { docsOnly: (item) => item.type !== 'story' } },
});

/*
 * Sidebar and toolbar in our component styles, from the tokens (Light and Dark):
 * - Sidebar items look like NavItem (sidebar): 36 px, label/md, text/secondary; hover state/hover + text/primary;
 *   the current page action/selected + label/md-strong; one icon colour; focus ring inset.
 * - Group titles use the overline style (sentence case, like everywhere in the system).
 * - The search field has the frame and focus of SearchField.
 * - Toolbar buttons behave like ToggleButton: hover state/hover + text/primary, on or open action/selected + text/brand.
 * The values are CSS variables on :root, so one rule set serves both modes. The selectors are Storybook's own
 * (ids, sidebar-item, role, aria) – the test “Storybook UI” checks them after a Storybook update.
 */
const uiStyle = document.createElement('style');
uiStyle.id = 'medo-ui';
uiStyle.textContent = `
#storybook-explorer-menu .sidebar-item {
  min-block-size: 2.25rem;
  border-radius: var(--medo-ui-radius-sm);
  color: var(--medo-ui-text-secondary);
  background: transparent;
}
#storybook-explorer-menu .sidebar-item > :is(a, button):first-child {
  min-block-size: 2.25rem;
  align-items: center;
  font: var(--medo-ui-label);
  color: inherit;
}
#storybook-explorer-menu .sidebar-item svg { color: var(--medo-ui-text-secondary); }
#storybook-explorer-menu .sidebar-item:hover {
  background: var(--medo-ui-hover);
  color: var(--medo-ui-text-primary);
}
#storybook-explorer-menu .sidebar-item:active { background: var(--medo-ui-pressed); }
#storybook-explorer-menu .sidebar-item[data-selected='true'] {
  background: var(--medo-ui-selected);
  color: var(--medo-ui-text-primary);
}
#storybook-explorer-menu .sidebar-item[data-selected='true'] > :is(a, button):first-child { font: var(--medo-ui-label-strong); }
#storybook-explorer-menu .sidebar-item[data-selected='true'] svg { color: var(--medo-ui-text-primary); }
#storybook-explorer-menu .sidebar-item[data-selected='true']:hover { background: var(--medo-ui-selected-hover); }
#storybook-explorer-menu .sidebar-item:has(:focus-visible),
#storybook-explorer-menu .sidebar-item[data-highlighted='true'] { box-shadow: var(--medo-ui-focus-inset); }
#storybook-explorer-menu :is(a, button):focus-visible { outline: none; }

#storybook-explorer-menu .sidebar-subheading > button:first-child {
  font: var(--medo-ui-overline);
  text-transform: none;
  letter-spacing: normal;
  color: var(--medo-ui-text-secondary);
}
#storybook-explorer-menu .sidebar-subheading > button:focus-visible { outline: none; box-shadow: var(--medo-ui-focus-inset); }

.search-field {
  border: 1px solid var(--medo-ui-border-strong);
  border-radius: var(--medo-ui-radius-md);
  background: var(--medo-ui-surface);
}
.search-field:focus-within { box-shadow: var(--medo-ui-focus); }
.search-field input { box-shadow: none !important; background: transparent; }

/* Icon buttons around the sidebar (settings, expand all, clear search, filters): IconButton ghost. */
:is(.sidebar-header, .search-field) button,
#storybook-explorer-menu .sidebar-subheading-action {
  border-radius: var(--medo-ui-radius-md);
  background: transparent;
  color: var(--medo-ui-text-secondary);
}
:is(.sidebar-header, .search-field) button:hover,
#storybook-explorer-menu .sidebar-subheading-action:hover,
#storybook-explorer-menu .sidebar-subheading > button:first-child:hover {
  background: var(--medo-ui-hover);
  color: var(--medo-ui-text-primary);
}
.sidebar-header button[aria-expanded='true'] {
  background: var(--medo-ui-selected);
  color: var(--medo-ui-text-brand);
}
:is(.sidebar-header, .search-field) button:focus-visible,
#storybook-explorer-menu .sidebar-subheading-action:focus-visible { outline: none; box-shadow: var(--medo-ui-focus); }

/* Search results: the highlighted result (mouse or arrow keys) and the hovered one look the same – no flicker. */
#storybook-explorer-menu li { border-radius: var(--medo-ui-radius-sm); }
#storybook-explorer-menu li > :is(a, button, div) { background: transparent; }
#storybook-explorer-menu li svg { color: var(--medo-ui-text-secondary); }
#storybook-explorer-menu li:is([aria-selected='true'], :hover) {
  background: var(--medo-ui-hover);
  color: var(--medo-ui-text-primary);
}

/* Menus from the settings button and the toolbar: Menu item states. */
.react-aria-Popover li > :is(a, button):is(:hover, :focus-visible),
[role='listbox'] [role='option']:is(:hover, :focus-visible, [data-focused]) {
  background: var(--medo-ui-hover);
  color: var(--medo-ui-text-primary);
  outline: none;
}

[role='toolbar'] :is(button, a) { color: var(--medo-ui-text-secondary); }
[role='toolbar'] :is(button, a):not([aria-disabled='true'], :disabled):hover {
  background: var(--medo-ui-hover);
  color: var(--medo-ui-text-primary);
}
[role='toolbar'] :is([aria-checked='true'], [aria-expanded='true'], [aria-pressed='true']) {
  background: var(--medo-ui-selected);
  color: var(--medo-ui-text-brand);
}
[role='toolbar'] :is([aria-checked='true'], [aria-expanded='true'], [aria-pressed='true']):hover {
  background: var(--medo-ui-selected-hover);
  color: var(--medo-ui-text-brand);
}
[role='toolbar'] :is(button, a):focus-visible { outline: none; box-shadow: var(--medo-ui-focus); }
`;
document.head.append(uiStyle);

const paintUi = (mode: Mode) => {
  const t = (name: string) => token(mode, name);
  const ring = t('focus/ring');
  const halo = t('focus/halo');
  const vars: Record<string, string> = {
    'text-primary': t('text/primary'),
    'text-secondary': t('text/secondary'),
    'text-brand': t('text/brand'),
    hover: t('state/hover'),
    pressed: t('state/pressed'),
    selected: t('action/selected'),
    'selected-hover': t('action/selected-hover'),
    'border-strong': t('border/strong'),
    surface: t('surface/default'),
    'radius-sm': t('radius/sm'),
    'radius-md': t('radius/md'),
    label: t('typography/label/md'),
    'label-strong': t('typography/label/md-strong'),
    overline: t('typography/overline'),
    focus: `0 0 0 2px ${halo}, 0 0 0 4px ${ring}`,
    'focus-inset': `inset 0 0 0 2px ${ring}, inset 0 0 0 3px ${halo}`,
  };
  for (const [k, v] of Object.entries(vars)) document.documentElement.style.setProperty(`--medo-ui-${k}`, v);
};
paintUi('light');

/*
 * Browser tab: Storybook names every page “… ⋅ Storybook”. Visitors look for the design system, so the suffix
 * names it instead (tabs, bookmarks, history).
 */
const SUFFIX = ' ⋅ med.o Design System';
const renameTitle = () => {
  const fixed = document.title.replace(/ ⋅ Storybook$/, SUFFIX);
  if (fixed !== document.title) document.title = fixed;
};
renameTitle();
new MutationObserver(renameTitle).observe(document.querySelector('title') ?? document.head, { childList: true, subtree: true, characterData: true });

addons.register('medo/theme', (api) => {
  const apply = ({ globals }: { globals?: Record<string, unknown> }) => {
    const mode = modeFromGlobals(globals);
    api.setOptions({ theme: themes[mode] });
    paintUi(mode);
  };
  const channel = api.getChannel();
  channel?.on(SET_GLOBALS, apply);
  channel?.on(GLOBALS_UPDATED, apply);
});
