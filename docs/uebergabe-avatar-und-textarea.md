# Übergabe an das Design-Projekt — Avatar, Textarea und Contained-list

**Stand:** 29.08.2026 · **Status:** wartet auf Freigabe

Dieses Dokument ist für die KI im medo-Design-Projekt geschrieben. Der Inhaber gibt es ihr; sie legt daraus die Dateien an. Sie kennt den dortigen Bestand, aber nicht dieses Repository und nicht die Vorarbeit — **deshalb steht hier jede Datei vollständig, nicht in Bruchstücken.**

---

## Für den Inhaber — was hier passiert

**Es entstehen zwei neue Komponenten und eine Änderung an einer bestehenden.**

| | Was | Sichtbare Folge |
|---|---|---|
| **Avatar** | neu | Der runde Kreis mit Bild oder Initialen bekommt eine eigene Komponente |
| **Textarea** | bekommt ihr Fundament | Nichts sichtbar Neues, aber vier Fehler verschwinden |
| **Contained-list** | wird umgestellt | **Die Kreise in Listen werden kräftig statt hell** |

**Die einzige sichtbare Änderung an etwas Bestehendem ist die dritte.** Personenlisten sehen danach farbiger aus als heute. Das bricht nichts und erzeugt keine Fehlermeldung — aber wer die Liste im Einsatz hat, sieht sie danach anders. Sie haben das am 28.08.2026 so freigegeben; ich benenne es hier noch einmal, weil es der einzige Punkt ist, an dem sich ohne Zutun etwas verändert.

### Vier Punkte brauchen Ihre Entscheidung, bevor Sie das Dokument anwenden

Beim Ausschreiben bin ich auf vier Stellen gestoßen, an denen die Vorgaben nicht zusammenpassen. **Ich habe nichts davon eigenmächtig entschieden.** Sie stehen ausführlich im nächsten Abschnitt; hier die Kurzfassung:

1. **Ein gelockter Beschluss verbietet, was für die Textarea freigegeben wurde.** Im Design-Projekt ist festgehalten: Feldtext ist bei `md` und `lg` gleich groß. Genau das sollte bei der Textarea aufgehoben werden. **Ich habe einen Weg gefunden, der beides erfüllt** — er macht `lg` spürbar größer, ohne die Schriftgröße anzufassen.
2. **Die Aufgabenstellung nennt eine Ausnahme, die es nicht gibt.** Von einer Schriftgröße 13 px war die Rede. Der von Ihnen freigegebene Avatar-Entwurf enthält keine 13 px — und ein gelockter Beschluss verbietet sie ausdrücklich.
3. **Dem Design-Projekt fehlen Angaben, die die Spezifikationsseite bräuchte.** Für 9 der 15 Farbfamilien ist nicht dokumentiert, wie ihre Farbwerte erzeugt werden. Ich habe die fertigen Werte eingesetzt statt sie zu erfinden.
4. **Zwei zusätzliche Dateien gehören dazu**, die in der Aufgabenstellung fehlten — im Design-Projekt hat jede Komponente eine Vorschaukarte. Ich habe sie mitgeschrieben.

---

## Die vier Punkte im Einzelnen

### Punkt 1 · Ein gelockter Beschluss steht der freigegebenen Textarea-Änderung entgegen

**Der gelockte Beschluss** (`design-reference/CLAUDE.md`, Abschnitt „Build conventions"):

> *„Rule: field horizontal padding is space-sm 12px, field text sm=14 / md=16 / lg=16."*

**Was freigegeben wurde** (Abweichungsliste Punkt 4, 28.08.2026): Bei der Textarea wirkt `lg` heute wie `md`. Entschieden wurde: **`lg` sichtbar größer machen**, nicht streichen.

**Warum das kollidiert.** Bei einzeiligen Feldern unterscheiden sich `md` und `lg` nicht durch die Schrift, sondern durch die **Höhe** (40 px gegen 48 px). Die Textarea hebt die feste Höhe auf, weil ihre Höhe von der Zeilenzahl kommt — damit verliert `lg` sein einziges Unterscheidungsmerkmal. Es über die Schriftgröße zurückzuholen hieße, den gelockten Beschluss zu brechen.

**Mein Vorschlag — er erfüllt beides.** `lg` wird über den **Innenabstand** größer statt über die Schrift:

| Größe | Schriftgröße | Innenabstand oben/unten |
|---|---|---|
| `sm` | `--medo-text-sm` (14 px) | `--medo-space-2xs` (4 px) |
| `md` | `--medo-text-base` (16 px) | `--medo-space-xs` (8 px) |
| `lg` | `--medo-text-base` (16 px) | `--medo-space-sm` (12 px) |

Die Schriftgrößen bleiben exakt bei 14/16/16 — der gelockte Beschluss ist unangetastet. Ein `lg`-Feld wird trotzdem sichtbar luftiger. Alle drei Abstände liegen auf Token-Stufen; nichts ist ausgerechnet.

> **Ihre Entscheidung:** Ist das der Weg? Falls Sie stattdessen die Schriftgröße ändern wollen, wäre das eine Änderung an einem gelockten Beschluss und müsste dort zuerst aufgehoben werden.

### Punkt 2 · Die Schriftgröße 13 px ist keine Ausnahme, sondern gibt es nicht

Die Aufgabenstellung hielt fest, Sie hätten entschieden, „13 px Schriftgröße" beizubehalten, und das sei als bewusste Ausnahme zu kennzeichnen.

**Das trifft nicht zu, und ich habe es nicht übernommen.** In meinem Avatar-Entwurf war das offener Punkt D2, und ich hatte ihn dort so aufgelöst:

> *„Vorschlag: Beide Größen nutzen `--medo-text-xs` (12 px). Damit stimmt der Avatar mit dem überein, was heute ausgeliefert wird. Kein neuer Token nötig."*

Sie haben den Entwurf mit dieser Auflösung freigegeben. **Der Avatar enthält damit an keiner Stelle 13 px.**

Das ist auch gut so, denn im Design-Projekt steht ein gelockter Beschluss dagegen:

> *„No in-between values like 13px anywhere in the system."*

**Ich führe 13 px deshalb nirgends ein.** Als bewusste Ausnahme bleiben nur die beiden Durchmesser 30 px und 38 px sowie die Laufweite 0,02 em — sie sind unten an Ort und Stelle gekennzeichnet.

> **Zur Kenntnis, nicht zum Handeln:** Die bestehenden Spezifikationsseiten im Design-Projekt verwenden 13 px reichlich als Fließtext, entgegen dem gelockten Beschluss. Das ist Altbestand und **nicht Gegenstand dieser Übergabe** — ich benenne es nur, damit niemand meint, meine Dateien hätten es eingeschleppt.

### Punkt 3 · Für 9 von 15 Farbfamilien fehlen die Erzeugungsangaben

Die Spezifikationsseiten im Design-Projekt **rechnen ihre Farben selbst aus**, damit sie eigenständig laufen. Der gelockte Beschluss gibt dafür die Bauanweisung — aber nur für sechs Familien: stone, teal, rot, grün, blau, amber.

Der Avatar braucht **alle fünfzehn**. Für crimson, rosé, orange, gelb, cyan, indigo, violett, purpur und grau ist nirgends im Spiegel festgehalten, mit welchen Werten sie erzeugt werden.

**Was ich getan habe:** Ich habe die fertigen Farbwerte eingesetzt, unverändert aus der Quelle der Wahrheit (`src/styles/medo/brand-colors.css`), und im Dateikopf vermerkt, woher sie stammen. **Ich habe nichts erfunden und nichts nachgerechnet.**

> **An die KI im Design-Projekt:** Dir liegen die Erzeugungsangaben aller Familien vor, mir nicht. Wenn du die Seite lieber rechnen lässt statt die Werte fest einzusetzen, ersetze den Farbblock in `components/Avatar.dc.html` entsprechend — **die Ergebniswerte müssen dieselben bleiben.** Sie sind unten in einer Tabelle mit Kontrastwerten hinterlegt, damit du das prüfen kannst.

### Punkt 4 · Es sind zehn Dateien, nicht acht

Die Aufgabenstellung nannte vier Dateien je Komponente. Der gelockte Beschluss des Design-Projekts nennt für den `ui/`-Bestand jedoch:

> *„Jede Komponente hat `<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md`, `<Name>.card.html`."*

**Nachgeprüft am Spiegel:** 33 der 35 Komponenten haben eine `.card.html`. Die beiden Ausnahmen sind `Field` und `Icon` — beides Bausteine, die nie für sich stehen. Avatar und Textarea sind gewöhnliche Komponenten und gehören damit zu den 33.

**Ich habe beide Karten mitgeschrieben.** Ohne sie wären die neuen Komponenten die einzigen sichtbaren ohne Vorschaukarte.

---

## Was dieses Dokument anlegt und ändert

**Neu anzulegen — zehn Dateien:**

| Datei | Zweck |
|---|---|
| `components/Avatar.dc.html` | Spezifikationsseite Avatar |
| `ui/Avatar.jsx` | Referenzcode Avatar |
| `ui/Avatar.d.ts` | Props-Vertrag Avatar |
| `ui/Avatar.prompt.md` | Nutzungsregeln Avatar |
| `ui/Avatar.card.html` | Vorschaukarte Avatar |
| `components/Textarea.dc.html` | Spezifikationsseite Textarea |
| `ui/Textarea.jsx` | Referenzcode Textarea |
| `ui/Textarea.d.ts` | Props-Vertrag Textarea |
| `ui/Textarea.prompt.md` | Nutzungsregeln Textarea |
| `ui/Textarea.card.html` | Vorschaukarte Textarea |

**Zu ändern — vier Dateien:**

| Datei | Änderung |
|---|---|
| `ui/ContainedList.jsx` | Der eingebaute Kreis weicht dem Avatar |
| `ui/ContainedList.d.ts` | `avatar` wird genauer beschrieben |
| `ui/ContainedList.prompt.md` | Nutzungsregel zur Farbe ergänzt |
| `components/Contained-list.dc.html` | Kreise in der Matrix auf die neue Farbgebung |

**Unberührt bleibt alles andere** — siehe den Abschnitt am Ende.

---

# Teil A — Avatar

Der Avatar zeigt, um welche Person es geht: ein Kreis mit Bild, sonst mit zwei Buchstaben, sonst mit einem Personen-Symbol.

## Die Entscheidungen, die dahinterstehen

Sie sind vom Inhaber am 28.08.2026 einzeln freigegeben. Die KI im Design-Projekt soll sie **nicht** neu bewerten:

- **Form:** Kreis. Rund bedeutet im System eine Person, eckig eine Sache — diese Unterscheidung ist durchgehend eingehalten.
- **Drei Größen:** 30 px in Tabellenzeilen, 38 px in Listenzeilen, 64 px auf Profilseiten.
- **Füllung in dieser Reihenfolge:** Bild → zwei Buchstaben → Personen-Symbol.
- **Farbe:** eine von fünfzehn, **weiße Schrift durchgehend**.
- **Die Farbe gehört zur Person.** Sie wird bei der Registrierung vergeben und ist von der Person änderbar. Sie wird **nicht** berechnet, **nicht** aus dem Namen abgeleitet, **nicht** aus der Position in einer Liste bestimmt. Zwei Personen dürfen dieselbe Farbe haben. Es wird nicht nach Farbe sortiert.
- **Für Vorleseprogramme unsichtbar**, weil der Name daneben steht.

## Zwei bewusste Abweichungen — bitte nicht „korrigieren"

**Erstens: die Farbstufen.** Die bestehenden Spezifikationsseiten nutzen helle Tönungen (Stufen 50–200) mit dunkler Schrift. Der Avatar nutzt **kräftige Flächen mit weißer Schrift**, und fünf Familien stehen nicht auf der 600er Stufe:

| Familie | Stufe | Warum nicht 600 |
|---|---|---|
| Orange | **900** | auf 600 trägt die Fläche keine weiße Schrift (Kontrast 3,68 statt 4,5) |
| Amber | **800** | auf 600 nur 3,21 · auf 700 nur 4,29 |
| Gelb | **900** | auf 600 nur 2,76 · auf 700 nur 3,59 |
| Violett | **800** | auf 600 zu nah an Indigo (Farbabstand 14,5) |
| Stein | **900** | auf 600 nicht von Grau zu unterscheiden (Farbabstand 8,0) |

Das ist eine Entscheidung des Inhabers gegen die Referenz. **Der gelockte Grundsatz „600 = main/solid color" bleibt für alles andere unangetastet** — er gilt weiterhin für Tags, Schaltflächen und Statusfarben. Der Avatar ist die einzige Ausnahme, und nur weil die Person die Farbe selbst wählt: keine Wahl darf schlecht aussehen.

**Zweitens: zwei Zwischenwerte bleiben Zahlen.** Für die Durchmesser **30 px** und **38 px** trägt keine Token-Stufe (die Abstandsstufen sind 24, 32, 48), ebenso wenig für die Laufweite **0,02 em**. Der Inhaber hat entschieden, die Zahlen zu halten, weil beide bereits so ausgeliefert werden und ein Umstellen fremde Einbindungen anfassen würde. **Bitte nicht auf Token-Stufen ziehen.** Die dritte Größe ist davon nicht betroffen: 64 px liegt exakt auf `--medo-space-3xl`.

## Die Farbtabelle — Ergebniswerte mit Kontrastnachweis

Alle fünfzehn tragen `--medo-color-white` als Schrift. Geprüft nach WCAG 2.2; für halbfette Schrift in 12 px sind 4,5 gefordert.

| Familie | Token | Wert | Kontrast |
|---|---|---|---|
| Rot | `--medo-color-red-600` | `#ab0913` | 7,55 |
| Karmin | `--medo-color-crimson-600` | `#af0034` | 7,31 |
| Rosé | `--medo-color-rose-600` | `#ab004c` | 7,40 |
| Orange | `--medo-color-orange-900` | `#7e2400` | 9,82 |
| Amber | `--medo-color-amber-800` | `#a04800` | 6,14 |
| Gelb | `--medo-color-yellow-900` | `#794900` | 7,59 |
| Grün | `--medo-color-green-600` | `#007317` | 6,06 |
| Teal | `--medo-color-teal-600` | `#007265` | 5,84 |
| Cyan | `--medo-color-cyan-600` | `#006d87` | 5,94 |
| Blau | `--medo-color-blue-600` | `#0059be` | 6,62 |
| Indigo | `--medo-color-indigo-600` | `#3447c8` | 7,29 |
| Violett | `--medo-color-violet-800` | `#401b84` | 12,30 |
| Purpur | `--medo-color-purple-600` | `#881f9e` | 7,67 |
| Grau | `--medo-color-grey-600` | `#595b5e` | 6,81 |
| Stein | `--medo-color-stone-900` | `#312d28` | 13,67 |

Schwächster Wert der Reihe: **5,84**. Engstes Farbpaar: Karmin/Rosé mit Farbabstand **16,2** (Schwelle 15). Alle fünfzehn liegen im Helligkeitsband L\* 19 bis 43 — keine sticht heraus.

## Die Buchstabenregel

Vom Inhaber an drei Beispielen festgelegt. Drei Stufen, die nacheinander greifen:

1. **Trennzeichen suchen** — Leerzeichen, Punkt, Bindestrich, Unterstrich. Bei einer E-Mail-Adresse vorher alles ab dem `@` abschneiden.
2. **Sonst: Großbuchstaben im Wortinneren** trennen genauso.
3. **Sonst: die ersten zwei Zeichen** nehmen.

Bei zwei oder mehr Teilen zählt der erste Buchstabe der ersten beiden Teile. Das Ergebnis wird immer groß dargestellt.

| Eingabe | Ergebnis | Stufe |
|---|---|---|
| `Andreas Müller` | AM | 1 — vom Inhaber vorgegeben |
| `PeterZeider` | PZ | 2 — vom Inhaber vorgegeben |
| `renatosanches` | RE | 3 — vom Inhaber vorgegeben |
| `Dr. Marie Hoffmann` | DM | 1 |
| `anna.mueller` | AM | 1 |
| `anna@medo.de` | AN | 1, dann 3 |
| `Müller` | MÜ | 3 |
### Eine Verfeinerung an der Regel — bitte gegenprüfen

Die drei vorgegebenen Beispiele decken einen Fall nicht ab: **den Doppelvornamen.** „Anna-Lena Schmidt" ergäbe nach der Regel in ihrer ursprünglichen Fassung **AL**, weil der Bindestrich wie ein Leerzeichen trennt — richtig wäre **AS**.

**Ich habe der Regel deshalb eine Rangfolge der Trennzeichen gegeben:** Leerzeichen schlägt Punkt, Punkt schlägt Bindestrich und Unterstrich, und erst wenn keines davon vorkommt, greift die Binnengroßschreibung. Ein Doppelvorname bleibt damit zusammen, sobald ein stärkeres Trennzeichen im Namen steht.

**Alle sieben dokumentierten Fälle liefern unverändert dasselbe Ergebnis.** Geprüft an 17 Fällen:

| Eingabe | Ergebnis | |
|---|---|---|
| `Anna-Lena Schmidt` | **AS** | vorher AL |
| `anna-lena.schmidt@medo.de` | **AS** | vorher AL |
| `anna-lena` | **AL** | unverändert — hier ist der Bindestrich das stärkste Trennzeichen |
| `anna_mueller` | **AM** | |
| `ÖzgürYilmaz` | **ÖY** | Umlaute in der Binnengroßschreibung |
| `  Andreas   Müller ` | **AM** | überzählige Leerzeichen |
| leer / nicht gesetzt | leer | fällt auf das Personen-Symbol zurück |

> **Zur Kenntnis für den Inhaber:** Das ist die einzige Stelle, an der ich über den freigegebenen Stand hinausgegangen bin. Sie ändert keines Ihrer drei Beispiele — sie schließt eine Lücke, die Ihre Beispiele nicht abdecken konnten. Wenn Sie das anders wollen, sagen Sie es; ich nehme es zurück.

---

## Datei 1 von 10 — `ui/Avatar.jsx`

```jsx
window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Avatar
   Zeigt, um welche Person es geht: ein Bild, sonst zwei Buchstaben, sonst ein
   Personen-Symbol. Immer rund — rund ist im System eine Person, eckig eine Sache.

   Die Farbe gehört zur Person: sie wird bei der Registrierung vergeben und ist
   von ihr änderbar. Sie wird nie berechnet, nie aus dem Namen abgeleitet und nie
   aus der Position in einer Liste bestimmt. Zwei Personen dürfen dieselbe Farbe
   haben; die Farbe trägt keine Bedeutung und ist kein Ordnungsmerkmal. */

const MEDO_AVATAR_CSS = `
.medo-av{
  box-sizing: border-box;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: var(--medo-radius-full);
  font-family: var(--medo-font-sans);
  font-weight: var(--medo-weight-semibold);
  /* 0.02em liegt auf keiner Tracking-Stufe. Bewusste Ausnahme, vom Inhaber
     entschieden: der Wert wird bereits so ausgeliefert. Nicht angleichen. */
  letter-spacing: 0.02em;
  color: var(--medo-color-white);
  user-select: none;
}
.medo-av__img{ width: 100%; height: 100%; object-fit: cover; display: block; }

/* 30px und 38px liegen auf keiner Abstandsstufe (24/32/48). Bewusste Ausnahme,
   vom Inhaber entschieden: beide Maße werden bereits so ausgeliefert, ein
   Umstellen würde fremde Einbindungen anfassen. Nicht auf Token ziehen.
   Die dritte Größe ist davon nicht betroffen — 64px ist space-3xl. */
.medo-av--sm{ width: 30px; height: 30px; font-size: var(--medo-text-xs); }
.medo-av--md{ width: 38px; height: 38px; font-size: var(--medo-text-xs); }
.medo-av--lg{
  width: var(--medo-space-3xl);
  height: var(--medo-space-3xl);
  font-size: var(--medo-text-xl);
}

/* Die fünfzehn Farbschemata. Weiße Schrift durchgehend — geprüft nach WCAG 2.2,
   schwächster Wert der Reihe 5,84 (Teal) gegen die geforderten 4,5.
   Fünf Familien stehen nicht auf 600: Orange, Amber und Gelb tragen dort keine
   weiße Schrift, Violett läge zu nah an Indigo, Stein zu nah an Grau.
   Bewusste Abweichung vom Grundsatz „600 = main/solid color", die nur für den
   Avatar gilt — die Person wählt ihr Schema selbst, keine Wahl darf schlecht
   aussehen. Für Tags, Schaltflächen und Statusfarben bleibt 600 unangetastet. */
.medo-av--red{     background: var(--medo-color-red-600); }
.medo-av--crimson{ background: var(--medo-color-crimson-600); }
.medo-av--rose{    background: var(--medo-color-rose-600); }
.medo-av--orange{  background: var(--medo-color-orange-900); }
.medo-av--amber{   background: var(--medo-color-amber-800); }
.medo-av--yellow{  background: var(--medo-color-yellow-900); }
.medo-av--green{   background: var(--medo-color-green-600); }
.medo-av--teal{    background: var(--medo-color-teal-600); }
.medo-av--cyan{    background: var(--medo-color-cyan-600); }
.medo-av--blue{    background: var(--medo-color-blue-600); }
.medo-av--indigo{  background: var(--medo-color-indigo-600); }
.medo-av--violet{  background: var(--medo-color-violet-800); }
.medo-av--purple{  background: var(--medo-color-purple-600); }
.medo-av--grey{    background: var(--medo-color-grey-600); }
.medo-av--stone{   background: var(--medo-color-stone-900); }

/* Kein Name vorhanden: Personen-Symbol in getönter Fläche. */
.medo-av--symbol{ background: var(--medo-surface-sunken); color: var(--medo-icon-muted); }
/* Solange die Daten unterwegs sind: leerer grauer Kreis in derselben Größe,
   damit beim Eintreffen nichts springt. */
.medo-av--loading{ background: var(--medo-surface-container-high); }
`;

const MEDO_AVATAR_COLORS = [
  "red", "crimson", "rose", "orange", "amber", "yellow", "green", "teal",
  "cyan", "blue", "indigo", "violet", "purple", "grey", "stone",
];

/* Symbolgröße im Verhältnis 1:2 zum Kreis — dasselbe Verhältnis, das die
   Contained-list im Leerzustand verwendet (52px Kreis, 26px Symbol). */
const MEDO_AVATAR_GLYPH = { sm: 15, md: 19, lg: 32 };

/* Zwei Buchstaben aus Name oder Benutzername.

   Rangfolge der Trennzeichen: Leerzeichen schlägt Punkt, Punkt schlägt
   Bindestrich und Unterstrich. Erst wenn keines vorkommt, trennt die
   Binnengroßschreibung; bleibt auch die aus, zählen die ersten zwei Zeichen.
   Die Rangfolge hält Doppelvornamen zusammen: "Anna-Lena Schmidt" ergibt AS,
   nicht AL. Bei einer E-Mail-Adresse zählt nur der Teil vor dem @.

   Andreas Müller -> AM · PeterZeider -> PZ · renatosanches -> RE
   Dr. Marie Hoffmann -> DM · anna.mueller -> AM · anna@medo.de -> AN
   Müller -> MÜ */
function medoAvatarInitials(name) {
  if (!name) return "";
  const local = String(name).split("@")[0].trim();
  if (!local) return "";
  let parts = [local];
  const trenner = [/\s+/, /\./, /[-_]/];
  for (let i = 0; i < trenner.length && parts.length === 1; i++) {
    const versuch = local.split(trenner[i]).filter(Boolean);
    if (versuch.length > 1) parts = versuch;
  }
  if (parts.length === 1) {
    const camel = parts[0].split(/(?=\p{Lu})/u).filter(Boolean);
    if (camel.length > 1) parts = camel;
  }
  const letters =
    parts.length > 1 ? parts[0].charAt(0) + parts[1].charAt(0) : parts[0].slice(0, 2);
  return letters.toLocaleUpperCase("de-DE");
}

const Avatar = ({
  name,
  initials,
  src,
  color = "teal",
  size = "md",
  loading = false,
  label,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-avatar-css", MEDO_AVATAR_CSS);

  /* Beide Haken stehen unbedingt am Anfang — nie hinter einer Bedingung. */
  const [imgFailed, setImgFailed] = React.useState(false);
  React.useEffect(() => { setImgFailed(false); }, [src]);

  const IconCmp = window.MedoUI && window.MedoUI.Icon;
  const letters = initials != null && initials !== "" ? initials : medoAvatarInitials(name);
  const scheme = MEDO_AVATAR_COLORS.indexOf(color) >= 0 ? color : "teal";

  /* Der Rückfall in der freigegebenen Reihenfolge. Dass ein Bild nicht lädt,
     ist keine hypothetische Absicherung, sondern tritt im Betrieb regelmäßig
     ein — veraltete Adresse, Server antwortet nicht, Netz weg. */
  const showImage = !loading && !!src && !imgFailed;
  const showLetters = !loading && !showImage && !!letters;
  const showSymbol = !loading && !showImage && !showLetters;

  const modifier = loading
    ? "medo-av--loading"
    : showSymbol
    ? "medo-av--symbol"
    : showImage
    ? null
    : "medo-av--" + scheme;

  /* Steht der Name daneben, ist der Kreis für Vorleseprogramme überflüssig —
     "AM" vorgelesen zu bekommen hilft niemandem. Steht er allein, gibt der
     Aufrufer über `label` eine Beschriftung mit. */
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": "true" };

  return React.createElement(
    "span",
    Object.assign(
      {
        className: ["medo-av", "medo-av--" + size, modifier, className]
          .filter(Boolean)
          .join(" "),
        style: style,
      },
      a11y,
      rest
    ),
    showImage
      ? React.createElement("img", {
          className: "medo-av__img",
          src: src,
          alt: "",
          onError: () => setImgFailed(true),
        })
      : showLetters
      ? letters
      : showSymbol && IconCmp
      ? React.createElement(IconCmp, { name: "person", size: MEDO_AVATAR_GLYPH[size] || 19 })
      : null
  );
};

export { Avatar, medoAvatarInitials };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Avatar = Avatar;
window.MedoUI.avatarInitials = medoAvatarInitials;
```

**Zwei Dinge, die beim Anlegen nicht wegfallen dürfen:**

- **Beide React-Haken stehen unbedingt am Anfang**, nicht hinter einer Bedingung. Der `useEffect` setzt den Fehlerzustand zurück, wenn sich `src` ändert — ohne ihn bliebe ein Avatar nach einem Bildwechsel dauerhaft auf den Buchstaben stehen.
- **`rest` steht in `Object.assign` nach `a11y`.** Das ist Absicht: Ein Aufrufer darf `aria-hidden` bewusst überschreiben, etwa wenn der Avatar ausnahmsweise allein steht.

---

## Datei 2 von 10 — `ui/Avatar.d.ts`

```ts
import type * as React from "react";

/** Die fünfzehn Farbschemata des Systems. Das Schema gehört zur Person: es wird
 *  bei der Registrierung vergeben und ist von ihr änderbar. Nie berechnen. */
export type AvatarColor =
  | "red" | "crimson" | "rose" | "orange" | "amber" | "yellow" | "green"
  | "teal" | "cyan" | "blue" | "indigo" | "violet" | "purple" | "grey" | "stone";

export interface AvatarProps {
  /** Name oder Benutzername. Daraus entstehen die zwei Buchstaben. */
  name?: string;
  /** Buchstaben unmittelbar vorgeben und die Ableitung aus `name` übergehen. */
  initials?: string;
  /** Bildadresse. Lädt das Bild nicht, erscheinen die Buchstaben. */
  src?: string;
  /** Farbschema der Person. Der Aufrufer übergibt den gespeicherten Wert.
   *  Standard `teal`, bis die Anwendung ihn liefert. */
  color?: AvatarColor;
  /** `sm` 30px in Tabellenzeilen, `md` 38px in Listenzeilen, `lg` 64px im Profil. */
  size?: "sm" | "md" | "lg";
  /** Leerer grauer Kreis, solange die Daten unterwegs sind. */
  loading?: boolean;
  /** Beschriftung für Vorleseprogramme. Nur setzen, wenn der Avatar allein steht —
   *  steht der Name daneben, bleibt der Kreis stumm. */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Avatar: React.FC<AvatarProps>;

/** Die Ableitung der zwei Buchstaben, einzeln nutzbar. */
export function medoAvatarInitials(name?: string): string;
```

> **Namensprüfung:** `AvatarColor` ist ein neuer Typname und kommt in keinem bestehenden Vertrag vor — der Vertragsgenerator erzeugt je Vertrag ein `export type`, doppelte Namen brächen den Paketbau. Keine Prop kollidiert mit einem HTML-Attribut anderen Typs; das Wurzelelement ist ein `span`.
---

## Datei 3 von 10 — `ui/Avatar.prompt.md`

````markdown
# Avatar

Zeigt, um welche Person es geht. Ein Kreis mit Bild, sonst mit zwei Buchstaben, sonst mit
einem Personen-Symbol. Immer rund — **rund ist im System eine Person, eckig eine Sache.**
Diese Unterscheidung ist durchgehend eingehalten; eine eckige Avatar-Variante gibt es nicht.

## Die Farbe gehört zur Person

Das Farbschema wird **bei der Registrierung vergeben** und ist von der Person **später
änderbar**. Der Aufrufer übergibt den gespeicherten Wert; die Komponente rechnet nichts aus.

Daraus folgt dreierlei:

- **Die Farbe wird nie berechnet** — nicht aus dem Namen, nicht aus der Position in einer
  Liste, nicht aus einer laufenden Nummer. Eine berechnete Farbe ließe sich nicht ändern und
  spränge beim Umsortieren.
- **Zwei Personen dürfen dieselbe Farbe haben.** Das Schema ist eine persönliche Einstellung,
  kein eindeutiges Erkennungszeichen. Bei fünfzehn Farben und freier Wahl ließe sich
  Eindeutigkeit ohnehin nicht erzwingen. Das ist kein Fehler und darf nicht „repariert" werden.
- **Die Farbe trägt keine Bedeutung.** Sie sagt nichts über Rolle, Status oder Rang.
  **Es wird nicht nach Farbe sortiert und nicht nach Farbe gefiltert.**

Alle fünfzehn Schemata tragen weiße Schrift und sind auf Lesbarkeit geprüft. Sie müssen als
**Auswahl** taugen, nicht nur als Zuteilung: Die Person wählt selbst, keine Wahl darf schlecht
aussehen.

## Was im Kreis steht

In dieser Reihenfolge:

1. **Bild**, kreisrund beschnitten — sobald `src` gesetzt ist und lädt.
2. **Zwei Buchstaben** — wenn kein Bild da ist **oder das Bild nicht lädt**.
3. **Personen-Symbol** — wenn es gar keinen Namen gibt: gelöschtes Konto, offene Einladung,
   Systemvorgang ohne Person dahinter.

Dass ein Bild nicht lädt, ist kein Sonderfall. Veraltete Adresse, Server antwortet nicht, Netz
weg — das tritt im Betrieb regelmäßig ein. Der Anwender sieht dann kein kaputtes Bildsymbol,
sondern schlicht die Buchstaben. Der Rückfall ist als Fehler nicht erkennbar, und das ist gewollt.

## Die Buchstaben

Aus Vor- und Nachname, sonst aus dem Benutzernamen. Rangfolge der Trennzeichen: **Leerzeichen
schlägt Punkt, Punkt schlägt Bindestrich und Unterstrich.** Kommt keines vor, trennt die
Binnengroßschreibung; bleibt auch die aus, zählen die ersten zwei Zeichen. Bei einer
E-Mail-Adresse zählt nur der Teil vor dem `@`.

Die Rangfolge hält Doppelvornamen zusammen: „Anna-Lena Schmidt" ergibt **AS**, nicht AL.

| Eingabe | Ergebnis |
|---|---|
| `Andreas Müller` | AM |
| `PeterZeider` | PZ |
| `renatosanches` | RE |
| `Dr. Marie Hoffmann` | DM |
| `anna.mueller` | AM |
| `anna@medo.de` | AN |
| `Anna-Lena Schmidt` | AS |
| `Müller` | MÜ |

`initials` übergeht die Ableitung, wenn eine Anwendung die Buchstaben schon kennt.

## Maße

**30px (`sm`)** in Tabellenzeilen, **38px (`md`)** in Listenzeilen, **64px (`lg`)** auf
Profilseiten. Mehr Größen gibt es nicht.

30 und 38 liegen bewusst neben den Abstandsstufen — beide Maße werden bereits so ausgeliefert.
**Nicht auf Token-Stufen ziehen.** 64px ist `space-3xl` und damit token-genau.

## Für Vorleseprogramme

Der Avatar ist **stumm**, solange der Name daneben steht — „AM" vorgelesen zu bekommen hilft
niemandem. Steht er ausnahmsweise allein, gibt der Aufrufer `label` mit; dann wird er als Bild
mit Beschriftung angekündigt.

## Nicht tun

- Die Farbe aus dem Namen oder der Zeilennummer errechnen.
- Nach Farbe sortieren oder filtern, oder ihr eine Bedeutung geben.
- Eindeutigkeit der Farben erzwingen wollen.
- Eine eckige Variante bauen — eckig ist im System eine Sache, keine Person.
- Einen Anwesenheitspunkt, überlappende Gruppen oder einen klickbaren Avatar ergänzen.
  Nichts davon kommt im System vor.
- Den Avatar ohne `label` allein stehen lassen.

## Beispiel

```jsx
<Avatar name="Andreas Müller" color="blue" />
<Avatar name="Andreas Müller" color="blue" src={person.bild} size="lg" />
<Avatar loading size="sm" />
<Avatar label="Gelöschtes Konto" />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/Avatar.jsx`. Tokens aus `styles.css`.
````

---

## Datei 4 von 10 — `ui/Avatar.card.html`

```html
<!-- @dsCard group="Komponenten" viewport="700x400" name="Avatar" subtitle="Bild, Buchstaben oder Symbol — fünfzehn Farbschemata, drei Größen" -->
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="../styles.css">
<style>
  html,body{margin:0}
  body{padding:20px 22px;font-family:var(--medo-font-sans);background:var(--medo-surface);color:var(--medo-text);min-height:400px;box-sizing:border-box}
  .lbl{font-family:var(--medo-font-mono);font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:var(--medo-color-stone-500);margin-bottom:10px}
  .grp{margin-bottom:18px}
  .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  .sub{font-size:12px;font-weight:600;margin-bottom:8px}
</style>
</head>
<body>
<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="../_ds_bundle.js"></script>
<script>
  var h = React.createElement;
  var MedoAvatar = window.MedoUI.Avatar;

  var schemata = ['red','crimson','rose','orange','amber','yellow','green','teal',
                  'cyan','blue','indigo','violet','purple','grey','stone'];

  function App() {
    return h('div', null,
      h('div', { className: 'grp' },
        h('div', { className: 'lbl' }, 'Fünfzehn Farbschemata'),
        h('div', { className: 'row' },
          schemata.map(function (s, i) {
            return h(MedoAvatar, { key: s, color: s, name: 'Andreas Müller', size: 'md' });
          })
        )
      ),
      h('div', { className: 'grp' },
        h('div', { className: 'lbl' }, 'Drei Größen'),
        h('div', { className: 'row', style: { alignItems: 'flex-end' } },
          h(MedoAvatar, { color: 'blue', name: 'Andreas Müller', size: 'sm' }),
          h(MedoAvatar, { color: 'blue', name: 'Andreas Müller', size: 'md' }),
          h(MedoAvatar, { color: 'blue', name: 'Andreas Müller', size: 'lg' })
        )
      ),
      h('div', { className: 'grp' },
        h('div', { className: 'lbl' }, 'Buchstaben aus Name oder Benutzername'),
        h('div', { className: 'row' },
          h(MedoAvatar, { color: 'teal', name: 'Andreas Müller' }),
          h(MedoAvatar, { color: 'indigo', name: 'PeterZeider' }),
          h(MedoAvatar, { color: 'rose', name: 'renatosanches' }),
          h(MedoAvatar, { color: 'green', name: 'Dr. Marie Hoffmann' }),
          h(MedoAvatar, { color: 'cyan', name: 'Anna-Lena Schmidt' })
        )
      ),
      h('div', { className: 'grp' },
        h('div', { className: 'lbl' }, 'Ohne Namen · Beim Laden'),
        h('div', { className: 'row' },
          h(MedoAvatar, { label: 'Gelöschtes Konto' }),
          h(MedoAvatar, { loading: true }),
          h(MedoAvatar, { loading: true, size: 'sm' })
        )
      )
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(h(App));
</script>
</body>
</html>
```

> **Hinweis:** Die Karte bindet `../_ds_bundle.js` ein wie alle anderen. Im Spiegel dieses Repositories fehlt dieses Bündel, weshalb die Karten dort leer rendern — im Design-Projekt ist es vorhanden.
---

## Datei 5 von 10 — `components/Avatar.dc.html`

Die Spezifikationsseite. Sie läuft eigenständig, ohne Entwicklungsserver.

> **Zum Farbblock:** Die bestehenden Seiten rechnen ihre Farben aus. Das geht hier nicht, weil die Erzeugungsangaben für 9 der 15 Familien nicht im Spiegel stehen (siehe Punkt 3 oben). Die Werte unten stammen unverändert aus der Quelle der Wahrheit. **Wer die Angaben hat, darf den Block auf Berechnung umstellen — die Ergebniswerte müssen dieselben bleiben.**

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,300,0,0" rel="stylesheet">
<style>
  *{box-sizing:border-box}
  body{margin:0}
  ::selection{background:#e6e1d8}
  .msr{font-family:'Material Symbols Rounded';font-weight:300;line-height:1;display:inline-block}
  .av{display:inline-flex;align-items:center;justify-content:center;border-radius:9999px;flex:none;overflow:hidden;font-weight:600;letter-spacing:0.02em;color:#ffffff}
  .av-sm{width:30px;height:30px;font-size:12px}
  .av-md{width:38px;height:38px;font-size:12px}
  .av-lg{width:64px;height:64px;font-size:25px}
  .card{background:#fff;border:1px solid #e9e6e1;border-radius:16px;padding:36px;margin-bottom:48px}
  .eyebrow{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:0.12em;color:#a49d92;text-transform:uppercase;margin-bottom:18px}
  .cap{font-family:'DM Mono',monospace;font-size:11px;color:#a49d92;text-align:center;margin-top:8px}
  .stack{display:flex;flex-direction:column;align-items:center}
  .lrow{display:flex;align-items:center;gap:14px;padding:14px 16px;border-top:1px solid #ececeb}
  .lrow:first-child{border-top:none}
</style>
</helmet>

<div style="min-height:100%;background:#faf9f7;color:#1f1d1a;font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;padding:56px 40px 120px">
  <div style="max-width:1000px;margin:0 auto">

    <!-- HEADER -->
    <div style="margin-bottom:48px">
      <div style="font-family:'DM Mono',monospace;font-size:12px;letter-spacing:0.16em;color:#a49d92;text-transform:uppercase;margin-bottom:16px">Design System · Komponente · Avatar</div>
      <h1 style="font-size:49px;line-height:1.1;font-weight:700;letter-spacing:-0.02em;margin:0 0 14px">Avatar</h1>
      <p style="font-size:20px;line-height:1.5;color:#6f6a63;margin:0;max-width:680px">Zeigt, um welche Person es geht. Bild, sonst zwei Buchstaben, sonst ein Personen-Symbol. Fünfzehn Farbschemata, drei Größen. Immer rund — rund ist eine Person, eckig eine Sache.</p>
    </div>

    <!-- FARBSCHEMATA -->
    <div class="eyebrow">Farbschemata · fünfzehn, alle mit weißer Schrift</div>
    <div class="card">
      <div style="display:flex;gap:22px;flex-wrap:wrap">
        <sc-for list="{{ schemes }}" as="s" hint-placeholder-count="15">
          <div class="stack">
            <span class="av av-md" style="background:{{ s.bg }}">AM</span>
            <span class="cap">{{ s.name }}<br>{{ s.ratio }}</span>
          </div>
        </sc-for>
      </div>
      <p style="font-size:13px;line-height:1.6;color:#6f6a63;margin:26px 0 0;max-width:76ch">Die Farbe gehört zur Person: bei der Registrierung vergeben, von ihr änderbar. Sie wird nie berechnet. Zwei Personen dürfen dieselbe Farbe haben; die Farbe trägt keine Bedeutung und ist kein Ordnungsmerkmal. Orange, Amber, Gelb, Violett und Stein stehen bewusst nicht auf Stufe 600 — dort trügen sie keine weiße Schrift oder lägen zu nah an einer Nachbarfamilie.</p>
    </div>

    <!-- GRÖSSEN -->
    <div class="eyebrow">Größen</div>
    <div class="card">
      <div style="display:flex;gap:48px;align-items:flex-end">
        <div class="stack"><span class="av av-sm" style="background:{{ blue }}">AM</span><span class="cap">sm · 30px<br>Tabellenzeile</span></div>
        <div class="stack"><span class="av av-md" style="background:{{ blue }}">AM</span><span class="cap">md · 38px<br>Listenzeile</span></div>
        <div class="stack"><span class="av av-lg" style="background:{{ blue }}">AM</span><span class="cap">lg · 64px<br>Profilseite</span></div>
      </div>
      <p style="font-size:13px;line-height:1.6;color:#6f6a63;margin:26px 0 0;max-width:76ch">30 und 38 liegen bewusst neben den Abstandsstufen — beide Maße werden bereits so ausgeliefert. Nicht auf Token-Stufen ziehen. 64px ist space-3xl.</p>
    </div>

    <!-- FÜLLUNG UND RÜCKFALL -->
    <div class="eyebrow">Füllung · in dieser Reihenfolge</div>
    <div class="card">
      <div style="display:flex;gap:40px;align-items:center;flex-wrap:wrap">
        <div class="stack"><span class="av av-lg" style="background:{{ photoBg }}"><span class="msr" style="font-size:32px;color:{{ photoFg }}">person</span></span><span class="cap">1 · Bild</span></div>
        <span class="msr" style="font-size:26px;color:#a49d92">arrow_forward</span>
        <div class="stack"><span class="av av-lg" style="background:{{ blue }}">AM</span><span class="cap">2 · Bild lädt nicht<br>→ Buchstaben</span></div>
        <span class="msr" style="font-size:26px;color:#a49d92">arrow_forward</span>
        <div class="stack"><span class="av av-lg" style="background:{{ sunken }};color:{{ iconMuted }}"><span class="msr" style="font-size:32px">person</span></span><span class="cap">3 · kein Name<br>→ Symbol</span></div>
      </div>
      <p style="font-size:13px;line-height:1.6;color:#6f6a63;margin:26px 0 0;max-width:76ch">Dass ein Bild nicht lädt, tritt im Betrieb regelmäßig ein — veraltete Adresse, Server antwortet nicht, Netz weg. Der Anwender sieht dann kein kaputtes Bildsymbol, sondern die Buchstaben. Der Rückfall ist als Fehler nicht erkennbar, und das ist gewollt.</p>
    </div>

    <!-- BUCHSTABENREGEL -->
    <div class="eyebrow">Buchstaben · aus Name oder Benutzername</div>
    <div class="card">
      <sc-for list="{{ initialsRows }}" as="r" hint-placeholder-count="8">
        <div style="display:flex;align-items:center;gap:18px;padding:9px 0;border-top:1px solid #ececeb">
          <span style="font-family:'DM Mono',monospace;font-size:12px;color:#3f3b36;width:230px;flex:none">{{ r.input }}</span>
          <span class="av av-md" style="background:{{ r.bg }}">{{ r.out }}</span>
          <span style="font-size:13px;color:#6f6a63">{{ r.why }}</span>
        </div>
      </sc-for>
      <p style="font-size:13px;line-height:1.6;color:#6f6a63;margin:26px 0 0;max-width:76ch">Rangfolge der Trennzeichen: Leerzeichen schlägt Punkt, Punkt schlägt Bindestrich und Unterstrich. Kommt keines vor, trennt die Binnengroßschreibung; bleibt auch die aus, zählen die ersten zwei Zeichen. Die Rangfolge hält Doppelvornamen zusammen.</p>
    </div>

    <!-- ZUSTÄNDE -->
    <div class="eyebrow">Zustände</div>
    <div class="card">
      <div style="display:flex;gap:40px;align-items:center;flex-wrap:wrap">
        <div class="stack"><span class="av av-md" style="background:{{ blue }}">AM</span><span class="cap">Ruhe</span></div>
        <div class="stack"><span class="av av-md" style="background:{{ skeleton }}"></span><span class="cap">Laden</span></div>
        <div class="stack"><span class="av av-md" style="background:{{ sunken }};color:{{ iconMuted }}"><span class="msr" style="font-size:19px">person</span></span><span class="cap">Ohne Namen</span></div>
        <div class="stack" style="opacity:0.5"><span class="av av-md" style="background:{{ blue }}">AM</span><span class="cap">In deaktivierter Zeile</span></div>
      </div>
      <p style="font-size:13px;line-height:1.6;color:#6f6a63;margin:26px 0 0;max-width:76ch">Der Avatar hat keinen eigenen Deaktiviert-Zustand und keinen Hover- oder Fokuszustand. Die Umgebung regelt das: In einer deaktivierten Zeile wird die ganze Zeile abgeblendet, in einer klickbaren Zeile reagiert die Zeile, nicht der Kreis.</p>
    </div>

    <!-- IM EINSATZ -->
    <div class="eyebrow">Im Einsatz</div>
    <div class="card">
      <div style="font-size:13px;font-weight:600;margin-bottom:14px">Tabellenzeile · sm</div>
      <sc-for list="{{ people }}" as="p" hint-placeholder-count="4">
        <div style="display:flex;align-items:center;gap:11px;padding:10px 0;border-top:1px solid #ececeb">
          <span class="av av-sm" style="background:{{ p.bg }}">{{ p.initials }}</span>
          <div><div style="font-size:14px;font-weight:600">{{ p.name }}</div><div style="font-size:12px;color:#6f6a63">{{ p.mail }}</div></div>
        </div>
      </sc-for>

      <div style="font-size:13px;font-weight:600;margin:32px 0 14px">Listenzeile · md · einfarbig</div>
      <div style="border:1px solid #e9e6e1;border-radius:14px;overflow:hidden;max-width:520px">
        <sc-for list="{{ people }}" as="p" hint-placeholder-count="4">
          <div class="lrow">
            <span class="av av-md" style="background:{{ teal }}">{{ p.initials }}</span>
            <div style="flex:1;min-width:0"><div style="font-size:16px;font-weight:600">{{ p.name }}</div><div style="font-size:13px;color:#6f6a63">{{ p.mail }}</div></div>
          </div>
        </sc-for>
      </div>

      <div style="font-size:13px;font-weight:600;margin:32px 0 14px">Profilseite · lg</div>
      <div style="display:flex;align-items:center;gap:18px">
        <span class="av av-lg" style="background:{{ blue }}">AM</span>
        <div><div style="font-size:20px;font-weight:600">Andreas Müller</div><div style="font-size:13px;color:#6f6a63">Admin · andreas@medo.de</div></div>
      </div>
      <p style="font-size:13px;line-height:1.6;color:#6f6a63;margin:26px 0 0;max-width:76ch">In Tabellen wirken die verschiedenen Schemata nebeneinander, in Listen bleibt es ruhig bei einer Farbe. Beides zeigt dieselben Personen — die Farbe einer Person ändert sich dabei nie.</p>
    </div>

    <!-- NUTZUNG -->
    <div class="eyebrow">Nutzung</div>
    <div class="card">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px">
        <div>
          <div style="font-size:13px;font-weight:600;color:#1f7a5a;margin-bottom:12px">So</div>
          <sc-for list="{{ dos }}" as="d" hint-placeholder-count="5">
            <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:9px"><span class="msr" style="font-size:18px;color:#1f7a5a;flex:none">check</span><span style="font-size:14px;line-height:1.55">{{ d }}</span></div>
          </sc-for>
        </div>
        <div>
          <div style="font-size:13px;font-weight:600;color:#b23b2e;margin-bottom:12px">Nicht so</div>
          <sc-for list="{{ donts }}" as="d" hint-placeholder-count="6">
            <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:9px"><span class="msr" style="font-size:18px;color:#b23b2e;flex:none">close</span><span style="font-size:14px;line-height:1.55">{{ d }}</span></div>
          </sc-for>
        </div>
      </div>
    </div>

  </div>
</div>
</x-dc>

<script type="text/x-dc" data-dc-script data-props="{
  &quot;$preview&quot;: { &quot;width&quot;: 1040, &quot;height&quot;: 1500 }
}">
class Component extends DCLogic {
  renderVals() {
    /* Die Ergebniswerte der fünfzehn Brand-Familien, unverändert aus der Quelle
       der Wahrheit. Die übrigen Seiten rechnen ihre Farben aus; hier stehen sie
       fest, weil die Erzeugungsangaben für neun der fünfzehn Familien nicht
       dokumentiert sind. Wer sie hat, darf auf Berechnung umstellen — die
       Ergebniswerte müssen dieselben bleiben. Der Kontrast gegen Weiß ist je
       Familie nach WCAG 2.2 geprüft; gefordert sind 4,5. */
    const schemes = [
      { name: 'Rot',     bg: '#ab0913', ratio: '7,55' },
      { name: 'Karmin',  bg: '#af0034', ratio: '7,31' },
      { name: 'Rosé',    bg: '#ab004c', ratio: '7,40' },
      { name: 'Orange',  bg: '#7e2400', ratio: '9,82' },
      { name: 'Amber',   bg: '#a04800', ratio: '6,14' },
      { name: 'Gelb',    bg: '#794900', ratio: '7,59' },
      { name: 'Grün',    bg: '#007317', ratio: '6,06' },
      { name: 'Teal',    bg: '#007265', ratio: '5,84' },
      { name: 'Cyan',    bg: '#006d87', ratio: '5,94' },
      { name: 'Blau',    bg: '#0059be', ratio: '6,62' },
      { name: 'Indigo',  bg: '#3447c8', ratio: '7,29' },
      { name: 'Violett', bg: '#401b84', ratio: '12,30' },
      { name: 'Purpur',  bg: '#881f9e', ratio: '7,67' },
      { name: 'Grau',    bg: '#595b5e', ratio: '6,81' },
      { name: 'Stein',   bg: '#312d28', ratio: '13,67' }
    ];

    const blue = '#0059be', teal = '#007265';
    const sunken = '#ececeb', skeleton = '#ececeb', iconMuted = '#24221e8c';
    const photoBg = '#adccc8', photoFg = '#004b42';

    const initialsRows = [
      { input: 'Andreas Müller',    out: 'AM', bg: '#007265', why: 'Leerzeichen trennt' },
      { input: 'PeterZeider',       out: 'PZ', bg: '#3447c8', why: 'Großbuchstabe im Wortinneren trennt' },
      { input: 'renatosanches',     out: 'RE', bg: '#ab004c', why: 'kein Trennzeichen → erste zwei Zeichen' },
      { input: 'Dr. Marie Hoffmann', out: 'DM', bg: '#007317', why: 'nach zwei Teilen ist Schluss' },
      { input: 'anna.mueller',      out: 'AM', bg: '#006d87', why: 'Punkt trennt' },
      { input: 'anna@medo.de',      out: 'AN', bg: '#881f9e', why: 'ab dem @ abschneiden, dann erste zwei' },
      { input: 'Anna-Lena Schmidt', out: 'AS', bg: '#0059be', why: 'Leerzeichen schlägt Bindestrich' },
      { input: 'Müller',            out: 'MÜ', bg: '#595b5e', why: 'ein Wort → erste zwei Zeichen' }
    ];

    const people = [
      { name: 'Andreas Müller',   mail: 'andreas@medo.de', initials: 'AM', bg: '#0059be' },
      { name: 'Peter Zeider',     mail: 'peter@medo.de',   initials: 'PZ', bg: '#a04800' },
      { name: 'Clara Schmidt',    mail: 'clara@medo.de',   initials: 'CS', bg: '#007317' },
      { name: 'Anna-Lena Schmidt', mail: 'anna@medo.de',   initials: 'AS', bg: '#401b84' }
    ];

    const dos = [
      'Das gespeicherte Farbschema der Person übergeben.',
      'In Tabellen die Schemata wirken lassen, in Listen einfarbig bleiben.',
      'Den Namen neben den Avatar setzen, damit der Kreis stumm bleiben kann.',
      'Beim Laden den Ladezustand zeigen, damit beim Eintreffen nichts springt.',
      'Steht der Avatar allein, ihm eine Beschriftung mitgeben.'
    ];
    const donts = [
      'Die Farbe aus dem Namen oder der Zeilennummer errechnen.',
      'Nach Farbe sortieren oder filtern.',
      'Der Farbe eine Bedeutung geben — Rolle, Status oder Rang.',
      'Eindeutigkeit der Farben erzwingen wollen.',
      'Eine eckige Variante bauen — eckig ist eine Sache, keine Person.',
      'Anwesenheitspunkt, überlappende Gruppen oder klickbaren Avatar ergänzen.'
    ];

    return { schemes, blue, teal, sunken, skeleton, iconMuted, photoBg, photoFg,
             initialsRows, people, dos, donts };
  }
}
</script>
</body>
</html>
```
---

# Teil B — Textarea

Das mehrzeilige Eingabefeld — dort, wo jemand einen Befund, eine Notiz oder eine Begründung schreibt.

## Die Richtung ist hier bewusst umgekehrt

Sonst gilt: Die Quelle im Design-Projekt ist maßgeblich, der ausgelieferte Code folgt ihr. **Hier ist es umgekehrt.** Die Komponente existiert im Design-Projekt bisher überhaupt nicht — sie wurde in einer früheren Sitzung frei geschrieben und **wird bereits an fremde Projekte ausgeliefert.**

Oben neu zu entwerfen und den ausgelieferten Code daran anzupassen könnte fremde Einbindungen brechen. Deshalb beschreiben die Dateien unten **den bestehenden Code**, ergänzt um die vier Angleichungen, die der Inhaber am 28.08.2026 freigegeben hat.

## Was gegenüber dem ausgelieferten Stand angeglichen ist

| | Was heute passiert | Was die Dateien unten tun |
|---|---|---|
| 1 | Gibt der Aufrufer eine eigene Reaktion auf das Hineinklicken mit, **verschwindet der Fokusrahmen** | beide laufen nebeneinander |
| 2 | Eine eigene Verknüpfung zu einem Hinweistext **verdrängt die Fehlermeldung** für Vorleseprogramme | beide Verknüpfungen stehen nebeneinander |
| 3 | Eine eigene Fehlerkennzeichnung **überschreibt** die eingebaute, obwohl die rote Meldung sichtbar bleibt | die eingebaute bleibt bestehen |
| 4 | `lg` wirkt genau wie `md` | `lg` wird über den Innenabstand sichtbar größer |
| 5 | Eine Vorbelegung mit der Zahl `0` **kommt leer an** | die `0` erscheint |

**Nicht enthalten ist Punkt 6** aus der Abweichungsliste (Text zwischen den Klammern verschwindet lautlos). Der ist zurückgestellt und soll gemeinsam mit `TextInput` entschieden werden — **bitte hier nicht mitziehen.**

> **Zur Erinnerung an Punkt 1 der Klärungen oben:** Die Lösung für `lg` läuft über den Innenabstand, **nicht über die Schriftgröße**. Der gelockte Beschluss „field text sm=14 / md=16 / lg=16" bleibt damit unangetastet.

---

## Datei 6 von 10 — `ui/Textarea.jsx`

```jsx
window.MedoUI = window.MedoUI || {};
window.MedoUI.injectCss = window.MedoUI.injectCss || function (id, css) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id; el.textContent = css; document.head.appendChild(el);
};
/* medo Design System · Textarea
   Mehrzeiliges Eingabefeld auf dem gemeinsamen Feld-Gerüst aus Field.jsx.
   Zustände: Ruhe, Hover, Fokus, gesperrt, schreibgeschützt, Fehler, Erfolg. */

const MEDO_TEXTAREA_CSS = `
/* Die einzeilige Feldhülle legt eine feste Höhe fest und zentriert ihren Inhalt.
   Beides muss hier weichen: die Höhe kommt von der Zeilenzahl. */
.medo-ta__box{
  height: auto;
  align-items: flex-start;
}

/* Weil die feste Höhe entfällt, verliert die Größe bei einzeiligen Feldern ihr
   Unterscheidungsmerkmal. Sie kommt hier über den Innenabstand zurück — nicht
   über die Schriftgröße, denn die ist gelockt auf sm=14 / md=16 / lg=16. */
.medo-ta__box.medo-field__box--sm{
  padding-top: var(--medo-space-2xs);
  padding-bottom: var(--medo-space-2xs);
}
.medo-ta__box.medo-field__box--md{
  padding-top: var(--medo-space-xs);
  padding-bottom: var(--medo-space-xs);
}
.medo-ta__box.medo-field__box--lg{
  padding-top: var(--medo-space-sm);
  padding-bottom: var(--medo-space-sm);
}

.medo-ta__control{
  line-height: var(--medo-leading-normal);
  font-family: var(--medo-font-sans);
}

.medo-ta__control--vertical{ resize: vertical; }
.medo-ta__control--none{ resize: none; }
.medo-ta__control--both{ resize: both; }

.medo-ta__counter{ align-self: flex-end; }
`;

const Textarea = ({
  label,
  id,
  value,
  defaultValue,
  placeholder,
  rows = 3,
  size = "md",
  required = false,
  optional = false,
  disabled = false,
  readOnly = false,
  hint,
  error,
  success,
  maxLength,
  showCounter = false,
  resize = "vertical",
  onChange,
  onFocus,
  onBlur,
  fullWidth = false,
  name,
  className,
  style,
  ...rest
}) => {
  window.MedoUI.injectCss("medo-textarea-css", MEDO_TEXTAREA_CSS);

  const FieldCmp = window.MedoUI && window.MedoUI.Field;

  /* Eine Vorbelegung mit der Zahl 0 ist ein gültiger Wert. `defaultValue || ""`
     verschluckte sie, weil 0 falsy ist. */
  const [internal, setInternal] = React.useState(
    defaultValue != null ? String(defaultValue) : ""
  );
  const [focused, setFocused] = React.useState(false);

  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const autoId = React.useId();
  const fieldId = id || autoId;

  const handleChange = (e) => {
    if (!isControlled) setInternal(e.target.value);
    if (onChange) onChange(e);
  };
  /* Die eigene Reaktion des Aufrufers verdrängt die eingebaute nicht — sonst
     verschwände der Fokusrahmen still, sobald jemand onFocus mitgibt. */
  const handleFocus = (e) => {
    setFocused(true);
    if (onFocus) onFocus(e);
  };
  const handleBlur = (e) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };

  const msgId = error || success || hint ? fieldId + "-msg" : null;
  /* Eine eigene Verknüpfung des Aufrufers tritt neben die zur Meldung, statt sie
     zu ersetzen. aria-describedby verträgt mehrere durch Leerzeichen getrennte
     Verweise; das ist genau der vorgesehene Weg. */
  const describedBy = [rest["aria-describedby"], msgId].filter(Boolean).join(" ") || undefined;
  /* Die eingebaute Fehlerkennzeichnung bleibt bestehen: ein Feld, unter dem eine
     rote Meldung steht, ist fehlerhaft — auch wenn der Aufrufer etwas anderes
     mitgibt. Ohne Fehler entscheidet weiterhin der Aufrufer. */
  const invalid = error ? "true" : rest["aria-invalid"];

  const boxClasses = [
    "medo-field__box",
    "medo-field__box--" + size,
    "medo-ta__box",
    focused && !disabled ? "medo-field__box--focus" : null,
    error ? "medo-field__box--error" : null,
    success && !error ? "medo-field__box--success" : null,
    disabled ? "medo-field__box--disabled" : null,
    readOnly && !disabled ? "medo-field__box--readonly" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return React.createElement(
    FieldCmp,
    {
      label: label,
      htmlFor: fieldId,
      required: required,
      optional: optional,
      hint: hint,
      error: error,
      success: success,
      fullWidth: fullWidth,
      className: className,
      style: style,
    },
    React.createElement(
      "div",
      { className: boxClasses },
      React.createElement(
        "textarea",
        Object.assign({}, rest, {
          id: fieldId,
          className:
            "medo-field__control medo-ta__control medo-ta__control--" + resize,
          rows: rows,
          value: current,
          placeholder: placeholder,
          disabled: disabled,
          readOnly: readOnly,
          required: required,
          maxLength: maxLength,
          name: name,
          "aria-invalid": invalid,
          "aria-describedby": describedBy,
          onChange: handleChange,
          onFocus: handleFocus,
          onBlur: handleBlur,
        })
      ),
      showCounter && maxLength
        ? React.createElement(
            "span",
            { className: "medo-field__counter medo-ta__counter" },
            String(current || "").length + "/" + maxLength
          )
        : null
    )
  );
};

export { Textarea };
window.MedoUI = window.MedoUI || {};
window.MedoUI.Textarea = Textarea;
```

**Die entscheidende Änderung gegenüber dem ausgelieferten Stand** steht in einer einzigen Zeile: `Object.assign({}, rest, { … })`. Die Durchreichung des Aufrufers steht jetzt **vor** den eigenen Angaben statt dahinter. Damit kann sie die eigenen nicht mehr verdrängen — und das behebt die Punkte 1, 2 und 3 zusammen.

`onFocus` und `onBlur` sind zusätzlich aus `rest` herausgenommen und werden in `handleFocus`/`handleBlur` aufgerufen, damit beide Reaktionen laufen. `aria-describedby` und `aria-invalid` werden aus `rest` gelesen und zusammengeführt statt überschrieben.
---

## Datei 7 von 10 — `ui/Textarea.d.ts`

```ts
import type * as React from "react";

/* React.TextareaHTMLAttributes deklariert — anders als InputHTMLAttributes —
   kein `size`. Ein Omit wie in TextInput.d.ts ist deshalb nicht nötig. */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Immer sichtbares Label über dem Feld. Ein Platzhalter ersetzt es nicht. */
  label?: string;
  /** Schriftgröße wie bei allen Feldern: `sm` 14px, `md` und `lg` je 16px.
   *  Die Höhe kommt von `rows`; `lg` unterscheidet sich vom `md` deshalb über
   *  den Innenabstand, nicht über die Schrift. */
  size?: "sm" | "md" | "lg";
  /** Setzt den roten Stern hinter das Label und zugleich das native `required`. */
  required?: boolean;
  /** Setzt „(optional)" hinter das Label. Zusammen mit `required` wirkungslos. */
  optional?: boolean;
  /** Erklärender Text unter dem Feld. Wird von `error` und `success` verdrängt. */
  hint?: string;
  /** Fehlermeldung unter dem Feld. Setzt `aria-invalid` und `role="alert"`.
   *  Nennt Ursache und nächsten Schritt, nicht nur den Zustand. */
  error?: string;
  /** Bestätigung unter dem Feld. Wird von `error` verdrängt. */
  success?: string;
  /** Sichtbare Zeilen und damit die Höhe des Feldes. Standard 3. */
  rows?: number;
  /** Zeigt „24/100" am unteren Rand des Feldes. Ohne `maxLength` wirkungslos. */
  showCounter?: boolean;
  /** Ob der Anwender das Feld ziehen darf. Standard `vertical`. */
  resize?: "vertical" | "none" | "both";
  /** Feld nimmt die volle Breite des Elternelements ein. */
  fullWidth?: boolean;
  /** Liegt auf der äußeren Hülle des Feldes, nicht auf dem Eingabeelement. */
  className?: string;
  /** Liegt auf der äußeren Hülle des Feldes, nicht auf dem Eingabeelement. */
  style?: React.CSSProperties;
}

export const Textarea: React.FC<TextareaProps>;
```

> **Namensprüfung:** `TextareaProps` kommt in keinem bestehenden Vertrag vor. Der Vertrag deklariert `size` **inline** statt den Typ `FieldSize` erneut zu exportieren — `FieldSize` exportiert heute nur `TextInput.d.ts`, und ein zweiter Export desselben Namens bräche den Paketbau. Kein Prop-Name kollidiert mit einem gleichnamigen HTML-Attribut anderen Typs; nachgewiesen im Prüfabschnitt am Ende.

---

## Datei 8 von 10 — `ui/Textarea.prompt.md`

````markdown
# Textarea

Mehrzeiliges Eingabefeld auf demselben Gerüst wie `TextInput` und `Select` — Label, Feldrahmen,
Hilfetext, Fehler- und Erfolgsmeldung kommen aus `Field`.

Nimm die Textarea, wenn die Antwort **mehrere Sätze** sein darf: Befund, Notiz, Begründung,
Kommentar. Passt die Antwort in eine Zeile, gehört dorthin ein `TextInput`.

## Höhe und Größe

Die Höhe kommt von **`rows`**, nicht von der Größe — Standard sind 3 Zeilen. Setze so viele
Zeilen, wie die erwartete Antwort ungefähr braucht: Ein Feld, das drei Sätze erwartet, aber eine
Zeile hoch ist, sieht aus, als wäre eine Zeile genug.

Die **Größe** wirkt bei einzeiligen Feldern über die Höhe. Weil die hier von `rows` kommt,
unterscheidet sich `lg` über den **Innenabstand**: `sm` ist knapp, `md` normal, `lg` luftig.
Die Schriftgröße folgt der Systemregel und bleibt bei `sm` 14px, bei `md` und `lg` 16px.

## Ziehen

`resize` steht auf `vertical` — der Anwender darf das Feld höher ziehen, aber nicht breiter,
damit das Layout nicht bricht. `none` gehört in enge Masken, in denen jede Höhenänderung etwas
verschiebt. `both` nur dort, wo wirklich breite Eingaben vorkommen.

## Zeichenzähler

`showCounter` zeigt „24/100" am unteren Rand und braucht `maxLength` — ohne bleibt er aus.
Setze ihn, wenn die Grenze für den Anwender wichtig ist. Ein Zähler ohne echte Grenze
verunsichert nur.

## Meldungen

`hint` erklärt, `error` benennt einen Fehler, `success` bestätigt. Es erscheint immer nur eine;
`error` verdrängt `success`, `success` verdrängt `hint`.

Eine Fehlermeldung nennt **Ursache und nächsten Schritt**, nicht nur den Zustand:
„Bitte einen Befund eintragen" statt „Pflichtfeld".

## Nicht tun

- Die Textarea für einzeilige Antworten nehmen.
- Den Zähler ohne `maxLength` erwarten.
- `hint` und `error` gleichzeitig erwarten — es erscheint nur eines.
- Auf den Innenabstand des Feldes über `className` zugreifen; `className` liegt auf der Hülle,
  nicht auf dem Eingabeelement.

## Beispiel

```jsx
<Textarea label="Befund" rows={5} hint="Wird in den Bericht übernommen" />

<Textarea
  label="Begründung"
  required
  maxLength={500}
  showCounter
  error="Bitte einen Befund eintragen"
/>

<Textarea label="Notiz" size="lg" resize="none" fullWidth />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, `ui/Field.jsx`, dann `ui/Textarea.jsx`.
Tokens aus `styles.css`.
````

---

## Datei 9 von 10 — `ui/Textarea.card.html`

```html
<!-- @dsCard group="Komponenten" viewport="700x400" name="Textarea" subtitle="Mehrzeilig — drei Größen, Zähler, Hilfetext, Fehler und Erfolg" -->
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="../styles.css">
<style>
  html,body{margin:0}
  body{padding:20px 22px;font-family:var(--medo-font-sans);background:var(--medo-surface);color:var(--medo-text);min-height:400px;box-sizing:border-box}
  .lbl{font-family:var(--medo-font-mono);font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:var(--medo-color-stone-500);margin-bottom:10px}
  .grp{margin-bottom:18px}
  .row{display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start}
  .col{flex:1;min-width:220px}
</style>
</head>
<body>
<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="../_ds_bundle.js"></script>
<script>
  var h = React.createElement;
  var MedoTextarea = window.MedoUI.Textarea;

  function App() {
    var s = React.useState('Patient klagt über Beschwerden seit drei Tagen.');
    var wert = s[0], setWert = s[1];

    return h('div', null,
      h('div', { className: 'grp' },
        h('div', { className: 'lbl' }, 'Ruhe · Hilfetext · Zähler'),
        h('div', { className: 'row' },
          h('div', { className: 'col' },
            h(MedoTextarea, {
              label: 'Befund', rows: 3, value: wert,
              onChange: function (e) { setWert(e.target.value); },
              maxLength: 500, showCounter: true,
              hint: 'Wird in den Bericht übernommen', fullWidth: true
            })
          ),
          h('div', { className: 'col' },
            h(MedoTextarea, {
              label: 'Begründung', rows: 3, required: true, fullWidth: true,
              error: 'Bitte einen Befund eintragen'
            })
          )
        )
      ),
      h('div', { className: 'grp' },
        h('div', { className: 'lbl' }, 'Erfolg · Gesperrt · Schreibgeschützt'),
        h('div', { className: 'row' },
          h('div', { className: 'col' },
            h(MedoTextarea, { label: 'Notiz', rows: 2, defaultValue: 'Gespeichert am 04.08.2026', success: 'Gespeichert', fullWidth: true })
          ),
          h('div', { className: 'col' },
            h(MedoTextarea, { label: 'Gesperrt', rows: 2, disabled: true, defaultValue: 'Nicht bearbeitbar', fullWidth: true })
          ),
          h('div', { className: 'col' },
            h(MedoTextarea, { label: 'Schreibgeschützt', rows: 2, readOnly: true, defaultValue: 'Nur lesen', fullWidth: true })
          )
        )
      )
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(h(App));
</script>
</body>
</html>
```
---

## Datei 10 von 10 — `components/Textarea.dc.html`

Die Spezifikationsseite. Sie läuft eigenständig und **rechnet ihre Farben aus**, wie die übrigen Seiten — sie braucht nur stone, primary, error, success und warning, und für die fünf sind die Erzeugungsangaben im gelockten Beschluss dokumentiert.

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,300,0,0" rel="stylesheet">
<style>
  *{box-sizing:border-box}
  body{margin:0}
  ::selection{background:#e6e1d8}
  .msr{font-family:'Material Symbols Rounded';font-weight:300;line-height:1;display:inline-block}
  .card{background:#fff;border:1px solid #e9e6e1;border-radius:16px;padding:36px;margin-bottom:48px}
  .eyebrow{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:0.12em;color:#a49d92;text-transform:uppercase;margin-bottom:18px}
  .lab{display:block;font-size:14px;font-weight:600;margin-bottom:7px}
  .box{display:flex;align-items:flex-start;border:1px solid #c9c4bc;border-radius:8px;background:#fff;padding:8px 12px;gap:9px}
  .ta{flex:1;border:none;outline:none;background:transparent;font-family:'DM Sans',system-ui,sans-serif;font-size:16px;line-height:1.5;resize:vertical;color:#1f1d1a}
  .msg{display:flex;gap:7px;align-items:flex-start;margin-top:7px;font-size:13px;line-height:1.5}
  .cnt{font-family:'DM Mono',monospace;font-size:12px;color:#6f6a63;align-self:flex-end;flex:none}
  .note{font-size:13px;line-height:1.6;color:#6f6a63;margin:26px 0 0;max-width:76ch}
</style>
</helmet>

<div style="min-height:100%;background:#faf9f7;color:#1f1d1a;font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;padding:56px 40px 120px">
  <div style="max-width:1000px;margin:0 auto">

    <!-- HEADER -->
    <div style="margin-bottom:48px">
      <div style="font-family:'DM Mono',monospace;font-size:12px;letter-spacing:0.16em;color:#a49d92;text-transform:uppercase;margin-bottom:16px">Design System · Komponente · Textarea</div>
      <h1 style="font-size:49px;line-height:1.1;font-weight:700;letter-spacing:-0.02em;margin:0 0 14px">Textarea</h1>
      <p style="font-size:20px;line-height:1.5;color:#6f6a63;margin:0;max-width:680px">Mehrzeiliges Eingabefeld auf dem gemeinsamen Feld-Gerüst. Für Antworten, die mehrere Sätze sein dürfen — Befund, Notiz, Begründung.</p>
    </div>

    <!-- ZUSTÄNDE -->
    <div class="eyebrow">Zustände</div>
    <div class="card">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px">
        <sc-for list="{{ states }}" as="s" hint-placeholder-count="8">
          <div>
            <span class="lab">{{ s.label }}</span>
            <div class="box" style="border-color:{{ s.border }};background:{{ s.bg }};box-shadow:{{ s.ring }}">
              <textarea class="ta" rows="2" style="color:{{ s.text }}" placeholder="{{ s.placeholder }}" disabled="{{ s.disabled }}">{{ s.value }}</textarea>
            </div>
            <sc-if value="{{ s.msg }}" hint-placeholder-val="">
              <div class="msg" style="color:{{ s.msgColor }}">
                <sc-if value="{{ s.msgIcon }}" hint-placeholder-val=""><span class="msr" style="font-size:16px;flex:none;margin-top:1px">{{ s.msgIcon }}</span></sc-if>
                <span>{{ s.msg }}</span>
              </div>
            </sc-if>
          </div>
        </sc-for>
      </div>
      <p class="note">Der Feldrahmen ist in jedem Zustand 1px stark — der Fokus wird vom 3px-Ring getragen, nicht von einem dickeren Rahmen, damit beim Hineinklicken nichts springt. Im Fehlerzustand nimmt der Ring die Fehlerfarbe.</p>
    </div>

    <!-- GRÖSSEN -->
    <div class="eyebrow">Größen · Innenabstand, nicht Schriftgröße</div>
    <div class="card">
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px">
        <sc-for list="{{ sizes }}" as="z" hint-placeholder-count="3">
          <div>
            <span class="lab">{{ z.name }}</span>
            <div class="box" style="padding-top:{{ z.pad }};padding-bottom:{{ z.pad }}">
              <textarea class="ta" rows="3" style="font-size:{{ z.fs }}">Patient klagt über Beschwerden seit drei Tagen.</textarea>
            </div>
            <div style="font-family:'DM Mono',monospace;font-size:11px;color:#a49d92;margin-top:8px">Schrift {{ z.fs }} · Innenabstand {{ z.pad }}</div>
          </div>
        </sc-for>
      </div>
      <p class="note">Bei einzeiligen Feldern unterscheiden sich die Größen über die Höhe. Hier kommt die Höhe von der Zeilenzahl, deshalb unterscheidet sie sich über den Innenabstand. Die Schriftgröße folgt unverändert der Systemregel: sm 14px, md und lg je 16px.</p>
    </div>

    <!-- ZEILENZAHL -->
    <div class="eyebrow">Zeilenzahl</div>
    <div class="card">
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px">
        <sc-for list="{{ rowsDemo }}" as="r" hint-placeholder-count="3">
          <div>
            <span class="lab">rows={{ r.n }}</span>
            <div class="box"><textarea class="ta" rows="{{ r.n }}">{{ r.text }}</textarea></div>
          </div>
        </sc-for>
      </div>
      <p class="note">Setze so viele Zeilen, wie die erwartete Antwort ungefähr braucht. Ein Feld, das drei Sätze erwartet, aber eine Zeile hoch ist, sieht aus, als wäre eine Zeile genug.</p>
    </div>

    <!-- ZÄHLER UND ZIEHEN -->
    <div class="eyebrow">Zeichenzähler · Ziehen</div>
    <div class="card">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px">
        <div>
          <span class="lab">Mit Zähler</span>
          <div class="box" style="flex-direction:column;gap:4px">
            <textarea class="ta" rows="3" style="width:100%">Patient klagt über Beschwerden seit drei Tagen.</textarea>
            <span class="cnt">46/500</span>
          </div>
          <div class="msg" style="color:#6f6a63"><span>Braucht maxLength — ohne bleibt der Zähler aus.</span></div>
        </div>
        <div>
          <span class="lab">Ziehen</span>
          <sc-for list="{{ resizes }}" as="rz" hint-placeholder-count="3">
            <div style="margin-bottom:10px">
              <div class="box"><textarea class="ta" rows="2" style="resize:{{ rz.value }}">{{ rz.name }}</textarea></div>
            </div>
          </sc-for>
        </div>
      </div>
      <p class="note">Standard ist vertical: der Anwender darf höher ziehen, aber nicht breiter, damit das Layout nicht bricht. none gehört in enge Masken, both nur dort, wo wirklich breite Eingaben vorkommen.</p>
    </div>

    <!-- NUTZUNG -->
    <div class="eyebrow">Nutzung</div>
    <div class="card">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px">
        <div>
          <div style="font-size:13px;font-weight:600;color:{{ okColor }};margin-bottom:12px">So</div>
          <sc-for list="{{ dos }}" as="d" hint-placeholder-count="4">
            <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:9px"><span class="msr" style="font-size:18px;color:{{ okColor }};flex:none">check</span><span style="font-size:14px;line-height:1.55">{{ d }}</span></div>
          </sc-for>
        </div>
        <div>
          <div style="font-size:13px;font-weight:600;color:{{ badColor }};margin-bottom:12px">Nicht so</div>
          <sc-for list="{{ donts }}" as="d" hint-placeholder-count="4">
            <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:9px"><span class="msr" style="font-size:18px;color:{{ badColor }};flex:none">close</span><span style="font-size:14px;line-height:1.55">{{ d }}</span></div>
          </sc-for>
        </div>
      </div>
    </div>

  </div>
</div>
</x-dc>

<script type="text/x-dc" data-dc-script data-props="{
  &quot;$preview&quot;: { &quot;width&quot;: 1040, &quot;height&quot;: 1400 }
}">
class Component extends DCLogic {
  oklchToLinear(L, C, H) {
    const h = H * Math.PI / 180, a = C * Math.cos(h), b = C * Math.sin(h);
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b, m_ = L - 0.1055613458 * a - 0.0638541728 * b, s_ = L - 0.0894841775 * a - 1.2914855480 * b;
    const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
    return { r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, b: -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s };
  }
  toHex(rgb) {
    const g = v => { v = Math.min(1, Math.max(0, v)); return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055; };
    const h = v => Math.round(g(v) * 255).toString(16).padStart(2, '0');
    return '#' + h(rgb.r) + h(rgb.g) + h(rgb.b);
  }
  makeScale(hue, chromaPeak, lRamp, cmRamp) {
    const L = lRamp || [0.976, 0.942, 0.888, 0.822, 0.748, 0.655, 0.470, 0.405, 0.348, 0.300, 0.252, 0.198];
    const CM = cmRamp || [0.05, 0.10, 0.16, 0.24, 0.34, 0.45, 1.00, 0.95, 0.80, 0.62, 0.45, 0.30];
    const T = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100];
    const o = {};
    T.forEach((t, i) => { o[t] = this.toHex(this.oklchToLinear(L[i], chromaPeak * CM[i], hue)); });
    return o;
  }

  renderVals() {
    const ci = 1.25;
    const stone = this.makeScale(70, 0.013 * ci);
    const primary = this.makeScale(185, 0.115 * ci);
    const error = this.makeScale(27, 0.15 * ci);
    const success = this.makeScale(150, 0.14 * ci);

    const text = stone[1000], muted = `${stone[1000]}ad`;
    const border = stone[400], white = '#ffffff';
    const ring = `0 0 0 3px ${primary[600]}59`;
    const ringDanger = `0 0 0 3px ${error[600]}59`;

    const states = [
      { label: 'Ruhe', border, bg: white, ring: 'none', text, value: 'Patient klagt über Beschwerden seit drei Tagen.', placeholder: '', disabled: '', msg: '', msgIcon: '', msgColor: muted },
      { label: 'Platzhalter', border, bg: white, ring: 'none', text, value: '', placeholder: 'Befund eintragen', disabled: '', msg: '', msgIcon: '', msgColor: muted },
      { label: 'Hover', border: stone[600], bg: white, ring: 'none', text, value: 'Patient klagt über Beschwerden.', placeholder: '', disabled: '', msg: '', msgIcon: '', msgColor: muted },
      { label: 'Fokus', border: primary[600], bg: white, ring, text, value: 'Patient klagt über Beschwerden.', placeholder: '', disabled: '', msg: '', msgIcon: '', msgColor: muted },
      { label: 'Mit Hilfetext', border, bg: white, ring: 'none', text, value: '', placeholder: 'Befund eintragen', disabled: '', msg: 'Wird in den Bericht übernommen', msgIcon: '', msgColor: muted },
      { label: 'Fehler', border: error[600], bg: white, ring: ringDanger, text, value: '', placeholder: 'Befund eintragen', disabled: '', msg: 'Bitte einen Befund eintragen', msgIcon: 'error', msgColor: error[1000] },
      { label: 'Erfolg', border: success[600], bg: white, ring: 'none', text, value: 'Befund vollständig.', placeholder: '', disabled: '', msg: 'Gespeichert', msgIcon: 'check_circle', msgColor: success[1000] },
      { label: 'Gesperrt', border: stone[200], bg: stone[100], ring: 'none', text: stone[500], value: 'Nicht bearbeitbar', placeholder: '', disabled: 'true', msg: '', msgIcon: '', msgColor: muted }
    ];

    const sizes = [
      { name: 'sm', fs: '14px', pad: '4px' },
      { name: 'md · Standard', fs: '16px', pad: '8px' },
      { name: 'lg', fs: '16px', pad: '12px' }
    ];

    const rowsDemo = [
      { n: '2', text: 'Kurze Notiz.' },
      { n: '3', text: 'Patient klagt über Beschwerden seit drei Tagen.' },
      { n: '6', text: 'Ausführlicher Befund über mehrere Sätze. Setze so viele Zeilen, wie die erwartete Antwort ungefähr braucht.' }
    ];

    const resizes = [
      { name: 'vertical · Standard', value: 'vertical' },
      { name: 'none', value: 'none' },
      { name: 'both', value: 'both' }
    ];

    const dos = [
      'Die Textarea nehmen, wenn die Antwort mehrere Sätze sein darf.',
      'Die Zeilenzahl an der erwarteten Antwort ausrichten.',
      'Den Zähler nur zeigen, wenn es eine echte Grenze gibt.',
      'Fehlermeldungen mit Ursache und nächstem Schritt schreiben.'
    ];
    const donts = [
      'Die Textarea für einzeilige Antworten nehmen.',
      'Den Zähler ohne maxLength erwarten.',
      'Hilfetext und Fehlermeldung gleichzeitig erwarten — es erscheint nur eines.',
      'Über className an den Innenabstand des Feldes wollen — className liegt auf der Hülle.'
    ];

    return { states, sizes, rowsDemo, resizes, dos, donts,
             okColor: success[700], badColor: error[600], text, muted };
  }
}
</script>
</body>
</html>
```
---

# Teil C — Contained-list umstellen

Die Contained-list hat den runden Kreis heute **fest eingebaut**, in heller Tönung. Er weicht der neuen Komponente.

> **Sichtbare Folge für bestehende Abnehmer:** Aus dem zurückhaltenden hellen Kreis wird ein kräftiger farbiger. **Das bricht nichts und erzeugt keine Fehlermeldung** — aber wer die Liste heute im Einsatz hat, sieht sie danach anders. Freigegeben vom Inhaber am 28.08.2026.
>
> **Die Liste bleibt einfarbig.** Alle Kreise einer Liste tragen Teal; die wechselnden Farbschemata bleiben Tabellen vorbehalten. Eine Liste soll ruhiger wirken als eine Tabelle.

## Änderung 1 — `ui/ContainedList.jsx`

**Entfernen:** den gesamten Regelblock `.medo-clist__avatar` aus dem `MEDO_CLIST_CSS`-String. Er beschreibt den eingebauten Kreis und wird durch die Komponente ersetzt:

```css
/* ENTFERNEN */
.medo-clist__avatar{
  flex: none;
  width: 38px; height: 38px;
  border-radius: var(--medo-radius-full);
  background: var(--medo-primary-100);
  color: var(--medo-primary-800);
  display: inline-flex; align-items: center; justify-content: center;
  font-size: var(--medo-text-xs);
  font-weight: 600;
  letter-spacing: 0.02em;
}
```

**Ersetzen:** die Stelle, an der der Kreis gerendert wird.

```jsx
/* VORHER */
it.avatar
  ? React.createElement("span", { className: "medo-clist__avatar", "aria-hidden": "true" }, it.avatar)
  : it.icon && IconCmp
  ? …

/* NACHHER */
it.avatar && AvatarCmp
  ? React.createElement(AvatarCmp, { initials: it.avatar, size: "md", color: "teal" })
  : it.icon && IconCmp
  ? …
```

**Ergänzen:** die Auflösung der Komponente, neben der bestehenden für `Icon`:

```jsx
const AvatarCmp = window.MedoUI && window.MedoUI.Avatar;
```

**Ergänzen:** in `ContainedList.prompt.md` die Ladereihenfolge um `ui/Avatar.jsx` vor `ui/ContainedList.jsx`.

> Der Avatar setzt `aria-hidden` von sich aus, weil der Name in der Zeile daneben steht. Die bisherige ausdrückliche Angabe entfällt damit, ohne dass sich etwas ändert.

## Änderung 2 — `ui/ContainedList.d.ts`

Die Prop bleibt, ihre Beschreibung wird genauer:

```ts
/* VORHER */
  /** Kürzel für den Avatar-Kreis, z. B. "MH". Schlägt `icon`. */
  avatar?: React.ReactNode;

/* NACHHER */
  /** Kürzel für den Avatar, z. B. "MH". Schlägt `icon`.
   *  Wird an die Avatar-Komponente gereicht; die Liste bleibt einfarbig. */
  avatar?: React.ReactNode;
```

**Der Typ bleibt `React.ReactNode`** und wird nicht auf `string` verengt. Eine Verengung wäre sauberer, würde aber bestehende Einbindungen anhalten, die etwas anderes als eine Zeichenkette übergeben — und das ist nicht Gegenstand dieser Freigabe.

## Änderung 3 — `ui/ContainedList.prompt.md`

Im Abschnitt zum Avatar ergänzen:

> Der Avatar in der Liste ist **einfarbig** — alle Kreise tragen Teal. Die fünfzehn Farbschemata bleiben Tabellen vorbehalten, in denen sich Personen auf einen Blick unterscheiden sollen. Eine Liste soll ruhiger wirken.
>
> `avatar` trägt weiterhin die zwei Buchstaben. Wer stattdessen ein Bild zeigen will, setzt den `Avatar` selbst in eine eigene Zeilendarstellung; die Liste nimmt keine Bildadresse entgegen.

## Änderung 4 — `components/Contained-list.dc.html`

Die Kreise in der Varianten- und Zustandsmatrix auf die neue Farbgebung ziehen. Betroffen sind die beiden Stellen, an denen ein Avatar-Kreis gezeichnet wird — im Abschnitt „Mehrfachauswahl" und im Abschnitt „Gruppen":

```html
<!-- VORHER -->
<span style="width:38px;height:38px;border-radius:9999px;background:{{ avatarBg }};color:{{ avatarText }};…;font-size:13px;font-weight:600;flex:none">{{ r.initials }}</span>

<!-- NACHHER -->
<span style="width:38px;height:38px;border-radius:9999px;background:{{ avatarBg }};color:#ffffff;…;font-size:12px;font-weight:600;letter-spacing:0.02em;flex:none">{{ r.initials }}</span>
```

Und im `renderVals()` die Farbzuweisung:

```js
/* VORHER */
checkFill, avatarBg: primary[100], avatarText: primary[800],

/* NACHHER */
checkFill, avatarBg: primary[600],
```

> **Nebenbei behoben:** Die Schriftgröße geht dabei von 13px auf 12px. 13px war ein Zwischenwert, den der gelockte Beschluss ausdrücklich ausschließt — der ausgelieferte Port hat ihn ohnehin längst auf `text-xs` gezogen. **Das ist keine neue Entscheidung, sondern die Angleichung der Spezifikationsseite an den ausgelieferten Stand.**

---

# Was ausdrücklich unberührt bleibt

## Kein neuer Token

**Alle zehn Dateien kommen ohne einen einzigen neuen Token aus.** Sie verwenden ausschließlich, was bereits existiert: die fünfzehn Brand-Skalen, `radius-full`, `text-xs`, `text-xl`, `space-2xs`, `space-xs`, `space-sm`, `space-3xl`, `weight-semibold`, `leading-normal`, `font-sans`, `color-white`, `surface-sunken`, `surface-container-high`, `icon-muted`.

**Die Token-Dateien werden nicht angefasst.**

## Gelockte Beschlüsse, die berührt werden

| Beschluss | Status |
|---|---|
| *„600 = main/solid color"* | **Berührt.** Der Avatar nutzt für fünf Familien 800 oder 900. Die Ausnahme gilt **nur für den Avatar** und nur, weil die Person ihr Schema selbst wählt. Für Tags, Schaltflächen und Statusfarben bleibt 600 unangetastet. |
| *„field text sm=14 / md=16 / lg=16"* | **Nicht gebrochen.** Die freigegebene Vergrößerung von `lg` läuft über den Innenabstand. Siehe Punkt 1 der Klärungen. |
| *„No in-between values like 13px anywhere"* | **Nicht gebrochen.** Der Avatar nutzt 12px. Die Contained-list-Seite verliert ihre 13px sogar. |
| *„field borders are ALWAYS border-thin 1px"* | **Eingehalten.** Der Textarea-Rahmen bleibt in jedem Zustand 1px. |
| *„focus-ring is primary-600 … Error-state fields use the same danger ring"* | **Eingehalten.** |
| *„Jede Komponente hat .jsx, .d.ts, .prompt.md, .card.html"* | **Eingehalten** — deshalb sind es zehn Dateien und nicht acht. |
| *„ONLY Material Symbols Rounded, never inline SVG icons"* | **Eingehalten.** Das Personen-Symbol läuft über die `Icon`-Komponente. |
| *„Light mode only"* | **Eingehalten.** Alle Dateien beschreiben den hellen Modus. |

## Was das Dokument nicht anfasst

- **`TextInput`** — Punkt 6 der Textarea-Abweichungsliste (Text zwischen den Klammern verschwindet lautlos) betrifft beide Komponenten gleichermaßen und ist **zurückgestellt**, bis sie gemeinsam entschieden werden. **Bitte hier nicht mitziehen.**
- **`Field.jsx`** — das gemeinsame Feld-Gerüst bleibt, wie es ist. Die Textarea nutzt es unverändert.
- **Alle übrigen Komponenten**, die Übersichtsseiten, die Paletten-Seiten.
- **Die Token-Dateien.**

---

# Prüfnachweise

## Typprüfung — tatsächlich ausgeführt

Beide Verträge, gegen beide React-Fassungen, die das Paket zulässt, mit **eingeschalteter** Bibliotheksprüfung. Geprüft mit einer Verwendungsdatei, die jede Prop mindestens einmal setzt, dazu die durchgereichten Attribute des Textfeldes.

```
=== @types/react r18 · skipLibCheck:false ===
  tsc: keine Fehler
=== @types/react r19 · skipLibCheck:false ===
  tsc: keine Fehler
```

**Gegenproben, damit ein grüner Lauf etwas belegt.** Beide Male den Vertrag absichtlich aufgeweicht:

```
=== AvatarColor um "tuerkis" erweitert ===
verwendung.tsx(56,8): error TS2578: Unused '@ts-expect-error' directive.
=== name von string auf any aufgeweicht ===
verwendung.tsx(60,8): error TS2578: Unused '@ts-expect-error' directive.
=== wiederhergestellt, Kontrolllauf ===
  tsc: keine Fehler
```

Die Prüfung kann also rot werden. Neun `@ts-expect-error`-Fälle sind Teil der Verwendungsdatei — bliebe einer davon fehlerfrei, meldete `tsc` es.

## Buchstabenregel — an 17 Fällen gemessen

Die Regel ist als lauffähiger Code geprüft, nicht nur beschrieben. Alle sieben vom Inhaber vorgegebenen und dokumentierten Fälle stimmen, dazu zehn Randfälle: Doppelvorname mit und ohne E-Mail, Unterstrich, Umlaut in der Binnengroßschreibung, einzelnes Zeichen, leerer Wert, nicht gesetzter Wert, überzählige Leerzeichen.

## Namenskollisionen

- **`AvatarColor`** und **`TextareaProps`** kommen in keinem bestehenden Vertrag vor. Der Vertragsgenerator erzeugt je Vertrag ein `export type`; ein doppelter Name bräche den Paketbau.
- Der Textarea-Vertrag deklariert `size` **inline** statt `FieldSize` erneut zu exportieren — `FieldSize` exportiert heute ausschließlich `TextInput.d.ts`.
- **`React.TextareaHTMLAttributes` kennt kein `size`** — nachgeprüft in beiden React-Fassungen. Der Vertrag braucht deshalb keinen `Omit`, anders als `TextInput.d.ts`.

## CSS-Präfix

**`medo-av` ist frei.** Gegen den heutigen Bestand von 40 vergebenen Präfixen geprüft, nicht gegen eine ältere Erhebung. Kein Treffer für `medo-av` im gesamten Quellbaum.

---

# Offene Punkte

**Einer, und er verhindert nichts.**

Für **9 der 15 Brand-Farbfamilien** sind die Erzeugungsangaben nicht im Spiegel dokumentiert — nur stone, teal, rot, grün, blau und amber sind es. Ich habe deshalb in `components/Avatar.dc.html` die Ergebniswerte fest eingesetzt statt sie zu berechnen, und im Dateikopf vermerkt, warum.

**Das ließe sich nur an der Quelle klären.** Die KI im Design-Projekt hat die Angaben und darf den Block auf Berechnung umstellen; die Ergebniswerte sind mit Kontrastwerten hinterlegt, damit sie das prüfen kann.

---

# Freigabe

> _Wird nach Rückmeldung des Inhabers hier eingetragen._

**Status:** offen
