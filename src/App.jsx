import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { DocsLayout } from './docs/DocsLayout'

import ColorsPage      from './pages/ColorsPage.jsx'
import TypographyPage  from './pages/TypographyPage'
import SpacingPage     from './pages/SpacingPage'
import RadiusPage      from './pages/RadiusPage'
import ShadowsPage     from './pages/ShadowsPage'
import MotionPage      from './pages/MotionPage'
import ButtonsPage     from './pages/ButtonsPage'
import InputsPage      from './pages/InputsPage'
import SelectsPage     from './pages/SelectsPage'
import BadgesPage      from './pages/BadgesPage'
import AlertsPage      from './pages/AlertsPage'
import CardsPage       from './pages/CardsPage'
import TablesPage      from './pages/TablesPage'
import TabsPage        from './pages/TabsPage'
import NavigationPage  from './pages/NavigationPage'
import OverlaysPage    from './pages/OverlaysPage'
import AccordionPage   from './pages/AccordionPage'
import MenusPage       from './pages/MenusPage'
import ListsPage       from './pages/ListsPage'
import StatsPage       from './pages/StatsPage'
import FeedbackPage    from './pages/FeedbackPage'
import AvatarPage      from './pages/AvatarPage'
import SkeletonPage    from './pages/SkeletonPage'

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
        <Route path="/buttons"    element={<ButtonsPage />} />
        <Route path="/inputs"     element={<InputsPage />} />
        <Route path="/selects"    element={<SelectsPage />} />
        <Route path="/badges"     element={<BadgesPage />} />
        <Route path="/alerts"     element={<AlertsPage />} />
        <Route path="/cards"      element={<CardsPage />} />
        <Route path="/tables"     element={<TablesPage />} />
        <Route path="/tabs"       element={<TabsPage />} />
        <Route path="/navigation" element={<NavigationPage />} />
        <Route path="/overlays"   element={<OverlaysPage />} />
        <Route path="/accordion"  element={<AccordionPage />} />
        <Route path="/menus"      element={<MenusPage />} />
        <Route path="/lists"      element={<ListsPage />} />
        <Route path="/stats"      element={<StatsPage />} />
        <Route path="/feedback"   element={<FeedbackPage />} />
        <Route path="/avatar"     element={<AvatarPage />} />
        <Route path="/skeleton"   element={<SkeletonPage />} />
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