import { useState, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';
import { circleReveal, imagesOnScreen } from '@/lib/circle-reveal';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useI18n();
  // Remounting the icon on each switch replays its spin; the first render stays still.
  const [switches, setSwitches] = useState(0);
  const dark = resolvedTheme === 'dark';

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next = dark ? 'light' : 'dark';
    const apply = async () => {
      flushSync(() => {
        setTheme(next);
        setSwitches(n => n + 1);
      });
      // next-themes applies the class in an effect; the "new" snapshot needs it now.
      document.documentElement.classList.toggle('dark', next === 'dark');
      // The icons swap to the opposite variant with the page.
      await imagesOnScreen();
    };

    // The new theme grows as a circle from the button.
    circleReveal(e.currentTarget, apply);
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
