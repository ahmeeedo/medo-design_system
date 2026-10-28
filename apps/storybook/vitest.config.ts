/**
 * Storybook tests: every story runs as a test in a real browser (Vitest browser mode, Playwright Chromium).
 * A story fails when it throws, when its play function fails, or when axe finds a violation (a11y test: 'error').
 * Two projects: every story runs in Light and in Dark (contrast differs per theme).
 * Run: npm test (root) · in Storybook: the Testing widget. Preview annotations (decorators, a11y) apply automatically.
 *
 * Viewport: Storybook sets 1200 × 900 for every story (its default, unless a story sets parameters.viewport).
 *
 * VISUAL=1 adds the visual regression check (.storybook/visual.setup.ts): one screenshot per story and theme in
 * __screenshots__/{light|dark}/<component>/<story>.png. Created and updated in CI only.
 */
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const visual = process.env.VISUAL === '1';

/** Reference and diff paths: one folder per theme (light, dark), file name = story id. */
const screenshotPath = (folder: string) => ({ arg, ext, project }: { arg: string; ext: string; project: { name: string } }) =>
  path.join(dirname, folder, project.name.startsWith('storybook-dark') ? 'dark' : 'light', `${arg}${ext}`);

/** One project per theme. The theme reaches preview.ts as import.meta.env.STORYBOOK_TEST_THEME. */
const project = (name: string, theme: 'Light' | 'Dark') => ({
  extends: true,
  plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
  define: { 'import.meta.env.STORYBOOK_TEST_THEME': JSON.stringify(theme) },
  test: {
    name,
    setupFiles: visual ? [path.join(dirname, '.storybook/visual.setup.ts')] : [],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({}),
      instances: [{ browser: 'chromium' as const }],
      expect: {
        toMatchScreenshot: {
          comparatorName: 'pixelmatch' as const,
          // threshold: colour tolerance per pixel, so anti-aliasing noise passes. No pixel may differ beyond it:
          // a shifted 1 px border is only a few hundred pixels and must fail.
          comparatorOptions: { threshold: 0.1, allowedMismatchedPixelRatio: 0 },
          resolveScreenshotPath: screenshotPath('__screenshots__'),
          resolveDiffPath: screenshotPath('.vitest/screenshot-diffs'),
        },
      },
    },
  },
});

export default defineConfig({
  test: {
    projects: [project('storybook', 'Light'), project('storybook-dark', 'Dark')],
  },
});
