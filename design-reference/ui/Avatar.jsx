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
