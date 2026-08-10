# Link

Führt zu einem anderen Ort — innerhalb der Anwendung oder nach außen.

## Link oder Button

Ein Link **navigiert**, ein Button **handelt**. Führt das Element zu einer anderen Seite oder
Ansicht, ist es ein Link. Ändert es etwas, sendet ab oder öffnet einen Dialog, ist es ein Button —
auch wenn es aussieht wie ein Link. Diese Unterscheidung ist keine Stilfrage: Screenreader
kündigen beide unterschiedlich an, und ein Link lässt sich in einem neuen Tab öffnen.

## Zwei Muster

`standalone` steht für sich — am Ende eines Absatzes, in einer Kartenfußzeile, neben einer
Überschrift. Ohne Unterstreichung im Ruhezustand, weil er dort durch seine Position erkennbar ist.

`inline` steht mitten im Fließtext und ist **immer unterstrichen**. Ein Link im Text, der sich nur
über seine Farbe erklärt, ist für farbfehlsichtige Leser unsichtbar.

## Linktext

Der Text benennt das Ziel: „Barrierefreiheits-Richtlinien", nicht „hier klicken", nicht „mehr".
Verlinke gezielte Begriffe, keine ganzen Sätze — der unterstrichene Bereich ist die Trefferfläche
und sollte so groß sein wie nötig, nicht wie möglich.

## Extern

`external` setzt das Glyph `open_in_new`, `target="_blank"` und `rel="noopener noreferrer"`.
Kennzeichne externe Ziele immer — ein Sprung aus der Anwendung heraus soll nicht überraschen.

## Zustände

Hover und Aktiv wechseln nur die Farbe auf `text-link-hover` — die Unterstreichung bleibt, wie sie
ist: standalone ohne, inline mit, und die Strichstärke ändert sich nie. Der Fokusring ist der
übliche 3px-Ring. Ein deaktivierter Link ist ein Widerspruch in sich — wenn ein Ziel nicht
erreichbar ist, zeige stattdessen Text ohne Link. `disabled` gibt es nur für Übergangszustände.

## Nicht tun

- Links nur über Farbe erkennbar machen.
- „Hier klicken" oder „mehr" als Linktext.
- Ganze Sätze verlinken.
- Einen Link verwenden, wo eine Aktion ausgelöst wird.
- Die Unterstreichung im Fließtext entfernen.

## Beispiel

```jsx
<Link href="/tokens">Mehr erfahren</Link>
<Link href="/weiter" icon="arrow_forward">Weiter</Link>
<Link href="https://…" external>Dokumentation öffnen</Link>

<p>Alle Farben folgen den <Link variant="inline" href="/tokens">Design-Tokens</Link> des Systems.</p>
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/Link.jsx`. Tokens aus `styles.css`.
