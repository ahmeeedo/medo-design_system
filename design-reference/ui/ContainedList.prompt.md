# ContainedList

Interaktive Zeilen in einer umrandeten Karte: **navigieren** oder **auswählen**. Die Karte trägt
einen Rahmen, keinen Schatten — die Zeilen werden durch dünne Linien getrennt.

## Modi

`navigation` führt weiter: jede Zeile öffnet ein Ziel, rechts steht ein Chevron. `single` und
`multiple` wählen aus: links steht ein Radio- bzw. Checkbox-Feld, die ausgewählte Zeile liegt auf
`state-selected` (teal-100). Ein Modus pro Liste — Navigieren und Auswählen werden nie gemischt.

Braucht die Liste Spalten, Sortierung oder Bulk-Aktionen, ist es eine `DataTable`. Ist nichts
anklickbar, ist es eine `List`.

## Zeile

Titel ist Pflicht, alles andere optional: `description` erklärt die Zeile (sie wiederholt sie nicht),
`meta` steht rechts in DM Mono für Datum, Anzahl oder Betrag, `avatar` trägt zwei Buchstaben, `icon`
liegt in einer getönten Fläche. Eine Zeilenaktion (`action: "more_vert"`) ersetzt das Chevron und
sieht wie eine kleine Schaltfläche aus — sie stoppt den Klick, öffnet also nicht die Zeile.

Der Avatar in der Liste ist **einfarbig** — alle Kreise tragen Teal. Die fünfzehn Farbschemata
bleiben Tabellen vorbehalten, in denen sich Personen auf einen Blick unterscheiden sollen. Eine
Liste soll ruhiger wirken.

`avatar` trägt weiterhin die zwei Buchstaben. Wer stattdessen ein Bild zeigen will, setzt den
`Avatar` selbst in eine eigene Zeilendarstellung; die Liste nimmt keine Bildadresse entgegen.

Trägt eine Zeile eine Aktion, braucht sie eine Beschriftung — ein Icon allein sagt einem
Vorleseprogramm nichts. `actionLabel` an der Zeile beschreibt die einzelne Aktion („Termin
absagen"); `actionLabel` an der Liste setzt den gemeinsamen Rückfallwert für alle Zeilen, die
keinen eigenen tragen. Vorbelegt ist „Weitere Aktionen".

Titel und Erklärung kürzen mit Auslassungspunkten; eine Zeile bleibt eine Zeile.

## Gruppen

`groups` statt `items` setzt haftende Überschriften in Mono-Versalien (Alphabet, Datum, Kategorie).
Die Überschrift selbst ist nie anklickbar.

## Tastatur

Pfeiltasten bewegen den **Fokus**, ausgewählt wird erst mit Enter oder Leertaste — anders als bei
Tabs, wo die Auswahl dem Fokus folgt. Home und End springen an die Ränder, deaktivierte Zeilen
werden übersprungen. `navigation` rendert `role="list"`, die Auswahlmodi `role="listbox"` mit
`role="option"` und `aria-selected`.

## Leerzustand

`emptyText` erklärt, was hier entstehen wird, und entschuldigt sich nicht. Die anlegende Aktion steht
unter oder neben der Karte, nicht als leere Zeile darin.

## Nicht tun

- Navigieren und Auswählen in einer Liste mischen.
- Die Zeile anklickbar machen **und** darin mehrere Links anbieten.
- Mehr als eine Zeilenaktion pro Zeile.
- Auswahl allein über die Hintergrundfarbe anzeigen (das Auswahlfeld bleibt sichtbar).

## Beispiel

```jsx
<ContainedList title="Einstellungen" ariaLabel="Einstellungen"
  onSelect={(v) => go(v)}
  items={[
    { value: "profil", icon: "badge", label: "Profil", description: "Name, Foto, Schwerpunkte" },
    { value: "sicher", icon: "lock", label: "Sicherheit", meta: "2FA aktiv" },
    { value: "export", icon: "download", label: "Daten exportieren", disabled: true },
  ]} />

<ContainedList mode="multiple" ariaLabel="Mitglieder"
  value={gewaehlt} onChange={setGewaehlt}
  items={[
    { value: "mh", avatar: "MH", label: "Dr. Marie Hoffmann", description: "Gewerbe · Karlsruhe", meta: "12" },
    { value: "ts", avatar: "TS", label: "Tobias Schuster", description: "Vorsorge · Bruchsal", meta: "8" },
  ]} />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, `ui/Avatar.jsx`, dann `ui/ContainedList.jsx`. Tokens aus
`styles.css`.
