/** A stack counts as selected when every one of its icons is in the current stack. */
export const isStackSelected = (stack: readonly string[], selected: readonly string[]) =>
  stack.length > 0 && stack.every(name => selected.includes(name));

/**
 * Toggles one stack in or out of the selection. Adding appends the missing icons in order;
 * removing keeps the icons another selected stack (from `stacks`) still needs. A stack holding
 * nothing beyond this one (itself, a copy or a subset) goes along with it.
 */
export function toggleStack(
  selected: readonly string[],
  stack: readonly string[],
  stacks: readonly (readonly string[])[],
): string[] {
  if (!isStackSelected(stack, selected)) {
    return [...selected, ...stack.filter(name => !selected.includes(name))];
  }
  const kept = new Set(
    stacks
      .filter(
        other => other.some(name => !stack.includes(name)) && isStackSelected(other, selected),
      )
      .flat(),
  );
  return selected.filter(name => !stack.includes(name) || kept.has(name));
}
