# Dropdown · MenuList

Ein Auslöser öffnet eine Liste von **Aktionen**. `MenuList` ist die gemeinsame Menüfläche des
Systems; `Menu` (Kontextmenü) und `MenuButtons` benutzen dieselbe Fläche.

## Abgrenzung

Ein Dropdown führt Aktionen aus. Wird ein **Wert für ein Formular** gewählt, ist es ein `Select` —
mit Feldrahmen, Label und Fehlerzustand. Steht im Menü mehr als eine Zeile Inhalt, ist es ein
`Popover`. Für die Hauptaktion einer Seite mit Varianten daneben: `MenuButtons` (Split-Button).

## Auslöser

`button` trägt Label und Chevron (der sich beim Öffnen dreht), `kebab` ist das flache
`more_vert`-Icon für Zeilen- und Kartenaktionen — es braucht immer ein `ariaLabel`. Menüs, die an
einem rechts liegenden Auslöser hängen, mit `align="end"` ausrichten, damit sie nicht aus der Karte
laufen.

## Einträge

Verb im Infinitiv, das die Handlung benennt („Profil duplizieren"). `icon` nur, wenn alle Einträge
eines Blocks eines haben — halbe Icon-Spalten sind unruhig. `shortcut` nur anzeigen, wenn das Kürzel
wirklich greift. `heading` gliedert lange Menüs in Mono-Versalien, `divider` trennt Blöcke.

Die **zerstörende** Aktion steht als letzter Eintrag, `danger: true`, und öffnet einen
Bestätigungs-`Modal` — sie löscht nicht direkt aus dem Menü. Untermenüs (`items`) sind auf eine
Ebene begrenzt.

Mit `selectionMode="single"` bzw. `"multiple"` bekommt jeder Eintrag eine Häkchen-Spalte und die
Rolle `menuitemradio`/`menuitemcheckbox`; für Mehrfachauswahl `keepOpen: true` setzen, damit das
Menü offen bleibt.

## Verhalten

Öffnen per Klick, Enter oder Pfeil nach unten; der erste Eintrag bekommt den Fokus. Pfeile bewegen,
Enter wählt, Esc und Klick außerhalb schließen und geben den Fokus an den Auslöser zurück. Tippen
springt zum passenden Eintrag. Es ist immer nur ein Menü offen.

## Nicht tun

- Formularwerte im Dropdown wählen.
- Mehr als etwa zehn Einträge ohne Gliederung.
- Zerstörende Aktion oben oder ohne Bestätigung.
- Untermenü im Untermenü.
- Ein Kebab-Menü ohne `ariaLabel`.

## Beispiel

```jsx
<Dropdown label="Aktionen" items={[
  { value: "bearbeiten", icon: "edit", label: "Bearbeiten", shortcut: "E" },
  { value: "duplizieren", icon: "content_copy", label: "Duplizieren" },
  { type: "divider" },
  { value: "loeschen", icon: "delete", label: "Profil löschen", danger: true },
]} onSelect={(v) => tun(v)} />

<Dropdown trigger="kebab" align="end" ariaLabel="Weitere Aktionen" items={zeilenAktionen} />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/Dropdown.jsx`. `ui/Menu.jsx` und
`ui/MenuButtons.jsx` setzen diese Datei voraus (sie liefert `MenuList`). Tokens aus `styles.css`.
