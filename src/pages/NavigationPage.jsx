import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Breadcrumb, Pagination } from '../components'

const BREADCRUMB_CODE = `import { Breadcrumb } from '@/components'

<Breadcrumb items={[
  { label: 'Home',       href: '/' },
  { label: 'Projekte',   href: '/projekte' },
  { label: 'Design System' },   // letztes Item: kein href
]} />`

const PAGINATION_CONTROLLED_CODE = `import { useState } from 'react'
import { Pagination } from '@/components'

function ProductList() {
  const [page, setPage] = useState(1)

  return (
    <>
      <ProductGrid page={page} />
      <Pagination
        current={page}
        total={12}
        onChange={(p) => setPage(p)}
      />
    </>
  )
}`

const PAGINATION_FEW_CODE = `{/* <= 7 Seiten: alle Seitenzahlen, kein Ellipsis */}
<Pagination current={3} total={5} onChange={setPage} />

{/* > 7 Seiten: Ellipsis-Muster, abhängig von current */}
<Pagination current={6} total={20} onChange={setPage} />`

export default function NavigationPage() {
  const { t } = useTranslation()

  const [page, setPage] = useState(3)

  const doDont = ['1', '2', '3'].map(n => ({ do: `do${n}`, dont: `dont${n}` }))

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <Section title={t('navigation.overview.breadcrumbTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-3)]">
                {t('navigation.overview.breadcrumbBody')}
              </p>
              <ol className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)] mb-[var(--space-6)]">
                {['ban1', 'ban2', 'ban3', 'ban4'].map(k => (
                  <li key={k} className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t(`navigation.overview.${k}`)}
                  </li>
                ))}
              </ol>
            </Content>
            <div className="p-[var(--space-4)] bg-[var(--surface-container_100)] rounded-[var(--radius-lg)] border border-[var(--border-subtle-100)]">
              <Breadcrumb items={[
                { label: 'Home',         href: '#' },
                { label: 'Projekte',     href: '#' },
                { label: 'Design System', href: '#' },
                { label: 'Komponenten' },
              ]} />
            </div>
          </Section>

          <Section title={t('navigation.overview.paginationTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-3)]">
                {t('navigation.overview.paginationBody')}
              </p>
              <ol className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)] mb-[var(--space-6)]">
                {['pan1', 'pan2', 'pan3', 'pan4'].map(k => (
                  <li key={k} className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t(`navigation.overview.${k}`)}
                  </li>
                ))}
              </ol>
            </Content>
            <div className="p-[var(--space-4)] bg-[var(--surface-container_100)] rounded-[var(--radius-lg)] border border-[var(--border-subtle-100)] flex flex-col gap-[var(--space-3)]">
              <div className="text-xs text-[var(--color-text-secondary)]">{t('navigation.overview.paginationDemoLabel')} {page} / 10</div>
              <Pagination current={page} total={10} onChange={setPage} />
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
          <Section title={t('navigation.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('navigation.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('navigation.usage.whenBreadcrumbTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('navigation.usage.whenBreadcrumbBody')}
              </p>
            </Content>
          </Section>

          <Section title={t('navigation.usage.whenPaginationTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('navigation.usage.whenPaginationBody')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('navigation.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ do: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <span>{t(`navigation.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('navigation.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('navigation.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ dont: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <span>{t(`navigation.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('navigation.usage.dontNote')}
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
          <Section title={t('navigation.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('navigation.code.breadcrumbTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('navigation.code.breadcrumbDesc')}
              </p>
              <CodeBlock language="jsx">{BREADCRUMB_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('navigation.code.paginationControlledTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('navigation.code.paginationControlledDesc')}
              </p>
              <CodeBlock language="jsx">{PAGINATION_CONTROLLED_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('navigation.code.paginationFewTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('navigation.code.paginationFewDesc')}
              </p>
              <CodeBlock language="jsx">{PAGINATION_FEW_CODE}</CodeBlock>
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
          <Section title={t('navigation.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('navigation.a11y.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('navigation.a11y.keyboardTitle')}>
            <div className="border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden mb-[var(--space-6)]">
              {['k1', 'k2', 'k3'].map((k, i) => (
                <div key={k} className={`flex items-center gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`navigation.a11y.${k}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              {[
                { title: t('navigation.a11y.navTitle'),     body: t('navigation.a11y.navBody') },
                { title: t('navigation.a11y.currentTitle'), body: t('navigation.a11y.currentBody') },
                { title: t('navigation.a11y.srTitle'),      body: t('navigation.a11y.srBody') },
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
      title="Navigation"
      description={t('navigation.page.description')}
      tabs={tabs}
    />
  )
}
