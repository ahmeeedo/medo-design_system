import { useState } from 'react'
import { DocsLayout } from './docs/DocsLayout'
import { DocSection, SubSection, Row, Grid2, TokenChip } from './docs/DocSection'
import {
  Button, Input, Textarea, Select, InputWithAddon,
  Toggle, Checkbox, Radio,
  Badge, Tag,
  Alert, Toast,
  Card,
  Table,
  Tabs,
  Avatar, AvatarGroup,
  Modal,
  Accordion,
  Progress,
  Skeleton, SkeletonCard,
  Menu,
  Breadcrumb, Pagination, StatCard,
} from './components'
import styles from './App.module.css'

// ── Helper ──────────────────────────────────────────────────────────
function Swatch({ bg, label, border = false }) {
  return (
    <div className={styles.swatch}>
      <div className={styles.swatchBox} style={{ background: bg, border: border ? '1px solid #e5e5e5' : undefined }} />
      <div className={styles.swatchLabel}>{label}</div>
    </div>
  )
}

function TypeRow({ name, detail, style }) {
  return (
    <div className={styles.typeRow}>
      <div className={styles.typeMeta}>
        <div className={styles.typeName}>{name}</div>
        <div className={styles.typeDetail}>{detail}</div>
      </div>
      <div style={style}>The quick brown fox</div>
    </div>
  )
}

function SpacingRow({ token, px }) {
  const pxNum = parseInt(px)
  return (
    <div className={styles.spacingRow}>
      <div className={styles.spacingBar} style={{ width: Math.min(pxNum * 1.5, 220) }} />
      <div className={styles.spacingMeta}>
        <TokenChip>--space-{token}</TokenChip>
        <span className={styles.spacingPx}>{px}</span>
        <span className={styles.spacingBase}>{pxNum / 4}×</span>
      </div>
    </div>
  )
}

function ShadowBox({ label, shadow, border }) {
  return (
    <div className={styles.shadowItem}>
      <div className={styles.shadowBox} style={{ boxShadow: shadow, border: border ? '1px solid var(--color-border)' : undefined }} />
      <span className={styles.shadowLabel}>{label}</span>
    </div>
  )
}

function RadiusBox({ label, px }) {
  return (
    <div className={styles.radiusItem}>
      <div className={styles.radiusBox} style={{ borderRadius: px }} />
      <span className={styles.radiusLabel}>{label}<br />{px}</span>
    </div>
  )
}

// ── Data ────────────────────────────────────────────────────────────
const TABLE_COLS = [
  { key: 'name',    label: 'Name',    render: (r) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Avatar size="sm" initials={r.initials} color={r.color} textColor={r.textColor} />
      <div>
        <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{r.fullName}</div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{r.email}</div>
      </div>
    </div>
  )},
  { key: 'status', label: 'Status', render: (r) => <Badge variant={r.badgeVariant} dot>{r.status}</Badge> },
  { key: 'role',   label: 'Rolle' },
  { key: 'date',   label: 'Erstellt', render: (r) => <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{r.date}</span> },
  { key: 'action', label: '',       render: () => <Button variant="ghost" size="sm">Bearbeiten</Button> },
]

const TABLE_ROWS = [
  { id: 1, fullName: 'Anna Klein',  email: 'a.klein@example.com',   initials: 'AK', color: '#E5E5E5', textColor: '#171717', status: 'Aktiv',      badgeVariant: 'success', role: 'Admin',  date: '12. Apr 2025' },
  { id: 2, fullName: 'Max Bauer',   email: 'm.bauer@example.com',   initials: 'MB', color: '#DBEAFE', textColor: '#1D4ED8', status: 'Ausstehend', badgeVariant: 'warning', role: 'Editor', date: '3. Mai 2025' },
  { id: 3, fullName: 'Lena Müller', email: 'l.mueller@example.com', initials: 'LM', color: '#FCE7F3', textColor: '#BE185D', status: 'Inaktiv',    badgeVariant: 'neutral', role: 'Viewer', date: '20. Jan 2025' },
]

const ACCORDION_ITEMS = [
  { id: 'a1', title: 'Was ist ein Design Token?', content: 'Design Tokens sind benannte Variablen, die Design-Entscheidungen systemweit speichern. Sie bilden die Brücke zwischen Design und Code.' },
  { id: 'a2', title: 'Wie importiere ich tokens.json in Figma?', content: 'Installiere das Plugin „Tokens Studio for Figma". Öffne es, wähle Import und lade die tokens.json Datei. Alle Tokens werden automatisch als Variablen und Styles angelegt.' },
  { id: 'a3', title: 'Wie ändere ich die Akzentfarbe?', content: 'Passe den Wert von color.brand.accent in der tokens.json an. Alle Komponenten, die auf diesen Token referenzieren, aktualisieren sich automatisch.' },
]

// ── App ─────────────────────────────────────────────────────────────
export default function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState(3)
  const [tags, setTags] = useState(['Design System', 'Figma', 'Tokens', 'Carbon'])

  return (
    <DocsLayout>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroEyebrow}>v1.0.0 — Minimalistisch / Clean</div>
        <h1 className={styles.heroTitle}>Design System</h1>
        <p className={styles.heroDesc}>Tokens, Komponenten und Richtlinien. Alle Farben, Größen und Werte sind als Vorlage definiert – ersetze sie mit deinen eigenen Werten.</p>
      </div>

      {/* ── COLORS ─────────────────────────────────────────────── */}
      <DocSection id="colors" title="Colors" description="Farbpalette mit Brand, Neutral und Semantic Tokens.">
        <SubSection title="Brand">
          <div className={styles.swatchGrid}>
            <Swatch bg="#0F0F0F" label="primary" />
            <Swatch bg="#2563EB" label="accent" />
            <Swatch bg="#1D4ED8" label="accent-hover" />
            <Swatch bg="#EFF6FF" label="accent-subtle" border />
          </div>
        </SubSection>
        <SubSection title="Neutral Scale">
          <div className={styles.swatchGrid}>
            {[['#FFFFFF','0',true],['#F9F9F9','50',true],['#F3F3F3','100'],['#E5E5E5','200'],['#D4D4D4','300'],['#A3A3A3','400'],['#737373','500'],['#525252','600'],['#404040','700'],['#262626','800'],['#171717','900'],['#0A0A0A','1000']].map(([bg, label, border]) => (
              <Swatch key={label} bg={bg} label={label} border={!!border} />
            ))}
          </div>
        </SubSection>
        <SubSection title="Semantic">
          <div className={styles.swatchGrid}>
            <Swatch bg="#16A34A" label="success" />
            <Swatch bg="#F0FDF4" label="success-subtle" border />
            <Swatch bg="#D97706" label="warning" />
            <Swatch bg="#FFFBEB" label="warning-subtle" border />
            <Swatch bg="#DC2626" label="error" />
            <Swatch bg="#FEF2F2" label="error-subtle" border />
            <Swatch bg="#0284C7" label="info" />
            <Swatch bg="#F0F9FF" label="info-subtle" border />
          </div>
        </SubSection>
      </DocSection>

      {/* ── TYPOGRAPHY ─────────────────────────────────────────── */}
      <DocSection id="typography" title="Typography" description="Schrift-Scale von Display bis Label. Fonts: DM Sans (Sans) + DM Mono (Mono).">
        <TypeRow name="Display 2XL" detail="60px / 600 / −0.03em" style={{ fontSize: 'var(--text-6xl)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.2 }} />
        <TypeRow name="Display XL"  detail="48px / 600 / −0.03em" style={{ fontSize: 'var(--text-5xl)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.2 }} />
        <TypeRow name="Heading XL"  detail="36px / 600 / −0.015em" style={{ fontSize: 'var(--text-4xl)', fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.35 }} />
        <TypeRow name="Heading LG"  detail="30px / 600" style={{ fontSize: 'var(--text-3xl)', fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.35 }} />
        <TypeRow name="Heading MD"  detail="24px / 600" style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing: '-0.015em' }} />
        <TypeRow name="Heading SM"  detail="20px / 500" style={{ fontSize: 'var(--text-xl)', fontWeight: 500 }} />
        <TypeRow name="Body LG"     detail="17px / 400 / 1.65" style={{ fontSize: 'var(--text-lg)', lineHeight: 1.65 }} />
        <TypeRow name="Body MD"     detail="15px / 400 / 1.5" style={{ fontSize: 'var(--text-md)', lineHeight: 1.5 }} />
        <TypeRow name="Body SM"     detail="13px / 400" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }} />
        <TypeRow name="Label MD"    detail="13px / 500" style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }} />
        <TypeRow name="Label SM"    detail="11px / 600 / +0.12em" style={{ fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }} />
        <TypeRow name="Code"        detail="13px mono" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }} />
      </DocSection>

      {/* ── SPACING ────────────────────────────────────────────── */}
      <DocSection id="spacing" title="Spacing" description="4px-Basisgrid. Token: --space-{n}">
        {[['1','4px'],['2','8px'],['3','12px'],['4','16px'],['5','20px'],['6','24px'],['7','28px'],['8','32px'],['9','36px'],['10','40px'],['12','48px'],['14','56px'],['16','64px'],['20','80px'],['24','96px'],['32','128px']].map(([n,px]) => (
          <SpacingRow key={n} token={n} px={px} />
        ))}
      </DocSection>

      {/* ── RADIUS ─────────────────────────────────────────────── */}
      <DocSection id="radius" title="Border Radius" description="Token: --radius-{name}">
        <div className={styles.radiusGrid}>
          <RadiusBox label="none" px="0px" />
          <RadiusBox label="xs"   px="2px" />
          <RadiusBox label="sm"   px="4px" />
          <RadiusBox label="md"   px="6px" />
          <RadiusBox label="lg"   px="8px" />
          <RadiusBox label="xl"   px="12px" />
          <RadiusBox label="2xl"  px="16px" />
          <RadiusBox label="3xl"  px="24px" />
          <RadiusBox label="full" px="9999px" />
        </div>
      </DocSection>

      {/* ── SHADOWS ────────────────────────────────────────────── */}
      <DocSection id="shadows" title="Shadows" description="Token: --shadow-{name}">
        <div className={styles.shadowGrid}>
          <ShadowBox label="xs"    shadow="0 1px 2px 0 rgba(0,0,0,0.05)" border />
          <ShadowBox label="sm"    shadow="0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)" />
          <ShadowBox label="md"    shadow="0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)" />
          <ShadowBox label="lg"    shadow="0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -4px rgba(0,0,0,0.05)" />
          <ShadowBox label="xl"    shadow="0 20px 25px -5px rgba(0,0,0,0.07), 0 8px 10px -6px rgba(0,0,0,0.04)" />
          <ShadowBox label="2xl"   shadow="0 25px 50px -12px rgba(0,0,0,0.12)" />
          <ShadowBox label="inner" shadow="inset 0 2px 4px 0 rgba(0,0,0,0.05)" border />
        </div>
      </DocSection>

      {/* ── MOTION ─────────────────────────────────────────────── */}
      <DocSection id="motion" title="Motion" description="Dauern und Easing-Kurven. Token: --duration-{name}, --ease-{name}">
        <Table
          columns={[
            { key: 'token',  label: 'Token', render: (r) => <TokenChip>{r.token}</TokenChip> },
            { key: 'value',  label: 'Wert' },
            { key: 'usage',  label: 'Einsatz' },
          ]}
          rows={[
            { id: 1, token: '--duration-instant', value: '50ms',  usage: 'Hover-Highlights, Icon-Swaps' },
            { id: 2, token: '--duration-fast',    value: '100ms', usage: 'Button States, Border' },
            { id: 3, token: '--duration-normal',  value: '150ms', usage: 'Toggle, Checkbox, Focus Ring' },
            { id: 4, token: '--duration-slow',    value: '250ms', usage: 'Dropdown, Tooltip Fade' },
            { id: 5, token: '--duration-slower',  value: '400ms', usage: 'Modal, Drawer, Slide-in' },
            { id: 6, token: '--ease-out',   value: 'cubic-bezier(0,0,0.2,1)',     usage: 'Elemente erscheinen' },
            { id: 7, token: '--ease-in-out',value: 'cubic-bezier(0.4,0,0.2,1)',   usage: 'Positionswechsel' },
            { id: 8, token: '--ease-spring',value: 'cubic-bezier(0.34,1.56,0.64,1)', usage: 'Bouncy Toggle, Chip' },
          ]}
        />
      </DocSection>

      {/* ── BUTTONS ────────────────────────────────────────────── */}
      <DocSection id="buttons" title="Buttons" description="6 Varianten × 5 Größen + Disabled State.">
        <SubSection title="Varianten">
          <Row align="center">
            {['primary','accent','secondary','ghost','danger','link'].map(v => (
              <Button key={v} variant={v} size="md">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
            ))}
          </Row>
        </SubSection>
        <SubSection title="Größen (Primary)">
          <Row align="center">
            {['xs','sm','md','lg','xl'].map(s => (
              <Button key={s} variant="primary" size={s}>{s.toUpperCase()}</Button>
            ))}
          </Row>
        </SubSection>
        <SubSection title="Disabled">
          <Row align="center">
            {['primary','accent','secondary'].map(v => (
              <Button key={v} variant={v} size="md" disabled>{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
            ))}
          </Row>
        </SubSection>
      </DocSection>

      {/* ── INPUTS ─────────────────────────────────────────────── */}
      <DocSection id="inputs" title="Inputs" description="Textfelder in verschiedenen States, Größen und Varianten.">
        <Grid2>
          <Input label="Default" placeholder="Platzhalter…" hint="Hilfstext für das Feld." />
          <Input label="Error"   defaultValue="Ungültiger Wert" error="Dieses Feld ist erforderlich." />
          <Input label="Small"   size="sm" placeholder="Small input…" />
          <Input label="Large"   size="lg" placeholder="Large input…" />
          <Input label="Disabled" defaultValue="Nicht editierbar" disabled />
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, marginBottom: 8 }}>Mit Addon</div>
            <InputWithAddon addon=".de" placeholder="meinedomain" />
          </div>
        </Grid2>
        <SubSection title="Textarea">
          <div style={{ maxWidth: 480 }}>
            <Textarea label="Beschreibung" rows={3} placeholder="Text eingeben…" />
          </div>
        </SubSection>
      </DocSection>

      {/* ── SELECT & TOGGLE ────────────────────────────────────── */}
      <DocSection id="selects" title="Select, Checkbox, Radio, Toggle">
        <Grid2>
          <Select label="Select" options={['Option A', 'Option B', 'Option C']} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Checkbox label="Checkbox ausgewählt" defaultChecked />
            <Checkbox label="Checkbox nicht ausgewählt" />
            <Toggle label="Toggle aktiv" defaultChecked />
            <Toggle label="Toggle inaktiv" />
          </div>
        </Grid2>
        <SubSection title="Radio Group">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Radio name="demo" label="Option A" value="a" defaultChecked />
            <Radio name="demo" label="Option B" value="b" />
            <Radio name="demo" label="Option C" value="c" />
          </div>
        </SubSection>
      </DocSection>

      {/* ── BADGES ─────────────────────────────────────────────── */}
      <DocSection id="badges" title="Badges & Tags">
        <SubSection title="Badges">
          <Row align="center">
            {['neutral','accent','success','warning','error'].map(v => (
              <Badge key={v} variant={v} dot>{v.charAt(0).toUpperCase() + v.slice(1)}</Badge>
            ))}
          </Row>
          <Row align="center">
            {['neutral','success','error'].map(v => (
              <Badge key={v} variant={v} size="lg">{v.charAt(0).toUpperCase() + v.slice(1)} LG</Badge>
            ))}
          </Row>
        </SubSection>
        <SubSection title="Tags">
          <Row align="center">
            {tags.map(t => (
              <Tag key={t} onRemove={() => setTags(tags.filter(x => x !== t))}>{t}</Tag>
            ))}
          </Row>
        </SubSection>
      </DocSection>

      {/* ── ALERTS ─────────────────────────────────────────────── */}
      <DocSection id="alerts" title="Alerts & Notifications">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          <Alert variant="info"    title="Hinweis">Diese Aktion erfordert zusätzliche Bestätigung.</Alert>
          <Alert variant="success" title="Erfolgreich gespeichert">Deine Änderungen wurden übernommen.</Alert>
          <Alert variant="warning" title="Achtung">Diese Aktion kann nicht rückgängig gemacht werden.</Alert>
          <Alert variant="error"   title="Fehler aufgetreten">Die Verbindung zum Server konnte nicht hergestellt werden.</Alert>
        </div>
        <SubSection title="Toast">
          <Toast action="Rückgängig" onAction={() => {}}>Änderungen gespeichert</Toast>
        </SubSection>
      </DocSection>

      {/* ── CARDS ──────────────────────────────────────────────── */}
      <DocSection id="cards" title="Cards">
        <Grid2>
          <Card variant="flat">
            <Card.Header title="Flat Card" subtitle="Subtitel oder Metadaten" />
            <Card.Body>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                Karteninhalt. Kann Text, Daten, Formulare oder andere Komponenten enthalten.
              </p>
            </Card.Body>
            <Card.Footer>
              <Button variant="ghost" size="sm">Abbrechen</Button>
              <Button variant="primary" size="sm">Bestätigen</Button>
            </Card.Footer>
          </Card>
          <Card variant="raised">
            <Card.Header title="Raised Card" subtitle="Mit Elevation" />
            <Card.Body>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                Raised Cards heben sich durch Schatten vom Hintergrund ab. Ideal für Overlays.
              </p>
            </Card.Body>
            <Card.Footer>
              <Button variant="ghost" size="sm">Abbrechen</Button>
              <Button variant="accent" size="sm">Speichern</Button>
            </Card.Footer>
          </Card>
        </Grid2>
      </DocSection>

      {/* ── TABLES ─────────────────────────────────────────────── */}
      <DocSection id="tables" title="Tables">
        <Table columns={TABLE_COLS} rows={TABLE_ROWS} />
      </DocSection>

      {/* ── TABS ───────────────────────────────────────────────── */}
      <DocSection id="tabs" title="Tabs">
        <SubSection title="Underline">
          <Tabs variant="underline" tabs={[
            { id: 'overview',  label: 'Übersicht',    content: <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Inhalt der Übersicht.</p> },
            { id: 'details',   label: 'Details',      content: <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Detailansicht.</p> },
            { id: 'activity',  label: 'Aktivität',    content: <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Aktivitäts-Log.</p> },
            { id: 'settings',  label: 'Einstellungen',content: <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Einstellungen.</p> },
          ]} />
        </SubSection>
        <SubSection title="Pill">
          <Tabs variant="pill" tabs={[
            { id: 'all',      label: 'Alle' },
            { id: 'active',   label: 'Aktiv' },
            { id: 'archived', label: 'Archiviert' },
          ]} />
        </SubSection>
      </DocSection>

      {/* ── NAVIGATION ─────────────────────────────────────────── */}
      <DocSection id="navigation" title="Navigation">
        <SubSection title="Breadcrumb">
          <Breadcrumb items={[
            { label: 'Home', href: '#' },
            { label: 'Projekte', href: '#' },
            { label: 'Design System', href: '#' },
            { label: 'Komponenten' },
          ]} />
        </SubSection>
        <SubSection title="Pagination">
          <Pagination current={page} total={12} onChange={setPage} />
        </SubSection>
      </DocSection>

      {/* ── MODAL ──────────────────────────────────────────────── */}
      <DocSection id="overlays" title="Modal">
        <Button variant="secondary" size="md" onClick={() => setModalOpen(true)}>Modal öffnen</Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Eintrag löschen?"
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Abbrechen</Button>
              <Button variant="danger" size="sm" style={{ background: 'var(--color-error)', color: 'white' }} onClick={() => setModalOpen(false)}>Löschen</Button>
            </>
          }
        >
          Diese Aktion kann nicht rückgängig gemacht werden. Der Eintrag wird dauerhaft gelöscht.
        </Modal>
      </DocSection>

      {/* ── ACCORDION ──────────────────────────────────────────── */}
      <DocSection id="accordion" title="Accordion">
        <Accordion items={ACCORDION_ITEMS} />
      </DocSection>

      {/* ── MENUS ──────────────────────────────────────────────── */}
      <DocSection id="menus" title="Menus & Dropdowns">
        <div style={{ maxWidth: 240 }}>
          <Menu>
            <Menu.Label>Account</Menu.Label>
            <Menu.Item icon="👤" shortcut="⌘P">Profil anzeigen</Menu.Item>
            <Menu.Item icon="⚙" shortcut="⌘,">Einstellungen</Menu.Item>
            <Menu.Separator />
            <Menu.Label>Workspace</Menu.Label>
            <Menu.Item icon="📁" shortcut="⌘N">Neues Projekt</Menu.Item>
            <Menu.Item icon="📋">Duplizieren</Menu.Item>
            <Menu.Separator />
            <Menu.Item icon="🗑" danger shortcut="⌫">Löschen</Menu.Item>
          </Menu>
        </div>
      </DocSection>

      {/* ── LISTS ──────────────────────────────────────────────── */}
      <DocSection id="lists" title="Lists">
        <div className={styles.list}>
          {[
            { id: 1, name: 'Anna Klein',  sub: 'Zuletzt aktiv vor 2 Minuten', initials: 'AK', color: '#E5E5E5', textColor: '#171717', badge: { variant: 'success', label: 'Online' } },
            { id: 2, name: 'Max Bauer',   sub: 'Zuletzt aktiv vor 1 Stunde',  initials: 'MB', color: '#DBEAFE', textColor: '#1D4ED8', badge: { variant: 'neutral', label: 'Away' } },
            { id: 3, name: 'Lena Müller', sub: 'Zuletzt aktiv gestern',       initials: 'LM', color: '#FCE7F3', textColor: '#BE185D', badge: { variant: 'error',   label: 'Offline' } },
          ].map(item => (
            <div key={item.id} className={styles.listItem}>
              <Avatar size="sm" initials={item.initials} color={item.color} textColor={item.textColor} />
              <div className={styles.listContent}>
                <div className={styles.listTitle}>{item.name}</div>
                <div className={styles.listSub}>{item.sub}</div>
              </div>
              <Badge variant={item.badge.variant}>{item.badge.label}</Badge>
            </div>
          ))}
        </div>
      </DocSection>

      {/* ── STATS ──────────────────────────────────────────────── */}
      <DocSection id="stats" title="Stats / KPI Cards">
        <div className={styles.statGrid}>
          <StatCard label="Umsatz"     value="€84.2k" delta="12.4% vs. Vormonat" deltaDir="up" />
          <StatCard label="Nutzer"     value="12,841" delta="8.1%"               deltaDir="up" />
          <StatCard label="Conversion" value="3.6%"   delta="0.4%"               deltaDir="down" />
          <StatCard label="Offen"      value="47"     delta="5 Tickets"          deltaDir="down" />
        </div>
      </DocSection>

      {/* ── FEEDBACK ───────────────────────────────────────────── */}
      <DocSection id="feedback" title="Feedback — Progress">
        <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Progress value={72} label="Upload läuft…"     showValue />
          <Progress value={45} label="Accent"            variant="accent"  showValue />
          <Progress value={90} label="Success"           variant="success" size="lg" showValue />
          <Progress value={30} label="Warning"           variant="warning" size="sm" showValue />
          <Progress value={15} label="Error"             variant="error"   showValue />
        </div>
      </DocSection>

      {/* ── AVATAR ─────────────────────────────────────────────── */}
      <DocSection id="avatar" title="Avatar">
        <SubSection title="Größen">
          <Row align="center">
            <Avatar size="xs" initials="AK" />
            <Avatar size="sm" initials="MB" color="#DBEAFE" textColor="#1D4ED8" />
            <Avatar size="md" initials="LM" color="#FCE7F3" textColor="#BE185D" />
            <Avatar size="lg" initials="JP" color="#F0FDF4" textColor="#16A34A" />
            <Avatar size="xl" initials="KS" color="#FFF7ED" textColor="#C2410C" />
          </Row>
        </SubSection>
        <SubSection title="Avatar Group">
          <AvatarGroup size="md" avatars={[
            { initials: 'AK' },
            { initials: 'MB', color: '#DBEAFE', textColor: '#1D4ED8' },
            { initials: 'LM', color: '#FCE7F3', textColor: '#BE185D' },
            { initials: 'JP', color: '#F0FDF4', textColor: '#16A34A' },
            { initials: 'KS', color: '#FFF7ED', textColor: '#C2410C' },
            { initials: 'RS', color: '#F5F3FF', textColor: '#7C3AED' },
          ]} max={4} />
        </SubSection>
      </DocSection>

      {/* ── SKELETON ───────────────────────────────────────────── */}
      <DocSection id="skeleton" title="Skeleton / Loading">
        <SkeletonCard />
      </DocSection>

    </DocsLayout>
  )
}
