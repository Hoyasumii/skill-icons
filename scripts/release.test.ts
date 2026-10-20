import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  extractEntry,
  iconChanges,
  latestVersion,
  nextVersion,
  releaseVersion,
} from './release-notes';

const date = new Date('2026-10-20T00:00:00Z');
const dirs: string[] = [];
afterEach(() => dirs.splice(0).forEach(d => rmSync(d, { recursive: true, force: true })));

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'skill-icons-release-'));
  dirs.push(root);
  for (const dir of ['scripts', 'shared', 'icons', 'packages/skill-icons']) {
    mkdirSync(join(root, dir), { recursive: true });
  }
  for (const file of ['release-lib.ts', 'release-notes.ts']) {
    cpSync(resolve('scripts', file), join(root, 'scripts', file));
  }
  const write = (path: string, text: string) => writeFileSync(join(root, path), text);
  const read = (path: string) => readFileSync(join(root, path), 'utf8');
  const git = (...args: string[]) =>
    execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: 'pipe' }).trim();
  git('init', '-b', 'main');
  git('config', 'user.name', 'Release Test');
  git('config', 'user.email', 'release@example.test');
  const commit = () => {
    git('add', '.');
    git('commit', '-m', 'feat(icons): update icons');
  };
  write('shared/icon-categories.ts', "export const displayNames = { foo: 'Foo' };\n");
  for (const file of ['package.json', 'packages/skill-icons/package.json']) {
    write(file, '{\n  "name": "@hoyasumii/skill-icons",\n  "version": "26.10.2"\n}\n');
  }
  write(
    'bun.lock',
    '{"packages/skill-icons": {"name": "@hoyasumii/skill-icons", "version": "26.10.2"}}',
  );
  write('CHANGELOG.md', '# Changelog\n\n## [26.10.2] - 2026-10-20\n\nOriginal cutoff entry.\n');
  write('icons/Foo-Dark.svg', '<svg>old dark</svg>');
  write('icons/Foo-Light.svg', '<svg>old light</svg>');
  commit();
  git('tag', 'v26.10.2');
  const run = (versions = ['26.10.2'], tag = '') => {
    // Intercept only the registry request; all file and Git operations are real.
    write(
      'registry.ts',
      `globalThis.fetch = async () => new Response(JSON.stringify({versions: ${JSON.stringify(Object.fromEntries(versions.map(v => [v, {}])))}}));`,
    );
    return execFileSync(
      'bun',
      ['--preload', './registry.ts', 'scripts/release-lib.ts', join(root, 'notes.md')],
      {
        cwd: root,
        encoding: 'utf8',
        env: { ...process.env, RELEASE_TAG: tag, GITHUB_OUTPUT: join(root, 'output') },
        stdio: 'pipe',
      },
    );
  };
  return { root, write, read, git, commit, run };
}

describe('release planning', () => {
  it('keeps an unpublished version, skips unchanged sources, and bumps published versions', () => {
    expect(releaseVersion('26.10.2', ['0.1.0'], true, false, date)).toBe('26.10.2');
    expect(releaseVersion('26.10.2', ['26.10.2'], false, false, date)).toBeUndefined();
    expect(releaseVersion('26.10.2', ['26.10.2'], true, false, date)).toBe('26.10.3');
    expect(releaseVersion('26.10.2', [], true, true, date)).toBe('26.10.3');
  });
  it('rolls months, ignores prereleases, and never moves a version backward', () => {
    expect(nextVersion('26.9.8', date)).toBe('26.10.0');
    expect(nextVersion('26.12.8', date)).toBe('26.12.9');
    expect(latestVersion(['26.10.2', '26.10.10', '27.0.0-beta.1'])).toBe('26.10.10');
    expect(nextVersion('26.12.8', new Date('2027-01-01Z'))).toBe('27.1.0');
  });
  it('counts themed-to-themeless icons once and distinguishes addition/removal', () => {
    expect(
      iconChanges(
        ['icons/Foo-Dark.svg', 'icons/Foo-Light.svg', 'icons/Gone.svg'],
        ['icons/Foo.svg', 'icons/New.svg'],
        [
          'icons/Foo-Dark.svg',
          'icons/Foo-Light.svg',
          'icons/Foo.svg',
          'icons/Gone.svg',
          'icons/New.svg',
        ],
        { foo: 'Foo Brand' },
      ),
    ).toEqual({ added: ['New'], changed: ['Foo Brand'], removed: ['Gone'] });
  });
});

describe('release script with real Git history', () => {
  it('updates manifests and lockfile, preserves history, and reuses an unpublished retry', () => {
    const f = fixture();
    f.write('icons/Foo-Dark.svg', '<svg>new dark</svg>');
    f.write('icons/Bar.svg', '<svg>new icon</svg>');
    f.commit();
    const first = f.run();
    const version = first.match(/version=(\S+)/)![1];
    expect(first).toContain('skip=false');
    expect(version).not.toBe('26.10.2');
    for (const file of ['package.json', 'packages/skill-icons/package.json']) {
      expect(JSON.parse(f.read(file)).version).toBe(version);
    }
    expect(JSON.parse(f.read('bun.lock'))['packages/skill-icons'].version).toBe(version);
    const changelog = f.read('CHANGELOG.md');
    expect(extractEntry(changelog, version)).toContain('### Changed icons\n\n- Foo');
    expect(extractEntry(changelog, version)).toContain('### Added icons\n\n- Bar');
    expect(extractEntry(changelog, '26.10.2')).toBe('Original cutoff entry.');
    f.commit();
    f.git('tag', `v${version}`);
    expect(f.run()).toContain(`version=${version}`);
    expect(f.read('CHANGELOG.md')).toBe(changelog);
    // npm succeeded: rerun skips upload and still supplies notes for GitHub release recovery.
    expect(f.run(['26.10.2', version])).toContain('skip=true');
  });
  it('keeps the history cutoff when a tagged release has not reached npm', () => {
    const f = fixture();
    f.git('tag', 'v0.1.0');
    f.write('icons/Bar.svg', '<svg>new</svg>');
    f.commit();
    const version = f.run(['0.1.0']).match(/version=(\S+)/)![1];
    const entry = extractEntry(f.read('CHANGELOG.md'), version);
    expect(entry).toContain('- Bar');
    expect(entry).not.toContain('- Foo');
    expect(f.read('CHANGELOG.md')).toContain('Original cutoff entry.');
  });
  it('fails on missing published baseline rather than guessing', () => {
    const f = fixture();
    expect(() => f.run(['26.10.1'])).toThrow();
  });
  it('validates explicit tags and skips versions already published', () => {
    const f = fixture();
    expect(() => f.run([], 'v26.10.1')).toThrow();
    expect(f.run([], 'v26.10.2')).toContain('skip=false');
    expect(f.run(['26.10.2'], 'v26.10.2')).toContain('skip=true');
    expect(f.read('CHANGELOG.md')).toContain('Original cutoff entry.');
  });
});
