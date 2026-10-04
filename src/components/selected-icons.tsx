import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';
import { iconSrc } from '@/lib/icons';
import type { Theme } from '../../shared/icons';

interface SelectedIconsProps {
  icons: string[];
  theme: Theme;
  onRemove: (name: string) => void;
  onMove: (from: number, to: number) => void;
  onClear: () => void;
}

export function SelectedIcons({ icons, theme, onRemove, onMove, onClear }: SelectedIconsProps) {
  const { t } = useI18n();

  if (icons.length === 0) {
    return <p className="text-sm text-muted-foreground">{t.selected.empty}</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{t.selected.count(icons.length)}</span>
        <Button variant="ghost" size="sm" onClick={onClear}>
          {t.selected.clearAll}
        </Button>
      </div>
      <ol className="flex flex-wrap gap-2">
        {icons.map((name, index) => (
          <li
            key={name}
            className="flex items-center gap-1 rounded-lg border bg-card py-1 pr-1 pl-1.5 text-sm"
          >
            <img src={iconSrc(name, theme)} alt="" className="size-5" />
            <span className="px-1">{name}</span>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={t.selected.moveLeft(name)}
              disabled={index === 0}
              onClick={() => onMove(index, index - 1)}
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={t.selected.moveRight(name)}
              disabled={index === icons.length - 1}
              onClick={() => onMove(index, index + 1)}
            >
              <ChevronRightIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={t.selected.remove(name)}
              onClick={() => onRemove(name)}
            >
              <XIcon />
            </Button>
          </li>
        ))}
      </ol>
    </div>
  );
}
