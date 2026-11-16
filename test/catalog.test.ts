/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest';
import catalog from '../public/icons.json';
import headers from '../public/_headers?raw';

describe('the public /icons.json catalog', () => {
  const byId = new Map(catalog.map(icon => [icon.id, icon]));

  it('lists the aliases /icons accepts for each icon', () => {
    expect(byId.get('typescript')?.aliases).toContain('ts');
    expect(byId.get('javascript')?.aliases).toContain('js');
    expect(byId.get('afora')?.aliases).toEqual([]);
  });

  it('never uses an alias that is also an icon id', () => {
    const aliases = catalog.flatMap(icon => icon.aliases);
    expect(aliases.filter(alias => byId.has(alias))).toEqual([]);
  });

  it('can be read from other origins', () => {
    expect(headers).toMatch(/^\/icons\.json\n\s+Access-Control-Allow-Origin: \*$/m);
  });
});
