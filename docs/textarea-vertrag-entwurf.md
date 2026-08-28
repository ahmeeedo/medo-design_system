# Textarea — Vertragsentwurf und Abweichungsliste

**Stand:** 28.08.2026 · **Status:** wartet auf Freigabe
**Entwurf:** [`textarea-vertrag-entwurf.d.ts`](./textarea-vertrag-entwurf.d.ts) (bewusst **nicht** unter `src/types/` — dort abgelegt wäre er sofort wirksam)

---

## Worum es geht

Die Textarea ist das mehrzeilige Eingabefeld — dort, wo jemand einen Befund, eine Notiz oder eine Begründung schreibt.

**Sie wird bereits an fremde Projekte ausgeliefert, hat aber als einzige der 36 Komponenten keine Beschreibung ihrer Einstellmöglichkeiten.** Diese Beschreibung heißt hier „Vertrag": eine Datei, die einem fremden Entwickler sagt, welche Einstellungen es gibt und was sie bewirken. Sein Editor liest sie und warnt ihn, wenn er sich vertippt.

Was heute stattdessen ausgeliefert wird, steht wörtlich im Paket:

> `dist-lib/types/index.d.ts:17-18` — *„Textarea: no contract in design-reference. Props are not described."*

**Die Folge heute:** Ein Entwickler bekommt bei der Textarea keine Vorschläge seines Editors und keine Warnung, wenn er sich vertippt. Schreibt er `maxLenght` statt `maxLength`, merkt es niemand — bei allen anderen 35 Komponenten schon.

## Warum die Richtung hier umgekehrt ist

Sonst gilt: Die Quelle im Design-Projekt ist maßgeblich, der ausgelieferte Code folgt ihr. **Hier ist es umgekehrt** — die Komponente existiert im Design-Projekt überhaupt nicht, sie wurde in einer früheren Sitzung frei geschrieben.

Der Grund für diese Umkehrung: **Der Code wird bereits ausgeliefert, und fremde Projekte benutzen ihn womöglich schon.** Oben neu zu entwerfen und den Code daran anzupassen könnte fremde Einbindungen brechen. Deshalb bekommt der bestehende Code nachträglich sein Fundament.

**Daraus folgt die wichtigste Auflage dieser Aufgabe:** Wo der Code von dem abweicht, was ein sauberer Vertrag verlangen würde, steht das unten in der Liste — es wird nicht stillschweigend geglättet. **Sie entscheiden, was angeglichen wird.**

---

## Die Prüfung ist gelaufen, nicht behauptet

Der bekannte Fallstrick bei Verträgen: Ein selbst gewählter Name kollidiert mit einem Namen, den das zugrundeliegende HTML-Element schon hat. Genau das ist bei `TextInput` passiert und zwingt heute alle Abnehmer, eine Prüfung abzuschalten, um überhaupt bauen zu können.

Ich habe das nachgeprüft, statt es aus der Aufgabenstellung zu übernehmen:

```
TextInput.d.ts(5,18): error TS2430: Interface 'TextInputProps' incorrectly extends
  interface 'Omit<InputHTMLAttributes<HTMLInputElement>, "size">'.
  Types of property 'prefix' are incompatible.
    Type 'ReactNode' is not assignable to type 'string | undefined'.
```

**Der Entwurf für die Textarea besteht die Prüfung — auch mit eingeschalteter Kontrolle:**

| Geprüft gegen | Ergebnis |
|---|---|
| TypeScript 5, React-Typen 18 | keine Fehler |
| TypeScript 5, React-Typen 19 | keine Fehler |

Beide Läufe mit `skipLibCheck: false`, also genau der Einstellung, die `TextInput` heute unmöglich macht. Beide React-Fassungen, weil das Paket beide zulässt.

**Ein Nebenbefund, der die Arbeit erleichtert hat:** `TextInput` braucht einen Ausschluss für den Namen `size`, weil `<input>` dieses Attribut selbst kennt. **`<textarea>` kennt es nicht** — geprüft in beiden React-Fassungen. Der Entwurf kommt deshalb ohne Ausschluss aus.

**Gegenprobe:** Ich habe den Entwurf absichtlich aufgeweicht (eine vierte Größe für `resize` zugelassen). Die Prüfung schlägt daraufhin an (`TS2578`). Ein Prüflauf, der nie rot werden kann, belegt nichts.

---

## Die Abweichungsliste

**Sieben Punkte. Alle sind am laufenden Code gemessen**, nicht aus dem Quelltext erschlossen. Je Eintrag: was der Code tut, was ein sauberer Vertrag verlangen würde, und was eine Angleichung für die Abnehmer bedeuten würde.

### 1 · Der Fokusrahmen verschwindet stillschweigend

**Was der Code tut.** Das Feld bekommt beim Hineinklicken einen farbigen Rahmen. Gibt ein Abnehmer aber eine eigene Reaktion auf das Hineinklicken mit — etwas, das der Vertrag ausdrücklich erlaubt —, **ersetzt seine Angabe die eingebaute, und der Rahmen erscheint nicht mehr.**

**Gemessen:**

| | Fokusrahmen erscheint |
|---|---|
| ohne eigene Angabe | ja |
| mit eigener Angabe | **nein** |

**Was ein sauberer Vertrag verlangen würde.** Beides soll laufen: die eingebaute Reaktion und die des Abnehmers.

**Was eine Angleichung bedeuten würde.** **Nichts bricht.** Wer heute eine eigene Angabe macht, bekäme danach zusätzlich den Rahmen zurück, den er ohnehin erwartet.

**Warum das zählt.** Es fällt niemandem auf. Es gibt keine Fehlermeldung, keine Warnung. Wer mit der Tastatur arbeitet, sieht schlicht nicht mehr, wo er ist.

### 2 · Die Fehlermeldung wird für Vorleseprogramme unhörbar

**Was der Code tut.** Dieselbe Ursache wie bei Punkt 1. Setzt ein Abnehmer eine eigene Verknüpfung zu einem Hinweistext, **ersetzt sie die Verknüpfung zur Fehlermeldung.**

**Gemessen:** Bei gesetzter Fehlermeldung und eigener Verknüpfung zeigt das Feld auf den fremden Text — die Fehlermeldung ist für ein Vorleseprogramm nicht mehr auffindbar.

**Was ein sauberer Vertrag verlangen würde.** Beide Verknüpfungen nebeneinander; das ist technisch vorgesehen.

**Was eine Angleichung bedeuten würde.** **Nichts bricht.** Der eigene Hinweistext bliebe erhalten, die Fehlermeldung käme dazu.

### 3 · Das Feld gilt für Vorleseprogramme als fehlerfrei, obwohl ein Fehler angezeigt wird

**Was der Code tut.** Dieselbe Ursache. Ein Abnehmer kann die Kennzeichnung „dieses Feld ist fehlerhaft" überschreiben, während die rote Meldung sichtbar stehen bleibt.

**Gemessen:**

| | Feld gilt als fehlerhaft |
|---|---|
| Fehlermeldung gesetzt | ja |
| Fehlermeldung gesetzt **und** eigene Kennzeichnung | **nein** |

**Was eine Angleichung bedeuten würde.** **Nichts bricht.**

> **Die Punkte 1 bis 3 haben eine gemeinsame Ursache** — eine einzige Stelle im Code, an der die Angaben des Abnehmers nach den eingebauten stehen statt davor. Eine Korrektur behebt alle drei.

### 4 · Zwei der drei Größen sind identisch

**Was der Code tut.** Die Textarea kennt drei Größen: `sm`, `md`, `lg`. Bei einzeiligen Feldern bestimmen sie die Höhe (36 / 40 / 48 Pixel). **Die Textarea hebt die Höhe wieder auf**, weil ihre Höhe von der Zeilenzahl kommt. Übrig bleibt nur die Schriftgröße — und die ist bei `md` und `lg` dieselbe.

| Größe | Schrift | Höhe |
|---|---|---|
| `sm` | 14 px | von der Zeilenzahl |
| `md` | 16 px | von der Zeilenzahl |
| `lg` | **16 px** | von der Zeilenzahl |

Nachgeprüft im ausgelieferten Stylesheet: `dist-lib/styles.css:845` setzt die Höhe, `:972` hebt sie wieder auf. Weil das zweite später steht, gewinnt es.

**Was ein sauberer Vertrag verlangen würde.** Entweder drei Größen mit drei verschiedenen Wirkungen — oder nur die Werte anbieten, die etwas tun.

**Was eine Angleichung bedeuten würde.** Je nach Weg:

- **`lg` sichtbar machen** (größere Schrift): Wer heute `lg` gewählt hat, bekäme ein größeres Feld. Das ist es, was er ohnehin erwartet hat.
- **`lg` streichen**: **Das bricht Einbindungen.** Wer heute `lg` schreibt, bekäme eine Fehlermeldung beim Bauen.

> **Empfehlung: `lg` sichtbar machen, nicht streichen.** Der Vertragsentwurf beschreibt vorerst den Ist-Zustand — er behauptet nicht, `lg` sei größer.

### 5 · Ein vorbelegtes Feld mit dem Wert 0 kommt leer

**Was der Code tut.** Eine Vorbelegung mit der Zahl `0` verschwindet; das Feld erscheint leer. Mit `7` erscheint die `7`.

**Gemessen:** Vorbelegung `0` → Feld leer. Vorbelegung `7` → Feld zeigt `7`.

**Was ein sauberer Vertrag verlangen würde.** Entweder die `0` anzeigen, oder gar keine Zahlen als Vorbelegung zulassen.

**Was eine Angleichung bedeuten würde.** **Nichts bricht** — heute geht der Wert ohnehin verloren. Ein Abnehmer, der auf die verschwundene Null angewiesen wäre, ist schwer vorstellbar.

**Wie eng ist der Fall?** Eng. In einem Textfeld eine Null vorzubelegen kommt selten vor. Ich melde ihn, weil die Liste vollständig sein soll.

### 6 · Text zwischen den Klammern verschwindet lautlos

**Was der Code tut.** Schreibt jemand `<Textarea>Vorbelegter Text</Textarea>`, ist das Feld leer. Es gibt keine Warnung.

**Gemessen:** Feld bleibt leer, kein Fehler.

**Was ein sauberer Vertrag verlangen würde.** Diese Schreibweise gar nicht erst zulassen, damit der Editor sofort warnt.

**Was eine Angleichung bedeuten würde.** Wer diese Schreibweise heute im Code hat, bekäme eine Fehlermeldung beim Bauen. **Das ist der einzige Punkt der Liste, bei dem eine Angleichung bestehenden Code anhalten kann** — allerdings nur solchen, der ohnehin nicht tut, was er soll.

**Hinweis:** `TextInput` hat dieselbe Eigenschaft. Wer sie hier verbietet, sollte sie dort mitnehmen, sonst verhalten sich zwei Geschwister verschieden.

### 7 · Nach der Einführung des Vertrags wird strenger geprüft

**Was der Code tut.** Weil es heute keinen Vertrag gibt, akzeptiert das Paket bei der Textarea **jede beliebige Einstellung** — auch vertippte, auch falsch belegte.

**Was ein sauberer Vertrag verlangen würde.** Genau das, was der Entwurf tut: nur die tatsächlich vorhandenen Einstellungen zulassen.

**Was eine Angleichung bedeuten würde.** **Das ist der Zweck der Übung — und zugleich das einzige echte Risiko für Abnehmer.** Ein fremdes Projekt, das heute bei der Textarea etwas Falsches übergibt, baut heute durch und würde danach eine Fehlermeldung bekommen. Die Fehlermeldung wäre berechtigt: Die Einstellung hat schon vorher nichts bewirkt. Sichtbar wird der Fehler erst jetzt.

**Zwei Dinge müssen bei der Umsetzung zusammen geschehen**, sonst passiert gar nichts: Der Vertrag muss unter `src/types/` liegen **und** der Ausnahmeeintrag in `scripts/build-package.mjs:159` muss weg. Bleibt er stehen, wird der neue Vertrag zwar mit ausgeliefert, aber nicht benutzt.

---

## Was der Entwurf beschreibt

Alle Einstellungen, die der Code tatsächlich entgegennimmt — abgeglichen Zeile für Zeile gegen `src/components/Textarea/Textarea.jsx`, nicht aus dem Gedächtnis.

| Einstellung | Wozu | Standard |
|---|---|---|
| `label` | Beschriftung über dem Feld | — |
| `size` | Schriftgröße (siehe Punkt 4) | `md` |
| `rows` | sichtbare Zeilen und damit die Höhe | `3` |
| `required` | roter Stern hinter der Beschriftung | aus |
| `optional` | „(optional)" hinter der Beschriftung | aus |
| `hint` | erklärender Text unter dem Feld | — |
| `error` | Fehlermeldung, verdrängt `hint` | — |
| `success` | Bestätigung, verdrängt `hint` | — |
| `maxLength` | Höchstzahl Zeichen | — |
| `showCounter` | zeigt „24/100"; braucht `maxLength` | aus |
| `resize` | ob das Feld gezogen werden darf | `vertical` |
| `fullWidth` | volle Breite des Elternelements | aus |
| `className` · `style` | liegen auf der Hülle, nicht auf dem Eingabefeld | — |
| `value` · `defaultValue` · `onChange` · `name` · `id` · `placeholder` · `disabled` · `readOnly` | wie bei jedem Eingabefeld | — |
| alle übrigen Attribute eines Textfeldes | werden durchgereicht (`cols`, `wrap`, Tastaturereignisse …) | — |

**Was ausdrücklich in Ordnung ist:** Eine eigene Reaktion auf Eingaben (`onChange`) wird **sauber mit der eingebauten zusammengeführt** — anders als bei den Punkten 1 bis 3. Ich hatte hier zunächst dasselbe Problem vermutet; die Messung hat das widerlegt. Der Zähler zählt auch dann richtig weiter.

---

## Was in dieser Aufgabe nicht passiert

Nichts wurde umgesetzt: kein `src/types/Textarea.d.ts`, keine Änderung am Code der Komponente, nichts ins Design-Projekt, keine Doku-Seite. Diese Aufgabe liefert die Entscheidungsgrundlage.

---

## Was ich von Ihnen brauche

Der Vertragsentwurf selbst braucht keine Beurteilung von Ihnen — er ist geprüft und besteht.

**Zu entscheiden sind die sieben Punkte der Abweichungsliste: Was soll am ausgelieferten Code angeglichen werden?**

| | Punkt | Bricht eine Angleichung etwas? | Mein Vorschlag |
|---|---|---|---|
| 1–3 | Fokusrahmen, Fehlermeldung, Fehlerkennzeichnung | nein | **angleichen** — eine Stelle behebt alle drei |
| 4 | `lg` ist so groß wie `md` | nur beim Streichen | **`lg` sichtbar machen**, nicht streichen |
| 5 | Vorbelegung `0` verschwindet | nein | **angleichen** |
| 6 | Text zwischen den Klammern verschwindet | ja, kann fremden Code anhalten | **zurückstellen**, zusammen mit `TextInput` entscheiden |
| 7 | strengere Prüfung nach Einführung | ja, kann fremden Code anhalten | **so machen** — das ist der Zweck |

Jede Angleichung ist eine eigene Aufgabe. **Nur was Sie freigeben, wird später am Code angefasst.**

---

## Freigabe

> _Wird nach Ihrer Rückmeldung hier eingetragen: welche Punkte angeglichen werden und welche nicht._

**Status:** offen
