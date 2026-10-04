import { describe, expect, it } from 'vitest';
import { cleanTitle, MAX_TITLE_LENGTH } from '../shared/badge-title';

describe('cleanTitle', () => {
  it('trims the title', () => {
    expect(cleanTitle('  Stack do trabalho ')).toBe('Stack do trabalho');
  });

  it('caps it at the max length', () => {
    expect(cleanTitle('x'.repeat(60))).toHaveLength(MAX_TITLE_LENGTH);
  });

  it('treats a missing or blank title as the default', () => {
    expect(cleanTitle(null)).toBeUndefined();
    expect(cleanTitle(undefined)).toBeUndefined();
    expect(cleanTitle('   ')).toBeUndefined();
  });
});
