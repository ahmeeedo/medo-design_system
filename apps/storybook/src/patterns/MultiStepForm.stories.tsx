import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import { expect, waitFor, within } from 'storybook/test';
import { Alert, Button, ButtonGroup, Card, DescriptionItem, DescriptionList, FieldErrors, Form, Stack, Step, Stepper, TextField } from '@med-o/ui';
import { interactionTest } from '../../../../packages/ui/src/story-helpers';

/**
 * Sign-up in three steps, from the components only: Stepper, Form, Card, Description list.
 * Every step checks its fields on Continue; the last step shows the answers with Change; the server can still refuse.
 */
const meta = {
  title: 'Patterns/Multi-step form',
  // locale-de: also tested in German (Vitest project “storybook-de”).
  tags: ['autodocs', 'locale-de'],
  parameters: {
    layout: 'padded',
    medo: {
      subtitle: 'A long form split into steps: check each step, show the answers before the binding submit, then confirm.',
      usage: {
        when: [
          'A form with more than about 8 fields, or with parts that build on each other: sign-up, an application, a checkout.',
          'People need to see how much is left.',
        ],
        whenNot: ['A short form: one page (pattern Form).', 'Independent settings: one page with sections, saved on their own.'],
        do: [
          'One topic per step, 2–5 steps; name each step like its heading.',
          'Check the step on Continue and keep people there with the errors at the fields – never collect errors for the end.',
          'Keep every answer when people go back, forward or change something.',
          'End with “Check your answers”: the answers per step, each with Change. After a change, Continue leads back to the check.',
          'Name the final button with the result (“Create account”) and confirm what happens next.',
          'If the server refuses an answer, go to its step and show the message at the field.',
        ],
        dont: [
          'Disable Continue until the step is valid.',
          'Put all fields on one page with an error summary on top – split the form into steps instead.',
          'Lose the answers of a step when people use the Stepper or Back.',
        ],
      },
      a11y: {
        keyboard: [
          ['Enter', 'In a field: Continue (submits the step).'],
          ['Tab', 'Reaches the done steps in the Stepper – they lead back.'],
        ],
        notes: [
          'After Continue, Back or Change the focus moves to the heading of the new step, so screen readers start there; the heading names the step and its number.',
          'Errors: at the field, the focus on the first one, the count announced (Form).',
          'Each Change button names its step (“Change your details”), so a list of buttons is clear.',
          'The confirmation takes the focus with its heading.',
        ],
      },
    },
    docs: {
      description: {
        component:
          'Try it: Continue with empty fields; go back through the Stepper; change an answer on the check page. “taken@example.com” is already registered – the server sends you back to the first step.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Values = Record<'name' | 'email' | 'street' | 'postcode' | 'city', string>;
const EMPTY: Values = { name: '', email: '', street: '', postcode: '', city: '' };
const STEPS = ['Your details', 'Address', 'Check your answers'];

/** A fake server: “taken@example.com” is registered. */
async function createAccount(values: Values) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  if (values.email === 'taken@example.com') throw new FieldErrors({ email: 'This email address is already registered. Use another one or sign in.' });
}

function SignUp() {
  // The app keeps all answers – steps come and go, the values stay.
  const [values, setValues] = useState(EMPTY);
  const [step, setStep] = useState(0);
  // Came from “Change”: Continue leads back to the check.
  const [changing, setChanging] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  // After a step change the focus goes to the heading – except when a field with an error takes it (Form).
  useEffect(() => {
    if (moved.current && !Object.keys(serverErrors).length) heading.current?.focus();
    moved.current = false;
  }, [step, done, serverErrors]);

  const go = (next: number) => {
    moved.current = true;
    setStep(next);
  };
  const set = (field: keyof Values) => (value: string) => setValues((v) => ({ ...v, [field]: value }));
  const field = (name: keyof Values) => ({ name, value: values[name], onChange: set(name) });
  const next = () => {
    setServerErrors({});
    go(changing ? STEPS.length - 1 : step + 1);
    setChanging(false);
  };
  const change = (index: number) => {
    setChanging(true);
    go(index);
  };

  if (done) {
    return (
      <Stack gap="group" style={{ maxInlineSize: '32rem' }}>
        <h2 ref={heading} tabIndex={-1} className="medo-text-heading-md" style={{ margin: 0 }}>
          Account created
        </h2>
        <Alert tone="success" title={`We sent a confirmation link to ${values.email}.`}>
          Open it within 24 hours to activate your account.
        </Alert>
      </Stack>
    );
  }

  const actions = (label: string, pending = false) => (
    <ButtonGroup context="content">
      <Button type="submit" isPending={pending}>
        {label}
      </Button>
      {step > 0 && (
        <Button variant="secondary" onPress={() => go(step - 1)}>
          Back
        </Button>
      )}
    </ButtonGroup>
  );

  return (
    <Stack gap="group" style={{ maxInlineSize: '32rem' }}>
      <Stepper aria-label="Sign-up" current={step}>
        {STEPS.map((label, i) => (
          <Step key={label} onPress={() => go(i)}>
            {label}
          </Step>
        ))}
      </Stepper>
      <h2 ref={heading} tabIndex={-1} className="medo-text-heading-md" style={{ margin: 0 }}>
        {STEPS[step]}
        <span className="medo-visually-hidden">{`, step ${step + 1} of ${STEPS.length}`}</span>
      </h2>

      {step === 0 && (
        // A new Form per step: Continue checks only this step's fields.
        <Form key="details" className="medo-stack medo-gap-fields" validationErrors={serverErrors} onSave={next}>
          <TextField label="Name" isRequired autoComplete="name" errorMessage="Enter your name." {...field('name')} />
          <TextField
            label="Email"
            type="email"
            isRequired
            autoComplete="email"
            description="We send the confirmation link here."
            errorMessage="Enter a valid email address, e.g. name@example.com."
            {...field('email')}
          />
          {actions('Continue')}
        </Form>
      )}

      {step === 1 && (
        <Form key="address" className="medo-stack medo-gap-fields" onSave={next}>
          <TextField label="Street and number" isRequired autoComplete="street-address" errorMessage="Enter the street and number." {...field('street')} />
          <TextField
            label="Postcode"
            isRequired
            autoComplete="postal-code"
            inputMode="numeric"
            pattern="[0-9]{5}"
            errorMessage="Enter a postcode with 5 digits, e.g. 12345."
            {...field('postcode')}
          />
          <TextField label="City" isRequired autoComplete="address-level2" errorMessage="Enter the city." {...field('city')} />
          {actions('Continue')}
        </Form>
      )}

      {step === 2 && (
        <Form
          key="check"
          className="medo-stack medo-gap-fields"
          onSave={async () => {
            try {
              await createAccount(values);
              setDone(true);
              moved.current = true;
            } catch (error) {
              // The server refused an answer: to its step, the message at the field.
              if (!(error instanceof FieldErrors)) throw error;
              setServerErrors(error.fields as Record<string, string>);
              setChanging(true);
              go(0);
            }
          }}
        >
          {({ isPending }) => (
            <>
              <Card
                title="Your details"
                density="compact"
                headerActions={
                  <Button variant="ghost" size="sm" aria-label="Change your details" onPress={() => change(0)}>
                    Change
                  </Button>
                }
              >
                <DescriptionList>
                  <DescriptionItem term="Name">{values.name}</DescriptionItem>
                  <DescriptionItem term="Email">{values.email}</DescriptionItem>
                </DescriptionList>
              </Card>
              <Card
                title="Address"
                density="compact"
                headerActions={
                  <Button variant="ghost" size="sm" aria-label="Change address" onPress={() => change(1)}>
                    Change
                  </Button>
                }
              >
                <DescriptionList>
                  <DescriptionItem term="Address">
                    {values.street}, {values.postcode} {values.city}
                  </DescriptionItem>
                </DescriptionList>
              </Card>
              {actions('Create account', isPending)}
            </>
          )}
        </Form>
      )}
    </Stack>
  );
}

export const SignUpFlow: Story = {
  name: 'Sign-up',
  render: () => <SignUp />,
};

export const InteractionTest: Story = {
  ...interactionTest,
  // Checks the English texts word for word – the German run covers the other story.
  tags: ['!autodocs', '!locale-de'],
  render: () => <SignUp />,
  parameters: {
    // React Aria announces the end of a pending state with a node that points to the button; the confirmation
    // replaced it meanwhile (see the Form test).
    a11y: { config: { rules: [{ id: 'role-img-alt', enabled: false }] } },
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const heading = () => canvas.getByRole('heading', { level: 2 });
    const box = (name: RegExp) => canvas.getByRole('textbox', { name });
    const press = (name: string) => userEvent.click(canvas.getByRole('button', { name }));

    // 1. Continue with empty fields: the errors in this step, the focus on the first field.
    await press('Continue');
    await waitFor(() => expect(box(/Name/)).toHaveFocus());
    await expect(canvas.getByText('Enter your name.')).toBeInTheDocument();
    await expect(heading()).toHaveTextContent('Your details');

    // 2. Filled in: the next step, the focus on its heading.
    await userEvent.type(box(/Name/), 'Anna Müller');
    await userEvent.type(box(/Email/), 'taken@example.com');
    await press('Continue');
    await waitFor(() => expect(heading()).toHaveFocus());
    await expect(heading()).toHaveTextContent('Address, step 2 of 3');

    // 3. Back through the Stepper and forward: the answers stay.
    await userEvent.click(within(canvas.getByRole('navigation', { name: 'Sign-up' })).getByRole('link', { name: /Your details/ }));
    await waitFor(() => expect(heading()).toHaveFocus());
    await expect(box(/Email/)).toHaveValue('taken@example.com');
    await press('Continue');
    await userEvent.type(box(/Street/), 'Musterstraße 1');
    await userEvent.type(box(/Postcode/), '1234');
    await userEvent.type(box(/City/), 'Musterstadt');
    await press('Continue');
    await waitFor(() => expect(box(/Postcode/)).toHaveFocus());
    await expect(canvas.getByText('Enter a postcode with 5 digits, e.g. 12345.')).toBeInTheDocument();
    await userEvent.type(box(/Postcode/), '5');
    await press('Continue');

    // 4. Check: the answers per step; Change leads to the step and Continue back to the check.
    await waitFor(() => expect(heading()).toHaveTextContent('Check your answers'));
    await expect(canvas.getByText('Musterstraße 1, 12345 Musterstadt')).toBeInTheDocument();
    await press('Change address');
    await waitFor(() => expect(heading()).toHaveTextContent('Address'));
    await userEvent.clear(box(/City/));
    await userEvent.type(box(/City/), 'Beispielstadt');
    await press('Continue');
    await waitFor(() => expect(heading()).toHaveTextContent('Check your answers'));
    await expect(canvas.getByText('Musterstraße 1, 12345 Beispielstadt')).toBeInTheDocument();

    // 5. The server refuses the email: back in step 1, the message at the field, the focus there.
    await press('Create account');
    await expect(await canvas.findByText('This email address is already registered. Use another one or sign in.')).toBeInTheDocument();
    await waitFor(() => expect(box(/Email/)).toHaveFocus());
    await expect(heading()).toHaveTextContent('Your details');
    await userEvent.clear(box(/Email/));
    await userEvent.type(box(/Email/), 'anna@example.com');
    await press('Continue');

    // 6. After the correction straight back to the check, then created: the confirmation takes the focus.
    await waitFor(() => expect(heading()).toHaveTextContent('Check your answers'));
    await press('Create account');
    await waitFor(() => expect(canvas.getByRole('heading', { name: 'Account created' })).toHaveFocus());
    await expect(canvas.getByText('We sent a confirmation link to anna@example.com.')).toBeInTheDocument();
  },
};
