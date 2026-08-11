import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { DocsLayout } from './docs/DocsLayout'

import ColorsPage      from './pages/ColorsPage.jsx'
import TypographyPage  from './pages/TypographyPage'
import SpacingPage     from './pages/SpacingPage'
import RadiusPage      from './pages/RadiusPage'
import ShadowsPage     from './pages/ShadowsPage'
import MotionPage      from './pages/MotionPage'
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
import MenusPage       from './pages/MenusPage'
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
        <Route path="/"           element={<Navigate to="/colors" replace />} />
        <Route path="/colors"     element={<ColorsPage />} />
        <Route path="/typography" element={<TypographyPage />} />
        <Route path="/spacing"    element={<SpacingPage />} />
        <Route path="/radius"     element={<RadiusPage />} />
        <Route path="/shadows"    element={<ShadowsPage />} />
        <Route path="/motion"     element={<MotionPage />} />
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
        <Route path="/menus"      element={<MenusPage />} />
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