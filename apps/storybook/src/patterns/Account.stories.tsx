import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ToastRegion } from '@med-o/ui';
import { AccountApp } from './account/AccountApp';

/**
 * An account area as a complete app page: side navigation, app header, three pages with their own search and
 * filters. Only system components and the spacing rules – the code in ./account is the template.
 */
const meta = {
  title: 'Patterns/Account',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    medo: {
      subtitle: 'An app page from the components: navigation, header, settings, and lists to search and filter.',
      usage: {
        when: [
          'An area of an app with several related pages: account, administration, a customer portal.',
          'Records people look up again: orders, invoices, tickets – with search, filters and details.',
        ],
        whenNot: ['A one-off flow (checkout, sign-up): use a focused page without side navigation.', 'Marketing pages: use the site header.'],
        do: [
          'Give every task its own page in the navigation – Orders and Invoices, not tabs on one page – so it can be linked and the back button works.',
          'Use the AppHeader for the page title (the h1) and page actions; the same name as the navigation item.',
          'Put the content in a Container; sections are `section` apart, fields `fields`, cards `items`.',
          'Keep search, filters, sort and page in the URL. Show active filters as tags with “Clear all” and announce the number of results.',
          'Open a record in a Drawer: the list stays in place.',
          'Below 640 px: bottom tab bar, filters in a Bottom Sheet, table rows as cards.',
        ],
        dont: [
          'Put filters for one list in another place than above that list.',
          'Hide the result count or reset filters silently.',
          'Show an empty table without saying why and what to do.',
        ],
      },
      a11y: {
        keyboard: [
          ['Tab', 'Skip link → navigation → header → content in reading order.'],
          ['Enter', 'Opens a page from the navigation or a record from the table.'],
          ['Esc', 'Closes the Drawer or the filter sheet; the focus returns.'],
        ],
        notes: [
          'Landmarks: header, navigation and one main per page; the skip link jumps to main.',
          'After a page change the focus moves to the content, so keyboard and screen reader users start there.',
          'Exactly one h1: the page title in the AppHeader. Sections use h2.',
          'The number of results is a polite live region; removing a filter tag is announced.',
          'Loading tables set `aria-busy` and keep their header; skeleton cells have a hidden “Loading”.',
        ],
      },
    },
    docs: {
      description: {
        component:
          'Settings, Orders and Invoices as three pages of one app. Click through the side navigation, search and filter the lists, open an order. The code lives in `apps/storybook/src/patterns/account` and only uses @med-o/ui.',
      },
    },
  },
  render: () => <AccountApp level={3} />,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const withToasts = (node: React.ReactNode) => (
  <>
    {node}
    <ToastRegion />
  </>
);

export const Settings: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Sections `section` apart: Profile (a form, fields `fields` apart, saved with a toast), Notifications (switches act at once, no save button), Delete account (Alert dialog).',
      },
    },
  },
  render: () => withToasts(<AccountApp start="settings" level={3} />),
};

export const Orders: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Search, status and period in the table toolbar; active filters as tags with “Clear all”; the count above as a live region. Sort by column, open an order in a Drawer. Filter until nothing matches for the empty state.',
      },
    },
  },
  render: () => withToasts(<AccountApp start="orders" level={3} />),
};

export const Invoices: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A warning Alert names the overdue invoices and filters them with one click. Select several invoices for the Bulk action bar (Download); every row has its own download button.',
      },
    },
  },
  render: () => withToasts(<AccountApp start="invoices" level={3} />),
};

export const OnMobile: Story = {
  name: 'On mobile',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Below 640 px: app header with logo, bottom tab bar, search full width, filters in a Bottom Sheet with the result count on its button, records as cards. “Select” shows checkboxes and the bar at the bottom.',
      },
    },
  },
  render: () => withToasts(<AccountApp start="orders" mobile level={3} />),
};

export const Loading: Story = {
  name: 'State: loading',
  parameters: { docs: { description: { story: 'First load: skeleton rows in the shape of the data, header and toolbar stay. Show them only after about 300 ms.' } } },
  render: () => <AccountApp start="orders" state="loading" level={3} />,
};

export const Empty: Story = {
  name: 'State: empty',
  parameters: { docs: { description: { story: 'No data yet: an Empty state (first use) says what will appear here and offers the next step.' } } },
  render: () => <AccountApp start="orders" state="empty" level={3} />,
};

export const Failed: Story = {
  name: 'State: error',
  parameters: {
    docs: {
      description: {
        story: 'The page could not load: an Empty state (error) says what happened, that nothing is lost, and offers “Try again”. A failed part of a page uses an Alert instead.',
      },
    },
  },
  render: () => <AccountApp start="invoices" state="error" level={3} />,
};

export const InteractionTest: Story = {
  name: 'Interaction test',
  tags: ['!autodocs'],
  render: () => <AccountApp start="settings" level={3} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Navigation: Orders opens its page, the title follows.
    await userEvent.click(canvas.getByRole('link', { name: 'Orders' }));
    await expect(await canvas.findByRole('heading', { name: 'Orders' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Orders' })).toHaveAttribute('aria-current', 'page');
    // Search narrows the list and the count follows.
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search orders' }), 'zzz');
    await expect(await canvas.findByText('No orders match your filters')).toBeInTheDocument();
    // The result count is a live region (other live regions, e.g. of the table, exist too).
    const count = () => canvas.getAllByRole('status').find((el) => /orders?$/.test(el.textContent ?? ''));
    await expect(count()).toHaveTextContent('0 orders');
    // “Clear filters” in the empty state brings all orders back.
    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }));
    await waitFor(() => expect(count()).toHaveTextContent('28 orders'));
  },
};
