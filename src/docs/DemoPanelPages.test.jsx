import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '../i18n'

import AccordionPage from '../pages/AccordionPage'
import BreadcrumbPage from '../pages/BreadcrumbPage'
import ButtonPage from '../pages/ButtonPage'
import CheckboxPage from '../pages/CheckboxPage'
import CodeSnippetPage from '../pages/CodeSnippetPage'
import ContainedListPage from '../pages/ContainedListPage'
import ContentSwitcherPage from '../pages/ContentSwitcherPage'
import DataTablePage from '../pages/DataTablePage'
import DatePickerPage from '../pages/DatePickerPage'
import DropdownPage from '../pages/DropdownPage'
import FileUploaderPage from '../pages/FileUploaderPage'
import InlineLoadingPage from '../pages/InlineLoadingPage'
import LinkPage from '../pages/LinkPage'
import ListPage from '../pages/ListPage'
import LoadingPage from '../pages/LoadingPage'
import MenuButtonsPage from '../pages/MenuButtonsPage'
import MenuPage from '../pages/MenuPage'
import ModalPage from '../pages/ModalPage'
import NotificationPage from '../pages/NotificationPage'
import NumberInputPage from '../pages/NumberInputPage'
import PaginationPage from '../pages/PaginationPage'
import PopoverPage from '../pages/PopoverPage'
import ProgressBarPage from '../pages/ProgressBarPage'
import ProgressIndicatorPage from '../pages/ProgressIndicatorPage'
import RadioPage from '../pages/RadioPage'
import SearchPage from '../pages/SearchPage'
import SelectPage from '../pages/SelectPage'
import SliderPage from '../pages/SliderPage'
import TabsPage from '../pages/TabsPage'
import TagPage from '../pages/TagPage'
import TextInputPage from '../pages/TextInputPage'
import TogglePage from '../pages/TogglePage'
import TooltipPage from '../pages/TooltipPage'

/* Every documentation page that carries a DemoPanel. The list is spelled out
   rather than globbed so a page that loses its panel shows up as a failure
   here instead of quietly dropping out of the run. */
const PAGES = [
  ['Accordion', AccordionPage],
  ['Breadcrumb', BreadcrumbPage],
  ['Button', ButtonPage],
  ['Checkbox', CheckboxPage],
  ['CodeSnippet', CodeSnippetPage],
  ['ContainedList', ContainedListPage],
  ['ContentSwitcher', ContentSwitcherPage],
  ['DataTable', DataTablePage],
  ['DatePicker', DatePickerPage],
  ['Dropdown', DropdownPage],
  ['FileUploader', FileUploaderPage],
  ['InlineLoading', InlineLoadingPage],
  ['Link', LinkPage],
  ['List', ListPage],
  ['Loading', LoadingPage],
  ['MenuButtons', MenuButtonsPage],
  ['Menu', MenuPage],
  ['Modal', ModalPage],
  ['Notification', NotificationPage],
  ['NumberInput', NumberInputPage],
  ['Pagination', PaginationPage],
  ['Popover', PopoverPage],
  ['ProgressBar', ProgressBarPage],
  ['ProgressIndicator', ProgressIndicatorPage],
  ['Radio', RadioPage],
  ['Search', SearchPage],
  ['Select', SelectPage],
  ['Slider', SliderPage],
  ['Tabs', TabsPage],
  ['Tag', TagPage],
  ['TextInput', TextInputPage],
  ['Toggle', TogglePage],
  ['Tooltip', TooltipPage],
]

const draw = (Page) => render(<MemoryRouter><Page /></MemoryRouter>).container

/* The detail area is collapsed behind the `hidden` attribute, which takes its
   contents out of the accessibility tree. Everything here is therefore counted
   through the DOM; getByRole would report an empty panel and look like a
   rendering fault. */
const controlArea = (container) => container.querySelector('[role="group"][aria-label="Steuerung"]')
const bar = (container) => controlArea(container).parentElement

/* Scoped to the control bar on purpose: several previews render a Select or a
   Toggle of their own, and those are not controls. */
const controlsIn = (root) => Array.from(root.querySelectorAll('[role="combobox"],[role="switch"]'))
const visible = (root) => controlsIn(root).filter((el) => !el.closest('[hidden]'))

describe('documentation pages with a DemoPanel', () => {
  it.each(PAGES)('%s renders with its panel', (_name, Page) => {
    const container = draw(Page)
    expect(controlArea(container)).not.toBeNull()
  })

  it.each(PAGES)('%s shows exactly one control at rest', (_name, Page) => {
    const container = draw(Page)

    expect(controlArea(container).hasAttribute('hidden')).toBe(true)
    expect(visible(bar(container))).toHaveLength(1)
  })

  it.each(PAGES)('%s keeps its single controls reachable behind the detail area', (_name, Page) => {
    const container = draw(Page)

    // more than the one picker that stays visible
    expect(controlsIn(bar(container)).length).toBeGreaterThan(1)
  })
})
