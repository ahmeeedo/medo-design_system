/**
 * Storybook UI (sidebar, toolbar): med.o theme, switches with the Light / Dark toolbar button.
 */
import { addons } from 'storybook/manager-api';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { modeFromGlobals, themes } from './theme';

addons.setConfig({
  theme: themes.light,
  // A documentation site: one entry per page. The examples live on the docs pages; the stories stay
  // reachable by URL and run as tests, but do not fill the sidebar.
  sidebar: { filters: { docsOnly: (item) => item.type !== 'story' } },
});

addons.register('medo/theme', (api) => {
  const apply = ({ globals }: { globals?: Record<string, unknown> }) => api.setOptions({ theme: themes[modeFromGlobals(globals)] });
  const channel = api.getChannel();
  channel?.on(SET_GLOBALS, apply);
  channel?.on(GLOBALS_UPDATED, apply);
});
