/// <reference types="vite/client" />
import type { Preview } from '@storybook/react-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import { createElement } from 'react';
import { I18nProvider } from 'react-aria-components';

// Fonts are self-hosted (no request to a font service). Weights 400–700.
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/dm-mono/400.css';
import './preview.css';
import { ComponentDocsPage, MedoDocsContainer } from '../src/docs-blocks/DocBlocks';

const preview: Preview = {
  // Every story is part of the visual regression check (VISUAL=1); `tags: ['!visual']` leaves one out.
  tags: ['visual'],
  parameters: {
    layout: 'padded',
    // className and style are plain React props: not part of the Playground.
    controls: { expanded: true, exclude: ['className', 'style'] },
    // Docs pages use the doc blocks in src/docs-blocks and follow the Light / Dark switch.
    docs: { container: MedoDocsContainer, page: ComponentDocsPage },
    // Accessibility checks (axe) for every story. A violation fails the story's test (Vitest, CI).
    // Standard: WCAG 2.2 A + AA plus axe best practices. landmark-unique is off because stories show several
    // instances side by side (Light and Dark, sizes) – in an app every landmark has its own name.
    a11y: {
      test: 'error',
      options: { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } },
      config: { rules: [{ id: 'landmark-unique', enabled: false }] },
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundations',
          ['Colors', 'Typography', 'Spacing & sizes', 'Elevation & motion', 'Icons', 'Accessibility', 'Content'],
          'Guides',
          ['Theming', 'Languages', 'Tailwind'],
          'Patterns',
          ['Form', 'Search', 'Delete'],
          'Components',
          ['Layout', 'Actions', 'Forms', 'Overlays', 'Feedback', 'Navigation', 'Data display'],
        ],
      },
    },
  },
  // Start theme. The Vitest project “storybook-dark” sets STORYBOOK_TEST_THEME, so every story is also tested in Dark.
  // Language of the built-in texts, dates and numbers – the same I18nProvider an app sets.
  globalTypes: {
    locale: {
      // Shown as the tooltip: the switch changes the components, not the docs text.
      description: 'Language of the components: built-in texts (buttons, messages, screen-reader names), dates and numbers. The docs text stays English.',
      toolbar: {
        title: 'Component language',
        icon: 'globe',
        items: [
          { value: 'en-US', title: 'English' },
          { value: 'de-DE', title: 'Deutsch' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: import.meta.env.STORYBOOK_TEST_THEME ?? 'Light', locale: 'en-US' },
  // Theme switch in the toolbar sets data-theme on <html> – exactly like in a real app.
  decorators: [
    (Story, { globals }) => createElement(I18nProvider, { locale: (globals.locale as string) ?? 'en-US' }, createElement(Story)),
    withThemeByDataAttribute({
      themes: { Light: 'light', Dark: 'dark' },
      defaultTheme: 'Light',
      attributeName: 'data-theme',
    }),
  ],
};

export default preview;
