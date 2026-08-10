# Tabs

Wechsel zwischen **gleichrangigen Ansichten desselben Objekts** — dieselbe Person, dieselbe Akte,
andere Sicht darauf.

## Wann welcher Stil

`underline` ist der Normalfall: Tabs, die einen Seitenbereich gliedern. Der Indikator sitzt unter
dem aktiven Tab, eine durchgehende Grundlinie gibt es nicht — die Leiste soll die Fläche nicht
teilen. `contained` liegt auf einer stone-100-Leiste und ist für Tabs **innerhalb** einer Karte oder
neben einer Toolbar gedacht, wo eine Unterstreichung mit dem Kartenrand kollidiert.

Geht es nicht um Ansichten, sondern um die **Darstellung derselben Liste** (Liste / Raster /
Kanban), ist es ein `ContentSwitcher`. Geht es um Schritte einer Abfolge, ein
`ProgressIndicator`.

## Aufbau

Ein bis zwei Wörter pro Label, keine Sätze, kein Title Case. Ein `badge` trägt nur eine Anzahl —
kein Statuswort und kein „neu". Ab etwa sieben Tabs `scrollable` setzen; bei sehr vielen Bereichen
ist die vertikale Form (`orientation="vertical"`) die ruhigere Lösung.

`fullWidth` nur, wenn die Tabs eine Karte oder ein Sheet vollständig überspannen — auf breiten
Seiten laufen die Labels sonst weit auseinander.

## Panel

Kinder werden als `role="tabpanel"` des aktiven Tabs gerendert und bleiben ungestylt: Abstand,
Fläche und Radius setzt die Seite. Der Panel-Inhalt wird bei jedem Wechsel neu gemountet — Zustand,
der den Wechsel überleben soll, gehört nach außen.

## Tastatur

Pfeiltasten wechseln direkt (die Auswahl folgt dem Fokus), Home und End springen an die Ränder,
deaktivierte Tabs werden übersprungen. Nur der aktive Tab liegt im Tab-Index; von dort führt Tab
weiter in das Panel.

## Nicht tun

- Schritte oder eine Reihenfolge in Tabs abbilden.
- Tabs verschachteln — eine zweite Ebene wird nicht als Tabs gezeigt.
- Ansichten mit unterschiedlichen Gegenständen mischen (Profil / Einstellungen der App).
- Einen Tab beim Wechsel etwas absenden lassen; Tabs zeigen, sie speichern nicht.

## Beispiel

```jsx
<Tabs ariaLabel="Profilbereiche"
      items={[
        { value: "profil", label: "Profil", icon: "person" },
        { value: "netz", label: "Netzwerk", icon: "group", badge: 12 },
        { value: "anfragen", label: "Anfragen", icon: "mail", badge: 3 },
        { value: "archiv", label: "Archiv", disabled: true },
      ]}
      defaultValue="profil">
  <div style={{ marginTop: 22 }}>…</div>
</Tabs>

<Tabs variant="contained" size="sm"
      items={[{ value: "m", label: "Monat" }, { value: "j", label: "Jahr" }]}
      value={zeitraum} onChange={setZeitraum} />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/Tabs.jsx`. Tokens aus `styles.css`.
