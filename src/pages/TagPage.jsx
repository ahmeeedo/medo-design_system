import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Tag, Button } from '../components'

const PROSE = 'text-[var(--medo-text-muted)] [font-family:var(--medo-font-sans)] [font-size:var(--medo-text-base)] [line-height:var(--medo-leading-relaxed)]'
const CAPTION = '[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] text-[var(--medo-text-muted)]'
const ROW = 'flex flex-wrap items-center gap-[var(--medo-space-xs)] mt-[var(--medo-space-md)]'
const LIST = `${PROSE} list-disc pl-[var(--medo-space-lg)] space-y-[var(--medo-space-3xs)]`

const COLORS = ['neutral', 'primary', 'success', 'warning', 'error', 'info']

const BASIC_CODE = `import { Tag } from '@/components'

<Tag color="success" dot>Aktiv</Tag>
<Tag color="neutral">Entwurf</Tag>
<Tag color="error" emphasis="solid">Abgelaufen</Tag>`

const REMOVE_CODE = `<Tag color="primary" removeLabel="Filter Radiologie entfernen" onRemove={() => entferne('radiologie')}>
  Radiologie
</Tag>`

const SELECT_CODE = `const [aktiv, setAktiv] = useState(false)

<Tag selectable selected={aktiv} onClick={() => setAktiv(!aktiv)}>
  Radiologie
</Tag>`

function RemovableDemo() {
  const { t } = useTranslation()
  const initial = ['radiology', 'cardiology', 'surgery']
  const [items, setItems] = useState(initial)

  return (
    <div>
      <div className={ROW}>
        {items.map(id => (
          <Tag
            key={id}
            color="primary"
            removeLabel={t('tag.demo.removeLabel', { name: t(`tag.demo.filters.${id}`) })}
            onRemove={() => setItems(current => current.filter(entry => entry !== id))}
          >
            {t(`tag.demo.filters.${id}`)}
          </Tag>
        ))}
        {items.length === 0 ? <span className={CAPTION}>{t('tag.demo.emptyFilters')}</span> : null}
      </div>
      {items.length < initial.length ? (
        <div className="mt-[var(--medo-space-md)]">
          <Button variant="secondary" size="sm" icon="refresh" onClick={() => setItems(initial)}>
            {t('tag.demo.resetFilters')}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

function SelectableDemo() {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(['radiology'])

  const toggle = id =>
    setSelected(current =>
      current.includes(id) ? current.filter(entry => entry !== id) : [...current, id]
    )

  return (
    <div className={ROW}>
      {['radiology', 'cardiology', 'surgery'].map(id => (
        <Tag
          key={id}
          selectable
          selected={selected.includes(id)}
          onClick={() => toggle(id)}
        >
          {t(`tag.demo.filters.${id}`)}
        </Tag>
      ))}
      <Tag selectable disabled>{t('tag.demo.filters.archive')}</Tag>
    </div>
  )
}

export default function TagPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={values =>
              values.selectable ? (
                <Tag
                  selectable
                  selected={values.selected}
                  disabled={values.disabled}
                  size={values.size}
                  icon={values.icon ? 'label' : undefined}
                >
                  {t('tag.demo.filters.radiology')}
                </Tag>
              ) : (
                <Tag
                  color={values.color}
                  emphasis={values.emphasis}
                  size={values.size}
                  dot={values.dot}
                  icon={values.icon ? 'label' : undefined}
                  onRemove={values.removable ? () => {} : undefined}
                  removeLabel={t('tag.demo.removeLabel', { name: t('tag.demo.filters.radiology') })}
                >
                  {t('tag.demo.filters.radiology')}
                </Tag>
              )
            }
            controls={[
              { id: 'color', type: 'dropdown', label: t('tag.controls.color'), options: COLORS, default: 'neutral' },
              { id: 'emphasis', type: 'dropdown', label: t('tag.controls.emphasis'), options: ['soft', 'solid'], default: 'soft' },
              { id: 'size', type: 'dropdown', label: t('tag.controls.size'), options: ['sm', 'md'], default: 'md' },
              { id: 'dot', type: 'toggle', label: t('tag.controls.dot'), default: false },
              { id: 'icon', type: 'toggle', label: t('tag.controls.icon'), default: false },
              { id: 'removable', type: 'toggle', label: t('tag.controls.removable'), default: false },
              { id: 'selectable', type: 'toggle', label: t('tag.controls.selectable'), default: false },
              { id: 'selected', type: 'toggle', label: t('tag.controls.selected'), default: false },
              { id: 'disabled', type: 'toggle', label: t('tag.controls.disabled'), default: false },
            ]}
          />

          <Section title={t('tag.overview.colorsTitle')}>
            <Content>
              <p className={PROSE}>{t('tag.overview.colorsBody')}</p>
              <div className={ROW}>
                {COLORS.map(color => (
                  <Tag key={color} color={color}>{t(`tag.roles.${color}`)}</Tag>
                ))}
              </div>
              <div className={ROW}>
                {COLORS.map(color => (
                  <Tag key={color} color={color} emphasis="solid">{t(`tag.roles.${color}`)}</Tag>
                ))}
              </div>
              <p className={`${CAPTION} mt-[var(--medo-space-xs)]`}>{t('tag.overview.colorsCaption')}</p>
            </Content>
          </Section>

          <Section title={t('tag.overview.sizesTitle')}>
            <Content>
              <p className={PROSE}>{t('tag.overview.sizesBody')}</p>
              <div className={ROW}>
                <Tag size="sm" color="success" dot>{t('tag.demo.active')}</Tag>
                <span className={CAPTION}>sm · 22px</span>
                <Tag size="md" color="success" dot>{t('tag.demo.active')}</Tag>
                <span className={CAPTION}>md · 28px</span>
              </div>
            </Content>
          </Section>

          <Section title={t('tag.overview.dotIconTitle')}>
            <Content>
              <p className={PROSE}>{t('tag.overview.dotIconBody')}</p>
              <div className={ROW}>
                <Tag color="success" dot>{t('tag.demo.active')}</Tag>
                <Tag color="warning" dot>{t('tag.demo.pending')}</Tag>
                <Tag color="info" icon="event">{t('tag.demo.appointment')}</Tag>
                <Tag color="error" emphasis="solid" dot>{t('tag.demo.expired')}</Tag>
              </div>
            </Content>
          </Section>

          <Section title={t('tag.overview.removableTitle')}>
            <Content>
              <p className={PROSE}>{t('tag.overview.removableBody')}</p>
              <RemovableDemo />
            </Content>
          </Section>

          <Section title={t('tag.overview.selectableTitle')}>
            <Content>
              <p className={PROSE}>{t('tag.overview.selectableBody')}</p>
              <SelectableDemo />
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
          <Section title={t('tag.usage.typesTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('tag.usage.tDisplay')}</li>
                <li>{t('tag.usage.tRemovable')}</li>
                <li>{t('tag.usage.tSelectable')}</li>
              </ul>
              <p className={`${PROSE} mt-[var(--medo-space-sm)]`}>{t('tag.usage.typesNote')}</p>
            </Content>
          </Section>

          <Section title={t('tag.usage.colorTitle')}>
            <Content>
              <p className={PROSE}>{t('tag.usage.colorBody')}</p>
            </Content>
          </Section>

          <Section title={t('tag.usage.textTitle')}>
            <Content>
              <p className={PROSE}>{t('tag.usage.textBody')}</p>
            </Content>
          </Section>

          <Section title={t('tag.usage.sizeTitle')}>
            <Content>
              <p className={PROSE}>{t('tag.usage.sizeBody')}</p>
            </Content>
          </Section>

          <Section title={t('tag.usage.dontTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('tag.usage.dont1')}</li>
                <li>{t('tag.usage.dont2')}</li>
                <li>{t('tag.usage.dont3')}</li>
                <li>{t('tag.usage.dont4')}</li>
                <li>{t('tag.usage.dont5')}</li>
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
        <Section title={t('tag.code.title')}>
          <Content>
            <p className={PROSE}>{t('tag.code.basicDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('tag.code.removeDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{REMOVE_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('tag.code.selectDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{SELECT_CODE}</CodeBlock>
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
          <Section title={t('tag.a11y.meaningTitle')}>
            <Content>
              <p className={PROSE}>{t('tag.a11y.meaningBody')}</p>
            </Content>
          </Section>

          <Section title={t('tag.a11y.controlsTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('tag.a11y.c1')}</li>
                <li>{t('tag.a11y.c2')}</li>
                <li>{t('tag.a11y.c3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('tag.a11y.targetTitle')}>
            <Content>
              <p className={PROSE}>{t('tag.a11y.targetBody')}</p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('tag.page.title')}
      description={t('tag.page.description')}
      tabs={tabs}
    />
  )
}
