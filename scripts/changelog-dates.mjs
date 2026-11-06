/**
 * Adds the release date under each new version heading of the package changelogs (“_Released 2026-11-03_”).
 * Runs after `changeset version` (npm run version-packages), so the date is the day of the Version Packages pull
 * request's last update – the day it is merged and published, as a rule. The heading itself stays the bare version:
 * the release action finds the GitHub release notes by it.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const today = new Date().toISOString().slice(0, 10);

for (const file of ['packages/ui/CHANGELOG.md', 'packages/tokens/CHANGELOG.md']) {
  const lines = readFileSync(file, 'utf8').split('\n');
  const out = [];
  lines.forEach((line, i) => {
    out.push(line);
    if (!/^## \d+\.\d+\.\d+/.test(line)) return;
    const next = lines.slice(i + 1).find((l) => l.trim());
    if (!next?.startsWith('_Released ')) out.push('', `_Released ${today}_`);
  });
  writeFileSync(file, out.join('\n'));
}
