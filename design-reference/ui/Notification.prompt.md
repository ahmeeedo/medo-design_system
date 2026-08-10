# Notification

Rückmeldungen an die Person — als eingebettetes Banner oder als schwebender Toast.

## Banner oder Toast

Ein **Banner** (`Notification`) sitzt im Seitenfluss, bleibt stehen und trägt bleibenden Kontext:
ein Formularfehler über dem Formular, ein Hinweis auf einen Systemzustand, eine Warnung vor einer
Grenze. Es verschwindet nur, wenn die Person es schließt oder die Ursache wegfällt.

Ein **Toast** schwebt oben rechts, quittiert eine gerade abgeschlossene Handlung und blendet nach
etwa fünf Sekunden aus. Er ist flüchtig — was dort steht, darf nicht wichtig sein.

Die Faustregel: Muss die Person etwas tun oder nachlesen, ist es ein Banner. Reicht „hat geklappt",
ist es ein Toast.

## Statusarten

`info`, `success`, `warning`, `error`, `neutral`. Die Farbe folgt der Bedeutung, nicht dem
Geschmack — ein Fehler ist rot, auch wenn es unschön aussieht. Die Bedeutung hängt nie allein an der
Farbe: Icon und Text tragen sie mit.

## Betonung

`soft` ist der Normalfall: getönte Fläche, farbiger Rahmen, ruhig genug für mehrere Banner
untereinander. `solid` füllt die Statusfarbe und ist laut — für dringende oder blockierende
Meldungen, höchstens eine pro Ansicht.

## Aufbau

Ohne `children` entsteht die einzeilige Variante: Icon, ein Satz, Schließen. Mit `children` kommt
ein Titel über den Text und die Aktion darunter. `action` ist eine einzelne Schaltfläche im Textstil
— typisch „Rückgängig", „Neu laden", „Erneut versuchen". Mehr als eine Aktion gehört nicht ins
Banner.

`onClose` erzeugt die Schließen-Schaltfläche. Lass sie weg, wenn die Meldung erst verschwinden darf,
wenn ihre Ursache behoben ist.

## Toast benutzen

`ToastHost` einmal pro Anwendung einhängen, dann von überall `toast({ … })` aufrufen — auch
außerhalb von React. **Fehler-Toasts blenden nicht automatisch aus**; sie bleiben stehen, bis die
Person sie schließt. Zeige nie mehrere Toasts für denselben Vorgang.

## Ansage

Das Banner trägt `role="status"`, bei `error` `role="alert"` — Screenreader lesen die Meldung damit
vor, ohne dass die Person sie sucht. Der Toast-Stapel ist eine `aria-live`-Region.

## Nicht tun

- Kritische Fehler als flüchtigen Toast zeigen.
- Mehrere Toasts für denselben Vorgang.
- Farbe als einziges Signal.
- Mehr als eine Aktion ins Banner packen.
- Ein Banner ohne Schließen zeigen, das die Person nie loswird.

## Beispiel

```jsx
<Notification kind="error" title="Hochladen fehlgeschlagen"
              action={{ label: "Erneut versuchen", onClick: retry }}>
  Die Datei konnte nicht übertragen werden.
</Notification>

<Notification kind="success" title="Änderungen wurden gespeichert." onClose={close} />

<ToastHost />
toast({ kind: "success", title: "Profil gespeichert" });
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/Notification.jsx`. Tokens aus `styles.css`.
