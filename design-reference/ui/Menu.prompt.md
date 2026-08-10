# Menu

Kontextmenü auf **Rechtsklick**, an der Cursorposition. Es ist eine Abkürzung für Geübte, nie der
einzige Weg zu einer Aktion.

## Wann

Für Objekte, mit denen man viel arbeitet: Dateien, Zeilen einer Tabelle, Karten in einer Übersicht.
Jede Aktion daraus muss **auch** sichtbar erreichbar sein — über einen Kebab-`Dropdown`, eine
Toolbar oder die Detailseite. Auf Touch-Geräten gibt es keinen Rechtsklick.

Ein Menü an einem sichtbaren Auslöser ist ein `Dropdown`, ein Menü an der Hauptaktion ein
`SplitButton` aus `MenuButtons`.

## Verhalten

Öffnet am Cursor und kippt an den Fensterrändern nach innen, damit nichts abgeschnitten wird. Es
schließt bei Auswahl, Esc, Klick außerhalb und beim Scrollen. Es ist immer nur ein Menü offen.

Die Einträge sind dieselben wie im `Dropdown`: `heading` gliedert, `divider` trennt, `danger` steht
zuletzt, Untermenüs gehen eine Ebene tief. Pfeile bewegen, Enter wählt, Tippen springt.

## Inhalt

Nur Aktionen, die sich auf das angeklickte Objekt beziehen — vier bis acht Einträge. Was für die
ganze Seite gilt, gehört nicht hierher. Der erste Eintrag ist die häufigste Aktion, nicht die
gefährlichste.

## Nicht tun

- Aktionen ausschließlich im Kontextmenü anbieten.
- Das Browser-Kontextmenü auf normalem Text oder in Eingabefeldern ersetzen.
- Mehr als etwa acht Einträge.
- Als Ersatz für eine Toolbar benutzen.

## Beispiel

```jsx
<Menu ariaLabel="Aktionen zur Datei"
  onSelect={(v) => tun(v, datei)}
  items={[
    { value: "oeffnen", icon: "open_in_new", label: "Öffnen", shortcut: "Enter" },
    { value: "umbenennen", icon: "edit", label: "Umbenennen", shortcut: "F2" },
    { type: "divider" },
    { value: "loeschen", icon: "delete", label: "Löschen", danger: true },
  ]}>
  <div className="kachel">…</div>
</Menu>
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, `ui/Dropdown.jsx` (liefert `MenuList`), dann
`ui/Menu.jsx`. Tokens aus `styles.css`.
