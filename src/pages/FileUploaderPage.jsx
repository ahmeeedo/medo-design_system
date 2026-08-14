import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { FileUploader } from '../components'

const BASIC_CODE = `import { FileUploader } from '@/components'

{/* Die Komponente hält keinen Zustand — files kommt von außen, sie meldet nur */}
<FileUploader
  label="Gewerbeschein"
  helper="Als PDF oder Foto, damit wir Ihre Zulassung prüfen können."
  accept=".pdf,.jpg,.png"
  maxSize={5 * 1024 * 1024}
  files={dateien}
  onFilesAdded={(neu) => setDateien(dateien.concat(neu))}
  onRemove={(f) => setDateien(dateien.filter((x) => x !== f))}
/>`

const COMPACT_CODE = `{/* compact ersetzt die Fläche durch eine Zeile — für genau eine Datei im dichten Formular */}
<FileUploader
  compact
  multiple={false}
  accept=".pdf"
  maxSize={2 * 1024 * 1024}
  files={dateien}
  onFilesAdded={setDateien}
  onRemove={() => setDateien([])}
/>`

const STATUS_CODE = `{/* Der Aufrufer führt den Zustand je Datei: uploading mit progress, done, error mit Grund */}
const dateien = [
  { id: 1, name: 'gewerbeschein.pdf', size: 284000, status: 'done' },
  { id: 2, name: 'zulassung.pdf', size: 1840000, status: 'uploading', progress: 62 },
  { id: 3, name: 'scan.tiff', size: 8400000, status: 'error', error: 'Datei ist größer als 5,0 MB.' },
]`

const PREVIEW_CODE = `{/* preview zeigt die 40px-Vorschau statt des Dokument-Icons */}
{ id: 4, name: 'ladenfront.jpg', size: 412000, status: 'done', preview: bildUrl }`

const bodyClass =
  '[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]'
const labelClass =
  '[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]'
const codeLabelClass =
  '[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)]'

const MB = 1024 * 1024

function statusFiles(t) {
  return [
    { id: 1, name: 'gewerbeschein.pdf', size: 284000, status: 'done' },
    { id: 2, name: 'zulassung-2026.pdf', size: 1840000, status: 'uploading', progress: 62 },
    { id: 3, name: 'scan.tiff', size: 8400000, status: 'error', error: t('fileUploader.demo.tooLarge') },
  ]
}

/* Der Aufrufer führt die Liste — hier genügt lokaler Zustand für die Vorschau. */
function FileUploaderDemo({ values, t }) {
  const [files, setFiles] = useState(() => (values.withFiles ? statusFiles(t) : []))

  return (
    <div className="w-full max-w-[560px]">
      <FileUploader
        compact={values.compact}
        disabled={values.disabled}
        multiple={values.multiple}
        accept={values.accept ? '.pdf,.jpg,.png' : undefined}
        maxSize={values.maxSize ? 5 * MB : undefined}
        label={values.label ? t('fileUploader.demo.label') : undefined}
        helper={values.helper ? t('fileUploader.demo.helper') : undefined}
        files={values.withFiles ? (files.length ? files : statusFiles(t)) : files}
        onFilesAdded={(neu) => setFiles((prev) => (values.multiple ? prev.concat(neu) : neu))}
        onRemove={
          values.removable ? (f) => setFiles((prev) => prev.filter((x) => x !== f)) : undefined
        }
      />
    </div>
  )
}

export default function FileUploaderPage() {
  const { t } = useTranslation()
  const [files, setFiles] = useState([])

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => <FileUploaderDemo values={values} t={t} />}
            controls={[
              { id: 'compact', type: 'toggle', label: 'Compact', default: false },
              { id: 'label', type: 'toggle', label: 'Label', default: true },
              { id: 'helper', type: 'toggle', label: 'Helper', default: true },
              { id: 'accept', type: 'toggle', label: 'Accept', default: true },
              { id: 'maxSize', type: 'toggle', label: 'Max size', default: true },
              { id: 'multiple', type: 'toggle', label: 'Multiple', default: true },
              { id: 'withFiles', type: 'toggle', label: 'Mit Dateien', default: true },
              { id: 'removable', type: 'toggle', label: 'Entfernbar', default: true },
              { id: 'disabled', type: 'toggle', label: 'Disabled', default: false },
            ]}
          />

          <Section title={t('fileUploader.overview.zoneTitle')}>
            <Content>
              <p className={`${bodyClass} mb-[var(--medo-space-lg)]`}>{t('fileUploader.overview.zoneBody')}</p>
              <div className="max-w-[560px]">
                <FileUploader
                  label={t('fileUploader.demo.label')}
                  helper={t('fileUploader.demo.helper')}
                  accept=".pdf,.jpg,.png"
                  maxSize={5 * MB}
                  files={files}
                  onFilesAdded={(neu) => setFiles(files.concat(neu))}
                  onRemove={(f) => setFiles(files.filter((x) => x !== f))}
                />
              </div>
            </Content>
          </Section>

          <Section title={t('fileUploader.overview.compactTitle')}>
            <Content>
              <p className={`${bodyClass} mb-[var(--medo-space-lg)]`}>{t('fileUploader.overview.compactBody')}</p>
              <div className="max-w-[560px]">
                <FileUploader
                  compact
                  multiple={false}
                  label={t('fileUploader.demo.compactLabel')}
                  accept=".pdf"
                  maxSize={2 * MB}
                />
              </div>
            </Content>
          </Section>

          <Section title={t('fileUploader.overview.statusTitle')}>
            <Content>
              <p className={`${bodyClass} mb-[var(--medo-space-lg)]`}>{t('fileUploader.overview.statusBody')}</p>
              <div className="max-w-[560px]">
                <FileUploader files={statusFiles(t)} onRemove={() => {}} accept=".pdf,.jpg,.png" maxSize={5 * MB} />
              </div>
            </Content>
          </Section>

          <Section title={t('fileUploader.overview.statesTitle')}>
            <Content>
              <p className={`${bodyClass} mb-[var(--medo-space-lg)]`}>{t('fileUploader.overview.statesBody')}</p>
              <div className="flex flex-col gap-[var(--medo-space-xl)] max-w-[560px]">
                <div>
                  <p className={labelClass}>{t('fileUploader.states.empty')}</p>
                  <FileUploader accept=".pdf,.jpg,.png" maxSize={5 * MB} />
                </div>
                <div>
                  <p className={labelClass}>{t('fileUploader.states.disabled')}</p>
                  <FileUploader disabled accept=".pdf,.jpg,.png" maxSize={5 * MB} />
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
          <Section title={t('fileUploader.usage.whenTitle')}>
            <Content>
              <p className={bodyClass}>{t('fileUploader.usage.whenBody')}</p>
            </Content>
          </Section>
          <Section title={t('fileUploader.usage.stateTitle')}>
            <Content>
              <p className={bodyClass}>{t('fileUploader.usage.stateBody')}</p>
            </Content>
          </Section>
          <Section title={t('fileUploader.usage.checkTitle')}>
            <Content>
              <p className={bodyClass}>{t('fileUploader.usage.checkBody')}</p>
            </Content>
          </Section>
          <Section title={t('fileUploader.usage.rowsTitle')}>
            <Content>
              <p className={bodyClass}>{t('fileUploader.usage.rowsBody')}</p>
            </Content>
          </Section>
          <Section title={t('fileUploader.usage.doDontTitle')}>
            <Content>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-success-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-success-text)] mb-[var(--medo-space-sm)]">
                    {t('fileUploader.usage.doTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('fileUploader.usage.do1')}</li>
                    <li>{t('fileUploader.usage.do2')}</li>
                    <li>{t('fileUploader.usage.do3')}</li>
                  </ul>
                </div>
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-error-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-error-text)] mb-[var(--medo-space-sm)]">
                    {t('fileUploader.usage.dontTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('fileUploader.usage.dont1')}</li>
                    <li>{t('fileUploader.usage.dont2')}</li>
                    <li>{t('fileUploader.usage.dont3')}</li>
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
        <Section title={t('fileUploader.code.title')}>
          <Content>
            <p className={codeLabelClass}>{t('fileUploader.code.basicTitle')}</p>
            <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>

            <p className={`${codeLabelClass} mt-[var(--medo-space-lg)]`}>{t('fileUploader.code.compactTitle')}</p>
            <CodeBlock language="jsx">{COMPACT_CODE}</CodeBlock>

            <p className={`${codeLabelClass} mt-[var(--medo-space-lg)]`}>{t('fileUploader.code.statusTitle')}</p>
            <CodeBlock language="jsx">{STATUS_CODE}</CodeBlock>

            <p className={`${codeLabelClass} mt-[var(--medo-space-lg)]`}>{t('fileUploader.code.previewTitle')}</p>
            <CodeBlock language="jsx">{PREVIEW_CODE}</CodeBlock>
          </Content>
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('fileUploader.a11y.keyboardTitle')}>
            <Content>
              <p className={bodyClass}>{t('fileUploader.a11y.keyboardBody')}</p>
            </Content>
          </Section>
          <Section title={t('fileUploader.a11y.namingTitle')}>
            <Content>
              <p className={bodyClass}>{t('fileUploader.a11y.namingBody')}</p>
            </Content>
          </Section>
          <Section title={t('fileUploader.a11y.errorTitle')}>
            <Content>
              <p className={bodyClass}>{t('fileUploader.a11y.errorBody')}</p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout title={t('fileUploader.page.title')} description={t('fileUploader.page.description')} tabs={tabs} />
  )
}
