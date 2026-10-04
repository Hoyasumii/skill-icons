import { useState, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/utils';

const REVEAL = { duration: 620, easing: 'cubic-bezier(0.7, 0, 0.2, 1)' };

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useI18n();
  // Remounting the icon on each switch replays its spin; the first render stays still.
  const [switches, setSwitches] = useState(0);
  const dark = resolvedTheme === 'dark';

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next = dark ? 'light' : 'dark';
    const apply = () => {
      flushSync(() => {
        setTheme(next);
        setSwitches(n => n + 1);
      });
      // next-themes applies the class in an effect; the "new" snapshot needs it now.
      document.documentElement.classList.toggle('dark', next === 'dark');
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduceMotion) {
      apply();
      return;
    }

    // The new theme grows as a circle from the button to the farthest corner.
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    document
      .startViewTransition(apply)
      .ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { ...REVEAL, fill: 'both', pseudoElement: '::view-transition-new(root)' },
        );
      })
      .catch(() => {});
  };

  const Icon = dark ? SunIcon : MoonIcon;

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={dark ? t.header.toLight : t.header.toDark}
      onClick={toggle}
    >
      <Icon
        key={switches}
        className={cn(
          'size-5',
          switches > 0 && 'animate-in duration-[520ms] ease-spring -spin-in-180',
        )}
      />
    </Button>
  );
}
