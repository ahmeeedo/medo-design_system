# Übergabe an das medo-Design-Projekt — Farbe und Tokens

Dieses Dokument beschreibt alle Änderungen an Farbe und Tokens, die im Design-System-Repository beschlossen wurden und im **Design-Projekt** anzuwenden sind. Es ist als Arbeitsanweisung geschrieben und für die Anwendung in einem Durchgang gedacht.

**Grundlage:** `docs/aa-bestandsaufnahme.md`, Abschnitt 9 (freigegebene Entscheidungen des Inhabers), sowie vier benannte Rückläufer aus der Portierungsarbeit.

---

## 1. Vorbemerkungen — bitte zuerst lesen

### 1.1 Geltungsbereich: nur das helle Theme

Das Design-Projekt ist **hell-only**. `CLAUDE.md` hält das als gelockten Beschluss fest:

> `## Color — LOCKED. … Light mode only (built to allow dark later).`

Im gesamten Projekt kommt kein `light-dark()` vor. **Dieses Dokument beschreibt deshalb ausschließlich helle Werte.** Die dunklen Entsprechungen liegen im abnehmenden Repository und werden dort getrennt nachgezogen. Wo unten ein neues Token entsteht, bekommt es hier **nur** seinen hellen Wert.

Eine Folge davon, die beim Anwenden wichtig ist: Von den fünf freigegebenen AA-Korrekturen betrifft eine (**C2**, Textlink im dunklen Theme) das Design-Projekt **gar nicht**. Sie ist unten der Vollständigkeit halber genannt, aber ausdrücklich ohne Arbeitsschritt.

### 1.2 Zwei gelockte Beschlüsse werden geändert

Das ist beabsichtigt und vom Inhaber freigegeben. Beide sind unten an ihrer Stelle nochmals markiert:

1. **Die Deckkraft des Fokusrings** — `CLAUDE.md` schreibt „at the same 35% alpha" fest. Fall A ändert sie auf 75 %.
2. **Die algorithmisch erzeugte Palette** — Fall D setzt `stone-500` auf einen Wert, den der Erzeugungsalgorithmus nicht liefert. Siehe §4.4 für die einzig zulässige Auflösung.

### 1.3 Reihenfolge

Die Kaskade ist vollständig durchzuziehen. In dieser Reihenfolge arbeiten:

| Schritt | Was | Abschnitt |
|---|---|---|
| 1 | Brand-Ebene: `tokens/brand-colors.css` | §4 |
| 2 | Alias-Ebene: **keine Änderung** — ausdrücklich prüfen, nicht anfassen | §7.3 |
| 3 | Semantic-Ebene: `tokens/semantic-colors.css` | §2, §3, §4, §5 |
| 4 | Flache Exporte: `tokens.css`, `tokens.json` | jeweils dort |
| 5 | Komponentendateien unter `ui/` | §3, §5 |
| 6 | Richtlinien- und Spezifikationsseiten | §8 |
| 7 | Regeltexte in `CLAUDE.md` | §2, §4 |

Schritt 4 ist nicht optional: `tokens.css` spiegelt die Quellstruktur mit `var()`-Verweisen, `tokens.json` dagegen hält **aufgelöste Hex-Werte**. Eine Änderung auf Brand-Ebene zieht dort **nicht** automatisch nach.

---

## 2. Fall A — Deckkraft beider Fokusringe von 35 % auf 75 %

**Grund:** Der Fokusring erreicht die WCAG-2.2-Schwelle von 3:1 heute auf keiner Fläche (1,65:1 bis 2,00:1). Er ist in 26 Komponenten der alleinige Fokusanzeiger, weil diese `outline: none` setzen. Keine dunklere Farbstufe löst das — bei 35 % Deckung erreicht selbst die dunkelste Teal-Stufe nur 2,22:1. Nur die Deckkraft kann es. Farbton und Sättigung bleiben unberührt, der hinterlegte Farbwert bleibt zeichengleich.

### 2.1 Quelle

Datei `tokens/semantic-colors.css`:

| Zeile | alt | neu |
|---|---|---|
| 46 | `--medo-focus-ring: #00726559;` | `--medo-focus-ring: #007265bf;` |
| 47 | `--medo-focus-ring-danger: #ab091359;` | `--medo-focus-ring-danger: #ab0913bf;` |

`bf` ist hexadezimal 191, also 74,9 % Deckung.

### 2.2 Flache Exporte

Datei `tokens.css`, Zeile 334:

| alt | neu |
|---|---|
| `--medo-focus-ring: #00726559;` | `--medo-focus-ring: #007265bf;` |

Datei `tokens.json`, Zeile 367 (in `color.semantic`):

| alt | neu |
|---|---|
| `"focus-ring": "#00726559",` | `"focus-ring": "#007265bf",` |

> `--medo-focus-ring-danger` fehlt in **beiden** flachen Exporten. Das ist ein eigener Befund und in **§6** beschrieben. Wird §6 nicht mit angewandt, ist Fall A in den flachen Exporten nur zur Hälfte umgesetzt.

### 2.3 Gelockter Regeltext

Datei `CLAUDE.md`, in `## Build conventions`:

| alt | neu |
|---|---|
| `Rule: focus-ring is primary-600 everywhere, EXCEPT the danger/destructive variant, which uses error-600 at the same 35% alpha (token \`--medo-focus-ring-danger\`). Approved exception. Error-state fields use the same danger ring on focus.` | `Rule: focus-ring is primary-600 everywhere, EXCEPT the danger/destructive variant, which uses error-600 at the same 75% alpha (token \`--medo-focus-ring-danger\`). Approved exception. Error-state fields use the same danger ring on focus.` |

Geändert wird ausschließlich `35% alpha` → `75% alpha`. Der Rest des Satzes bleibt wörtlich stehen.

### 2.4 Was danach sichtbar anders ist

Der Fokusring ist heute ein zarter, halbdurchsichtiger Schimmer um das bediente Element. Er wird zu einem deutlich sichtbaren, satten Ring **in derselben Farbe** — nur dichter. Wer mit der Tastatur durch eine Seite geht, sieht den Fokus künftig sofort statt angedeutet. Das betrifft jede Komponente mit Fokusring, also Schaltflächen, Links, Felder, Menüeinträge, Akkordeons und Tabellenköpfe.

Erreichte Werte nach der Änderung: Fokusring 3,18:1 bis 3,56:1, Gefahren-Fokusring 4,45:1 bis 4,94:1 — alle acht bisher unterschreitenden Kombinationen über der Schwelle.

---

## 3. Fall B — Akzentfarbe von der Füllfläche trennen (alle vier Statusfarben)

**Grund:** In `ui/Notification.jsx` dient `--medo-<rolle>-solid-hover` doppelt: als **Füllfläche** unter dunkler Schrift und als **Vordergrundfarbe** für Symbol, Aktionstext und Randstreifen auf heller Meldungsfläche. Diese beiden Aufgaben ziehen in entgegengesetzte Richtungen. Als Füllfläche braucht die Farbe eine Leuchtdichte von mindestens 0,2476, als Akzentschrift höchstens 0,1669. Die Fenster überschneiden sich nicht — **kein Farbwert, kein Farbton und keine Sättigung erfüllen beides.** Bei der Warnung verfehlt die Farbe heute beides zugleich.

Die Trennung erfolgt für **alle vier** Statusfarben, damit die Warnung im Komponentencode kein Sonderfall wird. Bei Erfolg, Fehler und Information trägt das neue Token denselben Wert wie bisher; dort ändert sich in `Notification` nichts sichtbar.

### 3.1 Neue Token in der Semantic-Ebene

In `tokens/semantic-colors.css` einfügen. Die vier Status-Akzente gehören jeweils in den Block ihrer Rolle, direkt hinter `--medo-<rolle>-solid-active`:

```css
  --medo-success-accent: var(--medo-color-green-700);
  --medo-warning-accent: var(--medo-color-amber-800);
  --medo-error-accent: var(--medo-color-red-700);
  --medo-info-accent: var(--medo-color-blue-700);
```

Zusätzlich ein Akzent für die neutrale Meldungsart, die keiner Statusrolle angehört (siehe auch §5.3). Dieses Token gehört zu den neutralen Semantic-Token, nicht in einen Statusblock:

```css
  --medo-accent-neutral: var(--medo-color-stone-700);
```

> **Zur Benennung:** `--medo-accent-neutral` ist bewusst nicht `--medo-neutral-accent` benannt, weil die Alias-Ebene bereits `--medo-neutral-50` bis `--medo-neutral-1100` führt und ein gleichnamiger Präfix dort zu Verwechslungen einlädt.

### 3.2 Geänderte Werte in der Semantic-Ebene

Datei `tokens/semantic-colors.css`:

| Zeile | alt | neu |
|---|---|---|
| 65 | `--medo-warning-solid-hover: var(--medo-color-amber-700);` | `--medo-warning-solid-hover: var(--medo-color-amber-500);` |
| 66 | `--medo-warning-solid-active: var(--medo-color-amber-800);` | `--medo-warning-solid-active: var(--medo-color-amber-400);` |

`--medo-warning-solid` (Zeile 64, `amber-600`) und `--medo-warning-on-solid` (Zeile 67, `stone-1000`) bleiben **unverändert**. Die Beschriftung ist bereits die Fließtextfarbe; dunkler ist nicht möglich.

### 3.3 Flache Exporte

Datei `tokens.css`:

| Zeile | alt | neu |
|---|---|---|
| 352 | `--medo-warning-solid-hover: var(--medo-color-amber-700);` | `--medo-warning-solid-hover: var(--medo-color-amber-500);` |
| 353 | `--medo-warning-solid-active: var(--medo-color-amber-800);` | `--medo-warning-solid-active: var(--medo-color-amber-400);` |

Ausserdem die fünf neuen Token aus §3.1 in `tokens.css` ergänzen, an den entsprechenden Stellen, in derselben `var()`-Schreibweise wie die Quelle.

Datei `tokens.json`, in `color.semantic` — hier stehen **aufgelöste Hex-Werte**:

| Zeile | alt | neu |
|---|---|---|
| 385 | `"warning-solid-hover": "#c25e00",` | `"warning-solid-hover": "#f1924a",` |
| 386 | `"warning-solid-active": "#a04800",` | `"warning-solid-active": "#ffae74",` |

Und die fünf neuen Token als aufgelöste Werte ergänzen:

```json
      "success-accent": "#005f02",
      "warning-accent": "#a04800",
      "error-accent": "#920000",
      "info-accent": "#0045a3",
      "accent-neutral": "#4f4840",
```

### 3.4 Komponentendatei `ui/Notification.jsx`

Zeilen 87 bis 91, im Objekt `MEDO_NT_KINDS`. Geändert wird **nur** der Wert von `accent`, alle übrigen Einträge bleiben Zeichen für Zeichen stehen:

| Zeile | Art | alt | neu |
|---|---|---|---|
| 87 | `info` | `accent: "--medo-info-solid-hover",` | `accent: "--medo-info-accent",` |
| 88 | `success` | `accent: "--medo-success-solid-hover",` | `accent: "--medo-success-accent",` |
| 89 | `warning` | `accent: "--medo-warning-solid-hover",` | `accent: "--medo-warning-accent",` |
| 90 | `error` | `accent: "--medo-error-solid-hover",` | `accent: "--medo-error-accent",` |
| 91 | `neutral` | `accent: "--medo-color-stone-700",` | `accent: "--medo-accent-neutral",` |

Die Zeile 91 löst zugleich den Rückläufer aus §5.3.

### 3.5 Komponentendatei `ui/Modal.jsx`

Zeilen 56 bis 58 im eingebetteten Stylesheet. Der Symbolkreis liegt auf der hellen Meldungsfläche und ist damit ein Akzent, keine Füllfläche:

| Zeile | alt | neu |
|---|---|---|
| 56 | `.medo-mod__ic--danger{ background: var(--medo-error-surface); color: var(--medo-error-solid); }` | `.medo-mod__ic--danger{ background: var(--medo-error-surface); color: var(--medo-error-accent); }` |
| 57 | `.medo-mod__ic--warning{ background: var(--medo-warning-surface); color: var(--medo-warning-solid); }` | `.medo-mod__ic--warning{ background: var(--medo-warning-surface); color: var(--medo-warning-accent); }` |
| 58 | `.medo-mod__ic--success{ background: var(--medo-success-surface); color: var(--medo-success-solid); }` | `.medo-mod__ic--success{ background: var(--medo-success-surface); color: var(--medo-success-accent); }` |

### 3.6 Was danach sichtbar anders ist

**Die Warnfarbe bleibt das kräftige helle Orange, das sie heute ist.** Was sich ändert:

| Stelle | vorher | nachher |
|---|---|---|
| Warn-Schaltfläche beim Überfahren und Drücken | wird dunkler | **wird heller** |
| Akzent in Warnmeldungen (Symbol, Aktionstext, Randstreifen) | 3,99:1 | **5,71:1** — deutlich dunkler und klar lesbar |
| Aktionstext in der Warn-Kurzmeldung | 4,29:1 | **6,14:1** |
| Warn-Symbolkreis im Modal | 2,98:1 | **5,71:1** |
| Beschriftung auf der Warn-Schaltfläche, überfahren / gedrückt | 3,70 / 2,59 | **6,77 / 8,74** |

**Bei Erfolg, Fehler und Information ändert sich in `Notification` nichts** — das neue Token trägt dort denselben Wert wie bisher `solid-hover`.

**Zwei sichtbare Änderungen ohne fachliche Not, die aus der einheitlichen Behandlung folgen:** Der Symbolkreis im Modal wechselt von der 600er- auf die 700er-Stufe. Beim Fehler wird er von 7,03:1 auf 8,79:1, beim Erfolg von 5,68:1 auf 7,46:1 — beide also **eine Spur dunkler**. Beide erfüllten die Schwelle schon vorher; die Änderung dient allein der Einheitlichkeit.

**Eine Folge, die keine Prüfmatrix misst und die am Bildschirm zu beurteilen ist:** Weil die Warn-Schaltfläche beim Bedienen heller wird, verliert ihre Fläche an Kante gegenüber der weißen Seite — überfahren von 4,29:1 auf 2,35:1, gedrückt von 6,14:1 auf 1,82:1. Die Prüfung misst nur die Füllfläche im Ruhezustand.

---

## 4. Fall C1 und Fall D

### 4.1 Fall C1 — Textlink im hellen Theme

**Grund:** Der Textlink verfehlt 4,5:1 auf der gedrückten Fläche (4,18:1) und auf der Textmarkierung (4,20:1).

Datei `tokens/semantic-colors.css`:

| Zeile | alt | neu |
|---|---|---|
| 17 | `--medo-text-link: var(--medo-color-teal-600);` | `--medo-text-link: var(--medo-color-teal-700);` |

`--medo-text-link-hover` (Zeile 18, `teal-800`) bleibt unverändert.

Datei `tokens.css`, Zeile 305: dieselbe Änderung.

Datei `tokens.json`, Zeile 338:

| alt | neu |
|---|---|
| `"text-link": "#007265",` | `"text-link": "#005e53",` |

**Sichtbar:** Links werden eine Spur dunkler und satter (auf weißer Fläche von 5,84:1 auf 7,70:1). Der Unterschied zum Überfahren-Zustand bleibt erhalten, wird aber kleiner.

**Wichtig:** `--medo-action` und `--medo-input-border-focus` verwenden ebenfalls `teal-600` und bleiben **unverändert**. Es ändert sich nur, worauf der Textlink zeigt.

### 4.2 Fall C2 — betrifft dieses Projekt nicht

Der Textlink im **dunklen** Theme wechselt von `teal-400` auf `teal-300`, der Überfahren-Zustand rückt auf `teal-200` nach. Da das Design-Projekt hell-only ist (§1.1), **ist hier nichts zu tun.** Diese Änderung wird ausschließlich im abnehmenden Repository nachgezogen. Sie ist hier nur genannt, damit die Liste der fünf Entscheidungen vollständig bleibt.

### 4.3 Fall D — Palettenstufe stone-500

**Grund:** Die kräftige Rahmenlinie erreicht auf der Kartenfläche 2,96:1 statt der geforderten 3:1.

Datei `tokens/brand-colors.css`:

| Zeile | alt | neu |
|---|---|---|
| 192 | `--medo-color-stone-500: #94908c;` | `--medo-color-stone-500: #928e8a;` |

Datei `tokens.css`:

| Zeile | alt | neu |
|---|---|---|
| 195 | `--medo-color-stone-500: #94908c;` | `--medo-color-stone-500: #928e8a;` |

In `tokens.css` ist damit alles erledigt — die abhängigen Semantic-Token stehen dort als `var()`-Verweise und ziehen von selbst nach.

Datei `tokens.json` — hier stehen aufgelöste Werte, **sechs Stellen** sind zu ändern, alle von `#94908c` auf `#928e8a`:

| Zeile | Eintrag |
|---|---|
| 214 | `color.brand.stone."500"` |
| 260 | `color.alias.neutral-alt."500"` |
| 337 | `color.semantic."text-disabled"` |
| 343 | `color.semantic."icon-disabled"` |
| 345 | `color.semantic."border-strong"` |
| 362 | `color.semantic."action-text-disabled"` |

**Sichtbar:** praktisch nichts. Zwei von 255 Punkten je Farbkanal liegen unter der Wahrnehmungsschwelle. Betroffen sind die kräftige Rahmenlinie sowie gesperrter Text, gesperrte Symbole und gesperrte Schaltflächen-Beschriftungen. Die Rahmenlinie erreicht danach 3,03:1 auf der Kartenfläche und 3,25:1 auf Weiß.

### 4.4 Fall D — der gelockte Erzeugungsalgorithmus

**Diesen Punkt nicht überspringen.** `CLAUDE.md` beschreibt unter `### Color generation (the exact algorithm — reuse in every component file)` eine algorithmische Erzeugung der Paletten aus OKLCH-Werten. Für `stone` gilt `hue 70, c 0.013` mit dem **geteilten** Standard-Helligkeitsverlauf:

```
default lRamp=[0.976,0.942,0.888,0.822,0.748,0.655,0.470,0.405,0.348,0.300,0.252,0.198]
```

Der sechste Wert `0.655` erzeugt die 500er-Stufe. **Dieser Verlauf wird von allen Skalen ohne eigenen Verlauf benutzt** — von `stone`, `grey`, `teal`, `red`, `green`, `blue` und weiteren. Ihn zu ändern, würde die 500er-Stufe **jeder** dieser Skalen verschieben. Das ist ausdrücklich **nicht** gewollt.

**Der neue Wert ist deshalb als Ausnahme festzuhalten**, nach dem Muster, das das Projekt für den Danger-Fokusring bereits verwendet. In `CLAUDE.md`, unmittelbar hinter dem Absatz zur Farberzeugung, ist folgender Satz aufzunehmen:

> `Exception: stone-500 is #928e8a, one step darker than the default lRamp produces. Required so border-strong reaches WCAG AA 3:1 on surface-container (2.96:1 → 3.03:1). Approved exception — do not regenerate this step from the ramp.`

Ohne diesen Eintrag erzeugt der nächste Lauf des Algorithmus `#94908c` zurück, und die Korrektur ist stillschweigend verloren.

*Die saubere Alternative wäre, `stone` wie `amber` einen eigenen `lRamp` zu geben. Das ist nicht beschrieben, weil dafür ein neuer OKLCH-Helligkeitswert zu bestimmen wäre; das gehört zu den Werkzeugen der Farberzeugung und nicht in dieses Dokument.*

---

## 5. Die vier Rückläufer aus der Portierung

Diese vier Befunde stammen aus der Portierungsarbeit im abnehmenden Repository. Alle vier haben ihren Ursprung im Design-Projekt selbst.

### 5.1 Die gemeinsame Ursache der ersten drei

Die Farbstellen in §5.2 bis §5.4 haben eines gemeinsam: Sie werden in JSX **als Inline-Stil** gesetzt, nicht über eine CSS-Klasse. Inline-Stile haben höhere Spezifität als jedes Stylesheet und lassen sich deshalb von einer nachgelagerten Theme-Datei **nicht** überschreiben. Genau deshalb fallen sie auf, während dieselben Komponenten ihre über CSS gesetzten Farben sauber nachführen. Der Weg ist in allen drei Fällen derselbe: die Brand-Stufe durch ein semantisches Token ersetzen.

Die **hellen Werte bleiben dabei unverändert** — es ändert sich nichts Sichtbares, nur die Ebene, auf der die Farbe vergeben wird.

### 5.2 Slider-Teilstriche

Neues Token in `tokens/semantic-colors.css`, bei den neutralen Semantic-Token:

```css
  --medo-control-mark: var(--medo-color-stone-400);
  --medo-control-mark-on-primary: rgba(255,255,255,0.75);
```

Datei `ui/Slider.jsx`, Zeilen 252 und 253:

| Zeile | alt | neu |
|---|---|---|
| 252 | `background: t <= val ? "rgba(255,255,255,0.75)" : "var(--medo-color-stone-400)" }` | `background: t <= val ? "var(--medo-control-mark-on-primary)" : "var(--medo-control-mark)" }` |
| 253 | `: { left: p + "%", background: t <= val ? "rgba(255,255,255,0.75)" : "var(--medo-color-stone-400)" },` | `: { left: p + "%", background: t <= val ? "var(--medo-control-mark-on-primary)" : "var(--medo-control-mark)" },` |

Beide Token auch in `tokens.css` und `tokens.json` ergänzen (`"control-mark": "#b0adaa"`, `"control-mark-on-primary": "rgba(255,255,255,0.75)"`).

**Sichtbar:** nichts. Die hellen Werte sind unverändert.

### 5.3 Toggle-Symbol im Aus-Zustand

Der Knopf des Schalters ist `--medo-color-white` und bleibt in jedem Theme weiß. Das Symbol darauf muss deshalb in jedem Theme dunkel bleiben — dafür gibt es heute kein semantisches Token, weil alle in Frage kommenden im dunklen Theme ins Helle kippen.

Neues Token in `tokens/semantic-colors.css`, bei den Icon-Token:

```css
  --medo-icon-on-light: var(--medo-color-stone-600);
```

Datei `ui/Toggle.jsx`, Zeile 117:

| alt | neu |
|---|---|
| `const iconColor = on ? "var(--medo-action)" : "var(--medo-color-stone-600)";` | `const iconColor = on ? "var(--medo-action)" : "var(--medo-icon-on-light)";` |

Token auch in `tokens.css` und `tokens.json` ergänzen (`"icon-on-light": "#615951"`).

**Sichtbar:** nichts. Der helle Wert ist unverändert.

### 5.4 Neutraler Akzent der Notification

Datei `ui/Notification.jsx`, Zeile 91 — bereits in §3.4 beschrieben, hier nur die Begründung: Der Wert `--medo-color-stone-700` wird inline je Meldungsart vergeben, und keine CSS-Klasse benennt die Art. Ein Stylesheet kann die Farbe deshalb nicht nach Art unterscheiden und nicht überschreiben. Erst ein eigenes semantisches Token (`--medo-accent-neutral`, §3.1) macht die Stelle theme-fähig.

**Sichtbar:** nichts. Der helle Wert bleibt `stone-700`.

### 5.5 Wortmarke mit harten Farbwerten

Datei `logo-medo.svg`. Die Datei enthält fünf Pfade mit fest eingetragenen Füllungen:

| Vorkommen | Wert | Bedeutung |
|---|---|---|
| 4 Pfade | `fill="#24221e"` | Schriftzug |
| 1 Pfad | `fill="#007265"` | Punkt |

**Änderung — die vier Schriftzug-Pfade:**

| alt | neu |
|---|---|
| `fill="#24221e"` | `fill="currentColor"` |

**Änderung — der Punkt-Pfad:**

| alt | neu |
|---|---|
| `fill="#007265"` | `fill="var(--medo-logo-dot, #007265)"` |

Dazu ein neues Token in `tokens/semantic-colors.css`:

```css
  --medo-logo-dot: var(--medo-color-teal-600);
```

Auch in `tokens.css` und `tokens.json` ergänzen (`"logo-dot": "#007265"`).

> **Einschränkung, die im Dokument stehen muss:** Beides wirkt nur, wenn die Grafik **inline** in die Seite gesetzt wird. Über `<img src="logo-medo.svg">` eingebunden erreicht sie weder `currentColor` noch die Tokens; deshalb trägt der Punkt-Pfad oben einen Rückfallwert. Die Umsetzung im abnehmenden Repository (`src/docs/MedoLogo.jsx`) zeigt die gemeinte Form: die Pfaddaten unverändert, nur die Füllungen auf Tokens.

**Sichtbar:** nichts, solange die Grafik auf hellem Grund liegt. Auf dunklem Grund folgt der Schriftzug künftig der Textfarbe, statt dunkel zu bleiben.

---

## 6. Neu entdeckter Befund — nicht Teil der freigegebenen Korrekturen

> **Dieser Abschnitt ist kein Beschluss.** Er beschreibt einen Fehler, der bei der Vorbereitung dieses Dokuments gefunden und am Material bestätigt wurde. Der Inhaber entscheidet gesondert, ob er mit angewandt wird. Er ist hier abgesetzt, damit er nicht versehentlich als freigegebene Korrektur gelesen wird.

**Der Befund:** `--medo-focus-ring-danger` ist in `tokens/semantic-colors.css` (Zeile 47) vorhanden und in `CLAUDE.md` als gelockter Beschluss festgehalten, **fehlt aber in beiden flachen Exporten.** Wer `tokens.css` oder `tokens.json` einbindet, bekommt den destruktiven Fokusring nicht, obwohl er verbindlich ist.

**Nachgeprüft:** Ein vollständiger Abgleich aller 401 Deklarationen der Quelle gegen `tokens.css` und `tokens.json` ergibt nach Auflösung der `var()`-Verweise **genau eine** Abweichung — dieses Token. Es gibt keine weiteren fehlenden Einträge und keinen einzigen abweichenden Wert.

**Die Ergänzung** — in `tokens.css`, unmittelbar hinter Zeile 334:

```css
  --medo-focus-ring-danger: #ab0913bf;
```

**In `tokens.json`**, in `color.semantic` unmittelbar hinter dem Eintrag `focus-ring`:

```json
      "focus-ring-danger": "#ab0913bf",
```

Beide Werte tragen bereits die neue Deckkraft aus Fall A. **Wird dieser Abschnitt nicht angewandt, bleibt Fall A in den flachen Exporten unvollständig** — der Gefahrenring fehlt dort dann weiterhin ganz.

---

## 7. Was ausdrücklich unberührt bleibt

Bitte diese Punkte beim Anwenden nicht „mitziehen".

### 7.1 Die beiden bestehenden AA-Ausnahmen

| Ausnahme | Wert | Warum sie steht |
|---|---|---|
| Modal-Schleier im dunklen Theme | 1,31:1 | Nahe der physikalischen Grenze für Schwarz bei 50 % Deckung über stone-900 |
| Feldkante im Ruhezustand, helles Theme | 2,23:1 | Gelockt: „input-border=stone-400 (user chose light on purpose)" |

`--medo-input-border` bleibt `stone-400`. Die Kante sieht nach einem Fehler aus, ist aber eine bewusste Entscheidung.

### 7.2 Der Farbton der Warnung

Die Alias-Zuordnung `warning → amber` bleibt bestehen. Ein Wechsel auf `orange` wurde geprüft und **verworfen**, weil er den Farbton verschöbe. Es bewegt sich ausschließlich die Helligkeit innerhalb der Amber-Skala.

### 7.3 Die Alias-Ebene insgesamt

`tokens/alias-colors.css` wird von diesem Dokument **nicht** verändert. Die Datei ist zu prüfen, damit die Kaskade nachvollzogen ist, aber es entsteht dort keine Änderung.

### 7.4 Hell-only

Es werden **keine** dunklen Werte, keine `light-dark()`-Angaben und keine Theme-Umschaltung eingeführt. Der gelockte Beschluss „Light mode only" bleibt bestehen.

---

## 8. Seiten, die mitgeführt werden müssen

Diese Seiten zeigen geänderte Werte an. Eine Änderung, die nur in den Token-Dateien steht, hinterlässt hier falsche Angaben.

| Seite | Was mitzuführen ist | Wegen |
|---|---|---|
| `guidelines/40-farben3-8-zustaende.card.html` | **Zwei Beschriftungen „35 %" auf „75 %" ändern.** Die Seite zeigt beide Fokusringe. | A |
| `guidelines/40-farben3-6-eingabefelder.card.html` | Zeigt beide Fokusringe als Vorschau — nur Sichtprüfung, keine Beschriftung betroffen | A |
| `guidelines/40-farben3-7-aktion.card.html` | Zeigt den Fokusring — nur Sichtprüfung | A |
| `guidelines/40-farben3-3-text.card.html` | **Beschriftung „text-link · teal-600" auf „teal-700" ändern.** | C1 |
| `guidelines/40-farben3-9-status.card.html` | Zeigt `warning-solid`, `-on-solid`, `-surface`, `-border`, `-text`. **Die neuen Akzent-Token ergänzen**, geänderte Stufenangaben nachziehen | B |
| `guidelines/40-farben3-5-rahmen.card.html` | Zeigt `border-strong · stone-500`. Der Stufenname bleibt richtig, nur das Farbfeld wird minimal dunkler — keine Textänderung | D |
| `guidelines/20-farben1-01-stone.card.html` | Zeigt die Stone-Skala über `var()`. Zieht selbst nach, nur Sichtprüfung | D |
| `Semantic-Palette.dc.html` | **Die neun neuen Token aufnehmen** und die geänderten Werte nachziehen | A, B, C1, D, 5.2, 5.3, 5.5 |
| `Handoff.dc.html` | Führt den Fokusring — geänderte Deckkraft nachziehen | A |
| `components/Notification.dc.html` | Spezifikation der Meldungen — Akzentquelle von `solid-hover` auf `accent` umstellen | B |
| `components/Modal.dc.html` | Spezifikation des Dialogs — Symbolfarbe von `solid` auf `accent` umstellen | B |
| `components/Slider.dc.html` | Falls die Teilstriche mit Farbwert beschrieben sind, auf das neue Token umstellen | 5.2 |
| `components/Toggle.dc.html` | Falls das Aus-Symbol mit Farbwert beschrieben ist, auf das neue Token umstellen | 5.3 |

---

## 9. Token-Lücken — Erhebung, keine Arbeitsanweisung

Dieser Abschnitt beschreibt **keine** anzuwendende Änderung. Er hält fest, welche Lücken heute bestehen, damit sie nicht erneut erhoben werden müssen.

**Bestätigte Lücke — Laufweite.** Die Typografie-Ebene führt `--medo-tracking-tight: -0.02em`, `--medo-tracking-normal: 0` und `--medo-tracking-wide: 0.04em`. Der abnehmende Code setzt an zwei Stellen `0.12em` hart, weil die Skala keinen passenden Wert trägt. Eine weitere Stufe (etwa `--medo-tracking-wider: 0.12em`) würde die Lücke schließen.

**Bestätigte Lücke — Bewegung.** Es gibt **keine** Bewegungstokens. Der abnehmende Code trägt neun verschiedene Übergangsdauern, überwiegend 140 ms (25 Vorkommen) und 120 ms (24 Vorkommen), daneben 160, 150, 180, 200, 240, 250 ms. Eine Skala aus zwei bis drei Stufen würde den Großteil abdecken. Die Zahlenwerte stammen aus der Referenz und sind hier nur erhoben, nicht bewertet.

**Nicht bestätigt — Rastertokens.** Geprüft und **nicht** belegt: Im abnehmenden Code gibt es genau ein Vorkommen eines festen Rasters, und das gehört zu einer Farbskalen-Darstellung der Dokumentation, nicht zu einem Seitenraster. Eine Lücke lässt sich daraus nicht begründen.

**Erledigt — Seitenhintergrund und Grundtext.** Die früher vermerkten Werte `#faf9f7` und `#1f1d1a` kommen heute **nirgends** mehr vor, weder im Design-Projekt noch im abnehmenden Code. Diese Lücke besteht nicht mehr.

---

## 10. Was in diesem Dokument absichtlich nicht steht

Die folgenden Änderungen gehören zum selben Vorhaben, betreffen aber **ausschließlich das abnehmende Repository** und werden dort getrennt nachgezogen:

- Fall C2 (Textlink im dunklen Theme, §4.2).
- Die dunklen Zweige aller unter §2 bis §5 beschriebenen Änderungen.
- Die dunklen Werte der neun neuen Token: `--medo-success-accent`, `--medo-warning-accent`, `--medo-error-accent`, `--medo-info-accent`, `--medo-accent-neutral`, `--medo-control-mark`, `--medo-control-mark-on-primary`, `--medo-icon-on-light` und `--medo-logo-dot`.

Sie sind hier genannt, damit beim späteren Abgleich zwischen Dokument und Spiegel niemand ihr Fehlen für einen Anwendungsfehler hält.
