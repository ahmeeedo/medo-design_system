# Slider

Wert stufenlos oder in Schritten einstellen — wenn die **ungefähre Lage** wichtiger ist als die
genaue Zahl: Lautstärke, Helligkeit, Umkreis, Preisspanne.

## Wann nicht

Muss der Wert exakt sein oder getippt werden können, gehört daneben ein `NumberInput` — oder es ist
gleich nur ein Zahlenfeld. Bei wenigen benannten Stufen (drei, vier) ist ein `ContentSwitcher` oder
`Radio` klarer als ein Slider.

## Stufenlos oder diskret

Ohne `showTicks`/`stepLabels` läuft der Griff frei. Im diskreten Modus zeigen 4px-Punkte die Stufen
und `stepLabels` benennt sie unter der Bahn — die aktive Stufe steht in `text`, die übrigen in
`text-muted`. Die Bubble zeigt dann den Namen der Stufe, nicht die Zahl.

## Griff und Bubble

Der Griff ist weiß mit dünnem Rahmen (20px, sm 16px) und wirft einen leichten Schatten — er soll
über der Bahn liegen, nicht in ihr verschwinden. Beim Ziehen **und** bei Tastaturfokus erscheint die
dunkle Wert-Bubble über dem Griff; sie verschwindet danach wieder. Sie ersetzt keine dauerhafte
Wertanzeige: dafür `showValue` oder ein gekoppeltes Zahlenfeld.

## Bedienung

Ziehen, Klick auf die Bahn springt zum Wert. Tastatur: Pfeile eine Stufe, Bild auf/ab ein Zehntel
des Bereichs, Pos1/Ende an die Ränder. `role="slider"` mit `aria-valuemin/max/now`; benannte Stufen
kommen über `aria-valuetext` an.

`orientation="vertical"` nur, wenn die Größe selbst senkrecht gedacht ist (Helligkeit, Pegel).

## Nicht tun

- Slider für Werte, die exakt getroffen werden müssen.
- Bubble dauerhaft einblenden.
- Mehr als etwa zehn sichtbare Ticks.
- Ohne Label oder `ariaLabel` einsetzen.

## Beispiel

```jsx
<Slider label="Lautstärke" showValue showMinMax
        startIcon="volume_down" endIcon="volume_up"
        value={laut} onChange={setLaut} />

<Slider label="Qualität" step={1} min={0} max={3} showTicks
        stepLabels={["Niedrig", "Mittel", "Hoch", "Maximal"]}
        value={q} onChange={setQ} />

<Slider orientation="vertical" ariaLabel="Helligkeit"
        startIcon="wb_sunny" endIcon="bedtime"
        value={hell} onChange={setHell} />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/Slider.jsx`. Tokens aus `styles.css`.
