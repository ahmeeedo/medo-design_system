#!/usr/bin/env node
/**
 * Converts the raw Figma export (figma/variables.json) into
 * Design Tokens Community Group (DTCG) files in packages/tokens/src.
 *
 * Figma stays the source of truth. Never edit packages/tokens/src by hand:
 * re-export from Figma, then run `npm run tokens:from-figma`.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const raw = JSON.parse(readFileSync(join(root, 'figma/variables.json'), 'utf8'));
const outDir = join(root, 'packages/tokens/src');

const C = raw.collections;
const desc = raw.descriptions ?? {};

/* ---------- helpers ---------- */
const dim = (value, unit = 'px') => ({ value, unit });
const set = (obj, path, token) => {
  const keys = path.split('.');
  let node = obj;
  for (const k of keys.slice(0, -1)) node = node[k] ??= {};
  node[keys.at(-1)] = token;
};
const figmaPath = (name) => name.replaceAll('/', '.');

/** Figma alias "{neutral/900}" → DTCG reference "{color.neutral.900}" */
const colorRef = (v) => {
  const name = v.slice(1, -1);
  return `{color.${figmaPath(name)}}`;
};

/* ---------- colors ---------- */
const primitive = {};
for (const [name, hex] of Object.entries(C['Foundation Colors'].vars)) {
  set(primitive, `color.${figmaPath(name)}`, { $type: 'color', $value: hex });
}

const alias = {};
const scale = Object.keys(C['Foundation Colors'].vars)
  .filter((n) => n.startsWith('slate/'))
  .map((n) => n.split('/')[1]);
for (const [name, value] of Object.entries(C['Alias Colors'].vars)) {
  if (name.endsWith('/*')) {
    // wildcard: "primary/*": "brand" → primary/50 … primary/950
    const group = name.slice(0, -2);
    for (const step of scale) {
      set(alias, `color.${group}.${step}`, { $type: 'color', $value: `{color.${value}.${step}}` });
    }
  } else {
    set(alias, `color.${figmaPath(name)}`, { $type: 'color', $value: colorRef(value) });
  }
}

const semantic = { Light: {}, Dark: {} };
const sem = C['Semantic Colors'];
for (const [name, values] of Object.entries(sem.vars)) {
  sem.modes.forEach((mode, i) => {
    const token = { $type: 'color', $value: colorRef(values[i]) };
    if (desc[name]) token.$description = desc[name];
    set(semantic[mode], `color.${figmaPath(name)}`, token);
  });
}

/* ---------- dimensions ---------- */
const dimensions = {};
const addDims = (collection, prefixMap) => {
  for (const [name, value] of Object.entries(C[collection].vars)) {
    let path = figmaPath(name);
    for (const [from, to] of Object.entries(prefixMap)) if (path.startsWith(from)) path = to + path.slice(from.length);
    set(dimensions, path, { $type: 'dimension', $value: dim(value) });
  }
};
addDims('Foundation Spacing', {});
addDims('Foundation Radius', {});
addDims('Foundation Size', {});
addDims('Foundation Border', { 'border.width': 'border-width' });
addDims('Foundation Breakpoints', {});

/* ---------- typography ---------- */
const typography = {};
const T = C['Foundation Typography'].vars;
const fontTokens = { size: {}, lineHeight: {}, weight: {}, tracking: {} };
for (const [name, value] of Object.entries(T)) {
  const [, kind, key] = name.split('/');
  if (kind === 'family') {
    const fallback = key === 'mono' ? ['ui-monospace', 'monospace'] : ['system-ui', 'sans-serif'];
    set(typography, `font.family.${key}`, { $type: 'fontFamily', $value: [value, ...fallback] });
  } else if (kind === 'size') {
    set(typography, `font.size.${key}`, { $type: 'dimension', $value: dim(value) });
    fontTokens.size[value] = `{font.size.${key}}`;
  } else if (kind === 'line-height') {
    set(typography, `font.line-height.${key}`, { $type: 'dimension', $value: dim(value) });
  } else if (kind === 'weight') {
    set(typography, `font.weight.${key}`, { $type: 'fontWeight', $value: value });
    fontTokens.weight[value] = `{font.weight.${key}}`;
  } else if (kind === 'tracking') {
    // Figma stores letter spacing in percent of the font size → em
    set(typography, `font.tracking.${key}`, { $type: 'dimension', $value: dim(value / 100, 'em') });
    fontTokens.tracking[value] = `{font.tracking.${key}}`;
  }
}
const families = { 'DM Sans': '{font.family.sans}', 'DM Mono': '{font.family.mono}' };
for (const [name, family, weight, size, lineHeight, tracking, transform] of raw.textStyles) {
  const lh = typeof lineHeight === 'number' ? +(lineHeight / size).toFixed(4) : parseFloat(lineHeight) / 100;
  const token = {
    $type: 'typography',
    $value: {
      fontFamily: families[family],
      fontSize: fontTokens.size[size] ?? dim(size),
      fontWeight: fontTokens.weight[weight] ?? weight,
      lineHeight: lh,
      letterSpacing: fontTokens.tracking[tracking] ?? dim(tracking / 100, 'em'),
    },
  };
  if (transform && transform !== 'none') token.$extensions = { 'com.medo': { textTransform: transform } };
  set(typography, `typography.${figmaPath(name)}`, token);
}

/* ---------- motion, layer, opacity ---------- */
const motion = {};
const motionVars = C['Foundation Motion'].vars;
/**
 * A Figma spring (bounce) plus its perceptual duration (motion/duration/<name>) as a CSS linear() curve – the SwiftUI
 * model: stiffness (2π / duration)², damping ratio 1 − bounce. Returns the curve and the settle time (|1 − x| < 0.2 %).
 */
function springToCss(bounce, duration) {
  const w0 = (2 * Math.PI) / duration;
  const zeta = 1 - bounce;
  const x = (t) => {
    if (zeta >= 1) return 1 - (1 + w0 * t) * Math.exp(-w0 * t);
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t));
  };
  let settle = 0;
  for (let t = 0; t < 5; t += 0.005) {
    let still = true;
    for (let u = t; u < t + 0.5; u += 0.01) if (Math.abs(1 - x(u)) > 0.002) { still = false; break; }
    if (still) { settle = t; break; }
  }
  const steps = 40;
  const points = Array.from({ length: steps + 1 }, (_, i) => (i === steps ? 1 : +x((i / steps) * settle).toFixed(4)));
  return { curve: `linear(${points.join(', ')})`, ms: Math.round((settle * 1000) / 10) * 10 };
}
for (const [name, value] of Object.entries(motionVars)) {
  const path = figmaPath(name);
  const description = desc[name] ? { $description: desc[name] } : {};
  if (Array.isArray(value)) set(motion, path, { $type: 'cubicBezier', $value: value, ...description });
  else if (value && typeof value === 'object' && value.spring) {
    const key = name.split('/').pop();
    const perceptual = motionVars[`motion/duration/${key}`];
    const { curve, ms } = springToCss(value.spring.bounce, perceptual);
    // Not a DTCG type: the curve is a CSS easing string; the spring parameters stay in $extensions.
    set(motion, path, { $type: 'string', $value: curve, $extensions: { 'com.medo': { spring: { bounce: value.spring.bounce, duration: perceptual } } }, ...description });
    set(motion, `${path}-duration`, { $type: 'duration', $value: { value: ms, unit: 'ms' }, $description: `Settle time of ${name.replace('motion/', '')} – use it as transition-duration with the curve.` });
  } else set(motion, path, { $type: 'duration', $value: { value: Math.round(value * 1000), unit: 'ms' }, ...description });
}
const layer = {};
for (const [name, value] of Object.entries(C['Foundation Layer'].vars)) set(layer, figmaPath(name), { $type: 'number', $value: value, $description: 'z-index' });
const opacity = {};
for (const [name, value] of Object.entries(C['Foundation Opacity'].vars)) set(opacity, figmaPath(name), { $type: 'number', $value: value / 100 });

/* ---------- effects ---------- */
const effects = {};
for (const [name, list] of Object.entries(raw.effectStyles)) {
  const path = figmaPath(name);
  if (list[0].type === 'background-blur' || list[0].type === 'layer-blur') {
    set(effects, `blur.${path.split('.').at(-1)}`, {
      $type: 'dimension',
      $value: dim(list[0].radius),
      $description: list[0].type === 'background-blur' ? 'backdrop-filter: blur()' : 'filter: blur()',
    });
    continue;
  }
  // Rings (blur 0): the smaller spread must be on top, CSS paints the first shadow on top.
  const ordered = list.every((e) => e.blur === 0) ? [...list].sort((a, b) => a.spread - b.spread) : list;
  set(effects, `shadow.${path}`, {
    $type: 'shadow',
    $value: ordered.map((e) => ({
      color: `{color.${figmaPath(e.color)}}`,
      offsetX: dim(e.x),
      offsetY: dim(e.y),
      blur: dim(e.blur),
      spread: dim(e.spread),
      ...(e.type === 'inner' ? { inset: true } : {}),
    })),
  });
}

/* ---------- layout (responsive modes) ---------- */
const layout = {};
const L = C['Layout'];
L.modes.forEach((mode, i) => {
  layout[mode] = {};
  for (const [name, values] of Object.entries(L.vars)) {
    const v = values[i];
    const isCount = name.endsWith('columns');
    // Spacing rules (layout/gap/*) are aliases: "{space/4}" → "{space.4}", "{layout/gutter}" → "{layout.gutter}".
    const value = typeof v === 'string' ? `{${figmaPath(v.slice(1, -1))}}` : isCount ? v : dim(v);
    const description = desc[name] ? { $description: desc[name] } : {};
    set(layout[mode], figmaPath(name), { $type: isCount ? 'number' : 'dimension', $value: value, ...description });
  }
});

/* ---------- write ---------- */
rmSync(outDir, { recursive: true, force: true });
const write = (file, data) => {
  const p = join(outDir, file);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
  console.log('  ✓', file);
};
console.log('Writing DTCG tokens to packages/tokens/src');
write('color/primitive.json', primitive);
write('color/alias.json', alias);
write('color/light.json', semantic.Light);
write('color/dark.json', semantic.Dark);
write('dimension.json', dimensions);
write('typography.json', typography);
write('motion.json', motion);
write('layer.json', layer);
write('opacity.json', opacity);
write('effect.json', effects);
write('layout/mobile.json', layout.Mobile);
write('layout/tablet.json', layout.Tablet);
write('layout/desktop.json', layout.Desktop);
