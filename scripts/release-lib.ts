// Prepares an automatic release, or validates an explicitly pushed v* tag.
// Usage: bun scripts/release-lib.ts [notes-file]
import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { displayNames } from '../shared/icon-categories';
import {
  changelogEntry,
  extractEntry,
  iconChanges,
  insertEntry,
  latestVersion,
  releaseVersion,
} from './release-notes';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
const PACKAGE = '@hoyasumii/skill-icons';
const PACKAGE_JSON = 'packages/skill-icons/package.json';
const CHANGELOG = 'CHANGELOG.md';
const RELEASE_PATHS = [
  'icons',
  'packages/skill-icons',
  'scripts/build-icons.ts',
  'shared/icon-categories.ts',
  'shared/icons.ts',
  'shared/badge-title.ts',
];
const notesFile = process.argv[2] ?? 'release-notes.md';
const git = (...args: string[]) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const lines = (text: string) => text.split('\n').filter(Boolean);
const tagExists = (tag: string) => Boolean(git('tag', '--list', tag));

function output(values: Record<string, string>) {
  const text = Object.entries(values)
    .map(([k, v]) => `${k}=${v}\n`)
    .join('');
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, text);
  process.stdout.write(text);
}

const res = await fetch(`https://registry.npmjs.org/${PACKAGE.replace('/', '%2f')}`);
if (!res.ok && res.status !== 404) throw new Error(`npm registry answered ${res.status}`);
const data =
  res.status === 404 ? {} : ((await res.json()) as { versions?: Record<string, unknown> });
const published = Object.keys(data.versions ?? {});
const current = JSON.parse(readFileSync(PACKAGE_JSON, 'utf8')).version as string;
const requestedTag = process.env.RELEASE_TAG;
let changelog = existsSync(CHANGELOG) ? readFileSync(CHANGELOG, 'utf8') : '# Changelog\n';
let version: string;

if (requestedTag) {
  if (requestedTag !== `v${current}`) throw new Error('Tag must match the package version');
  version = current;
} else {
  const latest = latestVersion(published);
  const baseTag = latest ? `v${latest}` : undefined;
  if (baseTag && !tagExists(baseTag)) {
    throw new Error(
      `Missing baseline ${baseTag}; fetch the full history and tags before releasing`,
    );
  }
  const changedFiles = baseTag
    ? lines(git('diff', '--name-only', baseTag, 'HEAD', '--', ...RELEASE_PATHS))
    : [];
  const occupied =
    tagExists(`v${current}`) &&
    Boolean(git('diff', '--name-only', `v${current}`, 'HEAD', '--', ...RELEASE_PATHS));
  const planned = releaseVersion(current, published, changedFiles.length > 0, occupied, new Date());
  // Reconcile a GitHub release if npm succeeded but its creation failed.
  version = planned ?? latest!;
  if (planned && !extractEntry(changelog, version)) {
    // A tagged but unpublished release already owns its CHANGELOG history.
    const notesBase = tagExists(`v${current}`) ? `v${current}` : baseTag;
    const noteChanges = notesBase
      ? lines(git('diff', '--name-only', notesBase, 'HEAD', '--', ...RELEASE_PATHS))
      : changedFiles;
    const iconFiles = (ref: string) =>
      lines(git('ls-tree', '-r', '--name-only', ref, '--', 'icons')).filter(f =>
        f.endsWith('.svg'),
      );
    const icons = iconChanges(
      notesBase ? iconFiles(notesBase) : [],
      iconFiles('HEAD'),
      noteChanges.filter(f => f.startsWith('icons/')),
      displayNames,
    );
    const packageChanges = notesBase
      ? lines(
          git(
            'log',
            '--format=%s',
            `${notesBase}..HEAD`,
            '--',
            ...RELEASE_PATHS.filter(p => p !== 'icons'),
          ),
        ).filter(s => !s.startsWith('chore(release)'))
      : [];
    changelog = insertEntry(
      changelog,
      changelogEntry(version, new Date().toISOString().slice(0, 10), icons, packageChanges),
    );
    writeFileSync(CHANGELOG, changelog);
  }
  if (planned) {
    for (const file of ['package.json', PACKAGE_JSON]) {
      const text = readFileSync(file, 'utf8');
      writeFileSync(file, text.replace(/^(\s{2}"version": ")[^"]+"/m, `$1${version}"`));
    }
    const lock = readFileSync('bun.lock', 'utf8');
    const pattern =
      /("packages\/skill-icons": \{\s*"name": "@hoyasumii\/skill-icons",\s*"version": ")[^"]+"/;
    if (!pattern.test(lock)) throw new Error('Missing workspace version in bun.lock');
    writeFileSync('bun.lock', lock.replace(pattern, `$1${version}"`));
  }
}

const notes = extractEntry(changelog, version);
if (!notes) throw new Error(`Missing CHANGELOG entry for ${version}`);
writeFileSync(notesFile, `${notes}\n`);
output({ skip: String(published.includes(version)), version, notes: notesFile });
