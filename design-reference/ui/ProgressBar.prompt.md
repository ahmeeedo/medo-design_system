# ProgressBar

Fortschritt eines **laufenden Vorgangs**: Upload, Import, Prüfung. Sie zeigt, wie viel geschafft ist,
nicht wie weit man in einem Formular ist.

## Determiniert oder nicht

Ist der Fortschritt messbar, `value` setzen — das ist der Normalfall und die einzige Form, die etwas
verspricht. Ist die Dauer unbekannt, `value` weglassen: die Bahn läuft dann durch und sagt nur „es
passiert etwas". Eine gefälschte Prozentangabe ist schlimmer als keine.

Für Schritte eines Vorgangs mit Namen ist es ein `ProgressIndicator`, für kurze Wartezeiten ohne
Fortschritt `Loading` oder `InlineLoading`.

## Aufbau

`label` benennt den Vorgang („Dateien werden hochgeladen"), `helper` zählt („2 von 6 Dateien"),
`showValue` setzt den Prozentwert rechts in DM Mono. Nicht beides zugleich, wenn es dasselbe sagt.

`size="thin"` (4px) sitzt am Kopf einer Karte oder unter einer Zeile, `standard` (8px) steht
allein. Beide sind vollrund.

## Status

Am Ende wechselt die Bahn: `success` (grün, 100 %) mit einem Satz, was fertig ist, oder `error`
(rot) mit Ursache und nächstem Schritt — der Fortschritt bleibt dabei stehen, wo er abgebrochen ist,
und springt nicht auf 0 oder 100.

## Barrierefreiheit

`role="progressbar"` mit `aria-valuenow/min/max`; im indeterminierten Zustand entfallen die Werte
bewusst. Ohne Text-`label` ist `ariaLabel` Pflicht.

## Nicht tun

- Prozentwerte schätzen oder zurückspringen lassen.
- Als Schrittanzeige für Formulare benutzen.
- Mehrere Bahnen für denselben Vorgang.
- Bahn ohne Beschriftung irgendwo im Layout stehen lassen.

## Beispiel

```jsx
<ProgressBar label="Dateien werden hochgeladen" helper="2 von 6 Dateien"
             value={38} showValue />

<ProgressBar size="thin" ariaLabel="Import läuft" />

<ProgressBar label="Import" value={100} status="success"
             statusText="312 Einträge übernommen." />

<ProgressBar label="Import" value={64} status="error"
             statusText="Abgebrochen bei Zeile 200 — Datei prüfen und erneut starten." />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/ProgressBar.jsx`. Tokens aus `styles.css`.
