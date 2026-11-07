/**
 * Storybook UI (sidebar, toolbar): med.o theme, switches with the Light / Dark toolbar button.
 */
import { createElement, useState } from 'react';
import { addons, types, type API } from 'storybook/manager-api';
import { STORIES_COLLAPSE_ALL } from 'storybook/internal/core-events';
import { Button } from 'storybook/internal/components';
import { PaintBrushIcon } from '@storybook/icons';
import { startMode, storeMode, themes, token, type Mode } from './theme';
import { STATUS, statusOf } from './status';

let mode: Mode = startMode();

addons.setConfig({
  theme: themes[mode],
  // A documentation site: one entry per page. The examples live on the docs pages; the stories stay
  // reachable by URL and run as tests, but do not fill the sidebar.
  sidebar: {
    filters: { docsOnly: (item) => item.type !== 'story' },
    // Everything starts closed – Storybook still opens the path to the page you are on, so you see where you are.
    collapsedRoots: ['foundations', 'guides', 'patterns', 'components'],
    // Component status after the name – except Stable: no marker means ready to use (Guides / Component status).
    renderLabel: (item) => {
      const status = item.type === 'component' || item.type === 'docs' ? statusOf(item.tags) : undefined;
      if (!status || status === 'stable') return item.name;
      return createElement(
        'span',
        { className: 'medo-ui-label' },
        item.name,
        createElement('span', { className: `medo-ui-status medo-ui-status--${status}` }, STATUS[status].label),
      );
    },
  },
});

/*
 * Sidebar and toolbar in our component styles, from the tokens (Light and Dark):
 * - Sidebar items look like NavItem (sidebar): 36 px, label/md, text/secondary; hover state/hover + text/primary;
 *   the current page action/selected + label/md-strong; one icon colour; focus ring inset.
 * - Group titles (Foundations, Guides …) open and close like a NavGroup: 36 px, label/md-strong, text/primary.
 * - The search field has the frame and focus of SearchField.
 * - Toolbar buttons behave like ToggleButton: hover state/hover + text/primary, on or open action/selected + text/brand.
 * The values are CSS variables on :root, so one rule set serves both modes. The selectors are Storybook's own
 * (ids, sidebar-item, role, aria) – the test “Storybook UI” checks them after a Storybook update.
 */
const uiStyle = document.createElement('style');
uiStyle.id = 'medo-ui';
uiStyle.textContent = `
#storybook-explorer-menu .sidebar-item {
  min-block-size: var(--medo-ui-row);
  border-radius: var(--medo-ui-radius-sm);
  color: var(--medo-ui-text-secondary);
  background: transparent;
}
#storybook-explorer-menu .sidebar-item > :is(a, button):first-child {
  min-block-size: var(--medo-ui-row);
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

#storybook-explorer-menu .sidebar-subheading { min-block-size: var(--medo-ui-row); }
#storybook-explorer-menu .sidebar-subheading > button:first-child {
  min-block-size: var(--medo-ui-row);
  border-radius: var(--medo-ui-radius-sm);
  font: var(--medo-ui-label-strong);
  text-transform: none;
  letter-spacing: normal;
  color: var(--medo-ui-text-primary);
}
#storybook-explorer-menu .sidebar-subheading > button:focus-visible { outline: none; box-shadow: var(--medo-ui-focus-inset); }

.search-field {
  border: var(--medo-ui-border-thin) solid var(--medo-ui-border-strong);
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
/* Expand all / Collapse all per section only acts on component groups. Foundations, Guides and Patterns are flat pages – no button. */
#storybook-explorer-menu :is(#foundations, #guides, #patterns) .sidebar-subheading-action { display: none; }

/* Component status after the name (renderLabel): small and quiet – the name stays the main thing. */
.medo-ui-label {
  display: inline-flex;
  align-items: center;
  gap: var(--medo-ui-space-1-5);
  min-inline-size: 0;
}
.medo-ui-status {
  flex: none;
  padding: 0 var(--medo-ui-space-1-5);
  border: var(--medo-ui-border-thin) solid var(--medo-ui-border-default);
  border-radius: var(--medo-ui-radius-sm);
  font: var(--medo-ui-label-xs);
  color: var(--medo-ui-text-secondary);
}
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
  const ringWidth = t('focus-ring/width');
  const haloWidth = t('focus-ring/halo');
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
    'label-xs': t('typography/label/xs'),
    'border-default': t('border/default'),
    'space-1-5': t('space/1-5'),
    // Sidebar rows: 36 px, between the control sizes sm and md.
    row: `calc(${t('space/8')} + ${t('space/1')})`,
    'border-thin': t('border-width/thin'),
    focus: `0 0 0 ${ringWidth} ${halo}, 0 0 0 calc(2 * ${ringWidth}) ${ring}`,
    'focus-inset': `inset 0 0 0 ${ringWidth} ${ring}, inset 0 0 0 calc(${ringWidth} + ${haloWidth}) ${halo}`,
  };
  for (const [k, v] of Object.entries(vars)) document.documentElement.style.setProperty(`--medo-ui-${k}`, v);
};
paintUi(mode);

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

/* ---------- Theme switch ---------- */

/** data-theme on the preview's <html>: the tokens switch, no story renders again. */
const setPreviewTheme = () => {
  const frame = document.querySelector<HTMLIFrameElement>('#storybook-preview-iframe');
  frame?.contentDocument?.documentElement.setAttribute('data-theme', mode);
};

let managerApi: API | undefined;

function ThemeSwitch() {
  const [current, setCurrent] = useState(mode);
  const toggle = () => {
    mode = current === 'dark' ? 'light' : 'dark';
    storeMode(mode);
    setCurrent(mode);
    paintUi(mode);
    setPreviewTheme();
    managerApi?.setOptions({ theme: themes[mode] });
  };
  return createElement(
    Button,
    { ariaLabel: 'Theme', tooltip: 'Change theme', variant: 'ghost', onClick: toggle },
    createElement(PaintBrushIcon),
    current === 'dark' ? 'Dark theme' : 'Light theme',
  );
}

/*
 * “Collapse all” (settings menu, Ctrl/⌘ + Shift + ↑): Storybook closes only the groups inside the sections, never
 * the sections themselves (Foundations, Guides, Patterns, Components) – so here, where the groups start closed, nothing
 * seemed to happen. After Storybook's own collapse, the open sections are closed through their own buttons.
 */
const collapseSections = () =>
  requestAnimationFrame(() =>
    document.querySelectorAll<HTMLButtonElement>('#storybook-explorer-menu .sidebar-subheading > button[aria-expanded="true"]').forEach((b) => b.click()),
  );

addons.register('medo/theme', (api) => {
  managerApi = api;
  api.on(STORIES_COLLAPSE_ALL, collapseSections);
  addons.add('medo/theme-switch', { type: types.TOOL, title: 'Theme', match: () => true, render: ThemeSwitch });
});
