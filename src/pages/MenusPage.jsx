import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Button, Menu } from '../components'

const BASE_CODE = `import { Menu } from '@/components'

{/* Standard-Menu mit ···-Trigger (default) */}
<Menu>
  <Menu.Item icon="✏️" shortcut="⌘E" onClick={handleEdit}>Bearbeiten</Menu.Item>
  <Menu.Item icon="📋" shortcut="⌘C" onClick={handleCopy}>Kopieren</Menu.Item>
  <Menu.Separator />
  <Menu.Item icon="🗑️" danger onClick={handleDelete}>Löschen</Menu.Item>
</Menu>`

const TRIGGER_CODE = `import { Button, Menu } from '@/components'

{/* Benutzerdefinierter Trigger-Button */}
<Menu trigger={<Button variant="secondary" size="sm">Optionen ▾</Button>}>
  <Menu.Item icon="✏️">Bearbeiten</Menu.Item>
  <Menu.Item icon="📤">Exportieren</Menu.Item>
  <Menu.Separator />
  <Menu.Item danger>Löschen</Menu.Item>
</Menu>`

const LABEL_CODE = `{/* Menu.Label für Abschnitts-Gruppierung */}
<Menu>
  <Menu.Label>Account</Menu.Label>
  <Menu.Item icon="👤" shortcut="⌘P">Profil</Menu.Item>
  <Menu.Item icon="⚙️" shortcut="⌘,">Einstellungen</Menu.Item>
  <Menu.Separator />
  <Menu.Label>Workspace</Menu.Label>
  <Menu.Item icon="📁" shortcut="⌘N">Neues Projekt</Menu.Item>
  <Menu.Item icon="📋">Duplizieren</Menu.Item>
  <Menu.Separator />
  <Menu.Item icon="🗑️" danger shortcut="⌫">Löschen</Menu.Item>
</Menu>`

const DISABLED_CODE = `{/* disabled-Prop deaktiviert ein Item */}
<Menu>
  <Menu.Item icon="✏️">Bearbeiten</Menu.Item>
  <Menu.Item icon="📤" disabled>Exportieren (keine Berechtigung)</Menu.Item>
  <Menu.Separator />
  <Menu.Item danger>Löschen</Menu.Item>
</Menu>`

export default function MenusPage() {
  const { t } = useTranslation()

  const doDont = ['1', '2', '3'].map(n => ({ do: `do${n}`, dont: `dont${n}` }))

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <Section title={t('menus.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-3)]">
                {t('menus.overview.anatomyBody')}
              </p>
              <ol className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)]">
                {['an1', 'an2', 'an3', 'an4', 'an5'].map(k => (
                  <li key={k} className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t(`menus.overview.${k}`)}
                  </li>
                ))}
              </ol>
            </Content>
          </Section>

          <Section title={t('menus.overview.demoTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('menus.overview.demoBody')}
              </p>
            </Content>
            <div className="flex flex-wrap gap-[var(--space-6)] items-start">
              <div className="flex flex-col gap-[var(--space-2)]">
                <div className="text-xs [font-weight:var(--weight-semibold)] text-[var(--color-text-secondary)] uppercase [letter-spacing:var(--tracking-wide)]">
                  {t('menus.overview.demoDefault')}
                </div>
                <Menu>
                  <Menu.Label>{t('menus.overview.labelAccount')}</Menu.Label>
                  <Menu.Item icon="👤" shortcut="⌘P">{t('menus.overview.itemProfile')}</Menu.Item>
                  <Menu.Item icon="⚙️" shortcut="⌘,">{t('menus.overview.itemSettings')}</Menu.Item>
                  <Menu.Separator />
                  <Menu.Label>{t('menus.overview.labelWorkspace')}</Menu.Label>
                  <Menu.Item icon="📁" shortcut="⌘N">{t('menus.overview.itemNewProject')}</Menu.Item>
                  <Menu.Item icon="📋">{t('menus.overview.itemDuplicate')}</Menu.Item>
                  <Menu.Separator />
                  <Menu.Item icon="🗑️" danger shortcut="⌫">{t('menus.overview.itemDelete')}</Menu.Item>
                </Menu>
              </div>

              <div className="flex flex-col gap-[var(--space-2)]">
                <div className="text-xs [font-weight:var(--weight-semibold)] text-[var(--color-text-secondary)] uppercase [letter-spacing:var(--tracking-wide)]">
                  {t('menus.overview.demoCustomTrigger')}
                </div>
                <Menu trigger={<Button variant="secondary" size="sm">{t('menus.overview.triggerOptions')}</Button>}>
                  <Menu.Item icon="✏️">{t('menus.overview.itemEdit')}</Menu.Item>
                  <Menu.Item icon="📤">{t('menus.overview.itemExport')}</Menu.Item>
                  <Menu.Item icon="🔗">{t('menus.overview.itemCopyLink')}</Menu.Item>
                  <Menu.Separator />
                  <Menu.Item icon="🗑️" danger>{t('menus.overview.itemDelete')}</Menu.Item>
                </Menu>
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
          <Section title={t('menus.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('menus.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('menus.usage.whenTitle')}>
            <div className="flex flex-col gap-[var(--space-1)] border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden mb-[var(--space-6)]">
              {['when1', 'when2', 'when3'].map((k, i) => (
                <div key={k} className={`flex items-start gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`menus.usage.${k}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('menus.usage.whenNotTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('menus.usage.whenNotBody')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('menus.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ do: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <span>{t(`menus.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('menus.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('menus.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ dont: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <span>{t(`menus.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('menus.usage.dontNote')}
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
          <Section title={t('menus.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('menus.code.baseTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('menus.code.baseDesc')}
              </p>
              <CodeBlock language="jsx">{BASE_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('menus.code.triggerTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('menus.code.triggerDesc')}
              </p>
              <CodeBlock language="jsx">{TRIGGER_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('menus.code.labelTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('menus.code.labelDesc')}
              </p>
              <CodeBlock language="jsx">{LABEL_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('menus.code.disabledTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('menus.code.disabledDesc')}
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
          <Section title={t('menus.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('menus.a11y.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('menus.a11y.keyboardTitle')}>
            <div className="border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden mb-[var(--space-6)]">
              {['k1', 'k2', 'k3', 'k4', 'k5'].map((k, i) => (
                <div key={k} className={`flex items-center gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`menus.a11y.${k}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              {[
                { title: t('menus.a11y.roleTitle'),   body: t('menus.a11y.roleBody') },
                { title: t('menus.a11y.ariaTitle'),   body: t('menus.a11y.ariaBody') },
                { title: t('menus.a11y.focusTitle'),  body: t('menus.a11y.focusBody') },
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
      title="Menus"
      description={t('menus.page.description')}
      tabs={tabs}
    />
  )
}
