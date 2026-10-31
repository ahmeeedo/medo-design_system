/// <reference types="vite/client" />
import type { Preview } from '@storybook/react-vite';
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
import { startMode } from './theme';

// Theme before the first render: the stored mode (toolbar switch in manager.ts) – in tests the mode of the Vitest
// project (“storybook-dark” sets STORYBOOK_TEST_THEME). data-theme on <html>, exactly like a real app.
const testTheme = import.meta.env.STORYBOOK_TEST_THEME as 'Light' | 'Dark' | undefined;
document.documentElement.setAttribute('data-theme', testTheme ? testTheme.toLowerCase() : startMode());

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
  // Every example in English, whatever the browser language – the I18nProvider an app sets once at the root.
  // Guides / Languages shows English and German side by side.
  decorators: [(Story) => createElement(I18nProvider, { locale: 'en-US' }, createElement(Story))],
};

export default preview;
