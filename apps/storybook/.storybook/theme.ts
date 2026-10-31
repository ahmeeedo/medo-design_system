/**
 * Storybook UI themes (sidebar, toolbar, docs blocks) built from the med.o tokens.
 * Light and Dark follow the theme switch in the toolbar.
 * Used by manager.ts (Storybook UI) and the docs container (docs pages).
 */
import { create } from 'storybook/theming';
import type { ThemeVars } from 'storybook/theming';
import light from '@med-o/design-tokens/docs/tokens.light.json';
import dark from '@med-o/design-tokens/docs/tokens.dark.json';

export type Mode = 'light' | 'dark';
type Token = { name: string; value: string | number };

const maps = {
  light: new Map((light as Token[]).map((t) => [t.name, String(t.value)])),
  dark: new Map((dark as Token[]).map((t) => [t.name, String(t.value)])),
};

/*
 * The theme switch is not a Storybook global: changing a global re-renders every story on a docs page, and Storybook
 * reloads the page when a story is still rendering – a white flash on every switch. Instead the toolbar button
 * (manager.ts) stores the mode and sets data-theme on the preview's <html>, exactly like an app does; nothing
 * re-renders. The preview reads the stored mode before its first render, so a reload keeps the theme.
 */
const STORAGE_KEY = 'medo-theme';

/** The stored mode, else the system setting. */
export const startMode = (): Mode => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // Storage blocked (private mode): fall back to the system setting.
  }
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const storeMode = (mode: Mode) => {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Not stored: the switch still works for this visit.
  }
};

/** A token value of one mode. The dark list only contains values that differ (colors); everything else comes from light. */
export const token = (mode: Mode, name: string) => {
  const value = maps[mode].get(name) ?? maps.light.get(name);
  if (value === undefined) throw new Error(`Unknown token: ${name}`);
  return value;
};

const build = (mode: Mode): ThemeVars => {
  const t = (name: string) => token(mode, name);
  return create({
    base: mode,
    brandTitle: 'med.o Design System', // also the alt text of the logo
    brandImage: mode === 'dark' ? './logo-white.svg' : './logo-rgb.svg',
    brandUrl: '/',
    brandTarget: '_self',

    fontBase: t('font/family/sans'),
    fontCode: t('font/family/mono'),

    colorPrimary: t('action/primary'),
    // Storybook's accent. Its own hover states are this colour as text on a 7–14 % tint of it, so Dark needs the light
    // brand text colour (brand-bold would vanish on the dark bar). Sidebar, toolbar and menus get our states in manager.ts.
    colorSecondary: mode === 'dark' ? t('text/brand') : t('surface/brand-bold'),

    appBg: t('surface/canvas'),
    appContentBg: t('surface/default'),
    appPreviewBg: t('surface/default'),
    appBorderColor: t('border/default'),
    appBorderRadius: 8,

    textColor: t('text/primary'),
    textInverseColor: t('text/on-action'),
    textMutedColor: t('text/secondary'),

    barBg: t('surface/default'),
    barTextColor: t('text/secondary'),
    barHoverColor: t('text/brand'),
    barSelectedColor: t('text/brand'),

    buttonBg: t('surface/default'),
    buttonBorder: t('border/default'),
    booleanBg: t('surface/subtle'),
    booleanSelectedBg: t('surface/default'),

    inputBg: t('surface/default'),
    inputBorder: t('border/strong'),
    inputTextColor: t('text/primary'),
    inputBorderRadius: 8,
  });
};

export const themes: Record<Mode, ThemeVars> = { light: build('light'), dark: build('dark') };
