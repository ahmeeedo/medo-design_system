/**
 * Building blocks for the documentation pages (styles: .storybook/preview.css).
 * Structure follows the Figma doc frames: header, numbered sections, examples,
 * spec tables, implementation notes, footer. Not a 1:1 copy.
 * Used by the MDX pages, the component docs template and the docs container below.
 * Rule: the docs use our own components (Table, Alert, Link …) as soon as they exist.
 */
import type { PropsWithChildren, ReactNode } from 'react';
import { Children, useContext, useEffect, useState } from 'react';
import type { DocsContextProps } from 'storybook/internal/types';
import { GLOBALS_UPDATED, SET_GLOBALS, UPDATE_STORY_ARGS } from 'storybook/internal/core-events';
import { Canvas, Controls, Description, DocsContainer, DocsContext, useOf } from '@storybook/addon-docs/blocks';
import { Alert, Link, StaticTable } from '@medo/ui';
import { modeFromGlobals, themes } from '../../.storybook/theme';

/** Link to a doc frame in the Figma library */
export const figmaDoc = (nodeId: string) =>
  `https://www.figma.com/design/vOTfMtcpCwAJjuSZUkfpfj/?node-id=${nodeId.replace(':', '-')}`;

const pad = (n: number) => String(n).padStart(2, '0');
export const sectionId = (n: number | string) => `section-${typeof n === 'number' ? pad(n) : n}`;

function jump(e: React.MouseEvent<Element>, id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  target.focus({ preventScroll: true });
}

/* ---------- page ---------- */

export function DocPage({ children }: { children: ReactNode }) {
  // sb-unstyled keeps Storybook's default docs typography away; preview.css styles the page.
  return (
    <div className="medo-doc sb-unstyled">
      {children}
    </div>
  );
}

/* ---------- header ---------- */

type HeaderProps = {
  /** e.g. "Components", "Foundations" */
  kind: string;
  title: string;
  /** Right meta line, e.g. "Button · C01" */
  meta?: string;
  subtitle?: ReactNode;
  description?: ReactNode;
  /** Section titles, numbered automatically (01, 02 …) */
  nav?: string[];
};

export function DocHeader({ kind, title, meta, subtitle, description, nav }: HeaderProps) {
  return (
    <header className="doc-header">
      <div className="doc-topline">
        <span className="medo-text-overline">Design system / {kind}</span>
        {meta ? <span className="medo-text-code-sm doc-muted doc-upper">{meta}</span> : null}
      </div>
      <div className="doc-intro">
        <div className="doc-intro-main">
          <h1 className="medo-text-display-lg">{title}</h1>
          {subtitle ? <p className="medo-text-body-lg doc-muted">{subtitle}</p> : null}
        </div>
        {description ? <div className="doc-intro-aside medo-text-body-sm doc-muted">{description}</div> : null}
      </div>
      {nav?.length ? (
        <nav aria-label="On this page" className="doc-nav">
          <ol>
            {nav.map((label, i) => (
              <li key={label}>
                <Link variant="standalone" size="sm" href={`#${sectionId(i + 1)}`} onClick={(e) => jump(e, sectionId(i + 1))}>
                  <span className="medo-text-code-sm doc-muted">{pad(i + 1)}</span>
                  {label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
    </header>
  );
}

/* ---------- section ---------- */

type SectionProps = {
  n: number;
  title: string;
  /** Short meta on the right, e.g. "Light + Dark" */
  meta?: string;
  description?: ReactNode;
  children?: ReactNode;
};

export function DocSection({ n, title, meta, description, children }: SectionProps) {
  const id = sectionId(n);
  return (
    <section className="doc-section" aria-labelledby={`${id}-title`}>
      <div className="doc-section-head">
        <span className="medo-text-code-md doc-muted" aria-hidden="true">{pad(n)}</span>
        <h2 id={`${id}-title`} className="medo-text-heading-xl">
          {/* Anchor target for the header navigation */}
          <span id={id} tabIndex={-1} className="doc-anchor" />
          {title}
        </h2>
        {meta ? <span className="medo-text-code-sm doc-muted doc-upper doc-section-meta">{meta}</span> : null}
      </div>
      {description ? <div className="doc-lead medo-text-body-md doc-muted">{description}</div> : null}
      {children ? <div className="doc-body">{children}</div> : null}
    </section>
  );
}

/* ---------- spec table ---------- */

export function SpecTable({ head = ['Part', 'Value'], rows }: { head?: [string, string]; rows: [ReactNode, ReactNode][] }) {
  return (
    <StaticTable className="doc-spec">
      <thead>
        <tr>
          <th scope="col">{head[0]}</th>
          <th scope="col">{head[1]}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([k, v], i) => (
          <tr key={i}>
            <th scope="row">{k}</th>
            <td>{v}</td>
          </tr>
        ))}
      </tbody>
    </StaticTable>
  );
}

/* ---------- implementation notes ---------- */

export function Notes({ title = 'Implementation notes', children }: { title?: string; children: ReactNode }) {
  return (
    <Alert tone="info" title={title} className="doc-notes">
      {children}
    </Alert>
  );
}

/** Link to a Figma doc frame (new tab). */
export function FigmaLink({ node, children = 'Open the Figma documentation' }: { node?: string; children?: ReactNode }) {
  return (
    <Link href={node ? figmaDoc(node) : 'https://www.figma.com/design/vOTfMtcpCwAJjuSZUkfpfj'} target="_blank" external>
      {children}
    </Link>
  );
}

/* ---------- footer ---------- */

export function DocFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="doc-footer medo-text-code-sm doc-muted">
      {Children.toArray(children).map((c, i) => (
        <p key={i}>{c}</p>
      ))}
    </footer>
  );
}

/** Inline code token, e.g. <Tok>space/4</Tok> */
export const Tok = ({ children }: { children: ReactNode }) => <code className="doc-code">{children}</code>;

/* ---------- component docs template ---------- */

/**
 * Docs page for every story file with the "autodocs" tag:
 * header → Playground → one section per story → footer.
 *
 * Optional per story file (meta.parameters.medo):
 *   code      Figma code, e.g. "C01"
 *   subtitle  one sentence under the title (from the Figma doc)
 *   figma     node id of the Figma doc frame, e.g. "58:2"
 */
type MedoDocsParams = { code?: string; subtitle?: string; figma?: string };

export function ComponentDocsPage() {
  const { csfFile, preparedMeta } = useOf('meta', ['meta']);
  const context = useContext(DocsContext);
  const stories = context.componentStoriesFromCSFFile(csfFile).filter((s) => s.tags?.includes('autodocs'));
  const medo = (preparedMeta.parameters.medo ?? {}) as MedoDocsParams;

  const path = preparedMeta.title.split('/');
  const name = path.at(-1)!;
  const kind = path[0];
  const [primary, ...examples] = stories;

  /*
   * Storybook quirk: the docs Controls block starts with the *mapped* args, so select controls
   * with a mapping (slot()) show „Choose option…“ until the first change. An empty update makes
   * the preview send the real (unmapped) args once.
   */
  const primaryId = primary?.id;
  useEffect(() => {
    if (primaryId) context.channel.emit(UPDATE_STORY_ARGS, { storyId: primaryId, updatedArgs: {} });
  }, [context.channel, primaryId]);
  const nav = [primary ? 'Playground' : null, ...examples.map((s) => s.name)].filter(Boolean) as string[];
  let n = 0;

  return (
    <DocPage>
      <DocHeader
        kind={kind}
        title={name}
        meta={[name, medo.code].filter(Boolean).join(' · ')}
        subtitle={medo.subtitle}
        description={<Description of="meta" />}
        nav={nav}
      />

      {primary ? (
        <DocSection n={++n} title="Playground" meta="Controls" description="Change the properties below.">
          <Canvas of={primary.moduleExport} />
          <Controls of={primary.moduleExport} />
        </DocSection>
      ) : null}

      {examples.map((story) => (
        <DocSection
          key={story.id}
          n={++n}
          title={story.name}
          description={story.parameters.docs?.description?.story ? <Description of={story.moduleExport} /> : undefined}
        >
          <Canvas of={story.moduleExport} />
        </DocSection>
      ))}

      <DocFooter>
        {`${kind === 'Components' ? 'Component' : kind}: ${name}${medo.code ? ` · Figma ${medo.code}` : ''} · @medo/ui`}
        {medo.figma ? (
          <FigmaLink node={medo.figma} />
        ) : (
          'Figma is the source of truth.'
        )}
      </DocFooter>
    </DocPage>
  );
}

/* ---------- docs container: whole page follows Light / Dark ---------- */

export function MedoDocsContainer({ context, children }: PropsWithChildren<{ context: DocsContextProps }>) {
  // Current toolbar value; `store` is not part of the public type, so read it defensively.
  const initial = () => modeFromGlobals((context as unknown as { store?: { userGlobals?: { get(): Record<string, unknown> } } }).store?.userGlobals?.get());
  const [mode, setMode] = useState(initial);

  useEffect(() => {
    const update = ({ globals }: { globals?: Record<string, unknown> }) => setMode(modeFromGlobals(globals));
    context.channel.on(SET_GLOBALS, update);
    context.channel.on(GLOBALS_UPDATED, update);
    return () => {
      context.channel.off(SET_GLOBALS, update);
      context.channel.off(GLOBALS_UPDATED, update);
    };
  }, [context]);

  // Same attribute a real app sets; pages without stories need it too.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  return (
    <DocsContainer context={context} theme={themes[mode]}>
      {children}
    </DocsContainer>
  );
}
