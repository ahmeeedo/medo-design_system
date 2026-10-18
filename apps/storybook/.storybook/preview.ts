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
    controls: { expanded: true },
    // Docs pages follow the structure of the Figma doc frames and the Light / Dark switch (src/docs-blocks).
    docs: { container: MedoDocsContainer, page: ComponentDocsPage },
    // Accessibility checks (axe) for every story. Violations show in the "Accessibility" panel.
    a11y: { test: 'todo' },
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
