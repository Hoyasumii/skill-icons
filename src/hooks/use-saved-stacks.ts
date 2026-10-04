import { useEffect, useState } from 'react';
import { resolveIconName } from '@/lib/icons';
import {
  MAX_SAVED_STACKS,
  MAX_STACK_NAME,
  parseStacks,
  SAVED_STACKS_KEY,
  type SavedStack,
} from '@/lib/saved-stacks';

export function readStacks(): SavedStack[] {
  try {
    return parseStacks(localStorage.getItem(SAVED_STACKS_KEY), resolveIconName);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies).
    return [];
  }
}

function writeStacks(stacks: SavedStack[]) {
  try {
    localStorage.setItem(SAVED_STACKS_KEY, JSON.stringify(stacks));
  } catch {
    // Not persisted; the stacks still apply for this visit.
  }
}

/** Named stacks kept in this browser (at most `MAX_SAVED_STACKS`), synced across tabs. */
export function useSavedStacks() {
  const [stacks, setStacks] = useState(readStacks);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === SAVED_STACKS_KEY || event.key === null) setStacks(readStacks());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const update = (next: SavedStack[]) => {
    setStacks(next);
    writeStacks(next);
  };

  const full = stacks.length >= MAX_SAVED_STACKS;

  return {
    stacks,
    full,
    save: (name: string, icons: string[]) => {
      const trimmed = name.trim().slice(0, MAX_STACK_NAME);
      if (full || !trimmed || !icons.length) return;
      update([...stacks, { name: trimmed, icons: [...icons] }]);
    },
    remove: (index: number) => update(stacks.filter((_, i) => i !== index)),
    clear: () => update([]),
  };
}
