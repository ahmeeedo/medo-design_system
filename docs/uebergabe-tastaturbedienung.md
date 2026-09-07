# Übergabe an das medo-Design-Projekt — verdrängte Tastaturbedienung

**Stand:** 07.09.2026 · **Status:** zur Freigabe vorgelegt

**Leser:** die KI im medo-Design-Projekt.

---

## 0 · Was dieses Dokument ist

Drei Komponenten setzen ihren eingebauten Ereignisbehandler **vor** `...rest`. Übergibt ein
Aufrufer einen eigenen Behandler desselben Namens, ersetzt er den eingebauten — und mit ihm die
**gesamte Tastaturbedienung** der Komponente.

Die Folge ist stumm: nichts bricht, nichts färbt sich rot, kein Build meldet etwas. Nur die
Pfeiltasten, Escape und Enter tun nichts mehr.

Es ist dieselbe Fehlerklasse wie in Änderung 10 des Vertragsdokuments, dort an den acht
Feldkomponenten. Diese drei sind der Rest.

**Drei Änderungen, in beliebiger Reihenfolge auszuführen** — sie berühren einander nicht.

| # | Datei | Stelle | Verdrängt |
|---|---|---|---|
| 1 | `ui/ContentSwitcher.jsx` | Wurzelelement der Segmentleiste | `onKeyDown` |
| 2 | `ui/Dropdown.jsx` | Wurzelelement von **MenuList** | `onKeyDown` |
| 3 | `ui/Menu.jsx` | Wurzelelement der Hülle | `onContextMenu` |

**`Dropdown` selbst ist nicht betroffen.** Sein Wurzelelement trägt gar keinen Ereignisbehandler;
der Behandler des Auslösers liegt tiefer und wird von `...rest` nicht erreicht. Nachgeprüft.

Nach den Änderungen ist `_ds_bundle.js` neu zu bauen.

---

## 1 · `ui/ContentSwitcher.jsx`

**Stelle 1 — die Signatur, am Ende:**

Alt

```js
  className,
  style,
  ...rest
}) => {
```

Neu

```js
  className,
  style,
  onKeyDown: onKeyDownProp,
  ...rest
}) => {
```

**Stelle 2 — das Wurzelelement der Segmentleiste:**

Alt

```js
      "aria-orientation": "horizontal",
      onKeyDown,
```

Neu

```js
      "aria-orientation": "horizontal",
      onKeyDown: (e) => { onKeyDown(e); if (onKeyDownProp) onKeyDownProp(e); },
```

**Die Reihenfolge ist wesentlich:** der eingebaute Behandler läuft zuerst. Er fängt die
Pfeiltasten sowie Home und End ab und ruft `preventDefault`, bevor der Aufrufer etwas sieht.

---

## 2 · `ui/Dropdown.jsx` — die Komponente **MenuList**

Die Datei enthält zwei Komponenten. Zu ändern ist **MenuList**, nicht `Dropdown`.

**Stelle 1 — die Signatur von MenuList, am Ende:**

Alt

```js
  selectionMode,
  className,
  style,
  ...rest
}) => {
```

Neu

```js
  selectionMode,
  className,
  style,
  onKeyDown: onKeyDownProp,
  ...rest
}) => {
```

**Stelle 2 — das Wurzelelement von MenuList (`role: "menu"`):**

Alt

```js
      tabIndex: -1,
      onKeyDown,
```

Neu

```js
      tabIndex: -1,
      onKeyDown: (e) => { onKeyDown(e); if (onKeyDownProp) onKeyDownProp(e); },
```

An diesem Behandler hängen die Pfeiltasten, Home und End, Enter, Escape und die
Anfangsbuchstaben-Suche. Er ist die gesamte Tastaturbedienung der Menüfläche — und damit auch
die von `Menu` und `MenuButtons`, die MenuList verwenden.

---

## 3 · `ui/Menu.jsx`

**Stelle 1 — die Signatur, am Ende:**

Alt

```js
  className,
  style,
  ...rest
}) => {
```

Neu

```js
  className,
  style,
  onContextMenu: onContextMenuProp,
  ...rest
}) => {
```

**Stelle 2 — das Wurzelelement der Hülle:**

Alt

```js
      className: ["medo-ctx", className].filter(Boolean).join(" "),
      onContextMenu,
```

Neu

```js
      className: ["medo-ctx", className].filter(Boolean).join(" "),
      onContextMenu: (e) => { onContextMenu(e); if (onContextMenuProp) onContextMenuProp(e); },
```

Der eingebaute Behandler ruft `preventDefault` und öffnet das Kontextmenü an der Cursorposition.
Ohne ihn erscheint das Menü des Browsers statt des eigenen.

---

## Was danach anders ist

**Nichts an der Oberfläche, solange kein Aufrufer einen eigenen Behandler übergibt.** Wer keinen
übergibt, merkt keinen Unterschied.

Wer heute einen übergibt, bekommt danach die eingebaute Bedienung zurück, die er ohne Absicht
entfernt hatte. Es bricht nichts: sein eigener Behandler läuft weiterhin, nur eben zusätzlich
statt anstelle.

## Was ausdrücklich unberührt bleibt

- **`Dropdown` selbst** — nicht betroffen, siehe oben. Nicht „mitnehmen".
- **Alle `aria`-Angaben.** In denselben Komponenten stehen weitere Attribute vor `...rest`
  (`aria-label`, `aria-orientation`, `aria-expanded`, `aria-hidden` und andere). Sie sind
  **nicht Gegenstand dieses Dokuments** und bleiben, wie sie sind. Ein Aufrufer, der ein
  `aria`-Attribut selbst setzt, tut das absichtlich; ein Aufrufer, der ein `onKeyDown` setzt,
  will fast nie die Tastaturbedienung abschalten. Das ist der Unterschied, der diese drei
  Änderungen von den übrigen trennt.
- **`onSelect`, `onChange`, `onClose`** — überall destrukturiert, nicht betroffen.
- **Die Behandler tieferliegender Elemente** (Auslöser, Segmente, Einträge). `...rest` erreicht
  sie nicht.
- **Alle `components/*.dc.html`, alle `ui/*.card.html`, `styles.css`, `tokens*`.** Keine
  Spezifikationsseite und keine Karte ist zu ändern.

## Nach dem Anwenden

1. `_ds_bundle.js` neu bauen.
2. `ui/ContentSwitcher.card.html`, `ui/Dropdown.card.html` und `ui/Menu.card.html` im Browser
   öffnen — alle drei müssen sich verhalten wie zuvor: Pfeiltasten wechseln das Segment, im Menü
   bewegen sie die Auswahl, Escape schließt, Rechtsklick öffnet das Kontextmenü.
3. Danach wird der Spiegel im abgeleiteten Projekt neu gezogen.
