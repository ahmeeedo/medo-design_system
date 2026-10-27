import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { defaultClientConditions, mergeConfig } from 'vite';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

// Font files for the Storybook UI (see manager-head.html).
const require = createRequire(import.meta.url);
const fontFiles = (pkg: string) => join(dirname(require.resolve(`${pkg}/package.json`)), 'files');

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(ts|tsx)',
    // Components live in their packages, next to the code.
    '../../../packages/ui/src/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-themes', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: { name: '@storybook/react-vite', options: {} },
  core: { disableTelemetry: true },
  staticDirs: [
    '../public', // logo-rgb.svg (Light), logo-white.svg (Dark)
    { from: fontFiles('@fontsource/dm-sans'), to: '/fonts/dm-sans' },
    { from: fontFiles('@fontsource/dm-mono'), to: '/fonts/dm-mono' },
  ],
  // Tailwind v4 runs as a Vite plugin. The "@medo/source" export condition loads the workspace packages from src,
  // so Storybook and its tests never need a package build first.
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, { plugins: [tailwindcss()], resolve: { conditions: ['@medo/source', ...defaultClientConditions] } }),
};

export default config;
