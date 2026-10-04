import { CheckIcon, CopyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCopy } from '@/hooks/use-copy';
import { useI18n } from '@/i18n';
import { iconSrc } from '@/lib/icons';
import { FRAMEWORKS, INSTALL_COMMAND, type FrameworkId } from '@/lib/snippets';
import { cn } from '@/lib/utils';

interface FrameworkRailProps {
  value: FrameworkId;
  onChange: (framework: FrameworkId) => void;
}

/** Chips that bleed to the panel edge, like the category rail. */
export function FrameworkRail({ value, onChange }: FrameworkRailProps) {
  const { t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t.package.framework}
      className="-mx-4 flex gap-2 overflow-x-auto px-4 py-0.5 scrollbar-none lg:-mx-6 lg:px-6"
    >
      {(Object.keys(FRAMEWORKS) as FrameworkId[]).map(id => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(id)}
            className={cn(
              'inline-flex h-11 shrink-0 items-center gap-2 rounded-full border-2 pr-3.5 pl-2 text-[15px] font-semibold whitespace-nowrap transition-colors',
              active
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-card hover:border-foreground/40',
            )}
          >
            <img src={iconSrc(FRAMEWORKS[id].icon, 'dark')} alt="" className="size-[26px]" />
            {FRAMEWORKS[id].label}
          </button>
        );
      })}
    </div>
  );
}

/** A secondary copy: it never takes the yellow. */
export function InstallRow() {
  const { copied, copy } = useCopy();
  const { t } = useI18n();
  const Icon = copied ? CheckIcon : CopyIcon;

  return (
    <div className="flex items-center gap-2">
      <code className="flex h-11 min-w-0 flex-1 items-center gap-2 overflow-x-auto rounded-lg border bg-muted px-3 font-mono text-[13px] whitespace-nowrap scrollbar-none">
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
        className={cn(copied && 'bg-foreground text-background hover:bg-foreground')}
      >
        <Icon strokeWidth={copied ? 2.6 : 2.2} />
      </Button>
    </div>
  );
}
