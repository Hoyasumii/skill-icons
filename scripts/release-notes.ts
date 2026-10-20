// Pure helpers for scripts/release-lib.ts: CalVer versions and CHANGELOG entries.

export type IconChanges = { added: string[]; changed: string[]; removed: string[] };

/** Icon id of an icons/ file: `icons/Foo-Dark.svg` → `foo`. */
export const iconId = (file: string) =>
  file
    .replace(/^.*\//, '')
    .replace(/\.svg$/, '')
    .replace(/-(Dark|Light)$/, '')
    .toLowerCase();

/** Display base of an icons/ file: `icons/Foo-Dark.svg` → `Foo`. */
const iconBase = (file: string) =>
  file
    .replace(/^.*\//, '')
    .replace(/\.svg$/, '')
    .replace(/-(Dark|Light)$/, '');

const compareVersions = (a: string, b: string) => {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return (pa[i] ?? 0) - (pb[i] ?? 0);
  return 0;
};

/** Highest of the given versions. */
export const latestVersion = (versions: string[]) =>
  versions
    .filter(v => /^\d+\.\d+\.\d+$/.test(v))
    .sort(compareVersions)
    .at(-1);

/**
 * Next CalVer `YY.M.PATCH` after `latest`: bumps the patch inside the same month and
 * starts at `.0` in a new one.
 */
export function nextVersion(latest: string | undefined, date: Date) {
  const year = date.getUTCFullYear() % 100;
  const month = date.getUTCMonth() + 1;
  const [ly, lm, lp] = (latest ?? '').split('.').map(Number);
  if (ly === year && lm === month) return `${year}.${month}.${(lp ?? 0) + 1}`;
  if (latest && (ly > year || (ly === year && lm > month))) return `${ly}.${lm}.${lp + 1}`;
  return `${year}.${month}.0`;
}

/** Chooses an unpublished version, or skips when the published sources are unchanged. */
export function releaseVersion(
  current: string,
  published: string[],
  changed: boolean,
  occupied: boolean,
  date: Date,
) {
  if (!/^\d+\.\d+\.\d+$/.test(current)) throw new Error('Expected YY.M.PATCH version');
  const latest = latestVersion(published);
  if (latest && compareVersions(current, latest) <= 0 && !changed) return undefined;
  if (
    !published.includes(current) &&
    (!latest || compareVersions(current, latest) > 0) &&
    !occupied
  ) {
    return current;
  }
  return nextVersion(latestVersion([current, ...published]), date);
}

/** Icons added, changed and removed between two icons/ file lists. */
export function iconChanges(
  beforeFiles: string[],
  afterFiles: string[],
  changedFiles: string[],
  displayNames: Record<string, string>,
): IconChanges {
  const names = (files: string[]) => {
    const map = new Map<string, string>();
    for (const file of files) {
      const id = iconId(file);
      if (!map.has(id)) map.set(id, displayNames[id] ?? iconBase(file));
    }
    return map;
  };
  const before = names(beforeFiles);
  const after = names(afterFiles);
  const touched = new Set(changedFiles.map(iconId));
  const sort = (list: string[]) => list.sort((a, b) => a.localeCompare(b, 'en'));
  return {
    added: sort([...after].filter(([id]) => !before.has(id)).map(([, n]) => n)),
    changed: sort([...after].filter(([id]) => before.has(id) && touched.has(id)).map(([, n]) => n)),
    removed: sort([...before].filter(([id]) => !after.has(id)).map(([, n]) => n)),
  };
}

/** CHANGELOG section for a release. */
export function changelogEntry(
  version: string,
  date: string,
  icons: IconChanges,
  packageChanges: string[],
) {
  const sections: string[] = [];
  const list = (title: string, items: string[]) => {
    if (items.length) sections.push(`### ${title}\n\n${items.map(i => `- ${i}`).join('\n')}`);
  };
  list('Added icons', icons.added);
  list('Changed icons', icons.changed);
  list('Removed icons', icons.removed);
  list('Package', packageChanges);
  if (!sections.length) sections.push('### Package\n\n- Rebuilt from the current icons.');
  return `## [${version}] - ${date}\n\n${sections.join('\n\n')}\n`;
}

/** Puts `entry` above the newest release in the CHANGELOG. */
export function insertEntry(changelog: string, entry: string) {
  const at = changelog.search(/^## \[/m);
  if (at === -1) return `${changelog.trimEnd()}\n\n${entry}`;
  return `${changelog.slice(0, at)}${entry}\n${changelog.slice(at)}`;
}

/** Body of the CHANGELOG section for `version`, without its heading. */
export function extractEntry(changelog: string, version: string) {
  const start = changelog.indexOf(`## [${version}]`);
  if (start === -1) return undefined;
  const body = changelog.slice(changelog.indexOf('\n', start) + 1);
  const end = body.search(/^## \[|^\[[^\]]+\]: /m);
  return (end === -1 ? body : body.slice(0, end)).trim();
}
