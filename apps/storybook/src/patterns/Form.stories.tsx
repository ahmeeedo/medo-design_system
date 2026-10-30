import type { Meta, StoryObj } from '@storybook/react-vite';
import { Form } from 'react-aria-components';
import { Button, Checkbox, Radio, RadioGroup, Switch, TextField } from '@med-o/ui';

/**
 * A complete form built only from system components.
 * Validation runs on submit (native + React Aria): try sending it empty.
 */
const meta = {
  title: 'Patterns/Form',
  // Keeps the URL of the former “Usage” group (…/usage-form--docs).
  id: 'usage-form',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    medo: {
      subtitle: 'A complete form built from the components, with validation.',
      usage: {
        when: ['Collect data the user types or chooses: contact, sign-up, settings, checkout.'],
        whenNot: ['One setting with an immediate effect: a Switch on its own, no form.', 'Filters that apply live: no submit button.'],
        do: [
          'One column, in the order people think about the data.',
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
        ],
      },
      a11y: {
        keyboard: [
          ['Tab / Shift + Tab', 'Moves through the fields in reading order.'],
          ['Enter', 'In a single-line field: submits the form.'],
          ['Space', 'Toggles a checkbox or switch, picks a radio.'],
        ],
        notes: [
          'Use React Aria `Form`: on submit the focus moves to the first invalid field and its message is read.',
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

export const ContactForm: Story = {
  name: 'Contact form',
  render: () => (
    <Form
      onSubmit={(e) => e.preventDefault()}
      style={{ display: 'grid', gap: 'var(--medo-space-6)', maxInlineSize: '28rem' }}
    >
      <TextField label="Name" name="name" isRequired autoComplete="name" />
      <TextField
        label="Email"
        name="email"
        type="email"
        isRequired
        autoComplete="email"
        description="We answer within two working days."
        errorMessage="Enter a valid email address."
      />
      <RadioGroup label="Topic" name="topic" isRequired defaultValue="project">
        <Radio value="project">New project</Radio>
        <Radio value="support">Support</Radio>
        <Radio value="other">Something else</Radio>
      </RadioGroup>
      <TextField label="Message" name="message" multiline isRequired characterLimit={500} />
      <Switch name="newsletter" description="One email per month. Unsubscribe anytime.">
        Newsletter
      </Switch>
      <Checkbox name="privacy" isRequired>
        I agree to the privacy policy.
      </Checkbox>
      <div style={{ display: 'flex', gap: 'var(--medo-space-3)' }}>
        <Button type="submit">Send message</Button>
        <Button type="reset" variant="ghost">
          Reset
        </Button>
      </div>
    </Form>
  ),
};
