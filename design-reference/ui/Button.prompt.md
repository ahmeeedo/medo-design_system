# Button

Löst eine Aktion aus. Die Schaltfläche ist das lauteste Element im System — deshalb ist ihre
Verwendung streng geregelt.

## Wann

Für jede Handlung, die etwas verändert, absendet, öffnet oder abbricht. Für reine Navigation
innerhalb eines Textflusses nimm `Link`, nicht `Button`.

## Varianten

| Variante | Verwendung |
| --- | --- |
| `primary` | Die eine wichtigste Aktion einer Ansicht. **Nie zwei gleichzeitig.** |
| `secondary` | Gleichrangige Nebenaktionen, „Abbrechen" neben einem primären Absenden. |
| `ghost` | Aktionen in dichten Bereichen: Werkzeugleisten, Tabellenzeilen, Kartenköpfe. |
| `danger` | Nur destruktive, nicht umkehrbare Aktionen. Immer mit Bestätigungsdialog. |

## Größen

`md` (40px) ist der Normalfall. `lg` (48px) schließt Formulare ab und ist die richtige Wahl auf
Mobilgeräten. `sm` (32px) nur in Tabellen und Werkzeugleisten — und dort nie als einzige
Trefferfläche auf Touch-Geräten, weil 32px unter der 44px-Grenze liegt.

Die Schriftgrößen bleiben auf der Skala: `sm` = `text-xs` (12px), `md` = `text-sm` (14px),
`lg` = `text-base` (16px). Zwischenwerte wie 13px gibt es im System nicht.

## Beschriftung

Verb im Infinitiv plus Objekt: „Termin anlegen", „Profil speichern", „Konto löschen". Nicht „OK",
nicht „Weiter" ohne Kontext, nicht „Absenden". Deutsch, Sie-Anrede, kein Title Case, keine Emoji.

## Icons

Nur Material Symbols Rounded über die `icon`-Prop — niemals ein eigenes SVG als `children`.
Führendes Icon beschreibt die Aktion (`add`, `save`), nachgestelltes Icon die Richtung
(`arrow_forward`). Bei `iconOnly` ist `aria-label` Pflicht, und die Trefferfläche muss auf
Touch-Geräten über eine Umgebung von mindestens 44×44px verfügen.

## Zustände

Hover, Aktiv und Fokus kommen aus dem Stylesheet der Komponente. Der Fokusring ist 3px in
`--medo-focus-ring` und wird nie entfernt; die Variante `danger` nutzt stattdessen
`--medo-focus-ring-danger` in error-600 — eine freigegebene Ausnahme, damit der Ring nicht gegen die
rote Fläche arbeitet. `loading` sperrt die Schaltfläche, setzt `aria-busy`, behält aber die Farbe der
Variante und zeigt den Spinner — der ist die einzige Dauerbewegung im System. Deaktivierte
Schaltflächen behalten `aria-disabled` und bleiben im Fokusfluss, damit Screenreader sie ankündigen.

## Nicht tun

- Zwei `primary` in einer Ansicht.
- `danger` für „Zurücksetzen" oder andere umkehrbare Aktionen.
- Eigene Farben, Höhen oder Radien über `style` überschreiben — dafür gibt es die Varianten.
- Beschriftung in Versalien setzen.
- Einen Button verwenden, wo semantisch ein Link gehört.

## Beispiel

```jsx
<Button icon="add">Termin anlegen</Button>
<Button variant="secondary">Abbrechen</Button>
<Button variant="danger" icon="delete">Konto löschen</Button>
<Button variant="ghost" size="sm" iconOnly icon="more_vert" aria-label="Weitere Aktionen" />
<Button size="lg" fullWidth loading>Wird gespeichert</Button>
```

## Abhängigkeiten

`ui/Icon.jsx` muss vor `ui/Button.jsx` geladen sein, sonst wird die `icon`-Prop stillschweigend
ignoriert. Tokens kommen aus `styles.css`.
