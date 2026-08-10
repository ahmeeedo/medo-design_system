# ContentSwitcher

Wechselt die **Darstellung desselben Inhalts**: Liste / Raster / Kanban, Monat / Quartal / Jahr,
Diagrammtyp. Der Gegenstand bleibt derselbe, nur die Sicht ändert sich.

## Abgrenzung

Wechseln sich ganze **Ansichten** eines Objekts ab (Profil, Netzwerk, Anfragen), sind es `Tabs`.
Löst der Klick eine **Handlung** aus, ist es ein `Button`. Geht es um eine Einstellung, die
gespeichert wird, sind es `Radio`-Optionen. Der ContentSwitcher schaltet immer sofort und speichert
nichts.

## Stile

`neutral` liegt auf einer stone-100-Leiste, das aktive Segment ist weiß mit `shadow-sm` — der
Standardfall, ruhig genug für Toolbars. `outline` teilt einen Rahmen und füllt das aktive Segment
mit primary-600; sinnvoll, wenn die Leiste auf einer bereits getönten Fläche liegt und die neutrale
Bahn dort verschwindet.

Zwei bis fünf Segmente. Mehr wird ein `Select` — eine Leiste, die scrollen muss, ist keine Leiste
mehr.

## Beschriftung

Ein Wort pro Segment. Alle Segmente sind gleich breit (`equalWidth`, Standard), damit beim Wechsel
nichts springt. `iconOnly` ist nur für allgemein bekannte Darstellungen erlaubt (Liste, Raster). Das `label`
wird dann zum `aria-label` **und** erscheint bei Hover oder Fokus als dunkler Hinweis über dem
Segment — ein zusätzlicher `Tooltip` ist nicht nötig und würde doppelt erscheinen.

## Tastatur

Als `role="tablist"` mit `role="tab"` gerendert: Pfeiltasten wechseln direkt, Home und End springen
an die Ränder, deaktivierte Segmente werden übersprungen. Nur das aktive Segment liegt im
Tab-Index. Der zugehörige Inhalt wird von der Seite gerendert und trägt `role="tabpanel"`.

## Nicht tun

- Als Filter mit mehreren gleichzeitigen Werten benutzen — das sind auswählbare `Tag`s.
- Mehr als fünf Segmente zeigen.
- Icon-only mit Icons, die man raten muss.
- Die Segmentbreite an den Text koppeln, sodass die Leiste beim Wechsel die Breite ändert.

## Beispiel

```jsx
<ContentSwitcher ariaLabel="Ansicht" iconOnly
  items={[
    { value: "liste", label: "Liste", icon: "view_list" },
    { value: "raster", label: "Raster", icon: "grid_view" },
    { value: "kanban", label: "Kanban", icon: "view_kanban" },
  ]}
  value={ansicht} onChange={setAnsicht} />

<ContentSwitcher variant="outline" size="sm"
  items={[
    { value: "monat", label: "Monat" },
    { value: "quartal", label: "Quartal" },
    { value: "jahr", label: "Jahr", disabled: true },
  ]}
  defaultValue="monat" />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/ContentSwitcher.jsx`. Tokens aus
`styles.css`.
