/**
 * Figma export – runs INSIDE Figma (Plugin API), not in Node.
 *
 * Exports all local variables, text styles and effect styles of the
 * med.o Design System file into the format of figma/variables.json.
 *
 * How to run (any of these):
 *  - Paste it into a plugin that runs code, e.g. "Scripter", and copy the logged JSON.
 *  - Or run it through the Figma Plugin API from any tool and save the returned object.
 *
 * Afterwards: npm run tokens:from-figma && npm run build:tokens
 */
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const nameById = {};
for (const c of collections) {
  for (const id of c.variableIds) nameById[id] = (await figma.variables.getVariableByIdAsync(id)).name;
}

const hex = (c) =>
  '#' +
  [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('') +
  (c.a !== undefined && c.a < 1 ? Math.round(c.a * 255).toString(16).padStart(2, '0') : '');

const convert = (v, type) => {
  if (v && v.type === 'VARIABLE_ALIAS') return `{${nameById[v.id]}}`;
  if (type === 'COLOR') return hex(v);
  if (v && v.type === 'CUSTOM_CUBIC_BEZIER') {
    const b = v.easingFunctionCubicBezier;
    return [b.x1, b.y1, b.x2, b.y2].map((n) => +n.toFixed(3));
  }
  // Figma springs carry only the bounce; the perceptual duration is its own variable (motion/duration/<name>).
  if (v && v.type === 'CUSTOM_SPRING') return { spring: { bounce: +v.easingFunctionSpring.bounce.toFixed(3) } };
  return typeof v === 'number' ? +v.toFixed(4) : v;
};

const out = {
  source: `Figma file ${figma.fileKey} (med.o Design System)`,
  exportedAt: new Date().toISOString().slice(0, 10),
  note: 'Raw export of Figma variables and styles. Do not edit by hand.',
  collections: {},
  descriptions: {},
  textStyles: [],
  effectStyles: {},
};

for (const c of collections) {
  const vars = {};
  for (const id of c.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(id);
    const values = c.modes.map((m) => convert(v.valuesByMode[m.modeId], v.resolvedType));
    vars[v.name] = values.length === 1 ? values[0] : values;
    if (v.description) out.descriptions[v.name] = v.description;
  }
  out.collections[c.name] = { modes: c.modes.map((m) => m.name), vars };
}

const weight = { Regular: 400, Medium: 500, SemiBold: 600, 'Semi Bold': 600, Bold: 700 };
for (const s of await figma.getLocalTextStylesAsync()) {
  const lh = s.lineHeight.unit === 'PIXELS' ? s.lineHeight.value : s.lineHeight.unit === 'PERCENT' ? `${s.lineHeight.value}%` : '100%';
  const ls = s.letterSpacing.unit === 'PERCENT' ? s.letterSpacing.value : (s.letterSpacing.value / s.fontSize) * 100;
  const transform = s.textCase === 'UPPER' ? 'uppercase' : s.textCase === 'LOWER' ? 'lowercase' : 'none';
  out.textStyles.push([s.name, s.fontName.family, weight[s.fontName.style] ?? 400, s.fontSize, lh, +ls.toFixed(2), transform]);
}

const kind = { DROP_SHADOW: 'drop', INNER_SHADOW: 'inner', BACKGROUND_BLUR: 'background-blur', LAYER_BLUR: 'layer-blur' };
for (const s of await figma.getLocalEffectStylesAsync()) {
  out.effectStyles[s.name] = s.effects.map((e) =>
    e.type.endsWith('BLUR')
      ? { type: kind[e.type], radius: e.radius }
      : {
          type: kind[e.type],
          x: e.offset.x,
          y: e.offset.y,
          blur: e.radius,
          spread: e.spread ?? 0,
          color: e.boundVariables?.color ? nameById[e.boundVariables.color.id] : hex(e.color),
        },
  );
}

// Plugin API environments differ: some read the return value, others the console.
console.log(JSON.stringify(out, null, 2));
return out;
