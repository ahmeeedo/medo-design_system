/**
 * dist/manifest.json (export "@med-o/ui/manifest.json"): what the docs site needs to know about each component, in one
 * file. Per component with a docs page: status, Storybook id, Figma link, the props as the Storybook Playground lists
 * them, the Playground controls, and the docs data of the story file (parameters.medo: usage, a11y, styling).
 *
 * Sources – the same ones Storybook uses, so both show the same text:
 *   props        react-docgen on the component file (Storybook's docgen), then the argTypes and args of the story meta.
 *                Descriptions: argTypes > JSDoc > apps/storybook/.storybook/prop-docs.ts (props from React Aria).
 *   status       the tag "status:<level>"; Storybook id from the title.
 * The story files are loaded with Vite (no Storybook build needed). The build fails when a docs page has no
 * component file for meta.component or a prop has no description – the rule of npm run check:docs.
 */
import { globSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { builtinResolvers, parse } from 'react-docgen';
import { sanitize } from 'storybook/internal/csf';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('./', import.meta.url));
const out = fileURLToPath(new URL('./dist/manifest.json', import.meta.url));
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

/** The Figma library; parameters.medo.figma holds the node id of the component (set) in it. */
const FIGMA_FILE = 'https://www.figma.com/design/vOTfMtcpCwAJjuSZUkfpfj/med.o-Design-System';
/** Plain React props, left out of the Playground in Storybook too (preview.ts: controls.exclude). */
const EXCLUDED = new Set(['className', 'style']);
/** argTypes in this category are Playground helpers, not props (e.g. "icon" for startIcon / endIcon). */
const PLAYGROUND = 'Playground';

/* ---------- docgen: the component files ---------- */

const docgen = new Map();
const resolver = new builtinResolvers.FindExportedDefinitionsResolver();
for (const file of globSync('src/**/*.tsx', { cwd: root })) {
  if (file.endsWith('.stories.tsx') || file.endsWith('story-helpers.tsx')) continue;
  const code = readFileSync(`${root}${file}`, 'utf8');
  let docs = [];
  try {
    docs = parse(code, { filename: `${root}${file}`, resolver });
  } catch {
    // A file without a component definition.
  }
  for (const doc of docs) if (doc.displayName) docgen.set(doc.displayName, doc);
}

/* ---------- story files ---------- */

const server = await createServer({
  root,
  configFile: false,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false, ws: false },
  resolve: { conditions: ['@med-o/source'] },
  optimizeDeps: { noDiscovery: true, include: [] },
});

let components = [];
const problems = [];
try {
  const { sharedPropDocs } = await server.ssrLoadModule(fileURLToPath(new URL('../../apps/storybook/.storybook/prop-docs.ts', import.meta.url)));
  for (const file of globSync('src/**/*.stories.tsx', { cwd: root }).sort()) {
    const module = await server.ssrLoadModule(`/${file}`);
    const meta = module.default;
    if (!meta?.title?.startsWith('Components/') || !meta.tags?.includes('autodocs')) continue;
    const name = meta.title.split('/').at(-1);
    // Without meta.component (e.g. Toast: a function, toast()) the props come from the argTypes alone.
    const component = meta.component;
    const doc = component ? docgen.get(component.displayName ?? component.name) : {};
    if (!doc) {
      problems.push(`${meta.title}: no docgen data for meta.component`);
      continue;
    }
    components.push(describe(name, meta, module.Playground, doc, sharedPropDocs));
  }
} finally {
  await server.close();
}

/* ---------- one component ---------- */

function serializable(value) {
  return ['string', 'number', 'boolean'].includes(typeof value) ? value : undefined;
}

function describe(name, meta, playgroundStory, doc, sharedPropDocs) {
  const medo = meta.parameters?.medo ?? {};
  const argTypes = { ...meta.argTypes, ...playgroundStory?.argTypes };
  const args = { ...meta.args, ...playgroundStory?.args };

  // Props: docgen, then argTypes (description and control win), then args that a shared description covers.
  const props = new Map();
  for (const [prop, info] of Object.entries(doc.props ?? {})) {
    props.set(prop, {
      name: prop,
      type: info.tsType?.raw ?? info.tsType?.name,
      required: Boolean(info.required),
      default: info.defaultValue?.value,
      description: info.description || undefined,
    });
  }
  for (const [prop, argType] of Object.entries(argTypes)) {
    if (argType?.table?.category === PLAYGROUND) continue;
    const known = props.get(prop) ?? { name: prop, required: false };
    props.set(prop, { ...known, description: argType?.description || known.description });
  }
  for (const prop of Object.keys(args)) if (!props.has(prop) && sharedPropDocs[prop]) props.set(prop, { name: prop, required: false });
  for (const prop of props.values()) {
    prop.description ??= sharedPropDocs[prop.name];
    // Props from React Aria have no docgen type here; the arg tells it (as Storybook infers it).
    prop.type ??= typeOf(args[prop.name]);
  }

  const list = [...props.values()].filter((p) => !EXCLUDED.has(p.name) && !argTypes[p.name]?.table?.disable);
  for (const p of list) if (!p.description) problems.push(`${meta.title}: prop "${p.name}" has no description`);

  const { automated, ...screenReader } = medo.a11y?.screenReader ?? {};
  return {
    name,
    title: meta.title,
    status: meta.tags.map((t) => /^status:(\w+)$/.exec(t)?.[1]).find(Boolean),
    storybookId: `${sanitize(meta.title)}--docs`,
    figma: medo.figma ? `${FIGMA_FILE}?node-id=${medo.figma.replace(':', '-')}` : undefined,
    subtitle: medo.subtitle,
    description: meta.parameters?.docs?.description?.component,
    props: list,
    playground: playground(argTypes, args),
    usage: medo.usage,
    a11y: medo.a11y ? { ...medo.a11y, screenReader: medo.a11y.screenReader ? screenReader : undefined } : undefined,
    styling: medo.styling,
  };
}

/**
 * The controls of the Playground story: every argType with a control, then every arg without an argType (Storybook
 * infers a Switch or a text field for those). Name, kind, options, default; in the order of argTypes, then args.
 */
function playground(argTypes, args) {
  const controls = [];
  for (const name of new Set([...Object.keys(argTypes), ...Object.keys(args)])) {
    const argType = argTypes[name];
    if (EXCLUDED.has(name) || argType?.control === false || argType?.control?.disable) continue;
    const control = argType?.control?.type ?? argType?.control ?? inferred(args[name]);
    if (!control) continue;
    const entry = { name, control, default: serializable(args[name]) };
    if (argType?.options) entry.options = [...argType.options];
    // A mapping of plain values travels along (icon → the prop that gets the icon); one with elements does not.
    if (argType?.mapping && Object.values(argType.mapping).every((v) => v === undefined || typeof v === 'string')) entry.mapping = argType.mapping;
    if (argType?.description && argType.table?.category === PLAYGROUND) entry.description = argType.description;
    controls.push(entry);
  }
  return controls.length ? { controls } : undefined;
}

/** The control Storybook infers from an arg value. */
function inferred(value) {
  return { boolean: 'boolean', string: 'text', number: 'number' }[typeof value];
}

function typeOf(value) {
  return { boolean: 'boolean', string: 'string', number: 'number', function: 'function' }[typeof value];
}

/* ---------- write ---------- */

if (problems.length) {
  console.error(`${problems.sort().join('\n')}\n\n× ${problems.length} problem${problems.length > 1 ? 's' : ''} in the manifest`);
  process.exit(1);
}

components = components.sort((a, b) => a.name.localeCompare(b.name));
mkdirSync(fileURLToPath(new URL('./dist/', import.meta.url)), { recursive: true });
writeFileSync(out, `${JSON.stringify({ package: pkg.name, version: pkg.version, components }, null, 2)}\n`);
console.log(`dist/manifest.json ${components.length} components`);
