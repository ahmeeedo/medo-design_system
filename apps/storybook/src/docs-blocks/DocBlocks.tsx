/**
 * Building blocks for the documentation pages (styles: .storybook/preview.css).
 * Structure: header, numbered sections, examples, spec tables, implementation notes, footer.
 * Used by the MDX pages, the component docs template and the docs container below.
 * Rule: the docs use our own components (Table, Alert, Link …) as soon as they exist.
 */
import type { PropsWithChildren, ReactNode } from 'react';
import { Children, createContext, useContext, useEffect, useRef, useState } from 'react';
import { Ban, Check, CircleCheck, X } from 'lucide-react';
import type { DocsContextProps } from 'storybook/internal/types';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { Canvas, Description, DocsContainer, DocsContext, useOf } from '@storybook/addon-docs/blocks';
import { Alert, Link, List, ListItem, StaticTable } from '@med-o/ui';
import { modeFromGlobals, themes } from '../../.storybook/theme';
import { Rich, Tok } from './text';
import { PropsTable } from './PropsTable';

export { Rich, Tok };

/** Public source repository. */
export const repoUrl = 'https://github.com/ahmeeedo/medo-design_system';

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

/** DocHeader hands its section list to DocPage, which shows it as a sticky side navigation. */
const SetNavContext = createContext<(nav: string[]) => void>(() => {});

export function DocPage({ children }: { children: ReactNode }) {
  const [nav, setNav] = useState<string[]>([]);
  // sb-unstyled keeps Storybook's default docs typography away; preview.css styles the page.
  return (
    <SetNavContext.Provider value={setNav}>
      <div className={`medo-doc sb-unstyled${nav.length ? ' medo-doc--toc' : ''}`}>
        {/* First in the DOM, so keyboard users reach it right after the page title; shown on the right. */}
        {nav.length ? <DocToc items={nav} variant="rail" /> : null}
        <div className="doc-main">{children}</div>
      </div>
    </SetNavContext.Provider>
  );
}

/* ---------- table of contents ---------- */

/** Number of the section that is currently at the top of the viewport (1-based). */
function useActiveSection(count: number) {
  const [active, setActive] = useState(1);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      // A section counts as current once its top passes the upper third of the viewport.
      const line = Math.max(96, window.innerHeight * 0.3);
      let current = 1;
      for (let i = 1; i <= count; i++) {
        const section = document.getElementById(sectionId(i))?.closest('section');
        if (section && section.getBoundingClientRect().top <= line) current = i;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [count]);
  return [active, setActive] as const;
}

/**
 * “On this page”. Two looks with the same links:
 *   box   in the header, below 68rem
 *   rail  sticky on the right from 68rem, marks the current section (aria-current)
 * Only one is displayed at a time; the other is display: none and so hidden from screen readers too.
 */
export function DocToc({ items, variant }: { items: string[]; variant: 'box' | 'rail' }) {
  const [active, setActive] = useActiveSection(variant === 'rail' ? items.length : 0);
  return (
    <nav aria-label="On this page" className={`doc-toc doc-toc--${variant}`}>
      <p className="medo-text-overline doc-muted">On this page</p>
      <ol>
        {items.map((label, i) => {
          const id = sectionId(i + 1);
          const current = variant === 'rail' && active === i + 1;
          return (
            <li key={label}>
              <a
                className="doc-toc-link"
                href={`#${id}`}
                aria-current={current ? 'location' : undefined}
                onClick={(e) => {
                  setActive(i + 1);
                  jump(e, id);
                }}
              >
                <span className="doc-toc-num" aria-hidden="true">{pad(i + 1)}</span>
                <span>{label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ---------- header ---------- */

type HeaderProps = {
  /** e.g. "Components", "Foundations" */
  kind: string;
  title: string;
  /** Right meta line, e.g. "Button" */
  meta?: string;
  subtitle?: ReactNode;
  description?: ReactNode;
  /** Section titles, numbered automatically (01, 02 …) */
  nav?: string[];
};

export function DocHeader({ kind, title, meta, subtitle, description, nav }: HeaderProps) {
  const setNav = useContext(SetNavContext);
  const navKey = nav?.join('\u0000') ?? '';
  const navRef = useRef(nav);
  navRef.current = nav;
  useEffect(() => {
    setNav(navRef.current ?? []);
  }, [setNav, navKey]);

  return (
    <header className="doc-header">
      <div className="doc-topline">
        <span className="medo-text-overline">Design system / {kind}</span>
        {meta ? <span className="medo-text-code-sm doc-muted">{meta}</span> : null}
      </div>
      <div className="doc-intro">
        <h1 className="medo-text-display-lg">{title}</h1>
        {subtitle ? <p className="medo-text-body-lg doc-muted">{subtitle}</p> : null}
        {description ? <div className="doc-intro-text medo-text-body-md">{description}</div> : null}
      </div>
      {nav?.length ? <DocToc items={nav} variant="box" /> : null}
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
        {meta ? <span className="medo-text-code-sm doc-muted doc-section-meta">{meta}</span> : null}
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

/** Link to a folder of the source repository (new tab). */
export function SourceLink({ path = '', children = 'View the source on GitHub' }: { path?: string; children?: ReactNode }) {
  return (
    <Link href={path ? `${repoUrl}/tree/main/${path}` : repoUrl} target="_blank" external>
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


/* ---------- component docs template ---------- */


/**
 * Usage guidance on coloured surfaces (feedback tokens, so Light and Dark keep the contrast):
 * green for “When to use” and “Do”, red for “When not to use” and “Don't”.
 * The heading and the icon carry the meaning too, never the colour alone (WCAG 1.4.1).
 */
export function UsageGuide({ usage }: { usage: MedoUsage }) {
  const block = (title: string, items: string[] | undefined, tone: 'positive' | 'negative', icon: ReactNode, list: 'bullet' | 'check') =>
    items?.length ? (
      <div className={`doc-guide doc-guide--${tone}`}>
        <h3 className="doc-guide-title medo-text-heading-sm">
          <span className="doc-guide-icon" aria-hidden="true">{icon}</span>
          {title}
        </h3>
        {list === 'bullet' ? (
          <List type="bullet" size="md">
            {items.map((item) => (
              <ListItem key={item}>
                <Rich>{item}</Rich>
              </ListItem>
            ))}
          </List>
        ) : (
          /* Rules: a check or a cross in the tone colour, full text colour. The heading (Do / Don't) names the
             list, so the items need no hidden prefix. role="list": screen readers keep the list without bullets. */
          <ul className="doc-rules medo-text-body-md" role="list">
            {items.map((item) => (
              <li key={item}>
                <span className="doc-rules-icon" aria-hidden="true">
                  {tone === 'positive' ? <Check /> : <X />}
                </span>
                <span>
                  <Rich>{item}</Rich>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    ) : null;
  return (
    <>
      {usage.when?.length || usage.whenNot?.length ? (
        <div className="doc-columns">
          {block('When to use', usage.when, 'positive', <CircleCheck />, 'bullet')}
          {block('When not to use', usage.whenNot, 'negative', <Ban />, 'bullet')}
        </div>
      ) : null}
      {usage.do?.length || usage.dont?.length ? (
        <div className="doc-columns">
          {block('Do', usage.do, 'positive', <Check />, 'check')}
          {block("Don't", usage.dont, 'negative', <X />, 'check')}
        </div>
      ) : null}
    </>
  );
}

type MedoUsage = { when?: string[]; whenNot?: string[]; do?: string[]; dont?: string[] };
type MedoA11y = { keyboard?: [string, string][]; notes?: string[] };
type MedoStyling = { classes?: [string, string][]; states?: string[] };

/**
 * Docs page for every story file with the "autodocs" tag:
 * header → Usage → Playground → one section per story → Accessibility → Styling → footer.
 *
 * Optional per story file (meta.parameters.medo), texts may contain `code`:
 *   subtitle  one sentence under the title
 *   usage     { when, whenNot, do, dont }: lists
 *   a11y      { keyboard: [key, action][], notes: string[] }
 *   styling   { classes: [class, use][], states: data attributes the CSS reads }
 */
type MedoDocsParams = { subtitle?: string; usage?: MedoUsage; a11y?: MedoA11y; styling?: MedoStyling };

export function ComponentDocsPage() {
  const { csfFile, preparedMeta } = useOf('meta', ['meta']);
  const context = useContext(DocsContext);
  const stories = context.componentStoriesFromCSFFile(csfFile).filter((s) => s.tags?.includes('autodocs'));
  const medo = (preparedMeta.parameters.medo ?? {}) as MedoDocsParams;

  const path = preparedMeta.title.split('/');
  const name = path.at(-1)!;
  const kind = path[0];
  const [primary, ...examples] = stories;

  const nav = [
    medo.usage ? 'Usage' : null,
    primary ? 'Playground' : null,
    ...examples.map((s) => s.name),
    medo.a11y ? 'Accessibility' : null,
    medo.styling ? 'Styling' : null,
  ].filter(Boolean) as string[];
  let n = 0;

  return (
    <DocPage>
      <DocHeader
        kind={kind}
        title={name}
        meta={name}
        subtitle={medo.subtitle}
        description={<Description of="meta" />}
        nav={nav}
      />

      {medo.usage ? (
        <DocSection n={++n} title="Usage" meta="Guidelines">
          <UsageGuide usage={medo.usage} />
        </DocSection>
      ) : null}

      {primary ? (
        <DocSection n={++n} title="Playground" meta="Controls" description="Change the properties below.">
          <Canvas of={primary.moduleExport} />
          <PropsTable of={primary.moduleExport} />
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

      {medo.a11y ? (
        <DocSection n={++n} title="Accessibility" meta="WCAG 2.2 AA">
          {medo.a11y.keyboard?.length ? (
            <SpecTable head={['Key', 'Action']} rows={medo.a11y.keyboard.map(([key, action]) => [<Tok>{key}</Tok>, <Rich>{action}</Rich>])} />
          ) : null}
          {medo.a11y.notes?.length ? (
            <List size="md">
              {medo.a11y.notes.map((note) => (
                <ListItem key={note}>
                  <Rich>{note}</Rich>
                </ListItem>
              ))}
            </List>
          ) : null}
        </DocSection>
      ) : null}

      {medo.styling ? (
        <DocSection
          n={++n}
          title="Styling"
          meta="Plain CSS"
          description="The look is plain CSS on the design tokens. Other frameworks can use the same classes and set the same data attributes."
        >
          {medo.styling.classes?.length ? (
            <SpecTable head={['Class', 'Use']} rows={medo.styling.classes.map(([cls, use]) => [<Tok>{cls}</Tok>, <Rich>{use}</Rich>])} />
          ) : null}
          {medo.styling.states?.length ? (
            <p>
              <strong>States</strong> (set by React Aria):{' '}
              {medo.styling.states.map((state, i) => (
                <span key={state}>
                  {i ? ', ' : ''}
                  <Tok>{state}</Tok>
                </span>
              ))}
            </p>
          ) : null}
        </DocSection>
      ) : null}

      <DocFooter>
        {`${kind === 'Components' ? 'Component' : kind}: ${name} · @med-o/ui`}
        <SourceLink path="packages/ui/src" />
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
