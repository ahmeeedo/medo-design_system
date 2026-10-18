/**
 * Storybook UI themes (sidebar, toolbar, docs blocks) built from the med.o tokens.
 * Light and Dark follow the theme switch in the toolbar.
 * Used by manager.ts (Storybook UI) and the docs container (docs pages).
 */
import { create } from 'storybook/theming';
import type { ThemeVars } from 'storybook/theming';
import light from '@medo/design-tokens/docs/tokens.light.json';
import dark from '@medo/design-tokens/docs/tokens.dark.json';

export type Mode = 'light' | 'dark';
type Token = { name: string; value: string | number };

const maps = {
  light: new Map((light as Token[]).map((t) => [t.name, String(t.value)])),
  dark: new Map((dark as Token[]).map((t) => [t.name, String(t.value)])),
};

/** Toolbar global "theme" ("Light" | "Dark") → mode */
export const modeFromGlobals = (globals?: Record<string, unknown>): Mode => (globals?.theme === 'Dark' ? 'dark' : 'light');

const build = (mode: Mode): ThemeVars => {
  const t = (name: string) => {
    // The dark list only contains values that differ (colors); everything else comes from light.
    const value = maps[mode].get(name) ?? maps.light.get(name);
    if (value === undefined) throw new Error(`Unknown token: ${name}`);
    return value;
  };
  return create({
    base: mode,
    brandTitle: 'med.o Design System', // also the alt text of the logo
    brandImage: mode === 'dark' ? './logo-white.svg' : './logo-rgb.svg',
    brandUrl: '/',
    brandTarget: '_self',

    fontBase: t('font/family/sans'),
    fontCode: t('font/family/mono'),

    colorPrimary: t('action/primary'),
    // Selected sidebar item has white text: brand-bold keeps ≥ 4.5 : 1 in both modes.
    colorSecondary: t('surface/brand-bold'),

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
