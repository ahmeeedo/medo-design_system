import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(ts|tsx)',
    // Components live in their packages, next to the code.
    '../../../packages/ui/src/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-themes', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  core: { disableTelemetry: true },
  // Tailwind v4 runs as a Vite plugin.
  viteFinal: (viteConfig) => mergeConfig(viteConfig, { plugins: [tailwindcss()] }),
};

export default config;
