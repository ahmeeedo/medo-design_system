# medo Design System — STATUS

> **Nächster Chat: zuerst diese Datei + CLAUDE.md lesen.** Dann direkt weiterarbeiten.
> Arbeitsweise: German UI. Jede Komponente EINZELN. Ablauf pro Komponente:
> **1. Konzeptphase gemeinsam** (Fragen stellen) → **2. Solo-Seite** (nur die Komponente, Look freigeben) → **3. Vollständige Komponenten-Seite** (Zustände/Größen/Nutzung/Do-Don't). Nach jeder Stufe auf Freigabe warten. Nichts ohne Freigabe bauen.

## Zuletzt bearbeitet
- Gerade freigegeben: Checkbox ✓, Text input ✓, Number input ✓, Radio button ✓, Toggle ✓, Select ✓, Search ✓, Tag ✓, Tooltip ✓, Tabs ✓, Content switcher ✓, Breadcrumb ✓, Slider ✓, List ✓, Contained list ✓, Accordion ✓, Pagination ✓, Dropdown ✓, Menu ✓, Menu buttons ✓, Notification ✓, Inline loading ✓, Loading ✓, Progress bar ✓, Progress indicator ✓, Popover ✓, Modal ✓, Code snippet ✓, Data table ✓, Date picker ✓, File uploader ✓
- Link-Hover-Fix erledigt (alle 8 Links, :hover → primary-800).
- Button-Icon-Migration verifiziert: Button (und projektweit ALLE Komponenten) nutzen nur Material Symbols Rounded, keine Inline-SVGs. Einziger Nicht-Glyph = Lade-Spinner (CSS medo-spin, bewusst).
- ✅ **BACKLOG KOMPLETT ABGESCHLOSSEN**
- `Übersicht.dc.html` (Projekt-Root) ✓ — Navigations-Index: Hero + 6 Prinzipien-Chips + Foundations-Strip (primary-Rampe/Akzent-Swatches via makeScale, Typo, Grundlagen, Links zu Paletten/Typografie/Grundlagen) + alphabetisches Grid aller 33 Komponenten mit bespoke Mini-Vorschau + Icon + Desc, Kachel verlinkt auf components/X.dc.html. WICHTIG: liegt im Root (nicht components/), damit relative Links funktionieren.
- `tokens.css` + `tokens.json` (Projekt-Root) ✓ — Entwickler-Handoff Teil A. Single source of truth, auto-generiert aus CLAUDE.md (OKLCH→HEX, ci=1.25, Teal-Hue 185). 3 Ebenen: Brand (15 Skalen ×12 + white/black) → Alias (Rolle→Brand) → Semantic (Material-Stil, inkl. Transparenz-Tokens als 8-stelliges Hex, Status-Sets, scrim). Plus Typo/Spacing/Radien/Schatten/Rahmen/Breakpoints. teal-600=#007265 (== Komponenten verifiziert). tokens.css nutzt var()-Referenzen (dark-mode-fähig), tokens.json aufgelöste Literale (Style-Dictionary/Tailwind). HINWEIS: Brand-Palette.dc.html an gelockte Werte angeglichen (JS-Fallbacks 185/1.25, Beschreibung aktualisiert; data-props-Defaults waren bereits 185/1.25). teal-600=#007265 konsistent.
- `Handoff.dc.html` (Projekt-Root) ✓ — Entwickler-Handoff Teil B. Datengetrieben: Setup (Tokens einbinden, Semantic bevorzugen) + Konventionen (Icons/Schrift/Radien/Feld-Icons/Light-only) + a11y-Baseline + pro Komponente (33, nach Kategorie gruppiert) Varianten/Zustände/Größen/a11y-Vertrag + Link zur Doku-Seite. Framing: verbindlich ist die Komponenten-Seite, dies fasst zusammen.

## Bausteine-Bibliothek (`ui/`) — Ausbau läuft
Pro Komponente vier Dateien: `X.jsx` (React.createElement, kein Build-Schritt, registriert sich unter `window.MedoUI`), `X.d.ts`, `X.prompt.md`, `X.card.html` (Vorschau mit `@dsCard`-Marker).
- Fertig: Icon, Button, Field, TextInput, Select, Checkbox, Radio, Search, NumberInput, Link, Tag, Notification, Tooltip, **Toggle, Tabs, ContentSwitcher, Breadcrumb** (neu).
- Toggle: role=switch, Bahn stone-300/primary-600, Griff weiß mit check/close, sm 36×20 / md 44×24 / lg 52×30, `loading` mit Spinner im Griff (eigene .medo-tg--loading-Regeln, damit der Ladezustand nicht deaktiviert aussieht), `labelPosition="left"` für Einstellungslisten.
- Tabs: underline + contained, sm/md, `orientation="vertical"` (Indikator links, aktive Fläche teal-100), fullWidth, scrollable ohne sichtbare Scrollbar, Pfeile/Home/End (Auswahl folgt Fokus), Kinder werden als role=tabpanel des aktiven Tabs gerendert und bleiben ungestylt.
- ContentSwitcher: neutral (stone-100-Leiste, aktiv weiß + shadow-sm) und outline (gemeinsamer Rahmen, aktiv primary-600 gefüllt), Segmente gleich breit, icon-only zeigt das Label selbst als dunklen Hinweis (kein separater Tooltip; deshalb kein overflow:hidden am outline-Rahmen, Ecken über :first/:last-child).
- Breadcrumb: Schrägstrich-Trenner stone-400, letzte Stufe kein Link + aria-current=page, `maxItems` kollabiert die Mitte in ein …-Menü (Außenklick + Esc), `homeIcon`.
- **Achtung Karten:** die lokale Variable in `X.card.html` darf nicht so heißen wie das globale `const` in `X.jsx` (sonst „Identifier has already been declared"). Konvention: `var MedoToggle = window.MedoUI.Toggle`.
- Gruppe 2 fertig: **List (+ KeyValueList), ContainedList, Accordion, Pagination**.
  - List: unordered/ordered (Mono-Ziffern via ::marker)/content (Icon+Titel+Erklärung, `flush` ohne Linien), eine Verschachtelungsebene, `emptyText`. KeyValueList als `dl` mit `numeric`→Mono/Tabellenziffern, `layout="stacked"` für schmale Spalten.
  - ContainedList: modes navigation/single/multiple, Avatar/Icon-Fläche/Meta(Mono)/Chevron/Zeilenaktion (stopPropagation), Kopfzeile mit `title`+`count`, `groups` mit sticky Mono-Überschrift, Leerzustand, Pfeile bewegen NUR den Fokus (Auswahl per Enter/Space).
  - Accordion: variants card/separated/plain, multiple (Standard) + single, marker plusminus/chevron, `showToggleAll`, Höhenanimation grid-template-rows 0fr→1fr, Inhalt bleibt im DOM, aria-expanded/controls + role=region.
  - Pagination: variants numbers/compact/bar, sm 32px / md 40px, Fensterlogik (erste+letzte immer, `siblings`, …), aktive Seite primary-600 + aria-current=page, bar mit Einträge-pro-Seite-Select + „X–Y von Z" + `showJump` (Enter springt), Tabellenziffern überall.
- Gruppe 3 fertig: **Dropdown (+ MenuList), Menu, MenuButtons, Popover**.
  - Dropdown.jsx enthält `MenuList` = die gemeinsame Menüfläche (Items mit icon/shortcut/danger/disabled/checked/divider/heading/Untermenü, Pfeile/Enter/Esc/Home/End + Typeahead, selectionMode single/multiple → menuitemradio/checkbox, `keepOpen`). **Menu.jsx und MenuButtons.jsx setzen Dropdown.jsx voraus.**
  - Dropdown-Auslöser: `trigger="button"` (Chevron dreht) und `"kebab"` (flach, braucht ariaLabel), sm/md, `align="start"|"end"`.
  - Menu: Kontextmenü per Rechtsklick an Cursorposition, kippt am Rand nach innen (useLayoutEffect + fixed-Flag), schließt bei Auswahl/Esc/Außenklick/Scroll.
  - MenuButtons: MenuButton (primary/neutral), SplitButton (Fuge via inset-Shadow bei primary, −1px margin bei neutral, Menü rechts), IconMenuButton 40px. Nur md, Labelgewicht 400.
  - Popover: Portal an body, Klick-Auslöser, `content` auch als Funktion mit `{ close }`, Titelzeile + Kreuz, Pfeil auf Auslösermitte, Auto-Flip, Esc/Außenklick, Position wird bei Scroll/Resize neu bestimmt, role=dialog, Fokus wird bewusst NICHT gefangen.
  - Hinweis Tests: React-Hover (onMouseEnter) lässt sich nicht per dispatchEvent('mouseenter') auslösen — Untermenü im Test per click() öffnen.
- Gruppe 4 fertig: **Modal, Loading (+ Skeleton), InlineLoading, ProgressBar, ProgressIndicator**.
  - Modal: Portal, size sm/md/lg, tone neutral/danger/warning/success (Kopf-Icon + rote Bestätigung + Danger-Fokusring), Fokusfalle über keydown Tab, Startfokus per `data-autofocus`, body-overflow gesperrt, Esc/Kreuz/Abbrechen schließen — Scrim NICHT, `footer`-Prop ersetzt den Fuß (`null` = kein Fuß).
  - Loading: Teilring-Spinner conic-gradient + mask (Variable --medo-spin-w), sm20/md32/lg48, variant inline/overlay/fullpage. Skeleton: lines/block/card/table mit Shimmer, aria-hidden.
  - InlineLoading: 3 Punkte @keyframes medo-il-pulse, status loading/success/error/inactive, sm/md, erbt currentColor (funktioniert in gefüllten Buttons), role=status + aria-live.
  - ProgressBar: value weglassen = indeterminiert (Balken 38 % läuft durch), thin 4 / standard 8, status normal/success/warning/error + statusText mit Icon, Prozent in Mono.
  - ProgressIndicator: horizontal (flex, Linie im Kopf) und vertical (**grid 28px/1fr, Linie absolut left:13px** — die frühere Flex-Lösung war kaputt), Zustände done/active(2px-Ring)/pending/error, `optional`-Mono-Hinweis, erledigte Schritte klickbar via onStepClick, aria-current=step.
- Gruppe 5 fertig: **CodeSnippet, DataTable, DatePicker, FileUploader** — damit ist die ui/-Bibliothek vollständig.
  - CodeSnippet: **nachgebaut nach components/Code-snippet.dc.html** (erste Fassung wich ab und wurde ersetzt). inline hell #ececeb/#8a3f36 · single · block auf #211f1c mit Kopfleiste (Sprach-Label, beschrifteter Kopieren-Button, 1,5 s „Kopiert!"), Zeilennummern-Rinne, Ausklappen ab 8 Zeilen · terminal mit drei Punkten und $-Prompt. Syntaxfarben tk-key/str/num/com/fn/prompt über einen kleinen Tokenizer. Leerzeilen rendern  , sonst verrutscht die Nummernrinne; .medo-cs__body braucht align-items:flex-start, sonst erzeugen die geklemmten Flex-Kinder Scrollbalken. Code steht auf 13px wie in der Spec — bewusste Ausnahme zur 'kein 13px'-Regel.
  - DataTable: nach Doku-Seite ergänzt (Bulk-Leiste teal-100 mit `bulkActions`, `loading` + `loadingRows` Skeleton-Zeilen, thead-Padding 11/16). Spalten mit numeric (rechts + Mono/Tabellenziffern), muted, `render`, sortable (ohne onSortChange sortiert die Komponente selbst, Text via localeCompare 'de'), aria-sort, Auswahl mit Kopf-Checkbox + „N ausgewählt" ersetzt den Titel, sticky thead über `maxHeight`, `footer` für Pagination, Leerzustand als colSpan-Zeile.
  - DatePicker: **nachgebaut nach der Doku-Seite** (erste Fassung war ein Textfeld mit Mini-Kalender). Feld 44px/min 230 als Klickziel mit calendar_month + Kreuz/Pfeil, Kalender 300px, Monat+Jahr-Button öffnet Monatsraster mit Jahresnavigation, mode single/range (Start→Ende, inrange #e2efed, rstart/rend eckig innen), `inline`, `presets`-Chips + rotes „Zurücksetzen" + Zusammenfassung mit Tagesanzahl, zusätzlich **TimeSlots** (belegte Zeiten deaktiviert + durchgestrichen). ALT: Tippen UND Kalender, Format TT.MM.JJJJ in Mono (Parser + Rückfall auf letzten gültigen Wert beim Blur), Woche ab Montag, deutsche Monatsnamen, min/max deaktivieren statt ausblenden, Fuß mit Heute/Löschen, Pfeile+PageUp/Down im Grid, error nutzt Danger-Fokusring.
  - FileUploader: nach Doku-Seite nachgezogen (Fläche 36/24 mit sichtbarem Button + Icon + Formathinweis, Drag = durchgezogener teal-Rahmen, Zeile radius 11 mit 40px-Thumb/Bildvorschau, Balken 5px, x-Button transparent 30px, `compact` für eine Datei). zustandslos (files/onFilesAdded/onRemove), Fläche ist selbst der Button (Drag&Drop nur Zugabe), accept+maxSize werden VOR dem Übernehmen geprüft, abgelehnte Dateien erscheinen rot mit Grund statt still zu verschwinden, Zeilen mit Größe in Mono, 4px-Fortschritt, grünes Häkchen.

## Offen / nächste Session (optional)
- Dark Mode: Semantic-Ebene in tokens.css umdefinieren (Architektur ist vorbereitet).
- Brand-Palette.dc.html ✓ an gelockte 185/1.25 angeglichen (erledigt).
- Figma-Export: via Plugin html.to.design — self-contained Bundles + kurzlebige öffentliche URLs; Testlauf mit Übersicht + 2–3 Komponenten zuerst, dann Etappen. — alle Komponenten gebaut & freigegeben. Keine offene Komponente mehr.
- **Als Nächstes: File uploader** (LETZTE Komponente im Backlog).

## Fertige Dateien (alle .dc.html, im Projekt-Root bzw. components/)
Foundations (Root):
- `Brand-Palette.dc.html` — Ebene 1, alle Farbskalen ✓
- `Alias-Palette.dc.html` — Ebene 2, Rollen ✓
- `Semantic-Palette.dc.html` — Ebene 3, kontextuelle Tokens ✓
- `Typografie.dc.html` ✓
- `Grundlagen.dc.html` — Spacing/Radien/Elevation/Grid ✓

Komponenten (`components/`):
- `Button.dc.html` ✓ (4 Varianten, Zustände, Größen, Icons)
- `Link.dc.html` ✓ (standalone/inline, Icons, Größen)
- `Checkbox.dc.html` ✓ (an/aus/unbestimmt, Label, Gruppe, Fehler, Größen)
- `Text-input.dc.html` ✓ (8 Zustände, 3 Größen, Floating Label, 6 Features)
- `Number-input.dc.html` ✓ (2 Stepper-Varianten, Zustände, Einheiten, Verhalten)
- `Radio-button.dc.html` ✓ (Zustände, vertikal/horizontal, EINE Größe 20px, Fehler, Card-Radio)
- `Toggle.dc.html` ✓ (An/Aus, 5 Zustände inkl. Loading, sm/md/lg, Einstellungsliste)
- `Select.dc.html` ✓ (8 Trigger-Zustände, Größen, Single+Multi-Menü, Suche, Gruppen, Chips/Zähler)
- `Search.dc.html` ✓ (6 Zustände inkl. Loading, Größen, Vorschlags-Dropdown+Autocomplete, keine-Treffer, kompakt)
- `Tag.dc.html` ✓ (soft+kräftig ×7 Rollen, 3 Typen Label/Removable/Selectable, Zustände, sm/md, radius-full)
- `Tooltip.dc.html` ✓ (4 Positionen, Text+Rich, Verhalten)
- `Tabs.dc.html` ✓ (Underline+Contained, sm/md, Full-width/Overflow-Scroll(unsichtbar, auto-zentriert)/vertikal, interaktiv+Tastatur, Zustände/Nutzung/Do-Don't)
- `Content-switcher.dc.html` ✓ (neutral+outline, gleiche Breite, icon-only+Tooltip, sm/md, Segment-disabled, Live-Panel, interaktiv+Tastatur, Zustände/Nutzung/Do-Don't)
- `Breadcrumb.dc.html` ✓ (/, Home-Icon, primary-Links, muted current, kollabiert mit …-Menü, sm/md, interaktiv, Zustände/Nutzung/Do-Don't)
- `Slider.dc.html` ✓ (single+diskret, weißer Griff, Bubble, Ticks, End-Icons, sm/md, vertikal, Fehler/Warnung, gekoppeltes Zahlenfeld, interaktiv Pointer+Tastatur)
- `List.dc.html` ✓ (statische Anzeige-Liste: ungeordnet/geordnet/verschachtelt, Inhalts-Zeilen, Schlüssel-Wert dl, sm/md, Leerzustand, Do/Don't)
- `Contained-list.dc.html` ✓ (Navigation + Mehrfach-/Einfachauswahl, Avatar/Icon/Meta/Chevron/Aktion, Gruppen+Sticky-Header, sm/md, Zustände-Matrix, Leerzustand, Nutzung, Do/Don't, interaktiv+Tastatur)
- `Accordion.dc.html` ✓ (mehrere/eines offen, Karte+abgesetzte Karten, Plus/Minus, Icon/Unterzeile/Badge, animierter Höhenübergang grid-template-rows 0fr/1fr, Alle auf/zu, sm/md, Zustände/Nutzung/Do-Don't, Tastatur Enter-Space/Pfeile/Home-End via data-acscope)
- `Pagination.dc.html` ✓ (Nummern+Ellipsis, Erste/Letzte/Vor/Zurück, aktiv=primary-600 gefüllt, volle Leiste mit Einträge/Seite-Select + X–Y von Z + Direktsprung, kompakt Seite-X-von-Y, sm/md, Zustände/Nutzung(Tabellenfuß)/Do-Don't, interaktiv)
- `Dropdown.dc.html` ✓ (Button+Chevron & Kebab-Trigger, Icons/Kürzel/Abschnitts-Überschriften/Trennlinien/destruktiv/disabled/Häkchen-menuitemradio/Untermenü, Außenklick+Esc, Hover-Markierung, Zustände/Platzierung/Nutzung/Do-Don't). WICHTIG: statische Doku-Zeilen können nicht disabled="" nutzen (React falsy) → hart grau #b8b2a9 stylen.
- `Menu.dc.html` ✓ (Kontextmenü per Rechtsklick an Cursorposition, Rand-Flip, Icons+Tastenkürzel, Trennlinien, destruktiv rot, Pfeile/Enter/Esc/Home-End/Typeahead, Außenklick, Nutzung Datei-Kache
- `Menu-buttons.dc.html` ✓ (einfacher Menü-Button primär+neutral, Split-Button mit getrennter Primäraktion + rechtsbündigem Menü, Icon-Menü-Button 40px, nur md, Chevron-Rotation, Enter/Space/Pfeil-runter öffnet + Pfeile/Esc/Außenklick, nur eins offen, Zustände/Verhalten/Nutzung(Toolbar)/Do-Don't; Menüs als sc-for NICHT React.createElement)
- `Notification.dc.html` ✓ (Inline-Banner low/high × 5 Status, einzeilig, Toast-Stapel oben rechts mit Auto-Ausblenden ~5s + manuell, Icon/Titel/Text/Aktion/Schließen, Anatomie/Verhalten/Do-Don't, role=status/aria-live; Warnung-on-solid dunkler Text)
- `Inline-loading.dc.html` ✓ (3 pulsierende Punkte @keyframes il-pulse, Zustände lädt/Erfolg/Fehler/inaktiv, sm 16px/md 20px, Einsatzorte Button(2s Demo)/neben Feld/Zeile, currentColor, Verhalten/Do-Don't)
- `Loading.dc.html` ✓ (Teilring-Spinner conic-gradient+mask 270° sm20/md32/lg48, Overlay-Toggle(2s), Vollseite, Skeleton Zeilen/Karte/Tabelle mit Shimmer @keyframes sk-shimmer, Verhalten/Do-Don't, aria-busy). WICHTIG: .msr-Regel muss im Helmet stehen (sonst rendern class-only Icons als Text).
- `Progress-bar.dc.html` ✓ (determiniert + indeterminiert @keyframes pb-run, ohne Label/% rechts/Text oben, Status normal/Erfolg-grün-100%/Fehler-rot, schmal 4px+standard 8px, vollrund, Live-Demo 0→100%, Nutzung Upload, role=progressbar)
- `Progress-indicator.dc.html` ✓ (Stepper horizontal+vertikal, nummerierte Kreise/Häkchen, Zustände done/aktiv(Ring)/ausstehend/Fehler, Titel+Unterzeile+Optional, Linie füllt bis erreicht, interaktiv Weiter/Zurück + erledigte klickbar, aria-current=step)
- `Popover.dc.html` ✓ (Klick-ausgelöst, interaktiver Inhalt Info/Formular/Rich-Statistik, Titelzeile+X, kleiner Pfeil, unten+Auto-Flip-Demo, Außenklick+Esc, nur eins offen, role=dialog, Verhalten/Do-Don't; Abgrenzung Tooltip↔Modal)
- `Modal.dc.html` ✓ (Standard md/Bestätigung sm/Destruktiv sm, scrim rgba(23,21,19,0.5)+blur, Pop-Anim, Kopf Titel+Untertitel+X, scrollbarer Inhalt, Fuß Buttons rechts, Status-Icon, Esc+X+Buttons (KEIN Scrim-Klick), Verhalten/Fokus-Falle/Do-Don't, role=dialog aria-modal). Standard-Body als Template-Markup (nicht createElement).
- `Code-snippet.dc.html` ✓ (dunkel #211f1c, inline/einzeilig/Block/Terminal, Kopieren real+„Kopiert!"~1,5s, Zeilennummern, Sprach-Label, Ausklappen >8 Zeilen, dezente tk-* Syntaxfarben, Zustände/Do-Don't). WICHTIG: literale \n in Template-<pre> werden gefaltet → Mehrzeiler als String-Hole ({{ blockCode }}) ODER block-divs per sc-for; Zeilennummern-Spalte = sc-for <div> je Nummer.
- `Data-table.dc.html` ✓ (Toolbar Titel+Anzahl/Suche/Filter/Neu, Bulk-Leiste bei Auswahl, Spalten Checkbox/Avatar+Name/Rolle/Status-Tag/Projekte-num-rechts/Kebab, interaktiv Sortieren+Auswahl, Kopf-Checkbox wählt alle (minus bei Teilauswahl), Zebra, ausgewählte Zeile primary-50, Sticky thead; Simpel-Variante MIT Zebra, Skeleton-Ladezustand, Leerzustand, Do/Don't)
- `Date-picker.dc.html` ✓ (Einzel als Feld+Popover / Bereich inline / Termin-Buchung inline; Monatsraster Mo-first, dt. Monatsnamen, heute markiert, vergangene deaktiviert; Bereich Start/Ende gefüllt+Mitte getönt+Presets+Zurücksetzen; Buchung: Verfügbarkeit (grüner Punkt / durchgestrichen ausgebucht+Wochenende), Slots mit „X von 9 frei"+Dauer/Zeitzone, Abbrechen/Bestätigen; Monat+Jahr-Schnellwähler (Label-Klick) in ALLEN 3; aria-labels+aria-pressed Tage, aria-disabled Slots, Pfeiltasten-Rasternavigation gridKey, Fokusringe; Feld-Zustände/Do-Don't. WICHTIG: bookedDays-Keys nutzen 0-basierten Monat (Juli=06). Keine makeScale in dieser Klasse → feste Hex.)
- `File-uploader.dc.html` ✓ (Dropzone mehrfach + kompakter Button einzel; Datei-Eintrag Typ-Icon(pdf/doc/zip/image)+Name+Größe+Bild-Thumbnail(Gradient)+Fortschrittsbalken+Entfernen-X+Status; simulierter Upload setInterval; Drag-Zustand mit „Zum Hochladen loslassen"; Fehler-Eintrag .fu-err rot (Rahmen+Tönung, in Live-Liste UND Matrix); Format-Hinweis; Zustände-Matrix (Default/Drag/Lädt/Erfolg/Fehler/Deaktiviert)/Do-Don't. Feste Hex, keine makeScale.)

## Wichtige Detail-Entscheidungen (Komponenten)
- **⚠ Runtime-Bug `style-hover`:** dieses Projekt-support.js kompiliert `style-hover` nur für LITERALE Werte. `style-hover="color:{{ hole }}"` fällt still weg (leere `.scp:hover{}`). Lösung: Hover über echte `:hover`-Regeln im `<helmet><style>` mit fest eingesetzten Hex-Werten (`!important`, da Basisfarbe inline gesetzt = höhere Spezifität). Breadcrumb so gelöst. Link.dc.html jetzt ebenso gefixt (Klassen .lk / .lk-u, :hover → #004b42 !important, alle 8 Links). ERLEDIGT.
- Radio: nur EINE Größe (md 20px). sm entfernt (Punkt war nicht mittig).
- Chips: radius-full, primary-50 Fläche / primary-200 Rahmen / primary-800 Text, × als Icon-Button.
- Text-Feld-Familie (Text/Number/Select/Search): gleiche Höhen sm36/md40/lg48, gleiche 8 Zustände (Default/Hover/Focus/Filled/Disabled/Readonly/Error/Success), input-border stone-400.
- Select Multi: Checkboxen im Menü, „Alle/Zurücksetzen" konfigurierbar, Zähler statt Chips sobald Umbruch.
- Tooltip dunkel = stone-1000, Pfeil 8px rotate45.
- Slider: makeScaleR(hue,cp,L,CM) für Amber-Custom-Ramp (warning). Pointer-Drag via window-Listener; Tastatur role=slider. setState ist async — beim Testen aria-valuenow erst nach Re-Render lesen.

## Komponenten-Backlog (Reihenfolge grob nach Abhängigkeit)
OFFEN: — (keine, Backlog komplett) · Inline loading · Loading · Progress bar · Progress indicator · Popover · Modal · Code snippet · Data table · Date picker · File uploader

## Gelockte System-Regeln (Kurzfassung — Details in CLAUDE.md)
- **Prefix `medo`**, OKLCH + HEX-Fallback, nur Light Mode (Dark später andockbar).
- **3 Ebenen:** Brand → Alias → Semantic. primary=teal(185°), neutral=grey, neutral-alt=stone(warm, Basis), error=red, warning=amber(custom ramp), success=green, info=blue. 12 Stufen 50–1100, 600=Hauptton.
- **Farb-Algorithmus** (makeScale, ci=1.25) in JEDER Komponente selbst enthalten — exakte Werte in CLAUDE.md.
- **Typo:** DM Sans + DM Mono. Scale 1.25, text-xs 12 … text-4xl 49.
- **Foundations:** Spacing T-Shirt (4px-Basis), Radien none/4/8/12/18/24/full, 4 warme Schatten.
- **Icons:** NUR Material Symbols Rounded, weight 300, FILL 0. Nie inline-SVG.
- **Regel:** bedienbare Feld-Icons (Clear/Passwort/Copy) = Icon-Button-Look (Ruhe-Fläche stone-100, Hover stone-200, ≥Trefferfläche, aria-label). Dekorative Icons flach.
- **Seiten-Chrome jeder Komponentenseite:** bg #faf9f7, DM Sans, max-width ~1000px, Mono-Eyebrow uppercase letter-spacing .16em #a49d92, h1 49px bold, Lead 20px #6f6a63, weiße Cards border #e9e6e1 radius 16px. Do=border-top success-600, Don't=border-top error-600.
- **Barrierefreiheit:** WCAG 2.2 AA. Alle Kombis geprüft. Bewusste Ausnahme: input-border=stone-400 (heller, User-Entscheidung). warning-on-solid=dunkel (amber zu hell für weiß).

## Wichtig
- Datei-Erstellung immer via `dc_write` / `dc_html_str_replace` / `dc_js_str_replace`. `support.js` nie anfassen.
- Screenshots vom Main-Agent sind manchmal veraltet — auf `ready_for_verification` verlassen.


## Audit gegen die Doku-Seiten (08.08.2026)
Alle 33 `components/*.dc.html` Abschnitt für Abschnitt gegen `ui/` geprüft. Neue Regel steht in CLAUDE.md: **jeder Abschnitt der Doku-Seite muss in der ui-Komponente vorkommen UND auf der Karte sichtbar sein.**
Gefundene Lücken — alle geschlossen:
- **Slider neu gebaut** (fehlte komplett): Bahn 6px/sm 4px, Griff weiß 20/16px mit Rahmen stone-400 + Schatten, dunkle Wert-Bubble bei Ziehen und Fokus, `showTicks` 4px-Punkte, `stepLabels`, `showMinMax`, start/endIcon, vertikal (Bahn 6×180, Griff bottom-basiert), Pointer-Drag + Pfeile/PageUp/Down/Home/End, `formatValue`, disabled.
- **Radio `variant="card"`**: Auswahlkarten (Titel + Punkt rechts, `hint` als Beschreibung, gewählt = teal-Rahmen + primary-50), Fokusring über `:has(input:focus-visible)`, nur mit `options`.
- **Select `multiple`**: Wert wird Array, Trigger wird div[role=combobox] (Chips dürfen nicht in einen Button), Chips primary-50/200 mit Kreuz, `maxChips` + „+N", `multipleDisplay="count"`, Liste bleibt beim Wählen offen, Enter/Space togglen.
- **TextInput `floatingLabel`**: Feld 52px, Label mittig → schwebt bei Fokus/Inhalt auf top:-8px (12px, medium, teal im Fokus, rot bei Fehler) mit input-bg als Hinterschnitt.
Zweite Klasse (Karten zeigten vorhandene Varianten nicht) wird beim Anfassen der jeweiligen Komponente mitgeräumt — bei DataTable bereits erledigt (simpel + Leerzustand ergänzt).

## Kartendurchlauf (08.08.2026) — abgeschlossen
Alle 33 `ui/*.card.html` gegen die jeweilige `.d.ts` geprüft (Union-Varianten + boolesche Props). Ergänzt bzw. sichtbar gemacht:
- **Neue Abschnitte:** Accordion `plain` · CodeSnippet Block ohne Zeilennummern/Highlight · ContentSwitcher `fullWidth`+`equalWidth` · List `flush`/`size sm` und KeyValue `layout stacked` · Tabs `fullWidth` und `scrollable` · Toggle `icons:false` · NumberInput `align` + `fullWidth`/`required` · ProgressBar `status warning` · Popover `placement top/left` · Loading `variant fullpage` + Skeleton `lines`/`block` · Dropdown `selectionMode multiple` + `keepOpen` · FileUploader `compact` + `disabled` · DatePicker `fullWidth`/`clearable` · DataTable `size sm` + Spalten-`align` · Modal `size lg` + `tone warning` · Menu Eintrag `disabled` · Tooltip `disabled` · MenuButtons `disabled` (alle drei) · Checkbox-Gruppe waagerecht · Search `size md` + `fullWidth` · Select `fullWidth`/`optional` · TextInput `fullWidth`.
- **Standardwerte explizit gesetzt**, damit die Karte die Variante benennt statt sie zu implizieren (Link `standalone`, Tag/Notification `soft`, Radio `list`, Pagination `numbers`, Breadcrumb `sm`, Slider `showValue`, ProgressIndicator `status`, Button `type`/`iconPosition` usw.).
- Kartenhöhen (`@dsCard viewport` + `min-height`) entsprechend nachgezogen.
Offen bleiben nur echte Nicht-Anzeigefälle: Popover `open` (kontrolliert), Modal `tone success` (in der Doku nicht gefordert).