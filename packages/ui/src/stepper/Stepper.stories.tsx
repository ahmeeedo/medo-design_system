import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, within } from 'storybook/test';
import { Step, Stepper, type StepperProps } from './Stepper';
import { Button, ButtonGroup } from '../button/Button';
import { interactionTest, Examples, semantic } from '../story-helpers';

const steps = [
  { label: 'Cart', description: '3 items' },
  { label: 'Address', description: 'Where we deliver' },
  { label: 'Payment', description: 'Card or invoice' },
  { label: 'Check', description: 'Before you order' },
];

/** Stepper props for the props table, plus two example controls (the steps come from the story). */
type Args = Omit<StepperProps, 'children'> & { descriptions: boolean; onStepPress: (index: number) => void };

const meta = {
  title: 'Components/Navigation/Stepper',
  // The props table documents Stepper; the steps themselves are written in the story.
  component: Stepper as unknown as React.ComponentType<Args>,
  subcomponents: { Step: Step as React.ComponentType<unknown> },
  tags: ['autodocs', 'status:experimental'],
  args: { current: 1, layout: 'horizontal', descriptions: false, onStepPress: fn() },
  argTypes: {
    current: { control: { type: 'range', min: 0, max: 3, step: 1 }, description: 'Index of the current step, from 0. Steps before it are done.' },
    layout: { control: 'inline-radio', options: ['auto', 'horizontal', 'compact'], description: 'auto: compact below 640 px.' },
    descriptions: { control: 'boolean', description: 'Example only: a second line under each step (`description` on Step).' },
    onStepPress: { table: { disable: true } },
    'aria-label': semantic,
  },
  render: ({ current, layout, descriptions, onStepPress }: Args) => (
    <Stepper aria-label="Checkout" current={current} layout={layout}>
      {steps.map((s, i) => (
        <Step key={s.label} description={descriptions ? s.description : undefined} onPress={() => onStepPress(i)}>
          {s.label}
        </Step>
      ))}
    </Stepper>
  ),
  parameters: {
    medo: {
      figma: '557:30',
      subtitle: 'Shows where someone is in a task of several steps and leads back to the steps already done.',
      usage: {
        when: ['A task in 3–5 steps that build on each other: checkout, sign-up, an application.', 'People should see how much is left.'],
        whenNot: ['Independent pages or views: use Tabs.', 'More than about 5 steps: shorten or split the task.', 'Two steps: a heading “Step 1 of 2” is enough.'],
        do: [
          'Name each step like the heading of that step, in one or two words.',
          'Check a step when Next is pressed; show errors at the fields and keep the person in that step.',
          'Let people go back to done steps without losing what they entered.',
          'End with a step to check the answers before the binding submit.',
        ],
        dont: ['Let people skip ahead to steps they have not reached.', 'Use the Stepper as the only way forward – every step needs Back and Next buttons.'],
      },
      a11y: {
        keyboard: [
          ['Tab', 'Moves to the done steps (links); the current and upcoming steps are not focusable.'],
          ['Enter', 'Goes back to that step.'],
        ],
        notes: [
          'A navigation region (name it after the task, e.g. “Checkout”) with an ordered list – screen readers say “list, 4 items”.',
          'The current step has `aria-current="step"`; done steps say “completed”.',
          'Below 640 px one sentence is read: “Step 2 of 4: Address”. The bar segments are hidden from screen readers.',
          'Move the focus to the heading of the new step after Next or Back, so screen readers start there.',
        ],
      },
      styling: {
        classes: [
          ['medo-stepper', 'Navigation; `--compact` below 640 px.'],
          ['medo-stepper__list, __item', 'Ordered list; the item carries `data-state`.'],
          ['medo-stepper__step', 'Link (done) or text (current, upcoming).'],
          ['medo-stepper__marker, __label, __description', 'Number or check, name, second line.'],
          ['medo-stepper__connector', 'Line to the next step.'],
          ['medo-stepper__counter, __title, __segments, __segment', 'Compact: “Step 2 of 4”, current step, one bar segment per step.'],
        ],
        states: ['data-state="complete | current | upcoming"', 'data-hovered', 'data-pressed', 'data-focus-visible'],
      },
    },
    docs: {
      description: {
        component:
          'Use a stepper for a task in a few steps that build on each other. Done steps are links back; the current step is marked; upcoming steps cannot be reached yet. Below 640 px it shows “Step 2 of 4” and one bar segment per step.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  parameters: { docs: { description: { story: 'The beginning, the middle and the last step. Done steps show a check and are links.' } } },
  render: () => (
    <Examples>
      {[0, 2, 3].map((current) => (
        <Stepper key={current} aria-label="Checkout" current={current}>
          {steps.map((s) => (
            <Step key={s.label} href={`#${s.label.toLowerCase()}`}>
              {s.label}
            </Step>
          ))}
        </Stepper>
      ))}
    </Examples>
  ),
};

export const WithDescriptions: Story = {
  name: 'With descriptions',
  args: { descriptions: true },
  parameters: { docs: { description: { story: 'An optional second line says what each step is about. Keep it short – it shares the width with the other steps.' } } },
};

export const Compact: Story = {
  name: 'Compact (mobile)',
  args: { layout: 'compact', descriptions: true },
  parameters: {
    width: 'var(--medo-size-width-xl)',
    docs: { description: { story: 'Below 640 px (`layout="auto"`): the step count, the current step and one bar segment per step.' } },
  },
};

/** A small task in three steps, to show Next, Back and the links back. */
function Flow() {
  const [current, setCurrent] = useState(0);
  const names = ['Account', 'Address', 'Check'];
  return (
    <div style={{ display: 'grid', gap: 'var(--medo-layout-gap-group)' }}>
      <Stepper aria-label="Sign-up" current={current}>
        {names.map((n, i) => (
          <Step key={n} onPress={() => setCurrent(i)}>
            {n}
          </Step>
        ))}
      </Stepper>
      <h3 style={{ margin: 0, font: 'var(--medo-typography-heading-md)' }}>{names[current]}</h3>
      <ButtonGroup context="content">
        <Button onPress={() => setCurrent((c) => Math.min(c + 1, names.length - 1))} isDisabled={current === names.length - 1}>
          Next
        </Button>
        <Button variant="secondary" onPress={() => setCurrent((c) => Math.max(c - 1, 0))} isDisabled={current === 0}>
          Back
        </Button>
      </ButtonGroup>
    </div>
  );
}

export const InteractionTest: Story = {
  ...interactionTest,
  // Literal, so the story index (and the tag filters of the test projects) see it too.
  tags: ['!autodocs'],
  render: () => <Flow />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Sign-up' });
    // Start: the first step is current, nothing is a link yet – no skipping ahead.
    await expect(within(nav).queryAllByRole('link')).toHaveLength(0);
    await expect(within(nav).getByText('Account').closest('[aria-current="step"]')).not.toBeNull();
    // Next twice: the two steps before are done and become links.
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    const links = within(nav).getAllByRole('link');
    await expect(links).toHaveLength(2);
    await expect(links[0]).toHaveAccessibleName(/^Account ?, completed$/);
    // A done step leads back.
    await userEvent.click(links[1]);
    await expect(within(nav).getByText('Address').closest('[aria-current="step"]')).not.toBeNull();
    await expect(canvas.getByRole('heading', { name: 'Address' })).toBeInTheDocument();
  },
};
