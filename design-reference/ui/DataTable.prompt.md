# DataTable

Zeigt gleichartige Datensätze in Spalten — zum Vergleichen, Sortieren und Auswählen.

## Wann

Sobald mehr als eine Eigenschaft je Eintrag verglichen wird. Reicht Titel plus Nebenzeile, ist es
eine `ContainedList`; geht es um Detailangaben zu **einem** Objekt, eine `KeyValueList`.

## Spalten

Text linksbündig, **Zahlen rechtsbündig und in DM Mono** mit Tabellenziffern (`numeric: true`) —
damit Beträge untereinander stehen. Die wichtigste Spalte steht links; Nebenangaben bekommen
`muted`. Sechs bis sieben Spalten sind die Grenze, darüber gehört der Rest in die Detailansicht.

`render` erlaubt echte Bausteine in der Zelle (ein `Tag` für Status, ein `Link` für den Namen) —
aber höchstens ein interaktives Element je Zelle.

## Sortierung

`sortable` je Spalte. Ohne `onSortChange` sortiert die Komponente selbst (Zahlen numerisch, Text nach
deutscher Locale); mit `onSortChange` übernimmt der Aufrufer — für serverseitige Sortierung. Der
Pfeil erscheint beim Überfahren blass und steht in primary-600, wenn die Spalte aktiv ist; der Kopf
trägt `aria-sort`.

## Auswahl

`selectable` setzt eine Auswahlspalte links; der Kopf wählt alle sichtbaren Zeilen. Sobald etwas
ausgewählt ist, wird die Kopfleiste zur **Bulk-Leiste**: „N ausgewählt" ersetzt den Titel, die
Leiste färbt sich teal-100 und `bulkActions` ersetzt `toolbar`. Massenaktionen stehen nie in jeder
Zeile.

## Laden

`loading` zeigt Skeleton-Zeilen in der Form der Spalten (`loadingRows`, Standard 5) — der Kopf
bleibt stehen, damit die Tabelle beim Eintreffen der Daten nicht springt.

## Kopf, Fuß, Leerzustand

Mit `maxHeight` bleibt der Tabellenkopf beim Scrollen stehen. Der Fuß nimmt üblicherweise eine
`Pagination variant="bar"`. `emptyText` erklärt, warum nichts da ist und was hilft — bei aktivem
Filter also anders als bei leerem Datenbestand.

## Nicht tun

- Mehrere Aktionsschaltflächen in jede Zeile legen.
- Beträge linksbündig oder in DM Sans setzen.
- Zeilen anklickbar machen **und** in der Zeile Links anbieten.
- Spalten ohne Kopf oder mit Kopf aus Abkürzungen.

## Beispiel

```jsx
<DataTable title="Verträge" selectable maxHeight={420}
  toolbar={<Search size="sm" placeholder="Suchen" />}
  footer={<Pagination variant="bar" page={s} pageSize={20} totalItems={312} onPageChange={setS} />}
  columns={[
    { key: "nr", label: "Nummer", numeric: true, sortable: true },
    { key: "kunde", label: "Kunde", sortable: true },
    { key: "status", label: "Status", render: (v) => <Tag tone={v === "Aktiv" ? "success" : "neutral"}>{v}</Tag> },
    { key: "beitrag", label: "Beitrag", numeric: true, sortable: true },
  ]}
  rows={vertraege} rowKey="nr"
  emptyText="Keine Verträge gefunden. Filter zurücksetzen?" />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/DataTable.jsx`. Tokens aus `styles.css`.
