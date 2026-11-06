#!/usr/bin/env node
// WCAG 2 contrast ratio for two colours: hex (#rgb, #rrggbb) or oklch(L C H) / oklch(L C H / a).
// Usage: node contrast.mjs <foreground> <background> [--over <surface>]
//        node contrast.mjs --oklch <colour>        (print a colour as oklch)
//        node contrast.mjs --max-chroma <L> <H>    (largest in-gamut chroma at that lightness and hue)
// A colour with alpha is composited over --over (default: the background) before measuring.
// Also exported: parse(), ratio(), toHex(). Out-of-gamut oklch is reduced in chroma, keeping L and H.
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function oklchToLinear(L, C, H) {
  const h = (H * Math.PI) / 180, a = C * Math.cos(h), b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s];
}
const inGamut = (rgb) => rgb.every((v) => v >= -1e-6 && v <= 1 + 1e-6);

export function parse(input) {
  const t = input.trim().toLowerCase();
  let m = t.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (m) {
    const h = m[1].length === 3 ? [...m[1]].map((x) => x + x).join("") : m[1];
    return { rgb: [0, 2, 4].map((i) => lin(parseInt(h.slice(i, i + 2), 16) / 255)), a: 1 };
  }
  m = t.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*([\d.]+)(%?))?\s*\)$/);
  if (!m) throw new Error(`Cannot parse "${input}". Use #rrggbb or oklch(L C H).`);
  const L = +m[1] / (m[2] ? 100 : 1);
  let C = +m[3], rgb = oklchToLinear(L, C, +m[4]);
  while (!inGamut(rgb) && C > 0) rgb = oklchToLinear(L, (C = Math.max(0, C - 0.001)), +m[4]);
  const a = m[5] === undefined ? 1 : +m[5] / (m[6] ? 100 : 1);
  return { rgb, a };
}
// Browsers blend in gamma-encoded sRGB, so blend there, then go back to linear.
export function toOklch(rgb) { // linear sRGB -> [L, C, H]
  const [r, g, b] = rgb, l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s, C = Math.hypot(a, bb);
  return [L, C, C < 1e-4 ? 0 : (Math.atan2(bb, a) * 180 / Math.PI + 360) % 360];
}
const over = (top, bottom) => top.rgb.map((v, i) => lin(gam(v) * top.a + gam(bottom.rgb[i]) * (1 - top.a)));
const lum = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
export function ratio(fg, bg, surface = bg) {
  const base = { rgb: over(bg, surface), a: 1 };
  const [hi, lo] = [lum(over(fg, base)), lum(base.rgb)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
export const toHex = (rgb) => "#" + rgb.map((v) => Math.round(Math.min(1, Math.max(0, gam(v))) * 255).toString(16).padStart(2, "0")).join("");

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2), i = args.indexOf("--over");
  if (args[0] === "--max-chroma") { // largest sRGB-safe chroma at a given L and H
    let C = 0; while (inGamut(oklchToLinear(+args[1], C + 0.001, +args[2]))) C += 0.001;
    console.log(C.toFixed(3)); process.exit(0);
  }
  if (args[0] === "--oklch") { const [L, C, H] = toOklch(parse(args[1]).rgb); console.log(`oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})`); process.exit(0); }
  const surface = i > -1 ? args.splice(i, 2)[1] : null;
  if (args.length !== 2) { console.error("Usage: node contrast.mjs <foreground> <background> [--over <surface>]"); process.exit(2); }
  let fg, bg;
  try { [fg, bg] = args.map(parse); } catch (e) { console.error(e.message); process.exit(2); }
  const r = ratio(fg, bg, surface ? parse(surface) : bg);
  const pass = (n) => (r >= n ? "pass" : "FAIL");
  console.log(`${r.toFixed(2)}:1  text 4.5 ${pass(4.5)}  large text / UI 3 ${pass(3)}  AAA 7 ${pass(7)}`);
}
