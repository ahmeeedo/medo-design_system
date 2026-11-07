import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { FieldErrors, Form, type FormProps } from './Form';
import { Alert } from '../alert/Alert';
import { Button } from '../button/Button';
import { TextField } from '../text-field/TextField';
import { interactionTest } from '../story-helpers';

/**
 * A fake server: “taken@example.com” is registered, “Offline” as name loses the connection, invite code “OLD” has
 * expired (an error of the whole form). Everything else works after 300 ms.
 */
async function signUp(data: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (data.get('name') === 'Offline') throw new Error('Network');
  if (data.get('code') === 'OLD') throw new FieldErrors({}, 'This invite has expired. Ask the person who invited you for a new one.');
  if (data.get('email') === 'taken@example.com') throw new FieldErrors({ email: 'This email address is already registered. Sign in instead.' });
}

function SignUp() {
  const [done, setDone] = useState(false);
  if (done)
    return (
      <Alert tone="success" title="Account created" announce>
        We sent a confirmation link to your email address.
      </Alert>
    );
  return (
    <Form
      className="medo-stack medo-gap-fields"
      style={{ maxInlineSize: 'var(--medo-size-width-2xl)' }}
      onSave={async (data) => {
        await signUp(data);
        setDone(true);
      }}
    >
      {({ isPending }) => (
        <>
          <TextField label="Name" name="name" isRequired autoComplete="name" errorMessage="Enter your name." />
          <TextField label="Email" name="email" type="email" isRequired autoComplete="email" errorMessage="Enter a valid email address, e.g. name@example.com." />
          <TextField label="Invite code" name="code" description="From your invitation email." />
          <div>
            <Button type="submit" isPending={isPending}>
              Create account
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}

const meta = {
  title: 'Components/Forms/Form',
  // The props table documents Form; the fields are written in the story.
  component: Form as React.ComponentType<Partial<FormProps>>,
  // locale-de: also tested in German (Vitest project “storybook-de”).
  tags: ['autodocs', 'locale-de', 'status:experimental'],
  parameters: {
    medo: {
      subtitle: 'React Aria Form with the error rules: errors at the field, the whole form’s errors above it, the input always kept.',
      usage: {
        when: ['Every form that is submitted: sign-up, settings, a step of a checkout.'],
        whenNot: ['Filters and settings that apply at once: no form, no submit button.'],
        do: [
          'Save in `onSave`: it runs only when every field is valid and keeps the form pending while it saves.',
          'Reject with `FieldErrors` when the server finds a problem in a field (“already registered”) – the message shows at the field.',
          'Messages from a server action (Next.js, React Router): pass them as `validationErrors` – shown and announced the same way.',
          'Use `formError` (or `FieldErrors` with a second argument) only for problems that belong to no field: an expired offer, a declined payment.',
          'Say what to do in every message: “Sign in instead”, “Ask for a new one”.',
        ],
        dont: [
          'Collect the errors in a summary above the form – show them at the fields; split long forms into steps instead.',
          'Clear the input after an error.',
          'Disable the submit button until the form is valid.',
        ],
      },
      a11y: {
        keyboard: [['Enter', 'In a single-line field: submits the form.']],
        notes: [
          'On submit with errors the focus goes to the first invalid field; its message is read with it.',
          'Screen readers also hear how many fields need attention (“2 fields need attention”) – a polite announcement, nothing visible.',
          'An error of the whole form takes the focus, so it is read first.',
          'A server message disappears once its field was changed and left.',
        ],
      },
      styling: {
        classes: [
          ['medo-form', 'The form; no layout of its own – space the fields with `medo-gap-fields`.'],
          ['medo-form__error', 'Holds the Alert for an error of the whole form.'],
        ],
        states: ['data-pending'],
      },
    },
    docs: {
      description: {
        component:
          'Use `Form` for every form that is submitted. Errors appear at the field, also those the server finds; problems of the whole form appear above it. Built on React Aria Form. Try it: “taken@example.com” is registered, “Offline” as name fails to save, invite code “OLD” has expired.',
      },
    },
  },
  render: () => <SignUp />,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ServerErrors: Story = {
  name: 'Errors from the server',
};

export const InteractionTest: Story = {
  ...interactionTest,
  // Checks the English messages word for word – the German run covers the other story.
  tags: ['!autodocs', '!locale-de'],
  parameters: {
    // React Aria announces the end of a pending state with a node that points to the button by aria-labelledby. The
    // confirmation replaced the form meanwhile, so the node points nowhere for a few seconds – an artefact of the
    // announcer outside the component (as in the Dialog test).
    a11y: { config: { rules: [{ id: 'role-img-alt', enabled: false }] } },
  },
  play: async ({ canvas, userEvent }) => {
    const name = canvas.getByRole('textbox', { name: /Name/ });
    const email = canvas.getByRole('textbox', { name: /Email/ });
    const send = () => userEvent.click(canvas.getByRole('button', { name: 'Create account' }));
    const announcement = () => canvasElement().querySelector('[aria-live="polite"]')?.textContent ?? '';
    const canvasElement = () => name.closest('form')!;

    // 1. Empty: errors at the fields, focus on the first, screen readers hear the count.
    await send();
    await waitFor(() => expect(name).toHaveFocus());
    await expect(canvas.getByText('Enter your name.')).toBeInTheDocument();
    await waitFor(() => expect(announcement()).toMatch(/^2 fields need attention/));

    // 2. The server knows the email: its message at the field, the focus there, the input kept.
    await userEvent.type(name, 'Anna Müller');
    await userEvent.type(email, 'taken@example.com');
    await send();
    await expect(await canvas.findByText('This email address is already registered. Sign in instead.')).toBeInTheDocument();
    await waitFor(() => expect(email).toHaveFocus());
    await expect(name).toHaveValue('Anna Müller');
    await waitFor(() => expect(announcement()).toMatch(/^1 field needs attention/));
    // Changing the field and leaving it removes the server message.
    await userEvent.clear(email);
    await userEvent.type(email, 'anna@example.com');
    await userEvent.tab();
    await waitFor(() => expect(canvas.queryByText('This email address is already registered. Sign in instead.')).toBeNull());

    // 3. An error of the whole form: an Alert above the fields, focused.
    await userEvent.type(canvas.getByRole('textbox', { name: /Invite code/ }), 'OLD');
    await send();
    const expired = await canvas.findByText('This invite has expired. Ask the person who invited you for a new one.');
    await waitFor(() => expect(expired.closest('.medo-form__error')).toHaveFocus());

    // 4. Saving fails (network): “could not save” above the fields, the input stays.
    await userEvent.clear(canvas.getByRole('textbox', { name: /Invite code/ }));
    await userEvent.clear(name);
    await userEvent.type(name, 'Offline');
    await send();
    const failed = await canvas.findByText('Could not save. Your input is kept – try again.');
    await waitFor(() => expect(failed.closest('.medo-form__error')).toHaveFocus());
    await expect(email).toHaveValue('anna@example.com');

    // 5. Works: confirmation.
    await userEvent.clear(name);
    await userEvent.type(name, 'Anna Müller');
    await send();
    await expect(await canvas.findByText('Account created')).toBeInTheDocument();
  },
};
