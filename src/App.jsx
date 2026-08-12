import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { DocsLayout } from './docs/DocsLayout'

import BrandPage          from './pages/BrandPage'
import BrandColorsPage    from './pages/BrandColorsPage'
import AliasColorsPage    from './pages/AliasColorsPage'
import SemanticColorsPage from './pages/SemanticColorsPage'
import TypographyPage  from './pages/TypographyPage'
import FoundationsPage from './pages/FoundationsPage'
import ButtonPage      from './pages/ButtonPage'
import LinkPage        from './pages/LinkPage'
import TextInputPage   from './pages/TextInputPage'
import NumberInputPage from './pages/NumberInputPage'
import SelectPage      from './pages/SelectPage'
import SearchPage      from './pages/SearchPage'
import TogglePage      from './pages/TogglePage'
import CheckboxPage    from './pages/CheckboxPage'
import RadioPage       from './pages/RadioPage'
import TagPage         from './pages/TagPage'
import AlertsPage      from './pages/AlertsPage'
import CardsPage       from './pages/CardsPage'
import TablesPage      from './pages/TablesPage'
import TabsPage        from './pages/TabsPage'
import NavigationPage  from './pages/NavigationPage'
import OverlaysPage    from './pages/OverlaysPage'
import AccordionPage   from './pages/AccordionPage'
import DropdownPage    from './pages/DropdownPage'
import MenuPage        from './pages/MenuPage'
import MenuButtonsPage from './pages/MenuButtonsPage'
import ListPage          from './pages/ListPage'
import ContainedListPage from './pages/ContainedListPage'
import PaginationPage    from './pages/PaginationPage'
import StatsPage       from './pages/StatsPage'
import FeedbackPage    from './pages/FeedbackPage'
import AvatarPage      from './pages/AvatarPage'
import SkeletonPage    from './pages/SkeletonPage'
import TooltipPage            from './pages/TooltipPage'
import SliderPage             from './pages/SliderPage'
import LoadingIndicatorPage   from './pages/LoadingIndicatorPage'
import UploadFieldPage        from './pages/UploadFieldPage'
import DatePickerPage         from './pages/DatePickerPage'
import WhatIsMedoPage   from './pages/WhatIsMedoPage'
import ReleasesPage     from './pages/ReleasesPage'
import ImpressumPage          from './pages/ImpressumPage'
import DatenschutzPage from './pages/DatenschutzPage'

// Scrollt bei jedem Seitenwechsel nach oben
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AppContent() {
  return (
    <DocsLayout>
      <ScrollToTop />
      <Routes>
        <Route path="/"                element={<Navigate to="/brand" replace />} />
        <Route path="/brand"           element={<BrandPage />} />
        <Route path="/brand-colors"    element={<BrandColorsPage />} />
        <Route path="/alias-colors"    element={<AliasColorsPage />} />
        <Route path="/semantic-colors" element={<SemanticColorsPage />} />
        <Route path="/typography"      element={<TypographyPage />} />
        <Route path="/foundations"     element={<FoundationsPage />} />
        <Route path="/button"       element={<ButtonPage />} />
        <Route path="/link"         element={<LinkPage />} />
        <Route path="/text-input"   element={<TextInputPage />} />
        <Route path="/number-input" element={<NumberInputPage />} />
        <Route path="/select"       element={<SelectPage />} />
        <Route path="/search"       element={<SearchPage />} />
        <Route path="/toggle"     element={<TogglePage />} />
        <Route path="/checkbox"   element={<CheckboxPage />} />
        <Route path="/radio"      element={<RadioPage />} />
        <Route path="/tag"        element={<TagPage />} />
        <Route path="/alerts"     element={<AlertsPage />} />
        <Route path="/cards"      element={<CardsPage />} />
        <Route path="/tables"     element={<TablesPage />} />
        <Route path="/tabs"       element={<TabsPage />} />
        <Route path="/navigation" element={<NavigationPage />} />
        <Route path="/overlays"   element={<OverlaysPage />} />
        <Route path="/accordion"  element={<AccordionPage />} />
        <Route path="/dropdown"   element={<DropdownPage />} />
        <Route path="/menu"       element={<MenuPage />} />
        <Route path="/menu-buttons" element={<MenuButtonsPage />} />
        <Route path="/list"           element={<ListPage />} />
        <Route path="/contained-list" element={<ContainedListPage />} />
        <Route path="/pagination"     element={<PaginationPage />} />
        <Route path="/stats"      element={<StatsPage />} />
        <Route path="/feedback"   element={<FeedbackPage />} />
        <Route path="/avatar"     element={<AvatarPage />} />
        <Route path="/skeleton"    element={<SkeletonPage />} />
        <Route path="/tooltip"            element={<TooltipPage />} />
        <Route path="/slider"             element={<SliderPage />} />
        <Route path="/loading-indicator"  element={<LoadingIndicatorPage />} />
        <Route path="/upload-field"       element={<UploadFieldPage />} />
        <Route path="/date-picker"        element={<DatePickerPage />} />
        <Route path="/about"      element={<WhatIsMedoPage />} />
        <Route path="/releases"   element={<ReleasesPage />} />
        <Route path="/impressum"          element={<ImpressumPage />} />
        <Route path="/datenschutz" element={<DatenschutzPage />} />
      </Routes>
    </DocsLayout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}