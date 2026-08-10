---
name: medo-design
description: Use this skill to generate well-branded interfaces and assets for medo, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for protoyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Notes specific to medo:

- The UI language is **German**, always. Sie-Anrede, no emoji, no Title Case.
- `CLAUDE.md` holds the binding decisions and wins over anything inferred from the files.
- Link `styles.css` for tokens. Use only Ebene-3 semantic tokens (`--medo-action`, `--medo-text`,
  `--medo-border`) in components — never raw brand scales.
- Icons: Material Symbols Rounded only, weight 300, FILL 0. Never hand-draw an SVG icon.
- Light mode only so far.
