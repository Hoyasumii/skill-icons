import { describe, expect, it } from 'vitest';
import iconList from '../generated/icon-list.json';
import { parseStacks } from '../src/lib/saved-stacks';

const names = new Set(iconList.map(icon => icon.name));
const resolve = (name: string) =>
  names.has(name) ? name : name === 'ts' ? 'typescript' : undefined;

describe('parseStacks', () => {
  it('reads valid stacks', () => {
    const raw = JSON.stringify([{ name: 'Work', icons: ['react', 'typescript'] }]);
    expect(parseStacks(raw, resolve)).toEqual([{ name: 'Work', icons: ['react', 'typescript'] }]);
  });

  it.each([null, '', 'not json', '{}', '42'])('returns [] for %j', raw => {
    expect(parseStacks(raw, resolve)).toEqual([]);
  });

  it('skips broken entries', () => {
    const raw = JSON.stringify([
      null,
      'react',
      { name: '', icons: ['react'] },
      { name: 'No icons', icons: 'react' },
      { icons: ['react'] },
      { name: 'Ok', icons: ['react'] },
    ]);
    expect(parseStacks(raw, resolve)).toEqual([{ name: 'Ok', icons: ['react'] }]);
  });

  it('resolves aliases and drops unknown or duplicate ids', () => {
    const raw = JSON.stringify([
      { name: 'Mixed', icons: ['ts', 'typescript', 'gone-icon', 3] },
      { name: 'All gone', icons: ['gone-icon'] },
    ]);
    expect(parseStacks(raw, resolve)).toEqual([{ name: 'Mixed', icons: ['typescript'] }]);
  });

  it('keeps at most 4 stacks and 32 chars per name', () => {
    const raw = JSON.stringify(
      Array.from({ length: 6 }, (_, i) => ({ name: `${i}`.repeat(40), icons: ['react'] })),
    );
    const stacks = parseStacks(raw, resolve);
    expect(stacks).toHaveLength(4);
    expect(stacks[0].name).toHaveLength(32);
  });
});
