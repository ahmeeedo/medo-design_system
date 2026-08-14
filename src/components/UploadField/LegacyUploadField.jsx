import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function LegacyUploadField({ variant = 'default' }) {
  const { t } = useTranslation()
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setFileName(file.name)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) setFileName(file.name)
  }

  if (variant === 'dropzone') {
    return (
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-[var(--space-3)] w-64 h-32 rounded-[var(--radius-lg)] border-2 border-dashed cursor-pointer transition-colors duration-[var(--duration-fast)] ${
          isDragging
            ? 'border-[var(--color-brand-primary-500)] bg-[var(--color-brand-primary-100,#eff6ff)]'
            : 'border-[var(--color-border)] bg-[var(--surface_100)] hover:border-[var(--color-brand-primary-500)]'
        }`}
      >
        <input ref={inputRef} type="file" className="hidden" onChange={handleFileChange} />
        <span className="material-symbols-rounded text-[var(--color-text-secondary)]" style={{ fontSize: '1.5rem' }}>upload</span>
        <span className="text-sm text-[var(--color-text-secondary)]">
          {fileName ?? t('uploadField.dropzone.hint')}
        </span>
      </div>
    )
  }

  if (variant === 'preview') {
    return (
      <div className="flex flex-col items-start gap-[var(--space-2)]">
        <input ref={inputRef} type="file" className="hidden" onChange={handleFileChange} />
        <button
          onClick={() => inputRef.current?.click()}
          className="px-[var(--space-4)] py-[var(--space-2)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm text-[var(--color-text-primary)] bg-[var(--surface_100)] hover:bg-[var(--surface_200)] transition-colors duration-[var(--duration-fast)] cursor-pointer"
        >
          {t('uploadField.button.label')}
        </button>
        {fileName && (
          <span className="text-sm text-[var(--color-text-secondary)]">{fileName}</span>
        )}
      </div>
    )
  }

  // default
  return (
    <div>
      <input ref={inputRef} type="file" className="hidden" onChange={handleFileChange} />
      <button
        onClick={() => inputRef.current?.click()}
        className="px-[var(--space-4)] py-[var(--space-2)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm text-[var(--color-text-primary)] bg-[var(--surface_100)] hover:bg-[var(--surface_200)] transition-colors duration-[var(--duration-fast)] cursor-pointer"
      >
        {t('uploadField.button.label')}
      </button>
    </div>
  )
}
