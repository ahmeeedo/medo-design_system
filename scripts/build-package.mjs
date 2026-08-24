/* Assembles the package's style entry point and checks the result against the
   delivery contract. Runs after `vite build --config vite.config.lib.js`;
   `npm run build:lib` chains the two.

   styles.css is the concatenation of three parts, in the order the cascade
   needs: the foundation (fonts, the three token layers, the theme, the icon
   axes), then the component stylesheets, then the component theme overrides.
   Only the first pair is order-critical — the overrides prefix their selectors
   with :root and win by specificity — but the documented order is kept so the
   built file reads like the source.

   Everything below the assembly is a gate, not a report: the package must not
   carry portal dependencies, and the style entry point must be complete. Both
   are checked against the sources rather than a written-down list, so neither
   can drift. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = path.join(root, 'dist-lib')

const PORTAL_DEPENDENCIES = ['react-i18next', 'react-router-dom', 'fuse.js', 'i18next']

const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '')
const banner = (text) => `/* ${'='.repeat(74)}\n   ${text}\n   ${'='.repeat(74)} */\n\n`

/* ── Assembly ───────────────────────────────────────────────────────────── */

const overrides = read('src/styles/medo-theme-components.css')

/* The overrides go in unprocessed, so anything the bundler would have had to
   resolve has to be absent. Today it is; this fails the build if that changes. */
for (const pattern of [/@import/, /url\(/]) {
  if (pattern.test(overrides)) {
    throw new Error(
      `src/styles/medo-theme-components.css now contains ${pattern.source}. ` +
        'It is concatenated verbatim and can no longer be — route it through the bundler.'
    )
  }
}

const styles =
  banner('medo Design System · foundation: fonts, tokens, theme, icon axes') +
  read('dist-lib/tokens.css') +
  '\n' +
  banner('medo Design System · component stylesheets') +
  read('dist-lib/index.css') +
  '\n' +
  banner('medo Design System · component theme overrides') +
  overrides

fs.writeFileSync(path.join(out, 'styles.css'), styles)

/* Two build leftovers, neither of them part of the package: tokens.js is the
   empty javascript chunk of a css-only entry, and index.css has just been
   folded into styles.css. Removing them keeps every shipped file reachable
   through the export map. */
fs.rmSync(path.join(out, 'tokens.js'), { force: true })
fs.rmSync(path.join(out, 'index.css'), { force: true })

/* ── Gate: no portal dependencies ───────────────────────────────────────── */

const javascript = fs
  .readdirSync(out)
  .filter((name) => name.endsWith('.js'))
  .map((name) => ({ name, source: fs.readFileSync(path.join(out, name), 'utf8') }))

const leaked = PORTAL_DEPENDENCIES.flatMap((dependency) =>
  javascript
    .filter(({ source }) => source.includes(dependency))
    .map(({ name }) => `${name} references ${dependency}`)
)

if (leaked.length > 0) {
  throw new Error(`Portal dependencies in the package build:\n  ${leaked.join('\n  ')}`)
}

/* ── Gate: the style entry point is complete ────────────────────────────── */

const componentStyles = fs
  .readdirSync(path.join(root, 'src/components'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => `src/components/${entry.name}/${entry.name}.css`)
  .filter((relative) => fs.existsSync(path.join(root, relative)))

const required = [
  'src/styles/fonts.css',
  'src/styles/medo/brand-colors.css',
  'src/styles/medo/alias-colors.css',
  'src/styles/medo/semantic-colors.css',
  'src/styles/medo/typography.css',
  'src/styles/medo/spacing.css',
  'src/styles/medo/radii.css',
  'src/styles/medo/elevation.css',
  'src/styles/medo/layout.css',
  'src/styles/medo-theme.css',
  'src/styles/medo-theme-components.css',
  'src/styles/icons.css',
  ...componentStyles,
]

/* Every custom property and every class a source file declares has to survive
   into the bundle. Comments are dropped on both sides so a name mentioned in
   prose cannot stand in for a declaration. */
const names = (css) => [
  ...new Set([
    ...(stripComments(css).match(/--medo-[a-z0-9-]+/g) ?? []),
    ...(stripComments(css).match(/\.medo-[a-zA-Z0-9_-]+/g) ?? []),
  ]),
]

const built = stripComments(styles)
const missing = required.flatMap((relative) => {
  const absent = names(read(relative)).filter((name) => !built.includes(name))
  return absent.length > 0 ? [`${relative}: ${absent.slice(0, 5).join(', ')}`] : []
})

if (missing.length > 0) {
  throw new Error(`Style entry point is missing declarations from:\n  ${missing.join('\n  ')}`)
}

/* ── Gate: fonts and icon access ────────────────────────────────────────── */

const fontUrls = [...built.matchAll(/url\("([^"]+\.woff2)"\)/g)].map((match) => match[1])
if (fontUrls.length === 0) throw new Error('Style entry point declares no font files.')

const brokenFonts = fontUrls.filter((url) => !fs.existsSync(path.join(out, url)))
if (brokenFonts.length > 0) {
  throw new Error(`Font files missing from the package: ${brokenFonts.join(', ')}`)
}

if (!/\.material-symbols-rounded\s*\{[^}]*'wght'\s*300/.test(built)) {
  throw new Error('Style entry point does not carry the Material Symbols axis rule.')
}

const manifest = JSON.parse(read('package.json'))
if (!manifest.dependencies?.['material-symbols']) {
  throw new Error('material-symbols is no longer a dependency — the icon face would be unreachable.')
}


/* ── Types ──────────────────────────────────────────────────────────────── */

/* src/types/ holds verbatim copies of design-reference/ui/*.d.ts — the contracts
   the components were ported against. They are copied, never edited; a changed
   contract comes from the design project. index.d.ts below is generated from the
   barrel so the declared surface cannot drift from the exported one. */

/* The reference names this contract in the singular. It declares exactly the
   three exports the MenuButtons module ships. */
const CONTRACT_ALIASES = { MenuButtons: 'MenuButton' }

/* Ported and exported, but the reference carries no contract for it at all —
   no .d.ts, no .jsx, no specification page of its own. Declared permissively so
   the export resolves, and reported as a gap on every build until the design
   project supplies the contract. Nothing about its props is asserted here. */
const WITHOUT_CONTRACT = { Textarea: 'no contract in design-reference' }

const typesOut = path.join(out, 'types')
fs.mkdirSync(typesOut, { recursive: true })

const contracts = fs.readdirSync(path.join(root, 'src/types')).filter((f) => f.endsWith('.d.ts'))
for (const file of contracts) {
  fs.copyFileSync(path.join(root, 'src/types', file), path.join(typesOut, file))
}

const barrel = read('src/components/index.js')
const modules = [...barrel.matchAll(/export \{([^}]+)\} from '\.\/([^/]+)\//g)].map((match) => ({
  name: match[2],
  exports: match[1].split(',').map((name) => name.trim()).filter(Boolean),
}))

const declaredIn = (contract) => {
  const source = fs.readFileSync(path.join(typesOut, `${contract}.d.ts`), 'utf8')
  return {
    values: new Set([...source.matchAll(/export\s+(?:declare\s+)?(?:const|function|class)\s+(\w+)/g)].map((m) => m[1])),
    types: [...source.matchAll(/export\s+(?:interface|type)\s+(\w+)/g)].map((m) => m[1]),
  }
}

const lines = [
  '/* medo Design System — generated from src/components/index.js by',
  '   scripts/build-package.mjs. The per-component declarations next to this file',
  '   are verbatim copies of the contracts in the design project. */',
  '',
]
const gaps = []

for (const { name, exports } of modules) {
  if (WITHOUT_CONTRACT[name]) {
    gaps.push(`${name} (${WITHOUT_CONTRACT[name]})`)
    lines.push(
      `/* ${name}: ${WITHOUT_CONTRACT[name]}. Props are not described. */`,
      `export declare const ${exports.join(', ')}: import('react').FC<Record<string, unknown>>`,
      ''
    )
    continue
  }

  const contract = CONTRACT_ALIASES[name] ?? name
  if (!fs.existsSync(path.join(typesOut, `${contract}.d.ts`))) {
    throw new Error(`No contract file for ${name} — expected src/types/${contract}.d.ts.`)
  }

  const declared = declaredIn(contract)
  const undeclared = exports.filter((entry) => !declared.values.has(entry))
  if (undeclared.length > 0) {
    throw new Error(
      `src/types/${contract}.d.ts does not declare ${undeclared.join(', ')}, which ${name} exports.`
    )
  }

  lines.push(`export { ${exports.join(', ')} } from './${contract}'`)
  if (declared.types.length > 0) {
    lines.push(`export type { ${declared.types.join(', ')} } from './${contract}'`)
  }
}

fs.writeFileSync(path.join(typesOut, 'index.d.ts'), lines.join('\n') + '\n')
/* ── Report ─────────────────────────────────────────────────────────────── */

console.log(`package build: ${fs.readdirSync(out).sort().join(', ')}`)
console.log(`  no portal dependencies in ${javascript.map(({ name }) => name).join(', ')}`)
console.log(`  style entry point complete: ${required.length} stylesheets, ${fontUrls.length} font faces`)
console.log(`  types: ${contracts.length} contracts covering ${modules.length} modules`)
console.log(gaps.length > 0 ? `  without a contract: ${gaps.join(', ')}` : '  every module has a contract')
