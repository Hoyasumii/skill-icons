// Rasterizes the app's images with resvg:
//   bun tools/icon-manager/render.ts icon <out.png>            1024px app icon from the site favicon
//   bun tools/icon-manager/render.ts dmg-background <out.png>  @2x background of the DMG window
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { initWasm, Resvg } from '@resvg/resvg-wasm';

const [kind, out] = process.argv.slice(2);
if (!out || !['icon', 'dmg-background'].includes(kind!))
  throw new Error('Usage: bun tools/icon-manager/render.ts <icon|dmg-background> <out.png>');

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url));
await initWasm(readFileSync(resolve('../../node_modules/@resvg/resvg-wasm/index_bg.wasm')));

// The DMG window is 640×400pt; dmg.sh marks the PNG as 144 dpi so Finder shows it at @2x.
// Icon centers come from dmg.sh: the app at (170, 180), Applications at (470, 180).
const dmgBackground = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 640 400">
  <rect width="640" height="400" fill="#EDEDE8"/>
  <g font-family="Familjen Grotesk" font-weight="700" font-size="22" fill="#111111">
    <text x="32" y="48" letter-spacing="-0.6">skill</text>
    <rect x="76" y="34" width="9" height="9" fill="#FFD21F" stroke="#111111" stroke-width="2" transform="rotate(12 80.5 38.5)"/>
    <text x="91" y="48" letter-spacing="-0.6">icons</text>
  </g>
  <text x="152" y="48" font-family="IBM Plex Mono" font-size="12" fill="#5C5C56">manager</text>
  <g fill="none" stroke="#111111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M262 180 H372"/>
    <path d="M358 166 L374 180 L358 194"/>
  </g>
  <text x="320" y="330" text-anchor="middle" font-family="Familjen Grotesk" font-weight="700" font-size="15" fill="#111111">Drag to Applications to install</text>
  <text x="320" y="352" text-anchor="middle" font-family="IBM Plex Mono" font-size="12" fill="#5C5C56">arraste para Aplicativos para instalar</text>
</svg>`;

const fonts = ['familjen-grotesk-bold', 'ibm-plex-mono-regular', 'ibm-plex-mono-semibold'].map(
  name => new Uint8Array(readFileSync(resolve(`../../worker/fonts/${name}.bin`))),
);
const svg =
  kind === 'icon'
    ? readFileSync(resolve('../../public/skill-icons-favicon.svg'), 'utf8')
    : dmgBackground;
const png = new Resvg(svg, {
  fitTo: kind === 'icon' ? { mode: 'width', value: 1024 } : { mode: 'original' },
  font: { fontBuffers: fonts, loadSystemFonts: false },
})
  .render()
  .asPng();
writeFileSync(out, png);
