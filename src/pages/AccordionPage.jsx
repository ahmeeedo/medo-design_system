import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Accordion } from '../components'

const BASIC_CODE = `import { Accordion } from '@/components'

{/* Standard ist multiple — Aufklappen schließt nichts, was gerade gelesen wird */}
<Accordion
  showToggleAll
  defaultValue={['zulassung']}
  items={[
    { value: 'zulassung', icon: 'verified', title: 'Zulassung und Register',
      subtitle: 'IHK-Registrierung, Vermittlernummer', content: <p>…</p> },
    { value: 'haftung', icon: 'gavel', title: 'Berufshaftpflicht',
      meta: '2 Angaben', content: <p>…</p> },
    { value: 'archiv', title: 'Archivierte Nachweise', disabled: true, content: null },
  ]}
/>`

const SINGLE_CODE = `{/* multiple={false} nur, wenn die Abschnitte einander ausschließen */}
<Accordion variant="separated" multiple={false} marker="chevron" items={fragen} />`

const CONTROLLED_CODE = `{/* Gesteuert: value plus onChange. Bei multiple ist der Wert ein Array */}
const [offen, setOffen] = useState(['beitrag'])

<Accordion value={offen} onChange={setOffen} items={items} />

{/* Bei multiple={false} meldet onChange einen einzelnen Wert oder null */}
<Accordion multiple={false} value={aktiv} onChange={setAktiv} items={items} />`

const VARIANT_CODE = `{/* card = eine Karte mit Trennlinien, separated = einzelne Karten, plain = nur Linien */}
<Accordion variant="card" items={items} />
<Accordion variant="separated" items={items} />
<Accordion variant="plain" size="sm" items={items} />`

export default function AccordionPage() {
  const { t } = useTranslation()

  const paragraph = (text) => (
    <p className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] m-0">
      {text}
    </p>
  )

  const items = [
    {
      value: 'zulassung',
      icon: 'verified',
      title: t('accordion.demo.i1Title'),
      subtitle: t('accordion.demo.i1Sub'),
      content: paragraph(t('accordion.demo.i1Content')),
    },
    {
      value: 'haftung',
      icon: 'gavel',
      title: t('accordion.demo.i2Title'),
      meta: t('accordion.demo.i2Meta'),
      content: paragraph(t('accordion.demo.i2Content')),
    },
    {
      value: 'beitrag',
      icon: 'payments',
      title: t('accordion.demo.i3Title'),
      subtitle: t('accordion.demo.i3Sub'),
      content: paragraph(t('accordion.demo.i3Content')),
    },
    {
      value: 'archiv',
      title: t('accordion.demo.i4Title'),
      disabled: true,
      content: null,
    },
  ]

  const faqItems = [
    { value: 'f1', title: t('accordion.faq.q1'), content: paragraph(t('accordion.faq.a1')) },
    { value: 'f2', title: t('accordion.faq.q2'), content: paragraph(t('accordion.faq.a2')) },
    { value: 'f3', title: t('accordion.faq.q3'), content: paragraph(t('accordion.faq.a3')) },
  ]

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => (
              <div className="w-full max-w-[560px]">
                <Accordion
                  items={values.icons ? items : items.map(({ icon, ...rest }) => rest)}
                  multiple={values.multiple}
                  variant={values.variant}
                  size={values.size}
                  marker={values.marker}
                  showToggleAll={values.showToggleAll}
                  defaultValue={['zulassung']}
                />
              </div>
            )}
            controls={[
              { id: 'variant', type: 'dropdown', label: 'Variant', options: ['card', 'separated', 'plain'], default: 'card' },
              { id: 'size', type: 'dropdown', label: 'Size', options: ['sm', 'md'], default: 'md' },
              { id: 'marker', type: 'dropdown', label: 'Marker', options: ['plusminus', 'chevron'], default: 'plusminus' },
              { id: 'multiple', type: 'toggle', label: 'Multiple', default: true },
              { id: 'showToggleAll', type: 'toggle', label: 'Toggle All', default: true },
              { id: 'icons', type: 'toggle', label: 'Icons', default: true },
            ]}
          />

          <Section title={t('accordion.overview.anatomyTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-md)]">
                {t('accordion.overview.anatomyBody')}
              </p>
              <ul className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                <li>{t('accordion.overview.an1')}</li>
                <li>{t('accordion.overview.an2')}</li>
                <li>{t('accordion.overview.an3')}</li>
                <li>{t('accordion.overview.an4')}</li>
              </ul>
              <div className="max-w-[560px]">
                <Accordion items={items} defaultValue={['zulassung']} />
              </div>
            </Content>
          </Section>

          <Section title={t('accordion.overview.variantsTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('accordion.overview.variantsBody')}
              </p>
              <div className="grid grid-cols-3 max-[1024px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    card
                  </p>
                  <Accordion variant="card" items={faqItems} defaultValue={['f1']} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    separated
                  </p>
                  <Accordion variant="separated" items={faqItems} defaultValue={['f1']} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    plain
                  </p>
                  <Accordion variant="plain" items={faqItems} defaultValue={['f1']} />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('accordion.overview.behaviourTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('accordion.overview.behaviourBody')}
              </p>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('accordion.behaviour.multiple')}
                  </p>
                  <Accordion showToggleAll items={faqItems} defaultValue={['f1', 'f2']} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('accordion.behaviour.single')}
                  </p>
                  <Accordion multiple={false} items={faqItems} defaultValue="f1" />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('accordion.overview.markerTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('accordion.overview.markerBody')}
              </p>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    plusminus
                  </p>
                  <Accordion items={faqItems} defaultValue={['f1']} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    chevron
                  </p>
                  <Accordion marker="chevron" items={faqItems} defaultValue={['f1']} />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('accordion.overview.sizesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('accordion.overview.sizesBody')}
              </p>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    sm
                  </p>
                  <Accordion size="sm" items={faqItems} defaultValue={['f1']} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    md
                  </p>
                  <Accordion items={faqItems} defaultValue={['f1']} />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('accordion.overview.faqTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('accordion.overview.faqBody')}
              </p>
              <div className="max-w-[560px]">
                <Accordion variant="separated" multiple={false} marker="chevron" items={faqItems} />
              </div>
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
          <Section title={t('accordion.usage.whenTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('accordion.usage.whenBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('accordion.usage.whenNotTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('accordion.usage.whenNotBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('accordion.usage.headerTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('accordion.usage.headerBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('accordion.usage.toggleAllTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('accordion.usage.toggleAllBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('accordion.usage.doDontTitle')}>
            <Content>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-success-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-success-text)] mb-[var(--medo-space-sm)]">
                    {t('accordion.usage.doTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('accordion.usage.do1')}</li>
                    <li>{t('accordion.usage.do2')}</li>
                    <li>{t('accordion.usage.do3')}</li>
                  </ul>
                </div>
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-error-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-error-text)] mb-[var(--medo-space-sm)]">
                    {t('accordion.usage.dontTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('accordion.usage.dont1')}</li>
                    <li>{t('accordion.usage.dont2')}</li>
                    <li>{t('accordion.usage.dont3')}</li>
                  </ul>
                </div>
              </div>
            </Content>
          </Section>
        </>
      ),
    },
    {
      id: 'code',
      label: t('tabs.code'),
      content: (
        <Section title={t('accordion.code.title')}>
          <Content>
            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)]">
              {t('accordion.code.basicTitle')}
            </p>
            <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('accordion.code.singleTitle')}
            </p>
            <CodeBlock language="jsx">{SINGLE_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('accordion.code.controlledTitle')}
            </p>
            <CodeBlock language="jsx">{CONTROLLED_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('accordion.code.variantTitle')}
            </p>
            <CodeBlock language="jsx">{VARIANT_CODE}</CodeBlock>
          </Content>
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('accordion.a11y.rolesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('accordion.a11y.rolesBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('accordion.a11y.keyboardTitle')}>
            <Content>
              <ul className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                <li>{t('accordion.a11y.key1')}</li>
                <li>{t('accordion.a11y.key2')}</li>
                <li>{t('accordion.a11y.key3')}</li>
              </ul>
            </Content>
          </Section>
          <Section title={t('accordion.a11y.domTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('accordion.a11y.domBody')}
              </p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('accordion.page.title')}
      description={t('accordion.page.description')}
      tabs={tabs}
    />
  )
}
