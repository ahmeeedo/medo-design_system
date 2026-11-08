// Checks on the built docs site:
//  1. Every prop in a Playground table has a description – what readers actually see.
//  2. The Storybook UI still has the elements our styles in .storybook/manager.ts hang on. Storybook's class names
//     are not a public API; after a Storybook update a missing one fails here instead of the sidebar losing its look.
// Vitest runs without Storybook's docgen, so this check needs the static build (npm run check:docs builds it first).
// A missing description: JSDoc on the prop in the component, or – for a React Aria prop used in many components –
// apps/storybook/.storybook/prop-docs.ts. The other docs rules run with npm test (Tests/Docs rules).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const root = new URL('../apps/storybook/storybook-static/', import.meta.url).pathname;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png' };

const server = createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  try {
    const file = path.endsWith('/') ? `${path}index.html` : path;
    const body = await readFile(join(root, file));
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' }).end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://localhost:${server.address().port}`;

const index = JSON.parse(await readFile(join(root, 'index.json'), 'utf8'));
const pages = Object.values(index.entries).filter((e) => e.type === 'docs' && e.title.startsWith('Components/'));

const browser = await chromium.launch();
const problems = [];
const queue = [...pages];
await Promise.all(
  Array.from({ length: 4 }, async () => {
    const page = await browser.newPage();
    for (let entry; (entry = queue.shift()); ) {
      await page.goto(`${base}/iframe.html?id=${entry.id}&viewMode=docs`);
      await page.locator('#storybook-docs h1').first().waitFor({ timeout: 30_000 });
      // A row without a description has only the type next to the name (PropsTable: .doc-props-desc).
      const missing = await page.locator('.doc-props tbody tr').evaluateAll((rows) =>
        rows
          .filter((row) => row.querySelector('.doc-props-desc') && !row.querySelector('.doc-props-desc > span:not(.doc-props-type)'))
          .map((row) => row.querySelector('.doc-props-name')?.firstElementChild?.textContent?.trim()),
      );
      for (const name of missing) problems.push(`${entry.title}: ${name}`);
    }
    await page.close();
  }),
);

// The anchors of the rules in manager.ts (states such as :hover and search results are not on screen at load).
const uiAnchors = [
  '#medo-ui',
  '#storybook-explorer-menu .sidebar-item',
  "#storybook-explorer-menu .sidebar-item[data-selected='true']",
  '#storybook-explorer-menu .sidebar-subheading',
  '#storybook-explorer-menu .sidebar-subheading-action',
  '#storybook-explorer-menu :is(#foundations, #guides, #patterns)',
  '.search-field input',
  '.sidebar-header button',
  "[role='toolbar'] button",
  '.medo-ui-status',
  '.medo-ui-label',
];
const ui = await browser.newPage();
await ui.goto(`${base}/?path=/docs/${pages[0].id}`);
await ui.locator('#storybook-explorer-menu .sidebar-item').first().waitFor({ timeout: 30_000 }).catch(() => {});
for (const selector of uiAnchors) if (!(await ui.locator(selector).count())) problems.push(`Storybook UI: nothing matches ${selector} (manager.ts)`);
await ui.close();

await browser.close();
server.close();

if (problems.length) {
  console.error(`${problems.sort().join('\n')}\n\n× ${problems.length} problem${problems.length > 1 ? 's' : ''}`);
  process.exit(1);
}
console.log(`✓ Docs: every prop described on ${pages.length} component pages; Storybook UI: ${uiAnchors.length} style anchors found`);
