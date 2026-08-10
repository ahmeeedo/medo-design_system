import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel, GridWrapper } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { NumberInput } from '../components'

const BASIC_CODE = `import { NumberInput } from '@/components'

<NumberInput label="Anzahl Packungen" defaultValue={1} min={1} max={99} width="180px" />`

const VARIANT_CODE = `{/* Standard: Chevrons rechts */}
<NumberInput label="Menge" variant="chevrons" defaultValue={12} />

{/* Touch: Minus links, Plus rechts */}
<NumberInput label="Menge" variant="plusminus" defaultValue={12} />`

const UNIT_CODE = `<NumberInput label="Gewicht" suffix="kg" defaultValue={72} width="190px" />
<NumberInput label="Rechnungsbetrag" prefix="€" defaultValue="49,90" step={0.1} width="190px" />
<NumberInput label="Rabatt" suffix="%" defaultValue={50} step={5} min={0} max={100} width="190px" />
<NumberInput label="Fallzahl" align="right" defaultValue={1250} width="190px" />`

const STATE_CODE = `<NumberInput label="Belegte Betten" defaultValue={42} max={40}
             error="Der Wert liegt über der Bettenzahl der Station. Korrigieren Sie ihn auf höchstens 40." />

<NumberInput label="Bestellnummer" value="4711" readOnly />
<NumberInput label="Kontingent" value="0" disabled />`

export default function NumberInputPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => (
              <NumberInput
                label={t('numberInput.demo.label')}
                variant={values.variant}
                size={values.size}
                align={values.align === 'auto' ? undefined : values.align}
                prefix={values.unit === 'prefix' ? '€' : undefined}
                suffix={values.unit === 'suffix' ? 'kg' : undefined}
                min={values.limits ? 0 : undefined}
                max={values.limits ? 10 : undefined}
                step={values.decimals ? 0.5 : 1}
                required={values.required}
                optional={values.optional}
                disabled={values.disabled}
                readOnly={values.readOnly}
                hint={values.message === 'hint' ? t('numberInput.demo.hint') : undefined}
                error={values.message === 'error' ? t('numberInput.demo.error') : undefined}
                success={values.message === 'success' ? t('numberInput.demo.success') : undefined}
                fullWidth={values.fullWidth}
                defaultValue={values.decimals ? '2.5' : '3'}
                width={values.fullWidth ? undefined : '220px'}
              />
            )}
            controls={[
              { id: 'variant', type: 'dropdown', label: 'Variant', options: ['chevrons', 'plusminus'], default: 'chevrons' },
              { id: 'size', type: 'dropdown', label: 'Size', options: ['sm', 'md', 'lg'], default: 'md' },
              { id: 'unit', type: 'dropdown', label: 'Unit', options: ['keine', 'prefix', 'suffix'], default: 'keine' },
              { id: 'align', type: 'dropdown', label: 'Align', options: ['auto', 'left', 'center', 'right'], default: 'auto' },
              { id: 'message', type: 'dropdown', label: 'Message', options: ['keine', 'hint', 'error', 'success'], default: 'hint' },
              { id: 'limits', type: 'toggle', label: 'Min/Max', default: false },
              { id: 'decimals', type: 'toggle', label: 'Nachkommastellen', default: false },
              { id: 'required', type: 'toggle', label: 'Required', default: false },
              { id: 'optional', type: 'toggle', label: 'Optional', default: false },
              { id: 'readOnly', type: 'toggle', label: 'Readonly', default: false },
              { id: 'disabled', type: 'toggle', label: 'Disabled', default: false },
              { id: 'fullWidth', type: 'toggle', label: 'Full Width', default: false },
            ]}
          />

          <Section title={t('numberInput.overview.variantsTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('numberInput.overview.variantsBody')}
              </p>
              <GridWrapper>
                <NumberInput label={t('numberInput.variants.chevrons')} variant="chevrons" defaultValue={12} width="190px" />
                <NumberInput label={t('numberInput.variants.plusminus')} variant="plusminus" defaultValue={12} width="190px" />
              </GridWrapper>
            </Content>
          </Section>

          <Section title={t('numberInput.overview.sizesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('numberInput.overview.sizesBody')}
              </p>
              <div className="flex flex-col gap-[var(--medo-space-md)]">
                <NumberInput size="sm" label="sm · 36 px" defaultValue={8} width="190px" />
                <NumberInput size="md" label="md · 40 px" defaultValue={8} width="190px" />
                <NumberInput size="lg" label="lg · 48 px" defaultValue={8} width="190px" />
              </div>
            </Content>
          </Section>

          <Section title={t('numberInput.overview.unitsTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('numberInput.overview.unitsBody')}
              </p>
              <GridWrapper>
                <NumberInput label={t('numberInput.units.suffix')} suffix="kg" defaultValue={72} width="190px" />
                <NumberInput label={t('numberInput.units.prefix')} prefix="€" defaultValue="49,90" step={0.1} width="190px" />
                <NumberInput label={t('numberInput.units.percent')} suffix="%" defaultValue={50} step={5} min={0} max={100} width="190px" />
                <NumberInput label={t('numberInput.units.right')} align="right" defaultValue={1250} width="190px" />
              </GridWrapper>
            </Content>
          </Section>

          <Section title={t('numberInput.overview.statesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('numberInput.overview.statesBody')}
              </p>
              <GridWrapper>
                <NumberInput label={t('numberInput.states.default')} defaultValue={3} width="190px" />
                <NumberInput label={t('numberInput.states.limit')} defaultValue={10} min={0} max={10} hint={t('numberInput.states.limitHint')} width="190px" />
                <NumberInput label={t('numberInput.states.error')} defaultValue={42} max={40} error={t('numberInput.demo.error')} width="190px" />
                <NumberInput label={t('numberInput.states.success')} defaultValue={12} success={t('numberInput.demo.success')} width="190px" />
                <NumberInput label={t('numberInput.states.readonly')} value="4711" readOnly width="190px" />
                <NumberInput label={t('numberInput.states.disabled')} value="0" disabled width="190px" />
              </GridWrapper>
            </Content>
          </Section>

          <Section title={t('numberInput.overview.behaviorTitle')}>
            <Content>
              <ul className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                <li>{t('numberInput.behavior.limits')}</li>
                <li>{t('numberInput.behavior.hold')}</li>
                <li>{t('numberInput.behavior.arrows')}</li>
                <li>{t('numberInput.behavior.wheel')}</li>
              </ul>
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
          <Section title={t('numberInput.usage.whenTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('numberInput.usage.whenBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('numberInput.usage.variantTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('numberInput.usage.variantBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('numberInput.usage.widthTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('numberInput.usage.widthBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('numberInput.usage.doDontTitle')}>
            <Content>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-success-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-success-text)] mb-[var(--medo-space-sm)]">
                    {t('numberInput.usage.doTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('numberInput.usage.do1')}</li>
                    <li>{t('numberInput.usage.do2')}</li>
                    <li>{t('numberInput.usage.do3')}</li>
                  </ul>
                </div>
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-error-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-error-text)] mb-[var(--medo-space-sm)]">
                    {t('numberInput.usage.dontTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('numberInput.usage.dont1')}</li>
                    <li>{t('numberInput.usage.dont2')}</li>
                    <li>{t('numberInput.usage.dont3')}</li>
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
        <Section title={t('numberInput.code.title')}>
          <Content>
            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)]">
              {t('numberInput.code.basicTitle')}
            </p>
            <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('numberInput.code.variantTitle')}
            </p>
            <CodeBlock language="jsx">{VARIANT_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('numberInput.code.unitTitle')}
            </p>
            <CodeBlock language="jsx">{UNIT_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('numberInput.code.stateTitle')}
            </p>
            <CodeBlock language="jsx">{STATE_CODE}</CodeBlock>
          </Content>
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('numberInput.a11y.roleTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('numberInput.a11y.roleBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('numberInput.a11y.keyboardTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('numberInput.a11y.keyboardBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('numberInput.a11y.stepperTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('numberInput.a11y.stepperBody')}
              </p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('numberInput.page.title')}
      description={t('numberInput.page.description')}
      tabs={tabs}
    />
  )
}
