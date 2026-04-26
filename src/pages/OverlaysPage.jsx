import { useState } from 'react'
import { DocSection } from '../docs/DocSection'
import { Button, Modal } from '../components'

export default function OverlaysPage() {
  const [open, setOpen] = useState(false)

  return (
    <DocSection title="Modal" description="Öffnet per Button, schließt per Escape oder Klick auf das Overlay.">
      <Button variant="secondary" size="md" onClick={() => setOpen(true)}>
        Modal öffnen
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Eintrag löschen?"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Abbrechen</Button>
            <Button variant="danger"    size="sm"
              style={{ background: 'var(--color-error)', color: 'white' }}
              onClick={() => setOpen(false)}>
              Löschen
            </Button>
          </>
        }
      >
        Diese Aktion kann nicht rückgängig gemacht werden. Der Eintrag wird dauerhaft gelöscht.
      </Modal>
    </DocSection>
  )
}