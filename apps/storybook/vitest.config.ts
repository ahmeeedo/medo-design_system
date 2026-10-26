/**
 * Storybook tests: every story runs as a test in a real browser (Vitest browser mode, Playwright Chromium).
 * A story fails when it throws, when its play function fails, or when axe finds a violation (a11y test: 'error').
 * Run: npm test (root) · in Storybook: the Testing widget. Preview annotations (decorators, a11y) apply automatically.
 */
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
