import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Button } from '../components'

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" width="100%" height="100%">
      <path d="M460-460H260q-8.5 0-14.25-5.76T240-480q0-8.5 5.75-14.25T260-500h200v-200q0-8.5 5.76-14.25t14.27-5.75q8.51 0 14.24 5.75T500-700v200h200q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T700-460H500v200q0 8.5-5.76 14.25T479.97-240q-8.51 0-14.24-5.75T460-260v-200Z"/>
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" width="100%" height="100%">
      <path d="M686-450H190q-12.75 0-21.37-8.63Q160-467.25 160-480t8.63-21.37Q177.25-510 190-510h496L522-674q-9-9-8.5-21.5T523-717q9-9 21.5-9t21.5 9l199 199q5 5 7 10t2 11q0 6-2 11t-7 10L566-277q-9 9-21 8.5t-21-9.5q-9-9-9-21.5t9-21.5l162-129Z"/>
    </svg>
  )
}

const VARIANTS = ['primary', 'accent', 'secondary', 'ghost', 'danger', 'link']
const SIZES    = ['xs', 'sm', 'md', 'lg', 'xl']

const VARIANTS_CODE = `import { Button } from '@/components'

<Button variant="primary">Speichern</Button>
<Button variant="accent">Hervorheben</Button>
<Button variant="secondary">Abbrechen</Button>
<Button variant="ghost">Verwerfen</Button>
<Button variant="danger">Löschen</Button>
<Button variant="link">Mehr erfahren</Button>`

const SIZES_CODE = `{/* size-Prop — Standard ist "md" */}
<Button size="xs">Extra klein</Button>
<Button size="sm">Klein</Button>
<Button size="md">Standard</Button>
<Button size="lg">Groß</Button>
<Button size="xl">Extra groß</Button>`

const ICONS_CODE = `function SaveIcon() {
  return <svg>...</svg>
}

{/* Leading Icon */}
<Button leadingIcon={<SaveIcon />}>Speichern</Button>

{/* Trailing Icon */}
<Button trailingIcon={<ArrowIcon />} variant="secondary">Weiter</Button>

{/* Icon-only — aria-label ist Pflicht */}
<Button aria-label="Hinzufügen" leadingIcon={<PlusIcon />} />`

const DISABLED_CODE = `{/* disabled-Prop deaktiviert den Button */}
<Button disabled>Speichern</Button>
<Button variant="secondary" disabled>Abbrechen</Button>
<Button variant="ghost" disabled>Verwerfen</Button>

{/* aria-disabled für Buttons, die Fokus behalten sollen */}
<Button aria-disabled="true" onClick={handleDisabledClick}>
  Nicht verfügbar
</Button>`

export default function ButtonsPage() {
  const { t } = useTranslation()

  const variantDescriptions = {
    primary:   t('buttons.overview.vPrimary'),
    accent:    t('buttons.overview.vAccent'),
    secondary: t('buttons.overview.vSecondary'),
    ghost:     t('buttons.overview.vGhost'),
    danger:    t('buttons.overview.vDanger'),
    link:      t('buttons.overview.vLink'),
  }

  const variantGuides = [
    { key: 'primaryGuide',   variant: 'primary' },
    { key: 'accentGuide',    variant: 'accent' },
    { key: 'secondaryGuide', variant: 'secondary' },
    { key: 'ghostGuide',     variant: 'ghost' },
    { key: 'dangerGuide',    variant: 'danger' },
    { key: 'linkGuide',      variant: 'link' },
  ]

  const doDont = [
    { do: 'do1', dont: 'dont1' },
    { do: 'do2', dont: 'dont2' },
    { do: 'do3', dont: 'dont3' },
    { do: 'do4', dont: 'dont4' },
  ]

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <Section title={t('buttons.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-3)]">
                {t('buttons.overview.anatomyBody')}
              </p>
              <ol className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)]">
                {['an1', 'an2', 'an3'].map(k => (
                  <li key={k} className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t(`buttons.overview.${k}`)}
                  </li>
                ))}
              </ol>
            </Content>
          </Section>

          <Section title={t('buttons.overview.variantsTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('buttons.overview.variantsBody')}
              </p>
            </Content>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-3)] mb-[var(--space-6)]">
              {VARIANTS.map(v => (
                <div key={v} className="flex items-center gap-[var(--space-4)] p-[var(--space-4)] bg-[var(--surface-container_100)] rounded-[var(--radius-lg)] border border-[var(--border-subtle-100)]">
                  <Button variant={v} size="sm">
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </Button>
                  <span className="text-sm text-[var(--color-text-secondary)]">{variantDescriptions[v]}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('buttons.overview.sizesTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('buttons.overview.sizesBody')}
              </p>
            </Content>
            <div className="flex items-end gap-[var(--space-4)] flex-wrap mb-[var(--space-4)]">
              {SIZES.map(s => (
                <div key={s} className="flex flex-col items-center gap-[var(--space-2)]">
                  <Button variant="primary" size={s}>
                    {s.toUpperCase()}
                  </Button>
                  <code className="text-xs [font-family:var(--font-mono)] text-[var(--color-text-secondary)]">
                    size="{s}"
                  </code>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('buttons.overview.iconsTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('buttons.overview.iconsBody')}
              </p>
            </Content>
            <div className="flex flex-wrap gap-[var(--space-3)] mb-[var(--space-4)]">
              <Button leadingIcon={<PlusIcon />}>Hinzufügen</Button>
              <Button variant="secondary" trailingIcon={<ArrowIcon />}>Weiter</Button>
              <Button variant="ghost" leadingIcon={<PlusIcon />} trailingIcon={<ArrowIcon />}>Beides</Button>
              <Button variant="accent" aria-label="Hinzufügen" leadingIcon={<PlusIcon />} />
            </div>
          </Section>

          <Section title={t('buttons.overview.disabledTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('buttons.overview.disabledBody')}
              </p>
            </Content>
            <div className="flex flex-wrap gap-[var(--space-3)]">
              {['primary', 'secondary', 'ghost', 'danger'].map(v => (
                <Button key={v} variant={v} disabled>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Button>
              ))}
            </div>
          </Section>
        </>
      ),
    },
    {
      id: 'usage',
      label: t('tabs.usage'),
      content: (
        <>
          <Section title={t('buttons.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('buttons.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('buttons.usage.variantGuideTitle')}>
            <div className="grid grid-cols-1 gap-[var(--space-1)] mb-[var(--space-6)] border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden">
              {variantGuides.map(({ key, variant }, i) => (
                <div key={key} className={`flex items-center gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <Button variant={variant} size="xs">
                    {variant.charAt(0).toUpperCase() + variant.slice(1)}
                  </Button>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`buttons.usage.${key}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('buttons.usage.iconTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('buttons.usage.iconBody')}
              </p>
            </Content>
          </Section>

          <Section title={t('buttons.usage.groupTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('buttons.usage.groupBody')}
              </p>
            </Content>
            <div className="flex gap-[var(--space-3)] flex-wrap">
              <Button variant="secondary">Abbrechen</Button>
              <Button variant="primary">Speichern</Button>
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('buttons.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ do: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <span>{t(`buttons.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('buttons.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('buttons.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ dont: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <span>{t(`buttons.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('buttons.usage.dontNote')}
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
          <Section title={t('buttons.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('buttons.code.variantsTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('buttons.code.variantsDesc')}
              </p>
              <CodeBlock language="jsx">{VARIANTS_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('buttons.code.sizesTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('buttons.code.sizesDesc')}
              </p>
              <CodeBlock language="jsx">{SIZES_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('buttons.code.iconTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('buttons.code.iconDesc')}
              </p>
              <CodeBlock language="jsx">{ICONS_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('buttons.code.disabledTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('buttons.code.disabledDesc')}
              </p>
              <CodeBlock language="jsx">{DISABLED_CODE}</CodeBlock>
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
          <Section title={t('buttons.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('buttons.a11y.intro')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-6)]">
              <div className="bg-[var(--surface-container_100)] rounded-[var(--radius-lg)] p-[var(--space-5)] border border-[var(--border-subtle-100)]">
                <div className="text-md [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                  {t('buttons.a11y.wcagTitle')}
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                  {t('buttons.a11y.wcagBody')}
                </p>
              </div>
              <div className="bg-[var(--surface-container_100)] rounded-[var(--radius-lg)] p-[var(--space-5)] border border-[var(--border-subtle-100)]">
                <div className="text-md [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                  {t('buttons.a11y.focusTitle')}
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                  {t('buttons.a11y.focusBody')}
                </p>
              </div>
            </div>
          </Section>

          <Section title={t('buttons.a11y.keyboardTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-4)]">
                {t('buttons.a11y.keyboardBody')}
              </p>
            </Content>
            <div className="border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden">
              {['k1','k2','k3','k4'].map((k, i) => (
                <div key={k} className={`flex items-center gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`buttons.a11y.${k}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('buttons.a11y.ariaTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-4)]">
                {t('buttons.a11y.ariaBody')}
              </p>
            </Content>
            <ul className="flex flex-col gap-[var(--space-2)]">
              {['aria1','aria2','aria3'].map(k => (
                <li key={k} className="flex gap-[var(--space-2)] text-sm text-[var(--color-text-secondary)]">
                  <span className="text-[var(--color-brand-secondary-800)] shrink-0">→</span>
                  <span>{t(`buttons.a11y.${k}`)}</span>
                </li>
              ))}
            </ul>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title="Buttons"
      description={t('buttons.page.description')}
      tabs={tabs}
    />
  )
}
