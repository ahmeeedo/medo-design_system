import { useMemo, useState } from 'react';
import { DialogTrigger } from 'react-aria-components';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Key, Selection } from 'react-aria-components';
import { fn } from 'storybook/test';
import { ArrowUpDown, Funnel, FileText, Globe, LayoutGrid, List, RotateCcw, Search, Settings, Upload, User } from 'lucide-react';
import { SearchField } from './SearchField';
import { SearchResult, type SearchResultType } from './SearchResult';
import { QuickSearch } from './QuickSearch';
import { Accordion, AccordionItem } from '../accordion/Accordion';
import { Avatar } from '../avatar/Avatar';
import { BottomSheet } from '../bottom-sheet/BottomSheet';
import { Checkbox, CheckboxGroup } from '../checkbox/Checkbox';
import { Radio, RadioGroup } from '../radio/Radio';
import { Button } from '../button/Button';
import { Card } from '../card/Card';
import { EmptyState } from '../empty-state/EmptyState';
import { IconButton } from '../icon-button/IconButton';
import { Link } from '../link/Link';
import { ListBoxSection, Option } from '../listbox/ListBox';
import { Pagination } from '../pagination/Pagination';
import { Skeleton } from '../progress/Progress';
import { Select } from '../select/Select';
import { Tab, TabList, TabPanel, Tabs } from '../tabs/Tabs';
import { Tag, TagGroup } from '../tag/Tag';
import { ToggleButton, ToggleButtonGroup } from '../toggle-button/ToggleButton';
import { Image } from '../media/Image';
import { LightDark, samplePhoto, semantic, slot } from '../story-helpers';

/** Placeholder thumbnail (stories only). */
const thumb = <Image src={samplePhoto(1)} alt="" ratio="4:3" radius="none" />;

type Hit = { id: string; type: SearchResultType; title: string; path: string; snippet: string; badge: string; meta: string; group: 'pages' | 'files' | 'people' };
const hits: Hit[] = [
  {
    id: 'download',
    type: 'page',
    title: 'Download an invoice',
    path: 'Help center › Billing',
    snippet: 'You can download every invoice as a PDF on the billing page. Older invoices stay available for 10 years.',
    badge: 'Page',
    meta: 'Updated 3 days ago',
    group: 'pages',
  },
  {
    id: 'pdf',
    type: 'document',
    title: 'Invoice-2026-0142.pdf',
    path: 'Files › Finance › 2026',
    snippet: '… the total amount of this invoice is due within 14 days. Please quote the invoice number with every payment …',
    badge: 'PDF',
    meta: '2.4 MB · Edited by Lea M. · Sep 28',
    group: 'files',
  },
  {
    id: 'lea',
    type: 'person',
    title: 'Lea Müller',
    path: 'People › Finance',
    snippet: 'Finance lead · Owner of invoice approvals · lea.mueller@example.com',
    badge: 'Person',
    meta: 'Finance team · Berlin',
    group: 'people',
  },
  {
    id: 'video',
    type: 'media',
    title: 'Invoice workflow in 4 minutes',
    path: 'Media › Tutorials',
    snippet: 'A short video on how to create, send and track an invoice from start to finish.',
    badge: 'Video',
    meta: '4:32 · Sep 12',
    group: 'files',
  },
  {
    id: 'settings',
    type: 'page',
    title: 'Invoice settings',
    path: 'Settings › Billing',
    snippet: 'Choose the numbering, the logo and the payment terms that appear on every invoice.',
    badge: 'Page',
    meta: 'Updated last week',
    group: 'pages',
  },
  {
    id: 'template',
    type: 'document',
    title: 'Invoice template 2026',
    path: 'Files › Templates',
    snippet: 'Word template with our letterhead for manual invoices.',
    badge: 'Word',
    meta: '84 KB · Aug 30',
    group: 'files',
  },
  {
    id: 'numbering',
    type: 'page',
    title: 'How invoices are numbered',
    path: 'Help center › Billing',
    snippet: 'Invoice numbers count up per year and never repeat, as tax law requires.',
    badge: 'Page',
    meta: 'Updated 2 months ago',
    group: 'pages',
  },
];

const leadingFor = (h: Hit) => (h.type === 'person' ? <Avatar name={h.title} decorative /> : h.type === 'media' ? thumb : undefined);

const meta = {
  title: 'Components/Search',
  component: SearchField,
  tags: ['autodocs'],
  args: { label: 'Search', placeholder: 'Search invoices', size: 'md', onSubmit: fn(), onChange: fn(), onClear: fn() },
  argTypes: {
    label: { ...slot({ visible: 'Search', 'aria-label only': undefined }), description: 'Visible label. Without it set `aria-label` (toolbars, header).' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'], description: 'sm in toolbars · md · lg on the search page, in Quick search and on mobile.' },
    placeholder: { control: 'text' },
    description: { control: 'text' },
    isDisabled: { control: 'boolean' },
    'aria-label': semantic,
    clearLabel: semantic,
    onSubmit: { control: false },
    onChange: { control: false },
    onClear: { control: false },
  },
  parameters: {
    medo: { code: 'C43', subtitle: 'Find content fast: search field, results, search page and quick search.', figma: '422:30' },
    docs: {
      description: {
        component:
          '**SearchField** (React Aria SearchField): search icon, × to clear once filled, Esc clears, Enter submits. Visible label or `aria-label`; put the search area in a `<search>` element (landmark). ' +
          '**SearchResult**: one hit – path, title (one link for the whole hit), snippet (2 lines), meta with type badge. `query` shows every match in bold, never colour alone. Base: divider, title in brand · Aesthetic: no divider, larger title, rounded hover. ' +
          '**QuickSearch** (Cmd / Ctrl + K): a modal with React Aria Autocomplete – focus stays in the field while ↑ ↓ move, Enter opens, Esc closes and returns focus. Recent and suggested while empty, hits grouped by type while typing. ' +
          'Search page: result count announced, sort by relevance, active filters as removable tags, query and filters in the URL. Many filters: a sidebar with Accordion groups; mobile: a filter Bottom Sheet. ' +
          'Styles: `medo-search-field`, `medo-search-result--{base|aesthetic}`, `medo-search-results`, `medo-quick-search`.',
      },
    },
  },
  render: (args) => (
    <search style={{ display: 'block', maxInlineSize: '30rem' }}>
      <SearchField {...args} aria-label={args.label ? undefined : 'Search invoices'} />
    </search>
  ),
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Results: Story = {
  name: 'Search result',
  parameters: {
    docs: {
      description: {
        story:
          'Page, document, person and media. Base: divider between hits, title in brand. Aesthetic: no divider, larger title, rounded state layer. The search term is bold in title and snippet.',
      },
    },
  },
  render: () => (
    <LightDark>
      {(['base', 'aesthetic'] as const).map((variant) => (
        <ul key={variant} role="list" className="medo-search-results" aria-label={`Results, ${variant}`}>
          {hits.slice(0, 4).map((h) => (
            <li key={h.id}>
              <SearchResult
                variant={variant}
                type={h.type}
                href={`#${h.id}`}
                query="invoice"
                title={h.title}
                path={h.path}
                snippet={h.snippet}
                badge={h.badge}
                meta={h.meta}
                leading={leadingFor(h)}
              />
            </li>
          ))}
        </ul>
      ))}
    </LightDark>
  ),
};

/* ---------- Search page ---------- */

const groupLabel = { all: 'All', pages: 'Pages', files: 'Files', people: 'People' } as const;

function SearchPage() {
  const [query, setQuery] = useState('invoice');
  const [submitted, setSubmitted] = useState('invoice');
  const [tab, setTab] = useState<Key>('all');
  const [types, setTypes] = useState<string[]>([]);
  const [sort, setSort] = useState<Key>('relevance');
  const [view, setView] = useState<Selection>(new Set(['list']));
  const [loading, setLoading] = useState(false);

  const search = (q: string) => {
    setSubmitted(q);
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  };
  const matches = useMemo(() => {
    const q = submitted.trim().toLowerCase();
    return hits.filter((h) => !q || `${h.title} ${h.snippet}`.toLowerCase().includes(q));
  }, [submitted]);
  const counts = { all: matches.length, pages: 0, files: 0, people: 0 };
  matches.forEach((h) => counts[h.group]++);
  const shown = matches
    .filter((h) => tab === 'all' || h.group === tab)
    .filter((h) => types.length === 0 || types.includes(h.badge))
    .sort((a, b) => (sort === 'title' ? a.title.localeCompare(b.title) : 0));
  const grid = view !== 'all' && view.has('grid');
  const noun = tab === 'all' ? 'results' : groupLabel[tab as keyof typeof groupLabel].toLowerCase();
  const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--medo-space-2)' };

  const list = loading ? (
    <div aria-hidden="true" style={{ display: 'grid', gap: 'var(--medo-space-6)' }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ display: 'flex', gap: 'var(--medo-space-4)', padding: 'var(--medo-space-4)' }}>
          <Skeleton shape="circle" width={40} height={40} />
          <div style={{ display: 'grid', gap: 'var(--medo-space-2)', flex: 1 }}>
            <Skeleton width="20%" />
            <Skeleton width="45%" height={20} />
            <Skeleton width="90%" />
          </div>
        </div>
      ))}
    </div>
  ) : shown.length === 0 ? (
    <div style={{ display: 'grid', gap: 'var(--medo-space-4)' }}>
      {submitted.toLowerCase().startsWith('invoy') && (
        <p style={{ margin: 0, font: 'var(--medo-typography-body-md)', color: 'var(--medo-color-text-secondary)' }}>
          Did you mean{' '}
          <Link
            href="#"
            onPress={() => {
              setQuery('invoice');
              search('invoice');
            }}
          >
            invoice
          </Link>
          ?
        </p>
      )}
      <EmptyState
        type="no-results"
        size="section"
        title={`No results for “${submitted}”`}
        description="Check the spelling or remove some filters."
        action={{ label: 'Clear filters', onPress: () => setTypes([]) }}
      />
    </div>
  ) : grid ? (
    <ul
      role="list"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
        gap: 'var(--medo-space-8) var(--medo-space-6)',
        margin: 0,
        padding: 0,
        listStyle: 'none',
      }}
    >
      {shown.map((h) => (
        <li key={h.id}>
          <Card variant="plain" href={`#${h.id}`} media={thumb} title={h.title} subtitle={`${h.badge} · ${h.meta}`} />
        </li>
      ))}
    </ul>
  ) : (
    <ul role="list" className="medo-search-results" aria-label="Results">
      {shown.map((h) => (
        <li key={h.id}>
          <SearchResult
            type={h.type}
            href={`#${h.id}`}
            query={submitted}
            title={h.title}
            path={h.path}
            snippet={h.snippet}
            badge={h.badge}
            meta={h.meta}
            leading={leadingFor(h)}
          />
        </li>
      ))}
    </ul>
  );

  const results = (
    <>
      {/* Polite live region: the count is announced after every search. */}
      <h2 className="medo-text-heading-lg" style={{ margin: 0 }}>
        <span role="status">{loading ? 'Searching …' : `${shown.length} ${noun} for “${submitted}”`}</span>
      </h2>
      <div style={row}>
        <Select aria-label="Type" placeholder="Type" size="sm" selectionMode="multiple" value={types} onChange={(v) => setTypes(v as string[])}>
          {['Page', 'PDF', 'Word', 'Video', 'Person'].map((t) => (
            <Option key={t} id={t}>
              {t}
            </Option>
          ))}
        </Select>
        <span style={{ flex: 1 }} />
        <Select aria-label="Sort by" size="sm" leadingIcon={<ArrowUpDown />} value={sort} onChange={(v) => setSort(v as Key)}>
          <Option id="relevance">Relevance</Option>
          <Option id="title">Title A–Z</Option>
        </Select>
        <ToggleButtonGroup aria-label="View" selectedKeys={view} onSelectionChange={setView} disallowEmptySelection>
          <ToggleButton id="list" aria-label="List" icon={<List />} />
          <ToggleButton id="grid" aria-label="Grid" icon={<LayoutGrid />} />
        </ToggleButtonGroup>
      </div>
      {types.length > 0 && (
        <div style={row}>
          <TagGroup aria-label="Active filters" onRemove={(keys) => setTypes((t) => t.filter((x) => !keys.has(x)))}>
            {types.map((t) => (
              <Tag key={t} id={t}>
                {`Type: ${t}`}
              </Tag>
            ))}
          </TagGroup>
          <Button variant="text" size="sm" onPress={() => setTypes([])}>
            Clear all
          </Button>
        </div>
      )}
      {list}
      {!loading && shown.length > 0 && <Pagination aria-label="Result pages" totalItems={shown.length * 6} pageSize={10} onChange={fn()} />}
    </>
  );

  return (
    <Tabs selectedKey={tab} onSelectionChange={setTab}>
      <div style={{ display: 'grid', gap: 'var(--medo-space-6)' }}>
        <search style={{ display: 'grid', gap: 'var(--medo-space-6)', justifyItems: 'center' }}>
          <div style={{ inlineSize: '100%', maxInlineSize: '48rem' }}>
            <SearchField
              aria-label="Search"
              placeholder="Search pages, files, people …"
              size="lg"
              value={query}
              onChange={setQuery}
              onSubmit={search}
              onClear={() => search('')}
            />
          </div>
          <TabList aria-label="Result types">
            {(['all', 'pages', 'files', 'people'] as const).map((k) => (
              <Tab key={k} id={k} count={counts[k]}>
                {groupLabel[k]}
              </Tab>
            ))}
          </TabList>
        </search>
        {/* The results are the panel of the selected type tab. */}
        {(['all', 'pages', 'files', 'people'] as const).map((k) => (
          <TabPanel key={k} id={k} keepMounted={false}>
            <div style={{ display: 'grid', gap: 'var(--medo-space-6)' }}>{results}</div>
          </TabPanel>
        ))}
      </div>
    </Tabs>
  );
}

export const Page: Story = {
  name: 'Search page',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Search field lg, tabs with counts, count as status („7 results for “invoice”“), filter bar (Select sm), sort (Relevance), list / grid. Active filters are removable tags plus „Clear all“. Search for „invoyce“: no results with „Did you mean“ and a way out. Keep query, filters, sort and page in the URL.',
      },
    },
  },
  render: () => <SearchPage />,
};

/* ---------- Search page with sidebar filters · mobile filter sheet ---------- */

const typeOptions = [
  { id: 'PDF', label: 'PDF' },
  { id: 'Word', label: 'Word' },
  { id: 'Page', label: 'Page' },
  { id: 'Video', label: 'Video' },
];
const dateOptions = ['Any time', 'Last 7 days', 'Last 30 days', 'This year'];

/** The filter groups – the same in the sidebar and in the mobile sheet. Each Accordion title names its group. */
function Filters({
  types,
  setTypes,
  date,
  setDate,
  counts,
  choiceSize = 'md',
}: {
  types: string[];
  setTypes: (t: string[]) => void;
  date: string;
  setDate: (d: string) => void;
  counts: Record<string, number>;
  choiceSize?: 'md' | 'lg';
}) {
  return (
    <Accordion defaultExpandedKeys={['type', 'date']}>
      <AccordionItem id="type" title="Type">
        <CheckboxGroup aria-label="Type" size={choiceSize} value={types} onChange={setTypes}>
          {typeOptions.map((o) => (
            <Checkbox key={o.id} value={o.id}>
              {`${o.label} (${counts[o.id] ?? 0})`}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </AccordionItem>
      <AccordionItem id="date" title="Date">
        <RadioGroup aria-label="Date" size={choiceSize} value={date} onChange={setDate}>
          {dateOptions.map((d) => (
            <Radio key={d} value={d}>
              {d}
            </Radio>
          ))}
        </RadioGroup>
      </AccordionItem>
      <AccordionItem id="author" title="Author">
        <CheckboxGroup aria-label="Author" size={choiceSize}>
          <Checkbox value="lea">Lea Müller</Checkbox>
          <Checkbox value="sam">Sam Kowalski</Checkbox>
        </CheckboxGroup>
      </AccordionItem>
      <AccordionItem id="size" title="File size">
        <RadioGroup aria-label="File size" size={choiceSize} defaultValue="any">
          <Radio value="any">Any size</Radio>
          <Radio value="small">Under 1 MB</Radio>
          <Radio value="large">1 MB and more</Radio>
        </RadioGroup>
      </AccordionItem>
    </Accordion>
  );
}

function SidebarPage({ forceMobile = false }: { forceMobile?: boolean }) {
  const [types, setTypes] = useState<string[]>(['PDF']);
  const [date, setDate] = useState('Last 30 days');
  const counts: Record<string, number> = {};
  hits.forEach((h) => (counts[h.badge] = (counts[h.badge] ?? 0) + 1));
  const shown = hits.filter((h) => types.length === 0 || types.includes(h.badge));
  const active = [...types.map((t) => ({ id: `type:${t}`, label: t })), ...(date !== 'Any time' ? [{ id: 'date', label: date }] : [])];
  const remove = (keys: Set<Key>) => {
    setTypes(types.filter((t) => !keys.has(`type:${t}`)));
    if (keys.has('date')) setDate('Any time');
  };
  const clear = () => {
    setTypes([]);
    setDate('Any time');
  };
  const results = (
    <ul role="list" className="medo-search-results" aria-label="Results">
      {shown.map((h) => (
        <li key={h.id}>
          <SearchResult
            type={h.type}
            href={`#${h.id}`}
            query="invoice"
            title={h.title}
            path={h.path}
            snippet={h.snippet}
            badge={h.badge}
            meta={h.meta}
            leading={leadingFor(h)}
          />
        </li>
      ))}
    </ul>
  );
  const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--medo-space-2)' };
  const n = `${shown.length} ${shown.length === 1 ? 'result' : 'results'}`;

  if (forceMobile) {
    return (
      <div style={{ display: 'grid', gap: 'var(--medo-space-4)', maxInlineSize: '23.4375rem' }}>
        <search>
          <SearchField aria-label="Search" size="lg" defaultValue="invoice" />
        </search>
        <div style={{ ...row, justifyContent: 'space-between' }}>
          <span role="status" style={{ font: 'var(--medo-typography-label-md)' }}>
            {n}
          </span>
          <DialogTrigger>
            <Button variant="secondary" size="sm" startIcon={<Funnel />}>
              {`Filters (${active.length})`}
            </Button>
            {/* The sheet button names the result count, so users know what they get before closing. */}
            <BottomSheet
              title="Filters"
              footer={(close) => (
                <Button size="lg" onPress={close} style={{ inlineSize: '100%' }}>
                  {`Show ${n}`}
                </Button>
              )}
            >
              {/* Mobile: checkboxes and radios lg (touch). */}
              <div style={{ paddingInline: 'var(--medo-space-4)' }}>
                <Filters types={types} setTypes={setTypes} date={date} setDate={setDate} counts={counts} choiceSize="lg" />
              </div>
            </BottomSheet>
          </DialogTrigger>
        </div>
        {results}
        <Pagination variant="compact" aria-label="Result pages" totalItems={24} pageSize={10} onChange={fn()} />
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 'var(--medo-space-6)' }}>
      <search style={{ maxInlineSize: '45rem' }}>
        <SearchField aria-label="Search" size="lg" defaultValue="invoice" />
      </search>
      <div style={{ display: 'grid', gridTemplateColumns: '16.5rem 1fr', gap: 'var(--medo-space-8)', alignItems: 'start' }}>
        <aside aria-labelledby="filters-heading" style={{ display: 'grid', gap: 'var(--medo-space-2)' }}>
          <h2 id="filters-heading" className="medo-text-heading-sm" style={{ margin: 0 }}>
            Filters
          </h2>
          <Filters types={types} setTypes={setTypes} date={date} setDate={setDate} counts={counts} />
        </aside>
        <div style={{ display: 'grid', gap: 'var(--medo-space-4)', minInlineSize: 0 }}>
          <div style={{ ...row, justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, font: 'var(--medo-typography-label-md)' }}>
              <span role="status">{`${n} for “invoice”`}</span>
            </h2>
            <Select aria-label="Sort by" size="sm" leadingIcon={<ArrowUpDown />} defaultValue="relevance">
              <Option id="relevance">Relevance</Option>
              <Option id="newest">Newest</Option>
            </Select>
          </div>
          {active.length > 0 && (
            <div style={row}>
              <TagGroup aria-label="Active filters" onRemove={remove}>
                {active.map((a) => (
                  <Tag key={a.id} id={a.id}>
                    {a.label}
                  </Tag>
                ))}
              </TagGroup>
              <Button variant="text" size="sm" onPress={clear}>
                Clear all
              </Button>
            </div>
          )}
          {results}
          <Pagination aria-label="Result pages" totalItems={24} pageSize={10} onChange={fn()} />
        </div>
      </div>
    </div>
  );
}

export const Sidebar: Story = {
  name: 'Search page: sidebar filters',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'More than 4 filter groups: a sidebar (264) with an Accordion – Type and Date open. Every group is named by its Accordion title (CheckboxGroup / RadioGroup with `aria-label`). Active filters are removable tags plus „Clear all“; the count is announced.',
      },
    },
  },
  render: () => <SidebarPage />,
};

export const MobileFilters: Story = {
  name: 'Search page: mobile filter sheet',
  parameters: {
    docs: {
      description: {
        story:
          'Below 640 px the filters move into a Bottom Sheet behind „Filters (2)“. The sheet button names the result count („Show 3 results“). Tabs scroll sideways; Quick search opens full screen.',
      },
    },
  },
  render: () => <SidebarPage forceMobile />,
};

/* ---------- Quick search ---------- */

const recent = ['invoice 2025', 'Lea Müller', 'travel policy'];
const groupIcon = { pages: <Globe />, files: <FileText />, people: <User /> };

function QuickSearchExample() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const term = query.trim().toLowerCase();
  const found = hits.filter((h) => term && h.title.toLowerCase().includes(term));
  const groups = (['pages', 'files', 'people'] as const).map((g) => ({ id: g, items: found.filter((h) => h.group === g).slice(0, 5) })).filter((g) => g.items.length);

  return (
    <>
      <IconButton aria-label="Search" icon={<Search />} shortcut="Mod+K" variant="secondary" onPress={() => setOpen(true)} />
      <QuickSearch
        isOpen={open}
        onOpenChange={setOpen}
        inputValue={query}
        onInputChange={setQuery}
        onAction={fn()}
        onSearch={fn()}
        allResultsHref={(q) => `#search?q=${encodeURIComponent(q)}`}
      >
        {term ? (
          groups.map((g) => (
            <ListBoxSection key={g.id} id={g.id} title={groupLabel[g.id]}>
              {g.items.map((h) => (
                <Option key={h.id} id={h.id} icon={groupIcon[g.id]} description={h.path} textValue={h.title}>
                  {h.title}
                </Option>
              ))}
            </ListBoxSection>
          ))
        ) : (
          <>
            <ListBoxSection id="recent" title="Recent">
              {recent.map((r) => (
                <Option key={r} id={`recent-${r}`} icon={<RotateCcw />}>
                  {r}
                </Option>
              ))}
            </ListBoxSection>
            <ListBoxSection id="suggested" title="Suggested">
              <Option id="billing" icon={<Settings />} description="Settings">
                Billing settings
              </Option>
              <Option id="upload" icon={<Upload />} description="Files">
                Upload a file
              </Option>
            </ListBoxSection>
          </>
        )}
      </QuickSearch>
    </>
  );
}

export const Quick: Story = {
  name: 'Quick search',
  parameters: {
    docs: {
      description: {
        story:
          'Press Cmd / Ctrl + K or the button. Empty: recent searches and suggestions. Type „inv“: hits grouped by type (max 5 each), the match in bold. ↑ ↓ move while focus stays in the field, Enter opens, Esc closes. „All results“ opens the search page with the same term. Below 640 px it opens full screen with „Cancel“.',
      },
    },
  },
  render: () => <QuickSearchExample />,
};
