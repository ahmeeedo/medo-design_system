import type { Preview } from '@storybook/react-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

// Fonts are self-hosted (no request to Google). Same weights as in Figma.
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/dm-mono/400.css';
import './preview.css';
import { ComponentDocsPage, MedoDocsContainer } from '../src/docs-blocks/DocBlocks';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    // className and style are plain React props: not part of the Playground.
    controls: { expanded: true, exclude: ['className', 'style'] },
    // Docs pages follow the structure of the Figma doc frames and the Light / Dark switch (src/docs-blocks).
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
      storySort: { order: ['Introduction', 'Foundations', ['Colors', 'Typography', 'Spacing & sizes', 'Elevation & motion'], 'Usage', 'Components'] },
    },
  },
  // Theme switch in the toolbar sets data-theme on <html> – exactly like in a real app.
  decorators: [
    withThemeByDataAttribute({
      themes: { Light: 'light', Dark: 'dark' },
      defaultTheme: 'Light',
      attributeName: 'data-theme',
    }),
  ],
};

export default preview;
