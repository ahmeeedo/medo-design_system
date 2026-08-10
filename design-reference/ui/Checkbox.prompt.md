# Checkbox

Mehrfachauswahl: null bis viele Optionen. Eigene Grafik statt Systemhäkchen, damit Farbe, Radius
und Fokusring aus den Tokens kommen.

## Wann

Für „null bis viele" aus einer Liste. Eine **einzelne** Checkbox ist richtig für Zustimmung
(„Ich habe die Bedingungen gelesen"). Geht es um zwei Zustände, die sofort wirken — an/aus, sichtbar
/verborgen — nimm `Toggle`. Geht es um genau eine Option aus mehreren, nimm `Radio`.

## Gruppe

Checkboxen gehören in eine `CheckboxGroup` mit `legend`, sonst weiß ein Screenreader nicht, wozu die
Optionen gehören. Senkrecht ist der Normalfall; `direction="horizontal"` nur bei zwei bis drei sehr
kurzen Labels.

## Zwischenzustand

`indeterminate` bedeutet „einige darunter sind ausgewählt" — typisch für die Kopfzeile einer
Baumauswahl oder einer Tabellenspalte. Es ist **kein** dritter Wert für „unbekannt" und wird nie
gesetzt, ohne dass darunter eine Auswahl liegt.

## Maße

Kästchen 18px (`sm`) oder 20px (`md`), Radius `sm` 4px, Rahmen 1px. Label `text-sm` 14px, `hint`
darunter `text-xs` 12px. Auf Touch-Geräten muss die Zeile mindestens 44px hoch sein — das Label
gehört mit ins `<label>`, damit die ganze Zeile trifft.

## Nicht tun

- Ohne `legend` gruppieren.
- `indeterminate` als eigenständigen Wert benutzen.
- Für an/aus-Schalter verwenden, die sofort wirken (das ist `Toggle`).
- Label nur neben die Checkbox setzen, ohne es zu verknüpfen.
- Eine einzelne Checkbox als Pflichtzustimmung ohne Fehlermeldung lassen.

## Beispiel

```jsx
<CheckboxGroup legend="Benachrichtigungen">
  <Checkbox label="Neue Einladungen" defaultChecked />
  <Checkbox label="Alle Kategorien" hint="Einige ausgewählt" indeterminate />
  <Checkbox label="Produktneuheiten" />
</CheckboxGroup>

<Checkbox label="Ich habe die Bedingungen gelesen" error />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/Checkbox.jsx`. Tokens aus `styles.css`.
