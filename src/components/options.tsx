import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useI18n } from '@/i18n';
import { MAX_PER_LINE, MIN_PER_LINE, type Theme } from '../../shared/icons';

interface OptionsProps {
  theme: Theme;
  perLine: number;
  onThemeChange: (theme: Theme) => void;
  onPerLineChange: (perLine: number) => void;
}

export function Options({ theme, perLine, onThemeChange, onPerLineChange }: OptionsProps) {
  const { t } = useI18n();

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label id="theme-label">{t.options.iconTheme}</Label>
        <ToggleGroup
          type="single"
          value={theme}
          onValueChange={value => value && onThemeChange(value as Theme)}
          aria-labelledby="theme-label"
        >
          <ToggleGroupItem value="dark">{t.options.dark}</ToggleGroupItem>
          <ToggleGroupItem value="light">{t.options.light}</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label id="perline-label">{t.options.perLine}</Label>
          <span className="text-sm text-muted-foreground tabular-nums">{perLine}</span>
        </div>
        <Slider
          min={MIN_PER_LINE}
          max={MAX_PER_LINE}
          step={1}
          value={[perLine]}
          onValueChange={([value]) => onPerLineChange(value)}
          aria-labelledby="perline-label"
        />
      </div>
    </div>
  );
}
