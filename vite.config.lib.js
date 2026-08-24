import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/* Package build. Separate from vite.config.js on purpose: that config builds
   the documentation portal with Tailwind and has to keep working untouched.

   Two entries. 'index' is the component barrel; the component stylesheets ride
   in as side-effect imports and the bundler lifts them out into index.css.
   'tokens' is the foundation — token layers, theme, icon axes.
   scripts/build-package-styles.mjs joins the two CSS assets and the component
   theme overrides into the single styles.css the package ships.

   Not build.lib: library mode inlines every asset as a data URI regardless of
   assetsInlineLimit, which would turn the seven woff2 faces into a base64 block
   inside tokens.css and make consumers download all of them up front. React is
   externalised by hand instead, which is all library mode would have added. */
export default defineConfig({
  plugins: [react()],
  /* Relative, so the font urls in the built css resolve next to the
     stylesheet instead of against the consumer's server root. */
  base: './',
  publicDir: false,
  build: {
    outDir: 'dist-lib',
    emptyOutDir: true,
    target: 'esnext',
    minify: false,
    modulePreloadPolyfill: false,
    assetsInlineLimit: 0,
    /* Off would fold both entries into one stylesheet and take the tokens-only
       entry point down with it. */
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'src/components/index.js'),
        tokens: path.resolve(__dirname, 'src/lib/tokens.js'),
      },
      /* Without this rollup treats the entries as applications and drops their
         exports, leaving an index.js that tree-shakes down to nothing. */
      preserveEntrySignatures: 'strict',
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client'],
      output: {
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: (asset) => {
          const name = asset.names?.[0] ?? asset.name ?? ''
          return name.endsWith('.woff2') ? 'fonts/[name][extname]' : '[name][extname]'
        },
      },
    },
  },
})
