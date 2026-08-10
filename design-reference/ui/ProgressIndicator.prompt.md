# ProgressIndicator

Zeigt die **benannten Schritte** eines Vorgangs und wo man darin steht: Registrierung,
Profilaufbau, Antrag. Er ist Orientierung, keine Navigation.

## Abgrenzung

Für einen laufenden technischen Vorgang mit Prozentwert ist es eine `ProgressBar`. Für
gleichrangige Ansichten sind es `Tabs` — Tabs haben keine Reihenfolge, ein Stepper hat eine.

Drei bis sechs Schritte. Mehr wird niemand als Weg lesen; dann besser gruppieren oder auf mehrere
Seiten verteilen.

## Zustände

Erledigt trägt ein Häkchen und ist gefüllt, der aktive Schritt hat einen 2px-Ring und seine Nummer,
ausstehende sind ruhig in `text-muted`. Ein `status="error"` färbt Punkt und Titel rot — der aktive
Schritt bleibt trotzdem der, auf dem man steht. Die Linie ist nur bis zum erreichten Schritt gefüllt.

`optional` markiert einen Schritt, den man überspringen kann; der Hinweis steht klein in Mono neben
dem Titel.

## Klickbarkeit

Mit `onStepClick` werden **erledigte** Schritte anklickbar — zum Zurückgehen und Prüfen. Ausstehende
Schritte sind nie klickbar: sie sind nicht erreichbar, solange der aktuelle nicht abgeschlossen ist.
Vorwärts geht es über die Schaltfläche des Formulars, nicht über den Stepper.

## Ausrichtung

Waagerecht über dem Formular, wenn die Titel kurz sind. Senkrecht (`orientation="vertical"`), wenn
die Schritte Unterzeilen brauchen oder der Platz schmal ist — dort liest man sie besser.

## Barrierefreiheit

`role="list"` mit `role="listitem"`; der aktive Schritt trägt `aria-current="step"`. Erledigte
Schritte sind echte Schaltflächen mit Fokusring am Punkt, ausstehende sind keine.

## Nicht tun

- Vorwärtsnavigation über den Stepper anbieten.
- Mehr als sechs Schritte.
- Schrittzustand nur über Farbe zeigen (Häkchen und Nummer bleiben).
- Prozentangaben in die Titel schreiben.

## Beispiel

```jsx
<ProgressIndicator current={2} onStepClick={(i) => geheZu(i)}
  steps={[
    { title: "Konto", subtitle: "E-Mail bestätigt" },
    { title: "Zulassung", subtitle: "IHK-Nummer geprüft" },
    { title: "Profil", subtitle: "Schwerpunkte und Region" },
    { title: "Netzwerk", subtitle: "Erste Anfragen", optional: true },
  ]} />

<ProgressIndicator orientation="vertical" current={1}
  steps={[
    { title: "Antrag gestellt", status: "done" },
    { title: "Prüfung", subtitle: "Unterlagen unvollständig", status: "error" },
    { title: "Freigabe" },
  ]} />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/ProgressIndicator.jsx`. Tokens aus
`styles.css`.
