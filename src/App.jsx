import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DocsLayout } from './docs/DocsLayout'
import { ToastHost } from './components'

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
import NotificationPage from './pages/NotificationPage'
import DataTablePage   from './pages/DataTablePage'
import TabsPage        from './pages/TabsPage'
import ContentSwitcherPage from './pages/ContentSwitcherPage'
import BreadcrumbPage      from './pages/BreadcrumbPage'
import CodeSnippetPage     from './pages/CodeSnippetPage'
import ModalPage       from './pages/ModalPage'
import PopoverPage     from './pages/PopoverPage'
import AccordionPage   from './pages/AccordionPage'
import DropdownPage    from './pages/DropdownPage'
import MenuPage        from './pages/MenuPage'
import MenuButtonsPage from './pages/MenuButtonsPage'
import ListPage          from './pages/ListPage'
import ContainedListPage from './pages/ContainedListPage'
import PaginationPage    from './pages/PaginationPage'
import LoadingPage           from './pages/LoadingPage'
import InlineLoadingPage     from './pages/InlineLoadingPage'
import ProgressBarPage       from './pages/ProgressBarPage'
import ProgressIndicatorPage from './pages/ProgressIndicatorPage'
import TooltipPage            from './pages/TooltipPage'
import SliderPage             from './pages/SliderPage'
import FileUploaderPage       from './pages/FileUploaderPage'
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

/* Single source of truth for the route inventory. The search index generator
   walks this list, and a test asserts it stays aligned with the sidebar NAV. */
export const ROUTES = [
  { path: '/',                  redirect: '/brand' },
  { path: '/brand',             element: <BrandPage /> },
  { path: '/brand-colors',      element: <BrandColorsPage /> },
  { path: '/alias-colors',      element: <AliasColorsPage /> },
  { path: '/semantic-colors',   element: <SemanticColorsPage /> },
  { path: '/typography',        element: <TypographyPage /> },
  { path: '/foundations',       element: <FoundationsPage /> },
  { path: '/button',            element: <ButtonPage /> },
  { path: '/link',              element: <LinkPage /> },
  { path: '/text-input',        element: <TextInputPage /> },
  { path: '/number-input',      element: <NumberInputPage /> },
  { path: '/select',            element: <SelectPage /> },
  { path: '/search',            element: <SearchPage /> },
  { path: '/toggle',            element: <TogglePage /> },
  { path: '/checkbox',          element: <CheckboxPage /> },
  { path: '/radio',             element: <RadioPage /> },
  { path: '/tag',               element: <TagPage /> },
  { path: '/notification',      element: <NotificationPage /> },
  { path: '/data-table',        element: <DataTablePage /> },
  { path: '/tabs',              element: <TabsPage /> },
  { path: '/content-switcher',  element: <ContentSwitcherPage /> },
  { path: '/breadcrumb',        element: <BreadcrumbPage /> },
  { path: '/code-snippet',      element: <CodeSnippetPage /> },
  { path: '/modal',             element: <ModalPage /> },
  { path: '/popover',           element: <PopoverPage /> },
  { path: '/accordion',         element: <AccordionPage /> },
  { path: '/dropdown',          element: <DropdownPage /> },
  { path: '/menu',              element: <MenuPage /> },
  { path: '/menu-buttons',      element: <MenuButtonsPage /> },
  { path: '/list',              element: <ListPage /> },
  { path: '/contained-list',    element: <ContainedListPage /> },
  { path: '/pagination',        element: <PaginationPage /> },
  { path: '/loading',           element: <LoadingPage /> },
  { path: '/inline-loading',    element: <InlineLoadingPage /> },
  { path: '/progress-bar',      element: <ProgressBarPage /> },
  { path: '/progress-indicator', element: <ProgressIndicatorPage /> },
  { path: '/tooltip',           element: <TooltipPage /> },
  { path: '/slider',            element: <SliderPage /> },
  { path: '/file-uploader',     element: <FileUploaderPage /> },
  { path: '/date-picker',       element: <DatePickerPage /> },
  { path: '/about',             element: <WhatIsMedoPage /> },
  { path: '/releases',          element: <ReleasesPage /> },
  { path: '/impressum',         element: <ImpressumPage /> },
  { path: '/datenschutz',       element: <DatenschutzPage /> },
]

function AppContent() {
  return (
    <DocsLayout>
      <ScrollToTop />
      <Routes>
        {ROUTES.map(({ path, element, redirect }) => (
          <Route
            key={path}
            path={path}
            element={redirect ? <Navigate to={redirect} replace /> : element}
          />
        ))}
      </Routes>
    </DocsLayout>
  )
}

export default function App() {
  const { t } = useTranslation()

  /* Sits outside the routed content so a page change never unmounts the stack
     and discards toasts that are still on screen. */
  return (
    <BrowserRouter>
      <AppContent />
      <ToastHost label={t('app.toastRegion')} />
    </BrowserRouter>
  )
}