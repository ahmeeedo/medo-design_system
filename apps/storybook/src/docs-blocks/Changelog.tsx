/// <reference types="vite/client" />
/**
 * “What's new”: the changelogs of both packages, read at build time from their CHANGELOG.md (written by Changesets).
 * Nothing to maintain by hand – a release adds its entries here automatically.
 */
import { useState } from 'react';
import { Accordion, AccordionItem, Badge, Link, ToggleButton, ToggleButtonGroup } from '@med-o/ui';
import uiLog from '../../../../packages/ui/CHANGELOG.md?raw';
import tokensLog from '../../../../packages/tokens/CHANGELOG.md?raw';
import { DocSection } from './DocBlocks';
import { Rich } from './text';

type Kind = 'Major' | 'Minor' | 'Patch';
type Entry = { id: string; text: string; kind: Kind; packages: Set<string> };
type Release = { version: string; entries: Map<string, Entry> };

const REPO = 'https://github.com/ahmeeedo/medo-design_system';
const rank: Record<Kind, number> = { Major: 0, Minor: 1, Patch: 2 };

/** Versions → entries “- <commit>: text” with their kind; dependency notes are left out. */
function parse(log: string, pkg: string, releases: Map<string, Release>) {
  let release: Release | undefined;
  let kind: Kind = 'Patch';
  let entry: Entry | undefined;
  for (const line of log.split('\n')) {
    const version = line.match(/^## (\S+)/);
    if (version) {
      release = releases.get(version[1]) ?? { version: version[1], entries: new Map() };
      releases.set(version[1], release);
      entry = undefined;
      continue;
    }
    const heading = line.match(/^### (Major|Minor|Patch) Changes/);
    if (heading) {
      kind = heading[1] as Kind;
      continue;
    }
    const item = line.match(/^- ([0-9a-f]{7,}): (.*)/);
    if (item && release) {
      entry = release.entries.get(item[1]) ?? { id: item[1], text: item[2], kind, packages: new Set() };
      if (rank[kind] < rank[entry.kind]) entry.kind = kind;
      entry.packages.add(pkg);
      release.entries.set(item[1], entry);
      continue;
    }
    // Continuation lines of an entry; “- @med-o/…” and “Updated dependencies” are package bookkeeping.
    if (entry && /^ {2}\S/.test(line) && !/^ {2}- @med-o\//.test(line)) entry.text += ` ${line.trim()}`;
    if (/^- Updated dependencies/.test(line)) entry = undefined;
  }
}

const releases = new Map<string, Release>();
parse(uiLog, 'UI', releases);
parse(tokensLog, 'Tokens', releases);
const byVersion = [...releases.values()].sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }));

export const latestVersion = byVersion[0]?.version;

/* ---------- Series: 0.4.1 and 0.4.0 belong to 0.4.x ---------- */

const seriesOf = (version: string) => version.split('.').slice(0, 2).join('.') + '.x';
type Series = { name: string; releases: Release[] };
const series: Series[] = [];
for (const r of byVersion) {
  const name = seriesOf(r.version);
  const last = series.at(-1);
  if (last?.name === name) last.releases.push(r);
  else series.push({ name, releases: [r] });
}
const [latest, ...earlier] = series;

/** Table of contents: the open latest series and the collapsed earlier ones. */
export const nav = [`Latest: ${latest?.name}`, ...(earlier.length ? ['Earlier releases'] : [])];

/* ---------- Filter ---------- */

type Filter = 'all' | 'breaking' | 'UI' | 'Tokens';
const isBreaking = (e: Entry) => /\*\*(Breaking|Behaviour change)/.test(e.text);
const matches = (e: Entry, f: Filter) => f === 'all' || (f === 'breaking' ? isBreaking(e) : e.packages.has(f));
const shown = (r: Release, f: Filter) => [...r.entries.values()].filter((e) => matches(e, f)).sort((a, b) => rank[a.kind] - rank[b.kind]);
const plural = (n: number, word: string) => `${n} ${word}${n === 1 || word.endsWith('s') ? '' : 's'}`;

/* ---------- Rendering ---------- */

/** One change in one line of text: tags, text, commit link. */
function EntryItem({ e }: { e: Entry }) {
  return (
    <li>
      {isBreaking(e) && (
        <Badge tone="danger" size="sm">
          Breaking
        </Badge>
      )}
      {[...e.packages].map((p) => (
        <Badge key={p} tone="neutral" size="sm">
          {p}
        </Badge>
      ))}{' '}
      <Rich>{e.text}</Rich>{' '}
      <Link href={`${REPO}/commit/${e.id}`} target="_blank" external>
        {e.id}
      </Link>
    </li>
  );
}

/** The releases of a series, each with its version as heading. */
function Releases({ list, filter, level }: { list: Release[]; filter: Filter; level: 3 | 4 }) {
  const H = `h${level}` as 'h3';
  return (
    <div className="doc-changelog-releases">
      {list.map((r) => {
        const entries = shown(r, filter);
        if (!entries.length) return null;
        return (
          <section key={r.version} className="doc-changelog-release" aria-labelledby={`release-${r.version}`}>
            <H id={`release-${r.version}`} className="medo-text-heading-sm">
              {r.version} <span className="medo-text-code-sm doc-muted">{`${entries[0].kind} release`}</span>
            </H>
            <ul className="doc-changelog">
              {entries.map((e) => (
                <EntryItem key={e.id} e={e} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/**
 * The latest series open as a docs section, earlier series collapsed in an Accordion (closed panels stay
 * searchable with the browser search). The filter applies to all of them.
 */
export function Changelog() {
  const [filter, setFilter] = useState<Filter>('all');
  if (!latest) return null;
  const count = byVersion.reduce((n, r) => n + shown(r, filter).length, 0);
  const visibleEarlier = earlier.filter((s) => s.releases.some((r) => shown(r, filter).length));

  return (
    <>
      <DocSection n={1} title={nav[0]} meta={plural(latest.releases.length, 'release')}>
        <div className="doc-changelog-filter">
          <ToggleButtonGroup
            aria-label="Show changes"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={new Set([filter])}
            onSelectionChange={(keys) => setFilter([...keys][0] as Filter)}
          >
            <ToggleButton id="all">All</ToggleButton>
            <ToggleButton id="breaking">Breaking</ToggleButton>
            <ToggleButton id="UI">UI</ToggleButton>
            <ToggleButton id="Tokens">Tokens</ToggleButton>
          </ToggleButtonGroup>
          {/* Polite live region: the number of changes is announced after every filter change. */}
          <span role="status" className="medo-text-body-sm doc-muted">
            {`${plural(count, 'change')} in all releases`}
          </span>
        </div>
        {latest.releases.some((r) => shown(r, filter).length) ? (
          <Releases list={latest.releases} filter={filter} level={3} />
        ) : (
          <p className="doc-muted">No changes of this kind in {latest.name}.</p>
        )}
      </DocSection>

      {earlier.length > 0 && (
        <DocSection n={2} title="Earlier releases" meta={plural(earlier.length, 'series')}>
          {visibleEarlier.length ? (
            <Accordion headingLevel={3} allowsMultipleExpanded>
              {visibleEarlier.map((s) => {
                const entries = s.releases.flatMap((r) => shown(r, filter));
                const breaking = entries.filter(isBreaking).length;
                return (
                  <AccordionItem
                    key={s.name}
                    id={s.name}
                    title={s.name}
                    description={[plural(s.releases.length, 'release'), plural(entries.length, 'change')].join(' · ')}
                    badge={
                      breaking ? (
                        <Badge tone="danger" size="sm">
                          {`${breaking} breaking`}
                        </Badge>
                      ) : undefined
                    }
                  >
                    <Releases list={s.releases} filter={filter} level={4} />
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
