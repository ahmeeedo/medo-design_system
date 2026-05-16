import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Card, Button } from '../components'

const FLAT_CODE = `import { Card, Button } from '@/components'

<Card variant="flat">
  <Card.Header title="Projektübersicht" subtitle="Zuletzt aktualisiert: heute" />
  <Card.Body>
    <p>Karteninhalt — Text, Formulare oder andere Komponenten.</p>
  </Card.Body>
  <Card.Footer>
    <Button variant="ghost" size="sm">Abbrechen</Button>
    <Button variant="primary" size="sm">Speichern</Button>
  </Card.Footer>
</Card>`

const RAISED_CODE = `{/* variant="raised" — Schatten statt Border */}
<Card variant="raised">
  <Card.Header title="Raised Card" subtitle="Hebt sich durch Schatten ab" />
  <Card.Body>
    <p>Geeignet für Overlays, Panels oder hervorgehobene Inhalte.</p>
  </Card.Body>
</Card>`

const ACTION_CODE = `{/* Card.Header mit Action-Button */}
<Card variant="flat">
  <Card.Header title="Team-Mitglieder" subtitle="3 aktive Nutzer">
    <Button variant="ghost" size="sm">Einladen</Button>
  </Card.Header>
  <Card.Body>
    {/* Nutzerliste */}
  </Card.Body>
</Card>`

const FORM_CODE = `{/* Card als Formular-Container */}
<Card variant="flat">
  <Card.Header title="Profil bearbeiten" />
  <Card.Body>
    <form>
      <input type="text" placeholder="Name" />
      <input type="email" placeholder="E-Mail" />
    </form>
  </Card.Body>
  <Card.Footer>
    <Button variant="secondary" size="sm">Abbrechen</Button>
    <Button variant="primary" size="sm">Speichern</Button>
  </Card.Footer>
</Card>`

export default function CardsPage() {
  const { t } = useTranslation()

  const doDont = ['1', '2', '3'].map(n => ({ do: `do${n}`, dont: `dont${n}` }))

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <Section title={t('cards.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-3)]">
                {t('cards.overview.anatomyBody')}
              </p>
              <ol className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)]">
                {['an1', 'an2', 'an3', 'an4'].map(k => (
                  <li key={k} className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t(`cards.overview.${k}`)}
                  </li>
                ))}
              </ol>
            </Content>
          </Section>

          <Section title={t('cards.overview.variantsTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('cards.overview.variantsBody')}
              </p>
            </Content>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)] mb-[var(--space-6)]">
              <Card variant="flat">
                <Card.Header title={t('cards.overview.flatTitle')} subtitle={t('cards.overview.flatSubtitle')} />
                <Card.Body>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t('cards.overview.flatBody')}
                  </p>
                </Card.Body>
                <Card.Footer>
                  <Button variant="ghost" size="sm">{t('cards.overview.cancel')}</Button>
                  <Button variant="primary" size="sm">{t('cards.overview.confirm')}</Button>
                </Card.Footer>
              </Card>

              <Card variant="raised">
                <Card.Header title={t('cards.overview.raisedTitle')} subtitle={t('cards.overview.raisedSubtitle')} />
                <Card.Body>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t('cards.overview.raisedBody')}
                  </p>
                </Card.Body>
                <Card.Footer>
                  <Button variant="ghost" size="sm">{t('cards.overview.cancel')}</Button>
                  <Button variant="accent" size="sm">{t('cards.overview.save')}</Button>
                </Card.Footer>
              </Card>
            </div>

            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <Card variant="flat">
                <Card.Header title={t('cards.overview.noFooterTitle')} subtitle={t('cards.overview.noFooterSubtitle')} />
                <Card.Body>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t('cards.overview.noFooterBody')}
                  </p>
                </Card.Body>
              </Card>

              <Card variant="flat">
                <Card.Header title={t('cards.overview.actionTitle')} subtitle={t('cards.overview.actionSubtitle')}>
                  <Button variant="ghost" size="sm">{t('cards.overview.invite')}</Button>
                </Card.Header>
                <Card.Body>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t('cards.overview.actionBody')}
                  </p>
                </Card.Body>
              </Card>
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
          <Section title={t('cards.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('cards.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('cards.usage.compoundTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-4)]">
                {t('cards.usage.compoundBody')}
              </p>
            </Content>
            <div className="flex flex-col gap-[var(--space-1)] border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden mb-[var(--space-6)]">
              {[
                { key: 'partHeader', label: 'Card.Header' },
                { key: 'partBody',   label: 'Card.Body' },
                { key: 'partFooter', label: 'Card.Footer' },
              ].map(({ key, label }, i) => (
                <div key={key} className={`flex items-start gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <code className="text-xs [font-family:var(--font-mono)] text-[var(--color-text-primary)] shrink-0 min-w-[96px] pt-[2px]">{label}</code>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`cards.usage.${key}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('cards.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ do: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <span>{t(`cards.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('cards.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('cards.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ dont: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <span>{t(`cards.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('cards.usage.dontNote')}
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
          <Section title={t('cards.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('cards.code.flatTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('cards.code.flatDesc')}
              </p>
              <CodeBlock language="jsx">{FLAT_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('cards.code.raisedTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('cards.code.raisedDesc')}
              </p>
              <CodeBlock language="jsx">{RAISED_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('cards.code.actionTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('cards.code.actionDesc')}
              </p>
              <CodeBlock language="jsx">{ACTION_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('cards.code.formTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('cards.code.formDesc')}
              </p>
              <CodeBlock language="jsx">{FORM_CODE}</CodeBlock>
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
          <Section title={t('cards.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('cards.a11y.intro')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              {[
                { title: t('cards.a11y.headingTitle'), body: t('cards.a11y.headingBody') },
                { title: t('cards.a11y.focusTitle'),   body: t('cards.a11y.focusBody') },
                { title: t('cards.a11y.clickTitle'),   body: t('cards.a11y.clickBody') },
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
      title="Cards"
      description={t('cards.page.description')}
      tabs={tabs}
    />
  )
}
