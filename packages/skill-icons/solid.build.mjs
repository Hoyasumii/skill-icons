// Compiles the preserved JSX that tsc emits to dist/solid into plain JS for non-Solid
// toolchains: index.js (DOM, hydratable) and server.js (SSR). The `solid` export condition
// keeps pointing at index.jsx, for consumers whose own Solid compiler handles it.
import { readFile, writeFile } from 'node:fs/promises';
import { transformAsync } from '@babel/core';
import solid from 'babel-preset-solid';

const dir = new URL('./dist/solid/', import.meta.url);
const source = await readFile(new URL('index.jsx', dir), 'utf8');

for (const [file, generate] of [
  ['index.js', 'dom'],
  ['server.js', 'ssr'],
]) {
  const result = await transformAsync(source, {
    filename: 'index.jsx',
    babelrc: false,
    configFile: false,
    presets: [[solid, { generate, hydratable: true }]],
  });
  await writeFile(new URL(file, dir), `${result.code}\n`);
}
