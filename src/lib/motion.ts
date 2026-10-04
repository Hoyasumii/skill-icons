/** How long a freshly added icon stays tilted and scaled up before settling. */
export const POP_HOLD_MS = 260;

/** Pops every icon in the stack at once (presets, shuffle). */
export const POP_ALL = '*';

// The tilt cycles by index so neighbours lean different ways. Written out in full so
// Tailwind picks the classes up.
const POPS = [
  'motion-safe:-rotate-12 motion-safe:scale-[1.22]',
  'motion-safe:rotate-9 motion-safe:scale-[1.22]',
  'motion-safe:-rotate-7 motion-safe:scale-[1.22]',
  'motion-safe:rotate-14 motion-safe:scale-[1.22]',
  'motion-safe:-rotate-16 motion-safe:scale-[1.22]',
  'motion-safe:rotate-6 motion-safe:scale-[1.22]',
];

/** Classes for the pop on add: `rotate(θ) scale(1.22)`, θ cycling by index. */
export const popClass = (index: number) => POPS[index % POPS.length];
