import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, waitFor } from 'storybook/test';
import { Alert, Button, ButtonGroup, Checkbox, Form, Radio, RadioGroup, Switch, TextField } from '@med-o/ui';
import { interactionTest } from '../../../../packages/ui/src/story-helpers';

/**
 * A complete form built only from system components.
 * Validation runs on submit (Form, built on React Aria): try sending it empty.
 */
const meta = {
  title: 'Patterns/Form',
  // Keeps the URL of the former “Usage” group (…/usage-form--docs).
  id: 'usage-form',
  // locale-de: also tested in German (Vitest project “storybook-de”).
  tags: ['autodocs', 'locale-de'],
  parameters: {
    layout: 'padded',
    medo: {
      subtitle: 'A complete form built from the components, with validation.',
      usage: {
        when: ['Collect data the user types or chooses: contact, sign-up, settings, checkout.'],
        whenNot: ['One setting with an immediate effect: a Switch on its own, no form.', 'Filters that apply live: no submit button.'],
        do: [
          'One column, in the order people think about the data.',
          'Space the fields with the rule `fields` (`<Stack gap="fields">` or the class `medo-gap-fields`), fieldsets with `group`.',
          'A visible label on every field; help text below the label, never in the placeholder.',
          'Mark the few optional fields, or all required ones – not both.',
          'Use `autoComplete` and the right `type` (`email`, `tel`), so browsers and password managers can fill in.',
          'Group related choices: RadioGroup or CheckboxGroup with their own label.',
          'Name the submit button with the result: “Send message”, “Create account”.',
        ],
        dont: [
          'Disable the submit button until the form is valid – let people submit and show what is missing.',
          'Validate while someone is still typing; check on leaving the field or on submit.',
          'Clear what the user entered after an error.',
          'Collect the errors in a summary above a long form – show them at the fields and split long forms into steps (pattern Multi-step form).',
        ],
      },
      a11y: {
        keyboard: [
          ['Tab / Shift + Tab', 'Moves through the fields in reading order.'],
          ['Enter', 'In a single-line field: submits the form.'],
          ['Space', 'Toggles a checkbox or switch, picks a radio.'],
        ],
        notes: [
          'Use `Form`: on submit the focus moves to the first invalid field and its message is read; screen readers also hear how many fields need attention.',
          'Errors the server finds go to their field too: reject `onSave` with `FieldErrors` (see Components/Forms/Form).',
          'Error messages say how to fix the problem (“Enter a valid email address”), not only that something is wrong.',
          'Help and error texts are linked to their field, so they are read with it.',
          'Required fields are marked visibly and set `isRequired`, so screen readers announce them.',
        ],
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Sent: a confirmation in place of the form that says what happens next – and a way to send another one. */
function ContactFormExample() {
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <Alert
        tone="success"
        title="Message sent"
        announce
        actions={
          <Button variant="secondary" onPress={() => setSent(false)}>
            Send another message
          </Button>
        }
      >
        Thank you. We answer within two working days.
      </Alert>
    );
  }
  return (
    // Form validates and saves; the classes of Stack give it the spacing rule fields.
    <Form onSave={() => setSent(true)} className="medo-stack medo-gap-fields" style={{ maxInlineSize: '28rem' }}>
      <TextField label="Name" name="name" isRequired autoComplete="name" errorMessage="Enter your name." />
      <TextField
        label="Email"
        name="email"
        type="email"
        isRequired
        autoComplete="email"
        description="We answer within two working days."
        errorMessage="Enter a valid email address, e.g. name@example.com."
      />
      <RadioGroup label="Topic" name="topic" isRequired defaultValue="project">
        <Radio value="project">New project</Radio>
        <Radio value="support">Support</Radio>
        <Radio value="other">Something else</Radio>
      </RadioGroup>
      <TextField label="Message" name="message" multiline isRequired characterLimit={500} errorMessage="Write a message." />
      <Switch name="newsletter" description="One email per month. Unsubscribe anytime.">
        Newsletter
      </Switch>
      <Checkbox name="privacy" isRequired errorMessage="Agree to the privacy policy to send the message.">
        I agree to the privacy policy.
      </Checkbox>
      <ButtonGroup context="content">
        <Button type="submit">Send message</Button>
        <Button type="reset" variant="ghost">
          Reset
        </Button>
      </ButtonGroup>
    </Form>
  );
}

export const ContactForm: Story = {
  name: 'Contact form',
  parameters: {
    docs: {
      description: {
        story: 'Send it empty: every missing field says what to do, the focus goes to the first one. Send it complete: a confirmation says what happens next.',
      },
    },
  },
  render: () => <ContactFormExample />,
};

export const InteractionTest: Story = {
  ...interactionTest,
  // Checks the English messages word for word – the German run covers the contact form story.
  tags: ['!autodocs', '!locale-de'],
  render: () => <ContactFormExample />,
  // The whole flow: submit with errors → focus on the first → correct → submit → confirmation → start again.
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Send message' }));
    const name = canvas.getByRole('textbox', { name: /Name/ });
    await waitFor(() => expect(name).toHaveFocus());
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByText('Enter your name.')).toBeInTheDocument();
    await expect(canvas.getByText('Agree to the privacy policy to send the message.')).toBeInTheDocument();
    // A wrong email keeps its own message; what was typed stays.
    await userEvent.type(name, 'Anna Müller');
    await userEvent.type(canvas.getByRole('textbox', { name: /Email/ }), 'anna@');
    await userEvent.click(canvas.getByRole('button', { name: 'Send message' }));
    const email = canvas.getByRole('textbox', { name: /Email/ });
    await waitFor(() => expect(email).toHaveFocus());
    await expect(name).toHaveValue('Anna Müller');
    await expect(canvas.getByText('Enter a valid email address, e.g. name@example.com.')).toBeInTheDocument();
    // Corrected and complete: sent.
    await userEvent.type(email, 'example.com');
    await userEvent.type(canvas.getByRole('textbox', { name: /Message/ }), 'Hello!');
    await userEvent.click(canvas.getByRole('checkbox', { name: /privacy policy/ }));
    await userEvent.click(canvas.getByRole('button', { name: 'Send message' }));
    await expect(await canvas.findByText('Message sent')).toBeInTheDocument();
    // And back to an empty form.
    await userEvent.click(canvas.getByRole('button', { name: 'Send another message' }));
    await expect(canvas.getByRole('textbox', { name: /Name/ })).toHaveValue('');
  },
};
