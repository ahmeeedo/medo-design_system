/**
 * Setup for every story test (all Vitest projects). Gives play functions the one thing a story cannot do on its own:
 * change the size of the browser window, e.g. to check that an open dialog survives a rotation from desktop to phone.
 * Play functions call `resizeViewport()` from story-helpers; in Storybook itself it does nothing.
 */
import { page } from 'vitest/browser';

(globalThis as { __medoTest?: { resize: (width: number, height: number) => Promise<void> } }).__medoTest = {
  resize: async (width, height) => {
    await page.viewport(width, height);
  },
};
