# Kurzreferenz — med.o Design System

Diese Karte beantwortet **eine** Frage: *Habe ich etwas vergessen?*

Sie erklärt nichts. Wie ein Handgriff geht, steht in `DEVELOPMENT.md`; jeder
Block hier verweist auf das Kapitel, das ihn durchgeht. Die Trennlinie zwischen
beiden Dateien ist die Regel, an der auch spätere Ergänzungen entlanglaufen:

> Was **erklärt**, gehört in den Leitfaden. Was nur **erinnert**, gehört hierher.

Deshalb stehen hier keine Prozeduren, keine Codebeispiele und keine
Begründungen — nur Haken und Fallen.

---

## Neue Doku-Seite — fünf Stellen

Keine ist optional. Fehlt eine, fällt die Testsuite oder die Suche.

- [ ] `src/pages/<Name>Page.jsx` angelegt, **default** exportiert
- [ ] `src/App.jsx`: Import **und** Zeile in `ROUTES`
- [ ] `src/docs/DocsLayout.jsx`: Eintrag in `NAV`, `id` = Pfad ohne Schrägstrich
- [ ] `de.json` **und** `en.json`: jeder Text
- [ ] `npm run search-index` gelaufen
- [ ] Soll die Route bewusst nicht in den Seitenstreifen: Pfad in `NAV_EXEMPT`
      in `src/config/searchData.test.jsx`
- [ ] `<DemoPanel>` als erstes Element im Overview-Tab — oder bewusst keins
- [ ] Jede `h2` steht in einem `<Section>`-Wrapper

→ `DEVELOPMENT.md` Kapitel 5 und 6

---

## Neue oder geänderte Komponente

- [ ] Ablage `src/components/<Name>/<Name>.jsx` + `<Name>.css`
- [ ] Klassenpräfix projektweit eindeutig geprüft
- [ ] Benannter Export, durchgereicht in `src/components/index.js`
- [ ] Jede in der `.d.ts` deklarierte Prop und Variante funktioniert
- [ ] Keine Prop, die die `.d.ts` nicht kennt
- [ ] Inline-Stile mit Token-Werten in Längsformen
- [ ] Icons über die `Icon`-Komponente
- [ ] Verhaltensanteile in `<Name>.test.jsx` belegt
- [ ] Gegenprobe gefahren: eine Zusicherung verdreht, Lauf wurde rot,
      Zusicherung zurückgedreht
- [ ] Visueller Abgleich gegen `design-reference/components/<Name>.dc.html`

→ `DEVELOPMENT.md` Kapitel 4 und 9

---

## Token- oder Theme-Änderung

- [ ] Nichts unter `src/styles/medo/` angefasst
- [ ] Nur der dunkle Zweig des `light-dark()`-Paares geändert
- [ ] Portierte Komponente unverändert; Nachbesserung in
      `medo-theme-components.css`
- [ ] Alles Theme-Abhängige zeigt auf ein semantisches Token, nicht auf Brand
      oder Alias
- [ ] Zwischenwerte aus Tokens gerechnet, nicht hartkodiert
- [ ] `npm test` — die Kontrastprüfung läuft mit
- [ ] Sichtprüfung in **beiden** Themes

→ `DEVELOPMENT.md` Kapitel 3

---

## Vor dem Commit

- [ ] Jeder sichtbare Text läuft über `t()`, jeder Schlüssel steht in `de.json`
      **und** `en.json`
- [ ] Kein hartkodierter Farb-, Abstands-, Radius- oder Schattenwert
- [ ] `npm run build` fehlerfrei
- [ ] `npm test` fehlerfrei
- [ ] Bei Komponenten- oder Seitenänderungen: `npm run dev`, alle Tabs, beide
      Themes, Desktop und ≤ 768 px
- [ ] Genau **ein** Entwicklungsserver lief dabei
- [ ] Eigener Zweig von `main`, Betreff deutsch, kleingeschrieben, ohne Umlaute

→ `DEVELOPMENT.md` Kapitel 11

---

## Stumme Fallen

Keiner dieser Fehler erzeugt einen Build-Fehler. Sie fallen erst im Browser
auf — oder gar nicht.

| Falle | Woran man es merkt |
|---|---|
| Brand- oder Alias-Token für etwas Theme-Abhängiges | Fläche bleibt im Dunkeln hell |
| Kurzform-Inline-Stil mit `var()` | ein Teil der Kanten färbt sich, der Rest nicht |
| Doppelter Klassenpräfix | zwei Komponenten überschreiben einander |
| `h2` außerhalb `<Section>` | Inhaltsverzeichnis und Suchtreffer springen ins Ungefähre |
| Zählung über die nackte Zeichenkette im Test | Anzahl liegt zu hoch — `__dot` steckt in `__dots` |
| `userEvent` bei Zeitgebern | Test hängt oder wird flatterig |
| Portal-Komponente serverseitig gerendert | leeres Markup, sieht nach Portierungsfehler aus |
| Zweiter `@theme inline`- oder `:root`-Block | Auflösung bricht ohne Meldung |
| Rundlauf über `JSON.parse`/`JSON.stringify` auf den Locale-Dateien | Änderung über alle 3175 Zeilen |
| `git diff` auf `src/styles/medo/` | Prüfsummen weichen immer ab — CRLF gegen LF |
| `design-reference/ui/*.card.html` als Abgleichsgrundlage | Seite rendert leer |

Zwei Sätze, die man sich falsch merkt:

- **Portale liegen ausschließlich in `Modal`, `Popover` und `Tooltip`.** `Menu`
  arbeitet mit `position: fixed`, nicht mit einem Portal.
- **Brand und Alias wechseln nicht mit dem Theme.** Nur die semantische Ebene
  tut das.

→ `DEVELOPMENT.md` Kapitel 3, 4, 5 und 9

---

## Bekannter Defekt

`npm run search-index` bricht derzeit ab (`window.matchMedia is not a
function`, Beendigungscode 1) und schreibt nichts. Der vorhandene Index ist in
sich stimmig, aber wer eine Seite hinzufügt oder eine Abschnittsüberschrift
ändert, kommt bis zur Behebung nicht an einen grünen `npm test`.

→ `DEVELOPMENT.md` Kapitel 8
