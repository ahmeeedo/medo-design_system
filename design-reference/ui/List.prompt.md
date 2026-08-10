# List · KeyValueList

Statische Aufzählung. **Nichts darin ist anklickbar** — sobald Zeilen navigieren oder auswählen,
ist es eine `ContainedList`, und für Datenzeilen mit Spalten eine `DataTable`.

## Varianten

`unordered` für Sammlungen ohne Reihenfolge, `ordered` nur wenn die Reihenfolge etwas bedeutet
(Schritte, Rangfolge) — die Ziffern stehen in DM Mono. `content` ist die Zeilenform mit Titel,
Erklärung und optionalem Icon, getrennt durch dünne Linien; `flush` nimmt die Linien weg, wenn die
Liste in einer bereits umrandeten Karte steht.

Verschachtelung ist auf **eine** Ebene begrenzt. Was tiefer gehen müsste, braucht Überschriften
oder ein `Accordion`.

## KeyValueList

Für Detailangaben zu einem Objekt: links das Label in `text-muted`, rechts der Wert. Zahlen, Beträge,
IDs und Datumsangaben mit `numeric: true` markieren — sie stehen dann in DM Mono mit Tabellenziffern,
damit Werte untereinander stehen. In schmalen Spalten `layout="stacked"`.

Ist ein Wert leer, steht dort ein Gedankenstrich „—", nie eine leere Zelle und nie „k. A.".

## Leere Liste

`emptyText` erklärt, was hier entstehen wird („Noch keine Schwerpunkte hinterlegt."). Nie nur
„Keine Daten". Die anlegende Aktion steht daneben, nicht im Text.

## Nicht tun

- Anklickbare Zeilen in eine `List` legen.
- `ordered` verwenden, wo die Reihenfolge zufällig ist.
- Tiefer als eine Ebene verschachteln.
- Beträge oder IDs in DM Sans setzen.

## Beispiel

```jsx
<List items={["Gewerbeversicherung", "Betriebliche Altersvorsorge", "Cyberrisiken"]} />

<List variant="content" items={[
  { icon: "verified", title: "IHK-Zulassung", description: "Seit 2014, geprüft am 12.03.2026" },
  { icon: "place", title: "Region", description: "Karlsruhe und Umkreis 50 km" },
]} />

<KeyValueList items={[
  { key: "Vertragsnummer", value: "VN-2026-0184", numeric: true },
  { key: "Beitrag", value: "1.234,56 €", numeric: true },
  { key: "Status", value: "Aktiv" },
]} />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/List.jsx`. Tokens aus `styles.css`.
