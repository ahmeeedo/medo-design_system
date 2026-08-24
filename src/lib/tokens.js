/* medo Design System · foundation style entry of the package.

   Side-effect module. It exists so the bundler collects the foundation
   stylesheets into one CSS asset, in the order the cascade needs: the eight
   token files first, then the theme layer that restates the semantic tokens as
   light/dark pairs and has to win against them.

   The component overrides (medo-theme-components.css) are not part of this
   entry — they address component classes and belong to the full style entry
   point, which the package build assembles from this file, the component CSS
   and those overrides. */
import '../styles/fonts.css'
import '../styles/medo-tokens.css'
import '../styles/medo-theme.css'
import '../styles/icons.css'
