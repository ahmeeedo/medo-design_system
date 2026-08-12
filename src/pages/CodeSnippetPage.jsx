import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { CodeSnippet } from '../components'

const INLINE_CODE = `import { CodeSnippet } from '@/components'

Führen Sie <CodeSnippet variant="inline">npm install</CodeSnippet> aus.

{/* Eine Zeile mit Kopieren-Schaltfläche */}
<CodeSnippet variant="single" code="npx medo init --template=app" />`

const BLOCK_CODE = `{/* block: Kopfleiste mit Sprach-Label, Zeilennummern, klappt ab acht Zeilen ein */}
<CodeSnippet language="tsx" code={beispiel} />

{/* Ohne Zeilennummern und ohne Syntaxfarben */}
<CodeSnippet language="json" showLineNumbers={false} highlight={false} code={daten} />

{/* Frühere Einklappgrenze */}
<CodeSnippet language="tsx" collapseAfter={4} code={beispiel} />`

const TERMINAL_CODE = `{/* terminal: drei Punkte statt Sprach-Label, $-Prompts in Grün */}
<CodeSnippet variant="terminal" code={'$ medo build\\n# Fertig in 2.4s\\n$ medo deploy'} />`

const COPY_CODE = `{/* Die Beschriftungen sind frei; onCopy meldet den kopierten Text */}
<CodeSnippet
  language="bash"
  copyLabel="Befehl kopieren"
  copiedLabel="In der Zwischenablage"
  onCopy={(code) => protokolliere(code)}
  code={befehl}
/>`

const SAMPLE = `import { Vertrag } from '@/modell'

// Beitrag für das laufende Jahr berechnen
export function beitragBerechnen(vertrag) {
  const basis = vertrag.summe * 0.014
  const nachlass = vertrag.laufzeit > 3 ? 0.1 : 0
  return Math.round(basis * (1 - nachlass) * 100) / 100
}

export const standardVertrag = {
  nummer: 'VN-2026-0184',
  summe: 1500000,
  laufzeit: 5,
  faellig: '04.08.2026',
}`

const SHORT_SAMPLE = `const vertrag = {
  nummer: 'VN-2026-0184',
  beitrag: 1234.56,
}`

const TERMINAL_SAMPLE = `$ medo build
# Fertig in 2.4s
$ medo deploy --umgebung=produktion
# 24 Dateien übertragen`

export default function CodeSnippetPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => (
              <div className="w-full max-w-[620px]">
                {values.variant === 'inline' ? (
                  <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text)] [line-height:var(--medo-leading-relaxed)]">
                    {t('codeSnippet.demo.inlineBefore')}{' '}
                    <CodeSnippet variant="inline">npm install</CodeSnippet>{' '}
                    {t('codeSnippet.demo.inlineAfter')}
                  </p>
                ) : (
                  <CodeSnippet
                    variant={values.variant}
                    code={
                      values.variant === 'terminal'
                        ? TERMINAL_SAMPLE
                        : values.variant === 'single'
                          ? 'npx medo init --template=app'
                          : values.lang
                            ? SAMPLE
                            : SHORT_SAMPLE
                    }
                    language={values.sprache ? 'tsx' : undefined}
                    showLineNumbers={values.showLineNumbers}
                    highlight={values.highlight}
                    collapseAfter={Number(values.collapseAfter)}
                  />
                )}
              </div>
            )}
            controls={[
              { id: 'variant', type: 'dropdown', label: 'Variant', options: ['block', 'inline', 'single', 'terminal'], default: 'block' },
              { id: 'collapseAfter', type: 'dropdown', label: 'Collapse After', options: ['4', '8', '20'], default: '8' },
              { id: 'sprache', type: 'toggle', label: 'Language', default: true },
              { id: 'showLineNumbers', type: 'toggle', label: 'Line Numbers', default: true },
              { id: 'highlight', type: 'toggle', label: 'Highlight', default: true },
              { id: 'lang', type: 'toggle', label: 'Langes Beispiel', default: true },
            ]}
          />

          <Section title={t('codeSnippet.overview.variantsTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('codeSnippet.overview.variantsBody')}
              </p>
              <div className="flex flex-col gap-[var(--medo-space-xl)] max-w-[620px]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    inline
                  </p>
                  <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text)] [line-height:var(--medo-leading-relaxed)]">
                    {t('codeSnippet.demo.inlineBefore')}{' '}
                    <CodeSnippet variant="inline">npm install</CodeSnippet>{' '}
                    {t('codeSnippet.demo.inlineAfter')}
                  </p>
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    single
                  </p>
                  <CodeSnippet variant="single" code="npx medo init --template=app" />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    block
                  </p>
                  <CodeSnippet language="tsx" code={SAMPLE} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    terminal
                  </p>
                  <CodeSnippet variant="terminal" code={TERMINAL_SAMPLE} />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('codeSnippet.overview.highlightTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('codeSnippet.overview.highlightBody')}
              </p>
              <div className="grid grid-cols-2 max-[1024px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    highlight
                  </p>
                  <CodeSnippet language="tsx" code={SHORT_SAMPLE} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    highlight={'{false}'}
                  </p>
                  <CodeSnippet language="tsx" highlight={false} code={SHORT_SAMPLE} />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('codeSnippet.overview.numbersTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('codeSnippet.overview.numbersBody')}
              </p>
              <div className="max-w-[620px]">
                <CodeSnippet language="json" showLineNumbers={false} code={SHORT_SAMPLE} />
              </div>
            </Content>
          </Section>

          <Section title={t('codeSnippet.overview.collapseTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('codeSnippet.overview.collapseBody')}
              </p>
              <div className="max-w-[620px]">
                <CodeSnippet language="tsx" collapseAfter={4} code={SAMPLE} />
              </div>
            </Content>
          </Section>

          <Section title={t('codeSnippet.overview.copyTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('codeSnippet.overview.copyBody')}
              </p>
              <div className="max-w-[620px]">
                <CodeSnippet
                  variant="single"
                  code="npx medo init --template=app"
                  copyLabel={t('codeSnippet.demo.copyLabel')}
                  copiedLabel={t('codeSnippet.demo.copiedLabel')}
                />
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
          <Section title={t('codeSnippet.usage.whenTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('codeSnippet.usage.whenBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('codeSnippet.usage.darkTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('codeSnippet.usage.darkBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('codeSnippet.usage.colorTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('codeSnippet.usage.colorBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('codeSnippet.usage.copyTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('codeSnippet.usage.copyBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('codeSnippet.usage.doDontTitle')}>
            <Content>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-success-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-success-text)] mb-[var(--medo-space-sm)]">
                    {t('codeSnippet.usage.doTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('codeSnippet.usage.do1')}</li>
                    <li>{t('codeSnippet.usage.do2')}</li>
                    <li>{t('codeSnippet.usage.do3')}</li>
                  </ul>
                </div>
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-error-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-error-text)] mb-[var(--medo-space-sm)]">
                    {t('codeSnippet.usage.dontTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('codeSnippet.usage.dont1')}</li>
                    <li>{t('codeSnippet.usage.dont2')}</li>
                    <li>{t('codeSnippet.usage.dont3')}</li>
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
        <Section title={t('codeSnippet.code.title')}>
          <Content>
            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)]">
              {t('codeSnippet.code.inlineTitle')}
            </p>
            <CodeBlock language="jsx">{INLINE_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('codeSnippet.code.blockTitle')}
            </p>
            <CodeBlock language="jsx">{BLOCK_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('codeSnippet.code.terminalTitle')}
            </p>
            <CodeBlock language="jsx">{TERMINAL_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('codeSnippet.code.copyTitle')}
            </p>
            <CodeBlock language="jsx">{COPY_CODE}</CodeBlock>
          </Content>
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('codeSnippet.a11y.liveTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('codeSnippet.a11y.liveBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('codeSnippet.a11y.gutterTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('codeSnippet.a11y.gutterBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('codeSnippet.a11y.contrastTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('codeSnippet.a11y.contrastBody')}
              </p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('codeSnippet.page.title')}
      description={t('codeSnippet.page.description')}
      tabs={tabs}
    />
  )
}
