import { isValidElement, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

// The SlidingIndicator's curves: it settles with a spring and leaves by accelerating away.
const SETTLE = 'cubic-bezier(0.3, 1.35, 0.5, 1)';
const LEAVE = 'cubic-bezier(0.55, 0, 0.75, 0.5)';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** `null` for no child; otherwise the child's key, so a new key reads as a new child. */
const keyOf = (node: ReactNode) =>
  node === null || node === undefined || node === false
    ? null
    : String((isValidElement(node) && node.key) ?? '');

interface Change {
  /** The box's height when the key changed, mid-animation included. */
  from: number;
  /** The previous child, kept on screen while it fades. */
  leaving: ReactNode;
}

/**
 * A slot for one keyed child at a time, e.g. `{open && <Panel key="panel" />}`. When the key
 * changes, the old child fades out over the top while the box springs to the new child's
 * height, and the new child fades in once the box has made room for it.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const entering = useRef<HTMLDivElement>(null);
  const leavingRef = useRef<HTMLDivElement>(null);
  const committed = useRef(children);
  const key = keyOf(children);
  const [shownKey, setShownKey] = useState(key);
  const [change, setChange] = useState<Change | null>(null);

  if (key !== shownKey) {
    setShownKey(key);
    setChange({
      from: box.current?.getBoundingClientRect().height ?? 0,
      leaving: shownKey === null ? null : committed.current,
    });
  }

  useLayoutEffect(() => {
    committed.current = children;
  });

  useLayoutEffect(() => {
    const el = box.current;
    if (!el || !change) return;
    if (reducedMotion()) {
      setChange(null);
      return;
    }

    // The leaving child is out of flow, so this is the new child's height.
    const to = el.getBoundingClientRect().height;
    const grows = to > change.from;
    const animations = [
      el.animate(
        [
          { height: `${change.from}px`, overflow: 'clip' },
          { height: `${to}px`, overflow: 'clip' },
        ],
        { duration: grows ? 420 : 280, easing: grows ? SETTLE : LEAVE },
      ),
    ];
    if (leavingRef.current) {
      animations.push(
        leavingRef.current.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 120,
          easing: 'ease-in',
          fill: 'forwards',
        }),
      );
    }
    if (entering.current) {
      animations.push(
        entering.current.animate(
          [
            { opacity: 0, transform: 'translateY(4px)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 200, delay: 90, easing: 'ease-out', fill: 'backwards' },
        ),
      );
    }

    Promise.all(animations.map(animation => animation.finished)).then(
      () => setChange(null),
      () => {}, // Cancelled by the next change, which takes over.
    );
    return () => {
      for (const animation of animations) animation.cancel();
    };
  }, [change]);

  return (
    <div ref={box} className={cn('relative', className)}>
      {change?.leaving && (
        <div ref={leavingRef} inert className="absolute inset-x-0 top-0">
          {change.leaving}
        </div>
      )}
      {key !== null && <div ref={entering}>{children}</div>}
    </div>
  );
}
