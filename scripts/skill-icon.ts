// CLI: generates icons/<Name>-Dark.svg and -Light.svg (or icons/<Name>.svg with --background),
// registers the icon in shared/icon-categories.ts, and lists the available categories.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineCommand, runMain } from 'citty';
import { categories, categoryById } from '../shared/icon-categories';
import { DARK_BG, DARK_FG, LIGHT_BG, LIGHT_FG, isHexColor, wrapIcon } from './icon-template';

const CATEGORIES_FILE = join(process.cwd(), 'shared/icon-categories.ts');
const categoryNames = Object.keys(categories);

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

/** Adds `id: 1` to the end of a category block in shared/icon-categories.ts. */
function registerIcon(id: string, category: string) {
  const source = readFileSync(CATEGORIES_FILE, 'utf8');
  const start = source.indexOf(`  ${category}: {`);
  if (start === -1) fail(`Category "${category}" not found in ${CATEGORIES_FILE}.`);
  const lineEnd = source.indexOf('\n', start);
  const header = source.slice(start, lineEnd);
  let updated: string;
  if (header.trimEnd().endsWith('},')) {
    // One-line block: `  testing: { a: 1, b: 1 },`
    updated =
      source.slice(0, start) + header.replace(/\s*\},$/, `, ${id}: 1 },`) + source.slice(lineEnd);
  } else {
    // Multi-line block: append to the last entry line before the closing `  },`.
    const close = source.indexOf('\n  },', start);
    updated = `${source.slice(0, close)} ${id}: 1,${source.slice(close)}`;
  }
  writeFileSync(CATEGORIES_FILE, updated);
}

const list = defineCommand({
  meta: { name: 'list', description: 'List the available categories' },
  run() {
    const width = Math.max(...categoryNames.map(c => c.length));
    for (const [category, ids] of Object.entries(categories)) {
      console.log(`${category.padEnd(width)}  ${Object.keys(ids).length} icons`);
    }
  },
});

const category = defineCommand({
  meta: { name: 'category', description: 'Inspect icon categories' },
  subCommands: { list },
});

const generate = defineCommand({
  meta: {
    name: 'generate',
    description: 'Wraps a logo SVG in the standard container and writes it to ./icons/',
  },
  args: {
    name: { type: 'string', required: true, description: 'Icon name, e.g. Spotify' },
    generate: { type: 'string', required: true, description: 'Path to the logo SVG' },
    category: {
      type: 'string',
      required: true,
      description: `Icon category (${categoryNames.join(', ')}); see "skill-icon category list"`,
    },
    background: {
      type: 'string',
      description:
        'Hex background (e.g. #1ED760); writes a single <Name>.svg instead of Dark/Light',
    },
    force: { type: 'boolean', default: false, description: 'Overwrite existing files' },
  },
  run({ args }) {
    const { name, generate: svgPath, category, background, force } = args;
    if (!/^[A-Za-z0-9_.+]+$/.test(name)) {
      fail(
        '--name may only contain letters, digits, "_", "." and "+" ("-" is reserved for themes).',
      );
    }
    if (!categoryNames.includes(category)) {
      fail(`Unknown category "${category}". Available: ${categoryNames.join(', ')}.`);
    }
    const input = resolve(svgPath);
    if (!input.toLowerCase().endsWith('.svg') || !existsSync(input))
      fail(`SVG not found: ${svgPath}`);
    if (background !== undefined && !isHexColor(background)) {
      fail(`--background must be a hex color like #1ED760, got "${background}".`);
    }

    const outDir = join(process.cwd(), 'icons');
    const outputs: [string, string, string][] = background
      ? [[`${name}.svg`, background, DARK_FG]]
      : [
          [`${name}-Dark.svg`, DARK_BG, DARK_FG],
          [`${name}-Light.svg`, LIGHT_BG, LIGHT_FG],
        ];

    const source = readFileSync(input, 'utf8');
    const files = outputs.map(([file, bg, fg]) => {
      try {
        return [join(outDir, file), wrapIcon(source, bg, fg)] as const;
      } catch (e) {
        fail((e as Error).message);
      }
    });

    if (!force) {
      const existing = files.filter(([path]) => existsSync(path));
      if (existing.length)
        fail(`Already exists (use --force): ${existing.map(([p]) => p).join(', ')}`);
    }

    mkdirSync(outDir, { recursive: true });
    for (const [path, svg] of files) {
      writeFileSync(path, svg);
      console.log(`Created ${path}`);
    }

    const id = name.toLowerCase();
    if (!(id in categoryById)) {
      registerIcon(id, category);
      console.log(`Added ${id} to "${category}" in shared/icon-categories.ts`);
    }
  },
});

const main = defineCommand({
  meta: { name: 'skill-icon', description: 'Generate and categorize skill icons' },
  subCommands: { generate, category },
});

runMain(main);
