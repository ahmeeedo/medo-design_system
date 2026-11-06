/// <reference types="vite/client" />
/**
 * “What's new”: the changelogs of both packages, read at build time from their CHANGELOG.md (written by Changesets).
 * Nothing to maintain by hand – a release adds its entries here automatically.
 *
 * An entry follows the writing rule for changesets (README, Contributing):
 *   - <commit>: New|Improved|Fixed: one short line with the `Component`.
 *     Details: paragraphs and lists.
 *     **Breaking:** what changed.
 *     Update: what to do.
 * Per release: breaking changes first (“Before you update”), then New · Improved · Fixed.
 */
import { useEffect, useState, type ReactNode } from 'react';
import { Accordion, AccordionItem, Alert, Badge, Link, List, ListItem, Option, Select, Switch, ToggleButton, ToggleButtonGroup } from '@med-o/ui';
import uiLog from '../../../../packages/ui/CHANGELOG.md?raw';
import tokensLog from '../../../../packages/tokens/CHANGELOG.md?raw';
import uiIndex from '../../../../packages/ui/src/index.ts?raw';
import { DocSection, docsHref, repoUrl } from './DocBlocks';
import { Rich } from './text';

type Kind = 'Major' | 'Minor' | 'Patch';
type Category = 'New' | 'Improved' | 'Fixed';
type Breaking = { what: string; update?: string };
type Entry = { key: string; id: string; category: Category; summary: string; body: string[]; breaking?: Breaking; packages: Set<string> };
type Release = { version: string; date?: string; kind: Kind; entries: Map<string, Entry> };

const CATEGORIES: Category[] = ['New', 'Improved', 'Fixed'];
const rank: Record<Kind, number> = { Major: 0, Minor: 1, Patch: 2 };

/* ---------- Parsing ---------- */

/** Splits an entry's details from its “**Breaking:** … Update: …” paragraph. */
function finish(entry: Entry) {
  const blocks = entry.body.join('\n').split(/\n\s*\n/);
  const rest: string[] = [];
  for (const block of blocks) {
    const breaking = block.match(/^\*\*(?:Breaking|Behaviour change):\*\*\s*([\s\S]*)/);
    if (!breaking) {
      if (block.trim()) rest.push(block.trim());
      continue;
    }
    const [what, update] = breaking[1].split(/\n?Update:\s*/);
    entry.breaking = { what: what.replace(/\s*\n\s*/g, ' ').trim(), update: update?.replace(/\s*\n\s*/g, ' ').trim() };
  }
  entry.body = rest;
}

/** Versions → entries “- <commit>: Category: text” with their indented details; package bookkeeping is left out. */
function parse(log: string, pkg: string, releases: Map<string, Release>) {
  let release: Release | undefined;
  let kind: Kind = 'Patch';
  let entry: Entry | undefined;
  const close = () => {
    if (entry) finish(entry);
    entry = undefined;
  };
  for (const line of log.split('\n')) {
    const version = line.match(/^## (\S+)/);
    if (version) {
      close();
      release = releases.get(version[1]) ?? { version: version[1], kind: 'Patch', entries: new Map() };
      releases.set(version[1], release);
      continue;
    }
    if (!release) continue;
    const date = line.match(/^_Released (\d{4}-\d{2}-\d{2})_$/);
    if (date) {
      release.date = date[1];
      continue;
    }
    const heading = line.match(/^### (Major|Minor|Patch) Changes/);
    if (heading) {
      close();
      kind = heading[1] as Kind;
      if (rank[kind] < rank[release.kind]) release.kind = kind;
      continue;
    }
    const item = line.match(/^- ([0-9a-f]{7,}): (?:(New|Improved|Fixed): )?(.*)/);
    if (item) {
      close();
      const [, id, category, summary] = item;
      const key = `${id}:${summary}`;
      const known = release.entries.get(key);
      if (known) {
        // The same change in both packages: one entry, both package tags; its details are already there.
        known.packages.add(pkg);
        continue;
      }
      entry = { key, id, category: (category as Category) ?? (kind === 'Patch' ? 'Fixed' : 'Improved'), summary, body: [], packages: new Set([pkg]) };
      release.entries.set(key, entry);
      continue;
    }
    // “- @med-o/…” and “- Updated dependencies” are package bookkeeping; they end an entry.
    if (/^- /.test(line)) {
      close();
      continue;
    }
    if (entry && (line.startsWith('  ') || !line.trim())) entry.body.push(line.slice(2));
  }
  close();
}

const releases = new Map<string, Release>();
parse(uiLog, 'UI', releases);
parse(tokensLog, 'Tokens', releases);
const byVersion = [...releases.values()].sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }));

export const latestVersion = byVersion[0]?.version;

/* ---------- Components: `Stepper` in an entry → the docs page of Stepper ---------- */

/** Export name → its folder in packages/ui/src (“Step” → “stepper”). */
const folderOf = new Map<string, string>();
for (const [, names, folder] of uiIndex.matchAll(/^export \{([^}]+)\} from '\.\/([^/]+)\//gm)) {
  for (const name of names.split(',')) folderOf.set(name.trim(), folder);
}
const namesIn = (text: string) => [...text.matchAll(/`([A-Za-z][A-Za-z0-9]*)`/g)].map((m) => m[1]).filter((n) => folderOf.has(n));
/** The components an entry is about: the code names in its short line. */
const componentNames = (e: Entry) => [...new Set(namesIn(e.summary))];

type DocPage = { id: string; title: string };
const flat = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Docs pages of the components, from Storybook's index: folder → pages. A folder with several pages (dialog: Dialog
 * and Alert Dialog) gives the page named like the component, else the first.
 */
function useDocPages() {
  const [pages, setPages] = useState<Map<string, DocPage>>(new Map());
  useEffect(() => {
    let live = true;
    fetch('./index.json')
      .then((r) => r.json())
      .then((index: { entries: Record<string, { id: string; title: string; type: string; importPath: string }> }) => {
        const byFolder = new Map<string, DocPage[]>();
        for (const e of Object.values(index.entries)) {
          const folder = e.type === 'docs' && e.importPath.match(/packages\/ui\/src\/([^/]+)\//)?.[1];
          if (!folder || !e.title.startsWith('Components/')) continue;
          byFolder.set(folder, [...(byFolder.get(folder) ?? []), { id: e.id, title: e.title.split('/').at(-1)! }]);
        }
        const map = new Map<string, DocPage>();
        for (const [name, folder] of folderOf) {
          const list = byFolder.get(folder);
          if (list) map.set(name, list.find((p) => flat(p.title) === flat(name)) ?? list[0]);
        }
        if (live) setPages(map);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  return pages;
}

/** The docs pages of an entry, without doubles (Dialog and AlertDialog stay two, Step and Stepper are one). */
const pagesOf = (e: Entry, pages: Map<string, DocPage>) => [...new Map(componentNames(e).flatMap((n) => (pages.has(n) ? [[pages.get(n)!.id, pages.get(n)!]] : []))).values()];

/* ---------- Filter ---------- */

type Filter = { pkg: 'all' | 'UI' | 'Tokens'; breaking: boolean; component: string | null };
const matches = (e: Entry, f: Filter, pages: Map<string, DocPage>) =>
  (f.pkg === 'all' || e.packages.has(f.pkg)) && (!f.breaking || !!e.breaking) && (!f.component || pagesOf(e, pages).some((p) => p.id === f.component));
const shown = (r: Release, f: Filter, pages: Map<string, DocPage>) => [...r.entries.values()].filter((e) => matches(e, f, pages));
const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const plural = (n: number, word: string) => `${n} ${word}${n === 1 || word.endsWith('s') ? '' : 's'}`;
const formatDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/** “3 new · 4 improved · 2 fixed · 1 breaking” */
function counts(entries: Entry[]) {
  const parts = CATEGORIES.map((c) => [entries.filter((e) => e.category === c).length, c.toLowerCase()] as const)
    .filter(([n]) => n)
    .map(([n, word]) => `${n} ${word}`);
  const breaking = entries.filter((e) => e.breaking).length;
  return [...parts, ...(breaking ? [`${breaking} breaking`] : [])].join(' · ');
}

/* ---------- Rendering ---------- */

/** The details of an entry: paragraphs and lists, as written in the changeset. */
function Details({ blocks }: { blocks: string[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.startsWith('- ')) {
          const items = block.split(/\n(?=- )/).map((item) => item.slice(2).replace(/\s*\n\s*/g, ' '));
          return (
            <List key={i} size="md">
              {items.map((item) => (
                <ListItem key={item}>
                  <Rich>{item}</Rich>
                </ListItem>
              ))}
            </List>
          );
        }
        return (
          <p key={i}>
            <Rich>{block.replace(/\s*\n\s*/g, ' ')}</Rich>
          </p>
        );
      })}
    </>
  );
}

/** One change: the short line in bold, the details, then components, packages and commit. */
function Change({ e, pages }: { e: Entry; pages: Map<string, DocPage> }) {
  const docs = pagesOf(e, pages);
  return (
    <li className="doc-change">
      <p className="doc-change__summary">
        <Rich>{capital(e.summary)}</Rich>
        {e.breaking && (
          <>
            {' '}
            <Badge tone="danger" size="sm">
              Breaking
            </Badge>
          </>
        )}
      </p>
      {e.body.length > 0 && (
        <div className="doc-change__details">
          <Details blocks={e.body} />
        </div>
      )}
      <p className="doc-change__meta medo-text-body-sm doc-muted">
        {docs.map((p) => (
          <Link key={p.id} href={docsHref(p.id)}>
            {p.title}
          </Link>
        ))}
        {/* Most changes are in UI: only the tokens package is named. */}
        {e.packages.has('Tokens') && (
          <Badge tone="neutral" size="sm">
            {e.packages.has('UI') ? 'UI + Tokens' : 'Tokens'}
          </Badge>
        )}
        <Link href={`${repoUrl}/commit/${e.id}`} target="_blank" external>
          {e.id}
        </Link>
      </p>
    </li>
  );
}

/** A release: date and kind, “Before you update” for breaking changes, then New · Improved · Fixed. */
function ReleaseBody({ r, entries, level, pages }: { r: Release; entries: Entry[]; level: 3 | 4 | 5; pages: Map<string, DocPage> }) {
  const H = `h${level}` as 'h3';
  const breaking = entries.filter((e) => e.breaking);
  return (
    <div className="doc-release-body">
      {breaking.length > 0 && (
        <Alert tone="warning" title="Before you update">
          <List size="md">
            {breaking.map((e) => (
              <ListItem key={e.key}>
                <span className="doc-breaking">
                  <span>
                    {componentNames(e)[0] && <strong>{`${componentNames(e)[0]}: `}</strong>}
                    <Rich>{capital(e.breaking!.what)}</Rich>
                  </span>
                  {e.breaking!.update && (
                    <span>
                      <strong>Update: </strong>
                      <Rich>{capital(e.breaking!.update)}</Rich>
                    </span>
                  )}
                </span>
              </ListItem>
            ))}
          </List>
        </Alert>
      )}
      {CATEGORIES.map((c) => {
        const list = entries.filter((e) => e.category === c);
        if (!list.length) return null;
        return (
          <section key={c} className="doc-release-group" aria-labelledby={`release-${r.version}-${c}`}>
            <H id={`release-${r.version}-${c}`} className="medo-text-heading-sm">
              {c} <span className="doc-muted">{list.length}</span>
            </H>
            <ul className="doc-changes">
              {list.map((e) => (
                <Change key={e.key} e={e} pages={pages} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

const releaseMeta = (r: Release, entries: Entry[]) => [r.date && formatDate(r.date), `${r.kind} release`, counts(entries)].filter(Boolean).join(' · ');

/* ---------- Series: 0.4.1 and 0.4.0 belong to 0.4.x ---------- */

const seriesOf = (version: string) => version.split('.').slice(0, 2).join('.') + '.x';
type Series = { name: string; releases: Release[] };
// The newest release has its own section; the earlier ones are grouped by series.
const [latest, ...older] = byVersion;
const series: Series[] = [];
for (const r of older) {
  const name = seriesOf(r.version);
  const last = series.at(-1);
  if (last?.name === name) last.releases.push(r);
  else series.push({ name, releases: [r] });
}

/** Table of contents: the open latest release and the collapsed earlier ones. */
export const nav = [`Latest: ${latest?.version}`, ...(series.length ? ['Earlier releases'] : [])];

/**
 * The latest release open as a docs section, earlier releases collapsed by series in an Accordion (closed panels stay
 * searchable with the browser search). The filters apply to all of them.
 */
export function Changelog() {
  const pages = useDocPages();
  const [filter, setFilter] = useState<Filter>({ pkg: 'all', breaking: false, component: null });
  if (!latest) return null;
  const set = (change: Partial<Filter>) => setFilter((f) => ({ ...f, ...change }));
  const count = byVersion.reduce((n, r) => n + shown(r, filter, pages).length, 0);
  const latestEntries = shown(latest, filter, pages);
  const visibleSeries = series.filter((s) => s.releases.some((r) => shown(r, filter, pages).length));
  // The components that appear in the changelog, A–Z.
  const components = [...new Map(byVersion.flatMap((r) => [...r.entries.values()].flatMap((e) => pagesOf(e, pages).map((p) => [p.id, p] as const)))).values()].sort(
    (a, b) => a.title.localeCompare(b.title),
  );

  const filters: ReactNode = (
    <div className="doc-changelog-filter">
      <Select
        aria-label="Component"
        placeholder="All components"
        clearable
        selectedKey={filter.component}
        onSelectionChange={(key) => set({ component: (key as string) ?? null })}
        items={components}
      >
        {(p) => <Option id={p.id}>{p.title}</Option>}
      </Select>
      <ToggleButtonGroup
        aria-label="Package"
        selectionMode="single"
        variant="segmented"
        disallowEmptySelection
        selectedKeys={new Set([filter.pkg])}
        onSelectionChange={(keys) => set({ pkg: [...keys][0] as Filter['pkg'] })}
      >
        <ToggleButton id="all">All packages</ToggleButton>
        <ToggleButton id="UI">UI</ToggleButton>
        <ToggleButton id="Tokens">Tokens</ToggleButton>
      </ToggleButtonGroup>
      <Switch isSelected={filter.breaking} onChange={(breaking) => set({ breaking })}>
        Only breaking
      </Switch>
      {/* Polite live region: the number of changes is announced after every filter change. */}
      <span role="status" className="medo-text-body-sm doc-muted">
        {`${plural(count, 'change')} in all releases`}
      </span>
    </div>
  );

  return (
    <>
      <DocSection n={1} title={nav[0]} meta={releaseMeta(latest, [...latest.entries.values()])}>
        {filters}
        {latestEntries.length ? (
          <ReleaseBody r={latest} entries={latestEntries} level={3} pages={pages} />
        ) : (
          <p className="doc-muted">No changes of this kind in {latest.version}.</p>
        )}
      </DocSection>

      {series.length > 0 && (
        <DocSection n={2} title="Earlier releases" meta={plural(older.length, 'release')}>
          {visibleSeries.length ? (
            <Accordion headingLevel={3}>
              {visibleSeries.map((s) => {
                const entries = s.releases.flatMap((r) => shown(r, filter, pages));
                const breaking = entries.filter((e) => e.breaking).length;
                const dates = s.releases.map((r) => r.date).filter(Boolean) as string[];
                return (
                  <AccordionItem
                    key={s.name}
                    id={s.name}
                    title={s.name}
                    description={[
                      dates.length && formatDate(dates.at(-1)!) + (dates.at(-1) !== dates[0] ? ` – ${formatDate(dates[0])}` : ''),
                      plural(s.releases.length, 'release'),
                      plural(entries.length, 'change'),
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                    badge={
                      breaking ? (
                        <Badge tone="danger" size="sm">
                          {`${breaking} breaking`}
                        </Badge>
                      ) : undefined
                    }
                  >
                    <div className="doc-changelog-releases">
                      {s.releases.map((r) => {
                        const list = shown(r, filter, pages);
                        if (!list.length) return null;
                        return (
                          <section key={r.version} className="doc-release" aria-labelledby={`release-${r.version}`}>
                            <div className="doc-release-head">
                              <h4 id={`release-${r.version}`} className="medo-text-heading-md">
                                {r.version}
                              </h4>
                              <span className="medo-text-body-sm doc-muted">{releaseMeta(r, list)}</span>
                            </div>
                            <ReleaseBody r={r} entries={list} level={5} pages={pages} />
                          </section>
                        );
                      })}
                    </div>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <p className="doc-muted">No changes of this kind in earlier releases.</p>
          )}
        </DocSection>
      )}
    </>
  );
}
