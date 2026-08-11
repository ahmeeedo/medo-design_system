import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Pagination } from '../components'

const NUMBERS_CODE = `import { Pagination } from '@/components'

{/* Der Normalfall unter einer Liste oder Kartenmenge */}
<Pagination page={seite} pageCount={12} onPageChange={setSeite} showFirstLast />

{/* siblings bestimmt, wie viele Nachbarn neben der aktuellen Seite stehen */}
<Pagination page={seite} pageCount={40} siblings={2} onPageChange={setSeite} />`

const BAR_CODE = `{/* Die volle Leiste gehört unter eine Tabelle */}
<Pagination
  variant="bar"
  page={seite}
  pageSize={groesse}
  totalItems={312}
  pageSizeOptions={[10, 20, 50, 100]}
  onPageChange={setSeite}
  onPageSizeChange={(n) => { setGroesse(n); setSeite(1) }}
  showJump
/>`

const COMPACT_CODE = `{/* Für schmale Spalten und Mobil */}
<Pagination variant="compact" size="sm" page={seite} pageCount={12} onPageChange={setSeite} />`

const UNCONTROLLED_CODE = `{/* Ohne page arbeitet die Komponente ungesteuert weiter */}
<Pagination defaultPage={3} totalItems={312} pageSize={20} ariaLabel="Suchtreffer" />`

function PaginationDemo({ values, ariaLabel }) {
  const [page, setPage] = useState(4)
  const [pageSize, setPageSize] = useState(20)

  return (
    <div className="w-full max-w-[720px] flex justify-center">
      <Pagination
        variant={values.variant}
        size={values.size}
        page={page}
        onPageChange={setPage}
        pageCount={values.variant === 'bar' ? undefined : Number(values.seiten)}
        totalItems={values.variant === 'bar' ? 312 : undefined}
        pageSize={pageSize}
        siblings={Number(values.siblings)}
        showFirstLast={values.showFirstLast}
        showJump={values.showJump}
        onPageSizeChange={
          values.pageSize ? (n) => { setPageSize(n); setPage(1) } : undefined
        }
        ariaLabel={ariaLabel}
      />
    </div>
  )
}

export default function PaginationPage() {
  const { t } = useTranslation()
  const [barPage, setBarPage] = useState(2)
  const [barSize, setBarSize] = useState(20)

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => (
              <PaginationDemo values={values} ariaLabel={t('pagination.demo.ariaLabel')} />
            )}
            controls={[
              { id: 'variant', type: 'dropdown', label: 'Variant', options: ['numbers', 'compact', 'bar'], default: 'numbers' },
              { id: 'size', type: 'dropdown', label: 'Size', options: ['sm', 'md'], default: 'md' },
              { id: 'seiten', type: 'dropdown', label: 'Seiten', options: ['5', '12', '40'], default: '12' },
              { id: 'siblings', type: 'dropdown', label: 'Siblings', options: ['0', '1', '2'], default: '1' },
              { id: 'showFirstLast', type: 'toggle', label: 'First / Last', default: false },
              { id: 'pageSize', type: 'toggle', label: 'Einträge pro Seite', default: true },
              { id: 'showJump', type: 'toggle', label: 'Gehe zu', default: false },
            ]}
          />

          <Section title={t('pagination.overview.variantsTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('pagination.overview.variantsBody')}
              </p>
              <div className="flex flex-col gap-[var(--medo-space-xl)]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    numbers
                  </p>
                  <Pagination defaultPage={4} pageCount={12} showFirstLast ariaLabel={t('pagination.demo.ariaLabel')} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    compact
                  </p>
                  <Pagination variant="compact" defaultPage={3} pageCount={12} ariaLabel={t('pagination.demo.ariaLabel')} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    bar
                  </p>
                  <Pagination
                    variant="bar"
                    page={barPage}
                    pageSize={barSize}
                    pageSizeOptions={[10, 20, 50, 100]}
                    totalItems={312}
                    onPageChange={setBarPage}
                    onPageSizeChange={(n) => { setBarSize(n); setBarPage(1) }}
                    showJump
                    ariaLabel={t('pagination.demo.ariaLabel')}
                  />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('pagination.overview.windowTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('pagination.overview.windowBody')}
              </p>
              <div className="flex flex-col gap-[var(--medo-space-lg)]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('pagination.window.few')}
                  </p>
                  <Pagination defaultPage={3} pageCount={5} ariaLabel={t('pagination.demo.ariaLabel')} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('pagination.window.start')}
                  </p>
                  <Pagination defaultPage={1} pageCount={40} ariaLabel={t('pagination.demo.ariaLabel')} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('pagination.window.middle')}
                  </p>
                  <Pagination defaultPage={20} pageCount={40} ariaLabel={t('pagination.demo.ariaLabel')} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('pagination.window.siblings')}
                  </p>
                  <Pagination defaultPage={20} pageCount={40} siblings={2} ariaLabel={t('pagination.demo.ariaLabel')} />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('pagination.overview.statesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('pagination.overview.statesBody')}
              </p>
              <div className="flex flex-col gap-[var(--medo-space-lg)]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('pagination.states.first')}
                  </p>
                  <Pagination defaultPage={1} pageCount={12} showFirstLast ariaLabel={t('pagination.demo.ariaLabel')} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('pagination.states.last')}
                  </p>
                  <Pagination defaultPage={12} pageCount={12} showFirstLast ariaLabel={t('pagination.demo.ariaLabel')} />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('pagination.overview.sizesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('pagination.overview.sizesBody')}
              </p>
              <div className="flex flex-col gap-[var(--medo-space-lg)]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    sm · 32 px
                  </p>
                  <Pagination size="sm" defaultPage={4} pageCount={12} ariaLabel={t('pagination.demo.ariaLabel')} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    md · 40 px
                  </p>
                  <Pagination defaultPage={4} pageCount={12} ariaLabel={t('pagination.demo.ariaLabel')} />
                </div>
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
          <Section title={t('pagination.usage.whenTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('pagination.usage.whenBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('pagination.usage.positionTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('pagination.usage.positionBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('pagination.usage.pageSizeTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('pagination.usage.pageSizeBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('pagination.usage.numeralsTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('pagination.usage.numeralsBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('pagination.usage.doDontTitle')}>
            <Content>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-success-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-success-text)] mb-[var(--medo-space-sm)]">
                    {t('pagination.usage.doTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('pagination.usage.do1')}</li>
                    <li>{t('pagination.usage.do2')}</li>
                    <li>{t('pagination.usage.do3')}</li>
                  </ul>
                </div>
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-error-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-error-text)] mb-[var(--medo-space-sm)]">
                    {t('pagination.usage.dontTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('pagination.usage.dont1')}</li>
                    <li>{t('pagination.usage.dont2')}</li>
                    <li>{t('pagination.usage.dont3')}</li>
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
        <Section title={t('pagination.code.title')}>
          <Content>
            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)]">
              {t('pagination.code.numbersTitle')}
            </p>
            <CodeBlock language="jsx">{NUMBERS_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('pagination.code.barTitle')}
            </p>
            <CodeBlock language="jsx">{BAR_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('pagination.code.compactTitle')}
            </p>
            <CodeBlock language="jsx">{COMPACT_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('pagination.code.uncontrolledTitle')}
            </p>
            <CodeBlock language="jsx">{UNCONTROLLED_CODE}</CodeBlock>
          </Content>
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('pagination.a11y.navTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('pagination.a11y.navBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('pagination.a11y.currentTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('pagination.a11y.currentBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('pagination.a11y.targetTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('pagination.a11y.targetBody')}
              </p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('pagination.page.title')}
      description={t('pagination.page.description')}
      tabs={tabs}
    />
  )
}
