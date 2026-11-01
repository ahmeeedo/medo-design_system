/**
 * Storybook tests: every story runs as a test in a real browser (Vitest browser mode, Playwright Chromium).
 * A story fails when it throws, when its play function fails, or when axe finds a violation (a11y test: 'error').
 * Two projects: every story runs in Light and in Dark (contrast differs per theme) – npm test. A third one runs the
 * stories tagged “locale-de” in German (de-DE).
 * Two more projects run every story in WebKit (Safari's engine) and Firefox (Gecko), Light, without screenshots –
 * npm run test:webkit, npm run test:firefox. They catch what only these engines do differently (layout, focus,
 * events). CI runs each as its own job.
 * In Storybook: the Testing widget. Preview annotations (decorators, a11y) apply automatically.
 *
 * Viewport: Storybook sets 1200 × 900 for every story (its default, unless a story sets globals.viewport). Play
 * functions can change it while they run: resizeViewport() from story-helpers (via .storybook/test.setup.ts).
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
const asked = (name: string) => process.argv.some((arg) => arg.includes(name));

/** Reference and diff paths: one folder per theme (light, dark), file name = story id. */
const screenshotPath = (folder: string) => ({ arg, ext, project }: { arg: string; ext: string; project: { name: string } }) =>
  path.join(dirname, folder, project.name.startsWith('storybook-dark') ? 'dark' : 'light', `${arg}${ext}`);

/** One project per theme and browser. The theme reaches preview.ts as import.meta.env.STORYBOOK_TEST_THEME. */
type ProjectOptions = { browser?: 'chromium' | 'webkit' | 'firefox'; locale?: string; tags?: string[] };
const project = (name: string, theme: 'Light' | 'Dark', { browser = 'chromium', locale = 'en-US', tags }: ProjectOptions = {}) => ({
  extends: true,
  // tags: only stories with one of these tags (e.g. the German project runs the stories tagged “locale-de”).
  plugins: [storybookTest({ configDir: path.join(dirname, '.storybook'), ...(tags ? { tags: { include: tags } } : {}) })],
  define: {
    'import.meta.env.STORYBOOK_TEST_THEME': JSON.stringify(theme),
    'import.meta.env.STORYBOOK_TEST_LOCALE': JSON.stringify(locale),
  },
  test: {
    name,
    // test.setup.ts for every project (window size in play functions). Screenshots only in Chromium and English:
    // references come from one engine, fonts render differently in each.
    setupFiles: [
      path.join(dirname, '.storybook/test.setup.ts'),
      ...(visual && browser === 'chromium' && locale === 'en-US' ? [path.join(dirname, '.storybook/visual.setup.ts')] : []),
    ],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({}),
      instances: [{ browser }],
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
    projects: [
      project('storybook', 'Light'),
      project('storybook-dark', 'Dark'),
      // German: the stories tagged “locale-de” (forms, dates, numbers, uploads) once more with de-DE – built-in texts,
      // formats and long German words. Part of npm test.
      project('storybook-de', 'Light', { locale: 'de-DE', tags: ['locale-de'] }),
      // Only when asked for (npm run test:webkit / test:firefox), so npm test and the Testing widget never need
      // these browsers installed.
      ...(asked('storybook-webkit') ? [project('storybook-webkit', 'Light', { browser: 'webkit' })] : []),
      ...(asked('storybook-firefox') ? [project('storybook-firefox', 'Light', { browser: 'firefox' })] : []),
    ],
  },
});
