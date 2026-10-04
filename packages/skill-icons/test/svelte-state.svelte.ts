/** A reactive props object: assigning to its fields re-renders a mounted component. */
export function reactiveProps<T extends object>(initial: T): T {
  const props = $state(initial);
  return props;
}
