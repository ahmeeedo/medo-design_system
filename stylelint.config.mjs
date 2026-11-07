/**
 * Style rules (npm run lint): everything comes from tokens – no fixed colors, no fixed px or rem values.
 * Applies to the components (packages/ui) and to the documentation (apps/storybook). scripts/lint-tokens.mjs adds
 * what Stylelint cannot check: every var(--medo-…) exists, and inline styles in stories and docs use tokens too.
 *
 * Allowed without a token: 0, %, em/ch (relative to the text), viewport units, times – and, with a reason
 * (stylelint-disable comment), breakpoints in media and container queries, where custom properties do not work.
 */
export default {
  rules: {
    'unit-disallowed-list': [
      ['px', 'rem'],
      {
        // Breakpoints: custom properties cannot be used in media queries.
        ignoreMediaFeatureNames: { px: ['width', 'min-width', 'max-width'], rem: ['width', 'min-width', 'max-width'] },
        message: (unit) => `No fixed ${unit}: use a token – var(--medo-space-…), var(--medo-size-…), var(--medo-border-width-…) …`,
      },
    ],
    'color-no-hex': [true, { message: 'No fixed colors: use var(--medo-color-…).' }],
    'color-named': ['never', { message: 'No fixed colors: use var(--medo-color-…). System colors (CanvasText, Highlight) are fine.' }],
    'function-disallowed-list': [['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch'], { message: 'No fixed colors: use var(--medo-color-…).' }],
  },
};
