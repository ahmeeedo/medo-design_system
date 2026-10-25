import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Bell, CreditCard, Lock, User } from 'lucide-react';
import { Accordion, AccordionItem } from './Accordion';
import { Badge } from '../badge/Badge';
import { Link } from '../link/Link';
import { Switch } from '../switch/Switch';
import { LightDark, semantic } from '../story-helpers';

const text: React.CSSProperties = { margin: 0, font: 'inherit', color: 'var(--medo-color-text-secondary)' };
const stack: React.CSSProperties = { display: 'grid', gap: 'var(--medo-space-4)' };

const answer = 'Answers stay short: two to four sentences. Link to a detail page instead of nesting another accordion.';
const faq = [
  { id: 'free', q: 'What does the free plan include?' },
  { id: 'cancel', q: 'Can I cancel at any time?' },
  { id: 'data', q: 'Where is my data stored?' },
  { id: 'nonprofit', q: 'Do you offer discounts for non-profits?' },
];

function Settings({ size = 'md' as 'md' | 'lg', single = false }) {
  return (
    <Accordion size={size} allowsMultipleExpanded={!single} defaultExpandedKeys={['notifications']} onExpandedChange={fn()}>
      <AccordionItem id="profile" icon={<User />} title="Profile" description="Name, photo and language">
        <p style={text}>Your name and photo are visible to your team.</p>
      </AccordionItem>
      <AccordionItem id="notifications" icon={<Bell />} title="Notifications" description="Email and push">
        <div style={stack}>
          <Switch labelPosition="start" description="Weekly summary and mentions" defaultSelected>
            Email notifications
          </Switch>
          <Switch labelPosition="start" description="Instant alerts on this device">
            Push notifications
          </Switch>
        </div>
      </AccordionItem>
      <AccordionItem
        id="billing"
        icon={<CreditCard />}
        title="Billing"
        description="Plan, invoices and payment method"
        badge={
          <Badge tone="danger" size="sm">
            Payment failed
          </Badge>
        }
      >
        <p style={text}>The last payment could not be collected. Update your payment method to keep your plan.</p>
      </AccordionItem>
      <AccordionItem id="security" icon={<Lock />} title="Security" description="Password and two-factor authentication">
        <p style={text}>Two-factor authentication is on.</p>
      </AccordionItem>
    </Accordion>
  );
}

function Faq({ size = 'lg' as 'md' | 'lg', count = 4 }) {
  const items = Array.from({ length: count }, (_, i) => faq[i % faq.length]).map((f, i) => ({ ...f, id: `${f.id}-${i}` }));
  return (
    <Accordion size={size} defaultExpandedKeys={[items[0].id]}>
      {items.map((f) => (
        <AccordionItem key={f.id} id={f.id} title={f.q}>
          <p style={text}>{answer}</p>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: { size: 'md', allowsMultipleExpanded: true, children: null },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'lg'], description: 'md: apps and settings · lg: websites and FAQs.' },
    allowsMultipleExpanded: { ...semantic, description: 'Several open at once (default). false: one at a time – see the story „One at a time“.' },
    headingLevel: semantic,
    expandAll: { control: false, description: 'Shown above groups with more than 6 sections.' },
    expandAllLabel: semantic,
    collapseAllLabel: semantic,
    children: { control: false },
  },
  parameters: {
    medo: { code: 'C31', subtitle: 'Sections that open and close in place – settings groups in apps, FAQs on websites.', figma: '288:26' },
    docs: {
      description: {
        component:
          'React Aria DisclosureGroup. One contained group (surface/default, border, radius/lg), dividers between items. Each header is a button inside a real heading (`headingLevel`, h2–h4), announced as expanded or collapsed; the whole header is the target. ' +
          '`AccordionItem`: optional icon, title, description (read as description), badge (part of the name), chevron. Several sections open by default; nothing the user opened closes by itself. ' +
          'Closed panels stay findable by the browser search (hidden="until-found"). A link to an item’s `id` (#billing) opens and scrolls to it. More than 6 sections: „Expand all“. Styles: `medo-accordion`, `medo-accordion--{md|lg}`.',
      },
    },
  },
  render: (args) => (
    <div style={{ maxInlineSize: '35rem' }}>
      <Settings size={args.size} single={!args.allowsMultipleExpanded} />
    </div>
  ),
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  name: 'md settings · lg FAQ',
  parameters: { docs: { description: { story: 'md for apps and settings (icon, description, badge), lg for websites and FAQs (questions as titles).' } } },
  render: () => (
    <LightDark>
      <Settings />
      <Faq />
    </LightDark>
  ),
};

export const Single: Story = {
  name: 'One at a time',
  parameters: {
    docs: {
      description: {
        story:
          '`allowsMultipleExpanded={false}`: opening a section closes the other. Only for short, mutually exclusive steps – never for content users want to compare.',
      },
    },
  },
  render: () => (
    <div style={{ maxInlineSize: '35rem' }}>
      <Settings single />
    </div>
  ),
};

export const Disabled: Story = {
  parameters: { docs: { description: { story: 'A disabled section shows at 50 % and can’t be opened. Hover and pressed only colour the header.' } } },
  render: () => (
    <div style={{ maxInlineSize: '35rem' }}>
      <Accordion>
        <AccordionItem id="team" icon={<User />} title="Team" description="Members and roles">
          <p style={text}>Invite people and set their roles.</p>
        </AccordionItem>
        <AccordionItem id="sso" icon={<Lock />} title="Single sign-on" description="Available on the Enterprise plan" isDisabled>
          <p style={text}>Not available.</p>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const ExpandAll: Story = {
  name: 'More than 6 sections',
  parameters: { docs: { description: { story: 'Groups with more than 6 sections get „Expand all“ / „Collapse all“ above them (only when several may be open).' } } },
  render: () => (
    <div style={{ maxInlineSize: '45rem' }}>
      <Faq count={8} />
    </div>
  ),
};

export const DeepLink: Story = {
  name: 'Deep link',
  parameters: { docs: { description: { story: 'A link to an item’s id opens it and scrolls to it – on load and on every hash change. Try the link below.' } } },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--medo-space-4)', maxInlineSize: '35rem' }}>
      <p style={{ margin: 0 }}>
        Something wrong with a payment? <Link href="#billing">Open billing</Link>
      </p>
      <Settings />
    </div>
  ),
};
