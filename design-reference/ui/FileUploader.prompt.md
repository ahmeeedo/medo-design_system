# FileUploader

Dateien wählen oder in die Fläche ziehen. Die Fläche ist selbst die Schaltfläche — Ziehen ist die
Zugabe, nie der einzige Weg.

## Aufbau

`label` benennt, was gebraucht wird („Gewerbeschein"), `helper` sagt warum und wozu. Die
Ablagefläche trägt Icon, eine sichtbare Schaltfläche („Datei auswählen"), den Zusatz „oder hierher
ziehen" und darunter Formate und Höchstgröße — nicht erst in der Fehlermeldung. Beim Ziehen wird
der gestrichelte Rahmen durchgezogen und teal.

`compact` ersetzt die Fläche durch eine Zeile aus Schaltfläche und Formathinweis — für genau eine
Datei in einem dichten Formular; Ziehen funktioniert dort weiter.

Die Komponente hält keinen Zustand: `files` kommt von außen, `onFilesAdded` liefert die geprüften
neuen Dateien, `onRemove` entfernt. So bleibt der echte Upload beim Aufrufer.

## Prüfung

`accept` und `maxSize` werden vor dem Übernehmen geprüft. Abgelehnte Dateien verschwinden nicht
still, sondern erscheinen in der Liste mit rotem Rand und dem Grund („Datei ist größer als 5 MB.").
Nur so weiß man, warum das Ziehen scheinbar nichts getan hat.

## Zeilen

Je Datei: 40px-Vorschau (Bild, sonst Dokument-Icon), Name (gekürzt mit Auslassungspunkten), Größe in
Mono, rechts der Zustand. Läuft der Upload, steht dort ein 5px-Balken; ist er fertig, ein grünes
Häkchen. Entfernen ist immer möglich — auch während des Uploads.

## Nicht tun

- Nur Drag & Drop anbieten; ohne Maus ist das unbedienbar.
- Fehler als `Notification` statt an der Datei zeigen.
- Erlaubte Formate verschweigen.
- Die Liste nach dem Upload leeren — was hochgeladen wurde, bleibt sichtbar.

## Beispiel

```jsx
<FileUploader
  label="Gewerbeschein" helper="Als PDF oder Foto, damit wir Ihre Zulassung prüfen können."
  accept=".pdf,.jpg,.png" maxSize={5 * 1024 * 1024}
  files={dateien}
  onFilesAdded={(neu) => setDateien(dateien.concat(neu))}
  onRemove={(f) => setDateien(dateien.filter((x) => x !== f))} />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/FileUploader.jsx`. Tokens aus
`styles.css`.
