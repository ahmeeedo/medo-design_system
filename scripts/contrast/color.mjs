/* Colour maths for the WCAG 2.2 contrast checks.
   Self-contained on purpose: the check must not depend on anything a consumer
   of the design system installs. */

const HEX_SHORT = /^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/i
const HEX_LONG = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i
const RGB_FN = /^rgba?\(([^)]+)\)$/i

/** Parse a CSS colour into { r, g, b, a } with r/g/b in 0..255 and a in 0..1. */
export function parseColor(input) {
  const value = String(input).trim()

  const short = value.match(HEX_SHORT)
  if (short) {
    const [, r, g, b, a] = short
    return {
      r: parseInt(r + r, 16),
      g: parseInt(g + g, 16),
      b: parseInt(b + b, 16),
      a: a === undefined ? 1 : parseInt(a + a, 16) / 255,
    }
  }

  const long = value.match(HEX_LONG)
  if (long) {
    const [, r, g, b, a] = long
    return {
      r: parseInt(r, 16),
      g: parseInt(g, 16),
      b: parseInt(b, 16),
      a: a === undefined ? 1 : parseInt(a, 16) / 255,
    }
  }

  const fn = value.match(RGB_FN)
  if (fn) {
    const parts = fn[1].split(/[,/\s]+/).filter(Boolean)
    const [r, g, b, a] = parts
    return {
      r: channelFromCss(r),
      g: channelFromCss(g),
      b: channelFromCss(b),
      a: a === undefined ? 1 : alphaFromCss(a),
    }
  }

  throw new Error(`Unsupported colour value: ${input}`)
}

function channelFromCss(part) {
  return part.endsWith('%') ? (parseFloat(part) / 100) * 255 : parseFloat(part)
}

function alphaFromCss(part) {
  return part.endsWith('%') ? parseFloat(part) / 100 : parseFloat(part)
}

/** Source-over compositing in sRGB space, the way a browser paints it. */
export function composite(foreground, background) {
  const fg = parseColor(foreground)
  const bg = parseColor(background)
  if (bg.a !== 1) throw new Error('Backgrounds must be opaque before compositing')
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  }
}

/** Flatten a possibly translucent colour onto a background and return hex. */
export function flatten(foreground, background) {
  const { r, g, b } = composite(foreground, background)
  return toHex({ r, g, b })
}

export function toHex({ r, g, b }) {
  const part = (n) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0')
  return `#${part(r)}${part(g)}${part(b)}`
}

function linearize(channel8bit) {
  const c = channel8bit / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/** WCAG 2.2 relative luminance. Translucent colours must be flattened first. */
export function relativeLuminance(color) {
  const { r, g, b, a } = typeof color === 'string' ? parseColor(color) : color
  if (a !== undefined && a !== 1) {
    throw new Error('relativeLuminance needs an opaque colour — composite it first')
  }
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

/**
 * WCAG 2.2 contrast ratio. Both arguments may carry alpha; `over` names the
 * opaque surface they are painted on and is required in that case.
 */
export function contrastRatio(a, b, over = null) {
  const resolve = (color) => {
    const parsed = parseColor(color)
    if (parsed.a === 1) return parsed
    if (!over) throw new Error(`Translucent colour ${color} needs an "over" surface`)
    return composite(color, over)
  }
  const la = relativeLuminance(resolve(a))
  const lb = relativeLuminance(resolve(b))
  const lighter = Math.max(la, lb)
  const darker = Math.min(la, lb)
  return (lighter + 0.05) / (darker + 0.05)
}

export function round2(ratio) {
  return Math.round(ratio * 100) / 100
}
