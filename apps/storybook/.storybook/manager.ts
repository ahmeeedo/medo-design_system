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
 * Toolbar in Dark: Storybook colours the active and the hover state with colorSecondary (brand-bold), which is
 * far too dark on the dark bar (≈ 1.9 : 1). colorSecondary cannot simply be lighter: the selected sidebar item uses
 * it as background behind white text. So the toolbar gets its own states, from the tokens:
 * hover text/primary, active text/brand (≈ 6.5 : 1), both on a text/brand tint. Light keeps Storybook's states.
 */
const toolbarStyle = document.createElement('style');
document.head.append(toolbarStyle);
const paintToolbar = (mode: Mode) => {
  const brand = token('dark', 'text/brand');
  toolbarStyle.textContent =
    mode === 'dark'
      ? `[role='toolbar'] button[aria-haspopup='listbox'], [role='toolbar'] button[aria-expanded='true'] {
           color: ${brand};
           background: color-mix(in srgb, ${brand} 14%, transparent);
         }
         [role='toolbar'] button:hover, [role='toolbar'] button:focus-visible {
           color: ${token('dark', 'text/primary')};
           background: color-mix(in srgb, ${brand} 16%, transparent);
         }`
      : '';
};

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
    paintToolbar(mode);
  };
  const channel = api.getChannel();
  channel?.on(SET_GLOBALS, apply);
  channel?.on(GLOBALS_UPDATED, apply);
});
