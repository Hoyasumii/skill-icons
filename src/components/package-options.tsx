import { CheckIcon, CopyIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { RadioGroup } from 'radix-ui';
import { Button } from '@/components/ui/button';
import { useCopy } from '@/hooks/use-copy';
import { useI18n } from '@/i18n';
import { iconSrc } from '@/lib/icons';
import { FRAMEWORKS, INSTALL_COMMAND, type FrameworkId } from '@/lib/snippets';
import { cn } from '@/lib/utils';

interface FrameworkPickerProps {
  value: FrameworkId;
  onChange: (framework: FrameworkId) => void;
}

/** A wrapping grid of radios: nothing in the package tab scrolls sideways. Arrow keys move the pick. */
export function FrameworkPicker({ value, onChange }: FrameworkPickerProps) {
  const { t } = useI18n();
  // The icon takes the variant opposite to the site, so its tile stands out from the page.
  const { resolvedTheme } = useTheme();
  const iconTheme = resolvedTheme === 'dark' ? 'light' : 'dark';

  return (
    <RadioGroup.Root
      value={value}
      onValueChange={id => onChange(id as FrameworkId)}
      aria-label={t.package.framework}
      className="grid grid-cols-[repeat(auto-fill,minmax(108px,1fr))] gap-2"
    >
      {(Object.keys(FRAMEWORKS) as FrameworkId[]).map(id => (
        <RadioGroup.Item
          key={id}
          value={id}
          className={cn(
            'flex h-12 min-w-0 items-center gap-2 rounded-lg border-2 px-2.5 text-[15px] font-semibold transition-colors',
            value === id
              ? 'border-foreground bg-foreground text-background'
              : 'border-border bg-card hover:border-foreground/40',
          )}
        >
          <img src={iconSrc(FRAMEWORKS[id].icon, iconTheme)} alt="" className="size-6 shrink-0" />
          <span className="truncate">{FRAMEWORKS[id].label}</span>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}

/** A secondary copy: it never takes the yellow. */
export function InstallRow() {
  const { copied, copy } = useCopy();
  const { t } = useI18n();
  const Icon = copied ? CheckIcon : CopyIcon;

  return (
    <div className="flex items-start gap-2">
      <code className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-lg border bg-muted px-3 py-2.5 font-mono text-[13px] leading-[19px] [overflow-wrap:anywhere]">
        <span aria-hidden="true" className="text-muted-foreground">
          $
        </span>
        {INSTALL_COMMAND}
      </code>
      <Button
        variant="hairline"
        size="icon"
        aria-label={copied ? t.package.installed : t.package.install}
        onClick={() => copy(INSTALL_COMMAND)}
        className={cn('size-12', copied && 'bg-foreground text-background hover:bg-foreground')}
      >
        <Icon strokeWidth={copied ? 2.6 : 2.2} />
      </Button>
    </div>
  );
}
