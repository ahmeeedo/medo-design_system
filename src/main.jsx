import React from 'react'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import App from './App.jsx'
import './styles/global.css'
import i18n from './i18n/index.js'

/* The instance is handed to the provider rather than left to the global
   registration of initReactI18next: a side-effect-only import carries no
   used export, and package.json marks everything but CSS side-effect free,
   so the production build tree-shakes the whole module away and every
   t() call falls back to its key. */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
)
