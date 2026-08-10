# Breadcrumb

Zeigt den Weg zur aktuellen Seite und führt zurück. Er ist **Orientierung**, keine Navigation für
den nächsten Schritt.

## Wann

Sobald Inhalte mindestens drei Ebenen tief liegen und man von außen direkt hineinspringen kann.
Auf Seiten der ersten Ebene ist er überflüssig — dort steht nur der Titel. Ein Breadcrumb ersetzt
nie den Zurück-Button des Browsers und nie eine sichtbare Hauptnavigation.

## Aufbau

Erste Stufe ist die Wurzel („Start", oder mit `homeIcon` das Haus-Icon), letzte Stufe ist die
aktuelle Seite: **kein Link**, in `text-muted`, mit `aria-current="page"`. Trenner ist ein
Schrägstrich in stone-400 — kein Chevron, keine Pfeile.

Die Labels sind die echten Seitentitel, gekürzt nur wo es sein muss (die Stufe schneidet bei etwa
220px mit Auslassungspunkten ab). Keine erfundenen Kurzformen.

## Kollabieren

Ab `maxItems` klappt die **Mitte** in ein …-Menü: erste Stufe, „…", die letzten zwei Stufen. Das
Menü öffnet auf Klick und schließt bei Klick außerhalb oder mit Esc. Nie die erste oder die aktuelle
Stufe verstecken — genau die beiden tragen die Orientierung.

## Barrierefreiheit

`<nav aria-label>` mit `<ol>`; Trenner sind `aria-hidden`, damit Screenreader keine Schrägstriche
vorlesen. Jede Stufe ist ein Link oder Button mit Fokusring; die aktuelle Seite ist bewusst nicht
fokussierbar.

## Nicht tun

- Die aktuelle Seite als Link ausgeben.
- Den Breadcrumb als Ersatz für Tabs oder Menü verwenden.
- Mehr als eine Zeile umbrechen lassen — dann kollabieren.
- Stufen einfügen, die es als Seite nicht gibt.

## Beispiel

```jsx
<Breadcrumb homeIcon maxItems={4}
  items={[
    { label: "Start", href: "/" },
    { label: "Netzwerk", href: "/netzwerk" },
    { label: "Spezialisten", href: "/netzwerk/spezialisten" },
    { label: "Baden-Württemberg", href: "/netzwerk/spezialisten/bw" },
    { label: "Dr. Marie Hoffmann" },
  ]} />

<Breadcrumb size="md"
  items={[
    { label: "Start", onClick: () => go("/") },
    { label: "Verträge", onClick: () => go("/vertraege") },
    { label: "VN-2026-0184" },
  ]} />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/Breadcrumb.jsx`. Tokens aus `styles.css`.
