import '@testing-library/jest-dom/vitest'
import { installDomStubs } from '../../scripts/buildSearchIndex'

/* PageLayout observes the tab bar and the headings, and jsdom provides neither
   observer. The stubs already exist for the search index builder, so every test
   that renders a documentation page reads them from that one place. */
installDomStubs()
