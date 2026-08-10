# Toggle

Schaltet eine Einstellung **sofort** um. Kein Speichern-Schritt, keine Bestätigung.

## Wann

Für zwei Zustände einer laufenden Einstellung, die unmittelbar wirken: Benachrichtigungen an,
Profil sichtbar, Erinnerung aktiv. Braucht die Änderung einen Absenden-Schritt oder gehört sie zu
einem Formular, das gespeichert wird, ist es eine `Checkbox` — nicht ein Toggle. Für „Ja/Nein" als
Antwort auf eine Frage ebenfalls `Checkbox` oder `Radio`.

## Label

Das Label benennt den **eingeschalteten Zustand** („Benachrichtigungen"), nicht die Handlung
(„Benachrichtigungen einschalten"). Die `description` erklärt die Folge: „Push-Mitteilungen auf
dieses Gerät". Kein „An/Aus" als Text neben dem Schalter — das zeigt der Schalter selbst.

In Einstellungslisten steht das Label links und der Schalter rechts am Zeilenende:
`labelPosition="left"`.

## Zustände

Aus ist stone-300, an ist primary-600; der Griff ist immer weiß und trägt Häkchen bzw. Kreuz, damit
der Zustand nicht allein an der Farbe hängt. Hover geht eine Stufe tiefer, Fokus ist der 3px-Ring
um die Bahn.

Dauert das Speichern merkbar, `loading` setzen: der Griff zeigt einen Spinner, die Bedienung ist
gesperrt, `aria-busy` steht. Der Schalter springt trotzdem sofort in die neue Stellung — er wird
nur zurückgesetzt, wenn der Server ablehnt, und dann mit einer `Notification`.

## Barrierefreiheit

Gerendert als `<button role="switch" aria-checked>`. Ohne `label` ist ein `aria-label` Pflicht.
Bedienbar mit Leertaste und Enter. Die Größen sm/md liegen unter 44px — in Touch-Listen sorgt die
Zeile selbst für die Trefferfläche, alleinstehend `size="lg"` verwenden.

## Nicht tun

- Als Formularfeld benutzen, das erst mit „Speichern" wirkt.
- Zwei Toggles für eine Entweder-oder-Wahl — dafür `ContentSwitcher` oder `Radio`.
- Das Label mit „aktivieren" formulieren.
- Ohne Rückmeldung schalten, wenn der Vorgang fehlschlagen kann.

## Beispiel

```jsx
<Toggle label="Benachrichtigungen"
        description="Push-Mitteilungen auf dieses Gerät"
        defaultChecked />

<Toggle label="Standort teilen" description="Wird gerade gespeichert …"
        labelPosition="left" checked loading />

<Toggle size="lg" aria-label="Profil sichtbar"
        checked={sichtbar} onChange={setSichtbar} />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/Toggle.jsx`. Tokens aus `styles.css`.
