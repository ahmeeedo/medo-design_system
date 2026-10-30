# @med-o/design-tokens

## 0.3.0

## 0.2.0

### Minor Changes

- be1add2: The overline text style is no longer uppercase: sentence case with normal tracking (`.medo-text-overline`, `--medo-typography-overline`). Navigation section titles follow. Capitals are harder to read; write the text in the case you want to show.
- 23fbda6: Higher contrast for “Increase contrast” in the system settings (`prefers-contrast: more`): `text/secondary` becomes neutral 700 (Light) or 300 (Dark), at least 9.4 : 1 on every surface; `border/default` becomes `border/strong`, at least 4.3 : 1. Works with `data-theme` on any element.
