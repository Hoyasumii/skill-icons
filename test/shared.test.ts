import { describe, expect, it } from 'vitest';
import { buildIconsUrl, shortestName } from '../shared/icons';

describe('shortestName', () => {
  it('prefers the shortest alias', () => {
    expect(shortestName('javascript')).toBe('js');
    expect(shortestName('aws')).toBe('aws');
    expect(shortestName('react')).toBe('react');
  });
});

describe('buildIconsUrl', () => {
  it('omits default options', () => {
    expect(
      buildIconsUrl('https://skillicons.dev', {
        icons: ['javascript'],
        theme: 'dark',
        perLine: 15,
      }),
    ).toBe('https://skillicons.dev/icons?i=js');
  });

  it('includes non-default options', () => {
    expect(buildIconsUrl('', { icons: ['javascript', 'react'], theme: 'light', perLine: 3 })).toBe(
      '/icons?i=js,react&theme=light&perline=3',
    );
  });

  it('includes a trimmed, encoded title', () => {
    expect(buildIconsUrl('', { icons: ['javascript'], title: '  Stack do trabalho & mais ' })).toBe(
      '/icons?i=js&title=Stack%20do%20trabalho%20%26%20mais',
    );
    expect(buildIconsUrl('', { icons: ['javascript'], title: '   ' })).toBe('/icons?i=js');
  });
});
