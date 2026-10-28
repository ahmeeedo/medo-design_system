---
"@med-o/ui": minor
---

Component styles sit in the cascade layer `components` (layer order `theme, base, components, utilities`, as in Tailwind v4). Your own CSS without a layer now always wins over the component styles, whatever its specificity; with Tailwind the utilities win too. If you overrode component styles with a higher specificity or `!important`, you can simplify those rules. New export `@med-o/ui/styles.min.css`: all component CSS in one minified file for pages without a bundler.
