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
  parameters: { layout: 'padded', medo: { subtitle: 'A complete form built from the components, with validation.' } },
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
        <Button type="submit">Send</Button>
        <Button type="reset" variant="ghost">
          Reset
        </Button>
      </div>
    </Form>
  ),
};
