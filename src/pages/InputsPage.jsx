import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Input, Textarea, InputWithAddon } from '../components'

const BASIC_CODE = `import { Input } from '@/components'

<Input
  label="E-Mail-Adresse"
  placeholder="name@beispiel.de"
  hint="Wir senden dir eine Bestätigungs-E-Mail."
/>

<Input
  label="Benutzername"
  placeholder="a.mustermann"
  size="sm"
/>`

const ERROR_CODE = `{/* error-Prop zeigt Fehlermeldung — hint wird dabei ausgeblendet */}
<Input
  label="Passwort"
  type="password"
  defaultValue="12345"
  error="Passwort muss mindestens 8 Zeichen enthalten."
/>

{/* aria-describedby für explizite Screen-Reader-Verknüpfung */}
<Input
  label="E-Mail"
  id="email-input"
  error="Ungültige E-Mail-Adresse."
  aria-describedby="email-error"
/>`

const TEXTAREA_CODE = `import { Textarea } from '@/components'

<Textarea
  label="Projektbeschreibung"
  placeholder="Beschreibe dein Projekt…"
  rows={4}
  hint="Maximal 500 Zeichen."
/>

{/* Error-Zustand */}
<Textarea
  label="Kommentar"
  rows={3}
  error="Kommentar darf nicht leer sein."
/>`

const ADDON_CODE = `import { InputWithAddon } from '@/components'

{/* URL-Endung als Suffix */}
<InputWithAddon addon=".de" placeholder="meinedomain" />

{/* Prozent-Angabe */}
<InputWithAddon addon="%" placeholder="0" />`

const DISABLED_CODE = `{/* Nicht editierbares Feld */}
<Input
  label="Benutzername"
  defaultValue="a.mustermann"
  disabled
/>

<Textarea
  label="Systemnotiz"
  defaultValue="Automatisch generiert."
  rows={2}
  disabled
/>`

export default function InputsPage() {
  const { t } = useTranslation()

  const anatomy = ['an1','an2','an3','an4','an5','an6']
  const doDont  = ['1','2','3','4'].map(n => ({ do: `do${n}`, dont: `dont${n}` }))

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <Section title={t('inputs.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-3)]">
                {t('inputs.overview.anatomyBody')}
              </p>
              <ol className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)]">
                {anatomy.map(k => (
                  <li key={k} className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t(`inputs.overview.${k}`)}
                  </li>
                ))}
              </ol>
            </Content>
          </Section>

          <Section title={t('inputs.overview.statesTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('inputs.overview.statesBody')}
              </p>
            </Content>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)] mb-[var(--space-4)]">
              <Input label="Default" placeholder="Platzhalter…" hint="Hilfstext für das Feld." />
              <Input label="Error" defaultValue="Ungültiger Wert" error="Dieses Feld ist erforderlich." />
              <Input label="Disabled" defaultValue="Nicht editierbar" disabled />
              <div>
                <div className="block text-sm [font-weight:var(--weight-medium)] text-[var(--color-text-primary)] mb-[6px]">
                  Mit Addon
                </div>
                <InputWithAddon addon=".de" placeholder="meinedomain" />
              </div>
            </div>
          </Section>

          <Section title={t('inputs.overview.sizesTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('inputs.overview.sizesBody')}
              </p>
            </Content>
            <div className="flex flex-col gap-[var(--space-3)] max-w-[360px]">
              <Input label="Small (sm)" placeholder="Small…" size="sm" />
              <Input label="Medium (md — Standard)" placeholder="Medium…" size="md" />
              <Input label="Large (lg)" placeholder="Large…" size="lg" />
            </div>
          </Section>

          <Section title={t('inputs.overview.textareaTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('inputs.overview.textareaBody')}
              </p>
            </Content>
            <div className="max-w-[480px]">
              <Textarea label="Projektbeschreibung" rows={3} placeholder="Beschreibe dein Projekt…" hint="Maximal 500 Zeichen." />
            </div>
          </Section>

          <Section title={t('inputs.overview.addonTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('inputs.overview.addonBody')}
              </p>
            </Content>
            <div className="flex flex-col gap-[var(--space-3)] max-w-[360px]">
              <div>
                <div className="block text-sm [font-weight:var(--weight-medium)] text-[var(--color-text-primary)] mb-[6px]">Domain</div>
                <InputWithAddon addon=".de" placeholder="meinedomain" />
              </div>
              <div>
                <div className="block text-sm [font-weight:var(--weight-medium)] text-[var(--color-text-primary)] mb-[6px]">Rabatt</div>
                <InputWithAddon addon="%" placeholder="0" />
              </div>
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
          <Section title={t('inputs.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('inputs.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-3 max-[640px]:grid-cols-1 gap-[var(--space-5)]">
              {[
                { title: t('inputs.usage.vsTitle'),    body: t('inputs.usage.vsBody') },
                { title: t('inputs.usage.addonTitle'), body: t('inputs.usage.addonBody') },
                { title: t('inputs.usage.formTitle'),  body: t('inputs.usage.formBody') },
              ].map(({ title, body }) => (
                <div key={title} className="bg-[var(--surface-container_100)] rounded-[var(--radius-lg)] p-[var(--space-5)] border border-[var(--border-subtle-100)]">
                  <div className="text-md [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">{title}</div>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">{body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('inputs.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ do: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <span>{t(`inputs.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('inputs.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('inputs.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ dont: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <span>{t(`inputs.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('inputs.usage.dontNote')}
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
          <Section title={t('inputs.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('inputs.code.basicTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('inputs.code.basicDesc')}
              </p>
              <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('inputs.code.errorTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('inputs.code.errorDesc')}
              </p>
              <CodeBlock language="jsx">{ERROR_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('inputs.code.textareaTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('inputs.code.textareaDesc')}
              </p>
              <CodeBlock language="jsx">{TEXTAREA_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('inputs.code.addonTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('inputs.code.addonDesc')}
              </p>
              <CodeBlock language="jsx">{ADDON_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('inputs.code.disabledTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('inputs.code.disabledDesc')}
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
          <Section title={t('inputs.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('inputs.a11y.intro')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-6)]">
              {[
                { title: t('inputs.a11y.labelsTitle'),       body: t('inputs.a11y.labelsBody') },
                { title: t('inputs.a11y.errorTitle'),        body: t('inputs.a11y.errorBody') },
                { title: t('inputs.a11y.keyboardTitle'),     body: t('inputs.a11y.keyboardBody') },
                { title: t('inputs.a11y.autocompleteTitle'), body: t('inputs.a11y.autocompleteBody') },
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
      title="Inputs"
      description={t('inputs.page.description')}
      tabs={tabs}
    />
  )
}
