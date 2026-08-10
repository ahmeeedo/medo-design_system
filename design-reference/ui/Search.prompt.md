# Search

Sucht live während der Eingabe. Baut auf `Field` auf: führende Lupe, Leeren-Schaltfläche,
optionales Panel mit Vorschlägen und letzten Suchen.

## Wann

Wenn der Nutzer eine Menge durchsuchen oder filtern soll und die Treffermenge offen ist. Für eine
bekannte, geschlossene Liste ist `Select` richtig, für Aktionen `Menu`.

## Entprellen

`onSearch` feuert entprellt — Standard 250ms nach dem letzten Tastendruck. Bei `Enter` und bei
Auswahl eines Vorschlags feuert es sofort. Feuere niemals bei jedem Tastendruck: das erzeugt
Anfragen, deren Antworten sich gegenseitig überholen.

`onChange` bekommt dagegen jeden Tastendruck und dient nur der Wertführung.

## Panel

`recent` erscheint nur, solange das Feld leer ist — Verlauf hilft beim Anfangen, nicht beim
Verfeinern. `suggestions` erscheint zur Eingabe; der übereinstimmende Teil wird fett hervorgehoben.
Ist etwas eingegeben und die Vorschlagsliste leer, zeigt das Panel den Leerzustand mit `search_off`
und nennt die Suchanfrage.

Setze `onRemoveRecent`, wenn Nutzer Einträge aus dem Verlauf löschen können sollen — dann bekommt
jede Zeile eine Entfernen-Schaltfläche.

`showPanel={false}` schaltet das Panel ganz ab. Richtig für reine Filterfelder, die eine sichtbare
Liste unter sich sofort einkürzen.

## Tastatur

Pfeile bewegen durch die Vorschläge, `Enter` übernimmt den aktiven Vorschlag oder löst die Suche
aus, `Esc` leert erst das Feld und schließt dann das Panel.

## Kompakt

`compact` ist die flache Variante für Werkzeugleisten: 34px hoch, ohne Rahmen, auf
`surface-container`. Sie trägt kein Label — der Platzhalter genügt, weil die Lupe die Funktion
zeigt. In Formularen ist die normale Variante mit Label richtig.

## Nicht tun

- Ohne sichtbare Lupe — dann ist es kein Suchfeld.
- Die Leeren-Schaltfläche verstecken, wenn Text im Feld steht.
- Bei jedem Tastendruck suchen.
- Den Verlauf einblenden, während der Nutzer tippt.
- Ein Suchfeld benutzen, wo eine feste Liste zur Auswahl steht.

## Beispiel

```jsx
<Search label="Spezialisten suchen"
        suggestions={treffer}
        recent={verlauf}
        onSearch={(q) => lade(q)}
        onSelect={(t) => oeffne(t)} />

<Search compact placeholder="Filtern …" showPanel={false}
        onChange={(e) => setFilter(e.target.value)} />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, `ui/Field.jsx`, dann `ui/Search.jsx`.
Tokens aus `styles.css`.
