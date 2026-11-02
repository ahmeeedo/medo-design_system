import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Alert, Breadcrumbs, Button, Card, DescriptionItem, DescriptionList, Stack, StaticTable, Step, Stepper, TextField, ToastRegion, toast } from '@med-o/ui';
import { overflowsHorizontally, resizeViewport } from '../../../../packages/ui/src/story-helpers';

/**
 * Difficult content (Foundations/Long content): long names, German compounds, long email addresses, big numbers,
 * missing values – at 320 px and on desktop. Checks: the page never scrolls sideways, errors are never cut.
 * Tests only – hidden from the sidebar (`!dev`).
 */
const meta = {
  title: 'Tests/Long content',
  tags: ['!dev', '!autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const NAME = 'Maximiliane Alexandra von Hohenzollern-Sigmaringen-Wartenberg';
const EMAIL = 'maximiliane.von-hohenzollern-sigmaringen@verwaltungsgemeinschaft-oberland.example.com';
const COMPOUND = 'Krankenversicherungsbeitragsrückerstattungsantrag';
const ERROR = `Die Versichertennummer im ${COMPOUND} beginnt mit einem Großbuchstaben, gefolgt von 9 Ziffern, z. B. A123456789.`;

/** A missing value: a dash for the eye, words for screen readers. */
const NoValue = () => (
  <>
    <span aria-hidden="true">–</span>
    <span className="medo-visually-hidden">No value</span>
  </>
);

/** True when an element's text is cut: wider content than box, or an ellipsis. */
const isCut = (el: Element) => el.scrollWidth > el.clientWidth + 1 || getComputedStyle(el).textOverflow === 'ellipsis';

function DifficultContent() {
  return (
    <Stack gap="group">
      <Breadcrumbs items={[{ label: 'Home', href: '#' }, { label: COMPOUND, href: '#' }, { label: NAME }]} />
      <Stepper aria-label="Antrag" current={1}>
        <Step onPress={() => {}}>Persönliche Angaben</Step>
        <Step>{COMPOUND}</Step>
        <Step>Prüfen</Step>
      </Stepper>
      <Alert tone="danger" title={`${COMPOUND} konnte nicht gesendet werden`}>
        {ERROR}
      </Alert>
      <TextField label={`Versichertennummer (${COMPOUND})`} defaultValue="a12345" isInvalid errorMessage={ERROR} description={EMAIL} />
      <Card
        title={NAME}
        headerActions={
          <Button variant="ghost" size="sm">
            Bearbeiten
          </Button>
        }
      >
        <DescriptionList>
          <DescriptionItem term="E-Mail">{EMAIL}</DescriptionItem>
          <DescriptionItem term="Antrag">{COMPOUND}</DescriptionItem>
          <DescriptionItem term="Telefon">
            <NoValue />
          </DescriptionItem>
        </DescriptionList>
      </Card>
      <StaticTable caption="Erstattungen">
        <thead>
          <tr>
            <th>Name</th>
            <th>Antrag</th>
            <th className="medo-table__cell--number">Betrag</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">{NAME}</th>
            <td>{COMPOUND}</td>
            <td className="medo-table__cell--number">1.234.567,89 €</td>
          </tr>
          <tr>
            <th scope="row">Anna Müller</th>
            <td>
              <NoValue />
            </td>
            <td className="medo-table__cell--number">
              <NoValue />
            </td>
          </tr>
        </tbody>
      </StaticTable>
      <Button onPress={() => toast(`${COMPOUND} an ${EMAIL} nicht gesendet`, { persistent: true })}>Toast</Button>
      <ToastRegion />
    </Stack>
  );
}

export const DifficultContentTest: Story = {
  name: 'Difficult content',
  render: () => <DifficultContent />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Toast' }));
    const toastText = await within(document.body).findByText(/nicht gesendet$/);

    for (const width of [320, 1280]) {
      if (!(await resizeViewport(width))) return; // in Storybook: nothing to resize
      // The page never scrolls sideways (a wide table scrolls in its own frame).
      await waitFor(() => expect(overflowsHorizontally(), `page scrolls sideways at ${width} px`).toBe(false));
      // Errors are never cut: the field's message, the Alert, the error toast.
      for (const el of [canvas.getByText(ERROR, { selector: '.medo-field__error span' }), canvas.getByText(`${COMPOUND} konnte nicht gesendet werden`), toastText]) {
        await expect(isCut(el), `cut at ${width} px: ${el.textContent?.slice(0, 40)}`).toBe(false);
      }
    }
    // A missing value is read as words, not as a dash.
    await expect(canvas.getAllByText('No value')[0]).toHaveClass('medo-visually-hidden');
  },
};
