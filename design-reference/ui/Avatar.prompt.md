# Avatar

Zeigt, um welche Person es geht. Ein Kreis mit Bild, sonst mit zwei Buchstaben, sonst mit
einem Personen-Symbol. Immer rund — **rund ist im System eine Person, eckig eine Sache.**
Diese Unterscheidung ist durchgehend eingehalten; eine eckige Avatar-Variante gibt es nicht.

## Die Farbe gehört zur Person

Das Farbschema wird **bei der Registrierung vergeben** und ist von der Person **später
änderbar**. Der Aufrufer übergibt den gespeicherten Wert; die Komponente rechnet nichts aus.

Daraus folgt dreierlei:

- **Die Farbe wird nie berechnet** — nicht aus dem Namen, nicht aus der Position in einer
  Liste, nicht aus einer laufenden Nummer. Eine berechnete Farbe ließe sich nicht ändern und
  spränge beim Umsortieren.
- **Zwei Personen dürfen dieselbe Farbe haben.** Das Schema ist eine persönliche Einstellung,
  kein eindeutiges Erkennungszeichen. Bei fünfzehn Farben und freier Wahl ließe sich
  Eindeutigkeit ohnehin nicht erzwingen. Das ist kein Fehler und darf nicht „repariert" werden.
- **Die Farbe trägt keine Bedeutung.** Sie sagt nichts über Rolle, Status oder Rang.
  **Es wird nicht nach Farbe sortiert und nicht nach Farbe gefiltert.**

Alle fünfzehn Schemata tragen weiße Schrift und sind auf Lesbarkeit geprüft. Sie müssen als
**Auswahl** taugen, nicht nur als Zuteilung: Die Person wählt selbst, keine Wahl darf schlecht
aussehen.

## Was im Kreis steht

In dieser Reihenfolge:

1. **Bild**, kreisrund beschnitten — sobald `src` gesetzt ist und lädt.
2. **Zwei Buchstaben** — wenn kein Bild da ist **oder das Bild nicht lädt**.
3. **Personen-Symbol** — wenn es gar keinen Namen gibt: gelöschtes Konto, offene Einladung,
   Systemvorgang ohne Person dahinter.

Dass ein Bild nicht lädt, ist kein Sonderfall. Veraltete Adresse, Server antwortet nicht, Netz
weg — das tritt im Betrieb regelmäßig ein. Der Anwender sieht dann kein kaputtes Bildsymbol,
sondern schlicht die Buchstaben. Der Rückfall ist als Fehler nicht erkennbar, und das ist gewollt.

## Die Buchstaben

Aus Vor- und Nachname, sonst aus dem Benutzernamen. Rangfolge der Trennzeichen: **Leerzeichen
schlägt Punkt, Punkt schlägt Bindestrich und Unterstrich.** Kommt keines vor, trennt die
Binnengroßschreibung; bleibt auch die aus, zählen die ersten zwei Zeichen. Bei einer
E-Mail-Adresse zählt nur der Teil vor dem `@`.

Die Rangfolge hält Doppelvornamen zusammen: „Anna-Lena Schmidt" ergibt **AS**, nicht AL.

| Eingabe | Ergebnis |
|---|---|
| `Andreas Müller` | AM |
| `PeterZeider` | PZ |
| `renatosanches` | RE |
| `Dr. Marie Hoffmann` | DM |
| `anna.mueller` | AM |
| `anna@medo.de` | AN |
| `Anna-Lena Schmidt` | AS |
| `Müller` | MÜ |

`initials` übergeht die Ableitung, wenn eine Anwendung die Buchstaben schon kennt.

## Maße

**30px (`sm`)** in Tabellenzeilen, **38px (`md`)** in Listenzeilen, **64px (`lg`)** auf
Profilseiten. Mehr Größen gibt es nicht.

30 und 38 liegen bewusst neben den Abstandsstufen — beide Maße werden bereits so ausgeliefert.
**Nicht auf Token-Stufen ziehen.** 64px ist `space-3xl` und damit token-genau.

## Für Vorleseprogramme

Der Avatar ist **stumm**, solange der Name daneben steht — „AM" vorgelesen zu bekommen hilft
niemandem. Steht er ausnahmsweise allein, gibt der Aufrufer `label` mit; dann wird er als Bild
mit Beschriftung angekündigt.

## Nicht tun

- Die Farbe aus dem Namen oder der Zeilennummer errechnen.
- Nach Farbe sortieren oder filtern, oder ihr eine Bedeutung geben.
- Eindeutigkeit der Farben erzwingen wollen.
- Eine eckige Variante bauen — eckig ist im System eine Sache, keine Person.
- Einen Anwesenheitspunkt, überlappende Gruppen oder einen klickbaren Avatar ergänzen.
  Nichts davon kommt im System vor.
- Den Avatar ohne `label` allein stehen lassen.

## Beispiel

```jsx
<Avatar name="Andreas Müller" color="blue" />
<Avatar name="Andreas Müller" color="blue" src={person.bild} size="lg" />
<Avatar loading size="sm" />
<Avatar label="Gelöschtes Konto" />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/Avatar.jsx`. Tokens aus `styles.css`.
