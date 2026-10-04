import { describe, expect, it } from 'vitest';
import { isStackSelected, toggleStack } from '../src/lib/stack-selection';

const web = ['typescript', 'react', 'vite'];
const backend = ['typescript', 'nodejs', 'docker'];
const stacks = [web, backend];

describe('toggleStack', () => {
  it('appends the missing icons in order', () => {
    expect(toggleStack(['go', 'react'], web, stacks)).toEqual([
      'go',
      'react',
      'typescript',
      'vite',
    ]);
  });

  it('combines several stacks', () => {
    const both = toggleStack(toggleStack([], web, stacks), backend, stacks);
    expect(both).toEqual(['typescript', 'react', 'vite', 'nodejs', 'docker']);
    expect(isStackSelected(web, both) && isStackSelected(backend, both)).toBe(true);
  });

  it('removes a selected stack but keeps icons another selected stack needs', () => {
    const selected = ['go', 'typescript', 'react', 'vite', 'nodejs', 'docker'];
    expect(toggleStack(selected, web, stacks)).toEqual(['go', 'typescript', 'nodejs', 'docker']);
  });

  it('removes shared icons when no other selected stack needs them', () => {
    expect(toggleStack(['typescript', 'react', 'vite', 'nodejs'], web, stacks)).toEqual(['nodejs']);
  });

  it('removes a stack even when a copy of it is also saved', () => {
    expect(toggleStack(web, web, [web, [...web]])).toEqual([]);
  });
});
