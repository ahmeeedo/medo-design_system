import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select } from './Select'

/* Template: Beschriftungen.
   Der Vertrag sagt fuer jede Angabe einen Vorgabewert zu. Das Paket ist ausgeliefert —
   eine Angabe ohne Vorgabewert liesse bestehende Einbindungen mit leeren Beschriftungen
   zurueck, ohne dass etwas bricht. Deshalb wird beides geprueft: ohne gesetzte Angaben
   erscheinen die heutigen deutschen Texte, mit gesetzten der uebergebene. */

const OPTIONEN = [
  { value: 'kranken', label: 'Krankenversicherung' },
  { value: 'leben', label: 'Lebensversicherung' },
]

describe('Select · Beschriftungen', () => {
  it('zeigt ohne gesetzte Angaben die deutschen Texte im Panel', () => {
    render(
      <Select
        label="Schwerpunkt"
        multiple
        defaultOpen
        defaultValue={['kranken']}
        options={OPTIONEN}
      />
    )

    expect(screen.getByText('1 ausgewählt')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Zurücksetzen' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Auswahl entfernen: Krankenversicherung' })
    ).toBeInTheDocument()
  })

  it('nimmt uebergebene Beschriftungen an', () => {
    render(
      <Select
        label="Schwerpunkt"
        multiple
        defaultOpen
        defaultValue={['kranken']}
        options={OPTIONEN}
        selectedCountLabel={(count) => `${count} selected`}
        resetLabel="Reset"
        removeChipLabel={(label) => `Remove: ${label}`}
      />
    )

    expect(screen.getByText('1 selected')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove: Krankenversicherung' })).toBeInTheDocument()
    expect(screen.queryByText('1 ausgewählt')).not.toBeInTheDocument()
  })

  it('zeigt ohne gesetzte Angabe den deutschen Leertext', () => {
    render(<Select label="Schwerpunkt" defaultOpen options={[]} />)

    expect(screen.getByText('Keine Einträge')).toBeInTheDocument()
  })

  it('nimmt einen uebergebenen Leertext an', () => {
    render(<Select label="Schwerpunkt" defaultOpen options={[]} emptyText="Nothing here" />)

    expect(screen.getByText('Nothing here')).toBeInTheDocument()
    expect(screen.queryByText('Keine Einträge')).not.toBeInTheDocument()
  })

  /* Leere Liste und leeres Suchergebnis sind zwei verschiedene Aussagen: die eine sagt
     „hier gibt es nichts zu waehlen", die andere „aendere deinen Begriff". */
  it('unterscheidet den Leertext vom Text ohne Suchtreffer', async () => {
    const user = userEvent.setup()
    render(<Select label="Schwerpunkt" searchable defaultOpen options={OPTIONEN} />)

    await user.type(screen.getByRole('textbox', { name: 'Suchen …' }), 'zzz')

    expect(screen.getByText('Keine Treffer')).toBeInTheDocument()
    expect(screen.queryByText('Keine Einträge')).not.toBeInTheDocument()
  })

  it('nimmt einen uebergebenen Text ohne Suchtreffer an', async () => {
    const user = userEvent.setup()
    render(
      <Select
        label="Schwerpunkt"
        searchable
        defaultOpen
        options={OPTIONEN}
        noResultsText="No matches"
      />
    )

    await user.type(screen.getByRole('textbox', { name: 'Suchen …' }), 'zzz')

    expect(screen.getByText('No matches')).toBeInTheDocument()
    expect(screen.queryByText('Keine Treffer')).not.toBeInTheDocument()
  })

  it('zeigt die Anzahl auch im Feld, wenn multipleDisplay auf count steht', () => {
    render(
      <Select
        label="Schwerpunkt"
        multiple
        multipleDisplay="count"
        defaultValue={['kranken', 'leben']}
        options={OPTIONEN}
        selectedCountLabel={(count) => `${count} selected`}
      />
    )

    expect(screen.getByText('2 selected')).toBeInTheDocument()
  })
})
