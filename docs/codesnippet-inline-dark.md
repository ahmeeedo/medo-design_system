# CodeSnippet, helle Inline-Variante im dunklen Theme — Entscheidungsvorlage

Betrifft `.medo-cds-inline` in `src/components/CodeSnippet/CodeSnippet.css` (Zeilen 1–9).
Die Blockdarstellung ist nicht Gegenstand dieser Vorlage; sie ist per Spezifikation dunkel
und bleibt in beiden Themes unverändert.

## Was heute passiert

Die Inline-Variante ist die einzige helle Fläche der Komponente. Sie trägt drei feste Werte:

| Rolle | Wert | Palettenbezug |
|---|---|---|
| Fläche | `#ececeb` | stone-100, exakt |
| Beschriftung | `#8a3f36` | palettenfremd, gedecktes Ziegelrot |
| Rahmen | `#e0ddd8` | nahe stone-200 |

Laut Spezifikation ist sie für „einzelne Befehle/Bezeichner im Fließtext" gedacht — sie sitzt
also mitten im Absatz und soll den Lesefluss nicht unterbrechen. Genau das leisten die Werte
heute: der Chip hebt sich mit **1,18:1** von der weißen Seite ab, ist also bewusst zurückhaltend,
während die Beschriftung mit **6,24:1** auf dem Chip klar über der AA-Schwelle liegt.

Im dunklen Theme bleiben diese drei Werte stehen, weil sie fest verdrahtet sind. Der Chip steht
dann mit **13,43:1** gegen die dunkle Seite — er wird damit etwa so laut wie der Fließtext selbst
(stone-50 auf stone-1000 liegt bei rund 13,9:1). Aus einer zurückhaltenden Auszeichnung wird ein
heller Fleck, der die Zeile zerreißt.

## Möglichkeiten

### A — unverändert lassen

Der Chip bleibt hell. Treu zur Referenz, aber die Zurückhaltung, die die Variante im Hellen
auszeichnet, kehrt sich im Dunkeln in ihr Gegenteil um. Kostet nichts, ist aber der einzige
Vorschlag, der im Dunkeln sichtbar falsch aussieht.

### B — dunkle Gegenwerte nach demselben Verfahren wie die übrigen fünf Komponenten *(Empfehlung)*

| Rolle | hell (unverändert) | dunkel | Herleitung |
|---|---|---|---|
| Fläche | `#ececeb` | `--medo-surface-sunken` → stone-1100 | stone-100 ist der helle Wert dieses Tokens |
| Rahmen | `#e0ddd8` | `--medo-border-subtle` → stone-800 | nächste Stufe stone-200, Rahmenzuordnung 200→800 |
| Beschriftung | `#8a3f36` | `--medo-color-red-300` | tiefer Rotakzent, Akzentzuordnung 800→300 |

Messwerte im Dunkeln, jeweils neben dem hellen Gegenstück:

| Verhältnis | hell | dunkel |
|---|---|---|
| Beschriftung auf Chip | 6,24:1 | **10,31:1** |
| Chip gegen die Seite | 1,18:1 | **1,15:1** |
| Rahmen auf Chip | 1,15:1 | **1,60:1** |

Die Zurückhaltung des Chips wird damit fast exakt gespiegelt (1,18:1 gegen 1,15:1), die Lesbarkeit
der Beschriftung steigt sogar. Der Rahmen wird eine Spur deutlicher, bleibt aber dezent.

Alle drei Dunkelwerte stammen aus der freigegebenen Palette; nichts wird erfunden. Die hellen
Werte bleiben unangetastet und werden durch `src/styles/component-theme.test.js` abgesichert.

### C — im Dunkeln die Palette der Blockdarstellung übernehmen

Fläche `#211f1c`, Beschriftung `#e4e0d8`, Rahmen `#322f2b`. Beide Varianten sähen dann gleich aus.
Der Chip stünde jedoch mit rund 1,1:1 gegen die Seitenfläche stone-1000 und wäre praktisch
unsichtbar — die Auszeichnung ginge verloren. Nicht empfohlen.

### D — an das medo-Design-Projekt zurückgeben

Die Dunkelwerte der Inline-Variante als Änderungswunsch protokollieren und hier vorerst nichts tun.
Sauber in der Zuständigkeit, lässt die Variante aber bis zur Rückmeldung im Zustand von A.
Möglich als Ergänzung zu B: B jetzt umsetzen, die Werte zusätzlich zurückmelden.

## Empfehlung

**B.** Es ist dasselbe Verfahren, das für DatePicker, FileUploader, Loading und ContainedList
bereits umgesetzt und geprüft ist, es hält die helle Darstellung nachweisbar unverändert, und es
erhält die Eigenschaft, auf die es bei dieser Variante ankommt: im Text zu stehen, ohne ihn zu
unterbrechen.
