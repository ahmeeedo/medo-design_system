/**
 * Visual regression: after every story test, compare a screenshot with the reference in __screenshots__/.
 * Only active with VISUAL=1 (vitest.config.ts adds this file then). References are created in CI only
 * (GitHub workflow “Update screenshots”), because fonts render slightly differently on every OS.
 *
 * Skipped: stories hidden from the docs (tagged `!autodocs`, e.g. interaction tests) and stories tagged `!visual`.
 */
import { afterEach, expect } from 'vitest';
import { page } from 'vitest/browser';

type StoryInContext = { id: string; tags: string[] };

afterEach(async (context) => {
  const story = (context as unknown as { story?: StoryInContext }).story;
  if (!story || context.task.result?.state === 'fail') return;
  // `!tag` removes a tag: test-only stories lack `autodocs`, opted-out stories lack `visual` (set in preview.ts).
  if (!story.tags.includes('autodocs') || !story.tags.includes('visual')) return;

  // Same frame for every story: at least one viewport high, so overlays (dialogs, sheets) are inside the shot.
  document.body.style.minBlockSize = '100vh';
  await document.fonts.ready;

  // Component as folder, story as file: light/components-actions-button/variants.png
  await expect.element(page.elementLocator(document.body)).toMatchScreenshot(story.id.replace('--', '/'), {
    screenshotOptions: { animations: 'disabled', caret: 'hide' },
  });
});
