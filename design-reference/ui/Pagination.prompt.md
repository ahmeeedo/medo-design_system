# Pagination

Blättert durch eine Menge, die nicht auf eine Seite passt. Sie ist **Ortsangabe und Steuerung**: man
muss ihr ansehen, wo man ist und wie viel noch kommt.

## Wann welche Form

`numbers` ist der Normalfall unter einer Liste oder Kartenmenge. `bar` gehört unter eine
`DataTable`: links „Einträge pro Seite" und „21–40 von 312", rechts die Nummern und bei sehr vielen
Seiten der Direktsprung. `compact` ist für schmale Spalten und Mobil — Zurück, „Seite 3 von 12",
Weiter.

Lädt die Liste beim Scrollen nach, gibt es keine Pagination. Beides zusammen geht nicht.

## Verhalten

Erste und letzte Seite sind immer sichtbar, um die aktuelle stehen `siblings` Nachbarn, dazwischen
steht „…" — die Leiste ändert also ihre Breite beim Blättern kaum. Die aktive Seite ist primary-600
gefüllt und trägt `aria-current="page"`; an den Rändern sind Zurück und Weiter deaktiviert, nicht
ausgeblendet.

Alle Zahlen stehen in Tabellenziffern, damit sie beim Wechsel nicht wandern. Nach einem
Seitenwechsel bleibt die Scrollposition am Anfang der Liste — die Seite springt nicht in die Mitte.

Ändert sich „Einträge pro Seite", geht die Ansicht auf Seite 1 zurück; das gehört in den Aufruf
(`onPageSizeChange` setzt Größe **und** Seite).

## Barrierefreiheit

`<nav aria-label>`; jede Nummer ist eine Schaltfläche mit `aria-label="Seite 4"`, die Auslassung ist
`aria-hidden`. Trefferflächen sind 40px (md) bzw. 32px (sm) — auf Touch-Oberflächen md verwenden.

## Nicht tun

- Die aktive Seite nur durch Fettung markieren.
- Zurück/Weiter an den Rändern verstecken.
- Mehr als etwa neun Nummern gleichzeitig zeigen.
- Die Gesamtzahl weglassen, wenn sie bekannt ist.

## Beispiel

```jsx
<Pagination page={seite} pageCount={12} onPageChange={setSeite} showFirstLast />

<Pagination variant="bar" page={seite} pageSize={20} totalItems={312}
            onPageChange={setSeite}
            onPageSizeChange={(n) => { setGroesse(n); setSeite(1); }}
            showJump />

<Pagination variant="compact" size="sm" page={seite} pageCount={12}
            onPageChange={setSeite} />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/Pagination.jsx`. Tokens aus `styles.css`.
