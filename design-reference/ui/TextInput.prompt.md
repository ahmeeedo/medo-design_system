# TextInput

Einzeiliges Eingabefeld. Nutzt `Field` als Hülle: sichtbares Label oben, Feld mit 1px-Rahmen und
8px-Radius, höchstens eine Meldung unten.

## Label und Meldungen

Das Label ist **immer sichtbar**. Ein Platzhalter ist kein Label — er verschwindet beim Tippen und
fehlt dann genau dem, der ihn braucht. Der Platzhalter zeigt ein Beispiel, keine Anweisung.

`required` setzt einen roten Stern, `optional` schreibt „(optional)" dahinter. Verwende pro Formular
nur eines von beiden: entweder alle Pflichtfelder sind markiert oder alle freiwilligen.

Unter dem Feld steht höchstens eine Zeile — `error` verdrängt `success`, `success` verdrängt `hint`.
Fehlermeldungen nennen Ursache **und** nächsten Schritt: „Bitte geben Sie eine gültige
E-Mail-Adresse ein.", nicht „Ungültige Eingabe." Ein Fehler wird nie allein durch Farbe angezeigt,
es gibt immer Icon und Text.

## Floating Label

`floatingLabel` legt das Label in das Feld: leer steht es wie ein Platzhalter mittig, bei Fokus oder
Inhalt schwebt es nach oben in den Rahmen (12px, medium, im Fokus teal). Das Feld ist dann 52px hoch.

Es ist die **Ausnahme**, nicht die Regel: in dichten Formularen oder wenn über dem Feld kein Platz
für eine Zeile ist. Nie beides mischen — ein Formular hat entweder überall Labels oben oder überall
schwebende. Ein Hilfetext bleibt unter dem Feld; ein `placeholder` zusammen mit `floatingLabel`
hebt das Label dauerhaft an und macht es damit sinnlos.

## Größen

`sm` 36px, `md` 40px, `lg` 48px. `md` ist der Normalfall, `lg` auf Mobilgeräten (darunter wird die
Trefferfläche zu klein), `sm` nur in dichten Tabellen und Filterleisten. Schriftgrößen bleiben auf
der Skala: 14 / 16 / 16.

## Breite und Zusätze

Die Feldbreite folgt der erwarteten Eingabe — eine Postleitzahl bekommt kein Feld über die ganze
Spalte. `prefix` und `suffix` nehmen feste Textteile aus der Eingabe heraus („https://", „.de", „€"),
damit der Nutzer sie nicht mittippt.

## Icons im Feld

`icon` setzt ein dekoratives Glyph vorn — flach, ohne Fläche. **Bedienbare** Icons dagegen sehen wie
kleine Schaltflächen aus (ruhende Fläche stone-100, Hover stone-200) und tragen immer ein
`aria-label`: die Leeren-Schaltfläche über `clearable` und der Passwort-Umschalter, den
`type="password"` automatisch mitbringt. Das ist eine feste Systemregel, keine Stilfrage.

## readOnly gegen disabled

`readOnly` für Werte, die angezeigt aber nicht geändert werden — Kundennummer, generierte ID. Das
Feld bleibt fokussierbar und kopierbar und zeigt ein Schloss. `disabled` nur, wenn das Feld unter
den aktuellen Bedingungen gar nicht gilt. Die beiden zu verwechseln ist der häufigste Fehler.

## Nicht tun

- Label weglassen und den Platzhalter als Label benutzen.
- Fehler nur rot einfärben, ohne Text.
- `disabled` für schreibgeschützte Werte.
- `showCounter` ohne `maxLength` — der Zähler erscheint dann nicht.
- Eigene Rahmenfarben oder Höhen über `style` setzen.

## Beispiel

```jsx
<TextInput label="Name" required clearable hint="Wie im Ausweis geschrieben" />
<TextInput label="E-Mail" type="email" icon="mail"
           error="Bitte geben Sie eine gültige E-Mail-Adresse ein." />
<TextInput label="Website" prefix="https://" suffix=".de" defaultValue="meine-seite" />
<TextInput label="Kurzprofil" optional maxLength={100} showCounter />
<TextInput label="Kundennummer" value="K-0002" readOnly />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, `ui/Field.jsx`, dann `ui/TextInput.jsx`.
Tokens aus `styles.css`.
