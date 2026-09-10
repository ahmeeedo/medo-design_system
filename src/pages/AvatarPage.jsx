import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Avatar } from '../components'

const PROSE = 'text-[var(--medo-text-muted)] [font-family:var(--medo-font-sans)] [font-size:var(--medo-text-base)] [line-height:var(--medo-leading-relaxed)]'
const CAPTION = '[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] text-[var(--medo-text-muted)]'
const LIST = `${PROSE} list-disc pl-[var(--medo-space-lg)] space-y-[var(--medo-space-3xs)]`
const STACK = 'flex flex-col items-center gap-[var(--medo-space-2xs)]'
const ROW = 'flex flex-wrap items-center gap-[var(--medo-space-xl)] mt-[var(--medo-space-md)]'
const NAME = '[font-family:var(--medo-font-sans)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)]'

/* Stand-in for a photograph. The specification page has none either and draws a
   tinted portrait in its place (Avatar.dc.html, photoFg #004b42 on photoBg
   #adccc8); the same two tones are used here. Handed to the component through
   `src`, so the image branch is genuinely exercised rather than described. */
const PORTRAIT =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
  '<rect width="64" height="64" fill="#adccc8"/>' +
  '<circle cx="32" cy="25" r="11" fill="#004b42"/>' +
  '<path d="M12 58a20 20 0 0 1 40 0z" fill="#004b42"/></svg>'
const PORTRAIT_SRC = 'data:image/svg+xml,' + encodeURIComponent(PORTRAIT)

/* Deliberately undecodable, so the browser reports the load failure and the
   component falls back to the letters. That fallback is what the row shows. */
const BROKEN_SRC = 'data:image/png;base64,bWVkbw=='

/* The fifteen schemes with the contrast of their white type, taken unchanged
   from the specification page. Checked against WCAG 2.2; 4.5 is required. */
const SCHEMES = [
  ['red', 7.55], ['crimson', 7.31], ['rose', 7.4], ['orange', 9.82], ['amber', 6.14],
  ['yellow', 7.59], ['green', 6.06], ['teal', 5.84], ['cyan', 5.94], ['blue', 6.62],
  ['indigo', 7.29], ['violet', 12.3], ['purple', 7.67], ['grey', 6.81], ['stone', 13.67],
]

const SIZES = [['sm', '30px'], ['md', '38px'], ['lg', '64px']]

/* The eight rows of the specification page. The letters are not written out
   here — they are derived live by medoAvatarInitials, so the page shows the
   rule at work instead of a copy of its result. */
const INITIALS_ROWS = [
  ['Andreas Müller', 'teal', 'space'],
  ['PeterZeider', 'indigo', 'camel'],
  ['renatosanches', 'rose', 'none'],
  ['Dr. Marie Hoffmann', 'green', 'twoParts'],
  ['anna.mueller', 'cyan', 'dot'],
  ['anna@medo.de', 'purple', 'mail'],
  ['Anna-Lena Schmidt', 'blue', 'hyphen'],
  ['Müller', 'grey', 'oneWord'],
]

/* Colour is a stored value of the person, so it sits in the data next to the
   name — never derived from the name or from the position in the list. */
const PEOPLE = [
  { name: 'Andreas Müller', mail: 'andreas@medo.de', color: 'blue' },
  { name: 'Peter Zeider', mail: 'peter@medo.de', color: 'amber' },
  { name: 'Clara Schmidt', mail: 'clara@medo.de', color: 'green' },
  { name: 'Anna-Lena Schmidt', mail: 'anna@medo.de', color: 'violet' },
]

const BASIC_CODE = `import { Avatar } from '@/components'

{/* Das gespeicherte Farbschema der Person uebergeben - nie berechnen */}
<Avatar name={person.name} color={person.avatarFarbe} />

{/* Mit Bild; laedt es nicht, erscheinen die Buchstaben */}
<Avatar name={person.name} color={person.avatarFarbe} src={person.bild} size="lg" />

{/* Solange die Daten unterwegs sind */}
<Avatar loading size="sm" />

{/* Ohne Namen - geloeschtes Konto, offene Einladung */}
<Avatar label="Geloeschtes Konto" />`

const ROW_CODE = `{/* In der Tabellenzeile: sm, Name daneben, Kreis stumm */}
<div className="flex items-center gap-3">
  <Avatar size="sm" name={person.name} color={person.avatarFarbe} />
  <div>
    <div>{person.name}</div>
    <div>{person.mail}</div>
  </div>
</div>`

const INITIALS_CODE = `import { medoAvatarInitials } from '@/components'

medoAvatarInitials('Andreas Mueller')   // 'AM'
medoAvatarInitials('Anna-Lena Schmidt') // 'AS' - Leerzeichen schlaegt Bindestrich
medoAvatarInitials('anna@medo.de')      // 'AN'

{/* Kennt die Anwendung die Buchstaben schon, uebergeht initials die Ableitung */}
<Avatar initials="MH" color="teal" />`

export default function AvatarPage() {
  const { t, i18n } = useTranslation()
  const ratio = new Intl.NumberFormat(i18n.language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={values => (
              <Avatar
                name={values.name ? PEOPLE[0].name : undefined}
                initials={values.initials ? 'MH' : undefined}
                src={values.image ? PORTRAIT_SRC : undefined}
                color={values.color}
                size={values.size}
                loading={values.loading}
                label={values.label ? t('avatar.demo.label') : undefined}
              />
            )}
            controls={[
              {
                id: 'size',
                type: 'dropdown',
                label: t('avatar.controls.size'),
                options: SIZES.map(([value]) => value),
                default: 'md',
              },
              {
                id: 'color',
                type: 'dropdown',
                label: t('avatar.controls.color'),
                options: SCHEMES.map(([value]) => value),
                default: 'teal',
                /* The scheme only reaches the circle while the letters show:
                   loading, image and symbol each set their own modifier. */
                visibleWhen: v => !v.loading && !v.image && (v.name || v.initials),
              },
              {
                id: 'name',
                type: 'toggle',
                label: t('avatar.controls.name'),
                default: true,
                visibleWhen: v => !v.loading && !v.image && !v.initials,
              },
              {
                id: 'initials',
                type: 'toggle',
                label: t('avatar.controls.initials'),
                default: false,
                visibleWhen: v => !v.loading && !v.image,
              },
              {
                id: 'image',
                type: 'toggle',
                label: t('avatar.controls.image'),
                default: false,
                visibleWhen: v => !v.loading,
              },
              { id: 'loading', type: 'toggle', label: t('avatar.controls.loading'), default: false },
              { id: 'label', type: 'toggle', label: t('avatar.controls.label'), default: false },
            ]}
            presets={[
              { id: 'standard', label: t('avatar.presets.standard'), values: {} },
              { id: 'scheme', label: t('avatar.presets.scheme'), values: { color: 'violet' } },
              { id: 'profile', label: t('avatar.presets.profile'), values: { size: 'lg' } },
              { id: 'tableRow', label: t('avatar.presets.tableRow'), values: { size: 'sm' } },
              { id: 'image', label: t('avatar.presets.image'), values: { image: true } },
              { id: 'initials', label: t('avatar.presets.initials'), values: { initials: true } },
              { id: 'nameless', label: t('avatar.presets.nameless'), values: { name: false } },
              { id: 'loading', label: t('avatar.presets.loading'), values: { loading: true } },
            ]}
          />

          <Section title={t('avatar.overview.schemesTitle')}>
            <Content>
              <p className={PROSE}>{t('avatar.overview.schemesBody')}</p>
              <div className="flex flex-wrap gap-[var(--medo-space-lg)] mt-[var(--medo-space-md)]">
                {SCHEMES.map(([color, value]) => (
                  <div key={color} className={STACK}>
                    <Avatar initials="AM" color={color} />
                    <span className={`${CAPTION} text-center`}>
                      {color}
                      <br />
                      {ratio.format(value)}
                    </span>
                  </div>
                ))}
              </div>
              <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('avatar.overview.schemesNote')}</p>
            </Content>
          </Section>

          <Section title={t('avatar.overview.sizesTitle')}>
            <Content>
              <p className={PROSE}>{t('avatar.overview.sizesBody')}</p>
              <div className={ROW}>
                {SIZES.map(([size, px]) => (
                  <div key={size} className={STACK}>
                    <Avatar size={size} initials="AM" color="blue" />
                    <span className={`${CAPTION} text-center`}>
                      {`${size} · ${px}`}
                      <br />
                      {t(`avatar.sizes.${size}`)}
                    </span>
                  </div>
                ))}
              </div>
            </Content>
          </Section>

          <Section title={t('avatar.overview.fillTitle')}>
            <Content>
              <p className={PROSE}>{t('avatar.overview.fillBody')}</p>
              <div className={ROW}>
                <div className={STACK}>
                  <Avatar size="lg" src={PORTRAIT_SRC} name={PEOPLE[0].name} color="blue" />
                  <span className={`${CAPTION} text-center`}>{t('avatar.fill.image')}</span>
                </div>
                <div className={STACK}>
                  <Avatar size="lg" src={BROKEN_SRC} name={PEOPLE[0].name} color="blue" />
                  <span className={`${CAPTION} text-center`}>{t('avatar.fill.letters')}</span>
                </div>
                <div className={STACK}>
                  <Avatar size="lg" />
                  <span className={`${CAPTION} text-center`}>{t('avatar.fill.symbol')}</span>
                </div>
              </div>
              <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('avatar.overview.fillNote')}</p>
            </Content>
          </Section>

          <Section title={t('avatar.overview.lettersTitle')}>
            <Content>
              <p className={PROSE}>{t('avatar.overview.lettersBody')}</p>
              <div className="mt-[var(--medo-space-md)] flex flex-col">
                {INITIALS_ROWS.map(([input, color, rule]) => (
                  <div
                    key={input}
                    className="flex items-center gap-[var(--medo-space-md)] py-[var(--medo-space-xs)] border-t border-[var(--medo-divider)] first:border-t-0"
                  >
                    <span className={`${CAPTION} w-[210px] shrink-0`}>{input}</span>
                    <Avatar name={input} color={color} />
                    <span className={`${PROSE} [font-size:var(--medo-text-sm)]`}>
                      {t(`avatar.letters.${rule}`)}
                    </span>
                  </div>
                ))}
              </div>
            </Content>
          </Section>

          <Section title={t('avatar.overview.statesTitle')}>
            <Content>
              <p className={PROSE}>{t('avatar.overview.statesBody')}</p>
              <div className={ROW}>
                <div className={STACK}>
                  <Avatar initials="AM" color="blue" />
                  <span className={CAPTION}>{t('avatar.states.rest')}</span>
                </div>
                <div className={STACK}>
                  <Avatar loading />
                  <span className={CAPTION}>{t('avatar.states.loading')}</span>
                </div>
                <div className={STACK}>
                  <Avatar />
                  <span className={CAPTION}>{t('avatar.states.nameless')}</span>
                </div>
                <div className={`${STACK} opacity-50`}>
                  <Avatar initials="AM" color="blue" />
                  <span className={CAPTION}>{t('avatar.states.disabledRow')}</span>
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('avatar.overview.useTitle')}>
            <Content>
              <p className={PROSE}>{t('avatar.overview.useBody')}</p>

              <p className={`${CAPTION} mt-[var(--medo-space-lg)]`}>{t('avatar.use.table')}</p>
              <div className="mt-[var(--medo-space-xs)] flex flex-col">
                {PEOPLE.map(person => (
                  <div
                    key={person.mail}
                    className="flex items-center gap-[var(--medo-space-sm)] py-[var(--medo-space-xs)] border-t border-[var(--medo-divider)] first:border-t-0"
                  >
                    <Avatar size="sm" name={person.name} color={person.color} />
                    <div>
                      <div className={`${NAME} [font-size:var(--medo-text-sm)]`}>{person.name}</div>
                      <div className={CAPTION}>{person.mail}</div>
                    </div>
                  </div>
                ))}
              </div>

              <p className={`${CAPTION} mt-[var(--medo-space-lg)]`}>{t('avatar.use.list')}</p>
              <div className="mt-[var(--medo-space-xs)] max-w-[520px] border border-[var(--medo-border)] rounded-[var(--medo-radius-lg)] overflow-hidden">
                {PEOPLE.map(person => (
                  <div
                    key={person.mail}
                    className="flex items-center gap-[var(--medo-space-sm)] px-[var(--medo-space-md)] py-[var(--medo-space-sm)] border-t border-[var(--medo-divider)] first:border-t-0"
                  >
                    <Avatar name={person.name} color="teal" />
                    <div className="min-w-0">
                      <div className={`${NAME} [font-size:var(--medo-text-base)]`}>{person.name}</div>
                      <div className={CAPTION}>{person.mail}</div>
                    </div>
                  </div>
                ))}
              </div>

              <p className={`${CAPTION} mt-[var(--medo-space-lg)]`}>{t('avatar.use.profile')}</p>
              <div className="mt-[var(--medo-space-xs)] flex items-center gap-[var(--medo-space-md)]">
                <Avatar size="lg" name={PEOPLE[0].name} color={PEOPLE[0].color} />
                <div>
                  <div className={`${NAME} [font-size:var(--medo-text-lg)]`}>{PEOPLE[0].name}</div>
                  <div className={CAPTION}>{`${t('avatar.use.role')} · ${PEOPLE[0].mail}`}</div>
                </div>
              </div>

              <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('avatar.overview.useNote')}</p>
            </Content>
          </Section>
        </>
      ),
    },
    {
      id: 'usage',
      label: t('tabs.usage'),
      content: (
        <>
          <Section title={t('avatar.usage.colorTitle')}>
            <Content>
              <p className={PROSE}>{t('avatar.usage.colorBody')}</p>
              <ul className={`${LIST} mt-[var(--medo-space-sm)]`}>
                <li>{t('avatar.usage.c1')}</li>
                <li>{t('avatar.usage.c2')}</li>
                <li>{t('avatar.usage.c3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('avatar.usage.contentTitle')}>
            <Content>
              <p className={PROSE}>{t('avatar.usage.contentBody')}</p>
              <ul className={`${LIST} mt-[var(--medo-space-sm)]`}>
                <li>{t('avatar.usage.o1')}</li>
                <li>{t('avatar.usage.o2')}</li>
                <li>{t('avatar.usage.o3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('avatar.usage.doTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('avatar.usage.do1')}</li>
                <li>{t('avatar.usage.do2')}</li>
                <li>{t('avatar.usage.do3')}</li>
                <li>{t('avatar.usage.do4')}</li>
                <li>{t('avatar.usage.do5')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('avatar.usage.dontTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('avatar.usage.dont1')}</li>
                <li>{t('avatar.usage.dont2')}</li>
                <li>{t('avatar.usage.dont3')}</li>
                <li>{t('avatar.usage.dont4')}</li>
                <li>{t('avatar.usage.dont5')}</li>
                <li>{t('avatar.usage.dont6')}</li>
              </ul>
            </Content>
          </Section>
        </>
      ),
    },
    {
      id: 'code',
      label: t('tabs.code'),
      content: (
        <Section title={t('avatar.code.title')}>
          <Content>
            <p className={PROSE}>{t('avatar.code.basicDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('avatar.code.rowDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{ROW_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('avatar.code.initialsDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{INITIALS_CODE}</CodeBlock>
            </div>
          </Content>
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('avatar.a11y.labelTitle')}>
            <Content>
              <p className={PROSE}>{t('avatar.a11y.labelBody')}</p>
              <ul className={`${LIST} mt-[var(--medo-space-sm)]`}>
                <li>{t('avatar.a11y.l1')}</li>
                <li>{t('avatar.a11y.l2')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('avatar.a11y.contrastTitle')}>
            <Content>
              <p className={PROSE}>{t('avatar.a11y.contrastBody')}</p>
            </Content>
          </Section>

          <Section title={t('avatar.a11y.darkTitle')}>
            <Content>
              <p className={PROSE}>{t('avatar.a11y.darkBody')}</p>
              <ul className={`${LIST} mt-[var(--medo-space-sm)]`}>
                <li>{t('avatar.a11y.d1')}</li>
                <li>{t('avatar.a11y.d2')}</li>
                <li>{t('avatar.a11y.d3')}</li>
              </ul>
              <p className={`${PROSE} mt-[var(--medo-space-sm)]`}>{t('avatar.a11y.darkNote')}</p>
            </Content>
          </Section>

          <Section title={t('avatar.a11y.stateTitle')}>
            <Content>
              <p className={PROSE}>{t('avatar.a11y.stateBody')}</p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('avatar.page.title')}
      description={t('avatar.page.description')}
      tabs={tabs}
    />
  )
}
