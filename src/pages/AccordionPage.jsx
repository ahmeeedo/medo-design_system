import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Accordion } from '../components'

const BASE_CODE = `import { Accordion } from '@/components'

const items = [
  {
    id: 'shipping',
    title: 'Wie lange dauert der Versand?',
    content: <p>Standardversand: 3–5 Werktage. Express: 1–2 Werktage.</p>,
  },
  {
    id: 'return',
    title: 'Wie funktioniert die Rückgabe?',
    content: <p>30 Tage Rückgaberecht, kostenloser Rückversand.</p>,
  },
]

{/* allowMultiple=false (Standard) — nur ein Item gleichzeitig geöffnet */}
<Accordion items={items} />`

const MULTIPLE_CODE = `{/* allowMultiple=true — mehrere Items gleichzeitig offen */}
<Accordion
  items={items}
  allowMultiple={true}
/>`

const JSX_CODE = `const items = [
  {
    id: 'setup',
    title: 'Installation',
    content: (
      <div>
        <p>Installiere das Paket via npm:</p>
        <code>npm install @medo/design-system</code>
      </div>
    ),
  },
  {
    id: 'config',
    title: 'Konfiguration',
    content: (
      <ul>
        <li>Token-Datei importieren</li>
        <li>Tailwind-Config erweitern</li>
        <li>i18n-Provider einbinden</li>
      </ul>
    ),
  },
]

<Accordion items={items} />`

const SINGLE_ITEMS = [
  {
    id: 'faq1',
    title: 'Wie lange dauert der Versand?',
    content: <p className="text-sm text-[var(--color-text-secondary)]">Standardversand dauert 3–5 Werktage. Mit Express-Versand erhalten Sie Ihre Bestellung in 1–2 Werktagen.</p>,
  },
  {
    id: 'faq2',
    title: 'Wie funktioniert die Rückgabe?',
    content: <p className="text-sm text-[var(--color-text-secondary)]">Sie haben 30 Tage Rückgaberecht. Der Rückversand ist kostenlos — einfach das Retourenformular ausfüllen.</p>,
  },
  {
    id: 'faq3',
    title: 'Welche Zahlungsmethoden werden akzeptiert?',
    content: <p className="text-sm text-[var(--color-text-secondary)]">Wir akzeptieren Kreditkarte, PayPal, SEPA-Lastschrift und Rechnung (Klarna).</p>,
  },
  {
    id: 'faq4',
    title: 'Kann ich meine Bestellung stornieren?',
    content: <p className="text-sm text-[var(--color-text-secondary)]">Bestellungen können bis zur Versandbestätigung kostenlos storniert werden. Danach gilt das reguläre Rückgaberecht.</p>,
  },
]

const MULTIPLE_ITEMS = [
  {
    id: 'feat1',
    title: 'Design Tokens',
    content: <p className="text-sm text-[var(--color-text-secondary)]">Farben, Abstände, Radius und Schatten als CSS-Custom-Properties — konsistent über alle Komponenten.</p>,
  },
  {
    id: 'feat2',
    title: 'Barrierefreiheit',
    content: <p className="text-sm text-[var(--color-text-secondary)]">Alle Komponenten implementieren WAI-ARIA Patterns und sind vollständig per Tastatur bedienbar.</p>,
  },
  {
    id: 'feat3',
    title: 'Internationalisierung',
    content: <p className="text-sm text-[var(--color-text-secondary)]">Eingebaute i18n-Unterstützung via react-i18next — alle Strings übersetzt, keine hardcodierten Texte.</p>,
  },
]

export default function AccordionPage() {
  const { t } = useTranslation()

  const doDont = ['1', '2', '3'].map(n => ({ do: `do${n}`, dont: `dont${n}` }))

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => (
              <Accordion
                allowMultiple={values.allowMultiple}
                items={[
                  { id: 'demo1', title: 'Item 1', content: <span className="text-sm text-[var(--color-text-secondary)]">Content for item 1</span> },
                  { id: 'demo2', title: 'Item 2', content: <span className="text-sm text-[var(--color-text-secondary)]">Content for item 2</span> },
                  { id: 'demo3', title: 'Item 3', content: <span className="text-sm text-[var(--color-text-secondary)]">Content for item 3</span> },
                ]}
              />
            )}
            controls={[
              { id: 'allowMultiple', type: 'toggle', label: 'Allow Multiple', default: false },
            ]}
          />
          <Section title={t('accordion.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-3)]">
                {t('accordion.overview.anatomyBody')}
              </p>
              <ol className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)]">
                {['an1', 'an2', 'an3', 'an4'].map(k => (
                  <li key={k} className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t(`accordion.overview.${k}`)}
                  </li>
                ))}
              </ol>
            </Content>
          </Section>

          <Section title={t('accordion.overview.singleTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('accordion.overview.singleBody')}
              </p>
            </Content>
            <Accordion items={SINGLE_ITEMS} allowMultiple={false} />
          </Section>

          <Section title={t('accordion.overview.multipleTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('accordion.overview.multipleBody')}
              </p>
            </Content>
            <Accordion items={MULTIPLE_ITEMS} allowMultiple={true} />
          </Section>
        </>
      ),
    },
    {
      id: 'usage',
      label: t('tabs.usage'),
      content: (
        <>
          <Section title={t('accordion.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('accordion.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('accordion.usage.whenTitle')}>
            <div className="flex flex-col gap-[var(--space-1)] border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden mb-[var(--space-6)]">
              {['when1', 'when2', 'when3'].map((k, i) => (
                <div key={k} className={`flex items-start gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`accordion.usage.${k}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('accordion.usage.whenNotTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('accordion.usage.whenNotBody')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('accordion.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ do: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <span>{t(`accordion.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('accordion.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('accordion.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ dont: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <span>{t(`accordion.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('accordion.usage.dontNote')}
                </div>
              </div>
            </div>
          </Section>
        </>
      ),
    },
    {
      id: 'code',
      label: t('tabs.code'),
      content: (
        <>
          <Section title={t('accordion.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('accordion.code.baseTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('accordion.code.baseDesc')}
              </p>
              <CodeBlock language="jsx">{BASE_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('accordion.code.multipleTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('accordion.code.multipleDesc')}
              </p>
              <CodeBlock language="jsx">{MULTIPLE_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('accordion.code.jsxTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('accordion.code.jsxDesc')}
              </p>
              <CodeBlock language="jsx">{JSX_CODE}</CodeBlock>
            </Content>
          </Section>
        </>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('accordion.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('accordion.a11y.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('accordion.a11y.keyboardTitle')}>
            <div className="border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden mb-[var(--space-6)]">
              {['k1', 'k2', 'k3', 'k4'].map((k, i) => (
                <div key={k} className={`flex items-center gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`accordion.a11y.${k}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              {[
                { title: t('accordion.a11y.roleTitle'),     body: t('accordion.a11y.roleBody') },
                { title: t('accordion.a11y.expandedTitle'), body: t('accordion.a11y.expandedBody') },
                { title: t('accordion.a11y.focusTitle'),    body: t('accordion.a11y.focusBody') },
              ].map(({ title, body }) => (
                <div key={title} className="bg-[var(--surface-container_100)] rounded-[var(--radius-lg)] p-[var(--space-5)] border border-[var(--border-subtle-100)]">
                  <div className="text-md [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">{title}</div>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">{body}</p>
                </div>
              ))}
            </div>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title="Accordion"
      description={t('accordion.page.description')}
      tabs={tabs}
    />
  )
}
