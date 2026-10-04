import { describe, expect, it } from 'vitest';
import iconList from '../generated/icon-list.json';
import { PRESETS } from '../src/lib/presets';

describe('PRESETS', () => {
  const names = new Set(iconList.map(icon => icon.name));

  it.each(PRESETS.map(preset => [preset.id, preset.icons] as const))(
    '%s only lists existing icons',
    (_, icons) => {
      expect(icons.filter(name => !names.has(name))).toEqual([]);
    },
  );
});
