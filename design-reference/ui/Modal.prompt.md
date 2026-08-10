# Modal

Sperrt die Seite für **eine** Entscheidung oder einen kurzen, abgeschlossenen Vorgang.

## Wann

Wenn es ohne die Eingabe nicht weitergeht, wenn eine Folge unumkehrbar ist, oder wenn ein kurzes
Formular den Zusammenhang der Seite nicht verlassen soll. Alles andere ist keine Modal-Sache:
Erklärungen sind `Popover` oder `Tooltip`, Aktionslisten sind `Dropdown`, Rückmeldungen sind
`Notification`. Ein mehrseitiger Vorgang gehört auf eine eigene Seite.

Nie zwei Modale übereinander. Ein Modal, das ein zweites braucht, ist eine Seite.

## Formen

`size="sm"` für Bestätigungen (Titel, ein Satz, zwei Schaltflächen), `md` als Standard mit Formular,
`lg` nur wenn der Inhalt es wirklich braucht. Mit `tone="danger"` wird das Kopf-Icon rot und die
bestätigende Schaltfläche rot; ihr Fokusring ist der Danger-Ring (error-600).

## Text

Der Titel benennt die Entscheidung, nicht den Zustand: „Konto löschen?" — die `subtitle` beschreibt
die Folge („Alle Verbindungen werden getrennt. Das lässt sich nicht rückgängig machen."). Die
bestätigende Schaltfläche wiederholt das Verb: „Konto löschen", nie „OK", nie „Ja".

Bei zerstörenden Aktionen ist **Abbrechen** die ruhige Wahl und liegt links; vorbelegt ist dort
nichts — der Fokus geht bewusst nicht auf die rote Schaltfläche.

## Verhalten

Esc, das Kreuz und Abbrechen schließen. Ein Klick auf den **Scrim schließt nicht** — im Formular
wäre das Datenverlust. Der Fokus wandert beim Öffnen in den Dialog (erstes Feld oder die
bestätigende Aktion), Tab bleibt darin gefangen, beim Schließen kehrt er auf den Auslöser zurück. Die
Seite hinter dem Scrim scrollt nicht.

## Barrierefreiheit

`role="dialog"` mit `aria-modal="true"` und `aria-labelledby` auf den Titel. Der Scrim ist ein
festes `rgba(23,21,19,0.5)` ohne Weichzeichner. Mit `data-autofocus` an einem Feld im Inhalt lässt
sich der Startfokus setzen.

## Nicht tun

- Modal zum Anzeigen von Inhalten, die auch auf der Seite stehen könnten.
- Bestätigen mit „OK" beschriften.
- Den Scrim schließen lassen, wenn Eingaben verloren gehen.
- Erfolgsmeldungen als Modal — das ist eine `Notification`.

## Beispiel

```jsx
<Modal open={offen} onClose={() => setOffen(false)}
  size="sm" tone="danger" icon="delete"
  title="Konto löschen?"
  subtitle="Alle Verbindungen werden getrennt. Das lässt sich nicht rückgängig machen."
  confirmLabel="Konto löschen" onConfirm={loeschen} />

<Modal open={offen} onClose={schliessen} title="Anfrage senden"
  subtitle="Die Nachricht ist nur für die angefragte Person sichtbar."
  confirmLabel="Anfrage senden" onConfirm={senden}>
  <TextInput label="Nachricht" data-autofocus />
</Modal>
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/Modal.jsx`. Braucht `ReactDOM` für den
Portal-Einhang. Tokens aus `styles.css`.
