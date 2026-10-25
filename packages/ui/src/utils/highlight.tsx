import type { ReactNode } from 'react';

const plain = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase();

/**
 * Splits a text into parts that match the query and parts that don't – contains match, case and
 * accent insensitive („mul“ → „Müller“). Indices stay in the original text. `all`: every match, else the first.
 */
export function matchParts(text: string, query: string, all = false): { text: string; match: boolean }[] {
  const q = plain(query.trim());
  if (!q) return [{ text, match: false }];
  // Map every character of the text to its plain form, so indices stay in the original text.
  const chars = [...text];
  const map: number[] = [];
  let flat = '';
  chars.forEach((char, i) => {
    const p = plain(char);
    flat += p;
    for (let k = 0; k < p.length; k++) map.push(i);
  });
  const parts: { text: string; match: boolean }[] = [];
  let last = 0;
  let from = 0;
  while (from <= flat.length - q.length) {
    const at = flat.indexOf(q, from);
    if (at < 0) break;
    const start = map[at];
    const end = map[at + q.length - 1] + 1;
    if (start > last) parts.push({ text: chars.slice(last, start).join(''), match: false });
    parts.push({ text: chars.slice(start, end).join(''), match: true });
    last = end;
    from = at + q.length;
    if (!all) break;
  }
  if (last < chars.length) parts.push({ text: chars.slice(last).join(''), match: false });
  return parts;
}

/** Shows the matching parts of a text in bold (`className` on each match). Visual only; screen readers read plain text. */
export function Highlight({
  text,
  query,
  all = false,
  as: Tag = 'mark',
  className,
}: {
  text: string;
  query?: string;
  all?: boolean;
  as?: 'mark' | 'span';
  className?: string;
}): ReactNode {
  if (!query?.trim()) return text;
  return matchParts(text, query, all).map((part, i) =>
    part.match ? (
      <Tag key={i} className={className}>
        {part.text}
      </Tag>
    ) : (
      part.text
    ),
  );
}
