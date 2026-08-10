# CodeSnippet

Code lesbar und kopierbar darstellen — inline im Text, als einzelne Zeile, als Block mit
Zeilennummern oder als Terminal-Ausgabe.

## Formen

`inline` steht im Fließtext auf hellem Grund (#ececeb, Schrift #8a3f36) — für einzelne Befehle und
Bezeichner, ohne Kopieren-Schaltfläche. `single` ist eine Zeile mit Kopieren. `block` hat eine
Kopfleiste mit Sprach-Label und Kopieren, Zeilennummern in der Rinne und klappt ab acht Zeilen ein.
`terminal` zeigt statt des Sprach-Labels drei Punkte und setzt `$`-Prompts in Grün.

Block und Terminal stehen auf **#211f1c** — die einzige dunkle Fläche im System. Das ist Absicht:
Code soll sich vom Rest der Oberfläche abheben.

## Syntaxfarben

`highlight` ist an: Schlüsselwörter #57b7c9, Zeichenketten #c99a5b, Zahlen #7fb682, Kommentare
#6f6960 kursiv, Aufrufe #8ec7be, Prompt #5fae7d. Keine weiteren Farben erfinden — die sechs sind
der ganze Satz.

## Kopieren

Der Button liegt rechts in der Kopfleiste, trägt ein Wort („Kopieren") und bestätigt rund 1,5
Sekunden mit „Kopiert!" in Grün. Zusätzlich meldet eine unsichtbare `aria-live`-Region den Erfolg —
keine `Notification` dafür.

## Nicht tun

- Fließtext oder Nachrichten in einen Code-Block setzen.
- Blöcke ohne Sprach-Label zeigen.
- Eigene Farben für Schlüsselwörter erfinden.
- Kopieren-Schaltfläche bei `inline`.

## Beispiel

```jsx
Führe <CodeSnippet variant="inline">npm install</CodeSnippet> aus.

<CodeSnippet variant="single" code="npx medo init --template=app" />

<CodeSnippet language="tsx" code={beispiel} />

<CodeSnippet variant="terminal" code={"$ medo build\n# Fertig in 2.4s\n$ medo deploy"} />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/CodeSnippet.jsx`. Tokens aus `styles.css`.
