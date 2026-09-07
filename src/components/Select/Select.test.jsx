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

/* Uebergebene Angaben treten hinzu, sie ersetzen nicht. Am gestalteten Ausloeser haengen
   ausser Fokus und Unschaerfe auch onClick (oeffnen/schliessen) und onKeyDown (Pfeile,
   Home/End, Typeahead) — ein ersetzender Handler nimmt die Bedienung stumm weg. */
describe('Select · uebergebene Angaben treten hinzu', () => {
  const OPT = [
    { value: 'kranken', label: 'Krankenversicherung' },
    { value: 'leben', label: 'Lebensversicherung' },
  ]

  it('laesst ein uebergebenes onClick laufen, ohne das Panel am Oeffnen zu hindern', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Select label="Schwerpunkt" options={OPT} onClick={onClick} />)

    await user.click(screen.getByRole('combobox', { name: /Schwerpunkt/ }))

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('laesst ein uebergebenes onKeyDown laufen, ohne die eingebaute Bedienung zu ersetzen', async () => {
    const user = userEvent.setup()
    const onKeyDown = vi.fn()
    render(<Select label="Schwerpunkt" options={OPT} onKeyDown={onKeyDown} />)

    const ausloeser = screen.getByRole('combobox', { name: /Schwerpunkt/ })
    ausloeser.focus()
    await user.keyboard('{ArrowDown}')

    expect(onKeyDown).toHaveBeenCalled()
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('laesst ein uebergebenes onFocus zusaetzlich laufen und behaelt den Fokusrahmen', async () => {
    const user = userEvent.setup()
    const onFocus = vi.fn()
    const { container } = render(<Select label="Schwerpunkt" options={OPT} onFocus={onFocus} />)

    await user.tab()

    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(container.querySelector('.medo-field__box--focus')).not.toBeNull()
  })

  it('laesst ein uebergebenes onBlur zusaetzlich laufen', async () => {
    const user = userEvent.setup()
    const onBlur = vi.fn()
    render(<Select label="Schwerpunkt" options={OPT} onBlur={onBlur} />)

    await user.tab()
    await user.tab()

    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('laesst den eigenen Fehlerzustand vor einem uebergebenen aria-invalid stehen', () => {
    render(
      <Select label="Schwerpunkt" options={OPT} error="Bitte waehlen" aria-invalid="false" />
    )

    expect(screen.getByRole('combobox', { name: /Schwerpunkt/ })).toHaveAttribute(
      'aria-invalid',
      'true'
    )
  })

  /* Dieselbe Zusammenfuehrung gilt in der nativen Betriebsart. */
  it('fuehrt onFocus und aria-invalid auch bei native zusammen', async () => {
    const user = userEvent.setup()
    const onFocus = vi.fn()
    render(
      <Select label="Schwerpunkt" native options={OPT} onFocus={onFocus} aria-invalid="true" />
    )

    const feld = screen.getByRole('combobox', { name: /Schwerpunkt/ })
    expect(feld).toHaveAttribute('aria-invalid', 'true')

    await user.click(feld)
    expect(onFocus).toHaveBeenCalledTimes(1)
  })
})
