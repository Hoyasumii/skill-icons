export interface SavedStack {
  name: string;
  icons: string[];
}

export const SAVED_STACKS_KEY = 'skill-icons:stacks';
export const MAX_SAVED_STACKS = 4;
export const MAX_STACK_NAME = 32;

/**
 * Reads what was stored under `SAVED_STACKS_KEY`, keeping only well-formed entries.
 * Ids go through `resolve`, so renamed icons survive and removed ones are dropped.
 */
export function parseStacks(
  raw: string | null,
  resolve: (name: string) => string | undefined,
): SavedStack[] {
  if (!raw) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];

  return data
    .flatMap((entry): SavedStack[] => {
      if (typeof entry !== 'object' || entry === null) return [];
      const { name, icons } = entry as Record<string, unknown>;
      if (typeof name !== 'string' || !name.trim() || !Array.isArray(icons)) return [];
      const resolved = icons.flatMap(icon =>
        typeof icon === 'string' ? (resolve(icon) ?? []) : [],
      );
      if (!resolved.length) return [];
      return [{ name: name.trim().slice(0, MAX_STACK_NAME), icons: [...new Set(resolved)] }];
    })
    .slice(0, MAX_SAVED_STACKS);
}
