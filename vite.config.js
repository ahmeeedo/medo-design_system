import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    /* On, because the token docs read the stylesheets through ?raw to show
       both themes of a token: with CSS off every CSS import is replaced by an
       empty string, that one included, and the page renders nothing. The
       assertions still go against markup, roles and focus, never against
       computed styles. */
    css: true,
    include: ['src/**/*.test.{js,jsx}'],
  },
})
