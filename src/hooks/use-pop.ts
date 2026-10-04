import { useEffect, useRef, useState } from 'react';
import { POP_ALL, POP_HOLD_MS } from '@/lib/motion';

/** Tracks which icon (or `POP_ALL`) is mid-pop; the animation itself is a CSS transition. */
export function usePop() {
  const [target, setTarget] = useState<string | null>(null);
  const timer = useRef<number>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const pop = (name: string) => {
    window.clearTimeout(timer.current);
    setTarget(name);
    timer.current = window.setTimeout(() => setTarget(null), POP_HOLD_MS);
  };

  /** Pass `includeAll: false` where a whole-stack pop would be noise (the icon grid). */
  const isPopping = (name: string, includeAll = true) =>
    target === name || (includeAll && target === POP_ALL);

  return { pop, isPopping };
}
