/// <reference types="vite/client" />
import type { Preview } from '@storybook/react-vite';
import { createElement } from 'react';
import { I18nProvider, RouterProvider } from 'react-aria-components';
import { action } from 'storybook/actions';
import { configure } from 'storybook/test';

// Fonts are self-hosted (no request to a font service). Weights 400–700.
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/dm-mono/400.css';
import './preview.css';
import { ComponentDocsPage, MedoDocsContainer } from '../src/docs-blocks/DocBlocks';
import { startMode } from './theme';
import { describeSharedProps } from './prop-docs';

// Theme before the first render: the stored mode (toolbar switch in manager.ts) – in tests the mode of the Vitest
// project (“storybook-dark” sets STORYBOOK_TEST_THEME). data-theme on <html>, exactly like a real app.
const testTheme = import.meta.env.STORYBOOK_TEST_THEME as 'Light' | 'Dark' | undefined;
document.documentElement.setAttribute('data-theme', testTheme ? testTheme.toLowerCase() : startMode());
// Language: English everywhere – in tests the locale of the Vitest project (“storybook-de” runs German).
const locale = (import.meta.env.STORYBOOK_TEST_LOCALE as string | undefined) ?? 'en-US';
document.documentElement.setAttribute('lang', locale.slice(0, 2));

// In tests: waitFor / findBy wait up to 3 s instead of 1 s. Overlays stay in the DOM until their exit animation ends,
// and WebKit on a busy CI runner can take longer than 1 s for that – a slow runner, not a broken component.
if (testTheme) configure({ asyncUtilTimeout: 3000 });
// The screenshot projects (“visual”) skip axe: the other projects check it, so a red “visual” only means a changed look.
const visualRun = import.meta.env.STORYBOOK_TEST_VISUAL === true;

const preview: Preview = {
  // Every docs story is part of the visual regression check (npm run test:visual); `tags: ['!visual']` leaves one out.
  tags: ['visual'],
  // Descriptions of React Aria and DOM props (isDisabled, onPress …) where the component has none of its own.
  argTypesEnhancers: [describeSharedProps],
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
      test: visualRun ? 'off' : 'error',
      options: { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } },
      config: { rules: [{ id: 'landmark-unique', enabled: false }] },
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          "What's new",
          'Foundations',
          ['Colors', 'Typography', 'Spacing & sizes', 'Elevation & motion', 'Icons', 'Accessibility', 'Content', 'Long content'],
          'Guides',
          ['Theming', 'Languages', 'Tailwind', 'Versioning & support', 'Component status', 'Screen reader testing'],
          'Patterns',
          ['Account', 'Form', 'Multi-step form', 'Search', 'Delete'],
          'Components',
          ['Layout', 'Actions', 'Forms', 'Overlays', 'Feedback', 'Navigation', 'Data display'],
        ],
      },
    },
  },
  // The providers an app sets once at the root:
  // – I18nProvider: every example in English, whatever the browser language. Guides / Languages shows English and German.
  // – RouterProvider: links in examples have real paths (“/terms”) but do not leave the story – a click is logged in the
  //   Actions panel. External links with target="_blank" open as usual.
  decorators: [(Story) => createElement(I18nProvider, { locale }, createElement(RouterProvider, { navigate: action('navigate') }, createElement(Story)))],
};

export default preview;
