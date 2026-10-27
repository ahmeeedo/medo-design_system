import { useState } from 'react';
import { RouterProvider } from 'react-aria-components';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Bell, Calendar, FolderClosed, House, LayoutDashboard, ListChecks, MessageSquare, Settings, Users } from 'lucide-react';
import { AppHeader, BottomTabBar, NavGroup, NavItem, NavList, NavSection, SideNav, SiteHeader, SkipLink, TabBarItem, TabBarMore, type NavAction } from './Navigation';
import { Avatar } from '../avatar/Avatar';
import { IconButton } from '../icon-button/IconButton';
import { TextField } from '../text-field/TextField';
import { interactionTest, Examples, slot } from '../story-helpers';

/* ---------- Story placeholders ---------- */

const mark: React.CSSProperties = {
  display: 'inline-grid',
  placeItems: 'center',
  inlineSize: 32,
  blockSize: 32,
  borderRadius: 'var(--medo-radius-md)',
  background: 'var(--medo-color-action-primary)',
  color: 'var(--medo-color-text-on-brand)',
  font: 'var(--medo-typography-heading-sm)',
};

function Logo({ full = true }: { full?: boolean }) {
  return (
    <a
      href="#home"
      aria-label="med.o home"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--medo-space-2)',
        color: 'var(--medo-color-text-primary)',
        textDecoration: 'none',
        font: 'var(--medo-typography-heading-sm)',
      }}
    >
      {/* A sample mark without letters, so the link's name contains all visible text (WCAG 2.5.3). */}
      <span style={mark} aria-hidden="true" />
      {full && <span aria-hidden="true">med.o</span>}
    </a>
  );
}

const content: React.CSSProperties = { padding: 'var(--medo-space-6)', display: 'grid', gap: 'var(--medo-space-4)' };
const block: React.CSSProperties = {
  blockSize: 96,
  border: 'var(--medo-border-width-thin) solid var(--medo-color-border-default)',
  borderRadius: 'var(--medo-radius-lg)',
  background: 'var(--medo-color-surface-raised)',
};
const caption: React.CSSProperties = { font: 'var(--medo-typography-code-sm)', color: 'var(--medo-color-text-secondary)' };

/* ---------- Website ---------- */

const siteActions: NavAction[] = [
  { label: 'Log in', href: '#login', variant: 'ghost' },
  { label: 'Get started', href: '#signup', variant: 'primary' },
];

function SiteLinks() {
  return (
    <>
      <NavGroup label="Products">
        <NavItem href="#analytics" icon={<LayoutDashboard />}>
          Analytics
        </NavItem>
        <NavItem href="#projects" icon={<FolderClosed />}>
          Projects
        </NavItem>
        <NavItem href="#tasks" icon={<ListChecks />}>
          Tasks
        </NavItem>
        <NavItem href="#inbox" icon={<MessageSquare />}>
          Team inbox
        </NavItem>
      </NavGroup>
      <NavItem href="#solutions">Solutions</NavItem>
      <NavItem href="#pricing" isCurrent>
        Pricing
      </NavItem>
      <NavItem href="#docs">Docs</NavItem>
    </>
  );
}

/* ---------- App ---------- */

function AppItems({ current = 'dashboard' }: { current?: string }) {
  return (
    <>
      <NavItem href="#dashboard" icon={<LayoutDashboard />} isCurrent={current === 'dashboard'}>
        Dashboard
      </NavItem>
      <NavItem href="#projects" icon={<FolderClosed />} count={12} countLabel="12 projects" isCurrent={current === 'projects'}>
        Projects
      </NavItem>
      <NavItem href="#tasks" icon={<ListChecks />} isCurrent={current === 'tasks'}>
        Tasks
      </NavItem>
      <NavItem href="#calendar" icon={<Calendar />} isCurrent={current === 'calendar'}>
        Calendar
      </NavItem>
      <NavItem href="#inbox" icon={<MessageSquare />} count={3} countLabel="3 unread" unread isCurrent={current === 'inbox'}>
        Inbox
      </NavItem>
      <NavSection title="Workspace">
        <NavItem href="#members" icon={<Users />} isCurrent={current === 'members'}>
          Members
        </NavItem>
        <NavGroup label="Settings" icon={<Settings />}>
          <NavItem href="#general" isCurrent={current === 'general'}>
            General
          </NavItem>
          <NavItem href="#billing" isCurrent={current === 'billing'}>
            Billing
          </NavItem>
        </NavGroup>
      </NavSection>
    </>
  );
}

function HeaderActions() {
  return (
    <>
      <IconButton variant="ghost" icon={<Bell />} aria-label="Notifications" />
      <Avatar name="Ahmet D." size="md" />
    </>
  );
}

const meta = {
  title: 'Components/Navigation/Navigation',
  component: SiteHeader,
  tags: ['autodocs'],
  args: { layout: 'desktop', actions: 'Log in + Get started' as never, logo: null, children: null },
  argTypes: {
    layout: { control: 'inline-radio', options: ['auto', 'desktop', 'mobile'], description: 'auto: menu button below 768 px.' },
    actions: slot({ none: [], 'Log in + Get started': siteActions }),
    logo: { control: false },
    children: { control: false },
    'aria-label': { control: false, table: { category: 'Semantics (no visual change)' } },
    menuLabel: { control: false, table: { category: 'Semantics (no visual change)' } },
    closeLabel: { control: false, table: { category: 'Semantics (no visual change)' } },
  },
  parameters: {
    layout: 'fullscreen',
    medo: {
      subtitle: 'How people move between pages: header for websites and apps, side navigation for apps, tab bar and menus on mobile.',
    },
    docs: {
      description: {
        component:
          'Navigation is always made of links (React Aria Link, works with any router via RouterProvider) in a named `<nav>`; the current page has `aria-current="page"` and looks the same everywhere: action/selected + strong label. ' +
          '`SkipLink` is the first focusable element. `SiteHeader` (websites): logo, max 5 links, max 2 actions; `NavGroup` opens a dropdown – a disclosure, never a menu; below 768 px a menu button opens the links fullscreen with the actions at the bottom. ' +
          '`SideNav` (apps): 256 px with icons, counts, `NavSection` and `NavGroup` (one level), collapses to a 64 px rail with tooltips; 640–1023 px always a rail that expands as overlay; hidden below 640 px. ' +
          '`AppHeader`: page title, search, actions. `BottomTabBar` (apps < 640 px): 3–5 `TabBarItem`s, `TabBarMore` opens the rest in the Nav sheet. ' +
          'Styles: `medo-nav-item--{header|sidebar|rail|sheet}`, `medo-site-header`, `medo-sidenav`, `medo-app-header`, `medo-tab-bar`, `medo-skip-link`.',
      },
    },
  },
  render: (args) => (
    <div style={{ minBlockSize: 320 }}>
      <SkipLink href="#main" />
      <SiteHeader {...args} logo={<Logo />}>
        <SiteLinks />
      </SiteHeader>
      <main id="main" tabIndex={-1} style={content}>
        <div style={block} />
      </main>
    </div>
  ),
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: 'Playground',
  parameters: {
    docs: {
      description: {
        story:
          'Press Tab first: “Skip to content” appears. “Products” opens a dropdown of links (Tab moves through, Esc closes). With layout mobile the menu button opens the links fullscreen.',
      },
    },
  },
};

export const NavItems: Story = {
  name: 'Nav item forms',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'One item for every navigation. The container decides the form: header 36, sidebar 36, rail 40 × 40 (label as tooltip; unread counts as dot, totals hidden), sheet 48.',
      },
    },
  },
  render: () => (
    <Examples>
      {(['header', 'sidebar', 'rail', 'sheet'] as const).map((variant) => (
        <div key={variant} style={{ display: 'grid', gap: 'var(--medo-space-2)', maxInlineSize: variant === 'header' ? undefined : variant === 'rail' ? 64 : 256 }}>
          <span style={caption}>{variant}</span>
          <NavList variant={variant} aria-label={`Example ${variant}`}>
            <NavItem href="#a" icon={<LayoutDashboard />} isCurrent>
              Dashboard
            </NavItem>
            <NavItem href="#b" icon={<FolderClosed />} count={12} countLabel="12 projects">
              Projects
            </NavItem>
            <NavItem href="#c" icon={<ListChecks />}>
              Tasks
            </NavItem>
            <NavItem href="#d" icon={<MessageSquare />} count={3} countLabel="3 unread" unread>
              Inbox
            </NavItem>
          </NavList>
        </div>
      ))}
    </Examples>
  ),
};

export const AppShell: Story = {
  name: 'Side navigation',
  parameters: {
    docs: {
      description: {
        story:
          'Side navigation with sections, counts and a group (Settings, one level). The button at the top collapses it to the 64 px rail: labels as tooltips, unread counts (`unread`) as dot, totals hidden, a group expands the sidebar. ' +
          'Remember the state per user with `onCollapsedChange`. Between 640 and 1023 px it is always a rail and expands as an overlay.',
      },
    },
  },
  render: function Render() {
    const [current, setCurrent] = useState('dashboard');
    return (
      // RouterProvider: links navigate client-side with any router – here it only changes the current page.
      <RouterProvider navigate={(href) => href.startsWith('#') && href !== '#home' && setCurrent(href.slice(1))}>
        <div style={{ display: 'flex', blockSize: 600, background: 'var(--medo-color-surface-subtle)' }}>
          <SideNav logo={<Logo />} logoMark={<Logo full={false} />} user={{ name: 'Ahmet D.', email: 'ahmet@med-o.de' }}>
            <AppItems current={current} />
          </SideNav>
          <div style={{ flex: 1, minInlineSize: 0, overflow: 'auto' }}>
            <AppHeader
              title={current.charAt(0).toUpperCase() + current.slice(1)}
              logo={<Logo full={false} />}
              search={<TextField label={<span className="medo-visually-hidden">Search</span>} type="search" placeholder="Search…" size="sm" />}
              actions={<HeaderActions />}
            />
            <div style={content}>
              <div style={block} />
              <div style={{ ...block, blockSize: 240 }} />
            </div>
          </div>
        </div>
      </RouterProvider>
    );
  },
};

export const TabBar: Story = {
  name: 'Bottom tab bar',
  parameters: {
    docs: {
      description: {
        story:
          'On phones the main destinations sit at the bottom: max 4 + “More”, labels always visible. “More” opens the rest in the Nav sheet. Shown here with `display="always"` inside a phone frame.',
      },
    },
  },
  render: () => (
    <div style={{ padding: 'var(--medo-space-6)' }}>
      {/* transform: the fixed tab bar is positioned inside the phone frame. */}
      <div
        style={{
          position: 'relative',
          transform: 'translateZ(0)',
          inlineSize: 375,
          blockSize: 640,
          overflow: 'hidden',
          border: 'var(--medo-border-width-thin) solid var(--medo-color-border-default)',
          borderRadius: 'var(--medo-radius-xl)',
          background: 'var(--medo-color-surface-subtle)',
        }}
      >
        <AppHeader title="Dashboard" logo={<Logo full={false} />} actions={<HeaderActions />} />
        <div style={content}>
          <div style={block} />
          <div style={block} />
        </div>
        <BottomTabBar display="always">
          <TabBarItem href="#home" icon={<House />} isCurrent>
            Home
          </TabBarItem>
          <TabBarItem href="#projects" icon={<FolderClosed />}>
            Projects
          </TabBarItem>
          <TabBarItem href="#tasks" icon={<ListChecks />}>
            Tasks
          </TabBarItem>
          <TabBarItem href="#inbox" icon={<MessageSquare />} dot dotLabel="3 unread">
            Inbox
          </TabBarItem>
          <TabBarMore>
            <NavItem href="#calendar" icon={<Calendar />}>
              Calendar
            </NavItem>
            <NavItem href="#members" icon={<Users />}>
              Members
            </NavItem>
            <NavItem href="#settings" icon={<Settings />}>
              Settings
            </NavItem>
          </TabBarMore>
        </BottomTabBar>
      </div>
    </div>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  args: { layout: 'mobile' },
  play: async ({ canvas, userEvent }) => {
    const menu = canvas.getByRole('button', { name: 'Menu' });
    await userEvent.click(menu);
    const dialog = await within(document.body).findByRole('dialog');
    await expect(within(dialog).getAllByRole('link').length).toBeGreaterThan(0);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).toBeNull());
    await expect(menu).toHaveFocus();
  },
};
