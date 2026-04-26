import { DocSection } from '../docs/DocSection'
import { TypeRow } from '../docs/helpers'

export default function TypographyPage() {
  return (
    <DocSection title="Typography" description="Schrift-Scale von Display bis Label. Fonts: DM Sans (Sans) + DM Mono (Mono).">
      <TypeRow name="Display 2XL" detail="60px / 600 / −0.03em"  style={{ fontSize: 'var(--text-6xl)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.2 }} />
      <TypeRow name="Display XL"  detail="48px / 600 / −0.03em"  style={{ fontSize: 'var(--text-5xl)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.2 }} />
      <TypeRow name="Heading XL"  detail="36px / 600 / −0.015em" style={{ fontSize: 'var(--text-4xl)', fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.35 }} />
      <TypeRow name="Heading LG"  detail="30px / 600"            style={{ fontSize: 'var(--text-3xl)', fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.35 }} />
      <TypeRow name="Heading MD"  detail="24px / 600"            style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing: '-0.015em' }} />
      <TypeRow name="Heading SM"  detail="20px / 500"            style={{ fontSize: 'var(--text-xl)',  fontWeight: 500 }} />
      <TypeRow name="Body LG"     detail="17px / 400 / 1.65"     style={{ fontSize: 'var(--text-lg)',  lineHeight: 1.65 }} />
      <TypeRow name="Body MD"     detail="15px / 400 / 1.5"      style={{ fontSize: 'var(--text-md)',  lineHeight: 1.5 }} />
      <TypeRow name="Body SM"     detail="13px / 400"            style={{ fontSize: 'var(--text-sm)',  color: 'var(--color-text-secondary)' }} />
      <TypeRow name="Label MD"    detail="13px / 500"            style={{ fontSize: 'var(--text-sm)',  fontWeight: 500 }} />
      <TypeRow name="Label SM"    detail="11px / 600 / +0.12em"  style={{ fontSize: 'var(--text-xs)',  fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }} />
      <TypeRow name="Code"        detail="13px mono"             style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }} />
    </DocSection>
  )
}