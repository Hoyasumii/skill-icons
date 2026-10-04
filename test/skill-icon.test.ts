import { describe, expect, it } from 'vitest';
import { isHexColor, parseSvg, wrapIcon } from '../scripts/icon-template';

describe('parseSvg', () => {
  it('reads the viewBox and inner content', () => {
    const { viewBox, inner } = parseSvg(
      '<?xml version="1.0"?><!-- logo --><svg viewBox="0 0 24 12" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24"/></svg>',
    );
    expect(viewBox).toBe('0 0 24 12');
    expect(inner).toBe('<path d="M0 0h24"/>');
  });

  it('falls back to width/height', () => {
    expect(parseSvg('<svg width="48px" height="32"><g/></svg>').viewBox).toBe('0 0 48 32');
  });

  it('rejects SVGs without dimensions', () => {
    expect(() => parseSvg('<svg><g/></svg>')).toThrow();
    expect(() => parseSvg('not svg')).toThrow();
  });
});

describe('wrapIcon', () => {
  it('fills the container and centers the logo', () => {
    const svg = wrapIcon('<svg viewBox="0 0 10 10"><circle r="5"/></svg>', '#123456');
    expect(svg).toContain('<rect width="256" height="256" rx="60" fill="#123456"/>');
    expect(svg).toContain('x="28" y="28" width="200" height="200" viewBox="0 0 10 10"');
    expect(svg).toContain('<circle r="5"/>');
  });
});

describe('isHexColor', () => {
  it('accepts hex colors only', () => {
    expect(isHexColor('#fff')).toBe(true);
    expect(isHexColor('#1ED760')).toBe(true);
    expect(isHexColor('red')).toBe(false);
    expect(isHexColor('#12345')).toBe(false);
  });
});
