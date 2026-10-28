import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Key } from 'react-aria-components';
import { expect, fn } from 'storybook/test';
import { Activity, LayoutGrid, Settings, Users } from 'lucide-react';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';
import { TextField } from '../text-field/TextField';
import { interactionTest, Examples, semantic } from '../story-helpers';

const panel: React.CSSProperties = { margin: 0, font: 'var(--medo-typography-body-sm)', color: 'var(--medo-color-text-secondary)' };
const caption: React.CSSProperties = { font: 'var(--medo-typography-code-sm)', color: 'var(--medo-color-text-secondary)' };

/** Example: a project page. The Settings panel has a field – its input survives switching tabs. */
function ProjectTabs({ icons = false, count = true, ...props }: React.ComponentProps<typeof Tabs> & { icons?: boolean; count?: boolean }) {
  return (
    <Tabs {...props}>
      <TabList aria-label="Project">
        <Tab id="overview" icon={icons ? <LayoutGrid /> : undefined}>
          Overview
        </Tab>
        <Tab id="activity" icon={icons ? <Activity /> : undefined} count={count ? 3 : undefined} countLabel="3 new">
          Activity
        </Tab>
        <Tab id="members" icon={icons ? <Users /> : undefined}>
          Members
        </Tab>
        <Tab id="settings" icon={icons ? <Settings /> : undefined}>
          Settings
        </Tab>
      </TabList>
      <TabPanel id="overview">
        <p style={panel}>24 open tasks · 7 due this week · 12 members.</p>
      </TabPanel>
      <TabPanel id="activity">
        <p style={panel}>3 new comments since your last visit.</p>
      </TabPanel>
      <TabPanel id="members">
        <p style={panel}>12 members, 2 pending invites.</p>
      </TabPanel>
      <TabPanel id="settings">
        <div style={{ maxInlineSize: '20rem' }}>
          <TextField label="Project name" defaultValue="Website relaunch" description="Type something, switch tabs and come back – the input is kept." />
        </div>
      </TabPanel>
    </Tabs>
  );
}

const meta = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: { size: 'md', fullWidth: false, defaultSelectedKey: 'overview', onSelectionChange: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'lg'], description: 'Below 640 px tabs are always lg.' },
    fullWidth: { control: 'boolean' },
    disabledKeys: { control: 'check', options: ['overview', 'activity', 'members', 'settings'] },
    keyboardActivation: semantic,
    defaultSelectedKey: { control: false },
    selectedKey: { control: false },
    onSelectionChange: { control: false },
    isDisabled: { control: 'boolean' },
    children: { control: false },
  },
  parameters: {
    medo: {
      subtitle: 'Switch between views of the same context – one panel visible at a time.',
      usage: {
        when: ['2–6 views of the same context: overview, activity, settings.', 'Content that users switch between, not compare.'],
        whenNot: [
          'A view mode of the same content (list or grid): use a Toggle Button group.',
          'Other pages: use Navigation.',
          'Steps of a process: one step per view, with Back and Next.',
        ],
        do: ['Use short nouns as labels.', 'Use icons on all tabs or on none.', 'Put the selected tab into the URL (`selectedKey`).'],
        dont: ['Put tabs inside tabs.', 'Use more than 6 tabs.'],
      },
      a11y: {
        keyboard: [
          ['Tab', 'Moves to the selected tab, then into the panel.'],
          ['← / →', 'Moves to the next tab and selects it.'],
          ['Home / End', 'First or last tab.'],
        ],
        notes: [
          'tablist, tab and tabpanel; only the selected tab is in the Tab order.',
          '`keyboardActivation="manual"` for slow panels: arrows move, Enter selects.',
          'Counts are read with the tab name.',
          'Panels stay mounted, so input is never lost.',
        ],
      },
      styling: {
        classes: [
          ['medo-tabs', 'Wrapper; `--md` or `--lg`, `--full`.'],
          ['medo-tabs__list', 'Track with the tabs.'],
          ['medo-tab', 'One tab.'],
          ['medo-tab__thumb, __icon', 'Selected thumb and icon.'],
          ['medo-tabs__panel', 'Panel.'],
        ],
        states: ['data-selected', 'data-hovered', 'data-pressed', 'data-focus-visible', 'data-disabled', 'data-scroll-start', 'data-scroll-end'],
      },
    },
    docs: {
      description: {
        component:
          'Built on React Aria Tabs: tablist / tab / tabpanel, only the selected tab is in the Tab order, ← → move and select, Home / End; `keyboardActivation="manual"` for slow panels. ' +
          'Contained style: a track with a raised thumb that slides to the new tab. Label required, icons on all tabs or none, a count as neutral Badge count with a screen-reader text. ' +
          'Panels stay mounted (hidden) so input is never lost – `keepMounted={false}` unmounts heavy panels. Below 640 px tabs are lg; up to 3 fill the width, more scroll with a fade. ' +
          '2–6 tabs, short nouns, no tabs inside tabs; a view mode of the same content is a Toggle Button group, other pages are navigation. ' +
          'Styles: `medo-tabs`, `medo-tabs--{md|lg}`, `medo-tabs--full`, `medo-tabs__list`, `medo-tab`, `medo-tabs__panel`.',
      },
    },
  },
  render: (args) => <ProjectTabs {...args} />,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  parameters: { docs: { description: { story: 'md (tab 32, track 40) on desktop. lg (40 / 48) for touch – automatic below 640 px.' } } },
  render: () => (
    <Examples>
      <span style={caption}>md</span>
      <ProjectTabs size="md" />
      <span style={caption}>lg · fullWidth</span>
      <Tabs size="lg" fullWidth defaultSelectedKey="overview">
        <TabList aria-label="Project">
          <Tab id="overview">Overview</Tab>
          <Tab id="activity" count={3} countLabel="3 new">
            Activity
          </Tab>
          <Tab id="settings">Settings</Tab>
        </TabList>
        <TabPanel id="overview">
          <p style={panel}>24 open tasks · 7 due this week.</p>
        </TabPanel>
        <TabPanel id="activity">
          <p style={panel}>3 new comments.</p>
        </TabPanel>
        <TabPanel id="settings">
          <p style={panel}>Name, members and access.</p>
        </TabPanel>
      </Tabs>
    </Examples>
  ),
};

export const Content: Story = {
  name: 'Icons and counts',
  parameters: { docs: { description: { story: 'An icon helps when tabs are scanned often – then all tabs get one. The count shows items waiting in the tab.' } } },
  render: () => <ProjectTabs icons defaultSelectedKey="activity" />,
};

export const Disabled: Story = {
  parameters: { docs: { description: { story: 'A disabled tab stays visible but cannot be selected. Prefer hiding a tab the user can never use.' } } },
  render: () => <ProjectTabs defaultSelectedKey="overview" disabledKeys={['members']} />,
};

export const Overflow: Story = {
  name: 'Not enough space',
  parameters: { docs: { description: { story: 'When the track does not fit it scrolls horizontally, with a fade at the edge that still has tabs. Tabs never wrap.' } } },
  render: () => (
    <div style={{ maxInlineSize: '20rem' }}>
      <ProjectTabs defaultSelectedKey="overview" icons />
    </div>
  ),
};

export const UrlSync: Story = {
  name: 'Tab in the URL',
  parameters: {
    docs: {
      description: {
        story:
          'Keep the selected tab in the URL so reload, links and the back button work: `selectedKey={params.get("tab") ?? "overview"}` and ' +
          '`onSelectionChange={(key) => setParams({ tab: key })}` with your router. Here the URL is simulated below the tabs.',
      },
    },
  },
  render: function Render() {
    const [tab, setTab] = useState<Key>('overview');
    return (
      <div style={{ display: 'grid', gap: 'var(--medo-space-4)' }}>
        <ProjectTabs selectedKey={tab} onSelectionChange={setTab} />
        <span style={caption}>/projects/website-relaunch?tab={String(tab)}</span>
      </div>
    );
  },
};

export const InteractionTest: Story = {
  ...interactionTest,
  play: async ({ canvas, userEvent, args }) => {
    // findBy: wait until React Aria has rendered the collection.
    const overview = await canvas.findByRole('tab', { name: 'Overview' });
    await userEvent.tab();
    await expect(overview).toHaveFocus();
    // Arrow keys move and select; the panel follows.
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: /Activity/ })).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('3 new comments');
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
    await expect(args.onSelectionChange).toHaveBeenLastCalledWith('settings');
  },
};
