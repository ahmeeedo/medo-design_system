import { fireEvent, render, screen } from '@testing-library/react'
import { FileUploader } from './FileUploader'

/* Die Komponente hält keinen eigenen Zustand: `files` kommt von außen, geprüft wird
   nur, was sie über onFilesAdded und onRemove meldet und wie sie die Liste darstellt. */

const pdf = (name = 'vertrag.pdf', size = 1024) =>
  new File([new ArrayBuffer(size)], name, { type: 'application/pdf' })

const fileInput = (container) => container.querySelector('input[type="file"]')

const pick = (container, files) => fireEvent.change(fileInput(container), { target: { files } })

describe('FileUploader · Übernehmen', () => {
  it('meldet gewählte Dateien mit Name, Größe und Status', () => {
    const onFilesAdded = vi.fn()
    const { container } = render(<FileUploader onFilesAdded={onFilesAdded} />)

    pick(container, [pdf('vertrag.pdf', 2048)])

    expect(onFilesAdded).toHaveBeenCalledTimes(1)
    expect(onFilesAdded.mock.calls[0][0]).toHaveLength(1)
    expect(onFilesAdded.mock.calls[0][0][0]).toMatchObject({
      name: 'vertrag.pdf',
      size: 2048,
      status: 'done',
      error: undefined,
    })
  })

  it('übernimmt Dateien auch über die Ablagefläche', () => {
    const onFilesAdded = vi.fn()
    render(<FileUploader onFilesAdded={onFilesAdded} buttonText="Datei auswählen" />)

    const zone = screen.getByRole('button', { name: /Datei auswählen/ })
    fireEvent.drop(zone, { dataTransfer: { files: [pdf()] } })

    expect(onFilesAdded).toHaveBeenCalledTimes(1)
    expect(onFilesAdded.mock.calls[0][0][0].name).toBe('vertrag.pdf')
  })

  it('meldet nichts, wenn nichts gewählt wurde', () => {
    const onFilesAdded = vi.fn()
    const { container } = render(<FileUploader onFilesAdded={onFilesAdded} />)

    pick(container, [])
    expect(onFilesAdded).not.toHaveBeenCalled()
  })
})

describe('FileUploader · Ablehnung mit Begründung', () => {
  it('lehnt eine zu große Datei ab und nennt die Grenze', () => {
    const onFilesAdded = vi.fn()
    const { container } = render(<FileUploader onFilesAdded={onFilesAdded} maxSize={2 * 1024 * 1024} />)

    pick(container, [pdf('scan.pdf', 3 * 1024 * 1024)])

    expect(onFilesAdded.mock.calls[0][0][0]).toMatchObject({
      status: 'error',
      error: 'Datei ist größer als 2,0 MB.',
    })
  })

  it('lehnt einen nicht erlaubten Dateityp ab und nennt den Grund', () => {
    const onFilesAdded = vi.fn()
    const { container } = render(<FileUploader onFilesAdded={onFilesAdded} accept=".pdf" />)

    pick(container, [new File(['x'], 'foto.png', { type: 'image/png' })])

    expect(onFilesAdded.mock.calls[0][0][0]).toMatchObject({
      status: 'error',
      error: 'Dateityp wird nicht akzeptiert.',
    })
  })

  it('lässt eine passende Endung durch', () => {
    const onFilesAdded = vi.fn()
    const { container } = render(<FileUploader onFilesAdded={onFilesAdded} accept=".pdf,.jpg" />)

    pick(container, [pdf('antrag.pdf')])
    expect(onFilesAdded.mock.calls[0][0][0].status).toBe('done')
  })

  it('prüft Platzhalter wie image/* gegen den Medientyp', () => {
    const onFilesAdded = vi.fn()
    const { container } = render(<FileUploader onFilesAdded={onFilesAdded} accept="image/*" />)

    pick(container, [new File(['x'], 'foto.png', { type: 'image/png' }), pdf()])

    expect(onFilesAdded.mock.calls[0][0][0].status).toBe('done')
    expect(onFilesAdded.mock.calls[0][0][1].status).toBe('error')
  })

  it('übernimmt nichts, solange die Fläche deaktiviert ist', () => {
    const onFilesAdded = vi.fn()
    render(<FileUploader onFilesAdded={onFilesAdded} disabled buttonText="Datei auswählen" />)

    const zone = screen.getByRole('button', { name: /Datei auswählen/ })
    fireEvent.drop(zone, { dataTransfer: { files: [pdf()] } })

    expect(onFilesAdded).not.toHaveBeenCalled()
  })
})

describe('FileUploader · Liste', () => {
  const files = [
    { id: 'a', name: 'vertrag.pdf', size: 2048, status: 'done' },
    { id: 'b', name: 'scan.pdf', size: 3145728, status: 'error', error: 'Datei ist größer als 2,0 MB.' },
    { id: 'c', name: 'police.pdf', size: 4096, status: 'uploading', progress: 40 },
  ]

  it('zeigt Größe, Fehlergrund und Fortschritt je Zeile', () => {
    const { container } = render(<FileUploader files={files} />)

    expect(screen.getByText('vertrag.pdf')).toBeInTheDocument()
    expect(screen.getByText('2 KB')).toBeInTheDocument()
    expect(screen.getByText('Datei ist größer als 2,0 MB.')).toBeInTheDocument()
    expect(container.querySelector('[class~="medo-fu__fill"]')).toHaveStyle({ width: '40%' })
  })

  it('meldet das Entfernen mit Datensatz und Position', () => {
    const onRemove = vi.fn()
    render(<FileUploader files={files} onRemove={onRemove} />)

    fireEvent.click(screen.getByRole('button', { name: 'Entfernen — scan.pdf' }))
    expect(onRemove).toHaveBeenCalledWith(files[1], 1)
  })

  it('bietet ohne onRemove keine Entfernen-Schaltfläche an', () => {
    render(<FileUploader files={files} />)
    expect(screen.queryByRole('button', { name: /Entfernen/ })).not.toBeInTheDocument()
  })

  it('kennzeichnet fehlerhafte Zeilen eigens', () => {
    const { container } = render(<FileUploader files={files} />)
    expect(container.querySelectorAll('[class~="medo-fu__item--error"]')).toHaveLength(1)
    expect(container.querySelectorAll('[class~="medo-fu__item"]')).toHaveLength(3)
  })
})

describe('FileUploader · compact', () => {
  it('zeigt eine Zeile statt der Ablagefläche', () => {
    const { container } = render(<FileUploader compact accept=".pdf" maxSize={2 * 1024 * 1024} />)

    expect(container.querySelector('[class~="medo-fu__zone"]')).toBeNull()
    expect(screen.getByRole('button', { name: 'Datei auswählen' })).toBeInTheDocument()
    expect(screen.getByText('PDF · bis 2,0 MB')).toBeInTheDocument()
  })

  it('übernimmt Dateien auch in der kompakten Form', () => {
    const onFilesAdded = vi.fn()
    const { container } = render(<FileUploader compact onFilesAdded={onFilesAdded} />)

    pick(container, [pdf()])
    expect(onFilesAdded).toHaveBeenCalledTimes(1)
  })
})

/* Nachweis der übrigen in FileUploader.d.ts deklarierten Props. */
describe('FileUploader · Props', () => {
  it('zeigt Beschriftung und Hinweis über der Fläche', () => {
    render(<FileUploader label="Gewerbeschein" helper="Als PDF oder Foto." />)
    expect(screen.getByText('Gewerbeschein')).toBeInTheDocument()
    expect(screen.getByText('Als PDF oder Foto.')).toBeInTheDocument()
  })

  it('übernimmt eigene Beschriftungen für Fläche und Entfernen', () => {
    render(
      <FileUploader
        buttonText="Nachweis wählen"
        dropText="oder hier ablegen"
        removeLabel="Löschen"
        files={[{ id: 'a', name: 'nachweis.pdf', size: 2048, status: 'done' }]}
        onRemove={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: /Nachweis wählen/ })).toBeInTheDocument()
    expect(screen.getByText('oder hier ablegen')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Löschen — nachweis.pdf' })).toBeInTheDocument()
  })

  it('reicht accept und multiple an das Dateifeld durch', () => {
    const { container } = render(<FileUploader accept=".pdf,.jpg" multiple={false} />)
    const input = fileInput(container)

    expect(input).toHaveAttribute('accept', '.pdf,.jpg')
    expect(input).not.toHaveAttribute('multiple')
    expect(input).toHaveAttribute('tabindex', '-1')
  })

  it('zeigt die Bildvorschau statt des Dokument-Icons', () => {
    const { container } = render(
      <FileUploader files={[{ id: 'a', name: 'ladenfront.jpg', size: 4096, status: 'done', preview: '/bild.jpg' }]} />
    )

    const img = container.querySelector('[class~="medo-fu__thumb"] img')
    expect(img).toHaveAttribute('src', '/bild.jpg')
    expect(img).toHaveAttribute('alt', '')
  })

  it('reicht className und style an die Hülle durch', () => {
    const { container } = render(<FileUploader className="eigen" style={{ maxWidth: '560px' }} />)
    const root = container.querySelector('[class~="medo-fu"]')
    expect(root).toHaveClass('eigen')
    expect(root).toHaveStyle({ maxWidth: '560px' })
  })
})
